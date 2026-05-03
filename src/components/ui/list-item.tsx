import * as React from "react"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────
   ListCard — scrollable list container
────────────────────────────────────────────── */
const ListCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("list-card", className)} {...props} />
  )
)
ListCard.displayName = "ListCard"

/* ──────────────────────────────────────────────
   ListItem — single row inside a ListCard
────────────────────────────────────────────── */
const ListItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("list-item", className)} {...props} />
  )
)
ListItem.displayName = "ListItem"

/* ──────────────────────────────────────────────
   ListItemContent — main text column (title + sub)
────────────────────────────────────────────── */
const ListItemContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("list-item-content", className)} {...props} />
  )
)
ListItemContent.displayName = "ListItemContent"

/* ──────────────────────────────────────────────
   ListItemTitle — bold title line
────────────────────────────────────────────── */
const ListItemTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("li-title", className)} {...props} />
  )
)
ListItemTitle.displayName = "ListItemTitle"

/* ──────────────────────────────────────────────
   ListItemSub — secondary/description line
────────────────────────────────────────────── */
const ListItemSub = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("li-sub", className)} {...props} />
  )
)
ListItemSub.displayName = "ListItemSub"

/* ──────────────────────────────────────────────
   ListItemRight — right-aligned slot (amount + time)
────────────────────────────────────────────── */
const ListItemRight = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("li-right", className)} {...props} />
  )
)
ListItemRight.displayName = "ListItemRight"

/* ──────────────────────────────────────────────
   ListItemAmount — numeric value (colored)
────────────────────────────────────────────── */
interface ListItemAmountProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "poadminve" | "negative" | "notice" | "default"
}
const ListItemAmount = React.forwardRef<HTMLDivElement, ListItemAmountProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "li-amount",
        variant === "poadminve" && "text-poadminve",
        variant === "negative" && "text-negative",
        variant === "notice" && "text-notice",
        className
      )}
      {...props}
    />
  )
)
ListItemAmount.displayName = "ListItemAmount"

/* ──────────────────────────────────────────────
   ListItemTime — small timestamp
────────────────────────────────────────────── */
const ListItemTime = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("li-time", className)} {...props} />
  )
)
ListItemTime.displayName = "ListItemTime"

export {
  ListCard,
  ListItem,
  ListItemContent,
  ListItemTitle,
  ListItemSub,
  ListItemRight,
  ListItemAmount,
  ListItemTime,
}
