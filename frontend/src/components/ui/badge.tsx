import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "muted" | "brand";

const variantClasses: Record<Variant, string> = {
  default: "bg-slate-900 text-white",
  outline: "border border-slate-200 text-slate-700 bg-white",
  muted: "bg-slate-100 text-slate-700",
  brand: "bg-indigo-50 text-indigo-700 border border-indigo-100",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({
  className,
  variant = "muted",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
