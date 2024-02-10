import { Document, Schema, Model, model, Types } from "mongoose";
import { IUser } from "./User";

interface IToken {
  token: string;
  publicKey: string;
  privateKey: string;
  user: Types.ObjectId | IUser;
}

interface ITokenModel extends IToken, Document {}

const TokenSchema = new Schema<ITokenModel>(
  {
    token: { type: String, required: true },
    publicKey: { type: String, required: true },
    privateKey: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const TokenModel: Model<ITokenModel> = model("Token", TokenSchema);

export { TokenModel, IToken, ITokenModel };
