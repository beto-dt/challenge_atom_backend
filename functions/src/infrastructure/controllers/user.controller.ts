import {Request, Response} from "express";
import {FindUserUseCase} from "@application/use-cases/user/find-user.usecase";
import {CreateUserUseCase} from
  "@application/use-cases/user/create-user.usecase";
import {toUserResponseDto} from "@application/dtos/user.dto";
import {UserNotFoundException} from
  "@domain/exceptions/user-not-found.exception";


/**
 * Controlador para endpoints relacionados con usuarios
 */
export class UserController {
  /**
   * Constructor del UserController
   * @param {FindUserUseCase} findUserUseCase Caso de uso para buscar usuarios
   * @param {CreateUserUseCase} createUserUseCase
   */
  constructor(
        private findUserUseCase: FindUserUseCase,
        private createUserUseCase: CreateUserUseCase
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
    } catch (error: any) {
      console.error("Error buscando usuario:", error);

      if (error instanceof UserNotFoundException) {
        res.status(404).json({message: error.message});
        return;
      }

      const errorMsg = error.message || "Error buscando usuario";
      res.status(400).json({message: errorMsg});
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

      const existingUser = await this.findUserUseCase.execute(email);

      if (existingUser) {
        const errorMsg = `El usuario con email ${email} ya existe`.trim();
        res.status(409).json({message: errorMsg});
        return;
      }

      const user = await this.createUserUseCase.execute({email});

      res.status(201).json(toUserResponseDto(user));
    } catch (error: any) {
      console.error("Error creando usuario:", error);
      res.status(400).json({message: error.message || "Error creando usuario"});
    }
  }
}
