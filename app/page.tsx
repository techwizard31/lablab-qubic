"use client";

import { useState } from 'react';

export default function Home() {
  const [rulebook, setRulebook] = useState('');
  const [contract, setContract] = useState('');
  const [result, setResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setResult('');
    
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rulebook, contract }),
      });
      
      if (!res.ok) {
        throw new Error('Analysis failed');
      }
      
      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      setResult('Error: Failed to analyze contract. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-purple-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">Smart Contract Auditor</h1>
          <p className="text-purple-200 mt-2">Analyze your smart contracts against custom security rules</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Rulebook Input */}
            <div className="bg-purple-950 rounded-lg p-6 border border-purple-700">
              <label className="block text-lg font-semibold text-white mb-3">
                Security Rulebook
              </label>
              <textarea
                className="w-full p-4 bg-black text-white border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
                rows={8}
                placeholder="Enter your security rules and guidelines here..."
                value={rulebook}
                onChange={(e) => setRulebook(e.target.value)}
              />
              <div className="mt-2 text-sm text-purple-300">
                {rulebook.length} characters
              </div>
            </div>

            {/* Contract Input */}
            <div className="bg-purple-950 rounded-lg p-6 border border-purple-700">
              <label className="block text-lg font-semibold text-white mb-3">
                Smart Contract Code
              </label>
              <textarea
                className="w-full p-4 bg-black text-white border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
                rows={8}
                placeholder="Paste your smart contract code here..."
                value={contract}
                onChange={(e) => setContract(e.target.value)}
              />
              <div className="mt-2 text-sm text-purple-300">
                {contract.length} characters
              </div>
            </div>

            {/* Analyze Button */}
            <div className="flex justify-center">
              <button
                className="px-8 py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={handleAnalyze}
                disabled={!rulebook.trim() || !contract.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  'Analyze Contract'
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-purple-950 rounded-lg p-6 border border-purple-700 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Analysis Results</h2>
                {result && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-purple-300">Complete</span>
                  </div>
                )}
              </div>
              
              <div className="bg-black rounded-lg p-4 min-h-[400px] border border-purple-600">
                {result ? (
                  <pre className="text-sm text-purple-100 whitespace-pre-wrap font-mono overflow-auto max-h-[600px]">
                    {result}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-purple-400">
                    <div className="text-center">
                      <div className="text-4xl mb-4">🔍</div>
                      <p>Analysis results will appear here</p>
                      <p className="text-sm mt-2">Enter your rulebook and contract code to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-purple-400">
          <p className="text-sm">
            Powered by AI-driven security analysis • Always perform manual reviews for production contracts
          </p>
        </div>
      </main>
    </div>
  );
}