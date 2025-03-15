# Page Fault Simulator

A visual interactive simulator for understanding page replacement algorithms in operating systems. This project helps users visualize how different page replacement algorithms work and compare their performance.

![Page Fault Simulator](https://raw.githubusercontent.com/konsept/page-fault-simulator/main/public/placeholder.svg)

## Features

- Interactive visualization of page replacement algorithms
- Step-by-step animation of memory frame allocation
- Comparative analysis with charts and metrics
- Light/dark mode support
- Responsive design for all devices
- Educational explanations of each algorithm

## Supported Page Replacement Algorithms

- **First-In-First-Out (FIFO)**: Replaces the oldest page in memory.
- **Least Recently Used (LRU)**: Replaces the page that hasn't been used for the longest time.
- **Optimal (Belady's Algorithm)**: Theoretical algorithm that replaces the page that won't be used for the longest time in the future.
- **Second Chance (Clock)**: A modified FIFO that gives pages a second chance before replacement.
- **Most Recently Used (MRU)**: Replaces the page that was most recently accessed.
- **Random Replacement**: Selects a random page for replacement.
- **Not Frequently Used (NFU)**: Replaces pages that have been used less frequently.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PNPM package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/page-fault-simulator.git
cd page-fault-simulator
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a page request sequence (e.g., "1 2 3 4 1 2 5 1 2 3 4 5")
2. Select the number of memory frames (1-10)
3. Choose a page replacement algorithm
4. Click "Run Simulation" to see the visualization
5. Use the controls to step through the simulation or view the results

## Data Visualization

- **Bar Chart**: Displays the distribution of page faults and hits per page
- **Line Chart**: Shows cumulative page faults over time
- **Pie Chart**: Compares the proportion of page faults to page hits

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Recharts](https://recharts.org/) - Charting library
- [shadcn/ui](https://ui.shadcn.com/) - UI component library

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Created by [Konsept](https://github.com/konsept)
- Algorithms implementation based on operating systems theory and principles