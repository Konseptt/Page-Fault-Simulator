"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Github,
  Sun,
  Moon,
  HelpCircle,
  Info,
  BookOpen,
  Zap,
  RefreshCw,
  Play,
  SkipBack,
  SkipForward,
  Pause,
  RotateCw,
  Sparkles,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import MemoryFrameVisualizer from "@/components/memory-frame-visualizer"
import PageSequenceVisualizer from "@/components/page-sequence-visualizer"
import ResultsDisplay from "@/components/results-display"
import AlgorithmExplanation from "@/components/algorithm-explanation"
import {
  simulateFIFO,
  simulateLRU,
  simulateOptimal,
  simulateSecondChance,
  simulateMRU,
  simulateRandom,
  simulateNFU,
} from "@/lib/page-replacement-algorithms"
import confetti from "canvas-confetti"

export default function PageFaultSimulator() {
  const [frames, setFrames] = useState<number>(3)
  const [pageSequence, setPageSequence] = useState<string>("1 2 3 4 1 2 5 1 2 3 4 5")
  const [algorithm, setAlgorithm] = useState<string>("fifo")
  const [simulationResults, setSimulationResults] = useState<any>(null)
  const [isSimulating, setIsSimulating] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isStepMode, setIsStepMode] = useState<boolean>(false)
  const [autoPlay, setAutoPlay] = useState<boolean>(false)
  const [showExplanation, setShowExplanation] = useState<boolean>(false)
  const [animationSpeed, setAnimationSpeed] = useState<number>(1000)
  const { theme, setTheme } = useTheme()

  const parsePageSequence = (sequence: string): number[] => {
    return sequence
      .split(/[\s,]+/)
      .filter((item) => item.trim() !== "")
      .map((item) => Number.parseInt(item.trim(), 10))
      .filter((num) => !isNaN(num))
  }

  const runSimulation = () => {
    const parsedSequence = parsePageSequence(pageSequence)

    if (parsedSequence.length === 0) {
      alert("Please enter a valid page sequence")
      return
    }

    setIsSimulating(true)
    setCurrentStep(0)

    let results
    switch (algorithm) {
      case "fifo":
        results = simulateFIFO(parsedSequence, frames)
        break
      case "lru":
        results = simulateLRU(parsedSequence, frames)
        break
      case "optimal":
        results = simulateOptimal(parsedSequence, frames)
        break
      case "secondChance":
        results = simulateSecondChance(parsedSequence, frames)
        break
      case "mru":
        results = simulateMRU(parsedSequence, frames)
        break
      case "random":
        results = simulateRandom(parsedSequence, frames)
        break
      case "nfu":
        results = simulateNFU(parsedSequence, frames)
        break
      default:
        results = simulateFIFO(parsedSequence, frames)
    }

    setSimulationResults(results)

    // Trigger confetti when simulation completes
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#8b5cf6", "#3b82f6", "#ec4899"],
      })
    }, 500)
  }

  const resetSimulation = () => {
    setIsSimulating(false)
    setSimulationResults(null)
    setCurrentStep(0)
    setAutoPlay(false)
  }

  const nextStep = () => {
    if (currentStep < simulationResults.steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else if (autoPlay) {
      setAutoPlay(false)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoPlay && simulationResults) {
      interval = setInterval(() => {
        if (currentStep < simulationResults.steps.length - 1) {
          setCurrentStep((prev) => prev + 1)
        } else {
          setAutoPlay(false)
        }
      }, animationSpeed)
    }

    return () => clearInterval(interval)
  }, [autoPlay, currentStep, simulationResults, animationSpeed])

  return (
    <div className="space-y-6 relative">
      {/* Theme Toggle */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full w-12 h-12 bg-background/80 backdrop-blur-sm border-primary/20 overflow-hidden"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {theme === "dark" ? (
                      <motion.div
                        key="moon"
                        initial={{ y: 30, opacity: 0, rotate: -90 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: -30, opacity: 0, rotate: 90 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          duration: 0.5,
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Moon className="h-6 w-6 text-yellow-300" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="sun"
                        initial={{ y: -30, opacity: 0, rotate: 90 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 30, opacity: 0, rotate: -90 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          duration: 0.5,
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Sun className="h-6 w-6 text-orange-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle {theme === "dark" ? "light" : "dark"} mode</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>

      {/* GitHub Link */}
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.1, rotate: 10 }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="https://github.com/konsept"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-blue-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Github size={24} />
              </a>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Visit Konsept on GitHub</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <motion.div
          className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <Card className="border-primary/20 shadow-lg dark:shadow-primary/5 overflow-hidden relative z-10">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-blue-gradient">
                  Page Replacement Algorithm Simulator
                </CardTitle>
                <CardDescription className="text-foreground/70">
                  Visualize and understand how different page replacement algorithms work in operating systems
                </CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="rounded-full"
                      >
                        <Info className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Show algorithm explanations</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Label htmlFor="frames" className="flex items-center gap-2">
                  Number of Memory Frames
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The number of physical memory frames available</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="flex items-center gap-2">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFrames(Math.max(1, frames - 1))}
                      disabled={isSimulating || frames <= 1}
                      className="border-primary/20 hover:bg-primary/10"
                    >
                      -
                    </Button>
                  </motion.div>
                  <Input
                    id="frames"
                    type="number"
                    min="1"
                    max="10"
                    value={frames}
                    onChange={(e) => setFrames(Number.parseInt(e.target.value) || 1)}
                    disabled={isSimulating}
                    className="text-center"
                  />
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFrames(Math.min(10, frames + 1))}
                      disabled={isSimulating || frames >= 10}
                      className="border-primary/20 hover:bg-primary/10"
                    >
                      +
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Label htmlFor="algorithm" className="flex items-center gap-2">
                  Page Replacement Algorithm
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The strategy used to decide which page to replace</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={algorithm} onValueChange={setAlgorithm} disabled={isSimulating}>
                  <SelectTrigger id="algorithm" className="bg-background">
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fifo">First-In-First-Out (FIFO)</SelectItem>
                    <SelectItem value="lru">Least Recently Used (LRU)</SelectItem>
                    <SelectItem value="optimal">Optimal</SelectItem>
                    <SelectItem value="secondChance">Second Chance (Clock)</SelectItem>
                    <SelectItem value="mru">Most Recently Used (MRU)</SelectItem>
                    <SelectItem value="random">Random Replacement</SelectItem>
                    <SelectItem value="nfu">Not Frequently Used (NFU)</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Label htmlFor="animationSpeed" className="flex items-center gap-2">
                  Animation Speed
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Control the speed of the step-by-step animation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    step="100"
                    value={2200 - animationSpeed}
                    onChange={(e) => setAnimationSpeed(2200 - Number.parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <Zap className="h-5 w-5 text-yellow-500 animate-pulse" />
                </div>
              </motion.div>
              <motion.div
                className="space-y-2 md:col-span-3 lg:col-span-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="pageSequence" className="flex items-center gap-2">
                    Page Request Sequence
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The sequence of page requests to process</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <span className="text-xs text-muted-foreground">Separate numbers with spaces</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="pageSequence"
                    value={pageSequence}
                    onChange={(e) => setPageSequence(e.target.value)}
                    placeholder="e.g., 1 2 3 4 1 2 5 1 2 3 4 5"
                    disabled={isSimulating}
                    className="bg-background"
                  />
                  <motion.div whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPageSequence("1 2 3 4 1 2 5 1 2 3 4 5")}
                            disabled={isSimulating}
                            className="border-primary/20 hover:bg-primary/10"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reset to default sequence</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-6 bg-muted/30">
            {!isSimulating ? (
              <div className="flex gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden"
                >
                  <Button
                    onClick={runSimulation}
                    className="bg-blue-gradient hover:opacity-90 text-white relative z-10"
                  >
                    <Sparkles className="mr-2 h-4 w-4 animate-pulse" /> Run Simulation
                  </Button>
                  <motion.div
                    className="absolute inset-0 bg-blue-gradient opacity-50"
                    animate={{
                      x: ["100%", "-100%"],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.5,
                      ease: "linear",
                    }}
                    style={{
                      filter: "blur(8px)",
                    }}
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      runSimulation()
                      setIsStepMode(true)
                    }}
                    className="border-primary/20 hover:bg-primary/10"
                  >
                    <RotateCw className="mr-2 h-4 w-4" /> Step-by-Step Mode
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="flex gap-2">
                {isStepMode && (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        variant="outline"
                        className="border-primary/20 hover:bg-primary/10"
                      >
                        <SkipBack className="mr-2 h-4 w-4" /> Previous
                      </Button>
                    </motion.div>
                    {autoPlay ? (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => setAutoPlay(false)}
                          variant="outline"
                          className="border-primary/20 hover:bg-primary/10"
                        >
                          <Pause className="mr-2 h-4 w-4" /> Pause
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => setAutoPlay(true)}
                          disabled={currentStep === simulationResults.steps.length - 1}
                          className="bg-purple-blue-gradient hover:opacity-90 text-white"
                        >
                          <Play className="mr-2 h-4 w-4" /> Auto Play
                        </Button>
                      </motion.div>
                    )}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={nextStep}
                        disabled={currentStep === simulationResults.steps.length - 1}
                        variant="outline"
                        className="border-primary/20 hover:bg-primary/10"
                      >
                        Next <SkipForward className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </>
                )}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="destructive"
                    onClick={resetSimulation}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Reset
                  </Button>
                </motion.div>
              </div>
            )}
          </CardFooter>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlgorithmExplanation algorithm={algorithm} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {simulationResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs defaultValue="visualization" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-lg">
                <TabsTrigger value="visualization" className="data-[state=active]:bg-background">
                  Visualization
                </TabsTrigger>
                <TabsTrigger value="results" className="data-[state=active]:bg-background">
                  Results & Analysis
                </TabsTrigger>
              </TabsList>
              <TabsContent value="visualization" className="space-y-4">
                <Card className="border-primary/20 shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Memory Frames Visualization</CardTitle>
                        <CardDescription>
                          {isStepMode
                            ? `Step ${currentStep + 1} of ${simulationResults.steps.length}: Page request ${simulationResults.steps[currentStep].request}`
                            : `Visualization of all ${simulationResults.steps.length} steps`}
                        </CardDescription>
                      </div>
                      {isStepMode && (
                        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                          {currentStep + 1} / {simulationResults.steps.length}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <PageSequenceVisualizer
                        sequence={simulationResults.pageSequence}
                        currentIndex={isStepMode ? currentStep : -1}
                      />
                      <MemoryFrameVisualizer
                        steps={isStepMode ? [simulationResults.steps[currentStep]] : simulationResults.steps}
                        frames={frames}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="results">
                <ResultsDisplay results={simulationResults} algorithm={algorithm} />
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.footer
        className="pt-6 border-t border-gray-200 dark:border-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
              Made by Konsept
            </div>
            <span className="text-sm text-muted-foreground">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="hidden sm:inline">Documentation</span>
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View documentation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

