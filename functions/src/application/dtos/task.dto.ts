/**
 * DTO para crear una nueva tarea
 */
export interface CreateTaskDto {
    userId: string;
    title: string;
    description: string;
}

/**
 * DTO para actualizar una tarea existente
 */
export interface UpdateTaskDto {
    title?: string;
    description?: string;
    completed?: boolean;
}

/**
 * DTO para representar una tarea en las respuestas
 */
export interface TaskResponseDto {
    id: string;
    userId: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
}

/**
 * Converts a Task entity to TaskResponseDto
 * @param {Object} task The task entity to convert
 * @param {string=} task.id Optional task identifier
 * @param {string} task.userId User identifier associated with the task
 * @param {string} task.title Task title
 * @param {string} task.description Task description
 * @param {boolean} task.completed Task completion status
 * @param {Date} task.createdAt Task creation date
 * @return {TaskResponseDto} The converted task response object
 */
export function toTaskResponseDto(task: {
    id?: string;
    userId: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
}): TaskResponseDto {
  return {
    id: task.id || "",
    userId: task.userId,
    title: task.title,
    description: task.description,
    completed: task.completed,
    createdAt: task.createdAt.toISOString(),
  };
}
