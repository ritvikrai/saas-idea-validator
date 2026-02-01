import { NextResponse } from 'next/server';
import { validateSaaSIdea, suggestFeatures } from '@/lib/services/openai';
import { searchMarketData, findCompetitors } from '@/lib/services/search';
import { saveValidation } from '@/lib/services/storage';

export async function POST(request) {
  try {
    const { idea } = await request.json();

    if (!idea || idea.trim().length < 20) {
      return NextResponse.json(
        { error: 'Please provide a detailed idea description (at least 20 characters)' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return demo data
      const demoResult = {
        overallScore: Math.floor(Math.random() * 30) + 65,
        marketAnalysis: {
          size: ['$100M-$500M', '$500M-$1B', '$1B+'][Math.floor(Math.random() * 3)],
          growth: `${Math.floor(Math.random() * 20) + 10}% CAGR`,
          score: Math.floor(Math.random() * 30) + 60,
        },
        competition: {
          directCompetitors: ['Competitor A', 'Competitor B', 'Competitor C'],
          indirectCompetitors: ['Alt Solution 1', 'Alt Solution 2'],
          competitiveAdvantage: 'Focus on specific niche or superior UX',
          score: Math.floor(Math.random() * 30) + 60,
        },
        demand: {
          problemSeverity: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
          targetAudience: 'SMBs and startups looking for efficient solutions',
          estimatedSearchVolume: Math.floor(Math.random() * 50000) + 5000,
          score: Math.floor(Math.random() * 30) + 60,
        },
        monetization: {
          recommendedModels: ['Subscription', 'Freemium'],
          pricingRange: '$19-$99/month',
          revenueProjection: '$30K-$150K ARR first year',
          score: Math.floor(Math.random() * 30) + 60,
        },
        suggestions: [
          'Start with a focused MVP targeting one specific use case',
          'Build in public to generate early interest',
          'Consider a product-led growth approach',
        ],
        risks: [
          'Market may be crowded - differentiation is key',
          'Customer acquisition costs could be challenging',
        ],
        verdict: 'Promising with refinement needed',
        note: 'Demo mode - Add OPENAI_API_KEY for real AI analysis',
      };

      const saved = await saveValidation(idea, demoResult);
      return NextResponse.json({ success: true, validation: saved });
    }

    // Run validation with real AI
    const [validation, marketData, competitors] = await Promise.all([
      validateSaaSIdea(idea),
      searchMarketData(idea),
      findCompetitors(idea),
    ]);

    if (!validation) {
      return NextResponse.json(
        { error: 'Failed to analyze idea' },
        { status: 500 }
      );
    }

    // Enrich with market data
    validation.marketData = marketData;
    if (competitors.length > 0) {
      validation.competition.directCompetitors = competitors;
    }

    // Get feature suggestions
    const features = await suggestFeatures(idea, validation.demand?.targetAudience);
    validation.suggestedFeatures = features;

    // Save to storage
    const saved = await saveValidation(idea, validation);

    return NextResponse.json({
      success: true,
      validation: saved,
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate idea', details: error.message },
      { status: 500 }
    );
  }
}
