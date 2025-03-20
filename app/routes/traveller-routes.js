import express from "express"
import travellerCtrl from "../controllers/traveller-ctrl.js"

import { checkSchema } from "express-validator"
import {travellerValidationSchema} from "../validators/traveller-validation-schema.js"
import authenticateUser from "../middlewares/authenticate.js"
import authorizeUser from "../middlewares/authorize.js"
import upload from "../middlewares/multer.js"


const router = express.Router()

router.put('/traveller/:id', 
    authenticateUser,
    authorizeUser(['traveller']),
    upload.fields([
                {name:"aadharCard",maxCount:3}
            ]),
    travellerCtrl.update)
router.post(
    '/traveller',
    authenticateUser,
    authorizeUser(['traveller']),
    upload.fields([
        {name:"aadharCard",maxCount:3},

    ]),
    //checkSchema(travellerValidationSchema),
    travellerCtrl.create)
router.put('/traveller/approve/:id',authenticateUser,authorizeUser(['admin']),travellerCtrl.approve)
router.get('/traveller',travellerCtrl.list)
router.get('/traveller/:id',travellerCtrl.getById)

router.delete('/traveller/:id',authenticateUser,authorizeUser(['admin']),travellerCtrl.delete)

export default router