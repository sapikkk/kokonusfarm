import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[11px] px-[14px] py-[10px] text-[13px] font-sans",
          "outline-none tranadminon-all duration-150",
          "placeholder:text-[--c-tertiary]",
          "disabled:opacity-[0.45] disabled:cursor-not-allowed",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        style={{
          background: 'var(--s-l2)',
          border: '1px solid var(--border-ui)',
          color: 'var(--c-primary)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--bdr-poadminve)'
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
Input.displayName = "Input"

export { Input }
