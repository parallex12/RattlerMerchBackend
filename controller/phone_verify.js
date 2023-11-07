import { _tokenDetails } from "../services/index.js";
import { Query } from "../models/index.js";
import twilio from "twilio";
import {
  accountSid,
  accountSidT,
  authToken,
  authTokenT,
} from "../env/index.js";
import { verify } from "crypto";
import { updateDocById } from "./index.js";
import firebase from "../services/Firebase.js";
import { sendPasswordResetEmail } from "firebase/auth";
const client = new twilio.Twilio(accountSid, authToken);

export const sendOtp = async (req, res) => {
  try {
    let path = req.originalUrl?.replace("/", "").split("/");
    let id = _tokenDetails(req.token)?.user_id;
    let phone = req.body?.phoneNumber;
    const queryData = await Query?.query_Get_by_id(path[1], id);
    if (queryData.exists()) {
      client.verify.v2
        .services("VAa65bf85ba299a589922c19f12c979913")
        .verifications.create({ to: phone, channel: "sms" })
        .then((verification) => {
          res.send({ verification });
          res.end();
        })
        .catch((e) => {
          console.log(e);
          res.end(500);
        });
    } else {
      res.send({ msg: "No user Found", code: "404" });
      res.end(404);
    }
  } catch (e) {
    console.log("Firebase", e.message);
    res.sendStatus(500);
    res.end();
  }
};

export const verifyOtp = async (req, res) => {
  try {
    let body = req.body;
    let id = _tokenDetails(req.token)?.user_id;
    const queryData = await Query?.query_Get_by_id("users", id);
    if (!body?.code) {
      res.end(500);
    }
    if (queryData.exists()) {
      console.log(body);
      client.verify.v2
        .services("VAa65bf85ba299a589922c19f12c979913")
        ?.verificationChecks?.create({
          to: body?.phoneNumber,
          code: body?.code,
        })
        .then(async (verification) => {
          console.log(verification);
          let updateUser = await updateDocById(req, res);
        })
        .catch((e) => {
          console.log("Twilio", e.message);
          res.end(500);
        });
    }
  } catch (e) {
    console.log("Firebase", e.message);
    res.end(500);
  }
};

export const verifyWithoutAuthOtp = async (req, res) => {
  try {
    let body = req.body;
    if (!body?.code) {
      res.end(500);
    }
    client.verify.v2
      .services("VAa65bf85ba299a589922c19f12c979913")
      ?.verificationChecks?.create({
        to: body?.phoneNumber,
        code: body?.code,
      })
      .then(async (verification) => {
        let userData = await Query.query_Get_by_phone(verification?.to);
        let auth = firebase?.auth;
        sendPasswordResetEmail(auth, userData[0]?.email)
          .then(() => {
            res.send(verification);
            res.end();
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            res.send(errorMessage);
            res.end(500);
          });
       
      })
      .catch((e) => {
        console.log("Twilio", e.message);
        res.end(500);
      });
  } catch (e) {
    console.log("Firebase", e.message);
    res.end(500);
  }
};

export const verifyPhoneAndSendOtp = async (req, res) => {
  try {
    let body = req.body;
    let phone = body?.phoneNumber;
    let userData = await Query.query_Get_by_phone(phone);
    console.log(phone);
    console.log(userData);
    if (userData?.length > 0) {
      client.verify.v2
        .services("VAa65bf85ba299a589922c19f12c979913")
        .verifications.create({ to: phone, channel: "sms" })
        .then((verification) => {
          res.send({ verification });
          res.end();
        })
        .catch((e) => {
          console.log("Twilio Api", e);
          res.end(500);
        });
    } else {
      res.send({ msg: "No user Found", code: "404" });
      res.end(404);
    }
  } catch (e) {
    console.log("verifyPhoneAndSendOtp", e.message);
    res.end(500);
  }
};
