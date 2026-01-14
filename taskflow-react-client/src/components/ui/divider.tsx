import { clsx } from "clsx";

interface DividerProps {
  text?: string;
  className?: string;
}

export const Divider = ({ text, className }: DividerProps) => {
  return (
    <div className={clsx("relative flex items-center py-4", className)}>
      <div className="flex-grow border-t border-zinc-800/50" />
      {text && (
        <span className="px-4 text-xs font-medium text-zinc-500">{text}</span>
      )}
      <div className="flex-grow border-t border-zinc-800/50" />
    </div>
  );
};

