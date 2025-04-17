import {Task} from "@domain/entities/task.entity";
export interface TaskRepository {
    /**
     * Obtiene todas las tareas de un usuario específico
     * @param userId ID del usuario propietario de las tareas
     * @returns Promesa con array de tareas
     */
    findAll(userId: string): Promise<Task[]>;

    /**
     * Obtiene una tarea por su ID
     * @param id ID de la tarea
     * @returns Promesa con la tarea o null si no existe
     */
    findById(id: string): Promise<Task | null>;

    /**
     * Crea una nueva tarea
     * @param task Datos de la tarea a crear
     * @returns Promesa con la tarea creada (incluyendo ID generado)
     */
    create(task: Task): Promise<Task>;

    /**
     * Actualiza una tarea existente
     * @param id ID de la tarea a actualizar
     * @param taskData Datos parciales o completos para actualizar
     * @returns Promesa con la tarea actualizada
     */
    update(id: string, taskData: Partial<Task>): Promise<Task>;

    /**
     * Elimina una tarea
     * @param id ID de la tarea a eliminar
     * @returns Promesa que completa cuando la tarea se elimina
     */
    delete(id: string): Promise<void>;
}
