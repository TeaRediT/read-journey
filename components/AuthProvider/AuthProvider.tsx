"use client";

import { api, clearAuthHeader, setAuthHeader } from "@/lib/api";
import { clearCredentials, setCredentials } from "@/redux/auth/authSlice";
import { RootState } from "@/redux/auth/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
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

      if (token) {
        try {
          setAuthHeader(token);

          const { data } = await api.get("/users/current");

          dispatch(
            setCredentials({
              user: { name: data.name, email: data.email },
              token: data.token || token,
              refreshToken: data.refreshToken || refreshToken || "",
            }),
          );
        } catch {
          clearAuthHeader();
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          dispatch(clearCredentials());
        }
      } else {
        clearAuthHeader();
        dispatch(clearCredentials());
      }

      setIsInitializing(false);
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  if (isInitializing) return <p>Loading...</p>;

  return <>{children}</>;
};

export default AuthProvider;
