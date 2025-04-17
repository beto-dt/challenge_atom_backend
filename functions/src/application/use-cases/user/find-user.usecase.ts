import {User} from "@domain/entities/user.entity";
import {UserRepository} from
  "@application/interfaces/repositories/user.repository";

/**
 * Caso de uso para buscar usuarios
 */
export class FindUserUseCase {
  /**
   * Constructor del caso de uso
   * @param {UserRepository} userRepository Repositorio de usuarios a utilizar
   */
  constructor(private userRepository: UserRepository) {}

  /**
   * Busca un usuario por su email
   * @param {string} email Email del usuario a buscar
   * @return {Promise<User | null>} Promesa con el usuario o null si no existe
   */
  async findByEmail(email: string): Promise<User | null> {
    this.validateEmail(email);

    return this.userRepository.findByEmail(email);
  }

  /**
   * Busca un usuario por su ID
   * @param {string} id ID del usuario a buscar
   * @return {Promise<User | null>} Promesa con el usuario o null si no existe
   */
  async findById(id: string): Promise<User | null> {
    if (!id || id.trim() === "") {
      throw new Error("El ID de usuario es requerido");
    }

    return this.userRepository.findById(id);
  }


  /**
   * Valida que el formato del email sea correcto
   * @param {string} email Email a validar
   * @throws Error si el email es inválido
   */
  private validateEmail(email: string): void {
    if (!email || email.trim() === "") {
      throw new Error("El email es requerido");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Formato de email inválido");
    }
  }

  /**
   * Método principal de ejecución para mantener consistencia con otros casos
   * @param {string} email Email del usuario a buscar
   * @return {Promise<User | null>} Promesa con el usuario o null si no existe
   */
  async execute(email: string): Promise<User | null> {
    return this.findByEmail(email);
  }
}
