// import classReducer from '@/redux/reducers/classSlice';
import classReducer from './api/classSlice';
import userReducer from './api/userSlice';
import authReducer from './api/authSlice';
import tutorReducer from './api/tutorSlice';
import orderReducer from './api/orderSlice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const reducers = combineReducers({
  class: classReducer,
  user: userReducer,
  auth: authReducer,
  tutor: tutorReducer,
  order: orderReducer,
});
export const store = configureStore({
  reducer: reducers,
});