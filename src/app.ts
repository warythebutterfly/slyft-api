/**
 * Require External Modules
 */
import express from "express";
import cors from "cors";
import routes from "./routes";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logging from "./library/Logging";
import swaggerUi from "swagger-ui-express";
import { docs } from "./docs/index";
import { WebSocketConnection } from "./controllers/notificationController";

/**
 * App Variables
 */
const app = express();

/**
 * Database Connection
 */

mongoose
  .connect(config.mongo.url)
  .then((res) => {
    Logging.info(`Mongo DB Connected: ${res.connection.host}`);
    startServer();
  })
  .catch((error) => {
    Logging.error(`${error.message} ${config.mongo.url}`);
    process.exit(1);
  });

const startServer = () => {
  /**
   * App Configuration
   */
  app.use(cors({ origin: "*" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use((req, res, next) => {
    /** Log the Request */
    Logging.info(
      `Incoming -> Method: [${req.method}] - Url: [${req.url} - IP [${req.socket.remoteAddress}]]`
    );

    res.on("finish", () => {
      /** Log the Response */
      Logging.info(
        `Incoming -> Method: [${req.method}] - Url: [${req.url} - IP [${req.socket.remoteAddress}] - Status; [${res.statusCode}]]`
      );
    });

    next();
  });

  /**
   * Routes
   */
  app.use("/v1", routes());
  app.use(
    "/",
    swaggerUi.serve,
    swaggerUi.setup(docs, {
      swaggerOptions: {
        docExpansion: "list", // Set the default expansion to "list"
      },
    })
  );
  app.use("/v1/api-docs", swaggerUi.serve, swaggerUi.setup(docs));

  /**
   * Server Activation
   */

  const server = app.listen(config.server.port, () => {
    return console.log(
      `Express is listening at http://localhost:${config.server.port}`
    );
  });

  new WebSocketConnection(server);
};
