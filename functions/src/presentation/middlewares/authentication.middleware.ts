import {Request, Response, NextFunction} from "express";
import {FindUserUseCase} from "@application/use-cases/user/find-user.usecase";
import {User} from "@domain/entities/user.entity";

/**
 * Interfaz para extender Request con información de usuario
 */
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}
/**
 * Middleware para verificar y procesar la autenticación
 */
export class AuthenticationMiddleware {
  /**
   * Crea una instancia de AuthenticationMiddleware
   * @param {FindUserUseCase} findUserUseCase Caso de uso para buscar usuarios
   */
  constructor(private readonly findUserUseCase: FindUserUseCase) {}

  /**
   * Crea una función middleware de autenticación
   * @param {boolean} required Indica si la autenticación es obligatoria
   * @return {Function} Función middleware
   * de Express que maneja la autenticación
   */
  authenticate(required = true) {
    const boundMiddleware = async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const userId = req.headers["user-id"] as string;
        if (!userId) {
          if (required) {
            res.status(401).json({
              message: "Autenticación requerida",
            });
            return;
          } else {
            next();
            return;
          }
        }

        const user = await this.findUserById(userId);

        if (!user) {
          res.status(401).json({
            message: "Usuario no encontrado",
          });
          return;
        }

        req.user = {
          id: user.id as string,
          email: user.email,
        };

        next();
      } catch (error: unknown) {
        console.error("Error en autenticación:", error);

        const errorMessage = error instanceof Error ?
          error.message :
          "Error desconocido de autenticación";

        res.status(500).json({
          message: "Error de autenticación",
          details: errorMessage,
        });
      }
    };

    return boundMiddleware.bind(this);
  }

  /**
   * Método auxiliar para buscar un usuario por ID
   * @param {string} userId ID del usuario a buscar
   * @return {Promise<User | null>} Usuario encontrado o null si no existe
   */
  private async findUserById(userId: string): Promise<User | null> {
    try {
      const user = await this.findUserUseCase.findById(userId);
      return user || null;
    } catch (error) {
      console.error(`Error al buscar usuario con ID ${userId}:`, error);
      return null;
    }
  }
}

/**
 * Tipo para los middlewares de autenticación
 */
export interface AuthMiddlewares {
  required: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  optional: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

/**
 * Crea una instancia del middleware de autenticación
 * @param {FindUserUseCase} findUserUseCase Caso de uso para buscar usuarios
 * @return {AuthMiddlewares} Objeto con funciones middleware de autenticación
 */
export const createAuthMiddleware = (
  findUserUseCase: FindUserUseCase
): AuthMiddlewares => {
  const middleware = new AuthenticationMiddleware(findUserUseCase);

  return {
    /**
     * Middleware que requiere autenticación
     */
    required: middleware.authenticate(true),

    /**
     * Middleware que hace la autenticación opcional
     */
    optional: middleware.authenticate(false),
  };
};
