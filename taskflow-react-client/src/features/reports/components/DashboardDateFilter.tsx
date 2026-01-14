import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { useLocale } from "../../common/hooks/useLocale";
import { Select, type SelectOption } from "../../../components/form/select";
import { DateRangeType } from "../types/dateRangeType";
import type { DashboardStatisticsRequestDto } from "../types/dashboardStatisticsRequestDto";

interface DashboardDateFilterProps {
  value?: DashboardStatisticsRequestDto;
  onChange?: (value: DashboardStatisticsRequestDto) => void;
}

export const DashboardDateFilter = ({
  value,
  onChange,
}: DashboardDateFilterProps) => {
  const { t } = useLocale();
  const [dateRange, setDateRange] = useState<DateRangeType | null>(
    value?.dateRange || DateRangeType.ThisWeek,
  );
  const [startDate, setStartDate] = useState<string>(
    value?.startDate || "",
  );
  const [endDate, setEndDate] = useState<string>(
    value?.endDate || "",
  );

  // Sync with external value changes
  useEffect(() => {
    if (value) {
      setDateRange(value.dateRange || DateRangeType.ThisWeek);
      setStartDate(value.startDate || "");
      setEndDate(value.endDate || "");
    }
  }, [value]);

  // Initialize with default value on mount if no value provided
  useEffect(() => {
    if (!value?.dateRange && !value?.startDate && !value?.endDate) {
      onChange?.({
        dateRange: DateRangeType.ThisWeek,
        startDate: null,
        endDate: null,
      });
    }
  }, []);

  const dateRangeOptions: SelectOption[] = [
    { value: DateRangeType.Today, label: t("pages.reports.dateRange.today") },
    { value: DateRangeType.ThisWeek, label: t("pages.reports.dateRange.thisWeek") },
    { value: DateRangeType.ThisMonth, label: t("pages.reports.dateRange.thisMonth") },
    { value: DateRangeType.Last30Days, label: t("pages.reports.dateRange.last30Days") },
    { value: DateRangeType.Custom, label: t("pages.reports.dateRange.custom") },
    { value: DateRangeType.AllTime, label: t("pages.reports.dateRange.allTime") },
  ];

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDateRange = e.target.value ? Number(e.target.value) as DateRangeType : null;
    setDateRange(newDateRange);

    if (newDateRange === DateRangeType.Custom) {
      // Keep custom dates if already set
      onChange?.({
        dateRange: newDateRange,
        startDate: startDate || null,
        endDate: endDate || null,
      });
    } else if (newDateRange === DateRangeType.AllTime) {
      setStartDate("");
      setEndDate("");
      onChange?.({
        dateRange: newDateRange,
        startDate: null,
        endDate: null,
      });
    } else {
      setStartDate("");
      setEndDate("");
      onChange?.({
        dateRange: newDateRange,
        startDate: null,
        endDate: null,
      });
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    
    // Auto-switch to Custom when date is selected
    const newDateRange = DateRangeType.Custom;
    setDateRange(newDateRange);
    
    onChange?.({
      dateRange: newDateRange,
      startDate: newStartDate || null,
      endDate: endDate || null,
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    
    // Auto-switch to Custom when date is selected
    const newDateRange = DateRangeType.Custom;
    setDateRange(newDateRange);
    
    onChange?.({
      dateRange: newDateRange,
      startDate: startDate || null,
      endDate: newEndDate || null,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-zinc-400" />
        <h3 className="text-sm font-medium text-zinc-200">
          {t("pages.reports.dateFilter.title")}
        </h3>
      </div>

      <div className="w-full">
        <Select
          value={dateRange || ""}
          onChange={handleDateRangeChange}
          options={dateRangeOptions}
          className="text-sm"
        />
      </div>

      {/* Always show date range inputs, but highlight when Custom is selected */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">
            {t("pages.reports.dateFilter.startDate")}
          </label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            max={endDate || undefined}
            className="w-full px-4 py-3 text-sm rounded-xl border-2 bg-zinc-800/50 text-zinc-100 focus:outline-none focus:ring-4 focus:border-[#6366f1] focus:ring-[#6366f1]/20 hover:border-zinc-600 transition-all duration-200"
            style={{
              borderColor: dateRange === DateRangeType.Custom ? "#6366f1" : "#3f3f46",
            }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">
            {t("pages.reports.dateFilter.endDate")}
          </label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate || undefined}
            className="w-full px-4 py-3 text-sm rounded-xl border-2 bg-zinc-800/50 text-zinc-100 focus:outline-none focus:ring-4 focus:border-[#6366f1] focus:ring-[#6366f1]/20 hover:border-zinc-600 transition-all duration-200"
            style={{
              borderColor: dateRange === DateRangeType.Custom ? "#6366f1" : "#3f3f46",
            }}
          />
        </div>
      </div>
      
      {(startDate || endDate) && dateRange !== DateRangeType.Custom && (
        <div className="text-xs text-zinc-500 italic">
          {t("pages.reports.dateFilter.customRangeHint")}
        </div>
      )}
    </div>
  );
};
