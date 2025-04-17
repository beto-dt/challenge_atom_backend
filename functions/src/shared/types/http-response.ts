/**
 * Tipos de estado de respuesta HTTP
 */
export type ResponseStatus = "success" | "error" | "warning" | "info";

/**
 * Interfaz base para respuestas HTTP estandarizadas
 */
export interface HttpResponse {
    status: ResponseStatus;
    message?: string;
    code?: string;
}

/**
 * Respuesta HTTP exitosa con datos
 */
export interface SuccessResponse<T> extends HttpResponse {
    status: "success";
    data: T;
    meta?: {
        total?: number;
        page?: number;
        limit?: number;
    };
}

/**
 * Respuesta HTTP de error
 */
export interface ErrorResponse extends HttpResponse {
    status: "error";
    message: string;
    code: string;
    errors?: Array<{
        field?: string;
        message: string;
        code?: string;
    }>;
}

/**
 * Funciones de utilidad para crear respuestas HTTP estandarizadas
 */
export const HttpResponseUtil = {
  success<T>(
    data: T,
    message?: string,
    meta?: SuccessResponse<T>["meta"]
  ): SuccessResponse<T> {
    return {
      status: "success",
      message,
      data,
      meta,
    };
  },
  error(
    message: string,
    code = "UNKNOWN_ERROR",
    errors?: ErrorResponse["errors"]
  ): ErrorResponse {
    return {
      status: "error",
      message,
      code,
      errors,
    };
  },
};
