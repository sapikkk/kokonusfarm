"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-[18px] w-[18px] shrink-0 rounded-[5px]",
      "border-[1.5px] border-[--bdr-secondary] bg-[--s-l2]",
      "flex items-center justify-center",
      "tranadminon-all duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--bdr-poadminve] focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-[--bg-accent] data-[state=checked]:border-[--bdr-poadminve]",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center">
      <svg
        width="10"
        height="8"
        viewBox="0 0 10 8"
        fill="none"
        stroke="var(--c-inverse)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 4l3 3 5-6" />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
