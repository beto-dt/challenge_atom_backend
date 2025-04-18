import {Request, Response, NextFunction} from "express";
import {
  validationResult,
  ValidationChain,
  ValidationError,
} from "express-validator";
import {createHttpError} from "./error-handler.middleware";

/**
 * Interfaz para representar un error de validación formateado
 */
export interface FormattedValidationError {
  field: string;
  message: string;
}

/**
 * Interfaz para extender el error HTTP con errores de validación
 */
export interface ValidationHttpError {
  statusCode: number;
  code: string;
  message: string;
  validationErrors: FormattedValidationError[];
}

/**
 * Middleware que ejecuta las validaciones y maneja los errores
 * @param {ValidationChain[]} validations Array de reglas de validación
 * @return {Function} Función middleware de Express que maneja la validación
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction):
      Promise<void> => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors: FormattedValidationError[] =
        errors.array().map((error: ValidationError) => ({
          field: error.type === "field" ? error.path : error.type,
          message: error.msg,
        }));

    const error =createHttpError(
      "Error de validación",
      400,
      "VALIDATION_ERROR"
    ) as unknown as ValidationHttpError;

    error.validationErrors = formattedErrors;

    // Responder con el error formateado
    res.status(400).json({
      status: "error",
      code: "VALIDATION_ERROR",
      message: "Error de validación",
      errors: formattedErrors,
    });
  };
};

/**
 * Esquemas de validación reutilizables
 * Estos esquemas se basan en tus DTOs existentes
 */
export const ValidationSchemas = {
  /**
   * Validación para creación de tareas basada en CreateTaskDto
   */
  createTask: [],

  /**
   * Validación para actualización de tareas basada en UpdateTaskDto
   */
  updateTask: [],

  /**
   * Validación para creación de usuarios basada en CreateUserDto
   */
  createUser: [],
};
