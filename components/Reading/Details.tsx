"use client";

import { useState } from "react";
import clsx from "clsx";
import { ReadingProgress } from "@/lib/types";
import { Diary } from "./Diary";
import { Statistics } from "./Statistics";

interface DetailsProps {
  hasRecords: boolean;
  progress: ReadingProgress[];
  bookId: string;
  totalPages: number;
}

export const Details = ({
  hasRecords,
  progress,
  bookId,
  totalPages,
}: DetailsProps) => {
  const [view, setView] = useState<"diary" | "statistics">("diary");

  return (
    <div className="flex flex-col md:w-76.25">
      <div className="flex items-start justify-between">
        <h2
          className={clsx(
            "text-[18px] font-bold leading-none md:text-[20px]",
            hasRecords ? "mb-5 md:mb-4 ds:mb-5" : "mb-3.5",
          )}
        >
          {!hasRecords ? "Progress" : view === "diary" ? "Diary" : "Statistics"}
        </h2>
        {hasRecords && (
          <ul className="flex items-center gap-2">
            <li>
              <button
                onClick={() => setView("diary")}
                className={clsx(
                  "flex items-center justify-center transition-colors duration-250 cursor-pointer",
                  view === "diary"
                    ? "text-primary"
                    : "text-secondary hover:text-primary",
                )}
              >
                <svg width={16} height={16} stroke="currentColor" fill="none">
                  <use href="/sprite.svg#icon-hourglass"></use>
                </svg>
              </button>
            </li>
            <li>
              <button
                onClick={() => setView("statistics")}
                className={clsx(
                  "flex items-center justify-center transition-colors duration-250 cursor-pointer",
                  view === "statistics"
                    ? "text-primary"
                    : "text-secondary hover:text-primary hover:[--pie-base:white]",
                )}
              >
                <svg width={16} height={16} stroke="currentColor" fill="none">
                  <use
                    href={`/sprite.svg#${view === "statistics" ? "icon-pie-active" : "icon-pie"}`}
                  ></use>
                </svg>
              </button>
            </li>
          </ul>
        )}
      </div>

      <div>
        {!hasRecords ? (
          <div className="flex flex-col items-center justify-center">
            <p className="mb-5 text-[12.5px] text-secondary md:mb-12.5 md:text-[13px] ds:mb-15">
              Here you will see when and how much you read. To record, click on
              the red button above.
            </p>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-light text-[32px] leading-none md:w-25 md:h-25 md:text-[50px] md:leading-[1.4]">
              🌟
            </div>
          </div>
        ) : view === "diary" ? (
          <Diary progress={progress} bookId={bookId} totalPages={totalPages} />
        ) : (
          <Statistics progress={progress} totalPages={totalPages} />
        )}
      </div>
    </div>
  );
};
