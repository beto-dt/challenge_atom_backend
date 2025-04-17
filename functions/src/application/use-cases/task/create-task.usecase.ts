
import {Task} from "@domain/entities/task.entity";
import {TaskRepository} from
  "@application/interfaces/repositories/task.repository";
import {CreateTaskDto} from "@application/dtos/task.dto";

/**
 * Caso de uso para crear una nueva tarea
 */
export class CreateTaskUseCase {
  /**
   * Constructor de CreateTaskUseCase
   * @param {TaskRepository} taskRepository Repositorio de tareas a utilizar
   */
  constructor(private taskRepository: TaskRepository) {}

  /**
   * Ejecuta el caso de uso
   * @param {CreateTaskDto} taskData Datos para crear la tarea
   * @return {Promise<Task>} Promesa con la tarea creada
   */
  async execute(taskData: CreateTaskDto): Promise<Task> {
    const newTask: Task = {
      userId: taskData.userId,
      title: taskData.title,
      description: taskData.description,
      completed: false,
      createdAt: new Date(),
    };

    this.validateTask(newTask);

    return this.taskRepository.create(newTask);
  }

  /**
   * Válida los datos de la tarea
   * @param {Task} task Tarea a validar
   * @throws Error si la validación falla
   */
  private validateTask(task: Task): void {
    if (!task.userId) {
      throw new Error("El ID de usuario es requerido");
    }

    if (!task.title || task.title.trim() === "") {
      throw new Error("El título es requerido");
    }

    if (task.title.length > 100) {
      throw new Error("El título no puede exceder los 100 caracteres");
    }

    if (!task.description || task.description.trim() === "") {
      throw new Error("La descripción es requerida");
    }

    if (task.description.length > 500) {
      throw new Error("La descripción no puede exceder los 500 caracteres");
    }
  }
}
