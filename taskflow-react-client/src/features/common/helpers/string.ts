interface TruncateOptions {
  length: number;
  suffix?: string;
}

export function truncate(
  value: string | undefined,
  { length, suffix = "" }: TruncateOptions,
) {
  if (!value || value.length <= length) {
    return value;
  }

  return value.slice(0, length) + suffix;
}
