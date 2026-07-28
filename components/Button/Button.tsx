interface ButtonProps {
  type: "submit" | "button";
  children: React.ReactNode;
  color: "white" | "black";
  width: number;
  disabled?: boolean;
  onClick?: () => void;
}

const Button = ({
  type,
  children,
  color,
  width,
  disabled,
  onClick,
}: ButtonProps) => {
  const baseStyles =
    "flex justify-center items-center rounded-[30px] font-bold transition-all duration-250 cursor-pointer outline-none disabled:cursor-default disabled:opacity-50 enabled:active:scale-[0.98]";

  const colorStyles =
    color === "white"
      ? "bg-primary text-surface enabled:hover:brightness-90"
      : "bg-transparent text-primary border border-solid border-[rgba(104,104,104,0.2)] enabled:hover:bg-primary/5 focus-visible:bg-primary/10";

  const sizeStyles =
    color === "white"
      ? "h-10.5 md:h-13 md:leading-none md:text-[20px]"
      : "h-10.5 md:h-11.5 md:leading-[1.13] md:text-[16px]";

  return (
    <button
      className={`${baseStyles} ${colorStyles} ${sizeStyles}`}
      type={type}
      style={{ width: `${width}px` }}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
