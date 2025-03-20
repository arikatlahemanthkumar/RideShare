import CarDetails from "../models/carDetails-model.js";

export const carDetailsValidationSchema = {
    carModel:{
        exists:{
            errorMessage:"car model field is required"
        },
        notEmpty:{
            errorMessage:"car model cannot be empty"
        },
        isLength:{
            options:{min:2,max:50},
            errorMessage:"Car model should be between 2 to 50 characters"
        },
        trim:true
    },
    carNumber:{
        exists:{
            errorMessage:" car number field is required"
        },
        notEmpty:{
            errorMessage:" car number cannot be empty"
        },
        isLength:{
            options:{min:6,max:12},
            errorMessage:"Car number must be alphanumeric and 6-12 characters long"
        },
        trim:true
    },
    seatingCapacity:{
        exists:{
            errorMessage:" Seating Capacity field is required"
        },
        notEmpty:{
            errorMessage:"Seating Capacity can not be empty"
        },
        isInt:{
            options:{min:1, max:5 },
            errorMessage:" Seating capacity must be a number between 1 and 5"
        },
        trim:true
    },
    photos:{
        exists:{
            errorMessage:" Car Photos field is required"
        },
        notEmpty:{
            errorMessage:"Car Photo can not be empty"
        },
        isURL:{
            errorMessage:"Car Photo must be a valid URL"
        },
        trim: true
    },
    insurance: {
        exists: {
          errorMessage: "Insurance document field is required",
        },
        notEmpty: {
          errorMessage: "Insurance document cannot be empty",
        },
        isURL: {
          errorMessage: "Insurance document must be a valid URL",
        },
        trim: true,
    },
    drivingLicence: {
        exists: {
          errorMessage: "Driving license field is required",
        },
        notEmpty: {
          errorMessage: "Driving license cannot be empty",
        },
        isURL: {
          errorMessage: "Driving license must be a valid URL",
        },
        trim: true,
    },
    carOwnerId:{
        exists:{
            errorMessage : "car owner ID field is required"
        },
        notEmpty:{
            errorMessage:"Car Owner ID cannot be empty"
        },
        isMongoId:{
            errorMessage:"Car owner ID must be a valid MongoDB ObjectId"
        },
        trim:true
    },
    isApproved:{
        exists:{
            errorMessage:"Approval Status field is required"
        },
        notEmpty:{
            errorMessage:"Approval Status cannot be Empty"
        },
        isBoolean:{
            errorMessage:"Approval Status must be true or false"
        }
    }
}