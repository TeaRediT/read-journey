"use client";

import {
  clearAuthHeader,
  getUser,
  refreshTokens,
  setAuthHeader,
} from "@/lib/api";
import { clearCredentials, setCredentials } from "@/redux/auth/authSlice";
import { RootState } from "@/redux/auth/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const [isInitializing, setIsInitializing] =
    useState<boolean>(!isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      const clearAllAndRedirect = () => {
        clearAuthHeader();
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        document.cookie = "auth-session=; path=/; max-age=0";
        dispatch(clearCredentials());
        router.push("/login");
      };

      const refreshSession = async (refToken: string) => {
        try {
          setAuthHeader(refToken);
          const tokens = await refreshTokens();

          const newToken = tokens.token;
          const newRefreshToken = tokens.refreshToken || refToken;

          localStorage.setItem("token", newToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          setAuthHeader(newToken);
          const user = await getUser();

          dispatch(
            setCredentials({
              user: { name: user.name, email: user.email },
              token: newToken,
              refreshToken: newRefreshToken,
            }),
          );
        } catch {
          clearAllAndRedirect();
        }
      };

      if (token) {
        try {
          setAuthHeader(token);
          const user = await getUser();

          dispatch(
            setCredentials({
              user: { name: user.name, email: user.email },
              token: user.token || token,
              refreshToken: user.refreshToken || refreshToken || "",
            }),
          );
        } catch (err) {
          if (
            isAxiosError(err) &&
            refreshToken &&
            err.response?.status === 401
          ) {
            await refreshSession(refreshToken);
          } else {
            clearAllAndRedirect();
          }
        }
      } else if (!token && refreshToken) {
        await refreshSession(refreshToken);
      } else {
        clearAllAndRedirect();
      }

      setIsInitializing(false);
    };

    checkAuth();
  }, [dispatch, isAuthenticated, router]);

  if (isInitializing) return <p>Loading...</p>;

  return <>{children}</>;
};

export default AuthProvider;
