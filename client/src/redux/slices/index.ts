import { combineReducers } from '@reduxjs/toolkit';
import orderWriterReducer from './orderWriterSlice';
import hostContextReducer from './hostContextSlice';

const rootReducer = combineReducers({
  orderWriter: orderWriterReducer,
  hostContext: hostContextReducer
});

export default rootReducer;