"use client";

interface UserAvatarProps {
  name?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({
  name = "",
  className = "",
  size = "md",
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
  };

  return (
    <div
      className={`flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <span className="text-gray-600">
        {name?.charAt(0)?.toUpperCase() || "U"}
      </span>
    </div>
  );
}
