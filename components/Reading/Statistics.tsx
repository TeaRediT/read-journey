"use client";

import { ReadingProgress } from "@/lib/types";

interface StatisticsProps {
  progress: ReadingProgress[];
  totalPages: number;
}

export const Statistics = ({ progress, totalPages }: StatisticsProps) => {
  const totalReadPages = progress
    .filter((session) => session.status === "inactive" && session.finishPage)
    .reduce((total, session) => {
      const pages = session.finishPage! - session.startPage + 1;
      return total + pages;
    }, 0);

  const rawPercent = (totalReadPages / totalPages) * 100;
  const percent = Math.min(100, Number(rawPercent.toFixed(1)));

  const baseSize = 100;
  const strokeWidth = 10;
  const center = baseSize / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <>
      <p className="hidden text-secondary text-[13px] mb-5 ds:block">
        Each page, each chapter is a new round of knowledge, a new step towards
        understanding. By rewriting statistics, we create our own reading
        history.
      </p>
      <div className="flex flex-col items-center justify-center rounded-xl bg-surface-light py-5 md:py-7 ds:pb-5 ds:pt-7.75">
        <div className="relative mb-5 flex items-center justify-center md:mb-4 ds:mb-5">
          <svg
            viewBox={`0 0 ${baseSize} ${baseSize}`}
            className="h-29 w-29 -rotate-90 transform md:h-34.5 md:w-34.5 ds:h-42 ds:w-42"
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#1f1f1f"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#30B94D"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-[18px] font-bold leading-[1.11] md:text-[20px] md:leading-none">
              {percent}%
            </span>
          </div>
        </div>

        <div className="flex gap-3.75">
          <div className="h-3.5 w-3.5 rounded-sm bg-green"></div>
          <div className="flex flex-col gap-1 md:gap-2">
            <span className="md:text-[20px] md:leading-none">{percent}%</span>
            <span className="text-[10px] text-secondary leading-[1.2] md:text-[12px] md:leading-[1.17]">
              {totalReadPages} pages read
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
