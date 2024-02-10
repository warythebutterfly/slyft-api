import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { rotateKeys } from "./rsa-key-generator";
import Logging from "../library/Logging";

dotenv.config();
const { privateKey, publicKey } = rotateKeys();

const expirationTimeInSeconds = parseInt(process.env.JWT_EXPIRES_IN);
// JWT Signing
export const generateToken = async (payload: any) => {
  const jti = uuidv4();
  const token = jwt.sign({ ...payload, jti }, privateKey, {
    algorithm: "RS256",
    expiresIn: expirationTimeInSeconds,
  });

  return { token, privateKey, publicKey };
};

// JWT Verification
export const verifyJwt = async (token: string) => {
  let resp = null;
  jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      Logging.error(`JWT verification failed: ${err}`);
    } else {
      Logging.info(`JWT verified successfully: ${decoded}`);
      resp = decoded;
    }
  });
  return resp;
};

export const verifyJwtV2 = async (token: string, publicKey: string) => {
  let resp = null;
  jwt.verify(
    token,
    publicKey,
    { algorithms: ["RS256"] },
    (err, decoded: any) => {
      if (err) {
        Logging.error(`JWT verification failed: ${err}`);
      } else {
        Logging.info(`JWT verified successfully`);

        const expirationTime = decoded.exp;
        if (expirationTime) {
          const currentTime = Math.floor(Date.now() / 1000);
          const timeUntilExpiry = expirationTime - currentTime;

          Logging.info(
            `Token expires at: ${new Date(expirationTime * 1000).toUTCString()}`
          );
          Logging.info(`Time until expiry: ${timeUntilExpiry} seconds.`);
        } else {
          Logging.info("Token does not contain an expiration time.");
        }
        resp = decoded;
      }
    }
  );
  return resp;
};
