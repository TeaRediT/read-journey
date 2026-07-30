import axios from "axios";

interface RegCreds {
  name: string;
  email: string;
  password: string;
}

interface LoginCreds {
  email: string;
  password: string;
}

interface AuthRes {
  email: string;
  name: string;
  token: string;
  refreshToken: string;
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
