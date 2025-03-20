import Booking from "../models/booking-model.js";
import { validationResult } from "express-validator";
import _ from "lodash"
import mongoose from "mongoose";

const bookingCtrl = {}

bookingCtrl.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const body = _.pick(req.body,["tripId", "numberOfPersons" ,"totalAmount","name","phoneNumber","seatIds"])
    if (!body.tripId || !body.numberOfPersons || !body.totalAmount || !body.name || !body.phoneNumber) {
        return res.status(400).json({ error: "All fields are required." });
    }
    try{
        

        const booking = new Booking(body)
        booking.travellerId = req.currentUser.userId

        await booking.save()
        res.status(201).json(booking)
    }catch(err){
        console.error("Error creating booking:", err);
        res.status(500).json({errors:"something went wrong"})
    }
    
}

bookingCtrl.approve = async(req,res)=>{
    
    const id = req.params.id
    const body = req.body
    try{
        const booking = await Booking.findByIdAndUpdate(id,body,{new:true , runValidators:true})
        if(!booking){
          return   res.status(404).json({error:"record not found"})
        }
        res.json(booking)
    }catch(err){
        res.status(500).json({error:"something went wrong"})
    }
}

bookingCtrl.list = async(req,res)=>{
    try{
        const bookings = await Booking.find().populate("travellerId  tripId")
        res.json(bookings)
    }catch(err){
        res.status(500).json({errors:"something went wrong"})
    }
}

bookingCtrl.getById = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const id = req.params.id
        const booking = await Booking.findOne({_id:id})
        if(!booking){
            res.status(404).json({errors:"record not found"})
        }
        res.json(booking)
    }catch(err){
        res.status(500).json({error:"something went wrong"})
    }
}


bookingCtrl.getByTravellerId = async(req,res)=>{
    try{

        console.log("Received Params:", req.params);

        const travellerId = req.params.id
        console.log("Finding bookings for traveller:", travellerId)
        const objectIdTravellerId = new mongoose.Types.ObjectId(travellerId);
        const currentUserId = req.currentUser.userId
        let query = { $or: [
            { travellerId: objectIdTravellerId },
            { 
                travellerId: null,
            }
        ]};
        
        
        if (req.currentUser.role === 'admin') {
            query = {};
        }
        console.log("MongoDB Query:", JSON.stringify(query, null, 2));
        
        const bookings = await Booking.find(query).populate("tripId")
        console.log(`Found ${bookings.length} bookings`);
        
        res.json(bookings)
    }catch(err){
        console.error("Error fetching user bookings:", err)
        res.status(500).json({errors:"something went wrong"})
    }
}

bookingCtrl.getAllBookings = async(req,res)=>{
    try{
        console.log("Fetching all bookings for debugging")
        const allBookings = await Booking.find().populate("tripId travellerId")
        console.log(`Total bookings in system: ${allBookings.length}`)
        res.json(allBookings)
    }catch(err){
        console.error("Error fetching all bookings:", err)
        res.status(500).json({errors:"something went wrong"})
    }
}

bookingCtrl.update = async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id
    const body = _.pick(req.body, ["isApproved"]);
    

    try{
        
        const booking = await Booking.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        
        if(!booking){
            return res.status(404).json({errors:"record not found"})
        }
        return res.json(booking)
    }catch(err){
        res.status(500).json({error:"something went wrong"})
    }
}

bookingCtrl.delete = async(req,res)=>{
    const errors  = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const id = req.params.id
        let booking
        if(req.currentUser?.role === 'admin'){
            booking = await Booking.findByIdAndDelete(id)
        }

        if(!booking){
            return res.status(404).json({error:"record not found"})
        }
        return res.json(booking)
    }catch(err){
        res.status(500).json({error:"something went wrong"})
    }
}

export default bookingCtrl


