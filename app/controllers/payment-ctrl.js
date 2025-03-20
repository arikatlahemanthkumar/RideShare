import Payment from "../models/payment-model.js";
import Stripe from "stripe";
import _ from "lodash"

import dotenv from "dotenv";
import User from "../models/user-model.js"
import CarDetails from "../models/carDetails-model.js"
import Booking from "../models/booking-model.js"
import { sendMail } from "../utils/nodemailer.js"

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentCtrl = {};


paymentCtrl.createPayment = async (req, res) => {

    const body = _.pick(req.body, ['carOwnerId', 'travellerId', 'bookingId', 'totalAmount'])
    console.log(req.body)

    try {


        const carOwner = await User.findOne({ _id: body.carOwnerId._id })
        console.log('carowner', carOwner)

        if (!carOwner || !carOwner.stripeAccountId) {
            return res.status(400).json({ error: "Car owner is not connected to Stripe" });
        }

        const adminFee = Math.round(body.totalAmount * 0.20);  
        const carOwnerFee = Math.round(body.totalAmount * 0.80);  

        
        const customer = await stripe.customers.create({
            name: 'Testing',
            address: {
                line1: "India",
                postal_code: "517501",
                city: "Tirupati",
                state: "AP",
                country: "US"
            }
        });
        console.log(customer.id)

        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: `Payment to ${carOwner.name}`
                    },
                    unit_amount: body.totalAmount * 100
                },
                quantity: 1
            }],
            payment_intent_data: {
                application_fee_amount: adminFee * 100, 
                transfer_data: {
                    destination: carOwner.stripeAccountId
                }
            },
            mode: "payment",
            success_url: `http://localhost:3000/payment-success`,
            cancel_url: "http://localhost:3000/payment-rejected",
            customer: customer.id
        });

        
        const payment = new Payment({
            bookingId: body.bookingId,
            travellerId: body.travellerId,
            carOwnerId: body.carOwnerId,
            totalAmount: body.totalAmount,
            adminFee: adminFee,
            carOwnerFee: carOwnerFee,
            transactionId: session.id,
            // paymentStatus: "pending",
            //receipt: session.id
        });
        await payment.save();

        return res.json({ sessionId: session.id, url: session.url });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};



