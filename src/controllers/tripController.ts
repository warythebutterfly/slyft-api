import { Request, Response } from "express";
import Logging from "../library/Logging";
import {
  createUser,
  deleteUserById,
  getUserByEmail,
  getUserById,
  updateUserById,
} from "./user";
import { authentication, isValidEmail, random } from "../helpers";
import { generateToken } from "../utils/jwt-service";
import {
  generateOtp,
  getOtp,
  sendEmailOtp,
  sendVerifyEmailOtp,
} from "../utils/otp";
import { deleteOtpById } from "./otp";
import { createToken, updateTokenByUserId } from "./token";
import { getRoleByName } from "./role";
import welcomeEmailTemplate from "../templates/welcome";
import mailService from "../utils/mailService";
import passwordResetSuccessEmailTemplate from "../templates/password-reset";
import { getPermissionById, getPermissionsByRoleId } from "./permission";
import { IUser, UserModel } from "../models/User";
import cron from "node-cron";
import closeAccountEmailTemplate from "../templates/close-account";
import confirmCloseAccountEmailTemplate from "../templates/confirm-close-account";
import reactivaeAccountEmailTemplate from "../templates/reactivate-account";
import {
  notifyPieSocketClient,
  onNewAccountCreated,
} from "./notificationController";
import { matchDriverPassengers } from "./matchController";
// import { BipartiteGraph } from "bipartite-matching";
// import { hungarian } from "bipartite-matching";

import Trip from "../models/Trip";

interface StartTripRequestBody {
  driverId: string;
  passengerId: string;
  driverLocation: { lat: number; lng: number };
  passengerLocation: { lat: number; lng: number };
  driverDestination: { lat: number; lng: number };
  passengerDestination: { lat: number; lng: number };
  distanceApart: number;
  timeElapsed: number;
}

// @desc    Register a new trip
// @route   POST /v1/trip/start-trip
// @access  Private
export const startTrip = async (
  req: Request<{}, {}, StartTripRequestBody>,
  res: Response
) => {
  try {
    const {
      driverId,
      passengerId,
      driverLocation,
      passengerLocation,
      driverDestination,
      passengerDestination,
      distanceApart,
      timeElapsed,
    } = req.body;

    const newTrip = new Trip({
      driverId,
      passengerId,
      status: "started",
      driverLocation,
      passengerLocation,
      driverDestination,
      passengerDestination,
      distanceApart,
      timeElapsed,
    });

    await newTrip.save();

    return res
      .status(201)
      .json({ success: true, message: "Successful", data: newTrip });
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

interface UpdateTripStatusRequestBody {
  status: "started" | "inTransit" | "canceled" | "completed";
}
// @desc    Update trip status
// @route   PATCH /v1/trip/update-trip/:tripId
// @access  Private
export const updateTrip = async (
  req: Request<{ tripId: string }, {}, UpdateTripStatusRequestBody>,
  res: Response
) => {
  try {
    const { tripId } = req.params;
    const { status } = req.body;

    if (!["started", "inTransit", "canceled", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { status },
      { new: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Successful", data: updatedTrip })
      .end();
  } catch (error) {
    Logging.error(error);
    res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

// @desc    Get current user
// @route   GET /v1/user/me
// @access  Private
export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;

    const user = await getUserById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        errors: ["User does not exist"],
      });
    }

    delete user.authentication;
    return res
      .status(200)
      .json({ success: true, message: "Successful", data: user });
  } catch (error) {
    Logging.error(error);
    res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later."],
    });
  }
};

// @desc    Get current user by id
// @route   GET /v1/user/:id
// @access  Private
export const getById = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        errors: ["User does not exist"],
      });
    }

    delete user.authentication;
    return res
      .status(200)
      .json({ success: true, message: "Successful", data: user });
  } catch (error) {
    Logging.error(error);
    res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later."],
    });
  }
};

