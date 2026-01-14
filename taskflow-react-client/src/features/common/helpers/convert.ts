export const stringToBoolean = (value: string | null): boolean | null => {
  if (value === "true") return true;
  if (value === "false") return false;

  return null;
};
