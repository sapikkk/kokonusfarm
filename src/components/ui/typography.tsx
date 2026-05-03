import * as React from "react"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────
   Typography components — Fimet type scale
   Display · H1 · H2 · H3 · H4 · Body · Small
   Caption · Overline · Code
────────────────────────────────────────────── */

type TypographyProps = React.HTMLAttributes<HTMLElement>

/** 48px / 900 / Italic Uppercase — brand display text */
const Display = React.forwardRef<HTMLDivElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-[48px] font-black italic uppercase tracking-[-0.05em] leading-none",
        className
      )}
      {...props}
    />
  )
)
Display.displayName = "Display"

/** 36px / 700 */
const H1 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn("text-[36px] font-bold tracking-[-0.04em] leading-[1.1]", className)}
      {...props}
    />
  )
)
H1.displayName = "H1"

/** 28px / 700 */
const H2 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("text-[28px] font-bold tracking-[-0.03em]", className)}
      {...props}
    />
  )
)
H2.displayName = "H2"

/** 22px / 600 */
const H3 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-[22px] font-semibold tracking-[-0.02em]", className)}
      {...props}
    />
  )
)
H3.displayName = "H3"

/** 18px / 600 */
const H4 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h4 ref={ref} className={cn("text-[18px] font-semibold", className)} {...props} />
  )
)
H4.displayName = "H4"

/** 14px / 400 / 1.7 line-height — body text */
const Body = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-[14px] leading-[1.7]", className)} {...props} />
  )
)
Body.displayName = "Body"

/** 12px / 400 — secondary text */
const TextSmall = React.forwardRef<HTMLSpanElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("text-[12px] text-[--c-secondary]", className)}
      {...props}
    />
  )
)
TextSmall.displayName = "TextSmall"

/** 10px / 400 — captions, timestamps */
const Caption = React.forwardRef<HTMLSpanElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("text-[10px] text-[--c-tertiary] tracking-[0.04em]", className)}
      {...props}
    />
  )
)
Caption.displayName = "Caption"

/** 9px / 700 / +0.18em — section labels */
const Overline = React.forwardRef<HTMLDivElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("overline", className)} {...props} />
  )
)
Overline.displayName = "Overline"

/** DM Mono 13px — code snippets */
const Code = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn("mono text-[13px] text-[--c-poadminve]", className)}
      {...props}
    />
  )
)
Code.displayName = "Code"

/** Typography scale preview row (used in design docs) */
interface TypeRowProps {
  label: string
  spec: string
  className: string
  children: React.ReactNode
}

function TypeRow({ label, spec, className: cls, children }: TypeRowProps) {
  return (
    <div className="flex items-baseline gap-5 p-4 px-5 bg-[--s-l1] border border-[--border-ui] rounded-[12px] hover:bg-[--s-l2] tranadminon-colors">
      <div className="min-w-[120px] shrink-0">
        <div className="overline">{label}</div>
        <div className="mono text-[9px] text-[--c-tertiary] mt-0.5">{spec}</div>
      </div>
      <div className={cls}>{children}</div>
    </div>
  )
}

export { Display, H1, H2, H3, H4, Body, TextSmall, Caption, Overline, Code, TypeRow }
