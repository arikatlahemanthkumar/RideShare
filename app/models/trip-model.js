import {Schema,model} from "mongoose"
const tripSchema = new Schema ({
    carOwnerId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    carId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"CarDetails"
    },
    journeyDatetime:{type:Date,required:true},
    seats:{
        type:[
            {
            seatId:{type:String,required:true},
            isBooked: { type: Boolean, required: true, default: false },
            userId: { type:Schema.Types.ObjectId, ref:'User'}
            },
        ],
        default:[],
    },
    source:{type:String , required :true},
    destination:{type:String , required:true},
    status:{
        type:String,
        required:true,
        default:"unBooked"
    },
    amount :{type:Number,required:true , alias:"price"},
    isApproved:{type:Boolean,default:false}
    

},{timestamps:true})

const Trip = model ('Trip',tripSchema)
export default Trip