// @desc    Update a user by ID
// @route   PUT /v1/user/:id
// @access  Private
export const updateUser = async (req: Request, res: Response) => {
  try {
    // Get user
    const userId = req.params.id;

    const {
      firstname,
      lastname,
      dateOfBirth,
      phoneNumber,
      homeAddress,
      distanceThreshold,
      gender,
      country,
      driverLicense,
      vehicle,
      insurance,
      avatar,
      // backgroundCheckStatus,
      // backgroundCheckDate,
      //availability,
    } = req.body;

    //TODO: store user avatar
    //const file = req.file;

    if (!userId) {
      return res.status(400).json({
        success: false,
        errors: ["UserId was not supplied."],
      });
    }

    const userExists = await UserModel.findById(userId);

    if (!userExists) {
      return res.status(404).json({
        success: false,
        errors: ["User not found"],
      });
    }

    const updatedUser = await updateUserById(userId, {
      firstname,
      lastname,
      dateOfBirth,
      phoneNumber,
      homeAddress: {
        address: homeAddress?.address,
        longitude: homeAddress?.longitude,
        latitude: homeAddress?.latitude,
      },
      distanceThreshold,
      gender,
      country,
      avatar,
      driverLicense: {
        licenseNumber: driverLicense?.licenseNumber,
        licenseExpiryDate: driverLicense?.licenseExpiryDate,
        licenseState: driverLicense?.licenseState,
      },
      vehicle: {
        vehicleMake: vehicle?.vehicleMake,
        vehicleModel: vehicle?.vehicleModel,
        vehicleYear: vehicle?.vehicleYear,
        vehicleColor: vehicle?.vehicleColor,
        licensePlate: vehicle?.licensePlate,
        vehicleRegistrationExpiry: vehicle?.vehicleRegistrationExpiry,
      },
      insurance: {
        insuranceCompany: insurance?.insuranceCompany,
        insurancePolicyNumber: insurance?.insurancePolicyNumber,
        insuranceExpiryDate: insurance?.insuranceExpiryDate,
      },
      // backgroundCheck: {
      //   backgroundCheckStatus: backgroundCheckStatus,
      //   backgroundCheckDate: backgroundCheckDate,
      // },
      // availability: {
      //   days: availability?.days,
      //   availableTimeStart: availability?.availableTimeStart,
      //   availableTimeEnd: availability?.availableTimeEnd,
      // },
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "User updated successfully",
        data: { user: updatedUser },
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

// @desc    Update a user by ID
// @route   PATCH /v1/user/rating/:id
// @access  Private
export const updateUserRating = async (req: Request, res: Response) => {
  try {
    // Get user
    const userId = req.params.id;

    const { rating }: { rating: Number } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        errors: ["UserId was not supplied."],
      });
    }

    const userExists = await UserModel.findById(userId);

    if (!userExists) {
      return res.status(404).json({
        success: false,
        errors: ["User not found"],
      });
    }

    const existingRating = userExists.rating || 0;
    const averageRating = (existingRating + rating) / 2;

    const updatedUser = await updateUserById(userId, {
      rating: averageRating,
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "User rating updated successfully",
        data: { user: updatedUser },
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

// @desc    Delete a user permanently by ID
// @route   DELETE /v1/user/:id
// @access  Private
export const removeUser = async (req: Request, res: Response) => {
  try {
    //Get user
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        errors: ["User ID is required"],
      });
    }

    const userExists = await UserModel.findById(userId);

    if (!userExists) {
      return res.status(404).json({
        success: false,
        errors: ["User not found"],
      });
    }

    await deleteUserById(userId);

    return res
      .status(200)
      .json({
        success: true,
        message: "User deleted successfully",
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

// @desc    Close a user by ID
// @route   PATCH /v1/user/:id
// @access  Private
export const closeUser = async (req: Request, res: Response) => {
  try {
    //Get user
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        errors: ["User ID is required"],
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        errors: ["User not found"],
      });
    }

    if (user.status === "Active") {
      let emailTemplate = confirmCloseAccountEmailTemplate(
        user.firstname,
        `${process.env.DOMAIN}/v1/user/:id`,
        process.env.TIME_FRAME
      );

      mailService.sendEmail({
        from: '"Slyft" <' + process.env.EMAIL_USER + ">",
        to: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });

      //TODO: add confirm=true param and check if confirmed before proceeding
      user.status = "Closed";

      cron.schedule("0 0 */7 * *", () => {
        user.status = "Deleted";
        updateUserById(userId, user);
      });

      await updateUserById(userId, user);

      emailTemplate = closeAccountEmailTemplate(
        user.firstname,
        `${process.env.DOMAIN}/v1/user/:id`,
        process.env.TIME_FRAME
      );

      mailService.sendEmail({
        from: '"Slyft" <' + process.env.EMAIL_USER + ">",
        to: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });

      return res
        .status(200)
        .json({
          success: true,
          message: "User closed successfully",
          data: {},
        })
        .end();
    } else if (user.status === "Closed") {
      //User wants to reactivate
      const timeframe = new Date();
      timeframe.setDate(
        timeframe.getDate() - parseInt(process.env.TIME_FRAME) || 7
      );

      if (user.updatedAt >= timeframe) {
        user.status = "Active";

        await updateUserById(userId, user);
        const emailTemplate = reactivaeAccountEmailTemplate(user.email);

        mailService.sendEmail({
          from: '"Slyft" <' + process.env.EMAIL_USER + ">",
          to: user.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });

        return res
          .status(200)
          .json({
            success: true,
            message: "User reactivated successfully",
            data: {},
          })
          .end();
      }
    }
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

// @desc    Verify email address
// @route   POST /v1/user/auth/verify-email
// @access  Public
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        errors: ["Please provide an email address"],
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        errors: ["Please provide a valid email address"],
      });
    }

    // send 6 digits otp
    const resp = await sendVerifyEmailOtp(email);
    if (resp.success) {
      return res
        .status(200)
        .json({
          success: true,
          message: "Verificationt email sent successfully",
          data: { otp: resp.data.otp },
        })
        .end();
    } else {
      return res
        .status(400)
        .json({
          success: false,
          errors: resp.errors,
        })
        .end();
    }
  } catch (error) {
    Logging.error(error);
    res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later."],
    });
  }
};

