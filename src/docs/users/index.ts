import {
  createUser,
  loginUser,
  forgotPassword,
  forgotPasswordVerifyOtp,
  resetPassword,
  getUser
} from "./user";

export const userOperations = {
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
    "/v1/user/me": {
      ...getUser,
    },
  },
};
