import { useEffect, useState } from 'react'
import type { Topic } from '@/entities/topic'

export function useProgress(storageKey = 'docker_progress', topics: Topic[] = []) {
  const [progress, setProgress] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress))
    } catch {
      // ignore
    }
  }, [progress, storageKey])

  const toggleTopic = (id: string) => {
    setProgress((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const mainTopics = topics.filter((t) => t.group !== 'interview')
  const total = mainTopics.length
  const completed = mainTopics.filter((t) => progress[t.id]).length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return {
    progress,
    toggleTopic,
    total,
    completed,
    percent,
  }
}