const sendConfirmationEmail = async (booking, carDetails, email) => {
    try {
        if (!email) {
            console.error("🚨 Traveller email is missing. Cannot send email.");
            return;
        }
        console.log(`📧 Preparing to send booking confirmation email to ${email}`);
        
        
        console.log("Booking object:", JSON.stringify(booking, null, 2));
        console.log("Car details object:", JSON.stringify(carDetails, null, 2));
        
        
        let journeyDate = "N/A";
        let journeyTime = "N/A";
        
        
        if (booking.journeyDatetime) {
            journeyDate = new Date(booking.journeyDatetime).toLocaleDateString();
            journeyTime = new Date(booking.journeyDatetime).toLocaleTimeString();
        } else if (booking.tripDetails && booking.tripDetails.journeyDatetime) {
            journeyDate = new Date(booking.tripDetails.journeyDatetime).toLocaleDateString();
            journeyTime = new Date(booking.tripDetails.journeyDatetime).toLocaleTimeString();
        } else if (booking.departureDateTime) {
            journeyDate = new Date(booking.departureDateTime).toLocaleDateString();
            journeyTime = new Date(booking.departureDateTime).toLocaleTimeString();
        } else if (carDetails && carDetails.departureDateTime) {
            journeyDate = new Date(carDetails.departureDateTime).toLocaleDateString();
            journeyTime = new Date(carDetails.departureDateTime).toLocaleTimeString();
        }

        
        let source = "N/A";
        let destination = "N/A";
        
        if (booking.source) {
            source = booking.source;
        } else if (booking.tripDetails && booking.tripDetails.source) {
            source = booking.tripDetails.source;
        } else if (carDetails && carDetails.source) {
            source = carDetails.source;
        }
        
        if (booking.destination) {
            destination = booking.destination;
        } else if (booking.tripDetails && booking.tripDetails.destination) {
            destination = booking.tripDetails.destination;
        } else if (carDetails && carDetails.destination) {
            destination = carDetails.destination;
        }

        
        let selectedSeats = "N/A";
        if (booking.selectedSeats) {
            selectedSeats = booking.selectedSeats;
        } else if (Array.isArray(booking.seats)) {
            selectedSeats = booking.seats.map(seat => seat.seatId).join(', ');
        }

        
        let pricePerSeat = "N/A";
        if (booking.tripDetails && booking.tripDetails.amount) {
            pricePerSeat = booking.tripDetails.amount;
        } else if (carDetails && carDetails.price) {
            pricePerSeat = carDetails.price;
        }

        
        const bookingId = booking._id || "N/A";
        const name = booking.name || "N/A";
        const phone = booking.phoneNumber || "N/A";
        const carModel = (carDetails && carDetails.carModel) || "N/A";
        const carNumber = (carDetails && carDetails.carNumber) || "N/A";
        const pickupLocation = (carDetails && carDetails.pickupLocation) || "N/A";
        const mobileNumber = (carDetails && carDetails.mobileNumber) || "N/A";
        const numberOfPersons = booking.numberOfPersons || "N/A";
        const totalAmount = booking.totalAmount || "N/A";

        const textContent = `
       🚗 BOOKING CONFIRMATION 🚗
        
        📌 **BOOKING DETAILS**
        ➤ Booking ID: ${bookingId}
        ➤ Name: ${name}
        ➤ Phone: ${phone}
        ➤ Status: Confirmed
        
        📍 **TRIP DETAILS**
        ➤ From: ${source}
        ➤ To: ${destination}
        ➤ Date: ${journeyDate}
        ➤ Time: ${journeyTime}
       
        
        🚘 **CAR DETAILS**
        ➤ Car Model: ${carModel}
        ➤ Car Number: ${carNumber}
        ➤ Pickup Location: ${pickupLocation}
        ➤ Contact Number: ${mobileNumber}
        
        💰 **PAYMENT DETAILS**
        ➤ Number of Seats: ${numberOfPersons}
        ➤ Price per Seat: ₹${pricePerSeat}
        ➤ Total Amount: ₹${totalAmount}
        ➤ Payment Status: ✅ Paid
        
        ✅ Thank you for your booking! Safe travels! 🌍
        `;

        await sendMail(
            email,
            'Your Booking Confirmation',
            textContent
        );
        console.log('Confirmation email sent successfully to', email);
    } catch (err) {
        console.error('Error sending confirmation email:', err);
        console.error('Error details:', err.message);
        console.error('Error stack:', err.stack);
    }
};



paymentCtrl.updatePaymentStatus = async (req, res) => {
    const stripeId = req.params.stripeId;
    const { paymentStatus } = req.body;

    try {
        const payment = await Payment.findOneAndUpdate(
            { transactionId: stripeId },
            { paymentStatus },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        
        const booking = await Booking.findByIdAndUpdate(
            payment.bookingId,
            { paymentStatus: 'paid' },
            { new: true }
        ).populate('tripId');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

       
        let carDetails;
        if (booking.tripId) {
            carDetails = await CarDetails.findById(booking.tripId.carDetailsId);
        }
        
        
        if (!carDetails && booking.source && booking.destination) {
            carDetails = await CarDetails.findOne({
                carOwnerId: payment.carOwnerId,
                source: booking.source,
                destination: booking.destination
            });
        }
        
        
        if (!carDetails) {
            carDetails = await CarDetails.findOne({
                carOwnerId: payment.carOwnerId
            });
        }

        if (!carDetails) {
            console.error("No car details found for:", {
                carOwnerId: payment.carOwnerId,
                bookingId: payment.bookingId
            });
            return res.status(404).json({ message: "Car details not found" });
        }


        
        const traveler = await User.findById(booking.travellerId);
        if (!traveler || !traveler.email) {
            console.error("🚨 Traveller email missing. Cannot send confirmation email.");
            return res.status(400).json({ message: "Traveller email is required" });
        }

        await sendConfirmationEmail(booking, carDetails, traveler.email)
        
        return res.status(200).json(payment);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }

};


paymentCtrl.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        return res.status(200).json(payments);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};

export default paymentCtrl;
