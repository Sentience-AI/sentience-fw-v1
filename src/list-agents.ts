import { getAllAgents } from "./supabase.js";

async function main() {
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
    process.exit(1);
  }
}

main(); 