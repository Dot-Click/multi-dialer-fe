import { combineReducers } from '@reduxjs/toolkit';
import exampleReducer from './slices/exampleSlice';
import authReducer from './slices/authSlice';
import contactReducer from './slices/contactSlice';
import contactStructureReducer from './slices/contactStructureSlice';
import callingReducer from './slices/callingSlice';
import sentimentReducer from './slices/sentimentSlice';

const rootReducer = combineReducers({
    example: exampleReducer,
    auth: authReducer,
    contacts: contactReducer,
    contactStructure: contactStructureReducer,
    calling: callingReducer,
    sentiment: sentimentReducer,
});

export default rootReducer;
