import Logging from "../library/Logging";
import { IRole, RoleModel } from "../models/Role";

export const createRole = async (values: Record<string, IRole>) => {
  try {
    const role = await new RoleModel(values).save();
    return role.toObject();
  } catch (error) {
    Logging.error(error);
  }
};

export const getRoles = () => {
  try {
    return RoleModel.find();
  } catch (error) {
    Logging.error(error);
  }
};

export const getRoleByName = (name: string) => {
  try {
    return RoleModel.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } })
  } catch (error) {
    Logging.error(error);
  }
};

export const getRoleById = (id: string) => {
  try {
    return RoleModel.findById(id);
  } catch (error) {
    Logging.error(error);
  }
};

export const deleteRoleById = (id: string) => {
  try {
    return RoleModel.findOneAndDelete({ _id: id });
  } catch (error) {
    Logging.error(error);
  }
};

export const updateRoleById = (id: string, values: Record<string, IRole>) => {
  try {
    return RoleModel.findByIdAndUpdate(id, values);
  } catch (error) {
    Logging.error(error);
  }
};
