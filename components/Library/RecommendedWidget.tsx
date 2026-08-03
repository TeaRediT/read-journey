"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchBooks } from "@/lib/api";
import { Book } from "@/lib/types";
import { useState } from "react";
import { createPortal } from "react-dom";
import BookModal from "../Recommended/RecommendedBooks/BookModal";

export const RecommendedWidget = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["recommended-widget"],
    queryFn: () => {
      const page = Math.floor(Math.random() * 3) + 1;
      return fetchBooks({ page, limit: 3 });
    },
  });

  return (
    <div className="rounded-xl bg-surface-light p-5 md:w-78.25 md:pt-6.5 md:pb-6.75 ds:p-5">
      <h2 className="mb-3.5 text-lg font-bold leading-none text-[#e3e3e3] md:text-xl md:mb-5">
        Recommended books
      </h2>

      {isLoading ? (
        <div className="flex h-35 items-center justify-center">
          <p className="text-sm text-secondary">Loading...</p>
        </div>
      ) : isError ? (
        <div className="flex h-35 items-center justify-center">
          <p className="text-sm text-[#e90516]">Error loading books.</p>
        </div>
      ) : (
        <ul className="mb-2.75 flex justify-between gap-5 md:mb-3.5 md:w-63.25">
          {data?.results.map((book) => (
            <li
              key={book._id}
              className="flex w-17.75 flex-col overflow-hidden"
            >
              <div
                onClick={() => setSelectedBook(book)}
                className="relative mb-2 h-26.75 overflow-hidden rounded-lg group cursor-pointer"
              >
                <Image
                  src={book.imageUrl}
                  alt={book.title}
                  fill
                  sizes="71px"
                  className="absolute object-cover group transition-transform duration-250 group-hover:scale-105"
                />
              </div>
              <h3 className="truncate text-[10px] font-bold text-[#e3e3e3] leading-[1.2] mb-0.5">
                {book.title}
              </h3>
              <p className="truncate text-[10px] leading-[1.2] text-secondary">
                {book.author}
              </p>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/recommended"
        className="flex items-end justify-between text-secondary transition-colors duration-250 hover:text-primary"
      >
        <p className="underline underline-offset-2 text-xs leading-[1.17]">
          Home
        </p>
        <svg className="w-5 h-5 md:w-6 md:h-6" stroke="currentColor">
          <use href="/sprite.svg#icon-arrow-right"></use>
        </svg>
      </Link>
      {createPortal(
        <BookModal
          book={selectedBook}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
        />,
        document.body,
      )}
    </div>
  );
};
