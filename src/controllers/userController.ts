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
import { getOtp, sendEmailOtp, sendVerifyEmailOtp } from "../utils/otp";
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
import { onNewAccountCreated } from "./notificationController";
// import { BipartiteGraph } from "bipartite-matching";
// import { hungarian } from "bipartite-matching";

// @desc    Register a new user
// @route   POST /v1/user/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    //Validation
    if (!user.email || !user.password) {
      return res
        .status(400)
        .json({ success: false, errors: ["Missing required fields"] });
    }

    //Find if user already exists
    const existingUser = await getUserByEmail(user.email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        errors: ["User with this email already exists"],
      });
    }

    //Hash Password
    const salt = random();

    user.authentication = {
      salt,
      password: authentication(salt, user.password),
    };

    const role = await getRoleByName("User");

    user.roles = role ? [role._id.toString()] : [];

    //TODO figure out user type based on email supplied
    if (user.email.endsWith("@live.unilag.edu.ng")) user.userType = "Student";
    else user.userType = "Staff";

    //Create user
    const newUser = await createUser(user);

    const slugs = await processUserRoles(user);

    const { token, publicKey, privateKey } = await generateToken({
      userId: newUser._id.toString(),
      slugs,
    });

    await createToken({
      token,
      publicKey,
      privateKey,
      user: newUser._id.toString(),
    });

    if (newUser) {
      const emailTemplate = welcomeEmailTemplate(newUser.firstname);

      mailService.sendEmail({
        from: '"StreamBix" <' + process.env.EMAIL_USER + ">",
        to: newUser.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });

      //onNewAccountCreated(newUser.firstname, newUser._id.toString());
      return res
        .status(201)
        .json({
          success: true,
          message: "Registeration Successful",
          data: { token },
        })
        .end();
    } else {
      return res
        .status(400)
        .json({ success: false, errors: ["Failed to create user"] });
    }
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

// @desc    Login a user
// @route   POST /v1/user/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    Logging.error("email and password" + email + password);

    if (!email || !password) {
      Logging.error("no email or password");
      return res.status(400).json({
        success: false,
        errors: ["Please provide both email and password"],
      });
    }
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      Logging.error("user not found");
      return res.status(401).json({
        success: false,
        errors: ["Invalid credentials. User does not exist"],
      });
    }

    if (user.status !== "Active") {
      Logging.error("user not active");
      return res
        .status(403)
        .json({ success: false, errors: ["Forbidden - User is not Active"] });
    }

    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      Logging.error("passwords don't match");
      return res.status(401).json({
        success: false,
        errors: ["Invalid credentials. Passwords don't match"],
      });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    const s = await processUserRoles(user);

    res.cookie("Slyft-AUTH", user.authentication.sessionToken, {
      domain: process.env.DOMAIN,
      path: "/",
    });

    const { token, privateKey, publicKey } = await generateToken({
      userId: user._id.toString(),
      slugs: s,
    });

    await updateTokenByUserId(user._id.toString(), {
      token,
      privateKey,
      publicKey,
      user: user._id,
    });

    // onNewAccountCreated(user.firstname, user._id.toString());

    return res
      .status(200)
      .json({ success: true, message: "Login Successful", data: { token } })
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
    const { userId } = req.body;

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
    //Get user
    const userId = req.params.id;
    let { firstname, lastname, dateOfBirth } = req.body;
    const { phoneNumber, gender, country } = req.body;
    //TODO:store user avatar
    //const file = req.file;

    if (!userId)
      return res.status(400).json({
        success: false,
        errors: ["UserId was not supplied."],
      });

    const userExists = await UserModel.findById(userId);

    if (!userExists) {
      return res.status(404).json({
        success: false,
        errors: ["User not found"],
      });
    }

    //User should not be update these after the first update
    firstname = userExists.firstname ? userExists.firstname : firstname;
    lastname = userExists.lastname ? userExists.lastname : lastname;
    dateOfBirth = userExists.dateOfBirth ? userExists.dateOfBirth : dateOfBirth;

    const avatarUrl: string = null;

    // Enhancement: Offload to a queue
    // if (file) {
    //   const { url } = await handleImageUploadToS3(file);
    //   avatarUrl = url;
    // }

    const updatedUser = await updateUserById(userId, {
      firstname,
      lastname,
      dateOfBirth,
      phoneNumber,
      gender,
      country,
      ...(avatarUrl ? { avatar: avatarUrl } : {}),
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
    const { userId } = req.body;

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
