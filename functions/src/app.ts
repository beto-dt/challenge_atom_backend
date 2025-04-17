import cors from "cors";
import express from "express";
import {AppConfig} from "@infrastructure/config/app.config";
import {
  notFoundMiddleware,
  errorHandlerMiddleware,
} from "@infrastructure/middlewares/error-handler.middleware";
import helmet from "helmet";
import {firebaseConfig} from "@infrastructure/config/firebase.config";
import {logger} from "@shared/utils/logger";
import {routes} from "./routes";

/**
 * Crea y configura la aplicación Express
 * @return {express.Application} Instancia configurada de Express
 */
export const createApp = (): express.Application => {
  try {
    firebaseConfig.initialize();
  } catch (error) {
    logger.error("Error al inicializar Firebase:", error);
  }

  const app = express();

  app.use(helmet());
  app.use(cors({origin: true}));
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  app.get("/health", (req, res) => {
    res.status(200).json({status: "OK"});
  });

  app.use((
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      logger.info(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
      );
    });

    next();
  });

  app.use(AppConfig.server.apiPrefix, routes);

  app.use(notFoundMiddleware);

  app.use(errorHandlerMiddleware);

  return app;
};
