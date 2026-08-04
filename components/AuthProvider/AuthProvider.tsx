"use client";

import { clearAuthHeader, getUser, setAuthHeader } from "@/lib/api";
import { clearCredentials, setCredentials } from "@/redux/auth/authSlice";
import { RootState } from "@/redux/auth/store";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const [isInitializing, setIsInitializing] =
    useState<boolean>(!isAuthenticated);
  const isAuthChecked = useRef(false);

  useEffect(() => {
    if (isAuthenticated || isAuthChecked.current) {
      setIsInitializing(false);
      return;
    }

    const checkAuth = async () => {
      isAuthChecked.current = true;
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

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
        } catch {
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
