import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authenticationReducer from "./slice/authentication";
import adminReducer from "./slice/admin";
import eventReducer from "./slice/events";
import locationReducer from "./slice/location";

const persistConfig = {
  key: "archery",
  version: 1,
  storage,
  blacklist: ["location"],
};

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  admin: adminReducer,
  events: eventReducer,
  location: locationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
