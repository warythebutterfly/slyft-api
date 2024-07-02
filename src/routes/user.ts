import { Router } from "express";
import {
  registerUser,
  loginUser,
  sendPasswordReset,
  verifyPasswordReset,
  resetPassword,
  getUser,
  getById,
  updateUser,
  closeUser,
  removeUser,
  changePassword,
  verifyEmail,
  offerRide,
  requestRide,
  acceptRide,
  updateUserRating,
} from "../controllers/userController";
import { auth, reactivate } from "../middleware/auth";
import {
  create as createRole,
  get as getRoles,
} from "../controllers/roleController";
import {
  create as createPermission,
  get as getPermissions,
} from "../controllers/permissionController";
import { get, create } from "../controllers/rolePermissionController";

export default (router: Router) => {
  router.post("/user/auth/register", registerUser);
  router.post("/user/auth/login", loginUser);
  router.get("/user/me", auth, getUser);
  router
    .route("/user/:id")
    .get(getById)
    .put(updateUser)
    .patch(reactivate, closeUser)
    .delete(auth, removeUser);

  router.route("/user/rating/:id").patch(updateUserRating);
  router.post("/user/auth/forgot-password", sendPasswordReset);
  router.post("/user/auth/verify-otp", verifyPasswordReset);
  router.post("/user/auth/verify-email", verifyEmail);
  router.post("/user/auth/password-reset", resetPassword);
  router.post("/user/auth/password-change", auth, changePassword);
  router.route("/user/role").get(getRoles).post(createRole);
  router
    .route("/user/permission")
    .get(auth, getPermissions)
    .post(auth, createPermission);
  router.route("/user/role-permission").get(auth, get).post(auth, create);
  router.post("/ride/offer-ride", offerRide);
  router.post("/ride/request-ride", requestRide);
  router.post("/ride/accept", acceptRide);
};
