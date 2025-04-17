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
   * Creates an instance of AuthenticationMiddleware
   * @param {FindUserUseCase} findUserUseCase Use case for finding users
   */
  constructor(private findUserUseCase: FindUserUseCase) {}

  /**
   * Creates an authentication middleware function
   * @param {boolean} required Whether authentication is required
   * @return {Function} Express middleware function that handles authentication
   */
  authenticate(required = true) {
    return async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const userId = req.headers["user-id"] as string;
        if (!userId) {
          if (required) {
            return res.status(401).json({
              message: "Autenticación requerida",
            });
          } else {
            return next();
          }
        }

        const user = await this.findUserById(userId);

        if (!user) {
          return res.status(401).json({
            message: "Usuario no encontrado",
          });
        }

        req.user = {
          id: user.id as string,
          email: user.email,
        };

        next();
      } catch (error: any) {
        console.error("Error en autenticación:", error);
        return res.status(500).json({
          message: "Error de autenticación",
        });
      }
    };
  }

  /**
     * Método auxiliar para buscar un usuario por ID (simplificado)
     * En una implementación real, usaríamos el caso de uso correspondiente
     * @param {string} userId ID del usuario a buscar
     * @return {Promise<User | null>} Usuario encontrado o null si no existe
     */
  private async findUserById(userId: string): Promise<User | null> {
    const user = await this.findUserUseCase.findById(userId);
    if (!user) {
      return null;
    }
    return user;
  }
}

/**
 * Crea una instancia del middleware de autenticación
 * Esta función facilita el uso del middleware en las rutas
 * @param {FindUserUseCase} findUserUseCase Use case for finding users
 * @return {Object} An object containing required and optional authentication
 *                  middleware functions
 */
export const createAuthMiddleware = (
  findUserUseCase: FindUserUseCase
) => {
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
