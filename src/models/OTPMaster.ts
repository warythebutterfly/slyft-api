import { Document, Schema, Model, model } from "mongoose";

interface IOtp {
  userId: string;
  email: string;
  type: string;
  otp: string;
  otpExpiration: Date | null;
}

//EXPORT INTERFACE WITH MONGOOSE DOCUMENT
interface IOtpModel extends IOtp, Document {}

enum OtpType {
  VERIFICATION = "verification",
  FORGOT = "forgot",
}

const OtpSchema = new Schema<IOtpModel>(
  {
    email: {
      type: String,
      required: true,
      match:
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    },

    type: {
      type: String,
      enum: Object.values(OtpType),
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiration: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

//EXPORT
const OtpModel: Model<IOtpModel> = model("Otp", OtpSchema);

export { OtpModel, IOtp, IOtpModel, OtpType };
