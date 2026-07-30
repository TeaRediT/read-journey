"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export const UserNav = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/recommended", label: "Home" },
    { href: "/library", label: "My library" },
  ];

  return (
    <nav className="">
      <ul className="mt-[300%] flex flex-col justify-center gap-5 md:flex-row md:gap-8 md:mt-0 md:h-6.5 md:items-start">
        {navLinks.map(({ href, label }) => {
          const isActive = pathname === href;

          return (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  "relative transition-colors duration-250 md:text-base md:leading-[1.13]",
                  isActive
                    ? "text-primary after:absolute after:-bottom-2 after:-left-0.5 after:-right-0.5 after:h-0.75 after:rounded-lg after:bg-blue after:content-['']"
                    : "text-secondary [&:hover,&:focus]:text-primary",
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
