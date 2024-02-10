import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB Max
  },
});
