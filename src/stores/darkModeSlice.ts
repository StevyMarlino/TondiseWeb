import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./stores";

interface DarkModeState {
  value: boolean;
}

const initialState: DarkModeState = {
  value: localStorage.getItem("kodeaDarkMode") === "true",
};

export const darkModeSlice = createSlice({
  name: "kodeaDarkMode",
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setDarkMode } = darkModeSlice.actions;

export const selectDarkMode = (state: RootState) => {
  if (localStorage.getItem("kodeaDarkMode") === null) {
    localStorage.setItem("kodeaDarkMode", "false");
  }

  return state.darkMode.value;
};

export default darkModeSlice.reducer;
