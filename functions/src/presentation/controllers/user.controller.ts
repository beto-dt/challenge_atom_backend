import {Request, Response} from "express";
import {FindUserUseCase} from "@application/use-cases/user/find-user.usecase";
import {CreateUserUseCase} from
  "@application/use-cases/user/create-user.usecase";
import {toUserResponseDto} from "@application/dtos/user.dto";
import {UserNotFoundException} from
  "@domain/exceptions/user-not-found.exception";

/**
 * Interfaz para errores de aplicación
 */
interface ApplicationError extends Error {
  code?: string;
  statusCode?: number;
}

/**
 * Controlador para endpoints relacionados con usuarios
 */
export class UserController {
  /**
   * Constructor del UserController
   * @param {FindUserUseCase} findUserUseCase Caso de uso para buscar usuarios
   * @param {CreateUserUseCase} createUserUseCase
   * Caso de uso para crear usuarios
   */
  constructor(
      private readonly findUserUseCase: FindUserUseCase,
      private readonly createUserUseCase: CreateUserUseCase
  ) {}

  /**
   * Busca un usuario por su email
   * @route GET /users/:email
   * @param {Request} req Request object containing the email parameter
   * @param {Response} res Response object used to send the result
   * @return {Promise<void>} Promise that resolves when the response is sent
   */
  async findUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email;

      if (!email) {
        res.status(400).json({message: "El email es requerido"});
        return;
      }

      const user = await this.findUserUseCase.execute(email);

      if (!user) {
        res.status(404).json({message: "Usuario no encontrado"});
        return;
      }

      res.status(200).json(toUserResponseDto(user));
    } catch (error: unknown) {
      console.error("Error buscando usuario:", error);

      if (error instanceof UserNotFoundException) {
        res.status(404).json({message: error.message});
        return;
      }

      const errorMessage =
          error instanceof Error ?
            error.message : "Error interno buscando usuario";
      res.status(500).json({message: errorMessage});
    }
  }

  /**
   * Crea un nuevo usuario
   * @route POST /users
   * @param {Request} req Request object containing the user data in body
   * @param {Response} res Response object used to send the result
   * @return {Promise<void>} Promise that resolves when the response is sent
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const {email} = req.body;

      if (!email) {
        res.status(400).json({message: "El email es requerido"});
        return;
      }

      if (!this.isValidEmail(email)) {
        res.status(400).json({message: "Formato de email inválido"});
        return;
      }

      const existingUser = await this.findUserUseCase.execute(email);

      if (existingUser) {
        res.status(409).json(
          {message: `El usuario con email ${email} ya existe`});
        return;
      }

      const user = await this.createUserUseCase.execute({email});

      res.status(201).json(toUserResponseDto(user));
    } catch (error: unknown) {
      console.error("Error creando usuario:", error);

      const statusCode = this.getErrorStatusCode(error);
      const errorMessage =
          error instanceof Error ?
            error.message : "Error interno creando usuario";

      res.status(statusCode).json({message: errorMessage});
    }
  }

  /**
   * Valida si un email tiene formato correcto
   * @param {string} email Email a validar
   * @return {boolean} true si el email es válido, false en caso contrario
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Determina el código de estado HTTP basado en el tipo de error
   * @param {unknown} error Error a analizar
   * @return {number} Código de estado HTTP
   */
  private getErrorStatusCode(error: unknown): number {
    if (error instanceof UserNotFoundException) {
      return 404;
    }

    if (
      error instanceof Error &&
        typeof (error as ApplicationError).statusCode === "number"
    ) {
      return (error as ApplicationError).statusCode!;
    }

    if (
      error instanceof Error &&
        (error.message.includes("inválido") ||
            error.message.includes("requerido"))
    ) {
      return 400;
    }

    return 500;
  }
}
