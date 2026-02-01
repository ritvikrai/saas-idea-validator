'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, TrendingUp, Users, DollarSign, Target, Loader2, CheckCircle, XCircle, AlertCircle, History } from 'lucide-react'

export default function Home() {
  const [idea, setIdea] = useState('')
  const [validating, setValidating] = useState(false)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/validations')
      const data = await res.json()
      if (data.validations) {
        setHistory(data.validations)
      }
    } catch (e) {
      console.error('Failed to fetch history:', e)
    }
  }

  const validateIdea = async () => {
    if (!idea.trim() || idea.length < 20) {
      alert('Please describe your idea in more detail (at least 20 characters)')
      return
    }
    setValidating(true)
    setResult(null)
    
    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      })
      
      const data = await res.json()
      
      if (data.success && data.validation) {
        setResult(data.validation.result)
        fetchHistory()
      } else {
        alert(data.error || 'Failed to validate idea')
      }
    } catch (e) {
      console.error('Validation error:', e)
      alert('Failed to validate idea. Please try again.')
    } finally {
      setValidating(false)
    }
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
                <p className={`text-3xl font-bold ${getScoreColor(result.marketAnalysis?.score || 70)}`}>{result.marketAnalysis?.size || 'N/A'}</p>
                <p className="text-sm text-gray-500">TAM Estimate</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="text-violet-500" />
                  <span className="font-medium">Competition</span>
                </div>
                <p className={`text-3xl font-bold ${getScoreColor(result.competition?.score || 70)}`}>{result.competition?.directCompetitors?.length || 0}</p>
                <p className="text-sm text-gray-500">Direct Competitors</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="text-violet-500" />
                  <span className="font-medium">Search Demand</span>
                </div>
                <p className={`text-3xl font-bold ${getScoreColor(result.demand?.score || 70)}`}>{(result.demand?.estimatedSearchVolume || 0).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Monthly Searches</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="text-violet-500" />
                  <span className="font-medium">Monetization</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(result.monetization?.recommendedModels || []).slice(0, 2).map((m, i) => (
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
