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
const client = new twilio.Twilio(accountSid, authToken);

export const sendOtp = async (req, res) => {
  try {
    let path = req.originalUrl?.replace("/", "").split("/");
    let id = _tokenDetails(req.token)?.user_id;
    let phone = req.body?.phoneNumber;
    const queryData = await Query?.query_Get_by_id(path[1], id);
    if (queryData.exists()) {
      client.verify.v2
        .services("VAeae9f489e420ffa299be979acbca74e6")
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
        .services("VAeae9f489e420ffa299be979acbca74e6")
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
