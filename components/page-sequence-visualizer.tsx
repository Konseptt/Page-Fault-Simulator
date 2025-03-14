"use client"

import { motion } from "framer-motion"

interface PageSequenceVisualizerProps {
  sequence: number[]
  currentIndex: number
}

export default function PageSequenceVisualizer({ sequence, currentIndex }: PageSequenceVisualizerProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Page Request Sequence</h3>
      <div className="flex flex-wrap gap-3 p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-muted/20">
        {/* Remove the background decoration div */}

        {sequence.map((page, index) => (
          <motion.div
            key={index}
            className={`relative flex items-center justify-center w-12 h-12 rounded-lg border-2 ${
              index === currentIndex
                ? "border-blue-500 bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                : index < currentIndex
                  ? "border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 opacity-70"
                  : "border-gray-200 dark:border-gray-700"
            } transition-all duration-300`}
            initial={index === currentIndex ? { scale: 0.9 } : { scale: 1 }}
            animate={
              index === currentIndex
                ? {
                    scale: 1.05,
                    y: -3,
                  }
                : index < currentIndex
                  ? { scale: 0.95, opacity: 0.7 }
                  : { scale: 1 }
            }
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
              duration: 0.4,
            }}
          >
            <span className="text-xl font-medium">{page}</span>
            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs bg-background px-1 rounded-full border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              {index + 1}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

