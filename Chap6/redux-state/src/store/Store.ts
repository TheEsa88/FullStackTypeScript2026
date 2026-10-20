import { configureStore } from "@reduxjs/toolkit";
import ProfileReducer from "./Profile/ProfileSlice";

export const store = configureStore({
reducer: {
profile: ProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
