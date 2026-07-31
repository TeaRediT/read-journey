import axios from "axios";
import {
  AuthRes,
  BooksRes,
  LoginCreds,
  RegCreds,
  TokensRes,
  User,
} from "./types";

interface BooksFilters {
  title?: string;
  author?: string;
  token?: string;
  limit: number;
  page: number;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const setAuthHeader = (token: string) => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
  api.defaults.headers.common.Authorization = "";
};

export const registerUser = async (creds: RegCreds): Promise<AuthRes> => {
  const { data } = await api.post<AuthRes>("/users/signup", creds);
  return data;
};

export const loginUser = async (creds: LoginCreds): Promise<AuthRes> => {
  const { data } = await api.post<AuthRes>("/users/signin", creds);
  return data;
};

export const logout = async () => {
  await api.post("/users/signout");
};

export const refreshTokens = async (): Promise<TokensRes> => {
  const { data } = await api.get<TokensRes>("/users/current/refresh");
  return data;
};

export const getUser = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/current");
  return data;
};

export const fetchBooks = async ({
  title,
  author,
  page,
  limit,
  token,
}: BooksFilters): Promise<BooksRes> => {
  const params = new URLSearchParams();

  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (title) params.append("title", title);
  if (author) params.append("author", author);

  const { data } = await api.get<BooksRes>("/books/recommend", {
    params,
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  });
  return data;
};
