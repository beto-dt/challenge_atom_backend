import {Task} from "@domain/entities/task.entity";
import {TaskRepository} from
  "@application/interfaces/repositories/task.repository";
import {UpdateTaskDto} from "@application/dtos/task.dto";


/**
 * Caso de uso para actualizar una tarea existente
 */
export class UpdateTaskUseCase {
  /**
   * Crea una nueva instancia del caso de uso de actualización de tareas
   * @param {TaskRepository} taskRepository Repositorio de tareas a utilizar
   */
  constructor(private taskRepository: TaskRepository) {}

  /**
   * Actualiza una tarea verificando que el usuario sea el propietario
   * @param {string} taskId ID de la tarea a actualizar
   * @param {string} userId ID del usuario que solicita la actualización
   * @param {UpdateTaskDto} taskData Datos parciales para actualizar la tarea
   * @return {Promise<Task>} Promesa con la tarea actualizada
   * @throws Error si la tarea no existe, no pertenece al usuario o los datos
   *               inválidos
   */
  async executeWithAuth(
    taskId: string,
    userId: string,
    taskData: UpdateTaskDto
  ): Promise<Task> {
    const existingTask = await this.taskRepository.findById(taskId);

    if (!existingTask) {
      throw new Error(`La tarea con ID ${taskId} no existe`);
    }

    if (existingTask.userId !== userId) {
      throw new Error("No tienes permiso para actualizar esta tarea");
    }


    this.validateUpdateData(taskData);

    return this.taskRepository.update(taskId, taskData);
  }

  /**
   * Válida los datos de actualización
   * @param {UpdateTaskDto} taskData Datos a validar
   * @throws Error si la validación falla
   * @return {void}
   */
  private validateUpdateData(taskData: UpdateTaskDto): void {
    if (taskData.title !== undefined) {
      if (taskData.title.trim() === "") {
        throw new Error("El título no puede estar vacío");
      }

      if (taskData.title.length > 100) {
        throw new Error("El título no puede exceder los 100 caracteres");
      }
    }


    if (taskData.description !== undefined) {
      if (taskData.description.trim() === "") {
        throw new Error("La descripción no puede estar vacía");
      }

      if (taskData.description.length > 500) {
        throw new Error("La descripción no puede exceder los 500 caracteres");
      }
    }
  }
}
