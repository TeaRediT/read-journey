"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import Link from "next/link";
import Button from "../Button/Button";
import { useState } from "react";
import { LoginFormData, loginSchema } from "./LoginFormSchema";
import { useMutation } from "@tanstack/react-query";
import { loginUser, setAuthHeader } from "@/lib/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/auth/authSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

const divStyles =
  "flex items-center bg-surface-light rounded-xl px-3.5 py-3.5 md:px-3.5 md:py-4";
const spanStyles =
  "text-secondary text-[12px] mr-2.5 leading-[1.33] md:text-[14px] md:leading-[1.29]";
const inputStyles =
  "text-primary text-[12px] outline-none placeholder:text-primary w-full leading-[1.33] md:text-[14px] md:leading-[1.29] bg-transparent";
const errorStyles =
  "text-[#e90516] text-[8px] absolute bottom-[-8.5px] md:text-[10px] md:bottom-[-13px]";
const successStyles =
  "text-[#30b94d] text-[8px] absolute bottom-[-8.5px] md:text-[10px] md:bottom-[-13px]";

const getWrapperStyles = (isError?: boolean, isSuccess?: boolean) => {
  return clsx(
    divStyles,
    "relative ring-1 ring-inset transition-shadow duration-250",
    isError
      ? "ring-[#e90516]"
      : isSuccess
        ? "ring-[#30b94d]"
        : "ring-transparent hover:ring-[rgba(249,249,249,0.1)]",
  );
};

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (creds: LoginFormData) => loginUser(creds),
    onSuccess: (data) => {
      const { name, email, token, refreshToken } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      setAuthHeader(token);

      dispatch(
        setCredentials({
          user: { name, email },
          token,
          refreshToken,
        }),
      );

      document.cookie =
        "auth-session=true; path=/; max-age=2592000; SameSite=Strict";

      toast.success("Welcome back!");
      router.push("/recommended");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Something went wrong.";
        toast.error(errorMessage);
      } else {
        toast.error((error as Error).message);
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const isEmailError = !!errors.email;
  const isEmailSuccess = isSubmitted && !errors.email;

  const isPasswordError = !!errors.password;
  const isPasswordSuccess = isSubmitted && !errors.password;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="md:w-118">
      <div className="flex flex-col gap-2 md:gap-3.5">
        <div className="relative">
          <label className="sr-only" htmlFor="email">
            Email
          </label>
          <div className={getWrapperStyles(isEmailError, isEmailSuccess)}>
            <span className={spanStyles}>Mail:</span>
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="Your@email.com"
              className={clsx(inputStyles, "pr-6")}
            />
            {isEmailError && (
              <svg
                width={20}
                height={20}
                className="absolute right-3.5 top-1/2 -translate-y-1/2"
              >
                <use href="/sprite.svg#icon-error"></use>
              </svg>
            )}
            {isEmailSuccess && (
              <svg
                width={20}
                height={20}
                className="absolute right-3.5 top-1/2 -translate-y-1/2"
              >
                <use href="/sprite.svg#icon-success"></use>
              </svg>
            )}
          </div>
          {isEmailError && (
            <p className={errorStyles}>{errors.email?.message}</p>
          )}
          {isEmailSuccess && <p className={successStyles}>Email is valid</p>}
        </div>

        <div className="relative">
          <label className="sr-only" htmlFor="password">
            Password
          </label>
          <div className={getWrapperStyles(isPasswordError, isPasswordSuccess)}>
            <span className={spanStyles}>Password:</span>
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Yourpasswordhere"
              className={clsx(inputStyles, "pr-6")}
            />

            {!isSubmitted ? (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center transition-colors duration-250 text-primary hover:text-[rgba(249,249,249,0.5)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <svg width={20} height={20} stroke="currentColor" fill="none">
                  <use
                    href={`/sprite.svg#${showPassword ? "icon-eye" : "icon-eye-off"}`}
                  ></use>
                </svg>
              </button>
            ) : (
              <>
                {isPasswordError && (
                  <svg
                    width={20}
                    height={20}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  >
                    <use href="/sprite.svg#icon-error"></use>
                  </svg>
                )}
                {isPasswordSuccess && (
                  <svg
                    width={20}
                    height={20}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  >
                    <use href="/sprite.svg#icon-success"></use>
                  </svg>
                )}
              </>
            )}
          </div>
          {isPasswordError && (
            <p className={errorStyles}>{errors.password?.message}</p>
          )}
          {isPasswordSuccess && (
            <p className={successStyles}>Password is secure</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-18 md:mt-36.5 md:justify-normal">
        <Button type="submit" color="white" className="w-35 md:w-56.25 md:mr-5">
          Log in
        </Button>
        <Link
          href="/register"
          className="text-secondary text-[12px] underline [&:hover,&:focus]:text-primary transition-colors duration-250 leading-[1.17] md:text-[14px] md:leading-[1.29]"
        >
          Don’t have an account?
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
