import { useState } from 'react';
import { Copy, Check, ArrowUpDown } from 'lucide-react';

export function URLTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [lastOperation, setLastOperation] = useState<string>('');

  const encode = () => {
    setError('');
    setLastOperation('encode');
    if (!input.trim()) {
      setError('Please enter text to encode.');
      setOutput('');
      return;
    }
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
    } catch (e) {
      setError(`Failed to encode: ${e instanceof Error ? e.message : 'Unknown error'}. Please check your input.`);
      setOutput('');
    }
  };

  const decode = () => {
    setError('');
    setLastOperation('decode');
    if (!input.trim()) {
      setError('Please enter a URL-encoded string to decode.');
      setOutput('');
      return;
    }
    try {
      // Try to decode, but handle malformed sequences gracefully
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
    } catch (e) {
      // If decodeURIComponent fails, try a more lenient approach
      try {
        // Try replacing % that aren't part of valid encoding
        const cleaned = input.replace(/%[^0-9A-Fa-f]|%[0-9A-Fa-f][^0-9A-Fa-f]/g, (match) => {
          return encodeURIComponent(match);
        });
        const decoded = decodeURIComponent(cleaned);
        setOutput(decoded);
        setError('Warning: Some invalid characters were fixed during decoding.');
      } catch (e2) {
        setError(`Invalid URL encoded string: ${e instanceof Error ? e.message : 'Malformed encoding detected'}. Please check your input.`);
        setOutput('');
      }
    }
  };

  const encodeFullURL = () => {
    setError('');
    setLastOperation('encodeFull');
    if (!input.trim()) {
      setError('Please enter a URL to encode.');
      setOutput('');
      return;
    }
    try {
      const encoded = encodeURI(input);
      setOutput(encoded);
    } catch (e) {
      setError(`Failed to encode URL: ${e instanceof Error ? e.message : 'Invalid characters detected'}. Please check your input.`);
      setOutput('');
    }
  };

  const decodeFullURL = () => {
    setError('');
    setLastOperation('decodeFull');
    if (!input.trim()) {
      setError('Please enter a URL-encoded string to decode.');
      setOutput('');
      return;
    }
    try {
      const decoded = decodeURI(input);
      setOutput(decoded);
    } catch (e) {
      // Try component decoding as fallback
      try {
        const decoded = decodeURIComponent(input);
        setOutput(decoded);
        setError('Warning: Used component decoding. Some characters may not decode correctly.');
      } catch (e2) {
        setError(`Invalid URL string: ${e instanceof Error ? e.message : 'Malformed encoding detected'}. Please check your input.`);
        setOutput('');
      }
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const swapInputOutput = () => {
    if (output) {
      setInput(output);
      setOutput('');
      setError('');
      setLastOperation('');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setLastOperation('');
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-300">
            Input
          </label>
          <div className="flex gap-2">
            {output && (
              <button
                onClick={swapInputOutput}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 text-gray-400 hover:text-gray-200 transition-colors"
                title="Swap input and output"
              >
                <ArrowUpDown className="w-3 h-3" />
                Swap
              </button>
            )}
            <button
              onClick={clearAll}
              className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 text-gray-400 hover:text-gray-200 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm text-gray-100 placeholder-gray-500"
          rows={6}
          placeholder="Enter text to encode or URL-encoded string to decode..."
        />
      </div>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex gap-4">
          <button
            onClick={encode}
            disabled={!input}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Encode Component
          </button>
          <button
            onClick={decode}
            disabled={!input}
            className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Decode Component
          </button>
        </div>
        <div className="flex gap-4">
          <button
            onClick={encodeFullURL}
            disabled={!input}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Encode Full URL
          </button>
          <button
            onClick={decodeFullURL}
            disabled={!input}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Decode Full URL
          </button>
        </div>
      </div>

      <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
        <p className="text-sm text-blue-300">
          <strong>Encode Component:</strong> Encodes special characters in URL components (e.g., query parameters, fragments).<br />
          <strong>Encode Full URL:</strong> Encodes the entire URL while preserving URL structure (e.g., protocol, domain).
        </p>
      </div>

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Output
              </label>
              {lastOperation && (
                <p className="text-xs text-gray-500 mt-1">
                  {lastOperation === 'encode' && 'Component Encoded'}
                  {lastOperation === 'decode' && 'Component Decoded'}
                  {lastOperation === 'encodeFull' && 'Full URL Encoded'}
                  {lastOperation === 'decodeFull' && 'Full URL Decoded'}
                </p>
              )}
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Copy</span>
                </>
              )}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg font-mono text-sm resize-none text-gray-100"
            rows={6}
          />
        </div>
      )}
    </div>
  );
}

