import {
  TypedUseSelectorHook,
  useDispatch as useD,
  useSelector as useS,
} from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import appReducer from "./app";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    app: appReducer,
    [api.reducerPath]: api.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = useD;
export const useSelector: TypedUseSelectorHook<RootState> = useS;
