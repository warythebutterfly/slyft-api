import Logging from "../library/Logging";
import { TokenModel } from "../models/Token";

export const createToken = async (values: Record<string, any>) => {
  try {
    const token = await new TokenModel(values).save();
    return token.toObject();
  } catch (error) {
    Logging.error(error);
  }
};

export const getTokenObjectByToken = async (token: string) => {
  try {
    return await TokenModel.findOne({ token });
  } catch (error) {
    Logging.error(error);
  }
};

export const updateTokenByUserId = async (
  userId: string,
  values: Record<string, any>
) => {
  try {
    const tokenObj = await TokenModel.findOne({ user: userId });
    if (!tokenObj) await createToken(values);
    else return TokenModel.findByIdAndUpdate(tokenObj._id, values);
  } catch (error) {
    Logging.error(error);
  }
};
