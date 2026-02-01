# SaaS Idea Validator

AI-powered validation for your SaaS ideas with market analysis and scoring.

## Features

- 💡 Submit SaaS ideas for validation
- 📊 Market size and competition analysis
- 🎯 Viability scoring (1-100)
- 💰 Revenue potential estimation
- 📈 Similar successful products research

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: OpenAI GPT-4o-mini
- **Styling**: Tailwind CSS
- **Storage**: File-based JSON

## Getting Started

```bash
npm install
cp .env.example .env  # Add your OPENAI_API_KEY
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/validate` | Validate a SaaS idea |
| GET | `/api/validations` | Get validation history |

## Demo Mode

Works without API key with sample validation results.

## License

MIT
