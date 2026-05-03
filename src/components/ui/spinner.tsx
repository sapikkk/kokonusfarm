import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("spinner", {
  variants: {
    size: {
      default: "",
      sm: "spinner-sm",
      md: "",
      lg: "spinner-lg",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface SpinnerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

function Spinner({ className, size, ...props }: SpinnerProps) {
  return (
    <div className={cn(spinnerVariants({ size }), className)} {...props} />
  );
}

function DotsLoader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("dots-loader", className)} {...props}>
      <span />
      <span />
      <span />
    </div>
  );
}

export { Spinner, DotsLoader };
