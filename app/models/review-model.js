import {Schema, model} from "mongoose" 
const reviewSchema = new Schema({

    carOwnerId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    tripId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Trip"
    },
    ratings:{ 
        type:Number,
        required:true,
        min:1,
        max:5
     },
    comments:{type:String,default:""} 

})

const Review = model ('Review', reviewSchema)
export default Review