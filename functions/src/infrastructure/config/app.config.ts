import * as dotenv from "dotenv";

dotenv.config();

/**
 * Configuración de la aplicación basada en variables de entorno
 */
export const AppConfig = {
  environment: process.env.NODE_ENV || "development",
  server: {
    port: parseInt(process.env.PORT || "8080", 10),
    apiPrefix: process.env.API_PREFIX || "/api",
  },
  security: {
    tokenExpirationTime: parseInt(
      process.env.TOKEN_EXPIRATION_TIME ||
        "86400", 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || "info",
    file: process.env.LOG_FILE || "app.log",
  },
  firebase: {
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    projectId: process.env.FIREBASE_PROJECT_ID,
  },
  firestore: {
    collections: {
      users: "users",
      tasks: "tasks",
    },
  },
  constants: {
    paginationLimit: parseInt(process.env.PAGINATION_LIMIT || "10", 10),
    maxTitleLength: 100,
    maxDescriptionLength: 500,
  },
  isProduction(): boolean {
    return this.environment === "production";
  },
};
