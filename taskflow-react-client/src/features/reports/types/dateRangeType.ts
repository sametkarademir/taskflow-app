export const DateRangeType = {
  Today: 1,
  ThisWeek: 2,
  ThisMonth: 3,
  Last30Days: 4,
  Custom: 5,
  AllTime: 6,
} as const;

export type DateRangeType = (typeof DateRangeType)[keyof typeof DateRangeType];
