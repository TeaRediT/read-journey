import axios from "axios";
import {
  AddBook,
  AuthRes,
  Book,
  BooksRes,
  deleteRes,
  LoginCreds,
  RegCreds,
  Status,
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

//refresh

interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const performLogout = (error: unknown) => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  document.cookie = "auth-session=; path=/; max-age=0";
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
  return Promise.reject(error);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (originalRequest.url.includes("refresh")) {
        return performLogout(error);
      }

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        return performLogout(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        setAuthHeader(refreshToken);
        const tokens = await refreshTokens();

        const newToken = tokens.token;
        const newRefreshToken = tokens.refreshToken || refreshToken;

        localStorage.setItem("token", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        setAuthHeader(newToken);

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        processQueue(null, newToken);

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return performLogout(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

//funcs

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

  const { data } = await api.get<BooksRes>("/books/recommend", { params });
  return data;
};

export const addBookToGallery = async (id: string): Promise<Book> => {
  const { data } = await api.post<Book>(`/books/add/${id}`);
  return data;
};

export const getUsersBooks = async (status: Status): Promise<Book[]> => {
  const params = new URLSearchParams();

  if (status !== "all") params.append("status", status);

  const { data } = await api.get<Book[]>("/books/own", { params });
  return data;
};

export const addNewBook = async (body: AddBook): Promise<Book> => {
  const { data } = await api.post<Book>("/books/add", body);
  return data;
};

export const deleteBookFromGallery = async (id: string): Promise<deleteRes> => {
  const { data } = await api.delete<deleteRes>(`/books/remove/${id}`);
  return data;
};
