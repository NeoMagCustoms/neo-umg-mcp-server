import readline from 'readline';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage, SystemMessage } from 'langchain/schema';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const plannerPrompt = `
You are an agent planning assistant inside the Neo UMG MCP Server.

Your job is to take a natural language task and deconstruct it into modular UMG-style blueprints for agents or tools. Each sub-task should include:

- name (1-3 words)
- goal (short sentence)
- recommended tool type (TypeScript, Python, CLI, API)
- expected input/output
- trigger method (manual, HTTP, recursive)

Respond in clean JSON array format like this:

[
  {
    "name": "scanRepo",
    "goal": "Scan the file structure and count types",
    "tool": "TypeScript CLI",
    "input": "repo path",
    "output": "summary report",
    "trigger": "manual"
  },
  ...
]
`;

const llm = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0.2,
  openAIApiKey: process.env.OPENAI_API_KEY!
});

rl.question('🧠 What do you want to build? ', async (userInput) => {
  const response = await llm.call([
    new SystemMessage(plannerPrompt),
    new HumanMessage(userInput)
  ]);

  console.log('\n📋 Task Plan:\n');
  console.log(response.text.trim());

  rl.close();
});
