import { Request, Response } from "express";
import Logging from "../library/Logging";
import {
  deleteNotificationById,
  updateNotificationById,
  getNotificationsByUserId,
  deleteUserNotifications,
  getNotificationById,
  createNotifications,
} from "./notification";
import { INotification } from "../models/Notification";
import { isBooleanObject } from "util/types";
import { WebSocket } from "ws";
import url from "url";
import { timeAgo } from "../helpers";
import cron from "node-cron";
import { IUser, UserModel } from "../models/User";
import { Driver, Passenger, matchDriversPassengers } from "./matchController";
import { generateOtp } from "../utils/otp";

//#region Websocket Connection and Broadcasting
const connections = new Map();

const pieSocketConnections = new Map<string, WebSocket[]>();

// Initialize array of drivers and passengers
let drivers: Driver[] = [
  // {
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
  //     _id: "65ff014c893a534408944b97",
  //     userType: "Student",
  //     firstname: "Ayo",
  //     lastname: "Balogun",
  //   },
  // },
];
let passengers: Passenger[] = [
  // {
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
  //     _id: "65ffi56346i274808944b92",
  //     userType: "Student",
  //     firstname: "Ayo",
  //     lastname: "Balogun",
  //   },
  // },
];

// export class WebSocketConnection {
//   private ws: WebSocket;

//   constructor() {
//     const wss = new WebSocket("wss://socketsbay.com/wss/v2/1/demo/");
//     wss.on("connection", (ws, request) => {
//       const queryParams = url.parse(request.url, true).query;
//       const user = queryParams.user ? queryParams.user.toString() : null;
//       if (!user) {
//         ws.terminate();
//         return;
//       }

//       Logging.info(`New client connected: ${user}`);

//       connections.set(user, ws);

//       ws.on("close", () => {
//         Logging.info(`Client disconnected: ${user}`);
//         connections.delete(user);
//       });
//     });
//   }
// }

// export class WebSocketConnection {
//   private ws: WebSocket;
//   private clients: Map<string, WebSocket>;
//   private messageQueue: Array<any>;

//   constructor() {
//     this.messageQueue = [];
//     this.ws = new WebSocket(
//       "wss://free.blr2.piesocket.com/v3/1?api_key=dKA1PcoBPSDNAVPH8sUOpn6LTHEaArJjWJomLZ9U&notify_self=1"
//     );

//     this.ws.on("open", () => {
//       console.log("Connected to WebSocket server");
//       this.sendQueuedMessages();
//     });

//     this.ws.on("message", (data: any) => {
//       if (data instanceof Buffer) {
//         // If data is a Buffer, convert it to a string
//         data = data.toString();
//       }
//       console.log("Received message:", data);

//       // Parse the received message to extract client information
//       try {
//         const message = JSON.parse(data.toString());
//         this.connectFinders(message);

//         //console.log(message);
//         const userId = message.user;
//         if (userId) {
//           // Track the client using user ID
//           console.log(`New client connected: ${userId}`);
//           this.clients.set(userId, this.ws);
//         }
//         // Handle other message types if needed
//       } catch (error) {
//         console.log(error.message);
//       }
//     });

//     this.ws.on("close", () => {
//       console.log("Disconnected from WebSocket server");
//     });

//     this.ws.on("error", (error) => {
//       console.error("WebSocket error:", error);
//     });
//   }

//   // sendMessageToClient(userId: string, message: any): void {
//   //   const payload = JSON.stringify({ user: userId, message: message });
//   //   this.ws.send(payload);
//   //   console.log(`Sent message to client ${userId}:`, message);
//   // }

//   private async connectFinders(data: any) {
//     //area for connecting finders
//     // Update array of drivers or passengers based on the received data
//     console.log(data.type);
//     if (data.type === "driver" && data.action === "add") {
//       const index = drivers.findIndex(
//         (item) => item.user._id === data.payload.user._id
//       );

//       if (index !== -1) drivers[index] = data.payload;
//       else drivers.push(data.payload);
//     } else if (data.type === "passenger" && data.action === "add") {
//       const index = passengers.findIndex(
//         (item) => item.user._id === data.payload.user._id
//       );

