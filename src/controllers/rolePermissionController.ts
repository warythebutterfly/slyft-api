import { Request, Response } from "express";
import Logging from "../library/Logging";
import {
  createRolePermission,
  deleteRolePermissionById,
  getRolePermissionById,
  getRolePermissions,
  getRolePermissionsByRoleId,
  updateRolePermissionById,
} from "./rolePermission";
import { getPermissionById } from "./permission";

// @desc    Create a new role_permission
// @route   /v1/user/role-permission
// @access  Public
export const create = async (req: Request, res: Response) => {
  try {
    const { roleId, permissions } = req.body;

    //Validation
    if (!roleId || !permissions || permissions.length === 0) {
      return res
        .status(400)
        .json({ success: false, errors: ["Missing required fields"] });
    }

    //Find if role_permission already exists
    const existingRolePermission = await getRolePermissionsByRoleId(roleId);

    if (existingRolePermission)
      return res.status(400).json({
        success: false,
        errors: ["RolePermission with this role already exists"],
      });

    //Find if permissions exists
    permissions.forEach(async (permissionId: string) => {
      const existingPermission = await getPermissionById(permissionId);

      if (!existingPermission) {
        return res.status(404).json({
          success: false,
          errors: [`Permission - ${permissionId} not found`],
        });
      }
    });

    //Create role_permission
    const newRolePermission = await createRolePermission({
      roleId,
      permissions,
    });

    if (newRolePermission) {
      return res
        .status(201)
        .json({
          success: true,
          message: "RolePermission creation Successful",
          data: { role_permission: newRolePermission },
        })
        .end();
    } else {
      return res
        .status(400)
        .json({ success: false, errors: ["Failed to create role_permission"] });
    }
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

// @desc    Get RolePermissions
// @route   GET /v1/user/role-permission
// @access  Public
export const get = async (req: Request, res: Response) => {
  try {
    const role_permissions = await getRolePermissions();
    return res
      .status(200)
      .json({
        success: true,
        message: "Successful",
        data: { role_permissions },
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

// @desc    Get RolePermission by Id
// @route   GET /v1/user/role-permission/:id
// @access  Private
export const getById = async (req: Request, res: Response) => {
  try {
    const role_permission = await getRolePermissionById(req.params.id);
    return res
      .status(200)
      .json({
        success: true,
        message: "Successful",
        data: { role_permission },
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

// @desc    Get RolePermission by Id
// @route   GET /v1/user/role-permission/:roleId
// @access  Private
export const getByRoleId = async (req: Request, res: Response) => {
  try {
    const role_permission = await getRolePermissionsByRoleId(req.params.roleId);
    return res
      .status(200)
      .json({
        success: true,
        message: "Successful",
        data: { role_permission },
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

// @desc    Update a role_permission by ID
// @route   PUT /v1/user/role-permission/:id
// @access  Private
export const update = async (req: Request, res: Response) => {
  try {
    const role_permissionId = req.params.id;
    const { roleId, permissions } = req.body;

    if (!role_permissionId || !roleId || !permissions || permissions.length === 0) {
      return res.status(400).json({
        success: false,
        errors: ["Missing required fields"],
      });
    }

    const role_permissionExists = await getRolePermissionById(
      role_permissionId
    );

    if (!role_permissionExists) {
      return res.status(404).json({
        success: false,
        errors: ["RolePermission not found"],
      });
    }

    //Find if permissions exists
    permissions.forEach(async (permissionId: string) => {
        const existingPermission = await getPermissionById(permissionId);
  
        if (!existingPermission) {
          return res.status(404).json({
            success: false,
            errors: [`Permission - ${permissionId} not found`],
          });
        }
      });

    const existingPermissions = role_permissionExists.permissions;

    const updatedRolePermission = await updateRolePermissionById(
      role_permissionId,
      {
        roleId,
        permissions: [...new Set([...existingPermissions, ...permissions])],
      }
    );

    return res
      .status(200)
      .json({
        success: true,
        message: "RolePermission updated successfully",
        data: { role_permission: updatedRolePermission },
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

// @desc    Delete a role_permission by ID
// @route   DELETE /v1/user/role-permission/:id
// @access  Private
export const remove = async (req: Request, res: Response) => {
  try {
    const role_permissionId = req.params.id;

    if (!role_permissionId) {
      return res.status(400).json({
        success: false,
        errors: ["RolePermission ID is required"],
      });
    }

    const role_permissionExists = await getRolePermissionById(
      role_permissionId
    );

    if (!role_permissionExists) {
      return res.status(404).json({
        success: false,
        errors: ["RolePermission not found"],
      });
    }

    await deleteRolePermissionById(role_permissionId);

    return res
      .status(200)
      .json({
        success: true,
        message: "RolePermission deleted successfully",
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

// @desc    Delete permission(s) from a role
// @route   DELETE /v1/user/role-permission/:roleId
// @access  Private
export const removePermissions = async (req: Request, res: Response) => {
  try {
    const roleId = req.params.roleId;
    const permissions = req.body;

    if (!roleId) {
      return res.status(400).json({
        success: false,
        errors: ["Role ID is required"],
      });
    }

    if (!permissions || permissions.length === 0) {
      return res.status(400).json({
        success: false,
        errors: ["An array of permission is required"],
      });
    }

    const roleExists = await getRolePermissionsByRoleId(roleId);

    if (!roleExists) {
      return res.status(404).json({
        success: false,
        errors: ["Role not found"],
      });
    }

    const remainingPermissions = roleExists.permissions.filter(
      (permission) => !permissions.includes(permission)
    );

    const updatedRolePermission = await updateRolePermissionById(
      roleExists._id.toString(),
      {
        roleId,
        permissions: [...remainingPermissions],
      }
    );

    return res
      .status(200)
      .json({
        success: true,
        message: "Permission(s) removed successfully.",
        data: { rolePermissions: updatedRolePermission },
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
