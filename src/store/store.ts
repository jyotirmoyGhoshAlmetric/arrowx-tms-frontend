import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootRducer";

const persistConfig = {
  key: "PERSIST_STORE_NAME",
  keyPrefix: "",
  storage,
  whitelist: ["layout"],
};

const combinedReducer = combineReducers(rootReducer);

export type RootState = ReturnType<typeof combinedReducer>;

const store = configureStore({
  reducer: persistReducer(persistConfig, combinedReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export const purgeStore = () => persistor.purge();
export type AppDispatch = typeof store.dispatch;

export default store;