//       if (index !== -1) passengers[index] = data.payload;
//       else passengers.push(data.payload);
//     }

//     if (data.type === "driver" && data.action === "remove") {
//       drivers = drivers.filter(
//         (item) => item.user._id !== data.payload.user._id
//       );
//     } else if (data.type === "passenger" && data.action === "remove") {
//       passengers = passengers.filter(
//         (item) => item.user._id !== data.payload.user._id
//       );
//     }

//     const matchedPairs = await matchDriversPassengers(drivers, passengers, 1.3);
//     console.log("Matched pairs:", matchedPairs);
//     for (const matchedPair of matchedPairs) {
//       //TODO: Alert them
//       if (this.ws.readyState === WebSocket.OPEN) {
//         const pin = await generateOtp(4);
//         this.ws.send(
//           JSON.stringify({
//             user: matchedPair.driver.user._id,
//             message: "We found you a passenger!",
//             passengerDetails: {
//               rating: matchedPair.passenger.user.rating,
//               // plateNumber: "AA 123AA",
//               // carName: "Toyota Corolla",
//               passengerPhoneNumber: matchedPair.passenger.user.phoneNumber,
//               passengerName: `${matchedPair.passenger.user.firstname} ${matchedPair.passenger.user.lastname}`,
//             },
//           })
//         );
//         this.ws.send(
//           JSON.stringify({
//             user: matchedPair.passenger.user._id,
//             message: "We found you a ride!",
//             driverDetails: {
//               rating: matchedPair.driver.user.rating,
//               plateNumber: matchedPair.driver.user.vehicle.licensePlate,
//               carName: `${matchedPair.driver.user.vehicle.vehicleColor} ${matchedPair.driver.user.vehicle.vehicleMake}${matchedPair.driver.user.vehicle.vehicleModel}`,
//               driverPhoneNumber: matchedPair.driver.user.phoneNumber,
//               driverName: `${matchedPair.driver.user.firstname} ${matchedPair.driver.user.lastname}`,
//             },
//           })
//         );
//         console.log(
//           `Sent message to client ${matchedPair.driver.user._id}:`,
//           "message"
//         );
//       } else {
//         // Queue the message if WebSocket is still connecting
//         this.messageQueue.push({
//           userId: matchedPair.driver.user._id,
//           message: "message",
//         });
//       }
//     }
//     //TODO: Remove matched pairs from passenger and driver array
//     console.log("passengers", passengers.length);
//     console.log("drivers", drivers.length);
//   }

//   sendMessageToClient(userId: string, message: any): void {
//     const payload = JSON.stringify({ user: userId, message: message });
//     if (this.ws.readyState === WebSocket.OPEN) {
//       this.ws.send(payload);
//       console.log(`Sent message to client ${userId}:`, message);
//     } else {
//       // Queue the message if WebSocket is still connecting
//       this.messageQueue.push({ userId, message });
//     }
//   }

//   private sendQueuedMessages(): void {
//     this.ws.send(JSON.stringify({ name: "yemi" }));
//     while (this.messageQueue.length > 0) {
//       const { userId, message } = this.messageQueue.shift()!;
//       this.sendMessageToClient(userId, message);
//     }
//   }
// }

export class PieWebSocketConnection {
  private ws: WebSocket;

  constructor() {
    this.connectToWebSocketServer();
  }

