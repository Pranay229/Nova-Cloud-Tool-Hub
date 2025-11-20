import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function HashGenerator() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const generateHash = async (text: string, algorithm: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const [sha256, setSha256] = useState('');
  const [sha384, setSha384] = useState('');
  const [sha512, setSha512] = useState('');

  const handleGenerate = async () => {
    if (!input) return;

    const sha256Hash = await generateHash(input, 'SHA-256');
    const sha384Hash = await generateHash(input, 'SHA-384');
    const sha512Hash = await generateHash(input, 'SHA-512');

    setSha256(sha256Hash);
    setSha384(sha384Hash);
    setSha512(sha512Hash);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const HashResult = ({ label, value }: { label: string; value: string }) => (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-gray-900">{label}</span>
        <button
          onClick={() => copyToClipboard(value, label)}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {copied === label ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>
      <p className="text-sm text-gray-600 break-all font-mono">{value || 'Generate a hash to see results'}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Input Text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          placeholder="Enter text to hash..."
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={!input}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        Generate Hashes
      </button>

      <div className="space-y-4">
        <HashResult label="SHA-256" value={sha256} />
        <HashResult label="SHA-384" value={sha384} />
        <HashResult label="SHA-512" value={sha512} />
      </div>
    </div>
  );
}
