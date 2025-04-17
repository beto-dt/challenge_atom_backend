import {Task} from "@domain/entities/task.entity";
import {TaskRepository} from
  "@application/interfaces/repositories/task.repository";


/**
 * Caso de uso para obtener tareas
 */
export class GetTasksUseCase {
  /**
   * Constructor de GetTasksUseCase
   * @param {TaskRepository} taskRepository Repositorio de tareas a utilizar
   */
  constructor(private taskRepository: TaskRepository) {}

  /**
   * Obtiene todas las tareas de un usuario específico
   * @param {string} userId ID del usuario propietario de las tareas
   * @return {Promise<Task[]>} Promesa con array de tareas
   */
  async execute(userId: string): Promise<Task[]> {
    if (!userId) {
      throw new Error("El ID de usuario es requerido");
    }

    return this.taskRepository.findAll(userId);
  }

  /**
   * Obtiene una tarea específica por su ID verificando que pertenezca al
   * usuario
   * @param {string} taskId ID de la tarea
   * @param {string} userId ID del usuario
   * @return {Promise<Task | null>} Promesa con la tarea o null si no existe
   * @throws Error si la tarea no pertenece al usuario
   */
  async executeGetByIdWithAuth(
    taskId: string,
    userId: string
  ): Promise<Task | null> {
    if (!taskId || !userId) {
      throw new Error("Se requieren los IDs de tarea y usuario");
    }

    const task = await this.taskRepository.findById(taskId);

    if (task && task.userId !== userId) {
      throw new Error("No tienes permiso para acceder a esta tarea");
    }

    return task;
  }
}
