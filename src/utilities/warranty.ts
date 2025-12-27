import { addDays, addMonths, addWeeks, addYears } from "date-fns";

type TWarrantyDuration = {
  quantity: string;
  unit: string;
};

/**
 * Calculates the warranty expiration date based on a start date and duration.
 * @param startDate The start date of the warranty (usually purchase or delivery date).
 * @param duration The duration object containing quantity (string) and unit.
 * @returns The calculated expiration Date, or null if invalid inputs.
 */
export const calculateWarrantyExpiry = (
  startDate: Date | string,
  duration: TWarrantyDuration
): Date | null => {
  if (!startDate || !duration?.quantity || !duration?.unit) {
    return null;
  }

  const date = new Date(startDate);
  // Ensure the start date is valid
  if (isNaN(date.getTime())) {
    return null;
  }

  const quantity = parseInt(duration.quantity, 10);
  if (isNaN(quantity)) {
    return null;
  }

  const unit = duration.unit.toLowerCase();

  switch (unit) {
    case "day":
    case "days":
      return addDays(date, quantity);
    case "week":
    case "weeks":
      return addWeeks(date, quantity);
    case "month":
    case "months":
      return addMonths(date, quantity);
    case "year":
    case "years":
      return addYears(date, quantity);
    default:
      return null;
  }
};

/**
 * Checks if a product is currently under warranty.
 * @param expirationDate The calculated expiration date.
 * @returns boolean indicating if warranty is active.
 */
export const isWarrantyActive = (expirationDate: Date | string): boolean => {
  if (!expirationDate) return false;
  const expiry = new Date(expirationDate);
  const now = new Date();
  return expiry > now;
};
