import {AppConfig} from "@infrastructure/config/app.config";

/**
 * Niveles de log disponibles
 */
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}

/**
 * Clase de utilidad para logging
 */
export class Logger {
  private static instance: Logger;
  private readonly logLevel: LogLevel;

  /**
   * Constructor privado para implementación del patrón Singleton.
   * Inicializa el nivel de log según el entorno de ejecución
   */
  private constructor() {
    this.logLevel = AppConfig.isProduction() ?
      LogLevel.INFO :
      LogLevel.DEBUG;
  }

  /**
     * Obtiene la instancia del logger (Singleton)
     * @return {Logger} La instancia única del logger
     */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  /**
     * Log de nivel info
     * @param {string} message - El mensaje a registrar
     * @param {...any[]} args - Argumentos adicionales para el mensaje
     */
  public info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }
  /**
     * Log de nivel error
     * @param {string} message - El mensaje a registrar
     * @param {...any[]} args - Argumentos adicionales para el mensaje
     */
  public error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, ...args);
  }

  /**
     * Método principal de logging
     * @param {LogLevel} level - El nivel de log a aplicar
     * @param {string} message - El mensaje a registrar
     * @param {...any[]} args - Argumentos adicionales para el mensaje
     */
  private log(level: LogLevel, message: string, ...args: any[]): void {
    if (level < this.logLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = this.getLevelPrefix(level);

    const formattedMessage = `[${timestamp}] ${prefix} ${message}`;

    switch (level) {
    case LogLevel.DEBUG:
      console.debug(formattedMessage, ...args);
      break;
    case LogLevel.INFO:
      console.info(formattedMessage, ...args);
      break;
    case LogLevel.WARN:
      console.warn(formattedMessage, ...args);
      break;
    case LogLevel.ERROR:
      console.error(formattedMessage, ...args);
      break;
    }
  }

  /**
     * Obtiene el prefijo según el nivel de log
     * @param {LogLevel} level - El nivel de log a verificar
     * @return {string} El prefijo correspondiente al nivel de log
     */
  private getLevelPrefix(level: LogLevel): string {
    switch (level) {
    case LogLevel.DEBUG:
      return "[DEBUG]";
    case LogLevel.INFO:
      return "[INFO]";
    case LogLevel.WARN:
      return "[WARN]";
    case LogLevel.ERROR:
      return "[ERROR]";
    default:
      return "";
    }
  }
}
export const logger = Logger.getInstance();
