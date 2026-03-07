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
});

export default rootReducer;
