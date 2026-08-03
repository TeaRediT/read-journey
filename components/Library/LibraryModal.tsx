"use client";

import { useEffect } from "react";
import clsx from "clsx";

import ModalNotification from "@/components/ModalNotification/ModalNotification";

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isError: boolean;
  isAdded: boolean;
}

const LibraryModal = ({
  isOpen,
  onClose,
  isError,
  isAdded,
}: LibraryModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        onClick={onClose}
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
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 transition-colors duration-250 hover:text-secondary cursor-pointer"
        >
          <svg width={22} height={22} stroke="currentColor">
            <use href="/sprite.svg#icon-close"></use>
          </svg>
        </button>

        <ModalNotification
          success={isAdded}
          error={isError}
        ></ModalNotification>
      </div>
    </>
  );
};

export default LibraryModal;
