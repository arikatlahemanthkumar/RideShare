import {Schema,model} from "mongoose"
const notificationSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
    message: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['payment', 'booking', 'cancellation'], 
        required: true },
    isRead: { type: Boolean, default: false },
   
  },{timestamps:true});
  
  const Notification = model ('Notification', notificationSchema)
  export default Notification