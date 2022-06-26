import type { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { removeReduxToken } from "./app";

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
  ({ dispatch }: MiddlewareAPI) =>
  (next) =>
  (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      console.warn("We got a rejected action!");
      console.log(action);
      if (action.payload) dispatch(removeReduxToken());
    }

    return next(action);
  };
