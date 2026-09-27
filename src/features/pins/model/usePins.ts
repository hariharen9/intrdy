import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PinItem } from '@/entities/topic'

export function usePins(storageKey: string) {
  const fullKey = `intrdy_pins_${storageKey}`

  const [pins, setPins] = useState<PinItem[]>(() => {
    try {
      const stored = localStorage.getItem(fullKey)
      if (stored) {
        return JSON.parse(stored) as PinItem[]
      }
    } catch {
      // ignore
    }
    return []
  })

  useEffect(() => {
    try {
      localStorage.setItem(fullKey, JSON.stringify(pins))
    } catch {
      // ignore
    }
  }, [fullKey, pins])

  const addPin = useCallback(
    (params: {
      topicId: string
      topicTitle: string
      text: string
      sectionNo?: string
    }) => {
      const cleanText = params.text.trim()
      if (!cleanText) return

      setPins((prev) => {
        // Prevent exact duplicates in the same topic
        const exists = prev.some(
          (p) => p.topicId === params.topicId && p.text === cleanText,
        )
        if (exists) return prev

        const newPin: PinItem = {
          id: `pin_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          topicId: params.topicId,
          topicTitle: params.topicTitle,
          sectionNo: params.sectionNo,
          text: cleanText,
          createdAt: Date.now(),
        }
        return [newPin, ...prev]
      })
    },
    [],
  )

  const removePin = useCallback((id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const clearPins = useCallback(() => {
    setPins([])
  }, [])

  // Group pins by topicId
  const pinsByTopic = useMemo(() => {
    const map: Record<string, { topicTitle: string; sectionNo?: string; items: PinItem[] }> = {}
    for (const pin of pins) {
      if (!map[pin.topicId]) {
        map[pin.topicId] = {
          topicTitle: pin.topicTitle,
          sectionNo: pin.sectionNo,
          items: [],
        }
      }
      const entry = map[pin.topicId]
      if (entry) {
        entry.items.push(pin)
      }
    }
    return map
  }, [pins])

  const exportPinsAsMarkdown = useCallback(
    (courseTitle: string) => {
      if (pins.length === 0) return

      let md = `# ${courseTitle} — Pinned Revision Notes\n\n`
      md += `*Generated from INTRDY on ${new Date().toLocaleDateString()}*\n\n`

      for (const [, group] of Object.entries(pinsByTopic)) {
        const header = group.sectionNo
          ? `## Module ${group.sectionNo}: ${group.topicTitle}`
          : `## ${group.topicTitle}`
        md += `${header}\n\n`
        for (const item of group.items) {
          md += `> "${item.text}"\n\n`
        }
      }

      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `${courseTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-revision-pins.md`,
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    [pins, pinsByTopic],
  )

  return {
    pins,
    pinsCount: pins.length,
    pinsByTopic,
    addPin,
    removePin,
    clearPins,
    exportPinsAsMarkdown,
  }
}
