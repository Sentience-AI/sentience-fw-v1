import fetch from "node-fetch";
import { checkAgentExists, getAgentData, getAllAgents } from "./supabase.js";
import dotenv from 'dotenv';

dotenv.config();

const ENDPOINT = "https://streaming.bitquery.io/eap";
const apiKey = process.env.BITQUERY_API_KEY ?? (() => { 
  throw new Error("Missing BITQUERY_API_KEY in environment"); 
})();

interface TokenMetrics {
  Marketcap: string;
  Currency: {
    Symbol: string;
    MintAddress: string;
  };
}

interface AccountBalance {
  Account: {
    Address: string;
  };
  Holding: string;
}

interface TradeCurrency {
  Name?: string;
  MintAddress?: string;
  Symbol?: string;
}

interface DEXTrade {
  Currency: TradeCurrency;
}

interface BitqueryResponse<T> {
  data?: {
    Solana?: T;
  };
}

function formatUSD(value: string): string {
  const num = parseFloat(value);
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(0)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)}K`;
  }
  return num.toFixed(0);
}

async function fetchMarketcap(agentName: string, count: number, term: string): Promise<void> {
  count = Math.min(count, 30);

  const query = `
  query MyQuery {
    Solana {
      TokenSupplyUpdates(
        where: {TokenSupplyUpdate: {Currency: {MintAddress: {includes: "${term}"}}}}
        orderBy: {descending: Block_Time, descendingByField: "TokenSupplyUpdate_Marketcap"}
        limitBy: {by: TokenSupplyUpdate_Currency_MintAddress, count: 1}
        limit: {count: ${count}}
      ) {
        TokenSupplyUpdate {
          Marketcap: PostBalanceInUSD
          Currency {
            Symbol
            MintAddress
          }
        }
      }
    }
  }`;

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = (await response.json()) as BitqueryResponse<{ TokenSupplyUpdates: { TokenSupplyUpdate: TokenMetrics }[] }>;
    const updates = data?.data?.Solana?.TokenSupplyUpdates ?? [];

    if (updates.length === 0) {
      console.log(`No data found for search term: "${term}"`);
      return;
    }

    console.log(`Market Data for: "${term}"`);
    updates.forEach(({ TokenSupplyUpdate }) => {
      const { Symbol, MintAddress } = TokenSupplyUpdate.Currency;
      const marketcap = formatUSD(TokenSupplyUpdate.Marketcap);
      console.log(`${Symbol} | ${MintAddress} | Cap: ${marketcap}`);
    });
  } catch (error) {
    console.error("Bitquery request failed:", error);
  }
}

async function fetchTopHolders(agentName: string, mintAddress: string): Promise<void> {
  const query = `
  query MyQuery {
    Solana(dataset: realtime) {
      BalanceUpdates(
        limit: { count: 10 }
        orderBy: { descendingByField: "BalanceUpdate_Holding_maximum" }
        where: {
          BalanceUpdate: {
            Currency: {
              MintAddress: { is: "${mintAddress}" }
            }
          }
          Transaction: { Result: { Success: true } }
        }
      ) {
        BalanceUpdate {
          Account {
            Address
          }
          Holding: PostBalance(maximum: Block_Slot)
        }
      }
    }
  }
  `;

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching top holders: ${response.statusText}`);
    }

    const data = (await response.json()) as BitqueryResponse<{ BalanceUpdates: { BalanceUpdate: AccountBalance }[] }>;
    const balanceUpdates = data?.data?.Solana?.BalanceUpdates || [];

    if (balanceUpdates.length === 0) {
      console.log(`Couldnt find top holders for: ${mintAddress}`);
      return;
    }

    console.log(`Requesting top 10 holders for: ${mintAddress}`);
    balanceUpdates.forEach(({ BalanceUpdate }) => {
      const address = BalanceUpdate?.Account?.Address || "Unknown Address";
      const holding = BalanceUpdate?.Holding ? parseFloat(BalanceUpdate.Holding).toFixed(6) : "0.000000";

      console.log(`${address} # Holdings: ${holding}`);
    });
  } catch (error) {
    console.error("Bitquery error when fetching top holders:", error);
  }
}

