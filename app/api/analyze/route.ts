import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import fs from 'fs/promises'; 

const template = `
You are a smart contract auditor.

RULEBOOK SECTION: {rules}

CODE CHUNK: {code}

Analyze the code against these rules. List any violations with explanations.
`;

export async function POST(req: NextRequest) {
  const { contract } = await req.json();

  const rulebookPath = process.cwd() + '/data/rulebook.txt'; // or wherever your file is
  const rulebookText = await fs.readFile(rulebookPath, 'utf8');

  // 2️⃣ Split rulebook into chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const ruleChunks = await textSplitter.splitText(rulebookText);

  // 3️⃣ Embed and store in vector DB
  const embeddings = new OpenAIEmbeddings();
  const vectorStore = await Chroma.fromTexts(
    ruleChunks,
    [],
    embeddings,
    {
      collectionName: "rulebook",
    }
  );
  // 4️⃣ Split contract
  const contractChunks = await textSplitter.splitText(contract);

  // 5️⃣ Set up LLM chain
  const llm = new ChatOpenAI({ temperature: 0 });
  const prompt = new PromptTemplate({
    template,
    inputVariables: ["rules", "code"],
  });
  const chain = new LLMChain({ llm, prompt });

  let allResults = "";

  for (const chunk of contractChunks) {
    const relevantDocs = await vectorStore.similaritySearch(chunk, 5);
    const rulesText = relevantDocs.map((doc: { pageContent: string }) => doc.pageContent).join("\n");

    const response = await chain.call({ rules: rulesText, code: chunk });

    allResults += `\n\n---\nCODE CHUNK:\n${chunk}\n\nAnalysis:\n${response.text}`;
  }

  return NextResponse.json({ result: allResults });
}