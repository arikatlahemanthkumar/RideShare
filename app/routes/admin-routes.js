import express from "express";
import adminCtrl from "../controllers/admin-ctrl.js";
import authenticateUser from "../middlewares/authenticate.js";
import authorizeUser from "../middlewares/authorize.js";

const router = express.Router();


router.get("/users", authenticateUser, authorizeUser(["admin"]), adminCtrl.getUsers);
router.get("/cars", authenticateUser, authorizeUser(["admin"]), adminCtrl.fetchCars);
router.get("/cars/pending", authenticateUser , authorizeUser (["admin"]), adminCtrl.pendingApprovals);
router.post("/cars/:id/approve", authenticateUser, authorizeUser(["admin"]), adminCtrl.approveCar);
router.delete("/cars/delete/:id", authenticateUser, authorizeUser(["admin"]), adminCtrl.rejectCar);
router.get("/trips", authenticateUser, authorizeUser(["admin"]), adminCtrl.getTrips);

export default router;
