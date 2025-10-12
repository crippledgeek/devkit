// Minimal polyfill only for Buffer needed by iconv-lite in the browser
import { Buffer as NodeBuffer } from 'buffer'

declare global {
  interface Window {
    Buffer?: typeof import('buffer').Buffer
  }
}

// Ensure window.Buffer (browser)
if (typeof window !== 'undefined') {
  const w = window as Window & { Buffer?: typeof import('buffer').Buffer }
  if (!w.Buffer) {
    w.Buffer = NodeBuffer
  }
}

// Ensure globalThis.Buffer (generic global)
{
  const g = globalThis as typeof globalThis & { Buffer?: typeof import('buffer').Buffer }
  if (!g.Buffer) {
    g.Buffer = NodeBuffer
  }
}
