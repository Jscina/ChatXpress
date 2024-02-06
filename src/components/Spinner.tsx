import clsx from "clsx";

interface SpinnerProps {
  color?: string;
}

const Spinner = ({ color }: SpinnerProps) => {
  return (
    <div
      class={clsx(
        "animate-spin rounded-full h-4 w-4 border-t-2 border-b-2",
        color || "border-green-500",
      )}
    ></div>
  );
};

export default Spinner;
