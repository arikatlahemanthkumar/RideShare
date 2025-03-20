import express from "express"
import paymentCtrl from "../controllers/payment-ctrl.js"

const router = express.Router()

router.post('/payments/checkout', paymentCtrl.createPayment)
router.put('/payments/:stripeId/success', paymentCtrl.updatePaymentStatus)
router.get('/getAllPayments',paymentCtrl.getAllPayments)

export default router