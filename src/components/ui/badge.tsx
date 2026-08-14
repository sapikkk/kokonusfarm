import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-[5px] rounded-[50px] border px-[11px] py-1 text-[10px] font-bold tracking-[0.04em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-[--border-ui] bg-[--s-l3] text-[--c-secondary]",
        secondary:
          "border-[--border-ui] bg-[--s-l3] text-[--c-secondary]",
        positive:
          "border-[--bdr-positive] bg-[--bg-positive-subtle] text-[--c-positive]",
        success:
          "border-[--bdr-positive] bg-[--bg-positive-subtle] text-[--c-positive]",
        destructive:
          "border-[--bdr-negative] bg-[--bg-negative-subtle] text-[--c-negative]",
        negative:
          "border-[--bdr-negative] bg-[--bg-negative-subtle] text-[--c-negative]",
        notice:
          "border-[--bdr-notice] bg-[--bg-notice-subtle] text-[--c-notice]",
        warning:
          "border-[--bdr-notice] bg-[--bg-notice-subtle] text-[--c-notice]",
        blue:
          "border-[--bdr-blue] bg-[--bg-blue-subtle] text-[--c-blue]",
        solid:
          "border-transparent bg-[--bg-accent] text-[--c-inverse]",
        outline:
          "border-[--bdr-secondary] bg-transparent text-[--c-primary]",
        // Legacy aliases
        botanical:
          "border-[--bdr-positive] bg-[--bg-positive-subtle] text-[--c-positive]",
        forest:
          "border-transparent bg-[#062F28] text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  // Map variant to SKRIPSI dot color if applicable
  const getDotColor = (v: string | null | undefined) => {
    switch (v) {
      case 'positive':
      case 'success':
      case 'botanical': return 'var(--c-positive)';
      case 'destructive':
      case 'negative': return 'var(--c-negative)';
      case 'notice':
      case 'warning': return 'var(--c-notice)';
      case 'blue': return 'var(--c-blue)';
      default: return 'var(--c-tertiary)';
    }
  }

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className="w-[5px] h-[5px] rounded-full shrink-0"
          style={{ background: getDotColor(variant) }}
        />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
