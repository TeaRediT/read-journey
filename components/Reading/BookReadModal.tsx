"use client";

import { useCallback, useEffect } from "react";
import clsx from "clsx";

interface BookReadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookReadModal = ({ isOpen, onClose }: BookReadModalProps) => {
  const handleClose = useCallback(() => {
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
          "flex flex-col items-center fixed left-1/2 top-1/2 z-50 w-full max-w-83.75 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface py-15 transition-transform duration-250 ring ring-[rgba(104,104,104,0.2)] md:max-w-85.5 md:py-12.5",
          isOpen
            ? "visible scale-100 opacity-100"
            : "invisible scale-95 opacity-0",
        )}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 cursor-pointer transition-colors duration-250 hover:text-secondary"
        >
          <svg width={22} height={22} stroke="currentColor">
            <use href="/sprite.svg#icon-close"></use>
          </svg>
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-5 text-[50px] leading-none md:text-[68px] md:leading-[1.03] md:mb-8">
            📚
          </div>

          <h2 className="mb-2.5 text-lg font-bold leading-none md:text-[20px] md:mb-3.5">
            The book is read
          </h2>

          <p className="text-secondary w-[256px]">
            It was an <span className="text-primary">exciting journey</span>,
            where each page revealed new horizons, and the characters became
            inseparable friends.
          </p>
        </div>
      </div>
    </>
  );
};
