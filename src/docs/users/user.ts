export const createUser = {
  post: {
    tags: ["User Operations"],
    description: "Register a new user",
    operationId: "registerUser",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UserInput",
          },
        },
      },
    },
    responses: {
      "201": {
        description: "User created successfully",
        content: {
          "application/json": {
            example: {
              success: true,
              message: "Registeration Successful",
              data: {
                token: "your_generated_token_here",
              },
            },
          },
        },
      },
      "400": {
        description: "Bad request. Please provide valid user data.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["your_error_messages_here"],
            },
          },
        },
      },
      "500": {
        description: "Server error. Please try again later.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["your_error_messages_here"],
            },
          },
        },
      },
    },
  },
};

export const loginUser = {
  post: {
    tags: ["User Operations"],
    description: "Authenticate and login a user",
    operationId: "loginUser",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/LoginInput",
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Login successful",
        content: {
          "application/json": {
            example: {
              success: true,
              message: "Login Successful",
              data: {
                token: "your_generated_token_here",
              },
            },
          },
        },
      },
      "400": {
        description: "Bad request. Please provide valid login credentials.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["your_error_messages_here"],
            },
          },
        },
      },
      "401": {
        description: "Unauthorized. Invalid credentials.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["your_error_messages_here"],
            },
          },
        },
      },
      "500": {
        description: "Server error. Please try again later.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["your_error_messages_here"],
            },
          },
        },
      },
    },
  },
};

export const getUser = {
  get: {
    tags: ["User Operations"],
    description: "Retrieves information about the current authenticated user.",
    operationId: "getUser",
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {
      "200": {
        description: "Successful operation",
        content: {
          "application/json": {
            example: {
              success: true,
              message: "Successful",
              data: {
                _id: "65968839dd7fefd70250e5e8",
                firstname: "Jane",
                lastname: "Doe",
                email: "temitoyosi@gmail.com",
                dateOfBirth: "2024-01-04T10:15:20.605Z",
                phoneNumber: "+2347083992112",
                gender: "female",
                country: "NG",
                roles: [],
                createdAt: "2024-01-04T10:28:09.951Z",
                updatedAt: "2024-01-04T18:05:15.488Z",
              },
            },
          },
        },
      },
      "401": {
        description: "Unauthorized. User does not exist or invalid token.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["User does not exist"],
            },
          },
        },
      },
      "500": {
        description: "Internal Server Error. Please try again later.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["Internal Server Error. Please try again later."],
            },
          },
        },
      },
    },
  },
};

export const getUserById = {
  get: {
    tags: ["User Operations"],
    description: "Retrieves information about the current authenticated user.",
    operationId: "getUserById",
    parameters: [
      {
        name: "id",
        in: "path",
        description: "ID of the user to be updated",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {
      "200": {
        description: "Successful operation",
        content: {
          "application/json": {
            example: {
              success: true,
              message: "Successful",
              data: {
                _id: "65968839dd7fefd70250e5e8",
                firstname: "Jane",
                lastname: "Doe",
                email: "temitoyosi@gmail.com",
                dateOfBirth: "2024-01-04T10:15:20.605Z",
                phoneNumber: "+2347083992112",
                gender: "female",
                country: "NG",
                roles: [],
                createdAt: "2024-01-04T10:28:09.951Z",
                updatedAt: "2024-01-04T18:05:15.488Z",
              },
            },
          },
        },
      },
      "401": {
        description: "Unauthorized. User does not exist or invalid token.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["User does not exist"],
            },
          },
        },
      },
      "500": {
        description: "Internal Server Error. Please try again later.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["Internal Server Error. Please try again later."],
            },
          },
        },
      },
    },
  },
};

export const updateUser = {
  put: {
    tags: ["User Operations"],
    description: "Update a user",
    operationId: "updateUser",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: "id",
        in: "path",
        description: "ID of the user to be updated",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateUserInput",
          },
        },
      },
    },
    responses: {
      "201": {
        description: "User updated successfully",
        content: {
          "application/json": {
            example: {
              success: true,
              message: "User updated successfully",
              data: {
                user: {
                  _id: "",
                  firstname: "",
                  lastname: "",
                  email: "",
                  dateOfBirth: "",
                  phoneNumber: "",
                  gender: "",
                  country: "",
                  avatar: "",
                },
              },
            },
          },
        },
      },
      "400": {
        description: "Bad request. Please provide valid user data.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["your_error_messages_here"],
            },
          },
        },
      },
      "500": {
        description: "Server error. Please try again later.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["your_error_messages_here"],
            },
          },
        },
      },
    },
  },
};

