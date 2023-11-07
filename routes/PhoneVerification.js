import express from "express";
import { ensureToken } from "../services/Secure.js";
import { sendOtp, verifyOtp, verifyPhoneAndSendOtp, verifyWithoutAuthOtp } from "../controller/phone_verify.js";

const router = express.Router();

//send otp
router.post("/", ensureToken, sendOtp);

//Verify Then send otp
router.post("/vas", verifyPhoneAndSendOtp);

//verify OTP
router.post("/verify", ensureToken, verifyOtp);

//verify without auth OTP
router.post("/vasOTP", verifyWithoutAuthOtp);

export default router;
