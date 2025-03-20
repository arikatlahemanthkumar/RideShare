import Booking from "../models/booking-model.js";
import Traveller from "../models/traveller-model.js";
import Trip from "../models/trip-model.js";

export const bookingValidationSchema = {
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
    tripId:{
        exists:{
            errorMessage:"Trip ID field is required"
        },
        notEmpty: {
            errorMessage: "Trip ID cannot be empty",
          },
          isMongoId: {
            errorMessage: "Trip ID must be a valid MongoDB ObjectId",
        },
        custom:{
            options:async(value)=>{
                const trip = await Trip.findById(value)
                if(!trip){
                    throw new Error("Trip with the given id does not exist")
                }
                return true
            }
        }
    },
    seatIds:{
        exists:{
            errorMessage:"Seat IDs field is required"
        },
        isArray:{
            errorMessage: "Seat IDs must be an array",  
        },
        custom:{
            options:async(seatIds)=>{
                if(!Array.isArray(seatIds)|| seatIds.length === 0) {
                    throw new Error ("Seat IDs array cannot be empty")
                }
                for(const seat of seatIds){
                    if(typeof seatId !== "string" || seatId.trim() === ""){
                        throw new Error ("Each seat ID must be a non-empty string")
                    }
                }
                return true
            }
        }
    },
    totalAmount: {
        exists: {
          errorMessage: "Total amount field is required",
        },
        notEmpty: {
          errorMessage: "Total amount cannot be empty",
        },
        isFloat: {
          options: { min: 0 },
          errorMessage: "Total amount must be a positive number",
        },
    },
    isApproved: {
        exists: {
          errorMessage: "Approval status field is required",
        },
        notEmpty: {
          errorMessage: "Approval status cannot be empty",
        },
        isBoolean: {
          errorMessage: "Approval status must be a boolean value",
        },
    },
}
