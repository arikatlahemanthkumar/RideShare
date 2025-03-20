import Review from "../models/review-model.js";
import User from "../models/user-model.js";

export const reviewValidationSchema = {
  carOwnerId: {
    exists: {
      errorMessage: "Car Owner ID is required",
    },
    notEmpty: {
      errorMessage: "Car Owner ID cannot be empty",
    },
    isMongoId: {
      errorMessage: "Car Owner ID must be a valid MongoDB ObjectId",
    },
    custom: {
      options: async (value) => {
        const user = await User.findById(value);
        if (!user) {
          throw new Error("Car Owner with the given ID does not exist");
        }
        return true;
      },
    },
  },
  ratings: {
    exists: {
      errorMessage: "Ratings field is required",
    },
    notEmpty: {
      errorMessage: "Ratings cannot be empty",
    },
    isNumeric: {
      errorMessage: "Ratings must be a numeric value",
    },
    custom: {
      options: (value) => {
        if (value < 1 || value > 5) {
          throw new Error("Ratings must be between 1 and 5");
        }
        return true;
      },
    },
  },
  comments: {
    optional: true,
    isString: {
      errorMessage: "Comments must be a string",
    },
    isLength: {
      options: { max: 500 },
      errorMessage: "Comments must not exceed 500 characters",
    },
  },
};
