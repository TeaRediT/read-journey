interface DashboardProps {
  children: React.ReactNode;
}

export const Dashboard = ({ children }: DashboardProps) => {
  return (
    <section className="flex flex-col gap-5 rounded-[30px] bg-surface p-5 my-2.5 md:flex-row md:justify-between md:gap-0 md:p-8 md:my-4 ds:flex-col ds:justify-normal ds:gap-5 ds:p-5 ds:pt-10 ds:w-88.25 ds:my-0">
      {children}
    </section>
  );
};
