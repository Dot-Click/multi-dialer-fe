import { combineReducers } from "@reduxjs/toolkit";
import exampleReducer from "./slices/exampleSlice";
import authReducer from "./slices/authSlice";
import contactReducer from "./slices/contactSlice";
import contactStructureReducer from "./slices/contactStructureSlice";
import callingReducer from "./slices/callingSlice";
import sentimentReducer from "./slices/sentimentSlice";
import smsReducer from "./slices/smsSlice";
import subscriptionReducer from "./slices/subscriptionSlice";
import themeReducer from "./slices/themeSlice";
import appearanceReducer from "./slices/appearanceSlice";
import userReducer from "./slices/userSlice";
import reportsReducer from "./slices/reportsSlice";
import companySettingReducer from "./slices/companySettingSlice";

const rootReducer = combineReducers({
  example: exampleReducer,
  auth: authReducer,
  contacts: contactReducer,
  contactStructure: contactStructureReducer,
  calling: callingReducer,
  sentiment: sentimentReducer,
  theme: themeReducer,
  sms: smsReducer,
  subscriptions: subscriptionReducer,
  appearance: appearanceReducer,
  user: userReducer,
  reports: reportsReducer,
  companySetting: companySettingReducer,
});

export default rootReducer;
