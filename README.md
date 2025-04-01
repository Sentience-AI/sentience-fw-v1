# Sentience Agent Framework

## Overview
The Sentience Framework enables developers to create and manage intelligent agents through a command-line interface. This open-source solution integrates with the [SentienceChain.io API](https://sentiencechain.io), facilitating seamless interaction with your deployed AI agents.

## ✨ Core Features
- **Blockchain Integration**: Launch intelligent agents on Solana
- **Natural Language**: Communicate with agents using everyday language
- **Data Analytics**: Access live blockchain metrics and statistics
- **Pattern Recognition**: Monitor token movements and market trends
- **Advanced Queries**: Perform sophisticated blockchain analysis
- **Data Provider**: Direct integration with [SentienceChain.io](https://sentiencechain.io) for real-time data

## 💡 Technical Capabilities
- **Asset Analytics**: Extract detailed token information and metrics
- **Market Intelligence**: Monitor market movements and trading patterns
- **Extensible Design**: Build and integrate custom functionality
- **Universal Support**: Works across all Node.js-supported platforms

## 🔧 Setup Guide

### System Requirements
- Node.js version 16 or higher
- Package manager (npm/yarn)
- [SentienceChain.io](https://sentiencechain.io) API credentials
- Additional requirements listed in `.env.example`

### Setup Process
```bash
git clone https://github.com/sentience-ai/sentience-framework.git
cd sentience-framework
npm install
```

### Environment Configuration
```ini
# .env
PRIVATE_KEYPAIR=<YOUR_SOLANA_KEYPAIR>
OPENAI_API_KEY=<YOUR_OPENAI_KEY>
RPC_ENDPOINT=https://api.mainnet-beta.solana.com
SENTIENCE_API_KEY=<YOUR_SENTIENCE_KEY>
```

### Compile Source
```bash
npm run build
```

## 📋 Framework Commands

### Agent Interaction
```bash
npm run interact-sentience-agent {agent_name} ask "Your question"
```

Example:
```bash
npm run interact-sentience-agent Aura ask "Trending token 24h"
```

### Market Analysis Commands

| Command Type | Syntax |
|-------------|---------|
| Token Trends | `npm run interact-sentience-agent {agentName} ask "Trending token 24h"` |
| Holder Analysis | `npm run interact-sentience-agent {agentName} ask "Top holders: {mintAddress}"` |
| Market Metrics | `npm run interact-sentience-agent {agentName} ask "Marketcap count:{count} term:\"{term}\""` |
| Buyer Analysis | `npm run interact-sentience-agent {agentName} ask "First top {count} buyers for: {mintAddress}"` |

### Trading Operations
```bash
npm run sentience-trade {agent_name}
```

## 📚 Technology Stack

### Core Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| @solana/web3.js | ^1.98.0 | Solana blockchain connectivity |
| @sentiencechain/core | ^2.4.0 | SentienceChain API integration |

### Development Tools
| Package | Version |
|---------|---------|
| TypeScript | ^5.7.3 |
| ts-node | ^10.9.2 |

## ⚙️ API Integration

### Base URL
https://api.sentiencechain.io/v1


### Endpoints
```bash
# Get agent details
curl https://api.sentiencechain.io/v1/agent/Aura

# Agent interaction
curl -X POST "https://api.sentiencechain.io/v1/agent/Aura/interact" \
  -H "Content-Type: application/json" \
  -d '{"message": "Market analysis for SOL"}'
```

### Node.js Implementation
```javascript
const { SentienceClient } = require('@sentiencechain/sdk');

const client = new SentienceClient({
  apiKey: process.env.SENTIENCE_API_KEY,
  network: 'mainnet'
});

async function analyzeMarket() {
  const response = await client.queryAgent('Aura', {
    query: "Top 10 holders of XYZ token",
    params: { mintAddress: "XYZ123..." }
  });
  console.log(response.data);
}
```

## 🤝 Community Contributions
1. Fork the SentienceChain GitHub repo
2. Create feature branch: `git checkout -b feature/your-idea`
3. Submit PR with detailed description
4. For full documentation visit [SentienceChain Developer Portal](https://docs.sentiencechain.io)
