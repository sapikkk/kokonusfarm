import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-[11px] px-[14px] py-[10px] text-[13px] font-sans",
          "outline-none transition-all duration-150 resize-y",
          "placeholder:text-[--c-tertiary]",
          "disabled:opacity-[0.45] disabled:cursor-not-allowed",
          className
        )}
        style={{
          background: 'var(--s-l2)',
          border: '1px solid var(--border-ui)',
          color: 'var(--c-primary)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--bdr-positive)'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(159, 232, 112, 0.1)'
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-ui)'
          e.currentTarget.style.boxShadow = 'none'
          props.onBlur?.(e)
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