  connectToWebSocketServer() {
    this.ws = new WebSocket(process.env.WEBSOCKET_URL);

    this.ws.on("open", () => {
      console.log("Connected to PieSocket server");
    });

    this.ws.on("message", (data) => {
      // console.log("i got here");
      // console.log(data);
      this.handleIncomingMessage(data);
    });

    this.ws.on("close", () => {
      console.log("Disconnected from PieSocket server");
      // Optionally, attempt to reconnect
      setTimeout(() => this.connectToWebSocketServer(), 5000);
    });

    this.ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  handleIncomingMessage(data: any) {
    try {
      // console.log("in handler");
      // console.log(typeof data);
      const messageString = data.toString();
      const message = JSON.parse(messageString);
      // console.log(message);
      const userId = message.user;

      if (userId) {
        const userConnections = pieSocketConnections.get(userId) || [];
        userConnections.push(this.ws);
        pieSocketConnections.set(userId, userConnections);

        console.log(`New message for user ${userId}:`, message);
      }
    } catch (error) {
      console.error("Error handling incoming message:", error);
    }
  }

  sendToUser(userId: string, message: any) {
    const userConnections = pieSocketConnections.get(userId) || [];
    userConnections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  removeUserConnection(userId: string) {
    const userConnections = pieSocketConnections.get(userId) || [];
    userConnections.forEach((ws) => ws.close());
    pieSocketConnections.delete(userId);
  }
}

//new WebSocketConnection();
new PieWebSocketConnection();
// export const notifyClient = (notification: INotification) => {
//   const { user } = notification;
//   const webSocketConnection = new WebSocketConnection();

//   webSocketConnection.sendMessageToClient(
//     user.toString(),
//     JSON.stringify(notification)
//   );
//   // const userConnection = connections.get(user.toString());
//   // if (userConnection) {
//   //   userConnection.send(JSON.stringify(notification));
//   // } else {
//   //   Logging.error(
//   //     `WebSocket connection for user ${user.toString()} not found.`
//   //   );
//   // }
// };

export const notifyPieSocketClient = (notification) => {
  const { user } = notification;

  // Create a deep copy of the notification object
  const sanitizedNotification = { ...notification };

  // Check if match.passenger.user exists and remove avatar property
  if (
    sanitizedNotification.match &&
    sanitizedNotification.match.passenger &&
    sanitizedNotification.match.passenger.user
  ) {
    delete sanitizedNotification.match.passenger.user.avatar;
  }

  const userConnections = pieSocketConnections.get(user.toString());
  if (userConnections && userConnections.length > 0) {
    userConnections.forEach((ws) => {
      ws.send(JSON.stringify(sanitizedNotification));
    });
  } else {
    console.error(
      `WebSocket connections for user ${user.toString()} not found.`
    );
  }
};

//Notify all clients
// const notifyClients = (notification: any) => {
//   connections.forEach((ws) => {
//     ws.send(JSON.stringify(notification));
//   });
// };

//#endregion

//#region User Notifications
export const onNewAccountCreated = async (
  firstname: string,
  userId: string
) => {
  const notification: INotification = await createNotifications({
    user: userId,
    message: `Welcome ${
      firstname ? firstname : ""
    }! Your account has been successfully created.`,
  });
  notification.timestamp = timeAgo(notification.createdAt, new Date());
  //notifyClient(notification);
};

export const onProfileCompletion = async (userId: string) => {
  const notification: INotification = await createNotifications({
    user: userId,
    subject: `Your profile was updated!`,
    message: `Congratulations! You have full access to all features. Start using them now!`,
  });
  notification.timestamp = timeAgo(notification.createdAt, new Date());
  //notifyClient(notification);
};

//TODO: create profile completion queue on bull
export const checkProfileCompletionAndSendReminders = async () => {
  try {
    const usersWithoutCompleteProfile: IUser[] = await UserModel.find({
      $or: [
        { firstname: { $exists: false } },
        { lastname: { $exists: false } },
      ],
    });

    usersWithoutCompleteProfile.forEach((user: any) => {
      sendProfileSetupReminder(user._id.toString());
    });
  } catch (error) {
    Logging.error(`Error checking profile completion: ${error}`);
  }
};

const sendProfileSetupReminder = async (userId: string) => {
  const notification: INotification = await createNotifications({
    user: userId,
    message: `Complete your profile setup to get started!`,
  });
  notification.timestamp = timeAgo(notification.createdAt, new Date());
  //notifyClient(notification);
};

//TODO: create profile completion queue on bull
cron.schedule("0 0 * * *", () => {
  Logging.info(
    "Scheduling periodic check for profile completion and send reminders"
  );
  checkProfileCompletionAndSendReminders();
});

//#endregion

//#region Rides Notifications

//#endregion

//#region CRUD Operations for Notifications
// @desc    Create a new notification
// @route   POST /v1/user/notifications
// @access  Private
export const create = async (req: Request, res: Response) => {
  try {
    //Get user
    //const { userId } = req.user;
    const { subject, message, userId } = req.body;
    const notification = await createNotifications({
      user: userId,
      subject,
      message,
    });
    return res
      .status(201)
      .json({
        success: true,
        message: `You have successfully created a notfication`,
        data: { notification },
      })
      .end();
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

// @desc    Get user Notifications
// @route   GET /v1/user/notifications
// @access  Private
export const get = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    let notifications = await getNotificationsByUserId(userId);

    const currentTime = new Date();

    notifications = notifications.map((notification: any) => {
      notification.timestamp = timeAgo(notification.createdAt, currentTime);
      return notification;
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "Notifications retrieved successfully",
        data: { notifications },
      })
      .end();
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

// @desc    Get Notifications by Id
// @route   GET /v1/user/notifications/:id
// @access  Private
export const getById = async (req: Request, res: Response) => {
  try {
    const notification: INotification = await getNotificationById(
      req.params.id
    );
    notification.timestamp = timeAgo(notification.createdAt, new Date());
    return res
      .status(200)
      .json({
        success: true,
        message: "Notification retrieved successfully",
        data: { notification },
      })
      .end();
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

// @desc    Update notification by ID
// @route   PUT /v1/user/notifications/:id
// @access  Private
export const update = async (req: Request, res: Response) => {
  try {
    const notificationId = req.params.id;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        errors: ["Missing required fields"],
      });
    }

    const notificationExists = await getNotificationById(notificationId);

    if (!notificationExists) {
      return res.status(404).json({
        success: false,
        errors: ["Notification not found"],
      });
    }

    const updatedNotification = await updateNotificationById(notificationId, {
      subject,
      message,
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "Notification updated successfully",
        data: { notification: updatedNotification },
      })
      .end();
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

// @desc    Update notification read status by ID
// @route   PATCH /v1/user/notifications/:id
// @access  Private
export const updateNotificationStatus = async (req: Request, res: Response) => {
  try {
    const notificationsId = req.params.id;
    const read: boolean = req.body.read;

    if (!notificationsId) {
      return res.status(400).json({
        success: false,
        errors: ["Missing required fields"],
      });
    }

    if (!isBooleanObject(new Boolean(read))) {
      return res.status(400).json({
        success: false,
        errors: ["Property read should be a boolean field"],
      });
    }

    const notificationsExists = await getNotificationById(notificationsId);

    if (!notificationsExists) {
      return res.status(404).json({
        success: false,
        errors: ["Notification not found"],
      });
    }

    const updatedNotifications = await updateNotificationById(notificationsId, {
      read,
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "Notifications updated successfully",
        data: { notifications: updatedNotifications },
      })
      .end();
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

// @desc    Delete a notifications by ID
// @route   DELETE /v1/user/notifications/:id
// @access  Private
export const remove = async (req: Request, res: Response) => {
  try {
    const notificationsId = req.params.id;

    if (!notificationsId) {
      return res.status(400).json({
        success: false,
        errors: ["Notifications ID is required"],
      });
    }

    const notificationsExists = await getNotificationById(notificationsId);

    if (!notificationsExists) {
      return res.status(404).json({
        success: false,
        errors: ["Notifications not found"],
      });
    }

    await deleteNotificationById(notificationsId);

    return res
      .status(200)
      .json({
        success: true,
        message: "Notification deleted successfully",
        data: {},
      })
      .end();
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

// @desc    Delete all notifications
// @route   DELETE /v1/user/notifications
// @access  Private
export const removeAll = (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    deleteUserNotifications(userId);

    return res
      .status(200)
      .json({
        success: true,
        message: "Notifications deleted successfully",
        data: { notifications: [] },
      })
      .end();
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

//#endregion
