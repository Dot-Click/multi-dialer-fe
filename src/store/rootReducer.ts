import { combineReducers } from '@reduxjs/toolkit';
import exampleReducer from './slices/exampleSlice';
import authReducer from './slices/authSlice';
import contactReducer from './slices/contactSlice';
import contactStructureReducer from './slices/contactStructureSlice';
import callingReducer from './slices/callingSlice';

const rootReducer = combineReducers({
    example: exampleReducer,
    auth: authReducer,
    contacts: contactReducer,
    contactStructure: contactStructureReducer,
    calling: callingReducer,
});

export default rootReducer;
