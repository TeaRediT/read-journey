interface ModalNotificationProps {
  success: boolean;
  error: boolean;
}

const ModalNotification = ({ success, error }: ModalNotificationProps) => {
  return (
    <div className="flex flex-col items-center">
      <p className="text-[50px] leading-none mb-5 md:text-[68px] md:leading-[1.03] md:mb-8">
        {success && "👍"}
        {error && "❌"}
      </p>
      <h2 className="text-[18px] leading-none font-bold mb-2.5 md:text-[20px] md:mb-3.5">
        {success && "Good job"}
        {error && "Oops!"}
      </h2>
      {success && (
        <p className="text-secondary text-center w-63.75">
          Your book is now in <span className="text-primary">the library!</span>{" "}
          The joy knows no bounds and now you can start your training
        </p>
      )}
      {error && (
        <p className="text-secondary text-center w-63.75">
          The book has already been added, or something went wrong.
        </p>
      )}
    </div>
  );
};

export default ModalNotification;
