import {Request, Response, NextFunction} from "express";
import {
  validationResult,
  ValidationChain,
  ValidationError,
} from "express-validator";
import {createHttpError} from
  "@infrastructure/middlewares/error-handler.middleware";

/**
 * Middleware que ejecuta las validaciones y maneja los errores
 * @param {ValidationChain[]} validations Array de reglas de validación
 * @return {Function} Express middleware function that handles validation
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map((error: ValidationError) => ({
      field: error.type,
      message: error.msg,
    }));


    const error = createHttpError(
      "Error de validación",
      400,
      "VALIDATION_ERROR"
    );


    (error as any).validationErrors = formattedErrors;

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
 */
export const ValidationSchemas = {
  /**
     * Validación para creación de tareas
     */
  createTask: [],

  /**
     * Validación para actualización de tareas
     */
  updateTask: [],

  /**
     * Validación para creación de usuarios
     */
  createUser: [],
};
