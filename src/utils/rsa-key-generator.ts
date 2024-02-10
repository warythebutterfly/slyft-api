// rsa-key-generator.ts
import NodeRSA from "node-rsa";
import cron from "node-cron";
import Logging from "../library/Logging";

export const rotateKeys = () => {
  // Generate new RSA keys
  const key = new NodeRSA({ b: 2048 });
  const privateKey = key.exportKey("private");
  const publicKey = key.exportKey("public");

  return {
    privateKey,
    publicKey,
  };
};

cron.schedule("0 0 */7 * *", () => {
  Logging.info("Rotating RSA Keys");
  rotateKeys();
});