async function fetchFirstTopBuyers(agentName: string, mintAddress: string, count: number): Promise<void> {
  const query = `
  query MyQuery {
    Solana {
      DEXTrades(
        where: {
          Trade: {
            Buy: {
              Currency: {
                MintAddress: { is: "${mintAddress}" }
              }
            }
          }
        }
        limit: { count: ${count} }
        orderBy: { ascending: Block_Time }
      ) {
        Trade {
          Buy {
            Amount
            Account {
              Token {
                Owner
              }
            }
          }
        }
      }
    }
  }`;

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching top buyers: ${response.statusText}`);
    }

    const data = (await response.json()) as BitqueryResponse<{ DEXTrades: { Trade: { Buy: { Amount: string; Account: { Token: { Owner: string } } } } }[] }>;
    const trades = data?.data?.Solana?.DEXTrades || [];

    if (trades.length === 0) {
      console.log(`Couldnt find top buyers for Mint address: ${mintAddress}`);
      return;
    }

    console.log(`Top ${count} buyers for: ${mintAddress}`);
    trades.forEach(({ Trade }) => {
      const amount = Trade.Buy.Amount;
      const owner = Trade.Buy.Account.Token.Owner;

      console.log(`Amount: ${amount} | Owner: ${owner}`);
    });
  } catch (error) {
    console.error("Error fetching top buyers from Bitquery:", error);
  }
}

async function fetchTrendingTokens(agentName: string): Promise<void> {
  const query = `
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}}, Trade: {Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}, Block: {Time: {since: "2024-08-15T04:19:00Z"}}}
      orderBy: {}
      limit: {count: 5}
    ) {
      Trade {
        Currency {
          Name
          MintAddress
          Symbol
        }
        start: PriceInUSD
        min5: PriceInUSD(
          minimum: Block_Time
          if: {Block: {Time: {after: "2024-08-15T05:14:00Z"}}}
        )
        end: PriceInUSD(maximum: Block_Time)
        Side {
          Currency {
            Symbol
            Name
            MintAddress
          }
        }
      }
    }
  }
}
  `;

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch trending tokens: ${response.statusText}`);
    }

    const data = (await response.json()) as BitqueryResponse<{ DEXTradeByTokens: { Trade: DEXTrade }[] }>;
    const trades = data?.data?.Solana?.DEXTradeByTokens || [];

    if (trades.length === 0) {
      console.log("No trending tokens found.");
      return;
    }

    console.log("Top 5 Trending Tokens 24h:");
    trades.forEach(({ Trade }) => {
      const name = Trade.Currency.Name || "Unknown Token";
      const mintAddress = Trade.Currency.MintAddress || "Unknown Address";

      console.log(`${mintAddress} -> ${name}`);
    });
  } catch (error) {
    console.error("Error fetching trending tokens from Bitquery:", error);
  }
}

async function interactAgent(agentName: string, question: string): Promise<void> {
  const hasMarketcapKeywords = /Marketcap/i.test(question);
  const hasTrendingKeywords = /Trending/i.test(question);
  const hasTopHoldersKeywords = /Top.*holders/i.test(question);
  const hasTopBuyersKeywords = /First.*top.*buyers/i.test(question);

  const agentExists = await checkAgentExists(agentName);

  if (!agentExists) {
      console.error(`Agent "${agentName}" is not found in the database. Please verify the name and try again, or register such agent on the OnChainBrain Framework`);
      return;
  }
  
  const agentData = await getAgentData(agentName); // Retrieve agent data
  const personality = agentData?.personality || "neutral"; // Default to "neutral" if not set
  

  if (hasMarketcapKeywords) {
    const countMatch = question.match(/count:\s*(\d+)/i);
    const termMatch = question.match(/term:\s*"([^"]+)"/i);
    const count = countMatch ? parseInt(countMatch[1], 10) : 10;
    const term = termMatch ? termMatch[1] : "";

    if (term) {
      await fetchMarketcap(agentName, count, term);
    } else {
      console.log("Please provide a valid search term.");
    }
  } else if (hasTopHoldersKeywords) {
    const mintAddressMatch = question.match(/[A-Za-z0-9]{32,44}/);
    if (mintAddressMatch) {
      const mintAddress = mintAddressMatch[0];
      await fetchTopHolders(agentName, mintAddress);
    } else {
      console.log("Please provide a valid MintAddress in the question.");
    }
  } else if (hasTopBuyersKeywords) {
    const mintAddressMatch = question.match(/[A-Za-z0-9]{32,44}/);
    const countMatch = question.match(/First.*top\s*(\d+)/i);
    const count = countMatch ? parseInt(countMatch[1], 10) : 10;

    if (mintAddressMatch) {
      const mintAddress = mintAddressMatch[0];
      await fetchFirstTopBuyers(agentName, mintAddress, count);
    } else {
      console.log("Please provide a valid MintAddress in the question.");
    }
  } else if (hasTrendingKeywords) {
    await fetchTrendingTokens(agentName);
  } else {
    console.log(`Unsupported question: "${question}"`);
  }
}

async function listRegisteredAgents(): Promise<void> {
  try {
    const agents = await getAllAgents();
    
    if (agents.length === 0) {
      console.log("No agents found in the OnChainBrain Framework.");
      return;
    }

    console.log("\nRegistered OnChainBrain Agents:");
    console.log("==============================");
    
    agents.forEach((agent, index) => {
      const personality = agent.personality || "neutral";
      console.log(`${index + 1}. ${agent.name} | Personality: ${personality}`);
    });
    
    console.log("\nTo interact with an agent, use:");
    console.log('npm run interact-ocb-agent {agent_name} ask "Your question"\n');
  } catch (error) {
    console.error("Failed to fetch agents:", error instanceof Error ? error.message : String(error));
  }
}

const args = process.argv.slice(2);

// Add command handling for list-agents
if (args[0] === "list") {
  listRegisteredAgents().catch(error => {
    console.error("Error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
} else if (args.length < 3 || args[1] !== "ask") {
  console.error('Usage:\n' +
    'List agents:   npm run list-agents\n' +
    'Ask question:  npm run interact-ocb-agent {agent_name} ask "Your question"');
  process.exit(1);
} else {
  const agentName = args[0];
  const question = args.slice(2).join(" ");
  
  interactAgent(agentName, question).catch(error => {
    console.error("Error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}