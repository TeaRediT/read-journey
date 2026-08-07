"use client";

import { Dashboard } from "@/components/Dashboard/DashBoard";
import { AddReading } from "@/components/Reading/AddReading";
import { BookReadModal } from "@/components/Reading/BookReadModal";
import { Details } from "@/components/Reading/Details";
import { MyBook } from "@/components/Reading/MyBook";
import { getBook } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";

const ReadingClient = () => {
  const { id: bookId } = useParams<{ id: string }>();
  const [isDoneModalOpen, setIsDoneModalOpen] = useState(false);

  const {
    data: book,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["book-reading", bookId],
    queryFn: () => getBook(bookId),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center">
        <p className="text-sm text-secondary">Loading book details...</p>
      </div>
    );
  }
  if (isError || !book) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center">
        <p className="text-sm text-[#e90516]">
          Error loading book. Please try again later.
        </p>
      </div>
    );
  }

  const lastProgress =
    book.progress && book.progress.length > 0
      ? book.progress[book.progress.length - 1]
      : null;

  const isReading = lastProgress?.status === "active";
  const hasRecords =
    book.progress?.some(
      (session) => session.status === "inactive" && session.finishPage,
    ) ?? false;

  let minPage = 1;
  if (isReading) {
    minPage = lastProgress.startPage;
  } else if (lastProgress && lastProgress.finishPage) {
    minPage = lastProgress.finishPage;
  }

  let timeLeftString = "";
  if (book.timeLeftToRead) {
    const { hours, minutes } = book.timeLeftToRead;
    if (hours > 0) {
      timeLeftString = `${hours} hours and ${minutes} minutes left`;
    } else if (minutes > 0) {
      timeLeftString = `${minutes} minutes left`;
    }
  }

  return (
    <div className="ds:flex ds:justify-between ds:pt-4 ds:pb-6.75">
      <Dashboard className="min-h-97.5 gap-10 md:min-h-84 md:pb-4 ds:gap-10 ds:h-162.75">
        <AddReading
          book={book}
          isReading={isReading}
          onFinish={() => setIsDoneModalOpen(true)}
          minPage={minPage}
        />
        <Details
          bookId={book._id}
          hasRecords={hasRecords}
          progress={book.progress || []}
          totalPages={book.totalPages}
        />
      </Dashboard>
      <MyBook book={book} isReading={isReading} timeLeft={timeLeftString} />
      {createPortal(
        <BookReadModal
          isOpen={isDoneModalOpen}
          onClose={() => setIsDoneModalOpen(false)}
        />,
        document.body,
      )}
    </div>
  );
};

export default ReadingClient;
