/**
 * Excepción que se lanza cuando una tarea no se encuentra
 */
export class TaskNotFoundException extends Error {
  /**
   * Constructor
   * @param {string} taskId ID de la tarea que no se encontró
   */
  constructor(public readonly taskId: string) {
    super(`La tarea con ID ${taskId} no fue encontrada`);
    this.name = "TaskNotFoundException";
    Object.setPrototypeOf(this, TaskNotFoundException.prototype);
  }
}
