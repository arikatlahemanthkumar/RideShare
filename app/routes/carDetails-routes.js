import express from "express"
import carDetailsCtrl from "../controllers/carDetails-ctrl.js"

import {checkSchema} from "express-validator"
import { carDetailsValidationSchema } from "../validators/carDetails-validation-schema.js"
import authenticateUser from "../middlewares/authenticate.js"
import authorizeUser from "../middlewares/authorize.js"
import upload from "../middlewares/multer.js"

const router = express.Router()

router.post(
    '/cardetails',
    authenticateUser,
    authorizeUser(['carOwner']),
    (req, res, next) => {
        console.log('Received request to /cardetails');
        next(); 
    },
    upload.fields([
        {name:"photos",maxCount:5},
        {name:"insurance",maxCount:1},
        {name:"drivingLicence",maxCount:1},
        
    ]),
    carDetailsCtrl.create)
router.put('/cardetails/approve/:id',authenticateUser,authorizeUser(['admin']),carDetailsCtrl.approve)
router.get('/cardetails',carDetailsCtrl.list)
router.get('/cardetails/:id',carDetailsCtrl.getById)
router.get('/my-cars', authenticateUser ,authorizeUser(['carOwner']), carDetailsCtrl.getMyCars);
router.put('/cardetails/verify/:id',authenticateUser,authorizeUser(['admin']),carDetailsCtrl.verify)
router.put(
    '/cardetails/:id',
    authenticateUser,
    authorizeUser(['admin','carOwner']),
    upload.fields([
        {name:"photos",maxCount:10},
        {name:"insurance",maxCount:1},
        {name:"drivingLicence",maxCount:1}
        
    ]),
   
    carDetailsCtrl.update)
router.delete('/cardetails/:id',authenticateUser,authorizeUser(['admin']),carDetailsCtrl.delete)

export default router 