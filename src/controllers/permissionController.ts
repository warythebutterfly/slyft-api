import { Request, Response } from "express";
import Logging from "../library/Logging";
import {
  createPermission,
  deletePermissionById,
  getPermissionById,
  getPermissionBySlug,
  getPermissions,
  getPermissionsByRoleId,
  updatePermissionById,
} from "./permission";

// @desc    Create a new permission
// @route   /v1/user/permission
// @access  Public
export const create = async (req: Request, res: Response) => {
  try {
    const { slug, description } = req.body;

    //Validation
    if (!slug || !description) {
      return res
        .status(400)
        .json({ success: false, errors: ["Missing required fieldsss"] });
    }

    //Find if permission already exists
    const existingPermission = await getPermissionBySlug(slug);

    if (existingPermission)
      return res.status(400).json({
        success: false,
        errors: ["Permission with this slug already exists"],
      });

    //Create permission
    const newPermission = await createPermission({ slug, description });

    if (newPermission) {
      return res
        .status(201)
        .json({
          success: true,
          message: "Permission creation Successful",
          data: { permission: newPermission },
        })
        .end();
    } else {
      return res
        .status(400)
        .json({ success: false, errors: ["Failed to create permission"] });
    }
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

// @desc    Get Permissions
// @route   GET /v1/user/permission
// @access  Public
export const get = async (req: Request, res: Response) => {
  try {
    const permissions = await getPermissions();
    return res
      .status(200)
      .json({
        success: true,
        message: "Successful",
        data: { permissions },
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

// @desc    Get Permission by Id
// @route   GET /v1/user/permission/:id
// @access  Private
export const getById = async (req: Request, res: Response) => {
  try {
    const permission = await getPermissionById(req.params.id);
    return res
      .status(200)
      .json({
        success: true,
        message: "Successful",
        data: { permission },
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

// @desc    Get Permission by Id
// @route   GET /v1/user/permission/:roleId
// @access  Private
export const getByRoleId = async (req: Request, res: Response) => {
  try {
    const permission = await getPermissionsByRoleId(req.params.roleId);
    return res
      .status(200)
      .json({
        success: true,
        message: "Successful",
        data: { permission },
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

// @desc    Update a permission by ID
// @route   PUT /v1/user/permission/:id
// @access  Private
export const update = async (req: Request, res: Response) => {
  try {
    const permissionId = req.params.id;
    const { slug, description } = req.body;

    if (!permissionId || !slug || !description) {
      return res.status(400).json({
        success: false,
        errors: ["Missing required fields"],
      });
    }

    const existingPermission = await getPermissionById(permissionId);

    if (!existingPermission) {
      return res.status(404).json({
        success: false,
        errors: ["Permission not found"],
      });
    }

    const updatedPermission = await updatePermissionById(permissionId, {
      slug,
      description,
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "Permission updated successfully",
        data: { permission: updatedPermission },
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

// @desc    Delete a permission by ID
// @route   DELETE /v1/user/permission/:id
// @access  Private
export const remove = async (req: Request, res: Response) => {
  try {
    const permissionId = req.params.id;

    if (!permissionId) {
      return res.status(400).json({
        success: false,
        errors: ["Permission ID is required"],
      });
    }

    const permissionExists = await getPermissionById(permissionId);

    if (!permissionExists) {
      return res.status(404).json({
        success: false,
        errors: ["Permission not found"],
      });
    }

    await deletePermissionById(permissionId);

    return res
      .status(200)
      .json({
        success: true,
        message: "Permission deleted successfully",
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

