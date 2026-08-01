"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { BookModal } from "./BookModal";
import { fetchBooks } from "@/lib/api";
import { Book } from "@/lib/types";
import Button from "@/components/Button/Button";
import { createPortal } from "react-dom";

interface RecommendedBooksProps {
  limit: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  author: string;
  title: string;
}

const RecommendedBooks = ({
  limit,
  page,
  setPage,
  setLimit,
  author,
  title,
}: RecommendedBooksProps) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= 1440) {
        setLimit(10);
      } else if (width >= 768) {
        setLimit(8);
      } else {
        setLimit(2);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setLimit]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["recommended-books", page, limit, author, title],
    queryFn: () =>
      fetchBooks({ page: page, limit: limit, author: author, title: title }),
    refetchOnMount: false,
  });

  const totalPages = data?.totalPages || 1;
  const isPrevDisabled = page === 1 || isFetching;
  const isNextDisabled = page === totalPages || isFetching;

  return (
    <section className="rounded-[30px] px-5 py-10 bg-surface mb-10 md:p-10 ds:mb-0 ds:pb-7 ds:w-211.75">
      <div className="flex justify-between mb-5.5 md:mb-5">
        <h1 className="text-[20px] font-bold leading-none md:text-[28px] md:leading-[1.14]">
          Recommended
        </h1>

        <ul className="flex gap-2">
          <li>
            <Button
              className="h-8 w-8 md:h-10 md:w-10"
              type="button"
              color="black"
              disabled={isPrevDisabled}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <svg
                stroke="currentColor"
                fill="none"
                className="w-4 h-4 md:w-5 md:h-5"
              >
                <use href="/sprite.svg#icon-chevron-left"></use>
              </svg>
            </Button>
          </li>

          <li>
            <Button
              className="h-8 w-8 md:h-10 md:w-10"
              type="button"
              color="black"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={isNextDisabled}
            >
              <svg
                stroke="currentColor"
                fill="none"
                className="w-4 h-4 md:w-5 md:h-5"
              >
                <use href="/sprite.svg#icon-chevron-right"></use>
              </svg>
            </Button>
          </li>
        </ul>
      </div>
      {isLoading ? (
        <div className="text-secondary text-sm">Loading books...</div>
      ) : isError ? (
        <div className="text-[#e90516] text-sm">Error loading books.</div>
      ) : (
        <ul className="flex justify-between md:justify-normal md:gap-x-6.25 md:gap-y-6.75 md:flex-wrap ds:gap-x-5">
          {data?.results.map((book) => (
            <li key={book._id} className="flex flex-col w-34.25 h-62">
              <div
                onClick={() => setSelectedBook(book)}
                className="group relative w-full h-52 cursor-pointer overflow-hidden rounded-lg mb-2"
              >
                <Image
                  src={book.imageUrl}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-250 group-hover:scale-105"
                  sizes="137px"
                />
              </div>
              <h3 className="truncate font-bold mb-0.5">{book.title}</h3>
              <p className="truncate text-[10px] text-secondary leading-[1.2]">
                {book.author}
              </p>
            </li>
          ))}
        </ul>
      )}
      {createPortal(
        <BookModal
          book={selectedBook}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
        />,
        document.body,
      )}
    </section>
  );
};

export default RecommendedBooks;
