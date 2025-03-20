import Traveller from "../models/traveller-model.js";

export const travellerValidationSchema ={
    name:{
        exists:{
            errorMessage:"name field is Required"
        },
        notEmpty:{
            errorMessage:"name cannot be empty"
        },
        isLength:{
            options:{min:2,max:50},
            errorMessage:"Name should be between 2 to 50 characters"
        },
        trim:true
    },
    aadharCard:{
        exists:{
            errorMessage:"Aadhar Card field is required"
        },
        notEmpty:{
            errorMessage:"Aadhar Card can not be Empty"
        },
        matches:{
            options:/^\d{12}$/,
            errorMessage:"Aadhar card must be a valid 12 digit number"
        },
        trim:true
    },
    userId:{
        exists:{
            errorMessage:"User ID field is required"
        },
        notEmpty:{
            errorMessage:"User ID cannot be empty"
        },
        isMongoId:{
            errorMessage:"User ID must be a valid MongoDB ObjectId"
        }
    },
    isApproved:{
        exists:{
            errorMessage:" Approval Status field is required"
        },
        notEmpty:{
            errorMessage:"Approval Status cannot be Empty"
        },
        isBoolean:{
            errorMessage:"Approval status must be true or false"
        }
    }
}