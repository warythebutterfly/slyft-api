import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { verifyJwtV2 } from "../utils/jwt-service";
import { getTokenObjectByToken } from "../controllers/token";
import { getUserById } from "../controllers/user";
import Logging from "../library/Logging";
dotenv.config();

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
      return res.status(401).send("Not authorized. Please authenticate");

    const tokenObj = (await getTokenObjectByToken(token)).toObject();
    const decoded = await verifyJwtV2(tokenObj.token, tokenObj.publicKey);
    if (!decoded)
      return res.status(401).send("Not authorized. Please authenticate");

    const { status } = await getUserById(decoded.userId);
    if (status !== "Active") return res.status(401).send("Not authorized.");

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).send("Not authorized. Please authenticate");
  }
};

export const reactivate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
      return res.status(401).send("Not authorized. Please authenticate");

    const tokenObj = (await getTokenObjectByToken(token)).toObject();
    const decoded = await verifyJwtV2(tokenObj.token, tokenObj.publicKey);
    if (!decoded)
      return res.status(401).send("Not authorized. Please authenticate");

    const { status } = await getUserById(decoded.userId);
    if (status === "Deleted") return res.status(401).send("Not authorized.");

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).send("Not authorized. Please authenticate");
  }
};

export const hasPermission = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (
      req.user.permissions &&
      req.user.permissions.includes(requiredPermission)
    ) {
      Logging.info("You have permission to access this route.");
      next();
    } else {
      return res.status(403).send("Forbidden - Insufficient permissions");
    }
  };
};
