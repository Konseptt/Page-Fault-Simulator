import PageFaultSimulator from "@/components/page-fault-simulator"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-background">
        <div className="max-w-6xl mx-auto">
          <PageFaultSimulator />
        </div>
      </main>
    </ThemeProvider>
  )
}

