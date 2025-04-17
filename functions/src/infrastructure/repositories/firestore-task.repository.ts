import {TaskRepository} from
  "@application/interfaces/repositories/task.repository";
import {Task} from "@domain/entities/task.entity";
import {TaskNotFoundException}
  from "@domain/exceptions/task-not-found.exception";
import {tasksCollection} from "@infrastructure/database/firestore.config";

/**
 * Implementación de TaskRepository para Firestore
 */
export class FirestoreTaskRepository implements TaskRepository {
  /**
     * Obtiene todas las tareas de un usuario
     * @param {string} userId ID del usuario propietario
     * @return {Promise<Task[]>} Promise con array de tareas
     */
  async findAll(userId: string): Promise<Task[]> {
    const snapshot = await tasksCollection()
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => this.mapToTask(doc));
  }

  /**
     * Obtiene una tarea por su ID
     * @param {string} id ID de la tarea
     * @return {Promise<Task | null>} Promise con la tarea o null si no existe
     */
  async findById(id: string): Promise<Task | null> {
    const doc = await tasksCollection().doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return this.mapToTask(doc);
  }

  /**
     * Crea una nueva tarea
     * @param {Task} task Datos de la tarea a crear
     * @return {Promise<Task>} Promise con la tarea creada (incluyendo ID)
     */
  async create(task: Task): Promise<Task> {
    const taskId = task.id || tasksCollection().doc().id;
    const {...taskData} = {
      ...task,
      id: taskId,
      createdAt: task.createdAt || new Date(),
    };

    await tasksCollection().doc(taskId).set(taskData);

    return {
      ...task,
      id: taskId,
    };
  }

  /**
     * Actualiza una tarea existente
     * @param {string} id ID de la tarea a actualizar
     * @param {Partial<Task>} taskData Datos parciales para actualizar
     * @return {Promise<Task>} Promise con la tarea actualizada
     * @throws {TaskNotFoundException} si la tarea no existe
     */
  async update(id: string, taskData: Partial<Task>): Promise<Task> {
    const taskDoc = await tasksCollection().doc(id).get();


    if (!taskDoc.exists) {
      throw new TaskNotFoundException(id);
    }

    const updateData = {...taskData};


    delete updateData.id;
    delete updateData.userId;
    delete updateData.createdAt;

    await tasksCollection().doc(id).update(updateData);

    const updatedTaskDoc = await tasksCollection().doc(id).get();
    return this.mapToTask(updatedTaskDoc);
  }

  /**
     * Elimina una tarea
     * @param {string} id ID de la tarea a eliminar
     * @throws {TaskNotFoundException} si la tarea no existe
     */
  async delete(id: string): Promise<void> {
    const taskDoc = await tasksCollection().doc(id).get();

    if (!taskDoc.exists) {
      throw new TaskNotFoundException(id);
    }

    await tasksCollection().doc(id).delete();
  }

  /**
     * Convierte un documento de Firestore a una entidad Task
     * @param {FirebaseFirestore.DocumentSnapshot} doc Documento de Firestore
     * @return {Task} Entidad Task
     */
  private mapToTask(doc: FirebaseFirestore.DocumentSnapshot): Task {
    const data = doc.data() as FirebaseFirestore.DocumentData;

    return {
      id: doc.id,
      userId: data.userId,
      title: data.title,
      description: data.description,
      completed: data.completed,
      createdAt: data.createdAt.toDate(),
    };
  }
}
