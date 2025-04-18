import {Request, Response} from "express";
import {CreateTaskUseCase} from
  "@application/use-cases/task/create-task.usecase";
import {GetTasksUseCase} from "@application/use-cases/task/get-tasks.usecase";
import {UpdateTaskUseCase} from
  "@application/use-cases/task/update-task.usecase";
import {DeleteTaskUseCase} from
  "@application/use-cases/task/delete-task.usecase";
import {toTaskResponseDto} from "@application/dtos/task.dto";
import {TaskNotFoundException} from
  "@domain/exceptions/task-not-found.exception";
/**
 * Controlador para endpoints relacionados con tareas
 */
export class TaskController {
  /**
   * Constructor de TaskController
   * @param {CreateTaskUseCase} createTaskUseCase -
   *Caso de uso para crear tareas
   * @param {GetTasksUseCase} getTasksUseCase - Caso de uso para obtener tareas
   * @param {UpdateTaskUseCase} updateTaskUseCase -
   * Caso de uso para actualizar tareas
   * @param {DeleteTaskUseCase} deleteTaskUseCase -
   * Caso de uso para eliminar tareas
   */
  constructor(
      private readonly createTaskUseCase: CreateTaskUseCase,
      private readonly getTasksUseCase: GetTasksUseCase,
      private readonly updateTaskUseCase: UpdateTaskUseCase,
      private readonly deleteTaskUseCase: DeleteTaskUseCase
  ) {}

  /**
   * Obtiene todas las tareas de un usuario
   * @route GET /tasks
   * @param {Request} req - La solicitud HTTP
   * @param {Response} res - La respuesta HTTP
   */
  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        res.status(400).json({message: "El parámetro userId es requerido"});
        return;
      }

      const tasks = await this.getTasksUseCase.execute(userId);
      const taskResponses = tasks.map((task) => toTaskResponseDto(task));

      res.status(200).json(taskResponses);
    } catch (error: unknown) {
      console.error("Error obteniendo tareas:", error);
      const errorMessage =
          error instanceof Error ? error.message : "Error interno del servidor";
      res.status(500).json({message: errorMessage});
    }
  }

  /**
   * Obtiene una tarea por su ID
   * @route GET /tasks/:id
   * @param {Request} req - La solicitud HTTP
   * @param {Response} res - La respuesta HTTP
   */
  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.id;
      const userId = req.query.userId as string;

      const task =
          await this.getTasksUseCase.executeGetByIdWithAuth(taskId, userId);

      if (!task) {
        res.status(404).json(
          {message: `Tarea con ID ${taskId} no encontrada`});
        return;
      }

      res.status(200).json(toTaskResponseDto(task));
    } catch (error: unknown) {
      console.error("Error obteniendo tarea:", error);

      if (error instanceof TaskNotFoundException) {
        res.status(404).json({message: error.message});
        return;
      }

      if (error instanceof Error) {
        const isPermissionError =
            error.message === "No tienes permiso para acceder a esta tarea";
        res.status(isPermissionError ? 403 : 500).json({
          message: error.message || "Error interno del servidor",
        });
      } else {
        res.status(500).json({message: "Error interno del servidor"});
      }
    }
  }

  /**
   * Crea una nueva tarea
   * @route POST /tasks
   * @param {Request} req - La solicitud HTTP
   * @param {Response} res - La respuesta HTTP
   */
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const {userId, title, description} = req.body;

      if (!userId || !title || !description) {
        res.status(400).json({
          message: "userId, title y description son campos requeridos",
        });
        return;
      }

      const task = await this.createTaskUseCase.execute({
        userId,
        title,
        description,
      });

      res.status(201).json(toTaskResponseDto(task));
    } catch (error: unknown) {
      console.error("Error creando tarea:", error);
      const errorMessage =
          error instanceof Error ? error.message : "Error creando la tarea";
      res.status(400).json({message: errorMessage});
    }
  }

  /**
   * Actualiza una tarea existente
   * @route PUT /tasks/:id
   * @param {Request} req - La solicitud HTTP
   * que contiene los datos de actualización
   * @param {Response} res - La respuesta HTTP
   */
  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.id;
      const userId = req.body.userId;
      const {title, description, completed} = req.body;

      const updateData: Record<string, unknown> = {
        ...(title !== undefined && {title}),
        ...(description !== undefined && {description}),
        ...(completed !== undefined && {completed}),
      };

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          message: "No se proporcionaron campos para actualizar",
        });
        return;
      }

      const updatedTask = await this.updateTaskUseCase.executeWithAuth(
        taskId,
        userId,
        updateData
      );

      res.status(200).json(toTaskResponseDto(updatedTask));
    } catch (error: unknown) {
      console.error("Error actualizando tarea:", error);

      if (error instanceof TaskNotFoundException) {
        res.status(404).json({message: error.message});
        return;
      }

      if (error instanceof Error) {
        const isPermissionError =
            error.message === "No tienes permiso para actualizar esta tarea";
        const status = isPermissionError ? 403 : 400;
        res.status(status).json({
          message: error.message || "Error actualizando la tarea",
        });
      } else {
        res.status(400).json({message: "Error actualizando la tarea"});
      }
    }
  }

  /**
   * Elimina una tarea
   * @route DELETE /tasks/:id
   * @param {Request} req - La solicitud HTTP
   * @param {Response} res - La respuesta HTTP
   */
  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.id;
      const userId = req.query.userId as string;

      await this.deleteTaskUseCase.executeWithAuth(taskId, userId);

      res.status(204).send();
    } catch (error: unknown) {
      console.error("Error eliminando tarea:", error);

      if (error instanceof TaskNotFoundException) {
        res.status(404).json({message: error.message});
        return;
      }

      if (error instanceof Error) {
        const status =
            error.message === "No tienes permiso para eliminar esta tarea" ?
              403 : 500;
        res.status(status).json({
          message: error.message || "Error eliminando la tarea",
        });
      } else {
        res.status(500).json({message: "Error eliminando la tarea"});
      }
    }
  }
}
