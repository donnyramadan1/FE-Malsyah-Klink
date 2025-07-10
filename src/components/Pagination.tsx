"use client";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  previousText?: string;
  nextText?: string;
  className?: string;
}

export function Pagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  previousText = "Previous",
  nextText = "Next",
  className = "",
}: PaginationProps) {
  return (
    <div
      className={`flex justify-between items-center p-4 border-t ${className}`}
    >
      <div className="text-sm text-gray-600">
        Showing {(currentPage - 1) * pageSize + 1} -{" "}
        {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
      </div>
      <div className="space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          {previousText}
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage * pageSize >= totalItems}
          className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          {nextText}
        </button>
      </div>
    </div>
  );
}
