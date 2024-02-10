import { OtpModel } from "../models/OTPMaster";

export const getOTP = async (email: string, otp: string, type: string) => {
  return await OtpModel.findOne({
    email,
    otp,
    type,
  });
};

export const deleteOtpById = (id: string) => {
  return OtpModel.findOneAndDelete({ _id: id });
};
