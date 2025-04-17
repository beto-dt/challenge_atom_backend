import {UserRepository} from
  "@application/interfaces/repositories/user.repository";
import {User} from "@domain/entities/user.entity";
import {usersCollection} from "../database/firestore.config";

/**
 * Implementación de UserRepository para Firestore
 */
export class FirestoreUserRepository implements UserRepository {
  /**
   * Busca un usuario por su email
   * @param {string} email Email del usuario
   * @return {Promise<User | null>} Promise con el usuario o null si no existe
   */
  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await usersCollection()
      .where("email", "==", email.toLowerCase().trim())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return this.mapToUser(snapshot.docs[0]);
  }

  /**
     * Obtiene un usuario por su ID
     * @param {string} id ID del usuario
     * @return {Promise<User | null>} Promise con el usuario o null si no existe
     */
  async findById(id: string): Promise<User | null> {
    const doc = await usersCollection().doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return this.mapToUser(doc);
  }

  /**
     * Crea un nuevo usuario
     * @param {User} user Datos del usuario a crear
     * @return {Promise<User>} Promise con el usuario creado (incluyendo ID)
     */
  async create(user: User): Promise<User> {
    const normalizedEmail = user.email.toLowerCase().trim();

    const existingUser = await this.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new Error(`Ya existe un usuario con el email ${normalizedEmail}`);
    }

    const userId = user.id || usersCollection().doc().id;

    const userData = {
      email: normalizedEmail,
      createdAt: user.createdAt || new Date(),
    };

    await usersCollection().doc(userId).set(userData);

    return {
      id: userId,
      email: normalizedEmail,
      createdAt: userData.createdAt,
    };
  }

  /**
     * Convierte un documento de Firestore a una entidad User
     * @param {FirebaseFirestore.DocumentSnapshot} doc Documento de Firestore
     * @return {User} Entidad User
     */
  private mapToUser(doc: FirebaseFirestore.DocumentSnapshot): User {
    const data = doc.data() as FirebaseFirestore.DocumentData;

    return {
      id: doc.id,
      email: data.email,
      createdAt: data.createdAt.toDate(),
    };
  }
}
