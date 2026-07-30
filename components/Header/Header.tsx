"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { MobileMenu } from "./MobileMenu";
import { RootState } from "@/redux/auth/store";
import { clearAuthHeader, logout } from "@/lib/api";
import { clearCredentials } from "@/redux/auth/authSlice";
import { UserNav } from "./UserNav";
import Container from "../common/Container/Container";
import { createPortal } from "react-dom";
import Button from "../Button/Button";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      document.cookie =
        "auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      clearAuthHeader();
      dispatch(clearCredentials());

      setIsMenuOpen(false);
      toast.success("Logged out successfully");
      router.push("/login");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="pt-5">
      <Container>
        <div className="flex items-center justify-between px-5 bg-surface rounded-[15px] h-14.25 md:h-18.5 md:px-4">
          <div className="flex gap-1 items-center ">
            <Link href="/recommended">
              <svg width={42} height={17} fill="#F9F9F9">
                <use href="/sprite.svg#icon-logo"></use>
              </svg>
            </Link>
            <p className="hidden text-[18px] font-bold leading-1 uppercase ds:block">
              read journey
            </p>
          </div>
          <div className="hidden md:block">
            <UserNav />
          </div>
          <div className="flex items-center gap-2.5 md:gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8.75 w-8.75 items-center justify-center rounded-full border border-[rgba(249,249,249,0.2)] bg-surface-light font-bold text-[16px] leading-none md:w-10 md:h-10 md:leading-[1.13]">
                {initial}
              </div>
              <p className="hidden font-bold text-[16px] leading-[1.13] ds:block">
                {user?.name || "Your name will be here"}
              </p>
            </div>

            <Button
              type={"button"}
              color={"black"}
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="hidden w-28.5 md:h-10.5 md:block"
            >
              {logoutMutation.isPending ? "Logging out..." : "Log out"}
            </Button>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="cursor-pointer md:hidden"
            >
              <svg width={28} height={28} stroke="currentColor" fill="none">
                <use href="/sprite.svg#icon-menu"></use>
              </svg>
            </button>
          </div>
          {createPortal(
            <MobileMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onLogout={handleLogout}
              isPending={logoutMutation.isPending}
            />,
            document.body,
          )}
        </div>
      </Container>
    </header>
  );
};
