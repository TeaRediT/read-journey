export interface RegCreds {
  name: string;
  email: string;
  password: string;
}

export interface LoginCreds {
  email: string;
  password: string;
}

export interface AuthRes {
  email: string;
  name: string;
  token: string;
  refreshToken: string;
}

export interface TokensRes {
  token: string;
  refreshToken: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
  refreshToken: string;
}

export interface Book {
  _id: string;
  author: string;
  title: string;
  imageUrl: string;
  recommend: boolean;
  totalPages: number;
}

export interface BooksRes {
  results: Book[];
  totalPages: number;
  page: number;
}
