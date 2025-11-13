import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-4', 'py-2', 'bg-blue-500')
    expect(result).toContain('px-4')
    expect(result).toContain('py-2')
    expect(result).toContain('bg-blue-500')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toContain('base-class')
    expect(result).toContain('active-class')
  })

  it('should ignore falsy values', () => {
    const result = cn('base-class', false && 'hidden-class', null, undefined)
    expect(result).toContain('base-class')
    expect(result).not.toContain('hidden-class')
  })

  it('should merge conflicting Tailwind classes correctly', () => {
    const result = cn('px-4', 'px-8')
    // twMerge deve manter apenas o último valor
    expect(result).toContain('px-8')
    expect(result).not.toContain('px-4')
  })

  it('should handle empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle arrays of classes', () => {
    const result = cn(['px-4', 'py-2'], 'bg-blue-500')
    expect(result).toContain('px-4')
    expect(result).toContain('py-2')
    expect(result).toContain('bg-blue-500')
  })
})
