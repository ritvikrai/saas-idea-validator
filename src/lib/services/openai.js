import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function validateSaaSIdea(idea) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are an expert startup advisor and market researcher. Analyze SaaS ideas and provide detailed market validation.

Always respond with valid JSON in this exact format:
{
  "overallScore": 75,
  "marketAnalysis": {
    "size": "$500M-$1B",
    "growth": "15% CAGR",
    "score": 80
  },
  "competition": {
    "directCompetitors": ["Competitor 1", "Competitor 2"],
    "indirectCompetitors": ["Alt 1", "Alt 2"],
    "competitiveAdvantage": "description of potential advantages",
    "score": 70
  },
  "demand": {
    "problemSeverity": "high/medium/low",
    "targetAudience": "description of target users",
    "estimatedSearchVolume": 15000,
    "score": 75
  },
  "monetization": {
    "recommendedModels": ["Subscription", "Freemium"],
    "pricingRange": "$20-$100/month",
    "revenueProjection": "$50K-$200K ARR first year",
    "score": 80
  },
  "suggestions": [
    "Specific actionable suggestion 1",
    "Specific actionable suggestion 2",
    "Specific actionable suggestion 3"
  ],
  "risks": [
    "Risk 1",
    "Risk 2"
  ],
  "verdict": "Strong potential / Needs refinement / High risk"
}`,
      },
      {
        role: 'user',
        content: `Analyze this SaaS idea for market viability:\n\n${idea}`,
      },
    ],
    max_tokens: 2000,
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse validation:', e);
  }
  
  return null;
}

export async function generateCompetitorAnalysis(idea, competitors) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a competitive analysis expert. Provide detailed competitor comparisons.',
      },
      {
        role: 'user',
        content: `Idea: ${idea}\n\nAnalyze these competitors and how to differentiate: ${competitors.join(', ')}`,
      },
    ],
    max_tokens: 1000,
  });

  return response.choices[0].message.content;
}

export async function suggestFeatures(idea, targetAudience) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a product strategist. Suggest MVP features for SaaS products. Respond with JSON array of features with name and priority (must-have, should-have, nice-to-have).',
      },
      {
        role: 'user',
        content: `Idea: ${idea}\nTarget: ${targetAudience}\n\nSuggest MVP features.`,
      },
    ],
    max_tokens: 800,
  });

  try {
    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse features:', e);
  }
  
  return [];
}
