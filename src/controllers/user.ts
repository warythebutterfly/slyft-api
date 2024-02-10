import Logging from "../library/Logging";
import { IUser, UserModel } from "../models/User";

export const createUser = async (values: Record<string, IUser>) => {
  try {
    const user = await new UserModel(values).save();
    return user.toObject();
  } catch (error) {
    Logging.error(error);
  }
};

export const getUsers = async () => {
  try {
    return await UserModel.find();
  } catch (error) {
    Logging.error(error);
  }
};

export const getUserByEmail = (email: string) => {
  try {
    return UserModel.findOne({ email: email.toLowerCase() });
  } catch (error) {
    Logging.error(error);
  }
};

export const getUserBySessionToken = async (sessionToken: string) => {
  try {
    return await UserModel.findOne({
      "authentication.sessionToken": sessionToken,
    });
  } catch (error) {
    Logging.error(error);
  }
};

export const getUserById = async (id: string) => {
  try {
    return await UserModel.findById(id);//.select("-authentication.password");
  } catch (error) {
    Logging.error(error);
  }
};

export const deleteUserById = async (id: string) => {
  try {
    return await UserModel.findOneAndDelete({ _id: id });
  } catch (error) {
    Logging.error(error);
  }
};

export const updateUserById = async (
  id: string,
  values: Record<string, any>
) => {
  try {
    return await UserModel.findByIdAndUpdate(id, values);
  } catch (error) {
    Logging.error(error);
  }
};

export const getUserRoles = async (id: string) => {
  try {
    return await UserModel.findById(id).populate("roles").exec();
  } catch (error) {
    Logging.error(error);
  }
};
