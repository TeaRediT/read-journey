"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Book } from "@/lib/types";
import ModalNotification from "@/components/ModalNotification/ModalNotification";
import Link from "next/link";

interface LibraryModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

const LibraryModal = ({ book, isOpen, onClose }: LibraryModalProps) => {
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

            <Link
              className="flex justify-center items-center rounded-[30px] font-bold transition-all duration-250 cursor-pointer outline-none active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary bg-transparent text-primary border border-solid border-[rgba(249,249,249,0.2)] hover:bg-primary hover:text-surface hover:border-transparent focus-visible:bg-primary focus-visible:text-surface focus-visible:border-transparent h-10.5 md:h-11.5 md:leading-[1.13] md:text-[16px] w-35.25 md:w-39.75"
              href={`/reading/${book?._id}`}
            >
              Start Reading
            </Link>
          </div>
        )}
        {(bookAdded || isError) && (
          <ModalNotification
            success={bookAdded}
            error={isError}
          ></ModalNotification>
        )}
      </div>
    </>
  );
};

export default LibraryModal;
