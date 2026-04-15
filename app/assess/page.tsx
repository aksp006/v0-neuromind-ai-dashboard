'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { ArrowLeft, Brain, Loader2 } from 'lucide-react'
import AssessmentResults from '@/components/AssessmentResults'

export default function AssessPage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!text.trim()) {
      setError('Please enter some text to analyze')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      // Call FastAPI backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/assess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`)
      }

      const data = await response.json()
      setResults(data)

      // Save to localStorage
      const history = JSON.parse(localStorage.getItem('assessmentHistory') || '[]')
      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        prediction: data.prediction,
        confidence: data.confidence,
      }
      history.push(newEntry)
      localStorage.setItem('assessmentHistory', JSON.stringify(history.slice(-20)))
    } catch (err) {
      console.error('[v0] Assessment error:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to connect to assessment service. Make sure the backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <AssessmentResults results={results} />

          <div className="mt-8 flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setResults(null)
                setText('')
              }}
            >
              New Assessment
            </Button>
            <Link href="/history">
              <Button>View History</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card className="border border-border">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Mental Health Assessment</h1>
            </div>

            <p className="text-foreground/70 mb-6">
              Share your thoughts and feelings. The more detailed and honest your response, the more accurate our analysis will be.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="assessment" className="block text-sm font-medium text-foreground mb-2">
                  Describe how you&apos;re feeling
                </label>
                <Textarea
                  id="assessment"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share your thoughts, emotions, and concerns... (minimum 20 characters)"
                  className="min-h-64 bg-input border border-border"
                  disabled={loading}
                />
                <p className="text-xs text-foreground/50 mt-2">
                  Your text is analyzed locally. It&apos;s never stored on our servers.
                </p>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                <p className="text-sm text-foreground/70">
                  <strong>Privacy:</strong> Your assessment is processed securely and stored only in your browser.
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading || !text.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Get Assessment'
                )}
              </Button>
            </form>
          </div>
        </Card>

        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-3">What to Expect</h3>
          <ul className="space-y-2 text-foreground/70 text-sm">
            <li>✓ AI analysis of your text for mental health indicators</li>
            <li>✓ Risk level assessment (Low, Moderate, High)</li>
            <li>✓ Confidence score showing model certainty</li>
            <li>✓ Transparent explanation of results</li>
            <li>✓ Suggestions for mental health resources</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