// @desc    Forgot Password
// @route   POST /v1/user/auth/forgot-passsword
// @access  Public
export const sendPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        errors: ["Please provide an email address"],
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        errors: ["Please provide a valid email address"],
      });
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        errors: ["User does not exist"],
      });
    }

    if (user.status !== "Active") {
      return res
        .status(403)
        .json({ success: false, errors: ["Forbidden - User is not Active"] });
    }

    // send 6 digits otp
    const resp = await sendEmailOtp(email, user.firstname);
    if (resp.success) {
      return res
        .status(200)
        .json({
          success: true,
          message: "Password reset email sent successfully",
          data: { otp: resp.data.otp },
        })
        .end();
    } else {
      return res
        .status(400)
        .json({
          success: false,
          errors: resp.errors,
        })
        .end();
    }
  } catch (error) {
    Logging.error(error);
    res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later."],
    });
  }
};

// @desc    Verify OTP for Password Reset
// @route   POST /v1/user/auth/verify-otp
// @access  Public
export const verifyPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email, otp, type } = req.body;

    if (!isValidEmail(email) || !email) {
      return res.status(400).json({
        success: false,
        errors: ["Please provide valid email address."],
      });
    }

    if (!otp || otp.length !== 6) {
      return res.status(400).json({
        success: false,
        errors: ["Please provide a valid OTP."],
      });
    }
    // Verify OTP
    const validOtp = await getOtp(email, otp, type);

    if (!validOtp) {
      return res.status(401).json({
        success: false,
        errors: ["Invalid or expired OTP"],
      });
    }

    // Delete OTP after successful verification
    await deleteOtpById(validOtp._id);

    return res.status(200).json({
      success: true,
      message: "Email verification successful",
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later."],
    });
  }
};

// @desc    Reset Password
// @route   POST /v1/user/auth/password-reset
// @access  Private
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword, otp, type } = req.body;

    if (!isValidEmail(email) || !email || !newPassword || !otp || !type) {
      return res.status(400).json({
        success: false,
        errors: ["Missing fields required."],
      });
    }
    // Verify OTP
    const validOtp = await getOtp(email, otp, type);

    if (!validOtp) {
      return res.status(401).json({
        success: false,
        errors: ["This OTP is now invalid or it has expired."],
      });
    }

    // Delete OTP after successful verification
    await deleteOtpById(validOtp._id);
    //get user
    const user = await getUserByEmail(email);

    // Hash the new password
    const salt = random();

    user.authentication = {
      salt,
      password: authentication(salt, newPassword),
    };

    // Update the user in your database
    await updateUserById(user._id.toString(), user);

    const emailTemplate = passwordResetSuccessEmailTemplate(user.firstname);

    mailService.sendEmail({
      from: '"Slyft" <' + process.env.EMAIL_USER + ">",
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
      data: {},
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later."],
    });
  }
};

