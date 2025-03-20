import { Schema, model } from "mongoose"
const bookingSchema = new Schema({
    travellerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Traveller"
    },
    tripId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Trip"
    },
    seatIds: [{ type: String, required: true }],
    name:{type:String ,required:true},
    phoneNumber:{type:Number , required:true},
    numberOfPersons:{type:Number,required:true},
    totalAmount: { type: Number, required: true },
    
    isApproved: { type: Boolean, required: true, default: false }

})

const Booking = model('Booking', bookingSchema)
export default Booking