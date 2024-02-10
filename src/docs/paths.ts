import {
  createUser,
  loginUser,
  forgotPassword,
  forgotPasswordVerifyOtp,
  resetPassword,
  changePassword,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
  deactivateUser
} from "./users/user";

export const operations = {
  paths: {
    "/v1/user/auth/login": {
      ...loginUser,
    },
    "/v1/user/auth/register": {
      ...createUser,
    },
    "/v1/user/auth/forgot-password": {
      ...forgotPassword,
    },
    "/v1/user/auth/verify-otp": {
      ...forgotPasswordVerifyOtp,
    },
    "/v1/user/auth/password-reset": {
      ...resetPassword,
    },
    "/v1/user/auth/password-change": {
      ...changePassword,
    },
    "/v1/user/me": {
      ...getUser,
    },
    "/v1/user/:id": {
      ...getUserById,
      ...updateUser,
      ...deleteUser,
      ...deactivateUser
    },
  },
};
