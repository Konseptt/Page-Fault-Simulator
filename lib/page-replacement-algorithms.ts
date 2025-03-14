// First-In-First-Out (FIFO) algorithm
export function simulateFIFO(pageSequence: number[], frameCount: number) {
  const frames: (number | null)[] = Array(frameCount).fill(null)
  const steps: { request: number; frames: (number | null)[]; pageFault: boolean }[] = []
  let totalPageFaults = 0
  let fifoIndex = 0

  pageSequence.forEach((page) => {
    // Check if page is already in frames
    const frameIndex = frames.indexOf(page)
    const pageFault = frameIndex === -1

    if (pageFault) {
      // Page fault - need to replace a page
      totalPageFaults++

      // If there's an empty frame, use it
      const emptyIndex = frames.indexOf(null)
      if (emptyIndex !== -1) {
        frames[emptyIndex] = page
      } else {
        // Replace according to FIFO
        frames[fifoIndex] = page
        fifoIndex = (fifoIndex + 1) % frameCount
      }
    }

    // Record the current state
    steps.push({
      request: page,
      frames: [...frames],
      pageFault,
    })
  })

  return {
    pageSequence,
    steps,
    totalPageFaults,
    pageFaultRate: totalPageFaults / pageSequence.length,
  }
}

// Least Recently Used (LRU) algorithm
export function simulateLRU(pageSequence: number[], frameCount: number) {
  const frames: (number | null)[] = Array(frameCount).fill(null)
  const steps: {
    request: number
    frames: (number | null)[]
    pageFault: boolean
    referenceCounter?: Record<number, number>
  }[] = []
  let totalPageFaults = 0
  const lastUsed: Record<number, number> = {}

  pageSequence.forEach((page, currentTime) => {
    // Check if page is already in frames
    const frameIndex = frames.indexOf(page)
    const pageFault = frameIndex === -1

    if (pageFault) {
      // Page fault - need to replace a page
      totalPageFaults++

      // Find the least recently used page
      if (!frames.includes(null)) {
        let lruPage = frames[0]!
        let lruIndex = 0

        frames.forEach((frame, index) => {
          if (frame !== null && lastUsed[frame] < lastUsed[lruPage]) {
            lruPage = frame
            lruIndex = index
          }
        })

        frames[lruIndex] = page
      } else {
        // Find the first empty frame
        const emptyIndex = frames.indexOf(null)
        frames[emptyIndex] = page
      }
    }

    // Update the last used time for this page
    lastUsed[page] = currentTime

    // Create a copy of the reference counters for visualization
    const referenceCounter = { ...lastUsed }

    // Record the current state
    steps.push({
      request: page,
      frames: [...frames],
      pageFault,
      referenceCounter,
    })
  })

  return {
    pageSequence,
    steps,
    totalPageFaults,
    pageFaultRate: totalPageFaults / pageSequence.length,
  }
}

// Optimal algorithm
export function simulateOptimal(pageSequence: number[], frameCount: number) {
  const frames: (number | null)[] = Array(frameCount).fill(null)
  const steps: { request: number; frames: (number | null)[]; pageFault: boolean }[] = []
  let totalPageFaults = 0

  pageSequence.forEach((page, currentIndex) => {
    // Check if page is already in frames
    const frameIndex = frames.indexOf(page)
    const pageFault = frameIndex === -1

    if (pageFault) {
      // Page fault - need to replace a page
      totalPageFaults++

      // If there's an empty frame, use it
      const emptyIndex = frames.indexOf(null)
      if (emptyIndex !== -1) {
        frames[emptyIndex] = page
      } else {
        // Find the page that will not be used for the longest time in the future
        const nextUse: Record<number, number> = {}

        // Initialize with a value larger than the sequence length
        frames.forEach((frame) => {
          if (frame !== null) {
            nextUse[frame] = Number.POSITIVE_INFINITY
          }
        })

        // Find the next use of each page in frames
        for (let i = currentIndex + 1; i < pageSequence.length; i++) {
          const futurePage = pageSequence[i]
          if (frames.includes(futurePage) && nextUse[futurePage] === Number.POSITIVE_INFINITY) {
            nextUse[futurePage] = i
          }
        }

        // Find the page that will not be used for the longest time
        let victimPage = frames[0]!
        let victimIndex = 0

        frames.forEach((frame, index) => {
          if (frame !== null && nextUse[frame] > nextUse[victimPage]) {
            victimPage = frame
            victimIndex = index
          }
        })

        frames[victimIndex] = page
      }
    }

    // Record the current state
    steps.push({
      request: page,
      frames: [...frames],
      pageFault,
    })
  })

  return {
    pageSequence,
    steps,
    totalPageFaults,
    pageFaultRate: totalPageFaults / pageSequence.length,
  }
}

