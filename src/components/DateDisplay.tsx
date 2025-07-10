// src/components/DateDisplay.tsx

interface DateDisplayProps {
  date: string | Date;
  locale?: string; // optional
  options?: Intl.DateTimeFormatOptions; // opsional kalau mau custom format
}

export const DateDisplay = ({
  date,
  locale = "en-US", // default jika tidak dikirim
  options = { year: "numeric", month: "short", day: "numeric" },
}: DateDisplayProps) => {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  return <span>{parsedDate.toLocaleDateString(locale, options)}</span>;
};
