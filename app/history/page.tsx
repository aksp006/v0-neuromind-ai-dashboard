'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Trash2, Brain } from 'lucide-react'

interface HistoryEntry {
  id: number
  timestamp: string
  text: string
  prediction: 'low' | 'moderate' | 'high'
  confidence: number
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('assessmentHistory')
    if (stored) {
      setHistory(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear your assessment history? This cannot be undone.')) {
      localStorage.removeItem('assessmentHistory')
      setHistory([])
    }
  }

  const deleteEntry = (id: number) => {
    const updated = history.filter((entry) => entry.id !== id)
    setHistory(updated)
    localStorage.setItem('assessmentHistory', JSON.stringify(updated))
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200'
      case 'moderate':
        return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200'
      case 'high':
        return 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200'
      default:
        return 'bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-200'
    }
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card className="border border-border p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Assessment History</h1>
                <p className="text-foreground/70">
                  {history.length} assessment{history.length !== 1 ? 's' : ''} on record
                </p>
              </div>
            </div>
            {history.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearHistory}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
            <p className="text-sm text-foreground/70">
              <strong>Privacy Note:</strong> Your assessment history is stored only in your browser&apos;s local storage. We never have access to this data.
            </p>
          </div>
        </Card>

        {history.length === 0 ? (
          <Card className="border border-border p-12 text-center">
            <Brain className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">No Assessments Yet</h2>
            <p className="text-foreground/70 mb-6">
              You haven&apos;t completed any mental health assessments yet. Start your first one to build a history.
            </p>
            <Link href="/assess">
              <Button size="lg">Start Your First Assessment</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {history
              .slice()
              .reverse()
              .map((entry) => (
                <Card key={entry.id} className="border border-border p-4 hover:border-primary/50 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRiskColor(entry.prediction)}`}>
                          {entry.prediction} Risk
                        </span>
                        <span className="text-xs text-foreground/50">{formatDate(entry.timestamp)}</span>
                      </div>
                      <p className="text-foreground/70 text-sm mb-2">{entry.text}</p>
                      <div className="text-xs text-foreground/50">
                        Confidence: {(entry.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-foreground/50 hover:text-destructive transition flex-shrink-0"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/assess">
            <Button>Take Another Assessment</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
