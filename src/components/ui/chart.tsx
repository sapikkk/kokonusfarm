"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────
   BarChart — vertical bar chart component
   Usage:
   <BarChart values={[45,72,58,90]} labels={["Sen","Sel","Rab","Kam"]} highlightIndex={3} />
────────────────────────────────────────────── */

interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  values: number[]
  labels?: string[]
  highlightIndex?: number
  highlightColor?: string
  barColor?: string
  height?: number
}

const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      className,
      values,
      labels,
      highlightIndex,
      highlightColor = "var(--c-blue)",
      barColor = "var(--bg-accent)",
      height = 80,
      ...props
    },
    ref
  ) => {
    const max = Math.max(...values)
    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <div
          className="flex items-end gap-[5px] mb-2"
          style={{ height }}
        >
          {values.map((v, i) => (
            <div
              key={i}
              className="flex-1 cursor-pointer tranadminon-opacity hover:!opacity-100 rounded-t"
              style={{
                height: `${(v / max) * 100}%`,
                background: i === highlightIndex ? highlightColor : barColor,
                opacity: i === highlightIndex ? 1 : 0.65,
                minHeight: 4,
                borderRadius: "4px 4px 0 0",
              }}
            />
          ))}
        </div>
        {labels && (
          <div className="flex justify-between mono text-[9px] text-[--c-tertiary]">
            {labels.map((l) => <span key={l}>{l}</span>)}
          </div>
        )}
      </div>
    )
  }
)
BarChart.displayName = "BarChart"

/* ──────────────────────────────────────────────
   DonutChart — SVG donut chart
   Usage:
   <DonutChart
     size={120}
     segments={[{ value: 42, color: "var(--bg-accent)" }, ...]}
     centerLabel="100%"
   />
────────────────────────────────────────────── */

interface DonutSegment {
  value: number
  color: string
}

interface DonutChartProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number
  strokeWidth?: number
  segments: DonutSegment[]
  centerLabel?: string
}

const DonutChart = React.forwardRef<SVGSVGElement, DonutChartProps>(
  ({ size = 120, strokeWidth = 18, segments, centerLabel, className, ...props }, ref) => {
    const r = size / 2 - strokeWidth / 2
    const circumference = 2 * Math.PI * r
    const total = segments.reduce((sum, s) => sum + s.value, 0)

    let offset = 0
    const arcs = segments.map((seg) => {
      const dash = (seg.value / total) * circumference
      const gap = circumference - dash
      const rotation = (offset / total) * 360 - 90
      offset += seg.value
      return { ...seg, dash, gap, rotation }
    })

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={className}
        {...props}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--s-l4)"
          strokeWidth={strokeWidth}
        />
        {/* Segments */}
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc.dash} ${arc.gap}`}
            transform={`rotate(${arc.rotation} ${size / 2} ${size / 2})`}
          />
        ))}
        {/* Center label */}
        {centerLabel && (
          <text
            x={size / 2}
            y={size / 2 + 5}
            textAnchor="middle"
            fill="var(--c-primary)"
            fontFamily="Space Grotesk, sans-serif"
            fontSize={14}
            fontWeight={700}
          >
            {centerLabel}
          </text>
        )}
      </svg>
    )
  }
)
DonutChart.displayName = "DonutChart"

/* ──────────────────────────────────────────────
   DonutLegend / DonutLegendItem
────────────────────────────────────────────── */

const DonutLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("donut-legend", className)} {...props} />
  )
)
DonutLegend.displayName = "DonutLegend"

interface DonutLegendItemProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string
  label: string
  sub?: string
}

function DonutLegendItem({ color, label, sub, className, ...props }: DonutLegendItemProps) {
  return (
    <div className={cn("legend-item", className)} {...props}>
      <div className="legend-dot" style={{ background: color }} />
      <div>
        <div className="text-[12px] font-semibold">{label}</div>
        {sub && <div className="text-[10px] text-[--c-tertiary]">{sub}</div>}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   Sparkline — mini bar sparkline
   Usage:
   <Sparkline data={[20,50,80,...]} color="var(--bg-accent)" />
────────────────────────────────────────────── */

interface SparklineProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[]
  color?: string
}

const Sparkline = React.forwardRef<HTMLDivElement, SparklineProps>(
  ({ data, color = "var(--bg-accent)", className, ...props }, ref) => {
    const max = Math.max(...data)
    return (
      <div ref={ref} className={cn("sparkline-wrap", className)} {...props}>
        {data.map((v, i) => (
          <div
            key={i}
            className="spark-bar"
            style={{ height: `${(v / max) * 100}%`, background: color }}
          />
        ))}
      </div>
    )
  }
)
Sparkline.displayName = "Sparkline"

export { BarChart, DonutChart, DonutLegend, DonutLegendItem, Sparkline }
