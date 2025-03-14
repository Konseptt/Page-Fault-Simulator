"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock, RefreshCw, AlertTriangle } from "lucide-react"

interface MemoryFrameVisualizerProps {
  steps: {
    request: number
    frames: (number | null)[]
    pageFault: boolean
    referenceCounter?: Record<number, number>
    secondChanceBits?: boolean[]
  }[]
  frames: number
}

export default function MemoryFrameVisualizer({ steps, frames }: MemoryFrameVisualizerProps) {
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    setAnimationComplete(false)
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, steps.length * 300)

    return () => clearTimeout(timer)
  }, [steps])

  // Update the getFrameColor function to use more professional colors without glow effects
  const getFrameColor = (step: any, frameIndex: number, value: number | null) => {
    if (value === null) return "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"

    if (step.pageFault && value === step.request) {
      return "border-red-400 bg-red-50/50 dark:bg-red-900/10"
    }

    if (step.secondChanceBits && step.secondChanceBits[frameIndex]) {
      return "border-amber-400 bg-amber-50/50 dark:bg-amber-900/10"
    }

    return "border-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6">
        {steps.map((step, stepIndex) => (
          // Remove the background decoration div and update the main container
          <motion.div
            key={stepIndex}
            className="space-y-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-background"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: stepIndex * 0.1 }}
          >
            {/* Remove the background decoration div */}

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <motion.div
                  className="flex items-center justify-center w-12 h-12 text-lg font-medium bg-blue-500 text-white rounded-full"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, delay: stepIndex * 0.1 + 0.2 }}
                >
                  {step.request}
                </motion.div>
                <div className="space-y-1">
                  <div className="font-medium">
                    {step.pageFault ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" /> Page Fault
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        <RefreshCw className="h-3 w-3" /> Page Hit
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {step.referenceCounter && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Reference Counters</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs">
                        {Object.entries(step.referenceCounter).map(([page, count]) => (
                          <div key={page}>
                            Page {page}: {count}
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {/* Update the frame styling to be more subtle */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: frames }).map((_, frameIndex) => {
                const value = step.frames[frameIndex]
                const isNewPage = step.pageFault && frameIndex === step.frames.findIndex((f) => f === step.request)

                return (
                  <motion.div
                    key={frameIndex}
                    className={`relative flex items-center justify-center h-20 rounded-lg border-2 ${getFrameColor(
                      step,
                      frameIndex,
                      value,
                    )} transition-colors duration-300`}
                    initial={isNewPage ? { scale: 0.9, opacity: 0 } : { scale: 1, opacity: 1 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: stepIndex * 0.1 + frameIndex * 0.05,
                    }}
                  >
                    {value !== null ? (
                      <div className="flex flex-col items-center">
                        <motion.span
                          className="text-3xl font-bold"
                          initial={isNewPage ? { scale: 0.5 } : { scale: 1 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 10,
                            delay: stepIndex * 0.1 + frameIndex * 0.05 + 0.2,
                          }}
                        >
                          {value}
                        </motion.span>
                        {step.secondChanceBits && (
                          <Badge
                            variant="outline"
                            className={`absolute top-1 right-1 w-5 h-5 p-0 flex items-center justify-center ${
                              step.secondChanceBits[frameIndex]
                                ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                          >
                            {step.secondChanceBits[frameIndex] ? "1" : "0"}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-600">Empty</span>
                    )}
                    <div className="absolute bottom-1 left-1 text-xs text-muted-foreground">Frame {frameIndex + 1}</div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {steps.length > 1 && !animationComplete && (
        <div className="flex justify-center">
          <div className="animate-pulse text-sm text-muted-foreground">Animating frames...</div>
        </div>
      )}
    </div>
  )
}

