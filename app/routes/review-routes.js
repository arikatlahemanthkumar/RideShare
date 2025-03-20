import express from "express"
import reviewCtrl from "../controllers/review-ctrl.js"

import {checkSchema} from "express-validator"
import { reviewValidationSchema } from "../validators/review-validation-schema.js"
import authenticateUser from "../middlewares/authenticate.js"
import authorizeUser from "../middlewares/authorize.js"


const router = express.Router()

router.post('/review',authenticateUser,authorizeUser(['traveller']),reviewCtrl.create)
router.get('/review',reviewCtrl.list)
router.get('/review/:id',reviewCtrl.getById)
router.put('/review/:id',authenticateUser,authorizeUser(['admin','traveller']),reviewCtrl.update)
router.delete('/review/:id',authenticateUser,authorizeUser(['admin']),reviewCtrl.delete)

export default router 