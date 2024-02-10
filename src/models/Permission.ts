import { Document, Schema, Model, model } from "mongoose";

interface IPermission {
  slug: string;
  description: string;
}

const permissions: IPermission[] = [
  { slug: "add-{schema}", description: "Add {schema}" },
  { slug: "read-{schema}", description: "Read {schema}" },
  { slug: "update-{schema}", description: "Update {schema}" },
  { slug: "delete-{schema}", description: "Delete {schema}" },
];

interface IPermissionModel extends IPermission, Document {}

const PermissionSchema = new Schema<IPermissionModel>(
  {
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const PermissionModel: Model<IPermissionModel> = model(
  "Permission",
  PermissionSchema
);

export { PermissionModel, IPermission, IPermissionModel, permissions };
