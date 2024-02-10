export const components = {
  components: {
    schemas: {
      _id: {
        type: "string",
        description: "An identifier for a user",
        example: "6579cc48e84bc13b0ca26fbc",
      },
      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "User identification number",
            example: "ytyVgh",
          },
          email: {
            type: "string",
            description: "User's email address",
            example: "user@example.com",
          },
          password: {
            type: "string",
            description: "User's hashed password",
            example: "hashed_password_here",
          },
        },
      },
      UserInput: {
        type: "object",
        properties: {
          firstname: {
            type: "string",
            description: "User's first name",
            example: "Jane",
          },
          lastname: {
            type: "string",
            description: "User's last name",
            example: "Doe",
          },
          email: {
            type: "string",
            description: "User's email address",
            example: "user@example.com",
          },
          phoneNumber: {
            type: "string",
            description: "User's phone number",
            example: "+2347083992112",
          },
          country: {
            type: "string",
            description: "User's country code",
            example: "NG",
          },
          avatar: {
            type: "string",
            description: "User's avatar",
            example:
              "https://{PUBLIC_S3_BUCKET_NAME}.s3.eu-west-2.amazonaws.com/{file_key}",
          },
          gender: {
            type: "string",
            description: "User's gender",
            example: "female",
          },
          dateOfBirth: {
            type: "date",
            description: "User's date of birth",
            example: new Date(),
          },
          password: {
            type: "string",
            description: "User's password",
            example: "password",
          },
        },
        required: ["email", "password"],
      },
      UpdateUserInput: {
        type: "object",
        properties: {
          phoneNumber: {
            type: "string",
            description: "User's phone number",
            example: "+2347083992112",
          },
          country: {
            type: "string",
            description: "User's country code",
            example: "NG",
          },
          avatar: {
            type: "string",
            description: "User's avatar",
            example:
              "https://{PUBLIC_S3_BUCKET_NAME}.s3.eu-west-2.amazonaws.com/{file_key}",
          },
          gender: {
            type: "string",
            description: "User's gender",
            example: "female",
          },
        },
        required: ["email", "password"],
      },
      LoginInput: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "User's email address for login",
            example: "user@example.com",
          },
          password: {
            type: "string",
            description: "User's password for login",
            example: "password_here",
          },
        },
      },
      ForgotPasswordInput: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "User's email address for login",
            example: "user@example.com",
          },
        },
      },
      VerifyOtpInput: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "User's email address",
            example: "user@example.com",
          },
          otp: {
            type: "string",
            description: "User's one time password (6 digits)",
            example: "123456",
          },
          type: {
            type: "string",
            description: "User's type of OTP",
            example: "forgot",
          },
        },
      },
      ResetPasswordInput: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "User's email address",
            example: "user@example.com",
          },
          newPassword: {
            type: "string",
            description: "User's new password",
            example: "new_password_here",
          },
          otp: {
            type: "string",
            description: "User's one time password (6 digits)",
            example: "123456",
          },
          type: {
            type: "string",
            description: "User's type of OTP",
            example: "forgot",
          },
        },
      },
      ChangePasswordInput: {
        type: "object",
        properties: {
          password: {
            type: "string",
            description: "User's password",
            example: "password_here",
          },
          newPassword: {
            type: "string",
            description: "User's new password",
            example: "new_password_here",
          },
        },
      },
      Token: {
        type: "object",
        properties: {
          token: {
            type: "string",
            description: "JWT token for authentication",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Error message",
          },
          internal_code: {
            type: "string",
            description: "Internal error code",
          },
        },
      },
    },
  },
};
