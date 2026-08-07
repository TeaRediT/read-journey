"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "@/components/Button/Button";
import { createPortal } from "react-dom";
import AddBookModal from "../AddBookModal";
import { AddBook as AddBookType } from "@/lib/types";
import { addNewBook } from "@/lib/api";
import { AddBookFormData, addBookSchema } from "./AddBookSchema";

const divStyles = "flex items-center rounded-xl bg-surface-light p-3.5 md:py-4";
const labelStyles =
  "mr-2.5 whitespace-nowrap text-[12px] text-secondary leading-[1.33] md:text-sm md:leading-[1.29]";
const inputStyles =
  "w-full text-[12px] leading-[1.33] outline-none placeholder:text-primary md:text-sm md:leading-[1.29]";
const errorStyles = "text-[#e90516] text-[8px] absolute bottom-[-8.5px]";

export const AddBook = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddBookFormData>({
    resolver: yupResolver(addBookSchema),
    defaultValues: {
      title: "",
      author: "",
      pages: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (book: AddBookType) => addNewBook(book),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-library-books"] });
      reset();
    },
    onSettled: () => {
      setIsModalOpen(true);
    },
  });

  const onSubmit = (data: AddBookFormData) => {
    const { title, author, pages } = data;
    const totalPages = String(pages);

    mutation.mutate({ title, author, totalPages });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:w-73.75 ds:w-full"
      >
        <h2 className="ml-3.5 mb-2 text-[10px] leading-[1.2] md:text-sm md:leading-[1.29] ds:hidden">
          Filters:
        </h2>
        <h2 className="hidden ds:block ml-3.5 mb-2 text-sm mleading-[1.29]">
          Create your library:
        </h2>

        <div className="flex flex-col gap-2 mb-5 md:mb-auto ds:mb-5">
          <div className="relative">
            <div className={divStyles}>
              <label htmlFor="title" className={labelStyles}>
                Book title:
              </label>
              <input
                {...register("title")}
                id="title"
                type="text"
                placeholder="Enter text"
                className={inputStyles}
              />
            </div>
            {errors.title && (
              <span className={errorStyles}>{errors.title.message}</span>
            )}
          </div>

          <div className="relative">
            <div className={divStyles}>
              <label htmlFor="author" className={labelStyles}>
                The author:
              </label>
              <input
                {...register("author")}
                id="author"
                type="text"
                placeholder="Enter text"
                className={inputStyles}
              />
            </div>
            {errors.author && (
              <span className={errorStyles}>{errors.author.message}</span>
            )}
          </div>

          <div className="relative">
            <div className={divStyles}>
              <label htmlFor="pages" className={labelStyles}>
                Number of pages:
              </label>
              <input
                {...register("pages")}
                id="pages"
                type="text"
                placeholder="0"
                className={inputStyles}
              />
            </div>
            {errors.pages && (
              <span className={errorStyles}>{errors.pages.message}</span>
            )}
          </div>
        </div>

        <Button
          type="submit"
          color="black"
          className="w-26.25 h-9.5 md:w-32.75 md:h-10.5"
        >
          Add book
        </Button>
      </form>
      {createPortal(
        <AddBookModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isError={mutation.isError}
          isAdded={mutation.isSuccess}
        />,
        document.body,
      )}
    </>
  );
};
