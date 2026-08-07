"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";
import Button from "../Button/Button";
import { Book } from "@/lib/types";
import clsx from "clsx";
import { finishReading, startReading } from "@/lib/api";

interface AddReadingProps {
  isReading: boolean;
  book: Book;
  onFinish: () => void;
  minPage: number;
}

export const AddReading = ({
  isReading,
  book,
  onFinish,
  minPage,
}: AddReadingProps) => {
  const schema = yup.object().shape({
    pageNumber: yup
      .number()
      .transform((value) => (Number.isNaN(value) ? undefined : value))
      .required("Page number is required")
      .positive("Must be greater than 0")
      .integer("Must be a whole number")
      .min(minPage, `Minimum page is ${minPage}`)
      .max(book.totalPages, `Maximum page is ${book.totalPages}`),
  });

  type FormData = yup.InferType<typeof schema>;

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const readingMutation = useMutation({
    mutationFn: async (pageNumber: number) => {
      const payload = { id: book._id, page: pageNumber };

      if (isReading) {
        return finishReading(payload);
      } else {
        return startReading(payload);
      }
    },
    onSuccess: (data, pageNumber) => {
      queryClient.invalidateQueries({ queryKey: ["book-reading", book._id] });

      if (isReading) {
        if (pageNumber >= book.totalPages) {
          onFinish();
        } else {
          toast.success("Reading progress saved!");
        }
      } else {
        toast.success("Reading started! Good luck!");
      }

      reset();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Something went wrong!");
    },
  });

  const onSubmit = (data: FormData) => {
    readingMutation.mutate(data.pageNumber);
  };

  return (
    <div className="md:w-73.75">
      <h2 className="mb-2 ml-3.5 text-[10px] leading-[1.2] md:text-[14px] md:leading-[1.29]">
        {isReading ? "Stop page:" : "Start page:"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="relative">
          <div className="flex items-center rounded-xl bg-surface-light p-3.5 md:py-4">
            <label
              htmlFor="pageNumber"
              className="mr-2.5 whitespace-nowrap text-[12px] text-secondary leading-[1.33] md:text-sm md:leading-[1.29]"
            >
              Page number:
            </label>
            <input
              {...register("pageNumber")}
              id="pageNumber"
              type="text"
              placeholder="0"
              disabled={readingMutation.isPending}
              className={
                "w-full text-[12px] leading-[1.33] outline-none placeholder:text-primary md:text-sm md:leading-[1.29]"
              }
            />
          </div>
          {errors.pageNumber && (
            <span className="text-[#e90516] text-[8px] absolute -bottom-3.75">
              {errors.pageNumber.message}
            </span>
          )}
        </div>

        <Button
          className={clsx(
            "h-9.5 md:h-10.5",
            isReading ? "w-22.25 md:w-28" : " w-22.75 md:w-28.5",
          )}
          color="black"
          type="submit"
          disabled={readingMutation.isPending || !isValid}
        >
          {isReading ? "To stop" : "To start"}
        </Button>
      </form>
    </div>
  );
};
