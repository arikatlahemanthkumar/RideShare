import express from "express"
import userCtrl from "../controllers/user-ctrl.js"

import { checkSchema } from "express-validator"
import { userRegisterSchema,userLoginSchema } from "../validators/user-validation-schema.js"
import authenticateUser from "../middlewares/authenticate.js"
import authorizeUser from "../middlewares/authorize.js"

const router = express.Router()


router.post('/users/register',checkSchema(userRegisterSchema),userCtrl.register)
router.post('/users/login',checkSchema(userLoginSchema),userCtrl.login)
router.get('/users/account',authenticateUser,userCtrl.account)
router.get('/users/list',authenticateUser,authorizeUser(['admin']),userCtrl.list)
router.put('/users/:id/status',authenticateUser,authorizeUser(['admin']),userCtrl.activation)


export default router