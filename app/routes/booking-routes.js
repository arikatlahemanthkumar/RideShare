import express from "express"
import bookingCtrl from "../controllers/booking-ctrl.js"

import { checkSchema } from "express-validator"
import { bookingValidationSchema } from "../validators/booking-validation-schema.js"
import authenticateUser from "../middlewares/authenticate.js"
import authorizeUser from "../middlewares/authorize.js"


const router = express.Router()

router.post('/booking', authenticateUser,bookingCtrl.create)
router.get('/booking', bookingCtrl.list)
router.get('/booking/:id', bookingCtrl.getById)
router.get('/bookings/user/:id', authenticateUser, bookingCtrl.getByTravellerId)
router.put('/booking/:id', authenticateUser, authorizeUser(['admin']), bookingCtrl.update)
router.delete('/booking/:id', authenticateUser, authorizeUser(['admin']), bookingCtrl.delete)

router.get('/bookings/debug/all', authenticateUser, bookingCtrl.getAllBookings)


export default router 
