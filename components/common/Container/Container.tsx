import clsx from "clsx";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className = "" }: ContainerProps) => {
  return (
    <div
      className={clsx(
        "mx-auto",
        "w-full",
        "px-5",
        "min-w-[320px] max-w-93.75",
        "md:max-w-3xl md:px-8",
        "ds:max-w-7xl",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Container;
