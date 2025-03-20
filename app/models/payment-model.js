import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking"},
    travellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    carOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tripId:{type:mongoose.Schema.Types.ObjectId,ref:"Trip"},
    amount: { type: Number },
    adminFee: { type: Number },
    carOwnerFee: { type: Number},
    transactionId: { type: String  },
    paymentDate: { type: Date, default: Date.now },
    paymentStatus: { type: String, enum: ["pending", "successful", "failed"], default: "pending" },
    paymentType:{type:String ,default :'card'}
    
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;



