import axios from "axios";
import {
  AddBook,
  AuthRes,
  Book,
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

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      document.cookie = "auth-session=; path=/; max-age=0";

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

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

export const addBookToGallery = async (id: string): Promise<Book> => {
  const { data } = await api.post<Book>(`/books/add/${id}`);
  return data;
};

export const getUsersBooks = async (): Promise<Book[]> => {
  const { data } = await api.get<Book[]>("/books/own");
  return data;
};

export const addNewBook = async (body: AddBook): Promise<Book> => {
  const { data } = await api.post<Book>("/books/add", body);
  return data;
};
