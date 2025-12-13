export function formatDate(date?: string | number | Date) {
  if (!date) {
    return undefined;
  }
  return new Date(date).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
export function formatTime(date?: string | number | Date) {
  if (!date) {
    return undefined;
  }
  return new Date(date).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
