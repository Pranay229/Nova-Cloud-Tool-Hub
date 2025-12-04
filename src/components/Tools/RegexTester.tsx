import { useState, useEffect } from 'react';
import { Copy, Check, Info } from 'lucide-react';

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
  groupsObj: Record<string, string>;
}

export function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [replacement, setReplacement] = useState('');
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false,
  });
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [replacedText, setReplacedText] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const commonPatterns = [
    { name: 'Email', pattern: '^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}$' },
    { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
    { name: 'Phone (US)', pattern: '^\\+?1?[-.\\s]?\\(?[0-9]{3}\\)?[-.\\s]?[0-9]{3}[-.\\s]?[0-9]{4}$' },
    { name: 'IPv4', pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$' },
    { name: 'Hex Color', pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' },
    { name: 'Date (YYYY-MM-DD)', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
    { name: 'Time (HH:MM)', pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$' },
    { name: 'Credit Card', pattern: '^\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}$' },
  ];

  useEffect(() => {
    if (pattern && testString) {
      testRegex();
    } else {
      setMatches([]);
      setReplacedText('');
      setError('');
    }
  }, [pattern, testString, flags, replacement]);

  const testRegex = () => {
    setError('');
    setMatches([]);
    setReplacedText('');

    if (!pattern) {
      return;
    }

    try {
      let flagString = '';
      if (flags.global) flagString += 'g';
      if (flags.ignoreCase) flagString += 'i';
      if (flags.multiline) flagString += 'm';
      if (flags.dotAll) flagString += 's';
      if (flags.unicode) flagString += 'u';
      if (flags.sticky) flagString += 'y';

      const regex = new RegExp(pattern, flagString);
      const matchResults: MatchResult[] = [];

      if (flags.global) {
        // Get all matches
        let match: RegExpExecArray | null;
        const regexForMatch = new RegExp(pattern, flagString);
        while ((match = regexForMatch.exec(testString)) !== null) {
          const groups: string[] = [];
          const groupsObj: Record<string, string> = {};

          // Extract numbered groups
          for (let i = 1; i < match.length; i++) {
            if (match[i] !== undefined) {
              groups.push(match[i]);
            }
          }

          // Extract named groups
          if (match.groups) {
            Object.keys(match.groups).forEach((key) => {
              if (match && match.groups) {
                groupsObj[key] = match.groups[key];
              }
            });
          }

          matchResults.push({
            match: match[0],
            index: match.index!,
            groups,
            groupsObj,
          });

          // Prevent infinite loop on zero-length matches
          if (match[0].length === 0) {
            regexForMatch.lastIndex++;
          }
        }
      } else {
        // Get first match only
        const match = regex.exec(testString);
        if (match) {
          const groups: string[] = [];
          const groupsObj: Record<string, string> = {};

          for (let i = 1; i < match.length; i++) {
            if (match[i] !== undefined) {
              groups.push(match[i]);
            }
          }

          if (match.groups) {
            Object.keys(match.groups).forEach((key) => {
              groupsObj[key] = match.groups![key];
            });
          }

          matchResults.push({
            match: match[0],
            index: match.index!,
            groups,
            groupsObj,
          });
        }
      }

      setMatches(matchResults);

      // Test replacement
      if (replacement !== '') {
        try {
          const replaced = testString.replace(regex, replacement);
          setReplacedText(replaced);
        } catch (e) {
          // Replacement might fail for some patterns, ignore
        }
      }
    } catch (e) {
      setError(`Invalid regex: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  const loadPattern = (patternStr: string) => {
    setPattern(patternStr);
  };

  const highlightMatches = (text: string): React.ReactNode[] => {
    if (!pattern || matches.length === 0) {
      return [text];
    }

    try {
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let matchIndex = 0;

      while (matchIndex < matches.length) {
        const match = matches[matchIndex];
        // Add text before match
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        // Add highlighted match
        parts.push(
          <span key={matchIndex} className="bg-yellow-500/30 text-yellow-200 px-0.5 rounded">
            {match.match}
          </span>
        );
        lastIndex = match.index + match.match.length;
        matchIndex++;
      }
      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }
      return parts;
    } catch {
      return [text];
    }
  };

  return (
    <div className="space-y-6">
      {/* Common Patterns */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Common Patterns
        </label>
        <div className="flex flex-wrap gap-2">
          {commonPatterns.map((item, index) => (
            <button
              key={index}
              onClick={() => loadPattern(item.pattern)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 border border-gray-600 transition-colors"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Regex Pattern Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-300">
            Regular Expression Pattern
          </label>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <Info className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <input
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-100"
          placeholder="/pattern/flags or just pattern"
        />
        {showInfo && (
          <div className="mt-2 p-3 bg-blue-900/20 border border-blue-800/50 rounded-lg text-xs text-blue-300">
            <p className="mb-1"><strong>Special Characters:</strong> . * + ? ^ $ | ( ) [ ] { } \</p>
            <p className="mb-1"><strong>Character Classes:</strong> \d (digit), \w (word), \s (space), \D, \W, \S</p>
            <p><strong>Anchors:</strong> ^ (start), $ (end), \b (word boundary)</p>
          </div>
        )}
      </div>

      {/* Flags */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Flags
        </label>
        <div className="flex flex-wrap gap-4">
          {Object.entries(flags).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  setFlags({ ...flags, [key]: e.target.checked })
                }
                className="rounded"
              />
              <span className="font-mono">
                {key === 'global' ? 'g' : key === 'ignoreCase' ? 'i' : key === 'multiline' ? 'm' : key === 'dotAll' ? 's' : key === 'unicode' ? 'u' : 'y'}
              </span>
              <span className="text-gray-500">
                {key === 'global' ? 'Global' : key === 'ignoreCase' ? 'Case-insensitive' : key === 'multiline' ? 'Multiline' : key === 'dotAll' ? 'Dot all' : key === 'unicode' ? 'Unicode' : 'Sticky'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Test String Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Test String
        </label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm text-gray-100 placeholder-gray-500"
          rows={6}
          placeholder="Enter text to test against the regex pattern..."
        />
      </div>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Match Results */}
      {matches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-300">
              Matches Found: {matches.length}
            </h3>
            <button
              onClick={() => copyToClipboard(JSON.stringify(matches, null, 2), 'matches')}
              className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
            >
              {copied === 'matches' ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Copy JSON</span>
                </>
              )}
            </button>
          </div>

          {/* Highlighted Text */}
          <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
            <p className="text-sm text-gray-400 mb-2">Highlighted Matches:</p>
            <div className="font-mono text-sm text-gray-100 whitespace-pre-wrap break-words">
              {highlightMatches(testString)}
            </div>
          </div>

          {/* Match Details */}
          <div className="space-y-2">
            {matches.map((match, index) => (
              <div
                key={index}
                className="p-4 bg-gray-700 rounded-lg border border-gray-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs text-gray-500">Match #{index + 1}</span>
                    <p className="font-mono text-sm text-gray-100 mt-1">{match.match}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(match.match, `match-${index}`)}
                    className="p-1 hover:bg-gray-600 rounded transition-colors"
                  >
                    {copied === `match-${index}` ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>Index: {match.index} - {match.index + match.match.length - 1}</p>
                  {match.groups.length > 0 && (
                    <div>
                      <p className="text-gray-500 mb-1">Groups:</p>
                      {match.groups.map((group, i) => (
                        <p key={i} className="ml-2">
                          ${i + 1}: {group}
                        </p>
                      ))}
                    </div>
                  )}
                  {Object.keys(match.groupsObj).length > 0 && (
                    <div>
                      <p className="text-gray-500 mb-1">Named Groups:</p>
                      {Object.entries(match.groupsObj).map(([key, value]) => (
                        <p key={key} className="ml-2">
                          {key}: {value}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pattern && testString && matches.length === 0 && !error && (
        <div className="p-4 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
          <p className="text-yellow-400 text-sm">No matches found</p>
        </div>
      )}

      {/* Replacement */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Replacement String (optional)
          </label>
          <input
            type="text"
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-100"
            placeholder="$1, $&, ${groupName}, etc."
          />
          <p className="text-xs text-gray-500 mt-1">
            Use $& for full match, $1, $2 for groups, ${'{'}groupName{'}'} for named groups
          </p>
        </div>

        {replacedText && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-300">
                Replaced Text
              </label>
              <button
                onClick={() => copyToClipboard(replacedText, 'replaced')}
                className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
              >
                {copied === 'replaced' ? (
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
              value={replacedText}
              readOnly
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg font-mono text-sm resize-none text-gray-100"
              rows={4}
            />
          </div>
        )}
      </div>
    </div>
  );
}

