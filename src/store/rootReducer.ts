import { combineReducers } from '@reduxjs/toolkit';
import exampleReducer from './slices/exampleSlice';
import authReducer from './slices/authSlice';
import contactReducer from './slices/contactSlice';
import contactStructureReducer from './slices/contactStructureSlice';
import callingReducer from './slices/callingSlice';
import sentimentReducer from './slices/sentimentSlice';
import smsReducer from './slices/smsSlice';
import subscriptionReducer from './slices/subscriptionSlice';

const rootReducer = combineReducers({
    example: exampleReducer,
    auth: authReducer,
    contacts: contactReducer,
    contactStructure: contactStructureReducer,
    calling: callingReducer,
    sentiment: sentimentReducer,
    sms: smsReducer,
    subscriptions: subscriptionReducer,
});

export default rootReducer;
