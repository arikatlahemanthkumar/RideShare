
import Trip from "../models/trip-model.js";
import { validationResult } from "express-validator";
import _ from "lodash";
import CarDetails from "../models/carDetails-model.js";
import Booking from "../models/booking-model.js";

const tripCtrl = {};

tripCtrl.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const body = _.pick(req.body, ["journeyDatetime", "seats", "source", "destination", "amount", "carId"])
  try {

    const car = await CarDetails.findOne({ _id: body.carId })
    if (!car) {
      return res.status(404).json({ errors: "Car not found" })
    }
    

    const seats = Array.from({ length: car.seatingCapacity }, (_, index) => ({
      seatId: `Seat-${index + 1}`,
      isBooked: false,
      userId: null
    }))

    const trip = new Trip(body)
    trip.carOwnerId = req.currentUser.userId
    trip.seats = seats
    console.log(trip)
    await trip.save()
    res.json(trip)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "something went wrong" })
  }
}

tripCtrl.approve = async (req, res) => {
  const id = req.params.id
  const body = req.body
  try {
    const trip = await Trip.findByIdAndUpdate(id, body, { isApproved: true }, { new: true, runValidators: true })
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' })
    }
    return res.json(trip)
  } catch (err) {
    res.status(500).json({ error: 'something went wrong' })
  }
}

tripCtrl.list = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate("carOwnerId carId")
      .populate("seats.userId", "name email")
    console.log(trips)
    res.json(trips)
  } catch (err) {
    res.status(500).json({ error: "something went wrong" })
  }
}

tripCtrl.getById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = req.params.id
    console.log(id)
    const trip = await Trip.findById({ _id: id }).populate("carOwnerId carId")
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" })
    }
    console.log(trip)
    res.json(trip)
  } catch (err) {
    res.status(500).json({ error: "something went wrong" })
  }
}



tripCtrl.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id
  const body = req.body
  try {
    let trip
    if (req.currentUser.role == 'admin') {
      trip = await Trip.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    } else {
      const body = _.pick(req.body, ["journeyDatetime", "seats", "source", "destination", "amount", "carId"])
      trip = await Trip.findByIdAndUpdate({ _id: id, carOwnerId: req.currentUser.carOwnerId }, body, { new: true, runValidators: true })
    }
    if (!trip) {
      return res.status(404).json({ error: 'record not found' })
    }
    return res.json(trip)
  } catch (err) {
    res.status(500).json({ error: 'something went wrong' })
  }
}


tripCtrl.getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate("carOwnerId", "name email");
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
},


  tripCtrl.delete = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const id = req.params.id
      let trip
      if (req.currentUser?.role === 'admin') {
        trip = await Trip.findByIdAndDelete(id)
      } else {
        trip = await Trip.findOneAndDelete({ _id: id, carOwnerId: req.currentUser.userId })
      }
      if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
      }
      return res.json(trip)
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }




tripCtrl.bookSeat = async (req, res) => {
  try {
    const { id } = req.params;
    const { seatIds } = req.body

    console.log("Request body:", req.body)
    console.log("Seat IDs received:", seatIds);

    if (!Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ errors: "Seat IDs must be a non-empty array" });
    }

    const trip = await Trip.findOne({ _id: id })
    console.log(trip)

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    const unavailableSeats = seatIds.filter(
      (seatId) => {
        const seat = trip.seats.find((s) => s.seatId == seatId);
        return !seat || seat.isBooked;
      }
    );

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Some seats are already booked or invalid: ${unavailableSeats.join(", ")}`,
      });
    }

    const totalAmount = trip.amount * seatIds.length

    const bookingDetails = new Booking({
      travellerId: req.currentUser.userId,
      tripId: id,
      seatIds:seatIds,
      totalAmount,
      isApproved: false
    })
    console.log("Creating booking with details:", bookingDetails);
    await bookingDetails.save()
   
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
};



export default tripCtrl

