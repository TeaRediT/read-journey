"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Book } from "@/lib/types";
import Button from "@/components/Button/Button";
import { useMutation } from "@tanstack/react-query";
import { addBookToGallery } from "@/lib/api";

interface BookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookModal = ({ book, isOpen, onClose }: BookModalProps) => {
  const [currentBook, setCurrentBook] = useState<Book | null>(book);
  const [bookAdded, setBookAdded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  if (book && book !== currentBook) setCurrentBook(book);

  const handleClose = useCallback(() => {
    setBookAdded(false);
    setIsError(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  const addBookMutation = useMutation({
    mutationFn: async (id: string) => addBookToGallery(id),
    onSuccess: () => setBookAdded(true),
    onError: () => setIsError(true),
  });

  const handleAddBook = () => {
    addBookMutation.mutate(book?._id as string);
  };

  return (
    <>
      <div
        onClick={handleClose}
        className={clsx(
          "fixed inset-0 z-40 bg-[rgba(20,20,20,0.6)] transition-opacity duration-250",
          isOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      />

      <div
        className={clsx(
          "flex flex-col items-center fixed left-1/2 top-1/2 z-50 w-full max-w-83.75 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface py-10 transition-transform duration-250 ring ring-[rgba(104,104,104,0.2)] md:max-w-125 md:py-12.5",
          isOpen
            ? "visible scale-100 opacity-100"
            : "invisible scale-95 opacity-0",
          bookAdded || isError ? "py-15 md:py-12.5 md:w-85.5" : "",
        )}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 transition-colors duration-250 hover:text-secondary cursor-pointer"
        >
          <svg width={22} height={22} stroke="currentColor">
            <use href="/sprite.svg#icon-close"></use>
          </svg>
        </button>

        {currentBook && !bookAdded && !isError && (
          <div className="flex flex-col items-center">
            <div className="relative mb-4 w-35 h-53.25 overflow-hidden rounded-lg md:w-38.25 md:h-58.25">
              <Image
                src={currentBook.imageUrl}
                alt={currentBook.title}
                fill
                sizes="(max-width: 767px) 140px, 153px"
                className="object-cover"
              />
            </div>
            <h2 className="mb-0.5 text-center text-lg font-bold leading-none md:text-[20px]">
              {currentBook.title}
            </h2>
            <p className="mb-1 text-[12px] leading-[1.17] text-secondary md:text-sm md:leading-[1.29]">
              {currentBook.author}
            </p>
            <p className="mb-5 text-[10px] leading-[1.2] md:mb-8">
              {currentBook.totalPages} pages
            </p>

            <Button
              className="w-35.25 md:w-40.5"
              type="button"
              color="black"
              onClick={handleAddBook}
            >
              Add to library
            </Button>
          </div>
        )}
        {(bookAdded || isError) && (
          <div className="flex flex-col items-center">
            <p className="text-[50px] leading-none mb-5 md:text-[68px] md:leading-[1.03] md:mb-8">
              {bookAdded && "👍"}
              {isError && "❌"}
            </p>
            <h2 className="text-[18px] leading-none font-bold mb-2.5 md:text-[20px] md:mb-3.5">
              {bookAdded && "Good job"}
              {isError && "Oops! Error"}
            </h2>
            {bookAdded && (
              <p className="text-secondary text-center w-63.75">
                Your book is now in{" "}
                <span className="text-primary">the library!</span> The joy knows
                no bounds and now you can start your training
              </p>
            )}
            {isError && (
              <p className="text-secondary text-center w-63.75">
                Something went wrong while adding the book to your library.
                Please try again later.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};
