import { Schema,model } from "mongoose"
const carTrackingSchema = new Schema({
    carOwnerId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    currentLocation:{
        latitude: {
            type: Number,
            required: true, 
          },
          longitude: {
            type: Number,
            required: true, 
          },
    },
    route:[
        {
          latitude: { type: Number, required: true },
          longitude: { type: Number, required: true },
          timestamp: { type: Date, required: true, default: Date.now },
        },
      ],
    lastUpdated:{
        type: Date,
      required: true,
      default: Date.now,
    }

})

const CarTracking = model ('CarTracking', carTrackingSchema)
export default CarTracking