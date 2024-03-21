import Logging from "../library/Logging";
import { NotificationModel } from "../models/Notification";

export const createNotifications = async (values: Record<string, any>) => {
  try {
    const notifications = await new NotificationModel(values).save();
    return notifications.toObject();
  } catch (error) {
    Logging.error(error);
  }
};

export const getNotifications = async () => {
  try {
    return NotificationModel.find();
  } catch (error) {
    Logging.error(error);
  }
};

export const getNotificationById = async (id: string) => {
  try {
    return NotificationModel.findById(id);
  } catch (error) {
    Logging.error(error);
  }
};

export const getNotificationsByUserId = async (userId: string) => {
  try {
    return await NotificationModel.find({ user: userId }).sort({
      createdAt: -1,
    });
  } catch (error) {
    Logging.error(error);
  }
};

export const deleteNotificationById = async (id: string) => {
  try {
    return NotificationModel.findOneAndDelete({ _id: id });
  } catch (error) {
    Logging.error(error);
  }
};

export const deleteUserNotifications = (userId: string) => {
  try {
    return NotificationModel.deleteMany({ user: userId });
  } catch (error) {
    Logging.error(error);
  }
};

export const updateNotificationById = (
  id: string,
  values: Record<string, any>
) => {
  try {
    return NotificationModel.findByIdAndUpdate(id, values);
  } catch (error) {
    Logging.error(error);
  }
};
