"use client";

import { useEffect } from "react";
import clsx from "clsx";
import { UserNav } from "./UserNav";
import Button from "../Button/Button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  isPending: boolean;
}

export const MobileMenu = ({
  isOpen,
  onClose,
  onLogout,
  isPending,
}: MobileMenuProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div
        onClick={onClose}
        className={clsx(
          "fixed inset-0 z-40 bg-[rgba(20,20,20,0.6)] transition-opacity duration-250 md:hidden",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
      />

      <div
        className={clsx(
          "fixed top-0 right-0 z-50 h-full w-50 flex flex-col items-center bg-surface-light p-10 pt-8.5 transition-transform duration-250 md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <button onClick={onClose} className="z-1 self-end cursor-pointer">
          <svg width={28} height={28} stroke="currentColor">
            <use href="/sprite.svg#icon-close"></use>
          </svg>
        </button>

        <div className="flex flex-1">
          <UserNav />
        </div>

        <Button
          type={"button"}
          color={"black"}
          onClick={onLogout}
          disabled={isPending}
          className="w-22.75 h-9.5"
        >
          {isPending ? "Logging out..." : "Log out"}
        </Button>
      </div>
    </>
  );
};
