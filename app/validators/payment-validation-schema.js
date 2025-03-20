import Payment from "../models/payment-model.js";
import Booking from "../models/booking-model.js";
import Traveller from "../models/traveller-model.js";

export const paymentValidationSchema = {
  bookingId: {
    exists: {
      errorMessage: "Booking ID field is required",
    },
    notEmpty: {
      errorMessage: "Booking ID cannot be empty",
    },
    isMongoId: {
      errorMessage: "Booking ID must be a valid MongoDB ObjectId",
    },
    custom: {
      options: async (value) => {
        const booking = await Booking.findById(value);
        if (!booking) {
          throw new Error("Booking with the given ID does not exist");
        }
        return true;
      },
    },
  },
  travellerId: {
    exists: {
      errorMessage: "Traveller ID field is required",
    },
    notEmpty: {
      errorMessage: "Traveller ID cannot be empty",
    },
    isMongoId: {
      errorMessage: "Traveller ID must be a valid MongoDB ObjectId",
    },
    custom: {
      options: async (value) => {
        const traveller = await Traveller.findById(value);
        if (!traveller) {
          throw new Error("Traveller with the given ID does not exist");
        }
        return true;
      },
    },
  },
  amountPaid: {
    exists: {
      errorMessage: "Amount paid field is required",
    },
    notEmpty: {
      errorMessage: "Amount paid cannot be empty",
    },
    isFloat: {
      options: { min: 0 },
      errorMessage: "Amount paid must be a positive number",
    },
  },
  paymentDate: {
    exists: {
      errorMessage: "Payment date field is required",
    },
    notEmpty: {
      errorMessage: "Payment date cannot be empty",
    },
    isISO8601: {
      errorMessage: "Payment date must be a valid date format (ISO 8601)",
    },
    custom: {
      options: (value) => {
        if (new Date(value) > new Date()) {
          throw new Error("Payment date cannot be in the future");
        }
        return true;
      },
    },
  },
  receipt: {
    exists: {
      errorMessage: "Receipt field is required",
    },
    notEmpty: {
      errorMessage: "Receipt cannot be empty",
    },
    isString: {
      errorMessage: "Receipt must be a valid string",
    },
    trim: true,
  },
};
