'use client';

import React from 'react';
import Editor from '@monaco-editor/react';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function CodeEditor({ value, onChange }: Props) {
  return (
    <div className="bg-purple-950 rounded-lg p-4 border border-purple-700">
      <label className="block text-lg font-semibold text-white mb-3">
        Smart Contract Code
      </label>
      <div className="rounded-lg overflow-hidden border border-purple-600">
        <Editor
          height="300px"
          language="cpp"
          theme="vs-dark"
          value={value}
          onChange={(newValue) => onChange(newValue || '')}
          options={{
            minimap: { enabled: false },
            fontFamily: 'monospace',
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
      <div className="mt-2 text-sm text-purple-300">
        {value.length} characters
      </div>
    </div>
  );
}
