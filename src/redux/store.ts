import { combineReducers, configureStore } from '@reduxjs/toolkit';
import tokenSlice from './tokenSlice';
import { persistReducer,persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  token : tokenSlice
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist : [
    'token'
  ]
}


const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;

export const persistor = persistStore(store);
