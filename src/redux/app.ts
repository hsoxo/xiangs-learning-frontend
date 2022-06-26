import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { getToken, removeToken, setToken } from "../utils/storage";

export interface CounterState {
  token: string | null;
}

const initialState: CounterState = {
  token: getToken(),
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setReduxToken: (state, action: PayloadAction<string>) => {
      setToken(action.payload);
      state.token = action.payload;
    },
    removeReduxToken: (state) => {
      removeToken();
      state.token = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setReduxToken, removeReduxToken } = appSlice.actions;

export default appSlice.reducer;
