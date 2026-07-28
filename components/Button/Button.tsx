interface ButtonProps {
  type: "submit" | "button";
  children: React.ReactNode;
  color: "white" | "black";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

const Button = ({
  type,
  children,
  color,
  disabled,
  className = "",
  onClick,
}: ButtonProps) => {
  const baseStyles =
    "flex justify-center items-center rounded-[30px] font-bold transition-all duration-250 cursor-pointer outline-none disabled:cursor-default disabled:opacity-50 enabled:active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary";

  const colorStyles =
    color === "white"
      ? "bg-primary text-surface border border-transparent enabled:[&:hover,&:focus-visible]:bg-transparent enabled:[&:hover,&:focus-visible]:text-primary enabled:[&:hover,&:focus-visible]:border-[rgba(104,104,104,0.2)]"
      : "bg-transparent text-primary border border-solid border-[rgba(104,104,104,0.2)] enabled:[&:hover,&:focus-visible]:bg-primary enabled:[&:hover,&:focus-visible]:text-surface enabled:[&:hover,&:focus-visible]:border-transparent";

  const sizeStyles =
    color === "white"
      ? "h-10.5 md:h-13 md:leading-none md:text-[20px]"
      : "h-10.5 md:h-11.5 md:leading-[1.13] md:text-[16px]";

  return (
    <button
      className={`${baseStyles} ${colorStyles} ${sizeStyles} ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
