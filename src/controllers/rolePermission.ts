import Logging from "../library/Logging";
import { IRolePermission, RolePermissionModel } from "../models/RolePermission";

export const createRolePermission = async (values: Record<string, IRolePermission>) => {
  try {
    const rolePermission = await new RolePermissionModel(values).save();
    return rolePermission.toObject();
  } catch (error) {
    Logging.error(error);
  }
};

export const getRolePermissions = () => {
  try {
    return RolePermissionModel.find();
  } catch (error) {
    Logging.error(error);
  }
};

export const getRolePermissionById = (id: string) => {
  try {
    return RolePermissionModel.findById(id);
  } catch (error) {
    Logging.error(error);
  }
};

export const getRolePermissionsByRoleId = async (roleId: string) => {
  try {
    return await RolePermissionModel.findOne({ roleId });
  } catch (error) {
    Logging.error(error);
  }
};

export const deleteRolePermissionById = (id: string) => {
  try {
    return RolePermissionModel.findOneAndDelete({ _id: id });
  } catch (error) {
    Logging.error(error);
  }
};

export const updateRolePermissionById = (
  id: string,
  values: Record<string, any>
) => {
  try {
    return RolePermissionModel.findByIdAndUpdate(id, values);
  } catch (error) {
    Logging.error(error);
  }
};

