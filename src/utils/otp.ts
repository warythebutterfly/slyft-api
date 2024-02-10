import { OtpModel } from "../models/OTPMaster";
import mailService from "./mailService";
import { getOTP } from "../controllers/otp";
import forgotPasswordEmailTemplate from "../templates/forgot-password";
import Logging from "../library/Logging";

//GENERATE OTP
export const generateOtp = function (len: number): string {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < len; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

export const sendEmailOtp = async (email: string, firstname: string) => {
  try {
    // const user = await getUserByEmail(email);

    // if (!user) {
    //   return {
    //     success: false,
    //     errors: ["User not found. Please provide a valid email address."],
    //   };
    // }

    //GENERATE OTP FOR FORGOT PASWORD
    const otpExpirationMinutes = 5;
    const otp: string = generateOtp(6);
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + otpExpirationMinutes);

    const newOtp = new OtpModel({
      email,
      type: "forgot",
      otp,
      otpExpiration,
    });

    await newOtp.save();

    //SEND FORGOT PASSWORD MAIL TO USER
    const emailTemplate = forgotPasswordEmailTemplate(otp, firstname);

    const resp = await mailService.sendEmail({
      from: '"Slyft" <' + process.env.EMAIL_USER + ">",
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (resp.success)
      return {
        success: true,
        message: "OTP sent successfully.",
        data: { otp, type: newOtp.type },
      };
    else return resp;
  } catch (error) {
    Logging.error(error);
    return {
      success: false,
      errors: ["Internal Server Error. Please try again later."],
    };
  }
};

//VERIFY GENERATED OTP
export const getOtp = async function (
  email: string,
  otp: string,
  type: string
): Promise<any> {
  const existOtp = await getOTP(email, otp, type);

  const currentDate = new Date();
  if (!existOtp || existOtp.otpExpiration! < currentDate) {
    return null;
  }
  return existOtp;
};
