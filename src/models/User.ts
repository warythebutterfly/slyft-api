import { Document, Schema, Model, model } from "mongoose";

interface IUser {
  firstname?: string;
  lastname?: string;
  email: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  homeAddress?: any;
  gender?: string;
  country?: string;
  avatar?: string;
  authentication: {
    password: string;
    salt?: string;
    sessionToken?: string;
  };
  status: "Active" | "Closed" | "Deleted";
  userType: "Staff" | "Student";
  roles?: Array<string>;
  driverLicense?: any;
  vehicle?: any;
  insurance?: any;
  backgroundCheck?: any;
  availability?: any;
  rating?: any;
  reviews?: any;
  updatedAt: Date;
  createdAt: Date;
}

interface IUserModel extends IUser, Document {}

const UserSchema = new Schema<IUserModel>(
  {
    firstname: { type: String },
    lastname: { type: String },
    email: {
      type: String,
      required: true,
      match:
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    },
    dateOfBirth: { type: Date },
    phoneNumber: { type: String },
    homeAddress: {
      address: { type: String, required: false },
      longitude: { type: Number, required: false },
      latitude: { type: Number, required: false },
    },
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
    userType: {
      type: String,
      required: true,
      enum: ["Staff", "Student"],
    },
    roles: [{ type: String, ref: "Role" }],
    // Driver specific fields
    driverLicense: {
      licenseNumber: { type: String, required: false },
      licenseExpiryDate: { type: Date, required: false },
      licenseState: { type: String, required: false },
    },
    vehicle: {
      vehicleMake: { type: String, required: false },
      vehicleModel: { type: String, required: false },
      vehicleYear: { type: Number, required: false },
      vehicleColor: { type: String, required: false },
      licensePlate: { type: String, required: false },
      vehicleRegistrationExpiry: { type: Date, required: false },
    },
    insurance: {
      insuranceCompany: { type: String, required: false },
      insurancePolicyNumber: { type: String, required: false },
      insuranceExpiryDate: { type: Date, required: false },
    },
    backgroundCheck: {
      backgroundCheckStatus: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
      backgroundCheckDate: { type: Date },
    },
    availability: {
      days: {
        type: [String],
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
      availableTimeStart: { type: String },
      availableTimeEnd: { type: String },
    },
    rating: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const UserModel: Model<IUserModel> = model("User", UserSchema);

export { UserModel, IUser, IUserModel };
