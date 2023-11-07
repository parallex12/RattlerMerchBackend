import express from "express";
import { ensureToken } from "../services/Secure.js";
import { sendOtp, verifyOtp } from "../controller/phone_verify.js";

const router = express.Router();

//send otp 
router.post("/", ensureToken, sendOtp);

//verify itp
router.post("/verify", ensureToken, verifyOtp);

export default router;
