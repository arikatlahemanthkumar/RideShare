import Trip from "../models/trip-model.js"

export const tripValidationSchema = {
    carOwnerId:{
        exists: {
            errorMessage: "Car owner ID field is required",
          },
          notEmpty: {
            errorMessage: "Car owner ID cannot be empty",
          },
          isMongoId: {
            errorMessage: "Car owner ID must be a valid MongoDB ObjectId",
          },
          custom:{
            options:async (value)=>{
                const carOwner = await User.findById(value)
                if(!carOwner){
                    throw new Error("Car owner with the given ID does not exist")
                }
                return true
            }
          }
    },
    carId:{
        exists: {
            errorMessage: "Car ID field is required",
          },
          notEmpty: {
            errorMessage: "Car ID cannot be empty",
          },
          isMongoId: {
            errorMessage: "Car ID must be a valid MongoDB ObjectId",
          },
          custom:{
            options:async(value)=>{
                const car = await CarDetails.findById(value)
                if(!car){
                    throw new Error("Car with the given ID does not exist")
                }
                return true
            }
          }

    },
    journeyDatetime:{
        exists: {
            errorMessage: "Journey date and time field is required",
        },
        notEmpty: {
            errorMessage: "Journey date and time cannot be empty",
        },
        isISO8601: {
            errorMessage: "Journey date and time must be in ISO8601 format",
        },
        custom:{
            options:async(value)=>{
                const journeyDate = new Date(value)
                if(journeyDate< new Date()){
                    throw new Error ("journey date and time must be in  future")
                }
                return true
            }
        }
    },
    seats:{
        exists: {
            errorMessage: "Seats field is required",
        },
        isArray: {
            errorMessage: "Seats must be an array",
        },
        custom:{
            options:async(seats)=>{
                if(!Array.isArray(seats)|| seats.length === 0){
                    throw new Error ("seats array can not be empty")
                }
                for(const seat of seats){
                    if(!seat.seatId || typeof seat.seatId !== "string"){
                        throw new Error ("Each seat must have a valid seatId")
                    }
                    if(typeof seats.isBooked !== "boolean"){
                        throw new Error("Each seat must have a valid isBooked status")
                    }
                }
            }
        },
    },
    source:{
        exists: {
            errorMessage: "Source field is required",
          },
          notEmpty: {
            errorMessage: "Source cannot be empty",
          },
          isLength: {
            options: { min: 2, max: 100 },
            errorMessage: "Source must be between 2 to 100 characters",
          },
          trim: true,
    },
    destination:{
        exists: {
            errorMessage: "Destination field is required",
          },
          notEmpty: {
            errorMessage: "Destination cannot be empty",
          },
          isLength: {
            options: { min: 2, max: 100 },
            errorMessage: "Destination must be between 2 to 100 characters",
          },
          trim: true,
    },
    status:{
        exists:{
            errorMessage:"Status field is required"
        },
        notEmpty: {
            errorMessage: "Status cannot be empty",
        },
        isIn:{
            options:[["unBooked","booked","completed","cancelled"]],
            errorMessage:"Status must be one of unBooked, booked, completed, or cancelled"
        }
    },
    amount: {
        exists: {
          errorMessage: "Amount field is required",
        },
        notEmpty: {
          errorMessage: "Amount cannot be empty",
        },
        isFloat: {
          options: { min: 0 },
          errorMessage: "Amount must be a positive number",
        }
    },
    history: {
      in: ["body"],
      optional: true, 
      isArray: {
        errorMessage: "History should be an array",
      },
      custom: {
        options: (history) => {
          
          if (history) {
            return history.every((record) => {
              return (
                typeof record.userId === "string" &&
                typeof record.bookingId === "string" &&
                typeof record.paymentId === "string" &&
                typeof record.completed === "boolean" &&
                (record.tripDate ? !isNaN(Date.parse(record.tripDate)) : true)
              );
            });
          }
          return true; 
        },
        errorMessage: "Each history record must have valid fields: userId, bookingId, paymentId, completed, and optional tripDate.",
      },
    },

}

/* The .every() method is used to ensure that every item in the history array must meet the following conditions:
record.userId should be a string.
record.bookingId should be a string.
record.paymentId should be a string.
record.completed should be a boolean value.
record.tripDate is optional, so if it's provided, it must be a valid date. We check this by using Date.parse() and ensuring it's a valid date (i.e., !isNaN(Date.parse(record.tripDate))). */