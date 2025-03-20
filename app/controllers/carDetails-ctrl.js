import CarDetails from "../models/carDetails-model.js";
import { validationResult } from "express-validator";
import _ from "lodash";

import { mailToAdmin ,sendMail } from "../utils/nodemailer.js";
import Stripe from "stripe"
import dotenv from "dotenv"
import cloudinary from "../utils/cloudinary.js";

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


const carDetailsCtrl = {};


carDetailsCtrl.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const body = _.pick(req.body, [
            "carModel",
            "carNumber",
            "seatingCapacity",
            "source",
            "destination",
            "departureDateTime",
            "price",
            "mobileNumber",
            "pickupLocation"
        ]);

        if (req.files) {
            body.photos = req.files.photos?.map(file => file.path) || [];
            body.insurance = req.files.insurance?.[0]?.path || "";
            body.drivingLicence = req.files.drivingLicence?.[0]?.path || "";
        }

        body.carOwnerId = req.currentUser.userId;

        const carDetails = new CarDetails(body);
        await carDetails.save();

        res.status(201).json(carDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};


carDetailsCtrl.approve = async (req, res) => {
    if (req.currentUser.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized action" });
    }

    try {
        const id = req.params.id;
        const carDetails = await CarDetails.findByIdAndUpdate(
            id,
            { isApproved: true },
            { new: true, runValidators: true }
        );

        if (!carDetails) {
            return res.status(404).json({ error: "Record not found" });
        }
       
       const carOwner = await CarOwner.findById(carDetails.carOwnerId);
       if (!carOwner) {
           return res.status(404).json({ error: "Car owner not found" });
       }
       console.log(`Car Owner: ${carOwner.name}, Email: ${carOwner.email}`);
        if (!carOwner.stripeAccountId) {

            console.log("No Stripe account found. Creating new one...");

            const account = await stripe.accounts.create({
                type: "express",
                email: carOwner.email,
                country: "US",
                capabilities: {
                    transfers: { requested: true },
                },
            });

            console.log("Stripe Account Created: ", account.id)
            carOwner.stripeAccountId = account.id;
            await carOwner.save();
        }

        const accountLink = await stripe.accountLinks.create({
            account: carOwner.stripeAccountId,
            refresh_url: "http://localhost:3000/stripe-onboarding",
            return_url: "http://localhost:3000/",
            type: "account_onboarding",
        });
        
        console.log("Stripe Onboarding Link: ", accountLink.url);
         
         try {
            console.log(`Sending email to car owner: ${carOwner.email}`);
            await sendMail(
                carOwner.email,
                "Complete Your Stripe Registration",
                `Hi ${carOwner.name},
                Your car '${carDetails.carModel}' has been verified! To receive payments from users, please complete your Stripe registration by clicking the link below:
                ➡️ [Complete Stripe Setup](${accountLink.url})
                Thank You.`
            );
            console.log("Email successfully sent to car owner.");
        } catch (emailError) {
            console.error("Error sending email to car owner:", emailError);
        }

        
        try {
            console.log("Sending email notification to admin...");
            await mailToAdmin(
                "Car Verification Approved",
                `The car '${carDetails.carModel}' (Owner: ${carOwner.name}, Email: ${carOwner.email}) has been successfully verified.`
            );
            console.log("Admin notification email sent.");
        } catch (adminEmailError) {
            console.error("Error sending email to admin:", adminEmailError);
        }
        res.json({ message: "Car approved and email sent", carDetails });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};


carDetailsCtrl.list = async (req, res) => {
    try {
        const carDetails = await CarDetails.find({ isApproved: true });
        res.json(carDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};


carDetailsCtrl.getById = async (req, res) => {
    try {
        const id = req.params.id;
        const carDetails = await CarDetails.findOne({ _id: id, isApproved: true });

        if (!carDetails) {
            return res.status(404).json({ error: "Record not found" });
        }
        res.json(carDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};



carDetailsCtrl.update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const id = req.params.id;
        const body = _.pick(req.body, ["carModel", "carNumber", "seatingCapacity"]);

        if (req.files?.photos?.[0]?.path) {
            body.photos = req.files.photos[0].path;
        }
        if (req.files?.insurance?.[0]?.path) {
            body.insurance = req.files.insurance[0].path;
        }
        if (req.files?.drivingLicence?.[0]?.path) {
            body.drivingLicence = req.files.drivingLicence[0].path;
        }

        let carDetails;
        if (req.currentUser.role === "admin") {
            carDetails = await CarDetails.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        } else {
            carDetails = await CarDetails.findOneAndUpdate(
                { _id: id, carOwnerId: req.currentUser.id },
                body,
                { new: true, runValidators: true }
            );
        }

        if (!carDetails) {
            return res.status(404).json({ error: "Record not found" });
        }
        res.json(carDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};


carDetailsCtrl.delete = async (req, res) => {
    try {
        const id = req.params.id;
        let carDetails;

        if (req.currentUser?.role === "admin") {
            carDetails = await CarDetails.findByIdAndDelete(id);
        } else {
            carDetails = await CarDetails.findOneAndDelete({ _id: id, carOwnerId: req.currentUser.id });
        }

        if (!carDetails) {
            return res.status(404).json({ error: "Record not found" });
        }
        res.json({ message: "Car details deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};


    carDetailsCtrl.getMyCars = async (req, res) => {
        try {
            const cars = await CarDetails.find().populate('carOwnerId', 'name email')
            res.json(cars);
        } catch (err) {
            res.status(500).json({ error: err.message || "Something went wrong" });
        }
    }


carDetailsCtrl.verify = async (req, res) => {
   
    const id = req.params.id;
    const body = req.body;
    console.log(body)

    try {
        const car = await CarDetails.findOneAndUpdate({ _id: id }, body, { 
            new: true, 
            runValidators: true 
        }).populate("carOwnerId");

        if (!car) {
            return res.status(404).json("Car not available");
        }

       
        return res.status(200).json(car);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
 
};


export default carDetailsCtrl;
