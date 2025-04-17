import "module-alias/register";

import * as functions from "firebase-functions";
import {createApp} from "./app";
import {AppConfig} from "@infrastructure/config/app.config";
import {logger} from "@shared/utils/logger";

const app = createApp();

export const api = functions.https.onRequest({
  region: "us-central1",
  timeoutSeconds: 60,
  maxInstances: 80,
}, app);

if (process.env.NODE_ENV !== "production" && require.main === module) {
  const port = Number(process.env.PORT) || AppConfig.server.port || 8080;

  app.listen(port, () => {
    logger.info(`Servidor iniciado en http://localhost:${port}${AppConfig.server.apiPrefix}`);
    logger.info(`Entorno: "${AppConfig.environment}"`);
  });
}
