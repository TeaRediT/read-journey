"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import { deleteBookFromGallery, getUsersBooks } from "@/lib/api";
import { Book, Status } from "@/lib/types";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import Select, { StylesConfig } from "react-select";
import clsx from "clsx";
import LibraryModal from "./LibraryModal";

interface StatusOption {
  value: Status;
  label: string;
}

const statusOptions: StatusOption[] = [
  { value: "unread", label: "Unread" },
  { value: "in-progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "all", label: "All books" },
];

const selectStyles: StylesConfig<StatusOption, false> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "transparent",
    borderColor: state.isFocused ? "rgba(249, 249, 249, 0.4)" : "#3e3e3e",
    borderRadius: "12px",
    boxShadow: "none",
    cursor: "pointer",
    height: "40px",
    width: "120px",
    "&:hover": {
      borderColor: "rgba(249, 249, 249, 0.4)",
    },
    "@media (min-width: 768px)": {
      width: "153px",
      height: "46px",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 0 0 14px",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#262626",
    borderRadius: "12px",
    padding: "14px",
    marginTop: "4px",
    "@media (min-width: 768px)": { marginTop: "8px" },
  }),
  menuList: (provided) => ({
    ...provided,
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: "transparent",
    color: state.isSelected ? "#f9f9f9" : "#686868",
    cursor: "pointer",
    padding: "0",
    fontSize: "12px",
    lineHeight: "1.33",
    "&:hover": {
      color: "#f9f9f9",
    },
    "@media (min-width: 768px)": {
      fontSize: "14px",
      lineHeight: "1.29",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#f9f9f9",
    lineHeight: "1.33",
    fontSize: "12px",
    margin: 0,
    "@media (min-width: 768px)": {
      fontSize: "14px",
      lineHeight: "1.29",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: "#f9f9f9",
    "& svg": {
      width: "16px",
      height: "16px",
      transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "none",
      transition: "transform 0.25s",
    },
    padding: "0 14px 0 0",
  }),
};

export const MyLibraryBooks = () => {
  const [status, setStatus] = useState<Status>("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const queryClient = useQueryClient();

  const {
    data: books,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-library-books", status],
    queryFn: async () => getUsersBooks(status),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => deleteBookFromGallery(id),
    onSuccess: () => {
      toast.success(
        "The book has been successfully removed from your library!",
      );
      queryClient.invalidateQueries({ queryKey: ["my-library-books"] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete the book. Please try again.";
      toast.error(errorMessage);
    },
  });

  return (
    <section className="flex flex-col mb-10 rounded-[30px] bg-surface p-5 pt-10 pb-16.25 md:mb-8 md:h-129.5 md:p-10 ds:w-211.75 ds:h-162.75 ds:m-0 ds:pb-7">
      <div className="mb-3.5 flex justify-between">
        <h2 className="text-[20px] font-bold leading-none md:text-[28px] md:leading-[1.14]">
          My library
        </h2>
        <Select
          options={statusOptions}
          value={statusOptions.find((opt) => opt.value === status)}
          onChange={(newValue) => {
            if (newValue) setStatus(newValue.value);
          }}
          styles={selectStyles}
          isSearchable={false}
        />
      </div>

      {isLoading ? (
        <div className="text-secondary text-sm">Loading books...</div>
      ) : isError ? (
        <div className="text-[#e90516] text-sm">Error loading books.</div>
      ) : books?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center pt-12.25 pb-8.75 md:pt-18 md:pb-0 ds:pt-33.25">
          <div className="mb-2.5 flex h-25 w-25 items-center justify-center rounded-full bg-surface-light text-[50px] leading-none md:mb-5 md:w-32.5 md:h-32.5 md:text-[70px]">
            📚
          </div>
          {status === "done" ? (
            <p className="w-49.5 md:w-67.5">
              You haven&apos;t finished any books yet.{" "}
              <span className="text-secondary">Keep reading</span> to see your
              achievements here!
            </p>
          ) : (
            <p className="w-49.5 md:w-73">
              To start training, add{" "}
              <span className="text-secondary">some of your books</span> or from
              the recommended ones
            </p>
          )}
        </div>
      ) : (
        <ul
          className={clsx(
            "flex justify-between flex-wrap gap-y-5 md:justify-normal md:gap-x-6.25 md:gap-y-6.75 md:overflow-y-auto ds:gap-x-5",
            "[&::-webkit-scrollbar]:hidden scrollbar-none [-ms-overflow-style:none]",
          )}
        >
          {books?.map((book) => (
            <li
              key={book._id}
              className="flex flex-col h-62 w-[calc(50%-8px)] max-w-34.25"
            >
              <div
                onClick={() => setSelectedBook(book)}
                className="group relative w-full h-52 cursor-pointer overflow-hidden rounded-lg mb-2"
              >
                <Image
                  src={book.imageUrl ?? "/book.jpg"}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-250 group-hover:scale-105"
                  sizes="137px"
                />
              </div>

              <div className="flex justify-between">
                <div className="w-23.75 overflow-hidden">
                  <h3 className="truncate font-bold mb-0.5">{book.title}</h3>
                  <p className="truncate text-[10px] text-secondary leading-[1.2]">
                    {book.author}
                  </p>
                </div>

                <button
                  onClick={() => deleteMutation.mutate(book._id)}
                  disabled={deleteMutation.isPending}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(232,80,80,0.2)] bg-[rgba(232,80,80,0.1)] text-[#E85050] transition-colors duration-250 hover:bg-[#E90516] hover:text-primary disabled:opacity-50 cursor-pointer"
                >
                  <svg width={14} height={14} stroke="currentColor" fill="none">
                    <use href="/sprite.svg#icon-trash"></use>
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {createPortal(
        <LibraryModal
          book={selectedBook}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
        />,
        document.body,
      )}
    </section>
  );
};
