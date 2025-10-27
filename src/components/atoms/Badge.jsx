import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  className, 
  variant = "default",
  size = "sm",
  children,
  ...props 
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20",
    secondary: "bg-gradient-to-r from-secondary/10 to-accent/10 text-secondary border border-secondary/20",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300",
    danger: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300",
    high: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300",
    medium: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300",
    low: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300",
    pending: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300",
    completed: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;