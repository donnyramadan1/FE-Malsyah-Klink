"use client";

interface RoleBadgeProps {
  name: string;
  className?: string;
}

export function RoleBadge({ name, className = "" }: RoleBadgeProps) {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 ${className}`}
    >
      {name}
    </span>
  );
}
