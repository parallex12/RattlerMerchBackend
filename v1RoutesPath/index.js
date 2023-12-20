import Users from "../routes/Users.js";
import payment from "../routes/payment.js";
import Universal from "../routes/Universal.js";
import PhoneVerification from "../routes/PhoneVerification.js";


export const v1Routes = [
  { path: "/users", file: Users },
  { path: "/payment", file: payment },
  { path: "/:id", file: Universal },
  { path: "/users/pv", file: PhoneVerification },
];
