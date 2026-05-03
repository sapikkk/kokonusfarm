import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    size?: "xs" | "sm" | "md" | "lg" | "xl"
    colorVariant?: "green" | "red" | "blue" | "notice" | "neutral"
    square?: boolean
  }
>(({ className, size = "md", colorVariant, square, ...props }, ref) => {
  // Base classes for different sizes
  const sizeClasses = {
    xs: "w-6 h-6 text-[9px]",
    sm: "w-8 h-8 text-[11px]",
    md: "w-10 h-10 text-[14px]",
    lg: "w-[52px] h-[52px] text-[18px]",
    xl: "w-[68px] h-[68px] text-[22px]",
  }

  // Determine fallback background based on Fimet avatar color variants
  let bgClass = "bg-[--s-l5] text-[--c-primary]" // default neutral
  if (colorVariant === "green") bgClass = "bg-[--bg-accent] text-[--c-inverse]"
  else if (colorVariant === "red") bgClass = "bg-[--bg-negative] text-white"
  else if (colorVariant === "blue") bgClass = "bg-[--c-blue] text-white"
  else if (colorVariant === "notice") bgClass = "bg-[--bg-notice] text-black"

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden font-bold items-center justify-center",
        square ? "rounded-[12px]" : "rounded-full",
        sizeClasses[size],
        bgClass,
        className
      )}
      {...props}
    />
  )
})
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-inherit font-bold",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
