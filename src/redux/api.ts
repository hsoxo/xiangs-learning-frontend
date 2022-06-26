import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Question } from "../types";
import { RootState } from "./index";

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      headers.set(
        "authorization",
        `Bearer ${(getState() as RootState).app.token}`
      );
      return headers;
    },
  }),
  tagTypes: ["QUESTION", 'QUESTIONS'],
  endpoints: (builder) => ({
    login: builder.mutation<{ access_token: string }, { username: string }>({
      query: ({ username }) => ({
        url: "login",
        method: "POST",
        body: { username },
      }),
    }),
    getQuestions: builder.query<Question[], void>({
      query: ( ) => `questions`,
      keepUnusedDataFor: 3600 * 24,
      providesTags: [{ type: 'QUESTIONS'}]
    }),
    shuffleQuestions: builder.mutation<Question[], void>({
      query: ( ) => `questionsShuffle`,
      invalidatesTags: [{ type: 'QUESTIONS'}]
    }),
    answer: builder.mutation<void, { id: number; a: string; p: number }>({
      query: (body) => ({
        url: "answer",
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "QUESTION", id }],
    }),
    getQuestion: builder.query<
      { important: boolean; correct: number; wrong: number },
      { id: number }
    >({
      query: ({ id }) => `question?id=${id}`,
      providesTags: (result, error, { id }) => [{ type: "QUESTION", id }],
    }),
    putImportant: builder.mutation<void, { id: number; important: boolean }>({
      query: (body) => ({
        url: "important",
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "QUESTION", id }],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetQuestionQuery,
  useGetQuestionsQuery,
  useAnswerMutation,
  usePutImportantMutation,
  useShuffleQuestionsMutation,
} = api;
