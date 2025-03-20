import { Schema,model } from "mongoose";
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type:String,
      required : true,
      enum :['admin','carOwner','traveller']
    },
    stripeAccountId: { type: String, required: false }


    
  },{timestamps:true});
  
const User = model ('User', UserSchema)

export default User