"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Link from "next/link";
import { RegisterFormData, registerSchema } from "./RegisterFormSchema";
import Button from "../Button/Button";

const divStyles =
  "flex items-center bg-surface-light rounded-xl px-3.5 py-3.5 md:px-3.5 md:py-4";
const spanStyles =
  "text-secondary text-[12px] mr-2.5 leading-[1.33] md:text-[14px] md:leading-[1.29]";
const inputStyles =
  "text-primary text-[12px] outline-none placeholder:text-primary w-full leading-[1.33] md:text-[14px] md:leading-[1.29]";
const errorStyles =
  "text-red-500 text-[8px] absolute bottom-[-8.5px] md:text-[10px] bottom-[-13px]";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log("data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="md:w-118">
      <div className="flex flex-col gap-2 md:gap-3.5">
        <div className="relative">
          <label className="sr-only" htmlFor="name">
            Name
          </label>
          <div className={divStyles}>
            <span className={spanStyles}>Name:</span>
            <input
              {...register("name")}
              id="name"
              type="text"
              placeholder="Ilona Ratushniak"
              className={inputStyles}
            />
          </div>
          {errors.name && <p className={errorStyles}>{errors.name.message}</p>}
        </div>

        <div className="relative">
          <label className="sr-only" htmlFor="email">
            Email
          </label>
          <div className={divStyles}>
            <span className={spanStyles}>Mail:</span>
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="Your@email.com"
              className={inputStyles}
            />
          </div>
          {errors.email && (
            <p className={errorStyles}>{errors.email.message}</p>
          )}
        </div>

        <div className="relative">
          <label className="sr-only" htmlFor="password">
            Password
          </label>
          <div className={divStyles}>
            <span className={spanStyles}>Password:</span>
            <input
              {...register("password")}
              id="password"
              type="password"
              placeholder="Yourpasswordhere"
              className={inputStyles}
            />
            {/* Тут потім додамо кнопку для перемикання видимості пароля */}
          </div>
          {errors.password && (
            <p className={errorStyles}>{errors.password.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 md:mt-20.5 md:justify-normal">
        <Button
          type="submit"
          color="white"
          className="w-35 md:w-56.25 md:mr-5"
          disabled={!isValid}
        >
          Registration
        </Button>
        <Link
          href="/login"
          className="text-secondary text-[12px] underline [&:hover,&:focus]:text-primary transition-colors duration-250 leading-[1.17] md:text-[14px] md:leading-[1.29]"
        >
          Already have an account?
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
