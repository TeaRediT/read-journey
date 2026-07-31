import Link from "next/link";

const steps = [
  {
    label: "Create a personal library: ",
    text: "add the books you intend to read to it.",
  },
  {
    label: "Create your first workout: ",
    text: "define a goal, choose a period, start training.",
  },
];

export const WorkoutInfo = () => {
  return (
    <div className="flex flex-col gap-5 rounded-xl bg-surface-light p-5 md:gap-0 md:w-78.25">
      <h2 className="text-[18px] font-bold leading-none md:text-[20px] md:mb-10">
        Start your workout
      </h2>

      <ul className="flex flex-col gap-5 md:mb-6.5">
        {steps.map((step, idx) => {
          return (
            <li key={step.label.slice(0, 3) + idx} className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-surface leading-none md:w-11 md:h-11 md:text-[20px]">
                {idx + 1}
              </div>
              <p className=" text-secondary">
                <span className="text-primary">{step.label}</span>
                {step.text}
              </p>
            </li>
          );
        })}
      </ul>

      <Link
        href="/library"
        className="flex items-center justify-between text-secondary transition-colors duration-250 hover:text-primary"
      >
        <p className="underline underline-offset-2">My library</p>
        <svg width={24} height={24} stroke="currentColor">
          <use href="/sprite.svg#icon-arrow-right"></use>
        </svg>
      </Link>
    </div>
  );
};
