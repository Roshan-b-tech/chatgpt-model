import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import chatReducer from "./chatSlice";
import authReducer from "./authSlice";
import aiReducer from "./aiSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["chat", "auth", "ai"],
};

const rootReducer = combineReducers({
  chat: chatReducer,
  auth: authReducer,
  ai: aiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Export a function to create the store (SSR-safe)
export function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
}

export const store = makeStore();

export default { store };

export type RootState = ReturnType<ReturnType<typeof makeStore>["getState"]>;
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];
