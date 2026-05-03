import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[7px] whitespace-nowrap font-bold tranadminon-all duration-150 cursor-pointer relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-[0.38]",
  {
    variants: {
      variant: {
        // Primary = Lime Green CTA
        default:
          "bg-[--bg-accent] text-[--c-inverse] hover:brightness-[1.08] hover:-translate-y-px active:translate-y-0 active:brightness-[0.96]",
        // Secondary
        secondary:
          "bg-[--s-l3] text-[--c-primary] border border-[--border-ui] hover:bg-[--s-l4]",
        // Ghost / Outline
        ghost:
          "bg-transparent text-[--c-primary] border border-[--bdr-secondary] hover:bg-[--bg-hover]",
        // Danger
        destructive:
          "bg-[--bg-negative] text-white hover:brightness-110 hover:-translate-y-px",
        // Poadminve (subtle)
        poadminve:
          "bg-[--bg-poadminve-subtle] text-[--c-poadminve] border border-[--bdr-poadminve] hover:bg-[--bg-poadminve] hover:text-[--c-inverse]",
        // Notice
        notice:
          "bg-[--bg-notice-subtle] text-[--c-notice] border border-[--bdr-notice]",
        // Dark / Inverse
        dark:
          "bg-[--bg-inverse] text-[--c-inverse]",
        // Brand aliases
        botanical:
          "bg-[--bg-accent] text-[--c-inverse] hover:brightness-[1.08] hover:-translate-y-px active:translate-y-0 active:brightness-[0.96]",
        forest:
          "bg-[#062F28] text-white hover:bg-[#0a4a3a]",
        mint:
          "bg-[--bg-poadminve-subtle] text-[--c-poadminve] hover:bg-[--bg-poadminve] hover:text-[--c-inverse]",
        // Outline variant
        outline:
          "bg-transparent text-[--c-primary] border border-[--bdr-secondary] hover:bg-[--bg-hover]",
        // Link
        link:
          "text-[--c-primary] underline-offset-4 hover:underline bg-transparent",
      },
      size: {
        xs: "text-[10px] px-3 py-[5px] rounded-[7px] tracking-[0.04em]",
        sm: "text-[11px] px-[15px] py-[7px] rounded-[9px] tracking-[0.03em]",
        default: "text-[13px] px-[22px] py-[10px] rounded-[11px] tracking-[0.02em]",
        lg: "text-[15px] px-7 py-[13px] rounded-[13px]",
        xl: "text-[17px] px-9 py-4 rounded-[14px]",
        icon: "w-9 h-9 p-0 rounded-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  pill?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, pill = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          pill && "!rounded-full",
          loading && "pointer-events-none opacity-70",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
        {loading && (
          <span className="ml-1 inline-block w-3 h-3 border-2 border-transparent border-t-current rounded-full animate-spin" />
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
