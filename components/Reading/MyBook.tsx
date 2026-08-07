import { Book } from "@/lib/types";
import Image from "next/image";

interface MyBookProps {
  isReading: boolean;
  book: Book;
  timeLeft?: string;
}

export const MyBook = ({ isReading, timeLeft, book }: MyBookProps) => {
  return (
    <section className="flex flex-col rounded-[30px] bg-surface px-5 py-10 mb-10 md:p-10 md:pb-6.25 ds:w-211.75 ds:h-162.75 ds:pb-13.25">
      <div className="mb-10 flex items-center justify-between md:mb-8 ds:mb-11">
        <h1 className="text-[20px] font-bold leading-none md:text-[28px] md:leading-[1.14]">
          My reading
        </h1>
        {timeLeft && <span className="text-xs text-secondary">{timeLeft}</span>}
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col items-center justify-center w-36.5 md:w-79.25">
          <div className="relative mb-2.5 w-34.25 h-52 overflow-hidden rounded-lg md:w-42.25 md:h-64 md:mb-6.25 ds:w-56 ds:h-85">
            <Image
              src={book.imageUrl ?? "/book.jpg"}
              alt="Book cover"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="mb-1.25 text-center text-[14px] font-bold md:text-[20px] md:leading-none md:mb-1 ds:text-nowrap">
            {book.title}
          </h3>
          <p className="mb-5 text-center text-[10px] text-secondary leading-[1.2] md:text-sm md:leading-[1.29] md:mb-4 ds:mb-6.25">
            {book.author}
          </p>

          {isReading ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary md:h-12.5 md:w-12.5">
              <div className="h-3.75 w-3.75 rounded-[3px] bg-[#E90516] md:w-5 md:h-5"></div>
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary md:h-12.5 md:w-12.5">
              <div className="h-7.5 w-7.5 rounded-full bg-[#E90516] md:h-10 md:w-10"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
