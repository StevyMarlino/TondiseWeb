import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import topMenuReducer from "./topBarMenuSlice";
import colorSchemeReducer from "./colorSchemeSlice";
import darkModeReducer from "./darkModeSlice";

export const store = configureStore({
  reducer: {
    topMenu: topMenuReducer,
    colorScheme: colorSchemeReducer,
    darkMode: darkModeReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;