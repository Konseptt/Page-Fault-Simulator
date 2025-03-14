"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface AlgorithmExplanationProps {
  algorithm: string
}

export default function AlgorithmExplanation({ algorithm }: AlgorithmExplanationProps) {
  const algorithmExplanations = {
    fifo: {
      title: "First-In-First-Out (FIFO)",
      description: "The oldest page in memory is replaced when a new page needs to be loaded.",
      details:
        "FIFO is one of the simplest page replacement algorithms. It maintains a queue of pages, with the oldest page at the front. When a page fault occurs and all frames are full, the page at the front of the queue (the oldest page) is removed to make room for the new page. The new page is then added to the back of the queue. FIFO is easy to implement but can suffer from 'Belady's anomaly', where increasing the number of frames can sometimes increase the number of page faults.",
      pros: ["Simple to implement", "Low overhead", "No need to track page usage"],
      cons: [
        "Can remove frequently used pages",
        "Suffers from Belady's anomaly",
        "Does not consider page usage patterns",
      ],
    },
    lru: {
      title: "Least Recently Used (LRU)",
      description: "The page that hasn't been used for the longest time is replaced.",
      details:
        "LRU keeps track of when each page was last accessed. When a page fault occurs and all frames are full, it replaces the page that hasn't been used for the longest period of time. This approach is based on the principle of locality: if a page has been used recently, it's likely to be used again soon. LRU performs well in practice but can be expensive to implement perfectly, as it requires tracking every memory access.",
      pros: ["Good performance in practice", "Respects temporal locality", "Adapts to changing access patterns"],
      cons: [
        "Expensive to implement perfectly",
        "Requires hardware support for efficiency",
        "Higher overhead than FIFO",
      ],
    },
    optimal: {
      title: "Optimal (Belady's Algorithm)",
      description: "Replaces the page that won't be used for the longest time in the future.",
      details:
        "The Optimal algorithm (also known as Belady's algorithm or OPT) replaces the page that will not be used for the longest period of time in the future. This algorithm provides the best possible performance and is used as a theoretical benchmark. However, it requires knowledge of future page requests, which is not available in real systems, making it impractical for actual implementation.",
      pros: ["Provides the lowest possible page fault rate", "Optimal performance", "Immune to Belady's anomaly"],
      cons: ["Requires knowledge of future page requests", "Not implementable in real systems", "Purely theoretical"],
    },
    secondChance: {
      title: "Second Chance (Clock)",
      description: "A modified FIFO that gives pages a second chance before replacement.",
      details:
        "The Second Chance algorithm is an enhancement of FIFO that uses a reference bit for each page. When a page is accessed, its reference bit is set to 1. When a page needs to be replaced, the algorithm checks the oldest page's reference bit. If it's 0, the page is replaced; if it's 1, the bit is reset to 0, and the page is given a 'second chance' by moving it to the back of the queue. This continues until a page with a reference bit of 0 is found.",
      pros: ["Better performance than FIFO", "Relatively simple to implement", "Lower overhead than LRU"],
      cons: [
        "Not as effective as LRU",
        "Still partially vulnerable to Belady's anomaly",
        "May scan many pages before finding a replacement",
      ],
    },
    mru: {
      title: "Most Recently Used (MRU)",
      description: "The most recently used page is replaced when a new page needs to be loaded.",
      details:
        "MRU is the opposite of LRU - it replaces the page that was most recently accessed. This approach can be effective in certain specific workloads where the most recently used page is unlikely to be needed again soon. However, it generally performs worse than LRU for most common access patterns because it contradicts the principle of temporal locality.",
      pros: [
        "Simple to implement",
        "Works well for certain specific access patterns",
        "Can outperform LRU in some cases",
      ],
      cons: [
        "Generally worse performance than LRU",
        "Contradicts temporal locality principle",
        "Not suitable for general-purpose use",
      ],
    },
    random: {
      title: "Random Replacement",
      description: "A random page is selected for replacement when needed.",
      details:
        "The Random Replacement algorithm simply selects a random page to replace when a page fault occurs and all frames are full. Despite its simplicity, it can perform surprisingly well in practice, sometimes approaching the performance of more sophisticated algorithms. It requires no bookkeeping and is very easy to implement.",
      pros: ["Extremely simple to implement", "No bookkeeping overhead", "Immune to worst-case scenarios"],
      cons: ["Unpredictable performance", "No consideration of page usage patterns", "Can remove important pages"],
    },
    nfu: {
      title: "Not Frequently Used (NFU)",
      description: "Pages that are used less frequently are replaced first.",
      details:
        "NFU keeps a counter for each page that is incremented whenever the page is referenced. When a page fault occurs, the page with the lowest counter value is replaced. This approach tries to identify pages that are not used frequently. A variation called Aging gradually decreases counter values over time to give more weight to recent usage.",
      pros: ["Considers long-term page usage", "Better than FIFO for many workloads", "Relatively simple to implement"],
      cons: [
        "Does not consider recency of access",
        "Counters can overflow",
        "Not as effective as LRU for many workloads",
      ],
    },
  }

  const currentAlgorithm =
    algorithmExplanations[algorithm as keyof typeof algorithmExplanations] || algorithmExplanations.fifo

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Card className="border-primary/20 shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20">
          <CardTitle>{currentAlgorithm.title}</CardTitle>
          <CardDescription>{currentAlgorithm.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">How it works</h3>
            <p className="text-muted-foreground">{currentAlgorithm.details}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-medium">Advantages</h3>
              <ul className="list-disc pl-5 space-y-1">
                {currentAlgorithm.pros.map((pro, index) => (
                  <motion.li
                    key={index}
                    className="text-blue-600 dark:text-blue-400"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  >
                    <span className="text-muted-foreground">{pro}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-medium">Disadvantages</h3>
              <ul className="list-disc pl-5 space-y-1">
                {currentAlgorithm.cons.map((con, index) => (
                  <motion.li
                    key={index}
                    className="text-red-600 dark:text-red-400"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  >
                    <span className="text-muted-foreground">{con}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

