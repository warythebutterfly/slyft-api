import { Document, Schema, Model, model } from "mongoose";

interface IRole {
  name: string;
}

interface IRoleModel extends IRole, Document {}

const RoleSchema = new Schema<IRoleModel>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const RoleModel: Model<IRoleModel> = model("Role", RoleSchema);

// //To automatically insert new permissions
// const mdel = RoleModel
// // Create a change stream on the source collection
// const sourceChangeStream = mdel.watch();

// // Listen for changes on the source collection
// sourceChangeStream.on("change", async (change) => {
//   console.log("herrrrrrrreeeeeeeeeeeeeeeeeeeeeeeeeeee");
//   console.log(change);
//   if (change.operationType === "insert") {
//     try {
//       // Insert the data into the destination collection
//       permissions.forEach(async (permission) => {
//         await PermissionModel.create({
//           slug: permission.slug.replace("{schema}", change.ns.coll),
//           description: permission.description.replace("{schema}", change.ns.coll),
//         });
//       });
//       Logging.info(`Data inserted into destination collection:`);
//     } catch (error) {
//       Logging.error(
//         `Error inserting data into destination collection: ${error}`
//       );
//     }
//   } else if (change.operationType === "drop") {
//     try {
//       //TODO: delete permissions related destination collection
//       Logging.info(`Data deleted from destination collection:`);
//     } catch (error) {
//       Logging.error(
//         `Error deleting data from destination collection: ${error}`
//       );
//     }
//   }
// });

export { RoleModel, IRole, IRoleModel };