// Second Chance (Clock) algorithm
export function simulateSecondChance(pageSequence: number[], frameCount: number) {
  const frames: (number | null)[] = Array(frameCount).fill(null)
  const secondChanceBits: boolean[] = Array(frameCount).fill(false)
  const steps: { request: number; frames: (number | null)[]; pageFault: boolean; secondChanceBits: boolean[] }[] = []
  let totalPageFaults = 0
  let clockHand = 0

  pageSequence.forEach((page) => {
    // Check if page is already in frames
    const frameIndex = frames.indexOf(page)
    const pageFault = frameIndex === -1

    if (!pageFault) {
      // Page hit - set the second chance bit
      secondChanceBits[frameIndex] = true
    } else {
      // Page fault - need to replace a page
      totalPageFaults++

      // If there's an empty frame, use it
      const emptyIndex = frames.indexOf(null)
      if (emptyIndex !== -1) {
        frames[emptyIndex] = page
        secondChanceBits[emptyIndex] = false
      } else {
        // Use the clock algorithm to find a victim
        while (true) {
          if (secondChanceBits[clockHand]) {
            // This page has a second chance, clear the bit and move on
            secondChanceBits[clockHand] = false
            clockHand = (clockHand + 1) % frameCount
          } else {
            // This page has no second chance, replace it
            frames[clockHand] = page
            secondChanceBits[clockHand] = false
            clockHand = (clockHand + 1) % frameCount
            break
          }
        }
      }
    }

    // Record the current state
    steps.push({
      request: page,
      frames: [...frames],
      pageFault,
      secondChanceBits: [...secondChanceBits],
    })
  })

  return {
    pageSequence,
    steps,
    totalPageFaults,
    pageFaultRate: totalPageFaults / pageSequence.length,
  }
}

// Most Recently Used (MRU) algorithm
export function simulateMRU(pageSequence: number[], frameCount: number) {
  const frames: (number | null)[] = Array(frameCount).fill(null)
  const steps: {
    request: number
    frames: (number | null)[]
    pageFault: boolean
    referenceCounter?: Record<number, number>
  }[] = []
  let totalPageFaults = 0
  const lastUsed: Record<number, number> = {}

  pageSequence.forEach((page, currentTime) => {
    // Check if page is already in frames
    const frameIndex = frames.indexOf(page)
    const pageFault = frameIndex === -1

    if (pageFault) {
      // Page fault - need to replace a page
      totalPageFaults++

      // Find the most recently used page
      if (!frames.includes(null)) {
        let mruPage = frames[0]!
        let mruIndex = 0

        frames.forEach((frame, index) => {
          if (frame !== null && lastUsed[frame] > lastUsed[mruPage]) {
            mruPage = frame
            mruIndex = index
          }
        })

        frames[mruIndex] = page
      } else {
        // Find the first empty frame
        const emptyIndex = frames.indexOf(null)
        frames[emptyIndex] = page
      }
    }

    // Update the last used time for this page
    lastUsed[page] = currentTime

    // Create a copy of the reference counters for visualization
    const referenceCounter = { ...lastUsed }

    // Record the current state
    steps.push({
      request: page,
      frames: [...frames],
      pageFault,
      referenceCounter,
    })
  })

  return {
    pageSequence,
    steps,
    totalPageFaults,
    pageFaultRate: totalPageFaults / pageSequence.length,
  }
}

// Random Replacement algorithm
export function simulateRandom(pageSequence: number[], frameCount: number) {
  const frames: (number | null)[] = Array(frameCount).fill(null)
  const steps: { request: number; frames: (number | null)[]; pageFault: boolean }[] = []
  let totalPageFaults = 0

  pageSequence.forEach((page) => {
    // Check if page is already in frames
    const frameIndex = frames.indexOf(page)
    const pageFault = frameIndex === -1

    if (pageFault) {
      // Page fault - need to replace a page
      totalPageFaults++

      // If there's an empty frame, use it
      const emptyIndex = frames.indexOf(null)
      if (emptyIndex !== -1) {
        frames[emptyIndex] = page
      } else {
        // Choose a random frame to replace
        const randomIndex = Math.floor(Math.random() * frameCount)
        frames[randomIndex] = page
      }
    }

    // Record the current state
    steps.push({
      request: page,
      frames: [...frames],
      pageFault,
    })
  })

  return {
    pageSequence,
    steps,
    totalPageFaults,
    pageFaultRate: totalPageFaults / pageSequence.length,
  }
}

// Not Frequently Used (NFU) algorithm
export function simulateNFU(pageSequence: number[], frameCount: number) {
  const frames: (number | null)[] = Array(frameCount).fill(null)
  const steps: {
    request: number
    frames: (number | null)[]
    pageFault: boolean
    referenceCounter?: Record<number, number>
  }[] = []
  let totalPageFaults = 0
  const usageCounter: Record<number, number> = {}

  pageSequence.forEach((page) => {
    // Initialize counter for this page if it doesn't exist
    if (usageCounter[page] === undefined) {
      usageCounter[page] = 0
    }

    // Check if page is already in frames
    const frameIndex = frames.indexOf(page)
    const pageFault = frameIndex === -1

    if (pageFault) {
      // Page fault - need to replace a page
      totalPageFaults++

      // If there's an empty frame, use it
      const emptyIndex = frames.indexOf(null)
      if (emptyIndex !== -1) {
        frames[emptyIndex] = page
      } else {
        // Find the least frequently used page
        let lfuPage = frames[0]!
        let lfuIndex = 0

        frames.forEach((frame, index) => {
          if (frame !== null && usageCounter[frame] < usageCounter[lfuPage]) {
            lfuPage = frame
            lfuIndex = index
          }
        })

        frames[lfuIndex] = page
      }
    }

    // Increment the usage counter for this page
    usageCounter[page]++

    // Create a copy of the reference counters for visualization
    const referenceCounter = { ...usageCounter }

    // Record the current state
    steps.push({
      request: page,
      frames: [...frames],
      pageFault,
      referenceCounter,
    })
  })

  return {
    pageSequence,
    steps,
    totalPageFaults,
    pageFaultRate: totalPageFaults / pageSequence.length,
  }
}

