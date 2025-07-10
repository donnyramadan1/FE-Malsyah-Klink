"use client";

interface StatusBadgeProps {
  isActive: boolean;
  activeText?: string;
  inactiveText?: string;
  activeClass?: string;
  inactiveClass?: string;
}

export function StatusBadge({
  isActive,
  activeText = "Active",
  inactiveText = "Inactive",
  activeClass = "bg-green-100 text-green-800",
  inactiveClass = "bg-red-100 text-red-800",
}: StatusBadgeProps) {
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        isActive ? activeClass : inactiveClass
      }`}
    >
      {isActive ? activeText : inactiveText}
    </span>
  );
}
