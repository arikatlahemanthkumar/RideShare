import express from "express"
import tripCtrl from "../controllers/trip-ctrl.js"

import { checkSchema } from "express-validator"
import { tripValidationSchema } from "../validators/trip-validation-schema.js"
import authenticateUser from "../middlewares/authenticate.js"
import authorizeUser from "../middlewares/authorize.js"

const router = express.Router()

router.post('/trip',authenticateUser,authorizeUser(['carOwner']),tripCtrl.create)
router.put('/trip/approve/:id',authenticateUser,authorizeUser(['admin']),tripCtrl.approve)
router.get('/trip',tripCtrl.list)
router.get('/trip/:id',tripCtrl.getById)
router.put('/trip/:id',authenticateUser,authorizeUser(['admin']),tripCtrl.update)
router.delete('/trip/:id',authenticateUser,authorizeUser(['admin']),tripCtrl.delete)
router.get('/my-trips', authenticateUser , tripCtrl.getMyTrips);

router.put('/trip/:id/bookseats', authenticateUser, authorizeUser(['traveller']), tripCtrl.bookSeat)

export default router 