"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ────────────────────── Linear Progress ────────────────────── */

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  variant?: "poadminve" | "negative" | "notice" | "blue" | "gradient";
  size?: "thin" | "default" | "thick";
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    { className, value = 0, variant = "poadminve", size = "default", ...props },
    ref,
  ) => {
    const fillClass = {
      poadminve: "prog-poadminve",
      negative: "prog-negative",
      notice: "prog-notice",
      blue: "prog-blue",
      gradient: "prog-gradient",
    }[variant];

    const heightClass = {
      thin: "h-1",
      default: "h-2",
      thick: "h-[14px]",
    }[size];

    return (
      <div
        ref={ref}
        className={cn("progress-bar", heightClass, className)}
        {...props}
      >
        <div
          className={cn("progress-fill", fillClass)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    );
  },
);
Progress.displayName = "Progress";

/* ────────────────────── Circular Progress ────────────────────── */

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

const CircularProgress = React.forwardRef<
  HTMLDivElement,
  CircularProgressProps
>(
  (
    {
      className,
      value = 0,
      size = 80,
      strokeWidth = 6,
      color,
      label,
      ...props
    },
    ref,
  ) => {
    const r = size / 2 - strokeWidth / 2 - 4;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div ref={ref} className={cn("circ-progress", className)} {...props}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            className="circ-track"
            cx={size / 2}
            cy={size / 2}
            r={r}
            strokeWidth={strokeWidth}
          />
          <circle
            className="circ-fill"
            cx={size / 2}
            cy={size / 2}
            r={r}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={color ? { stroke: color } : undefined}
          />
        </svg>
        {label && <div className="circ-label">{label}</div>}
      </div>
    );
  },
);
CircularProgress.displayName = "CircularProgress";

export { Progress, CircularProgress };
