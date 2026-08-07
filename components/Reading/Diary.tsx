"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ReadingProgress } from "@/lib/types";
import clsx from "clsx";
import { deleteReadingSession } from "@/lib/api";
import { formatDate, formatDuration } from "@/lib/utils";

interface DiaryProps {
  bookId: string;
  progress: ReadingProgress[];
  totalPages: number;
}

export const Diary = ({ bookId, progress, totalPages }: DiaryProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (readingId: string) => {
      deleteReadingSession(bookId, readingId);
    },
    onSuccess: (data, readingId) => {
      queryClient.setQueryData(
        ["book-reading", bookId],
        (oldData: { progress: ReadingProgress[] }) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            progress: oldData.progress.filter(
              (session: ReadingProgress) => session._id !== readingId,
            ),
          };
        },
      );
      toast.success("Reading session deleted!");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to delete session.");
    },
  });

  const completedSessions = progress
    .filter((session) => session.status === "inactive" && session.finishPage)
    .reverse();

  return (
    <ul
      className={clsx(
        "flex flex-col gap-4.25 h-52.75 p-4 overflow-y-auto bg-surface-light rounded-xl md:gap-3.5 md:h-63 ds:h-93.25 ds:p-5 ds:gap-5.5",
        "[&::-webkit-scrollbar]:hidden scrollbar-none [-ms-overflow-style:none]",
      )}
    >
      {completedSessions.length === 0 ? (
        <p className="text-sm text-secondary">No completed sessions yet.</p>
      ) : (
        completedSessions.map((session, index) => {
          const pagesRead = session.finishPage! - session.startPage + 1;
          const percent = ((pagesRead / totalPages) * 100).toFixed(1);
          const time = formatDuration(
            session.startReading,
            session.finishReading!,
          );

          const isLatest = index === 0;
          const isLast = index === completedSessions.length - 1;

          return (
            <li key={session._id} className="relative flex gap-2.25 md:gap-2.5">
              {!isLast && (
                <div className="absolute left-1.75 top-4 h-full w-0.5 bg-surface md:left-2.25 md:top-5"></div>
              )}

              <div className="relative z-10 flex h-4 w-4 items-center justify-center rounded-sm md:h-5 md:w-5">
                <div
                  className={clsx(
                    "flex h-full w-full items-center justify-center rounded-sm",
                    isLatest ? "bg-primary" : "bg-secondary",
                  )}
                >
                  <div
                    className={clsx(
                      "h-2 w-2 rounded-xs md:h-3 md:w-3",
                      isLatest ? "bg-background" : "bg-surface",
                    )}
                  ></div>
                </div>
              </div>

              <div className="flex flex-1 flex-col">
                <div className="mb-4.25 flex items-start justify-between">
                  <span
                    className={clsx(
                      "text-xs leading-[1.33] font-bold md:text-[16px] md:leading-[1.13]",
                      isLatest ? "text-primary" : "text-secondary",
                    )}
                  >
                    {formatDate(session.finishReading!)}
                  </span>
                  <span className="text-[12px] leading-[1.33] pr-5 text-secondary md:text-[14px] md:leading-[1.29] md:pr-5.5 ds:pr-7">
                    {pagesRead} pages
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1 md:gap-2">
                    <span className="text-sm text-primary md:text-[20px] md:leading-none">
                      {percent}%
                    </span>
                    <span className="text-[10px] text-secondary leading-[1.2] md:text-[12px] md:leading-[1.17]">
                      {time}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1.75">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <svg className="w-10.75 h-4.5 md:w-14.75 md:h-6.25">
                        <use href="/sprite.svg#icon-graph"></use>
                      </svg>

                      <button
                        onClick={() => deleteMutation.mutate(session._id!)}
                        disabled={deleteMutation.isPending}
                        className="cursor-pointer text-secondary transition-colors duration-250 hover:text-[#E90516] disabled:opacity-50"
                      >
                        <svg
                          width={14}
                          height={14}
                          stroke="currentColor"
                          fill="none"
                        >
                          <use href="/sprite.svg#icon-trash"></use>
                        </svg>
                      </button>
                    </div>

                    <span className="w-10.75 mr-5 text-center text-[10px] leading-[1.2] text-secondary md:w-14.75 md:mr-5.5 md:text-[12px] md:leading-[1.17] ds:mr-7">
                      {session.speed || 0} pages per hour
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })
      )}
    </ul>
  );
};
