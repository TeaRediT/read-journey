import * as yup from "yup";

export const addBookSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  author: yup.string().required("Author is required"),
  pages: yup
    .number()
    .typeError("Total pages must be a number")
    .positive("Must be greater than 0")
    .integer("Must be an integer")
    .required("Total pages is required"),
});

export type AddBookFormData = yup.InferType<typeof addBookSchema>;
