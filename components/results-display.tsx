"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"

interface ResultsDisplayProps {
  results: {
    pageSequence: number[]
    steps: {
      request: number
      frames: (number | null)[]
      pageFault: boolean
    }[]
    totalPageFaults: number
    pageFaultRate: number
  }
  algorithm: string
}

export default function ResultsDisplay({ results, algorithm }: ResultsDisplayProps) {
  const algorithmNames = {
    fifo: "First-In-First-Out (FIFO)",
    lru: "Least Recently Used (LRU)",
    optimal: "Optimal",
    secondChance: "Second Chance (Clock)",
    mru: "Most Recently Used (MRU)",
    random: "Random Replacement",
    nfu: "Not Frequently Used (NFU)",
  }

  const pageFaultsByPage = results.pageSequence.reduce(
    (acc, page) => {
      if (!acc[page]) {
        acc[page] = { page, faults: 0, hits: 0 }
      }
      return acc
    },
    {} as Record<number, { page: number; faults: number; hits: number }>,
  )

  results.steps.forEach((step) => {
    if (step.pageFault) {
      pageFaultsByPage[step.request].faults++
    } else {
      pageFaultsByPage[step.request].hits++
    }
  })

  const chartData = Object.values(pageFaultsByPage)

  // Create data for the line chart showing page faults over time
  const pageFaultsOverTime = results.steps.reduce(
    (acc, step, index) => {
      const previousFaults = index > 0 ? acc[index - 1].cumulativeFaults : 0
      acc.push({
        step: index + 1,
        pageFault: step.pageFault ? 1 : 0,
        cumulativeFaults: step.pageFault ? previousFaults + 1 : previousFaults,
        request: step.request,
      })
      return acc
    },
    [] as Array<{ step: number; pageFault: number; cumulativeFaults: number; request: number }>,
  )

  // Pie chart data
  const pieData = [
    { name: "Page Faults", value: results.totalPageFaults, color: "#ef4444" },
    { name: "Page Hits", value: results.steps.length - results.totalPageFaults, color: "#3b82f6" },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-primary/20 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
            <CardTitle>Simulation Results</CardTitle>
            <CardDescription>
              {algorithmNames[algorithm as keyof typeof algorithmNames] || algorithm} algorithm
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              <motion.div
                className="space-y-2 p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-background relative overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.2)" }}
              >
                <motion.div
                  className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
                <h3 className="text-lg font-medium text-muted-foreground relative z-10">Total Page Faults</h3>
                <p className="text-4xl font-bold text-red-500 relative z-10">{results.totalPageFaults}</p>
              </motion.div>
              <motion.div
                className="space-y-2 p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-background relative overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.2)" }}
              >
                <motion.div
                  className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
                <h3 className="text-lg font-medium text-muted-foreground relative z-10">Page Fault Rate</h3>
                <p className="text-4xl font-bold text-amber-500 relative z-10">
                  {(results.pageFaultRate * 100).toFixed(2)}%
                </p>
              </motion.div>
              <motion.div
                className="space-y-2 p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-background relative overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.2)" }}
              >
                <motion.div
                  className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
                <h3 className="text-lg font-medium text-muted-foreground relative z-10">Total Requests</h3>
                <p className="text-4xl font-bold text-primary relative z-10">{results.steps.length}</p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="bar" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="bar" className="data-[state=active]:bg-background">
              Bar Chart
            </TabsTrigger>
            <TabsTrigger value="line" className="data-[state=active]:bg-background">
              Line Chart
            </TabsTrigger>
            <TabsTrigger value="pie" className="data-[state=active]:bg-background">
              Pie Chart
            </TabsTrigger>
          </TabsList>
          <TabsContent value="bar">
            <Card className="border-primary/20 shadow-md">
              <CardHeader>
                <CardTitle>Page Fault Distribution</CardTitle>
                <CardDescription>Number of page faults and hits for each page</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="page" label={{ value: "Page Number", position: "insideBottom", offset: -5 }} />
                      <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="faults" name="Page Faults" fill="#ef4444" animationDuration={1500} />
                      <Bar dataKey="hits" name="Page Hits" fill="#3b82f6" animationDuration={1500} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="line">
            <Card className="border-primary/20 shadow-md">
              <CardHeader>
                <CardTitle>Page Faults Over Time</CardTitle>
                <CardDescription>Cumulative page faults as requests are processed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={pageFaultsOverTime}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="step" label={{ value: "Request Number", position: "insideBottom", offset: -5 }} />
                      <YAxis label={{ value: "Cumulative Page Faults", angle: -90, position: "insideLeft" }} />
                      <Tooltip
                        formatter={(value, name, props) => {
                          if (name === "cumulativeFaults") return [`${value} faults`, "Cumulative Faults"]
                          return [value, name]
                        }}
                        labelFormatter={(label) => `Step ${label}: Page ${pageFaultsOverTime[label - 1].request}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="cumulativeFaults"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#3b82f6" }}
                        activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pie">
            <Card className="border-primary/20 shadow-md">
              <CardHeader>
                <CardTitle>Page Faults vs Hits</CardTitle>
                <CardDescription>Proportion of page faults to page hits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        animationDuration={1500}
                        animationBegin={200}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} requests`, ""]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

