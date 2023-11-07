import Users from "../routes/Users.js";
import PhoneVerification from "../routes/PhoneVerification.js";


export const v1Routes = [
  { path: "/users", file: Users },
  { path: "/users/pv", file: PhoneVerification },
];
