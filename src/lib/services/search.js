// Web search service - uses SerpAPI if available, otherwise provides estimates
// Can be extended with other search APIs (Bing, Google Custom Search, etc.)

export async function searchMarketData(query) {
  // If SerpAPI key is available, use real search
  if (process.env.SERP_API_KEY) {
    try {
      const response = await fetch(
        `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${process.env.SERP_API_KEY}`
      );
      const data = await response.json();
      return {
        organic_results: data.organic_results || [],
        related_searches: data.related_searches || [],
        search_volume: estimateSearchVolume(query),
      };
    } catch (e) {
      console.error('SerpAPI error:', e);
    }
  }

  // Fallback: return estimated data based on query analysis
  return {
    organic_results: [],
    related_searches: [],
    search_volume: estimateSearchVolume(query),
    note: 'Estimated data - add SERP_API_KEY for real search results',
  };
}

export function estimateSearchVolume(query) {
  // Simple heuristic for demo - in production, use actual search volume APIs
  const words = query.toLowerCase().split(' ');
  const highVolumeKeywords = ['ai', 'saas', 'software', 'app', 'tool', 'automation', 'platform'];
  const matchCount = words.filter(w => highVolumeKeywords.includes(w)).length;
  
  const baseVolume = 1000;
  const multiplier = Math.pow(2, matchCount);
  const randomFactor = 0.8 + Math.random() * 0.4;
  
  return Math.floor(baseVolume * multiplier * randomFactor);
}

export async function findCompetitors(idea) {
  // In production, this would scrape Product Hunt, G2, Capterra, etc.
  // For MVP, we use AI to identify likely competitors
  const keywords = idea.toLowerCase();
  
  const competitorDatabase = {
    'project management': ['Asana', 'Monday.com', 'Notion', 'ClickUp', 'Trello'],
    'crm': ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM'],
    'email': ['Mailchimp', 'ConvertKit', 'Sendgrid', 'Postmark'],
    'analytics': ['Mixpanel', 'Amplitude', 'Heap', 'PostHog'],
    'ai': ['OpenAI', 'Anthropic', 'Jasper', 'Copy.ai'],
    'automation': ['Zapier', 'Make', 'n8n', 'Pipedream'],
    'scheduling': ['Calendly', 'Cal.com', 'SavvyCal', 'Doodle'],
    'documentation': ['Notion', 'Confluence', 'GitBook', 'Slite'],
    'design': ['Figma', 'Canva', 'Adobe XD', 'Framer'],
  };

  const foundCompetitors = [];
  for (const [category, competitors] of Object.entries(competitorDatabase)) {
    if (keywords.includes(category)) {
      foundCompetitors.push(...competitors);
    }
  }

  return [...new Set(foundCompetitors)].slice(0, 5);
}
