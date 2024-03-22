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

//#region Websocket Connection and Broadcasting
const connections = new Map();

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

export class WebSocketConnection {
  private ws: WebSocket;
  private clients: Map<string, WebSocket>;
  private messageQueue: Array<any>;

  constructor() {
    this.messageQueue = [];
    this.ws = new WebSocket("wss://socketsbay.com/wss/v2/1/demo/");

    this.ws.on("open", () => {
      console.log("Connected to WebSocket server");
      this.sendQueuedMessages();
    });

    this.ws.on("message", (data: any) => {
      if (data instanceof Buffer) {
        // If data is a Buffer, convert it to a string
        data = data.toString();
      }
      console.log("Received message:", data);

      // Parse the received message to extract client information
      try {
        const message = JSON.parse(data.toString());
        const userId = message.user;
        if (userId) {
          // Track the client using user ID
          console.log(`New client connected: ${userId}`);
          this.clients.set(userId, this.ws);
        }
        // Handle other message types if needed
      } catch (error) {
        console.log(error.message);
      }
    });

    this.ws.on("close", () => {
      console.log("Disconnected from WebSocket server");
    });

    this.ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  // sendMessageToClient(userId: string, message: any): void {
  //   const payload = JSON.stringify({ user: userId, message: message });
  //   this.ws.send(payload);
  //   console.log(`Sent message to client ${userId}:`, message);
  // }

  sendMessageToClient(userId: string, message: any): void {
    const payload = JSON.stringify({ user: userId, message: message });
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(payload);
      console.log(`Sent message to client ${userId}:`, message);
    } else {
      // Queue the message if WebSocket is still connecting
      this.messageQueue.push({ userId, message });
    }
  }

  private sendQueuedMessages(): void {
    while (this.messageQueue.length > 0) {
      const { userId, message } = this.messageQueue.shift()!;
      this.sendMessageToClient(userId, message);
    }
  }
}

export const notifyClient = (notification: INotification) => {
  const { user } = notification;
  const webSocketConnection = new WebSocketConnection();

  webSocketConnection.sendMessageToClient(
    user.toString(),
    JSON.stringify(notification)
  );
  // const userConnection = connections.get(user.toString());
  // if (userConnection) {
  //   userConnection.send(JSON.stringify(notification));
  // } else {
  //   Logging.error(
  //     `WebSocket connection for user ${user.toString()} not found.`
  //   );
  // }
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
  notifyClient(notification);
};

export const onProfileCompletion = async (userId: string) => {
  const notification: INotification = await createNotifications({
    user: userId,
    subject: `Your profile was updated!`,
    message: `Congratulations! You have full access to all features. Start using them now!`,
  });
  notification.timestamp = timeAgo(notification.createdAt, new Date());
  notifyClient(notification);
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
  notifyClient(notification);
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
