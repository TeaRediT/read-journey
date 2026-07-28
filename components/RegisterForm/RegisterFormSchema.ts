import * as yup from "yup";

export const registerSchema = yup
  .object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, "Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(7, "Password must be at least 7 symbols")
      .required("Password is required"),
  })
  .required();

export type RegisterFormData = yup.InferType<typeof registerSchema>;
