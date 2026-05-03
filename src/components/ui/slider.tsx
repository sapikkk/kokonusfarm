"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-[--s-l4]">
      <SliderPrimitive.Range className="absolute h-full bg-[--bg-accent] rounded-full" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-[18px] w-[18px] rounded-full",
        "bg-[--bg-accent] border-2 border-[--c-inverse]",
        "",
        "tranadminon-transform duration-150",
        "hover:scale-[1.2]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--bdr-poadminve]",
        "disabled:pointer-events-none disabled:opacity-50"
      )}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
