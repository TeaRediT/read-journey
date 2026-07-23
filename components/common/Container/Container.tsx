import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className = "" }: ContainerProps) => {
  return (
    <div
      className={` mx-auto w-full px-4 min-[375px]:max-w-93.75 min-[768px]:max-w-3xl min-[1440px]:max-w-360 ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
