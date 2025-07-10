"use client";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

interface SortIconProps {
  isActive: boolean;
  direction: "asc" | "desc";
  className?: string;
}

export function SortIcon({
  isActive,
  direction,
  className = "inline ml-1",
}: SortIconProps) {
  if (!isActive) return null;
  return direction === "asc" ? (
    <FiChevronUp className={className} />
  ) : (
    <FiChevronDown className={className} />
  );
}
