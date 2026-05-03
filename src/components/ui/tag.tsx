import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  onRemove?: () => void;
}

function Tag({ className, active, onRemove, children, ...props }: TagProps) {
  return (
    <div className={cn("tag", active && "active", className)} {...props}>
      {children}
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          className="tag-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              onRemove();
            }
          }}
        >
          <X className="w-3 h-3" />
        </span>
      )}
    </div>
  );
}

export { Tag };
