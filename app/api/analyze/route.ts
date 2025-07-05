import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const template = `
You are a smart contract auditor.

RULEBOOK SECTION: {rules}

CODE CHUNK: {code}

Analyze the code against these rules. List any violations with explanations.
`;

export async function POST(req: NextRequest) {
  const { rulebook, contract } = await req.json();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  // 1️⃣ Split the rulebook
  const ruleChunks = await textSplitter.splitText(rulebook);

  // 2️⃣ Embed and store in vector DB
  const embeddings = new OpenAIEmbeddings();
  const vectorStore = await Chroma.fromTexts(ruleChunks, [], {
    embeddings,
    collectionName: "rulebook",
  });

  // 3️⃣ Split the contract
  const contractChunks = await textSplitter.splitText(contract);

  // 4️⃣ Prepare the LLM
  const llm = new ChatOpenAI({ temperature: 0 });
  const prompt = new PromptTemplate({
    template,
    inputVariables: ["rules", "code"],
  });
  const chain = new LLMChain({ llm, prompt });

  let allResults = "";

  for (const chunk of contractChunks) {
    // 5️⃣ Retrieve top-k rules
    const relevantDocs = await vectorStore.similaritySearch(chunk, 5);
    const rulesText = relevantDocs.map((doc: { pageContent: any; }) => doc.pageContent).join("\n");

    // 6️⃣ Call LLM
    const response = await chain.call({ rules: rulesText, code: chunk });

    allResults += `\n\n---\nCODE CHUNK:\n${chunk}\n\nAnalysis:\n${response.text}`;
  }

  return NextResponse.json({ result: allResults });
}