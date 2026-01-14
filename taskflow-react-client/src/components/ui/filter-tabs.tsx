import { clsx } from "clsx";

export interface FilterTab {
  text: string;
  action: () => void;
}

export interface FilterTabsProps {
  tabs: FilterTab[];
  activeIndex: number;
  className?: string;
}

export const FilterTabs = ({
  tabs,
  activeIndex,
  className,
}: FilterTabsProps) => {
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <div className="flex items-center gap-2 bg-zinc-800/50 rounded-xl p-1 border border-zinc-700/50">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={tab.action}
            className={clsx(
              "px-4 py-2 text-sm rounded-lg transition-all duration-200",
              activeIndex === index
                ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
            )}
          >
            {tab.text}
          </button>
        ))}
      </div>
    </div>
  );
};
