import { combineReducers } from '@reduxjs/toolkit';
import exampleReducer from './slices/exampleSlice';
import authReducer from './slices/authSlice';

const rootReducer = combineReducers({
    example: exampleReducer,
    auth: authReducer,
});

export default rootReducer;
