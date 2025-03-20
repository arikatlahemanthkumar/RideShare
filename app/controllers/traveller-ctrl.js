import Traveller from "../models/traveller-model.js";
import User from "../models/user-model.js"
import { validationResult } from "express-validator";
import _ from "lodash";
import cloudinary from "../utils/cloudinary.js";

const travellerCtrl = {};

travellerCtrl.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const body = _.pick(req.body, ["name", "aadharCard", "mobileNumber", "gender", "emergencyContact",  "address"]);
    console.log(body);

    try {
        console.log(req.files);

        if (body.name && typeof body.name === "string") {
            body.name = JSON.parse(body.name);
        }
        if (body.gender && typeof body.gender === "string") {
            body.gender = JSON.parse(body.gender);
        }
        if (req.files?.aadharCard) {
            body.aadharCard = req.files.aadharCard[0].path;
        }

        const traveller = new Traveller(body);
        traveller.userId = req.currentUser.userId;

        console.log(traveller);
        await traveller.save();
        res.status(201).json(traveller);
    } catch (err) {
        console.error("Error creating traveller:", err);
        res.status(500).json({ errors: "Something went wrong", details: err.message });
    }
};

travellerCtrl.approve = async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    try {
        const traveller = await Traveller.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!traveller) {
            return res.status(404).json({ error: "Record not found" });
        }
        res.json(traveller);
    } catch (err) {
        console.error("Error approving traveller:", err);
        res.status(500).json({ error: "Something went wrong", details: err.message });
    }
};

travellerCtrl.list = async (req, res) => {
    try {
        
        const users = await User.find({ role: "traveller" }).lean();
        const travellers = await Traveller.find().populate("userId").lean();

        
        const mergedTravellers = users.map(user => {
            const traveller = travellers.find(t => t.userId?._id.toString() === user._id.toString());
            return traveller || {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: null,
                aadharCard: null,
                gender: null,
                address: null,
                emergencyContact: null,
                isApproved: false,
                userId: user._id
            };
        });

        res.json(mergedTravellers);
    } catch (err) {
        console.error("Error fetching travellers:", err);
        res.status(500).json({ error: "Something went wrong", details: err.message });
    }
};


travellerCtrl.getById =  async (req, res) => {
    try {
        const { id } = req.params;
        const traveller = await Traveller.findOne({userId:id}).populate('userId')

        if (!traveller) {
            return res.status(404).json({ message: "Traveller not found" });
        }
        console.log("Traveller Data Sent to Frontend:", traveller);
        res.json(traveller);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

travellerCtrl.update = async (req, res) => {
    const id = req.params.id;
    console.log("id", id)
    

    try{
        const body = req.body; 

        if (req.files?.aadharCard) {
            body.aadharCard = req.files.aadharCard[0].path;
        }
        
        let traveller = await Traveller.findOne({ userId: id });

        if (!traveller) {
            
            body.userId = id; 
            traveller = new Traveller(body);
            await traveller.save();
        } else {
            
            traveller = await Traveller.findOneAndUpdate(
                { userId: id },
                body,
                { new: true, runValidators: true }
            );
        }
        
        console.log("traveller", traveller)
        res.json(traveller)
    }catch(err){
        console.log(err)
    }

};


travellerCtrl.delete = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const id = req.params.id;
        let traveller;

        if (req.currentUser?.role === "admin") {
            traveller = await Traveller.findByIdAndDelete(id);
        } else {
            traveller = await Traveller.findOneAndDelete({ _id: id, userId: req.currentUser.userId });
        }

        if (!traveller) {
            return res.status(404).json({ error: "Record not found" });
        }

        res.json(traveller);
    } catch (err) {
        console.error("Error deleting traveller:", err);
        res.status(500).json({ error: "Something went wrong", details: err.message });
    }
};

export default travellerCtrl;
