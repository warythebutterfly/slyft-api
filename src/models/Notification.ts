import { Document, Schema, Model, model, Types } from "mongoose";

interface INotification {
  user: Types.ObjectId;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
  updatedAt: Date;
  createdAt: Date;
}

interface INotificationModel extends INotification, Document {}

const NotificationSchema = new Schema<INotificationModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const NotificationModel: Model<INotificationModel> = model(
  "Notification",
  NotificationSchema
);

export { NotificationModel, INotification, INotificationModel };
