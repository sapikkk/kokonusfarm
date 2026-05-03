import * as React from "react"
import { cn } from "@/lib/utils"

const Pagination = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    role="navigation"
    aria-label="pagination"
    className={cn("pagination", className)}
    {...props}
  />
))
Pagination.displayName = "Pagination"

interface PageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
}

const PageButton = React.forwardRef<HTMLButtonElement, PageButtonProps>(
  ({ className, isActive, ...props }, ref) => (
    <button
      ref={ref}
      className={cn("page-btn", isActive && "active", className)}
      aria-current={isActive ? "page" : undefined}
      {...props}
    />
  )
)
PageButton.displayName = "PageButton"

const PageDots = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("page-dots", className)}
    {...props}
  >
    ...
  </span>
))
PageDots.displayName = "PageDots"

export { Pagination, PageButton, PageDots }
