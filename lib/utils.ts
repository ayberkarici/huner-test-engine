import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simulated token counting (rough approximation)
export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token for English/mixed text
  return Math.ceil(text.length / 4)
}

// Format milliseconds to human readable
export function formatLatency(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(0)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

// Format timestamp
export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  })
}

