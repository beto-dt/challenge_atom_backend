import {TaskRepository} from
  "@application/interfaces/repositories/task.repository";

/**
 * Caso de uso para eliminar una tarea existente
 */
export class DeleteTaskUseCase {
  /**
   * Constructor para DeleteTaskUseCase
   * @param {TaskRepository} taskRepository Repositorio de tareas a utilizar
   */
  constructor(private taskRepository: TaskRepository) {}

  /**
   * Versión que valida que el usuario sea propietario de la tarea
   * @param {string} taskId ID de la tarea a eliminar
   * @param {string} userId ID del usuario que solicita la eliminación
   * @throws Error si la tarea no existe o el usuario no es propietario
   */
  async executeWithAuth(taskId: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new Error(`La tarea con ID ${taskId} no existe`);
    }


    if (task.userId !== userId) {
      throw new Error("No tienes permiso para eliminar esta tarea");
    }


    await this.taskRepository.delete(taskId);
  }
}
