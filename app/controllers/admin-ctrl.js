import User from "../models/user-model.js";
import CarDetails from "../models/carDetails-model.js";
import Trip from "../models/trip-model.js";

const adminCtrl = {};


adminCtrl.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("_id name email role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};


adminCtrl.fetchCars = async (req, res) => {
  try {
      const cars = await CarDetails.find()
          .populate("carOwnerId", "name") 
          .select("_id carOwnerId carModel carNumber seatingCapacity photos insurance drivingLicence source destination departureDateTime price mobileNumber pickupLocation isApproved");
      res.json(cars);
  } catch (err) {
      res.status(500).json({ error: err.message || "Something went wrong" });
  }
};

adminCtrl.pendingApprovals = async (req, res) => {
  try {
      const cars = await CarDetails.find({ isApproved:false })
          .populate("carOwnerId", "name");
      res.json(cars);
  } catch (err) {
      res.status(500).json({ error: err.message || "Something went wrong" });
  }
};


adminCtrl.approveCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await CarDetails.findByIdAndUpdate(id, { isApproved :true}, { new: true });
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json({ message: "Car approved successfully", car });
  } catch (err) {
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};


adminCtrl.rejectCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await CarDetails.findByIdAndDelete(id);
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json({ message: "Car rejected and deleted", car });
  } catch (err) {
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};


adminCtrl.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find().select("_id source destination status");
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};

export default adminCtrl;
