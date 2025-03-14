"use client"

import * as React from "react"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(({ className, ...props }, ref) => {
  return <div className="relative" {...props} ref={ref} />
})
Chart.displayName = "Chart"

interface ChartHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChartHeader = React.forwardRef<HTMLDivElement, ChartHeaderProps>(({ className, ...props }, ref) => {
  return <div className="flex flex-col space-y-1.5 p-4" {...props} ref={ref} />
})
ChartHeader.displayName = "ChartHeader"

interface ChartTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const ChartTitle = React.forwardRef<HTMLHeadingElement, ChartTitleProps>(({ className, ...props }, ref) => {
  return <h3 className="text-lg font-semibold" {...props} ref={ref} />
})
ChartTitle.displayName = "ChartTitle"

interface ChartDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const ChartDescription = React.forwardRef<HTMLParagraphElement, ChartDescriptionProps>(
  ({ className, ...props }, ref) => {
    return <p className="text-sm text-muted-foreground" {...props} ref={ref} />
  },
)
ChartDescription.displayName = "ChartDescription"

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(({ className, ...props }, ref) => {
  return <div className="h-full w-full" {...props} ref={ref} />
})
ChartContainer.displayName = "ChartContainer"

interface ChartBarsProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChartBars = React.forwardRef<HTMLDivElement, ChartBarsProps>(({ className, ...props }, ref) => {
  return <div className="absolute bottom-0 left-0 right-0 top-0" {...props} ref={ref} />
})
ChartBars.displayName = "ChartBars"

interface ChartBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  name: string
  color: string
}

const ChartBar = React.forwardRef<HTMLDivElement, ChartBarProps>(({ className, value, name, color, ...props }, ref) => {
  const height = `${value}%`
  return (
    <div
      className="absolute bottom-0 w-4 rounded-md bg-blue-500 transition-all duration-300"
      style={{ height, backgroundColor: color }}
      title={`${name}: ${value}`}
      {...props}
      ref={ref}
    />
  )
})
ChartBar.displayName = "ChartBar"

interface ChartXAxisProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChartXAxis = React.forwardRef<HTMLDivElement, ChartXAxisProps>(({ className, ...props }, ref) => {
  return <div className="absolute bottom-0 left-0 right-0 h-4" {...props} ref={ref} />
})
ChartXAxis.displayName = "ChartXAxis"

interface ChartYAxisProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChartYAxis = React.forwardRef<HTMLDivElement, ChartYAxisProps>(({ className, ...props }, ref) => {
  return <div className="absolute top-0 bottom-0 left-0 w-4" {...props} ref={ref} />
})
ChartYAxis.displayName = "ChartYAxis"

interface ChartTooltipProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChartTooltip = React.forwardRef<HTMLDivElement, ChartTooltipProps>(({ className, ...props }, ref) => {
  return <div className="pointer-events-none absolute z-10" {...props} ref={ref} />
})
ChartTooltip.displayName = "ChartTooltip"

export { Chart, ChartHeader, ChartTitle, ChartContainer, ChartBars, ChartBar, ChartXAxis, ChartYAxis, ChartTooltip }

