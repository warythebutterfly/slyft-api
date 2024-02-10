import { Document, Schema, Model, model } from "mongoose";

interface IUser {
  firstname?: string;
  lastname?: string;
  email: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  gender?: string;
  country?: string;
  avatar?: string;
  authentication: {
    password: string;
    salt?: string;
    sessionToken?: string;
  };
  status: "Active" | "Closed" | "Deleted";
  roles?: Array<string>;
  updatedAt: Date;
  createdAt: Date;
}

interface IUserModel extends IUser, Document {}

const UserSchema = new Schema<IUserModel>(
  {
    firstname: { type: String},
    lastname: { type: String },
    email: {
      type: String,
      required: true,
      match:
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    },
    dateOfBirth: { type: Date },
    phoneNumber: { type: String },
    gender: { type: String },
    country: { type: String },
    avatar: { type: String },
    authentication: {
      password: { type: String, required: true, select: false },
      salt: { type: String, select: false },
      sessionToken: { type: String, select: false },
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Deactivated", "Closed"],
      default: "Active",
    },
    roles: [{ type: String, ref: "Role" }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const UserModel: Model<IUserModel> = model("User", UserSchema);

export { UserModel, IUser, IUserModel };
