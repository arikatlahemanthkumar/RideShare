import User from "../models/user-model.js";

export const notificationValidationSchema = {
  userId: {
    exists: {
      errorMessage: "User ID is required",
    },
    notEmpty: {
      errorMessage: "User ID cannot be empty",
    },
    isMongoId: {
      errorMessage: "User ID must be a valid MongoDB ObjectId",
    },
    custom: {
      options: async (value) => {
        const userExists = await User.findById(value);
        if (!userExists) {
          throw new Error("User with the given ID does not exist");
        }
        return true;
      },
    },
  },
  message: {
    exists: {
      errorMessage: "Message is required",
    },
    notEmpty: {
      errorMessage: "Message cannot be empty",
    },
    isString: {
      errorMessage: "Message must be a string",
    },
    isLength: {
      options: { max: 500 },
      errorMessage: "Message must not exceed 500 characters",
    },
  },
  type: {
    exists: {
      errorMessage: "Type is required",
    },
    notEmpty: {
      errorMessage: "Type cannot be empty",
    },
    isString: {
      errorMessage: "Type must be a string",
    },
    isIn: {
      options: [["payment", "booking", "cancellation"]],
      errorMessage: "Type must be one of 'payment', 'booking', or 'cancellation'",
    },
  },
  isRead: {
    optional: true,
    isBoolean: {
      errorMessage: "isRead must be a boolean value",
    },
  },
};
