'use client'

import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react'

interface AssessmentResult {
  prediction: 'low' | 'moderate' | 'high'
  confidence: number
  class_probabilities?: {
    low: number
    moderate: number
    high: number
  }
  risk_score?: number
}

export default function AssessmentResults({ results }: { results: AssessmentResult }) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 dark:text-green-400'
      case 'moderate':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'high':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-foreground'
    }
  }

  const getRiskBgColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
      case 'moderate':
        return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
      case 'high':
        return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
      default:
        return 'bg-card border-border'
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low':
        return <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
      case 'moderate':
        return <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
      case 'high':
        return <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
      default:
        return <Info className="w-6 h-6 text-foreground" />
    }
  }

  const getRiskDescription = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'Based on the analyzed text, your mental health indicators appear to be in a positive state. Continue with healthy coping strategies.'
      case 'moderate':
        return 'Based on the analyzed text, some mental health concerns have been identified. Consider reaching out to a mental health professional for support.'
      case 'high':
        return 'Based on the analyzed text, significant mental health concerns have been identified. Please contact a mental health professional or crisis service immediately.'
      default:
        return 'Unable to determine risk level.'
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <Card className={`border-2 p-8 ${getRiskBgColor(results.prediction)}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">{getRiskIcon(results.prediction)}</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Risk Assessment: <span className={`${getRiskColor(results.prediction)} capitalize`}>
                {results.prediction}
              </span>
            </h2>
            <p className="text-foreground/80 mb-4">
              {getRiskDescription(results.prediction)}
            </p>
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 text-sm">
              <p className="text-foreground/70">
                <strong>Confidence Score:</strong> {(results.confidence * 100).toFixed(1)}%
              </p>
              <p className="text-foreground/60 text-xs mt-1">
                This indicates how certain our model is about this prediction. Higher scores mean more reliable results.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Analysis */}
      <Card className="border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Detailed Analysis</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {results.class_probabilities && (
              <>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3 border border-green-200 dark:border-green-800">
                  <p className="text-xs text-foreground/70 mb-1">Low Risk</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {(results.class_probabilities.low * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs text-foreground/70 mb-1">Moderate Risk</p>
                  <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    {(results.class_probabilities.moderate * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-950 rounded-lg p-3 border border-red-200 dark:border-red-800">
                  <p className="text-xs text-foreground/70 mb-1">High Risk</p>
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">
                    {(results.class_probabilities.high * 100).toFixed(1)}%
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* FAIR Ethics Info */}
      <Card className="border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">About This Assessment</h3>
        <div className="space-y-4 text-sm text-foreground/70">
          <p>
            <strong className="text-foreground">Fairness:</strong> This model was trained on balanced mental health datasets to ensure equitable assessments across diverse demographics.
          </p>
          <p>
            <strong className="text-foreground">Accountability:</strong> The confidence score reflects our model&apos;s certainty. Lower confidence means less reliable predictions.
          </p>
          <p>
            <strong className="text-foreground">Responsible AI:</strong> We conduct regular bias audits to ensure safe and equitable mental health assessment.
          </p>
          <p>
            <strong className="text-foreground">Transparency:</strong> You can see the probability distribution across all risk levels to understand the model&apos;s reasoning.
          </p>
        </div>
      </Card>

      {/* Resources */}
      <Card className="border border-border p-6 bg-primary/5">
        <h3 className="text-lg font-semibold text-foreground mb-4">Mental Health Resources</h3>
        <div className="space-y-3 text-sm">
          {results.prediction === 'high' && (
            <>
              <p className="font-semibold text-destructive mb-2">
                If you&apos;re in crisis, please reach out immediately:
              </p>
              <ul className="space-y-2">
                <li>
                  <strong>National Suicide Prevention Lifeline:</strong> 988 (US, call or text)
                </li>
                <li>
                  <strong>Crisis Text Line:</strong> Text HOME to 741741
                </li>
                <li>
                  <strong>International Association for Suicide Prevention:</strong> https://www.iasp.info/resources/Crisis_Centres/
                </li>
              </ul>
            </>
          )}
          {(results.prediction === 'moderate' || results.prediction === 'high') && (
            <>
              <p className="font-semibold text-foreground mt-4 mb-2">
                Consider professional support:
              </p>
              <ul className="space-y-2">
                <li>
                  <strong>SAMHSA National Helpline:</strong> 1-800-662-4357 (free, confidential, 24/7)
                </li>
                <li>
                  <strong>Psychology Today Therapist Finder:</strong> https://www.psychologytoday.com/us/basics/therapy
                </li>
              </ul>
            </>
          )}
          {results.prediction === 'low' && (
            <p>
              Continue maintaining healthy mental health habits. Remember, if you ever feel your mental health is declining, don&apos;t hesitate to reach out to a professional.
            </p>
          )}
        </div>
      </Card>

      {/* Important Disclaimer */}
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-sm text-foreground font-semibold mb-2">Important Disclaimer</p>
        <p className="text-sm text-foreground/80">
          NeuroMind AI is a research and educational tool, not a substitute for professional medical or mental health advice. This assessment should not be used for diagnosis. Always consult qualified healthcare professionals for proper evaluation and treatment. If you&apos;re in crisis, contact emergency services or a crisis hotline immediately.
        </p>
      </div>
    </div>
  )
}
