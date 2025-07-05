"use client";

import { useState } from 'react';

export default function Home() {
  const [rulebook, setRulebook] = useState('');
  const [contract, setContract] = useState('');
  const [result, setResult] = useState('');

  const handleAnalyze = async () => {
    setResult('Analyzing...');
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rulebook, contract }),
    });
    const data = await res.json();
    setResult(data.result);
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Smart Contract Analyzer</h1>
      
      <textarea
        className="w-full p-2 border mb-4"
        rows={6}
        placeholder="Paste your RULEBOOK here"
        value={rulebook}
        onChange={(e) => setRulebook(e.target.value)}
      />

      <textarea
        className="w-full p-2 border mb-4"
        rows={6}
        placeholder="Paste your SMART CONTRACT here"
        value={contract}
        onChange={(e) => setContract(e.target.value)}
      />

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleAnalyze}
      >
        Analyze
      </button>

      <div className="mt-4 whitespace-pre-wrap">
        {result}
      </div>
    </main>
  );
}
