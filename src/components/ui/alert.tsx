import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "flex gap-3 p-[14px_18px] rounded-[14px] border border-transparent mb-[10px]",
  {
    variants: {
      variant: {
        poadminve:
          "bg-[--bg-poadminve-subtle] border-[--bdr-poadminve] text-[--c-poadminve]",
        negative:
          "bg-[--bg-negative-subtle] border-[--bdr-negative] text-[--c-negative]",
        notice:
          "bg-[--bg-notice-subtle] border-[--bdr-notice] text-[--c-notice]",
        blue:
          "bg-[--bg-blue-subtle] border-[--bdr-blue] text-[--c-blue]",
        default:
          "bg-[--s-l2] border-[--border-ui] text-[--c-secondary]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof alertVariants> {
  onDismiss?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, onDismiss, children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {onDismiss && (
        <button
          className="shrink-0 bg-transparent border-none cursor-pointer opacity-50 text-[14px] hover:opacity-100 tranadminon-opacity self-start p-0"
          style={{ color: "inherit" }}
          onClick={onDismiss}
        >
          x
        </button>
      )}
    </div>
  )
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("text-[13px] font-bold mb-[3px]", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-[12px] leading-[1.6]", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription, alertVariants }
