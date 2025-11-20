import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const encode = () => {
    setError('');
    try {
      const encoded = btoa(input);
      setOutput(encoded);
    } catch (e) {
      setError('Failed to encode. Please check your input.');
      setOutput('');
    }
  };

  const decode = () => {
    setError('');
    try {
      const decoded = atob(input);
      setOutput(decoded);
    } catch (e) {
      setError('Invalid Base64 string. Please check your input.');
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
          rows={6}
          placeholder="Enter text to encode or Base64 to decode..."
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={encode}
          disabled={!input}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Encode
        </button>
        <button
          onClick={decode}
          disabled={!input}
          className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Decode
        </button>
      </div>

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Output
            </label>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Copy</span>
                </>
              )}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none"
            rows={6}
          />
        </div>
      )}
    </div>
  );
}
