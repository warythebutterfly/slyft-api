import { Document, Schema, Model, model, Types } from "mongoose";
import { IPermission } from "./Permission";

interface IRolePermission {
  roleId: string;
  permissions: Types.ObjectId[] | IPermission[];
}

interface IRolePermissionModel extends IRolePermission, Document {}

const RolePermissionSchema = new Schema<IRolePermissionModel>(
  {
    roleId: { type: String, required: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const RolePermissionModel: Model<IRolePermissionModel> = model("RolePermission", RolePermissionSchema);

export { RolePermissionModel, IRolePermission, IRolePermissionModel };
