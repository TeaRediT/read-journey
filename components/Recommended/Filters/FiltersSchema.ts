import * as yup from "yup";

export const filtersSchema = yup.object({
  title: yup
    .string()
    .ensure()
    .test(
      "min-length",
      "Must be at least 2 characters",
      (value) => !value || value.trim().length >= 2,
    ),
  author: yup
    .string()
    .ensure()
    .test(
      "min-length",
      "Must be at least 2 characters",
      (value) => !value || value.trim().length >= 2,
    ),
});

export type FilterFormData = yup.InferType<typeof filtersSchema>;
