'use client'

import { useState } from 'react'
import { Lightbulb, TrendingUp, Users, DollarSign, Target, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function Home() {
  const [idea, setIdea] = useState('')
  const [validating, setValidating] = useState(false)
  const [result, setResult] = useState(null)

  const validateIdea = async () => {
    if (!idea.trim()) return
    setValidating(true)
    setResult(null)
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const score = Math.floor(Math.random() * 40) + 60
    setResult({
      overallScore: score,
      marketSize: { score: Math.floor(Math.random() * 100), label: ['$1B+', '$500M-$1B', '$100M-$500M', '$50M-$100M'][Math.floor(Math.random() * 4)] },
      competition: { score: Math.floor(Math.random() * 100), competitors: Math.floor(Math.random() * 20) + 3 },
      demand: { score: Math.floor(Math.random() * 100), searches: Math.floor(Math.random() * 50000) + 1000 },
      monetization: { score: Math.floor(Math.random() * 100), models: ['Subscription', 'Freemium', 'Usage-based', 'Enterprise'] },
      suggestions: [
        'Consider focusing on a specific niche within this market',
        'Add AI-powered features to differentiate from competitors',
        'Build integrations with popular tools like Slack, Notion',
        'Start with a strong content marketing strategy',
        'Consider a product-led growth approach'
      ].sort(() => Math.random() - 0.5).slice(0, 3),
      risks: [
        'Established players may copy your features quickly',
        'Customer acquisition costs could be high initially',
        'Market may be saturated in certain segments'
      ].sort(() => Math.random() - 0.5).slice(0, 2)
    })
    setValidating(false)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className="text-green-500" />
    if (score >= 60) return <AlertCircle className="text-yellow-500" />
    return <XCircle className="text-red-500" />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Lightbulb className="text-violet-600" />
          SaaS Idea Validator
        </h1>
        <p className="text-gray-600 mb-8">AI-powered market research in seconds</p>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your SaaS idea in detail... (e.g., An AI-powered tool that automatically generates social media content calendars for small businesses)"
            className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
          <button
            onClick={validateIdea}
            disabled={validating || !idea.trim()}
            className="mt-4 w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {validating ? <><Loader2 className="animate-spin" /> Analyzing Market...</> : 'Validate My Idea'}
          </button>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-8 text-white text-center">
              <p className="text-violet-100 mb-2">Overall Viability Score</p>
              <p className="text-6xl font-bold">{result.overallScore}</p>
              <p className="text-violet-100 mt-2">/100</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="text-violet-500" />
                  <span className="font-medium">Market Size</span>
                </div>
                <p className={`text-3xl font-bold ${getScoreColor(result.marketSize.score)}`}>{result.marketSize.label}</p>
                <p className="text-sm text-gray-500">TAM Estimate</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="text-violet-500" />
                  <span className="font-medium">Competition</span>
                </div>
                <p className={`text-3xl font-bold ${getScoreColor(100 - result.competition.competitors * 3)}`}>{result.competition.competitors}</p>
                <p className="text-sm text-gray-500">Direct Competitors</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="text-violet-500" />
                  <span className="font-medium">Search Demand</span>
                </div>
                <p className={`text-3xl font-bold ${getScoreColor(result.demand.score)}`}>{result.demand.searches.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Monthly Searches</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="text-violet-500" />
                  <span className="font-medium">Monetization</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.monetization.models.slice(0, 2).map((m, i) => (
                    <span key={i} className="px-2 py-1 bg-violet-100 text-violet-700 rounded text-xs">{m}</span>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">Viable Models</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" /> Recommendations
              </h3>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <span className="text-violet-500 mt-1">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <AlertCircle className="text-yellow-500" /> Potential Risks
              </h3>
              <ul className="space-y-2">
                {result.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <span className="text-yellow-500 mt-1">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
