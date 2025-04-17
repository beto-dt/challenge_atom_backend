import {User} from "@domain/entities/user.entity";
import {UserRepository} from
  "@application/interfaces/repositories/user.repository";
import {CreateUserDto} from "@application/dtos/user.dto";

/**
 * Caso de uso para crear un nuevo usuario
 */
export class CreateUserUseCase {
  /**
   * Constructor para CreateUserUseCase
   * @param {UserRepository} userRepository Repositorio de usuarios a utilizar
   */
  constructor(private userRepository: UserRepository) {}

  /**
   * Ejecuta el caso de uso
   * @param {CreateUserDto} userData Datos para crear el usuario (email)
   * @return {Promise<User>} Promesa con el usuario creado
   * @throws Error si el email ya está en uso o es inválido
   */
  async execute(userData: CreateUserDto): Promise<User> {
    const {email} = userData;

    this.validateEmail(email);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error(`El email ${email} ya está en uso`);
    }

    const newUser: User = {
      email,
      createdAt: new Date(),
    };

    return this.userRepository.create(newUser);
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
}
