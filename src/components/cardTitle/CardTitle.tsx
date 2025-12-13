import { twMerge } from "tailwind-merge";

const CardTitle = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <>
      <h2 className={`text-xl font-bold ${twMerge(className)}`}>{title}</h2>
      <hr />
    </>
  );
};

export default CardTitle;
