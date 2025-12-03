import { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

export function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [convertedDate, setConvertedDate] = useState('');
  const [convertedTimestamp, setConvertedTimestamp] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  const [isMilliseconds, setIsMilliseconds] = useState(true);

  // Update current timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Convert timestamp to date
  const convertTimestampToDate = (ts: string) => {
    setError('');
    try {
      let numTimestamp = parseFloat(ts);
      
      // Auto-detect if it's seconds or milliseconds
      if (numTimestamp < 10000000000) {
        // Less than 10 digits, likely seconds
        numTimestamp = numTimestamp * 1000;
      }

      const date = new Date(numTimestamp);
      
      if (isNaN(date.getTime())) {
        setError('Invalid timestamp');
        setConvertedDate('');
        return;
      }

      const formats = {
        iso: date.toISOString(),
        local: date.toLocaleString(),
        utc: date.toUTCString(),
        dateOnly: date.toLocaleDateString(),
        timeOnly: date.toLocaleTimeString(),
        unixSeconds: Math.floor(numTimestamp / 1000).toString(),
        unixMilliseconds: numTimestamp.toString(),
      };

      setConvertedDate(
        `ISO 8601: ${formats.iso}\n` +
        `Local: ${formats.local}\n` +
        `UTC: ${formats.utc}\n` +
        `Date: ${formats.dateOnly}\n` +
        `Time: ${formats.timeOnly}\n` +
        `Unix (seconds): ${formats.unixSeconds}\n` +
        `Unix (milliseconds): ${formats.unixMilliseconds}`
      );
    } catch (e) {
      setError('Failed to convert timestamp. Please check your input.');
      setConvertedDate('');
    }
  };

  // Convert date to timestamp
  const convertDateToTimestamp = (dateStr: string) => {
    setError('');
    try {
      const date = new Date(dateStr);
      
      if (isNaN(date.getTime())) {
        setError('Invalid date format. Try: YYYY-MM-DD or YYYY-MM-DD HH:MM:SS');
        setConvertedTimestamp('');
        return;
      }

      const timestampMs = date.getTime();
      const timestampS = Math.floor(timestampMs / 1000);

      setConvertedTimestamp(
        `Unix (seconds): ${timestampS}\n` +
        `Unix (milliseconds): ${timestampMs}\n` +
        `ISO 8601: ${date.toISOString()}\n` +
        `Local: ${date.toLocaleString()}\n` +
        `UTC: ${date.toUTCString()}`
      );
    } catch (e) {
      setError('Failed to convert date. Please check your input.');
      setConvertedTimestamp('');
    }
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  const useCurrentTimestamp = () => {
    const ts = isMilliseconds ? currentTimestamp.toString() : Math.floor(currentTimestamp / 1000).toString();
    setTimestamp(ts);
    convertTimestampToDate(ts);
  };

  const formatCurrentDate = () => {
    const now = new Date();
    const formatted = now.toISOString().slice(0, 19).replace('T', ' ');
    setDateInput(formatted);
    convertDateToTimestamp(formatted);
  };

  return (
    <div className="space-y-6">
      {/* Current Timestamp Display */}
      <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-blue-300">Current Timestamp</h3>
          <button
            onClick={() => setCurrentTimestamp(Date.now())}
            className="p-1 hover:bg-blue-900/30 rounded transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-400">Unix (seconds):</span>
            <p className="text-gray-100 font-mono mt-1">
              {Math.floor(currentTimestamp / 1000)}
            </p>
          </div>
          <div>
            <span className="text-blue-400">Unix (milliseconds):</span>
            <p className="text-gray-100 font-mono mt-1">{currentTimestamp}</p>
          </div>
          <div className="col-span-2">
            <span className="text-blue-400">Readable:</span>
            <p className="text-gray-100 mt-1">
              {new Date(currentTimestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Timestamp to Date Converter */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Unix Timestamp
            </label>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400 flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={isMilliseconds}
                  onChange={(e) => setIsMilliseconds(e.target.checked)}
                  className="rounded"
                />
                Milliseconds
              </label>
              <button
                onClick={useCurrentTimestamp}
                className="text-xs px-2 py-1 bg-blue-900/30 hover:bg-blue-900/50 rounded border border-blue-800/50 text-blue-300 transition-colors"
              >
                Use Current
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={timestamp}
              onChange={(e) => {
                setTimestamp(e.target.value);
                if (e.target.value) {
                  convertTimestampToDate(e.target.value);
                } else {
                  setConvertedDate('');
                }
              }}
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-100"
              placeholder={isMilliseconds ? "1699123456789" : "1699123456"}
            />
            <button
              onClick={() => convertTimestampToDate(timestamp)}
              disabled={!timestamp}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Convert
            </button>
          </div>
        </div>

        {convertedDate && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-300">
                Converted Date
              </label>
              <button
                onClick={() => copyToClipboard(convertedDate, 'date')}
                className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
              >
                {copied === 'date' ? (
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
              value={convertedDate}
              readOnly
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg font-mono text-sm resize-none text-gray-100"
              rows={7}
            />
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-800 text-gray-400">OR</span>
        </div>
      </div>

      {/* Date to Timestamp Converter */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Date & Time
            </label>
            <button
              onClick={formatCurrentDate}
              className="text-xs px-2 py-1 bg-blue-900/30 hover:bg-blue-900/50 rounded border border-blue-800/50 text-blue-300 transition-colors"
            >
              Use Current
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => {
                setDateInput(e.target.value);
                if (e.target.value) {
                  convertDateToTimestamp(e.target.value);
                } else {
                  setConvertedTimestamp('');
                }
              }}
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-100"
            />
            <input
              type="text"
              value={dateInput}
              onChange={(e) => {
                setDateInput(e.target.value);
                if (e.target.value) {
                  convertDateToTimestamp(e.target.value);
                } else {
                  setConvertedTimestamp('');
                }
              }}
              placeholder="YYYY-MM-DD HH:MM:SS or ISO format"
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-100"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Supports: YYYY-MM-DD, YYYY-MM-DD HH:MM:SS, ISO 8601 format
          </p>
        </div>

        {convertedTimestamp && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-300">
                Converted Timestamp
              </label>
              <button
                onClick={() => copyToClipboard(convertedTimestamp, 'timestamp')}
                className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
              >
                {copied === 'timestamp' ? (
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
              value={convertedTimestamp}
              readOnly
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg font-mono text-sm resize-none text-gray-100"
              rows={5}
            />
          </div>
        )}
      </div>

      <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
        <p className="text-sm text-blue-300">
          <strong>Tip:</strong> Unix timestamps can be in seconds (10 digits) or milliseconds (13 digits). 
          The tool auto-detects the format. Use the checkbox to specify your preference.
        </p>
      </div>
    </div>
  );
}

