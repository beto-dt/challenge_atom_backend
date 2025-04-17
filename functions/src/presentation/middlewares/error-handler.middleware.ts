import {Request, Response, NextFunction} from "express";
import {TaskNotFoundException} from
  "@domain/exceptions/task-not-found.exception";
import {UserNotFoundException} from
  "@domain/exceptions/user-not-found.exception";
import {AppConfig} from "@infrastructure/config/app.config";

/**
 * Interfaz para errores con código HTTP
 */
interface HttpError extends Error {
  statusCode?: number;
  code?: string;
}

/**
 * Middleware para manejar errores de forma centralizada
 * La firma correcta de un middleware de error DEBE tener 4 parámetros
 * @param {HttpError} err Error a manejar
 * @param {Request} req Objeto de solicitud Express
 * @param {Response} res Objeto de respuesta Express
 * @param {NextFunction} next Función para pasar al siguiente middleware
 */
export const errorHandlerMiddleware = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction // Este parámetro es necesario aunque no se use
) => {
  // Registrar el error
  console.error("Error:", err);

  let statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";
  let errorCode = err.code || "INTERNAL_ERROR";

  if (err instanceof TaskNotFoundException) {
    statusCode = 404;
    errorCode = "TASK_NOT_FOUND";
  } else if (err instanceof UserNotFoundException) {
    statusCode = 404;
    errorCode = "USER_NOT_FOUND";
  } else if (err.message.includes("permiso")) {
    // Mensajes relacionados con permisos
    statusCode = 403;
    errorCode = "FORBIDDEN";
  } else if (
    err.message.includes("requerido") ||
      err.message.includes("inválido")
  ) {
    statusCode = 400;
    errorCode = "VALIDATION_ERROR";
  }

  const errorResponse = {
    status: "error",
    code: errorCode,
    message: message,
  };

  if (!AppConfig.isProduction()) {
    (errorResponse as any).stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Middleware para manejar rutas no encontradas
 * @param {Request} req Objeto de solicitud Express
 * @param {Response} res Objeto de respuesta Express
 * @param {NextFunction} next Función para pasar al siguiente middleware
 */
export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(404).json({
    status: "error",
    code: "NOT_FOUND",
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Función para crear un error con código de estado
 * @param {string} message Mensaje de error
 * @param {number} statusCode Código de estado HTTP
 * @param {string} [code] Código de error opcional
 * @return {HttpError} Error HTTP personalizado
 */
export const createHttpError = (
  message: string,
  statusCode: number,
  code?: string
): HttpError => {
  const error = new Error(message) as HttpError;
  error.statusCode = statusCode;
  if (code) {
    error.code = code;
  }
  return error;
};
