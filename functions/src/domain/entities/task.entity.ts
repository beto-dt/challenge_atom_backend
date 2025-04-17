/**
 * Entidad que representa una tarea en el dominio de la aplicación
 */
export interface Task {
  id?: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}
