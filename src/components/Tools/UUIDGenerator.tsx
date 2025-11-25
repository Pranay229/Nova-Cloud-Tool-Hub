import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

export function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState(false);

  const generateUUID = () => {
    return crypto.randomUUID();
  };

  const handleGenerate = () => {
    const newUuids = Array.from({ length: count }, () => generateUUID());
    setUuids(newUuids);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Number of UUIDs
        </label>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
          min="1"
          max="100"
        />
        <p className="text-sm text-gray-400 mt-1">Generate 1-100 UUIDs at once</p>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-5 h-5" />
        Generate UUID{count > 1 ? 's' : ''}
      </button>

      {uuids.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-100">Generated UUIDs</span>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Copy All</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-gray-700/50 rounded-lg max-h-96 overflow-y-auto border border-gray-600">
            <div className="space-y-2">
              {uuids.map((uuid, index) => (
                <div key={index} className="font-mono text-sm text-gray-200 p-2 bg-gray-800 rounded border border-gray-600">
                  {uuid}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
