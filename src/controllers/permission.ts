import Logging from "../library/Logging";
import { IPermission, PermissionModel } from "../models/Permission";
import { RolePermissionModel } from "../models/RolePermission";

export const createPermission = async (values: Record<string, IPermission>) => {
  try {
    const permission = await new PermissionModel(values).save();
    return permission.toObject();
  } catch (error) {
    Logging.error(error);
  }
};

export const getPermissions = () => {
  try {
    return PermissionModel.find();
  } catch (error) {
    Logging.error(error);
  }
};

export const getPermissionBySlug = (slug: string) => {
  try {
    return PermissionModel.findOne({ slug: { $regex: new RegExp(`^${slug}$`, "i") } });
  } catch (error) {
    Logging.error(error);
  }
};

export const getPermissionById = (id: string) => {
  try {
    return PermissionModel.findById(id);
  } catch (error) {
    Logging.error(error);
  }
};

export const getPermissionsByRoleId = async (roleId: string) => {
  try {
    const rolePermission = await RolePermissionModel.findOne({ roleId });
    if (rolePermission) return rolePermission.permissions;
  } catch (error) {
    Logging.error(error);
  }
};

export const deletePermissionById = (id: string) => {
  try {
    return PermissionModel.findOneAndDelete({ _id: id });
  } catch (error) {
    Logging.error(error);
  }
};

export const updatePermissionById = (
  id: string,
  values: Record<string, IPermission>
) => {
  try {
    return PermissionModel.findByIdAndUpdate(id, values);
  } catch (error) {
    Logging.error(error);
  }
};
