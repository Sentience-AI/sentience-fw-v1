# OnChainBrain AI Agent Framework

![Logo](https://tan-raw-booby-681.mypinata.cloud/ipfs/bafybeia7gruybha3ljo6uzkatpjrd6ebjjnyrov6u2up5afklkcmblnnca)

## Overview

The OnChainBrain Framework enables developers to create and manage intelligent agents through a command-line interface. This open-source solution integrates with the OnChainBrain API, facilitating seamless interaction with your deployed AI agents.

## ✨ Core Features

- **Blockchain Integration**: Launch intelligent agents on Solana
- **Natural Language**: Communicate with agents using everyday language
- **Data Analytics**: Access live blockchain metrics and statistics
- **Pattern Recognition**: Monitor token movements and market trends
- **Advanced Queries**: Perform sophisticated blockchain analysis
- **Data Provider**: Direct integration with Bitquery for real-time data

## 💡 Technical Capabilities

- **Asset Analytics**: Extract detailed token information and metrics
- **Market Intelligence**: Monitor market movements and trading patterns
- **Extensible Design**: Build and integrate custom functionality
- **Universal Support**: Works across all Node.js-supported platforms

## 🔧 Setup Guide

### System Requirements

- Node.js version 16 or higher
- Package manager (npm/yarn)
- Bitquery API credentials
- Additional requirements listed in .env.example

### Setup Process

1. Get the code:

```bash
git clone https://github.com/onchainbrain/onchainbrain-fw-v1.git
cd onchainbrain-fw-v1
```

2. Install required packages:

```bash
npm install
```

3. Configure environment:
   Create .env file with these parameters:

```bash
PRIVATE_KEYPAIR=<YOUR_SOLANA_KEYPAIR>
OPENAI_API_KEY=<YOUR_OPENAI_KEY>
RPC_ENDPOINT=https://api.mainnet-beta.solana.com
BITQUERY_API_KEY=<YOUR_BITQUERY_KEY>
```

4. Compile the source:

```bash
npm run build
```

## 📋 Framework Commands

### Agent Interaction

```bash
npm run interact-ocb-agent {agent_name} ask "Your question"
```

Example:

```bash
npm run interact-ocb-agent Aura ask "Trending token 24h"
```

### Market Analysis Commands

1. Token Trends:

```bash
npm run interact-ocb-agent {agentName} ask "Trending token 24h"
```

2. Holder Analysis:

```bash
npm run interact-ocb-agent {agentName} ask "Top holders: {mintAddress}"
```

Example:

```bash
npm run interact-ocb-agent {agentName} ask "Top holders: 6LKbpcg2fQ84Ay3kKXVyo3bHUGe3s36g9EVbKYSupump"
```

3. Market Metrics:

```bash
npm run interact-ocb-agent {agentName} ask "Marketcap count:{count} term:\"{term}\""
```

Example:

```bash
npm run interact-ocb-agent {agentName} ask "Marketcap count:50 term:\"pump\""
```

4. Buyer Analysis:

```bash
npm run interact-ocb-agent {agentName} ask "First top {count} buyers for: {mintAddress}"
```

Example:

```bash
npm run interact-ocb-agent {agentName} ask "First top 10 buyers for: 6LKbpcg2fQ84Ay3kKXVyo3bHUGe3s36g9EVbKYSupump"
```

5. Trading Operations:

```bash
npm run ocb-trade {agent_name}
```

## 📚 Technology Stack

### Core Dependencies

| Package           | Version | Purpose                         |
| ----------------- | ------- | ------------------------------- |
| `@solana/web3.js` | ^1.98.0 | Solana blockchain connectivity  |
| `dotenv`          | ^16.4.7 | Environment configuration       |
| `firebase`        | ^11.1.0 | Data persistence and management |
| `node-fetch`      | ^3.3.2  | Network request handling        |
| `openai`          | ^4.77.3 | AI processing capabilities      |
| `bs58`            | ^6.0.0  | Address encoding utilities      |
| `form-data`       | ^4.0.1  | Data structure handling         |
| `punycode`        | ^2.3.1  | Unicode processing              |

### Development Tools

| Package          | Version | Purpose               |
| ---------------- | ------- | --------------------- |
| `typescript`     | ^5.7.3  | Type-safe development |
| `ts-node`        | ^10.9.2 | TypeScript execution  |
| `tsconfig-paths` | ^4.2.0  | Module resolution     |

## ⚙️ Available Scripts

- `npm run build`: Compile TypeScript code
- `npm run interact-ocb-agent`: Agent communication
- `npm run ocb-trade`: Execute trading operations

## 🔍 Architecture Overview

- **Data Storage**: Firebase backend integration
- **Market Data**: Bitquery data provider integration
- **Command Processing**: Advanced query parsing system
- **Extensibility**: Modular architecture design

# OnChainBrain API Guide

## Prerequisites

1. **API Access Point**: [api.onchainbrain.xyz](https://api.onchainbrain.xyz)
2. **HTTP Client**: Any standard HTTP client (curl, Postman, etc.)

## API Endpoints

### Agent Information Retrieval

Get agent details from the OnChainBrain database.

**GET** `/api/agent/:name`

Sample Request:

```bash
curl https://api.onchainbrain.xyz/api/agent/Aura
```

Sample Response:

```json
{
  "name": "Nova",
  "description": "An intelligent agent designed to assist with tasks.",
  "createdAt": "2025-01-01T12:00:00Z"
}
```

### Agent Communication (Query Parameters)

Interact with agents using URL parameters.

**GET** `/api/agent/:name/interact?message=YourMessage`

Sample Request:

```bash
curl "https://api.onchainbrain.xyz/api/agent/Aura/interact?message=Hello!"
```

Sample Response:

```json
{
  "agent": "Aura",
  "reply": "Hello! How can I assist you today?"
}
```

### Agent Communication (JSON)

Interact with agents using JSON payloads.

**POST** `/api/agent/:name/interact`

Sample Request:

```bash
curl -X POST "https://api.onchainbrain.xyz/api/agent/Nova/interact" \
-H "Content-Type: application/json" \
-d '{"message": "Hello, Nova"}'
```

Sample Response:

```json
{
  "agent": "Aura",
  "reply": "Hey, how can i help you?"
}
```

## Node.js Implementation

```javascript
const fetch = require("node-fetch");

async function interactWithAgent(agentName, message) {
  const response = await fetch(
    `https://api.onchainbrain.xyz/api/agent/${agentName}/interact`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    }
  );

  if (!response.ok) {
    console.error("Agent communication failed:", response.statusText);
    return;
  }

  const data = await response.json();
  console.log("Agent Response:", data.reply);
}

interactWithAgent("Aura", "Hello there!");
```

## API Notes

- **Cloud-Based**: Fully hosted solution with no local setup needed
- **Centralized Data**: Agent information stored in OnChainBrain's database

## 🤝 Community Contributions

To contribute:

- Fork the repository
- Create a feature branch
- Submit your changes
- Open a pull request
