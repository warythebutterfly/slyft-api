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
import bodyParser from "body-parser";

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

const startServer = async () => {
  /**
   * App Configuration
   */
  app.use(cors({ origin: "*" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

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

  // Example usage:
  // const driver1 = {
  //   destination: {
  //     description:
  //       "Faculty of Social Science, UNILAG, Commercial Road, Lagos, Nigeria",
  //     location: {
  //       lat: 6.515889199999999,
  //       lng: 3.391666,
  //     },
  //   },
  //   match: {
  //     passengerType: "Student", //this user is a driver that wants a student as his passenger
  //     userType: "Student", //this user is a driver that is a student
  //   },
  //   origin: {
  //     description: "Oredola Street, Lagos, Nigeria",
  //     location: {
  //       lat: 6.5288565,
  //       lng: 3.3809722,
  //     },
  //   },
  //   user: {
  //     _id: "65ff014c893a534408944b98",
  //     userType: "Student",
  //   },
  // };

  // const driver2 = {
  //   destination: {
  //     description:
  //       "Faculty of Social Science, UNILAG, Commercial Road, Lagos, Nigeria",
  //     location: {
  //       lat: 6.515889199999999,
  //       lng: 3.391666,
  //     },
  //   },
  //   match: {
  //     passengerType: "Student", //this user is a driver that wants a student as his passenger
  //     userType: "Student", //this user is a driver that is a student
  //   },
  //   origin: {
  //     description: "Oredola Street, Lagos, Nigeria",
  //     location: {
  //       lat: 6.5288565,
  //       lng: 3.3809722,
  //     },
  //   },
  //   user: {
  //     _id: "65ff014c893a534408944b98",
  //     userType: "Student",
  //   },
  // };

  // const driver3 = {
  //   destination: {
  //     description:
  //       "Faculty of Social Science, UNILAG, Commercial Road, Lagos, Nigeria",
  //     location: {
  //       lat: 6.515889199999999,
  //       lng: 3.391666,
  //     },
  //   },
  //   match: {
  //     passengerType: "Student", //this user is a driver that wants a student as his passenger
  //     userType: "Student", //this user is a driver that is a student
  //   },
  //   origin: {
  //     description: "Oredola Street, Lagos, Nigeria",
  //     location: {
  //       lat: 6.5288565,
  //       lng: 3.3809722,
  //     },
  //   },
  //   user: {
  //     _id: "65ff014c893a534408944b98",
  //     userType: "Student",
  //   },
  // };

  // const passenger1 = {
  //   destination: {
  //     description:
  //       "Faculty of Social Science, UNILAG, Commercial Road, Lagos, Nigeria",
  //     location: {
  //       lat: 6.515889199999999,
  //       lng: 3.391666,
  //     },
  //   },
  //   match: {
  //     riderType: "Slyft for Student", // this user is a passenger that wants a Student as his driver
  //     userType: "Student", //this user is a passenger that is a student
  //   },
  //   origin: {
  //     description: "Oredola Street, Lagos, Nigeria",
  //     location: {
  //       lat: 6.5288565,
  //       lng: 3.3809722,
  //     },
  //   },
  //   user: {
  //     _id: "65ffi56346i274808944b98",
  //     userType: "Student",
  //   },
  // };
  // const passenger2 = {
  //   destination: {
  //     description:
  //       "Faculty of Social Science, UNILAG, Commercial Road, Lagos, Nigeria",
  //     location: {
  //       lat: 6.515889199999999,
  //       lng: 3.391666,
  //     },
  //   },
  //   match: {
  //     riderType: "Slyft for Student", // this user is a passenger that wants a Student as his driver
  //     userType: "Student", //this user is a passenger that is a student
  //   },
  //   origin: {
  //     description: "Oredola Street, Lagos, Nigeria",
  //     location: {
  //       lat: 6.5288565,
  //       lng: 3.3809722,
  //     },
  //   },
  //   user: {
  //     _id: "65ffi56346i274808944b98",
  //     userType: "Student",
  //   },
  // };
  // const passenger3 = {
  //   destination: {
  //     description:
  //       "Faculty of Social Science, UNILAG, Commercial Road, Lagos, Nigeria",
  //     location: {
  //       lat: 6.515889199999999,
  //       lng: 3.391666,
  //     },
  //   },
  //   match: {
  //     riderType: "Slyft for Student", // this user is a passenger that wants a Student as his driver
  //     userType: "Student", //this user is a passenger that is a student
  //   },
  //   origin: {
  //     description: "Oredola Street, Lagos, Nigeria",
  //     location: {
  //       lat: 6.5288565,
  //       lng: 3.3809722,
  //     },
  //   },
  //   user: {
  //     _id: "65ffi56346i274808944b98",
  //     userType: "Student",
  //   },
  // };

  // let drivers: Driver[] = [driver1, driver2, driver3]; // Array of driver objects
  // let passengers: Passenger[] = [passenger1, passenger2, passenger3]; // Array of passenger objects

  // let matchedPairs = await matchDriversPassengers(drivers, passengers);

  // matchedPairs.forEach((pair) => {
  //   //console.log(pair);
  //   console.log(
  //     `Driver ${pair.driver.user._id} matched with Passenger ${pair.passenger.user._id}`
  //   );
  // });

  app.listen(config.server.port, () => {
    return console.log(
      `Express is listening at http://localhost:${config.server.port}`
    );
  });
};
