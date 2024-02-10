import { Router } from "express";
import user from "./user";

const router = Router();

export default (): Router => {
  user(router);
  return router;
};
