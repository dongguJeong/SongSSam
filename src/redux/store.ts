import { combineReducers, configureStore } from '@reduxjs/toolkit';
import accessTokenSlice from './accessTokenSlice';
import { persistReducer,persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import refreshTokenSlice from './refreshTokenSlice';
import loadingSlice from './loadingSlice';
import instSlice from './instSlice';
import songSlice from './songSlice';

const rootReducer = combineReducers({
  accessToken : accessTokenSlice,
  refreshToken : refreshTokenSlice,
  loadingToken : loadingSlice,
  instToken : instSlice,
  songToken : songSlice,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist : 
  
  ['accessToken' , 'refreshToken'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});


export default store;

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;

