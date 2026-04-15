'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Brain, Shield, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-8 pb-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">NeuroMind AI</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-foreground/70 hover:text-foreground transition">
                Features
              </Link>
              <Link href="#ethics" className="text-foreground/70 hover:text-foreground transition">
                Ethics
              </Link>
              <Link href="/assess" className="text-foreground/70 hover:text-foreground transition">
                Get Started
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Mental Health Assessment Powered by AI
            </h1>
            <p className="text-xl text-foreground/70 mb-8 text-balance">
              Understand your mental wellness through intelligent text analysis. Built with FAIR ethics principles ensuring fairness, accountability, and transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/assess">
                <Button size="lg" className="gap-2">
                  Start Assessment <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/history">
                <Button size="lg" variant="outline">
                  View My History
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border border-border hover:border-primary/50 transition">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AI Analysis</h3>
              <p className="text-foreground/70">
                Our machine learning model analyzes your text to identify mental health indicators with scientific rigor.
              </p>
            </Card>

            <Card className="p-6 border border-border hover:border-primary/50 transition">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Privacy First</h3>
              <p className="text-foreground/70">
                Your data stays in your browser. We never store or share your personal mental health information.
              </p>
            </Card>

            <Card className="p-6 border border-border hover:border-primary/50 transition">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Transparent Results</h3>
              <p className="text-foreground/70">
                See detailed confidence scores and risk assessments with clear explanations of how we reached conclusions.
              </p>
            </Card>
          </div>
        </section>

        {/* FAIR Ethics Section */}
        <section id="ethics" className="py-20 bg-card rounded-2xl px-8 md:px-12 py-16 border border-border">
          <h2 className="text-3xl font-bold mb-8 text-foreground">FAIR Ethics Commitment</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Fairness</h3>
              <p className="text-foreground/70 mb-4">
                Trained on balanced, diverse mental health datasets to ensure equitable assessments across different demographics and backgrounds.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Accountability</h3>
              <p className="text-foreground/70 mb-4">
                Clear documentation of model performance, limitations, and how decisions are made. We take responsibility for our predictions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Responsible AI</h3>
              <p className="text-foreground/70 mb-4">
                Extensive bias testing, regular audits, and human oversight to ensure safe and ethical AI deployment in mental health context.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Transparency</h3>
              <p className="text-foreground/70 mb-4">
                Know exactly how your assessment was calculated. Each result includes confidence levels and detailed explanation of findings.
              </p>
            </div>
          </div>
          <div className="mt-8 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-foreground">
              <strong>Important Disclaimer:</strong> NeuroMind AI is a research and educational tool, not a substitute for professional medical or mental health advice. Always consult qualified healthcare professionals for diagnosis and treatment.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Get Started?</h2>
          <p className="text-lg text-foreground/70 mb-8">
            Take your first mental health assessment in just a few minutes.
          </p>
          <Link href="/assess">
            <Button size="lg" className="gap-2">
              Begin Assessment <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 text-center text-foreground/60 text-sm">
          <p>NeuroMind AI © 2024. Built with FAIR ethics principles.</p>
          <p className="mt-2">For mental health support, contact a qualified healthcare professional.</p>
        </footer>
      </div>
    </main>
  )
}