export const deleteUser = {
  delete: {
    tags: ["User Operations"],
    description: "Deletes a user by ID",
    operationId: "deleteUser",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: "id",
        in: "path",
        description: "ID of the user to be deleted",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      "200": {
        description: "Successful operation",
        content: {
          "application/json": {
            example: {
              success: true,
              message: "User deleted successfully",
              data: {},
            },
          },
        },
      },
      "400": {
        description: "Bad request. User ID is required.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["User ID is required"],
            },
          },
        },
      },
      "401": {
        description: "Unauthorized. User not found or invalid credentials.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["User not found"],
            },
          },
        },
      },
      "404": {
        description: "Not Found. User not found.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["User not found"],
            },
          },
        },
      },
      "500": {
        description: "Internal Server Error. Please try again later.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["Internal Server Error. Please try again later."],
            },
          },
        },
      },
    },
  },
};

export const deactivateUser = {
  patch: {
    tags: ["User Operations"],
    description: "Deactivates and reactivates a user by ID",
    operationId: "deactivateUser",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: "id",
        in: "path",
        description: "ID of the user to be deactivated or reactivated",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      "200": {
        description: "Successful operation",
        content: {
          "application/json": {
            example: {
              success: true,
              message:
                "User closed successfully | User reactivated successfully",
              data: {},
            },
          },
        },
      },
      "400": {
        description: "Bad request. User ID is required.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["User ID is required"],
            },
          },
        },
      },
      "401": {
        description: "Unauthorized. User not found or invalid credentials.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["User not found"],
            },
          },
        },
      },
      "404": {
        description: "Not Found. User not found.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["User not found"],
            },
          },
        },
      },
      "500": {
        description: "Internal Server Error. Please try again later.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["Internal Server Error. Please try again later."],
            },
          },
        },
      },
    },
  },
};

export const forgotPassword = {
  post: {
    tags: ["User Operations"],
    description: "Initiate password reset for a user",
    operationId: "forgotPassword",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ForgotPasswordInput",
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Password reset initiated successfully",
        content: {
          "application/json": {
            example: {
              success: true,
              message: "Password reset email sent successfully",
              data: { otp: "123456" },
            },
          },
        },
      },
      "400": {
        description: "Bad request. Please provide valid email address.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: [
                "Please provide an email address",
                "Please provide a valid email address",
              ],
            },
          },
        },
      },
      "404": {
        description:
          "User not found. The provided email does not exist in our records.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["User does not exist"],
            },
          },
        },
      },
      "500": {
        description: "Server error. Please try again later.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["Internal server error"],
            },
          },
        },
      },
    },
  },
};
export const forgotPasswordVerifyOtp = {
  post: {
    tags: ["User Operations"],
    description: "Verify OTP to complete the password reset process",
    operationId: "forgotPasswordVerifyOtp",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/VerifyOtpInput",
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Password reset successful",
        content: {
          "application/json": {
            example: {
              success: true,
              message: "Password reset successful",
              data: {},
            },
          },
        },
      },
      "400": {
        description: "Bad request. Please provide valid OTP and email address.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["Please provide a valid OTP"],
            },
          },
        },
      },
      "401": {
        description: "Provided OTP is invalid or expired.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["Invalid or expired OTP"],
            },
          },
        },
      },
      "404": {
        description:
          "User not found. The provided email does not exist in our records.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["User does not exist"],
            },
          },
        },
      },
      "500": {
        description: "Server error. Please try again later.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["Internal server error"],
            },
          },
        },
      },
    },
  },
};

export const resetPassword = {
  post: {
    tags: ["User Operations"],
    description: "Reset user password after OTP and email verification",
    operationId: "resetPassword",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ResetPasswordInput",
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Password reset successful",
        content: {
          "application/json": {
            example: {
              success: true,
              message: "Password reset successful",
              data: {},
            },
          },
        },
      },
      "400": {
        description: "Bad request. Invalid password.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["Invalid password. Please provide a valid password."],
            },
          },
        },
      },
      "500": {
        description: "Server error. Please try again later.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["Internal Server Error. Please try again later."],
            },
          },
        },
      },
    },
  },
};

export const changePassword = {
  post: {
    tags: ["User Operations"],
    description: "Change user password",
    operationId: "changePassword",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ChangePasswordInput",
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Password change successful",
        content: {
          "application/json": {
            example: {
              success: true,
              message: "Password change successful",
              data: {},
            },
          },
        },
      },
      "400": {
        description: "Bad request. Invalid password.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["Password is icorrect."],
            },
          },
        },
      },
      "500": {
        description: "Server error. Please try again later.",
        content: {
          "application/json": {
            example: {
              success: false,
              errors: ["Internal Server Error. Please try again later."],
            },
          },
        },
      },
    },
  },
};