// @desc    Reset Password
// @route   POST /v1/user/auth/password-change
// @access  Private
export const changePassword = async (req: Request, res: Response) => {
  try {
    //Get user
    const { userId } = req.user;

    const user = await getUserById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        errors: ["User does not exist"],
      });
    }
    const { authentication: auth } = await getUserByEmail(user.email).select(
      "+authentication.salt +authentication.password"
    );

    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
      return res.status(400).json({
        success: false,
        errors: ["Missing fields required."],
      });
    }
    const expectedHash = authentication(auth.salt, password);
    if (auth.password !== expectedHash) {
      return res.status(400).json({
        success: false,
        errors: ["Password is incorrect"],
      });
    }

    // Hash the new password
    const salt = random();

    user.authentication = {
      salt,
      password: authentication(salt, newPassword),
    };

    // Update the user in your database
    await updateUserById(user._id.toString(), user);

    //TODO: send email to user after changing their password

    return res.status(200).json({
      success: true,
      message: "Password change successful",
      data: {},
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later."],
    });
  }
};
let drivers: any = [];
let passengers: any = [];
const passenger1 = {
  destination: {
    description:
      "Faculty of Social Science, UNILAG, Commercial Road, Lagos, Nigeria",
    location: {
      lat: 6.515889199999999,
      lng: 3.391666,
    },
  },
  match: {
    riderType: "Slyft for Student", // this user is a passenger that wants a Student as his driver
    userType: "Student", //this user is a passenger that is a student
  },
  origin: {
    description: "Oredola Street, Lagos, Nigeria",
    location: {
      lat: 6.5288565,
      lng: 3.3809722,
    },
  },
  user: {
    _id: "65ffi56346i274808944b98",
    userType: "Student",
  },
};
const passenger2 = {
  destination: {
    description:
      "Faculty of Social Science, UNILAG, Commercial Road, Lagos, Nigeria",
    location: {
      lat: 6.515889199999999,
      lng: 3.391666,
    },
  },
  match: {
    riderType: "Slyft for Student", // this user is a passenger that wants a Student as his driver
    userType: "Student", //this user is a passenger that is a student
  },
  origin: {
    description: "Oredola Street, Lagos, Nigeria",
    location: {
      lat: 6.5288565,
      lng: 3.3809722,
    },
  },
  user: {
    _id: "65ffi56346i274808944b97",
    userType: "Student",
  },
};
const passenger3 = {
  destination: {
    description:
      "Faculty of Social Science, UNILAG, Commercial Road, Lagos, Nigeria",
    location: {
      lat: 6.515889199999999,
      lng: 3.391666,
    },
  },
  match: {
    riderType: "Slyft for Student", // this user is a passenger that wants a Student as his driver
    userType: "Student", //this user is a passenger that is a student
  },
  origin: {
    description: "Oredola Street, Lagos, Nigeria",
    location: {
      lat: 6.5288565,
      lng: 3.3809722,
    },
  },
  user: {
    _id: "65ffi56346i274808944b96",
    userType: "Student",
  },
};

// let drivers: Driver[] = [driver1, driver2, driver3]; // Array of driver objects
// passengers.push(passenger1);
// passengers.push(passenger2);
// passengers.push(passenger3);

