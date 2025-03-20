import {Schema, model} from "mongoose"
const cardetailsSchema  = new Schema({
    carModel : {type:String,required:true},
    carNumber : {type:String,required:true},
    seatingCapacity :{type:Number,required:true},
    photos: { type: [String],required:true }, 
    insurance: { type: String, required: true }, 
    drivingLicence: { type: String, required: true },
    carOwnerId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    source:{type:String,required:true},
    destination:{type:String,required:true},
    departureDateTime:{type:Date,required:true},
    price:{type:String,required:true},
    mobileNumber:{type:Number,required:true},
    pickupLocation:{type:String,required:true},
    isApproved:{type:Boolean, default:'false'},
    stripeAccountId:{type:String}

},{timestamps:true})
const CarDetails = model ('CarDetails',cardetailsSchema)

export default CarDetails


