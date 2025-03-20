import {Schema,model} from "mongoose"
const travellerSchema = new Schema ({
    name:{type:String,required:true},
    aadharCard:{type:String,required:true},
    mobileNumber:{type:Number,required:true},
    gender:{type:String,required:true},
    address:{type:String,required:true},
    emergencyContact:{type:Number,required:true},
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    isApproved:{type:Boolean,required:true,default:false}

},{timestamps:true})

const Traveller = model ('Traveller',travellerSchema)
export default Traveller