// console.log(passengers);
// @desc    Register a new user
// @route   POST /v1/ride/offer-ride
// @access  Public
export const offerRide = async (req: Request, res: Response) => {
  try {
    const { rideInformation } = req.body;
    const driverIndex: number = drivers.findIndex(
      (driver) => driver.user._id === rideInformation.user._id
    );

    if (driverIndex >= 0) {
      // Driver exists, replace with the new ride information
      drivers[driverIndex] = rideInformation;
    } else {
      // Driver does not exist, push the new ride information
      drivers.push(rideInformation);
    }
    let matches = await matchDriverPassengers(
      rideInformation,
      passengers,
      rideInformation.user.distanceThreshold || 1.3
    );
    return res.status(201).json({
      success: true,
      message: "Ride offered successfully",
      data: matches,
    });
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

// @desc    Register a new user
// @route   POST /v1/ride/request-ride
// @access  Public
export const requestRide = async (req: Request, res: Response) => {
  try {
    const { rideInformation } = req.body;
    const passengerIndex: number = passengers.findIndex(
      (passenger) => passenger.user._id === rideInformation.user._id
    );

    if (passengerIndex >= 0) {
      // Passenger exists, replace with the new ride information
      passengers[passengerIndex] = rideInformation;
    } else {
      // Passenger does not exist, push the new ride information
      passengers.push(rideInformation);
    }

    return res
      .status(200)
      .json({ success: true, message: "Ride requested successfully" });
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

// @route   POST /v1/ride/unrequest-ride
// @access  Public
export const UnrequestRide = async (req: Request, res: Response) => {
  try {
    const { rideInformation } = req.body;
    passengers = passengers.filter(
      (passenger) => passenger.user._id !== rideInformation.user._id
    );

    return res
      .status(200)
      .json({ success: true, message: "Ride canceled successfully" });
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

// @desc    Register a new user
// @route   POST /v1/ride/accept
// @access  Public
export const acceptRide = async (req: Request, res: Response) => {
  try {
    const { driverId, passengerId, match } = req.body;

    if (!driverId || !passengerId) {
      return res
        .status(400)
        .json({ message: "Driver ID and Passenger ID are required" });
    }

    // Check if the passenger exists in the map
    if (
      passengers.filter((passenger) => passenger.user._id == passengerId)
        .length <= 0
    ) {
      return res.status(404).json({ message: "Passenger not found" });
    }

    if (drivers.filter((driver) => driver.user._id == driverId).length <= 0) {
      // Check if the driver exists in the map
      return res.status(404).json({ message: "Driver not found" });
    }

    // Remove the accepted passenger from the map
    passengers = passengers.filter(
      (passenger) => passenger.user._id !== passengerId
    );

    // Remove the driver from the map
    drivers = drivers.filter((driver) => driver.user._id !== driverId);

    const pin = await generateOtp(4);
    match.pin = pin;

    notifyPieSocketClient({ user: passengerId, match });
    return res.status(201).json({
      success: true,
      message: "Ride accepted successfully",
      data: { pin },
    });
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

export const getPassengers = async (req: Request, res: Response) => {
  try {
    const { driver } = req.body;

    let matches = await matchDriverPassengers(
      driver,
      passengers,
      driver.user.distanceThreshold || 1.3
    );
    return res.status(201).json({
      success: true,
      message: "Ride offered successfully",
      data: matches,
    });
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

async function processUserRoles(user: IUser) {
  const permissionIds = await Promise.all(
    user.roles.map(
      async (roleId: string) => await getPermissionsByRoleId(roleId)
    )
  );

  const slugs = await Promise.all(
    permissionIds.flat().map(async (permissionId: any) => {
      const permission: any = await getPermissionById(permissionId);
      const { slug } = permission?.slug || "";
      return slug;
    })
  );

  return slugs;
}

export interface ILocation {
  lat: number;
  lng: number;
}
export interface IMatch {
  passengerType?: string;
  riderType?: string;
  userType: string;
}
export interface Location {
  // Define attributes of a point
  description: string;
  location: ILocation;
}
export interface Driver {
  // Define attributes of a driver
  destination: Location;
  match: IMatch;
  origin: Location;
  user: any;
}

export interface Passenger {
  // Define attributes of a passenger
  destination: Location;
  match: IMatch;
  origin: Location;
  user: any;
}

// function matchDriversPassengers2(drivers: Driver[], passengers: Passenger[]) {
//   console.log("got here just fine");
//   const graph = new BipartiteGraph<Driver, Passenger>();

//   // Add nodes (drivers and passengers) to the graph
//   drivers.forEach((driver) => graph.addNode(driver, "driver"));
//   passengers.forEach((passenger) => graph.addNode(passenger, "passenger"));

//   // Add edges between drivers and passengers with weights representing match suitability
//   drivers.forEach((driver) => {
//     passengers.forEach((passenger) => {
//       const weight = calculateMatchWeight(driver, passenger);
//       graph.addEdge(driver, passenger, weight);
//     });
//   });

//   // Apply the Hungarian algorithm to find the maximum weighted matching
//   const matching = hungarian(graph);

//   // Extract the matched pairs from the matching
//   const matches = matching.edges.map((edge) => ({
//     driver: edge.source,
//     passenger: edge.target,
//   }));

//   return matches;
// }

// Function to calculate the weight of a match between a driver and a passenger
function calculateMatchWeight(driver: Driver, passenger: Passenger): number {
  // You can define your own logic to calculate the weight based on various factors
  const originDistance = calculateDistance2(driver.origin, passenger.origin);
  const destinationDistance = calculateDistance2(
    driver.destination,
    passenger.destination
  );

  // Weight is the sum of distances between origin and destination
  return originDistance + destinationDistance;
  // For simplicity, let's assume a constant weight of 1 for all matches
  // return 1;
}

// Function to calculate the distance between two points using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180; // Convert degrees to radians
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
}

function calculateDistance2(location1: Location, location2: Location): number {
  // Euclidean distance formula
  const latDiff = location1.location.lat - location2.location.lat;
  const lngDiff = location1.location.lng - location2.location.lng;
  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
}
