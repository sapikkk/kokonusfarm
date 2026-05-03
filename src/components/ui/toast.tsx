"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/* ────────────────────── Toast ────────────────────── */

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "poadminve" | "negative" | "notice" | "default"
  onDismiss?: () => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", onDismiss, children, ...props }, ref) => {
    const variantClass = {
      poadminve: "t-pos",
      negative: "t-neg",
      notice: "t-not",
      default: "t-def",
    }[variant]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn("toast", variantClass, className)}
        {...props}
      >
        {children}
        {onDismiss && (
          <button className="toast-close" onClick={onDismiss}>
            x
          </button>
        )}
      </div>
    )
  }
)
Toast.displayName = "Toast"

/* ────────────────────── Toast Body / Title / Message ────────────────────── */

const ToastBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("toast-body", className)} {...props} />
))
ToastBody.displayName = "ToastBody"

const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("toast-title", className)} {...props} />
))
ToastTitle.displayName = "ToastTitle"

const ToastMessage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("toast-msg", className)} {...props} />
))
ToastMessage.displayName = "ToastMessage"

/* ────────────────────── Toast Stack ────────────────────── */

const ToastStack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("toast-stack", className)} {...props} />
))
ToastStack.displayName = "ToastStack"

export { Toast, ToastBody, ToastTitle, ToastMessage, ToastStack }
