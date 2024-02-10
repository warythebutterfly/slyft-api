import { Request, Response } from "express";
import Logging from "../library/Logging";
import {
  createRole,
  deleteRoleById,
  getRoleById,
  getRoleByName,
  getRoles,
  updateRoleById,
} from "./role";

// @desc    Create a new role
// @route   /v1/user/role
// @access  Public
export const create = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    //Validation
    if (!name) {
      return res
        .status(400)
        .json({ success: false, errors: ["Missing required fields"] });
    }

    //Find if role already exists
    const existingRole = await getRoleByName(name);

    if (existingRole)
      return res.status(400).json({
        success: false,
        errors: ["Role with this name already exists"],
      });

    //Create role
    const newRole = await createRole({ name });

    if (newRole) {
      return res
        .status(201)
        .json({
          success: true,
          message: "Role creation Successful",
          data: { role: newRole },
        })
        .end();
    } else {
      return res
        .status(400)
        .json({ success: false, errors: ["Failed to create role"] });
    }
  } catch (error) {
    Logging.error(error);
    return res.status(500).json({
      success: false,
      errors: ["Internal Server Error. Please try again later.", error.message],
    });
  }
};

// @desc    Get Roles
// @route   GET /v1/user/role
// @access  Public
export const get = async (req: Request, res: Response) => {
  try {
    const roles = await getRoles();
    return res
      .status(200)
      .json({
        success: true,
        message: "Successful",
        data: { roles },
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

// @desc    Get Role by Id
// @route   GET /v1/user/role/:id
// @access  Private
export const getById = async (req: Request, res: Response) => {
  try {
    const role = await getRoleById(req.params.id);
    return res
      .status(200)
      .json({
        success: true,
        message: "Successful",
        data: { role },
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

// @desc    Update a role by ID
// @route   PUT /v1/user/role/:id
// @access  Private
export const update = async (req: Request, res: Response) => {
  try {
    const roleId = req.params.id;
    const { name } = req.body;

    if (!roleId || !name) {
      return res.status(400).json({
        success: false,
        errors: ["Missing required fields"],
      });
    }

    const roleExists = await getRoleById(roleId);

    if (!roleExists) {
      return res.status(404).json({
        success: false,
        errors: ["Role not found"],
      });
    }

    const updatedRole = await updateRoleById(roleId, {
      name,
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "Role updated successfully",
        data: { role: updatedRole },
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

// @desc    Delete a role by ID
// @route   DELETE /v1/user/role/:id
// @access  Private
export const remove = async (req: Request, res: Response) => {
  try {
    const roleId = req.params.id;

    if (!roleId) {
      return res.status(400).json({
        success: false,
        errors: ["Role ID is required"],
      });
    }

    const roleExists = await getRoleById(roleId);

    if (!roleExists) {
      return res.status(404).json({
        success: false,
        errors: ["Role not found"],
      });
    }

    await deleteRoleById(roleId);

    return res
      .status(200)
      .json({
        success: true,
        message: "Role deleted successfully",
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
