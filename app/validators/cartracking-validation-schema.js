import CarTracking from "../models/car-tracking-model.js";
import User from "../models/user-model.js";

export const carTrackingValidationSchema = {
  carOwnerId: {
    exists: {
      errorMessage: "Car owner ID is required",
    },
    notEmpty: {
      errorMessage: "Car owner ID cannot be empty",
    },
    isMongoId: {
      errorMessage: "Car owner ID must be a valid MongoDB ObjectId",
    },
    custom: {
      options: async (value) => {
        const user = await User.findById(value);
        if (!user) {
          throw new Error("Car owner with the given ID does not exist");
        }
        return true;
      },
    },
  },
  "currentLocation.latitude": {
    exists: {
      errorMessage: "Current location latitude is required",
    },
    notEmpty: {
      errorMessage: "Latitude cannot be empty",
    },
    isFloat: {
      options: { min: -90, max: 90 },
      errorMessage: "Latitude must be a number between -90 and 90",
    },
  },
  "currentLocation.longitude": {
    exists: {
      errorMessage: "Current location longitude is required",
    },
    notEmpty: {
      errorMessage: "Longitude cannot be empty",
    },
    isFloat: {
      options: { min: -180, max: 180 },
      errorMessage: "Longitude must be a number between -180 and 180",
    },
  },
  "route.*.latitude": {
    exists: {
      errorMessage: "Route latitude is required",
    },
    notEmpty: {
      errorMessage: "Latitude in the route cannot be empty",
    },
    isFloat: {
      options: { min: -90, max: 90 },
      errorMessage: "Route latitude must be a number between -90 and 90",
    },
  },
  "route.*.longitude": {
    exists: {
      errorMessage: "Route longitude is required",
    },
    notEmpty: {
      errorMessage: "Longitude in the route cannot be empty",
    },
    isFloat: {
      options: { min: -180, max: 180 },
      errorMessage: "Route longitude must be a number between -180 and 180",
    },
  },
  "route.*.timestamp": {
    exists: {
      errorMessage: "Route timestamp is required",
    },
    notEmpty: {
      errorMessage: "Route timestamp cannot be empty",
    },
    isISO8601: {
      errorMessage: "Timestamp must be a valid ISO8601 date",
    },
  },
  lastUpdated: {
    exists: {
      errorMessage: "Last updated timestamp is required",
    },
    notEmpty: {
      errorMessage: "Last updated cannot be empty",
    },
    isISO8601: {
      errorMessage: "Last updated must be a valid ISO8601 date",
    },
    custom: {
      options: (value) => {
        if (new Date(value) > new Date()) {
          throw new Error("Last updated timestamp cannot be in the future");
        }
        return true;
      },
    },
  },
};
