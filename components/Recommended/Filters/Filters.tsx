"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FilterFormData, filtersSchema } from "./FiltersSchema";
import Button from "@/components/Button/Button";

interface FiltersProps {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setAuthor: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const divStyles = "flex items-center rounded-xl bg-surface-light p-3.5 md:py-4";
const labelStyles =
  "mr-2.5 whitespace-nowrap text-[12px] text-secondary leading-[1.33] md:text-sm md:leading-[1.29]";
const inputStyles =
  "w-full text-[12px] leading-[1.33] outline-none placeholder:text-primary md:text-sm md:leading-[1.29]";
const errorStyles = "text-[#e90516] text-[8px] absolute bottom-[-8.5px]";

export const Filters = ({ setTitle, setAuthor, setPage }: FiltersProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FilterFormData>({
    resolver: yupResolver(filtersSchema),
    defaultValues: {
      title: "",
      author: "",
    },
  });

  const onSubmit = (data: FilterFormData) => {
    const title = data.title?.trim() || "";
    const author = data.author?.trim() || "";

    setTitle(title);
    setAuthor(author);
    setPage(1);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col md:w-73.75 ds:w-full"
    >
      <h2 className="ml-3.5 mb-2 text-[10px] leading-[1.2] md:text-sm md:leading-[1.29]">
        Filters:
      </h2>

      <div className="flex flex-col gap-2 mb-5">
        <div className="relative">
          <div className={divStyles}>
            <label htmlFor="title" className={labelStyles}>
              Book title:
            </label>
            <input
              {...register("title")}
              id="title"
              type="text"
              placeholder="Enter text"
              className={inputStyles}
            />
          </div>
          {errors.title && (
            <span className={errorStyles}>{errors.title.message}</span>
          )}
        </div>

        <div className="relative">
          <div className={divStyles}>
            <label htmlFor="author" className={labelStyles}>
              The author:
            </label>
            <input
              {...register("author")}
              id="author"
              type="text"
              placeholder="Enter text"
              className={inputStyles}
            />
          </div>
          {errors.author && (
            <span className={errorStyles}>{errors.author.message}</span>
          )}
        </div>
      </div>

      <Button
        type="submit"
        color="black"
        className="w-24.5 h-9.5 md:w-30.5 md:h-10.5"
      >
        To apply
      </Button>
    </form>
  );
};
