import {AppConfig} from "@infrastructure/config/app.config";

/**
 * Niveles de log disponibles
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

/**
 * Tipo para los datos que se pueden pasar al logger
 */
export type LogData =
    | string
    | number
    | boolean
    | Error
    | null
    | undefined
    | Record<string, unknown>
    | LogData[];

/**
 * Interfaz de configuración del logger
 */
export interface LoggerConfig {
  level: LogLevel;
  enableTimestamp: boolean;
  timestampFormat?: "ISO" | "LOCALE";
  outputTarget?: "console" | "custom";
  customLogHandler?:
      (level: LogLevel, message: string, args: LogData[]) => void;
}

/**
 * Clase de utilidad para logging en la aplicación
 */
export class Logger {
  private static instance: Logger;
  private config: LoggerConfig;

  /**
   * Constructor privado para implementación del patrón Singleton.
   * Inicializa el nivel de log según el entorno de ejecución
   */
  private constructor() {
    this.config = {
      level: AppConfig.isProduction() ? LogLevel.INFO : LogLevel.DEBUG,
      enableTimestamp: true,
      timestampFormat: "ISO",
    };
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
   * Configura el logger
   * @param {Partial<LoggerConfig>} config - Objeto de configuración parcial
   * @return {Logger} La instancia del logger para encadenamiento de métodos
   */
  public configure(config: Partial<LoggerConfig>): Logger {
    this.config = {...this.config, ...config};
    return this;
  }

  /**
   * Log de nivel debug
   * @param {string} message - Mensaje a registrar
   * @param {...LogData[]} args - Argumentos adicionales para el mensaje
   */
  public debug(message: string, ...args: LogData[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  /**
   * Log de nivel info
   * @param {string} message - Mensaje a registrar
   * @param {...LogData[]} args - Argumentos adicionales para el mensaje
   */
  public info(message: string, ...args: LogData[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  /**
   * Log de nivel advertencia
   * @param {string} message - Mensaje a registrar
   * @param {...LogData[]} args - Argumentos adicionales para el mensaje
   */
  public warn(message: string, ...args: LogData[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  /**
   * Log de nivel error
   * @param {string} message - Mensaje a registrar
   * @param {...LogData[]} args - Argumentos adicionales para el mensaje
   */
  public error(message: string, ...args: LogData[]): void {
    this.log(LogLevel.ERROR, message, ...args);
  }

  /**
   * Método principal de logging
   * @param {LogLevel} level - Nivel de log a aplicar
   * @param {string} message - Mensaje a registrar
   * @param {...LogData[]} args - Argumentos adicionales para el mensaje
   */
  private log(level: LogLevel, message: string, ...args: LogData[]): void {
    if (level < this.config.level) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message);

    if (this.config.outputTarget === "custom" && this.config.customLogHandler) {
      this.config.customLogHandler(level, formattedMessage, args);
      return;
    }

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
   * Formatea el mensaje de log según la configuración
   * @param {LogLevel} level - Nivel de log
   * @param {string} message - Mensaje original
   * @return {string} Mensaje formateado
   */
  private formatMessage(level: LogLevel, message: string): string {
    const parts: string[] = [];

    if (this.config.enableTimestamp) {
      const timestamp = this.getTimestamp();
      parts.push(`[${timestamp}]`);
    }

    parts.push(this.getLevelPrefix(level));
    parts.push(message);

    return parts.join(" ");
  }

  /**
   * Obtiene la marca de tiempo según la configuración
   * @return {string} Marca de tiempo formateada
   */
  private getTimestamp(): string {
    const date = new Date();

    if (this.config.timestampFormat === "LOCALE") {
      return date.toLocaleString();
    }

    return date.toISOString();
  }

  /**
   * Obtiene el prefijo según el nivel de log
   * @param {LogLevel} level - Nivel de log a verificar
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

