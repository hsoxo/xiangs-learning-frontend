import { Question } from "../types";

const TOKEN = "TOKEN";
const QUESTIONS = "QUESTIONS";

export const getToken = () => localStorage.getItem(TOKEN);
export const setToken = (token: string) => localStorage.setItem(TOKEN, token);
export const removeToken = () => localStorage.removeItem(TOKEN);

export const getQuestion = (): Question[] | undefined => {
  const q = localStorage.getItem(QUESTIONS);
  if (q) return JSON.parse(q) as unknown as Question[];
  return undefined;
};
export const setQuestion = (q: Question[]) =>
  localStorage.setItem(QUESTIONS, JSON.stringify(q));
