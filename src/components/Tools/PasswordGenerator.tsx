import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

export function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      setPassword('Please select at least one character type');
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }

    setPassword(result);
  };

  const copyToClipboard = () => {
    if (password && !password.includes('Please select')) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStrength = () => {
    if (!password || password.includes('Please select')) return null;

    let strength = 0;
    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (strength <= 4) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const strength = getStrength();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password Length: {length}
        </label>
        <input
          type="range"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full"
          min="8"
          max="64"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>8</span>
          <span>64</span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-700">Include Uppercase (A-Z)</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-700">Include Lowercase (a-z)</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-700">Include Numbers (0-9)</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-700">Include Symbols (!@#$%...)</span>
        </label>
      </div>

      <button
        onClick={generatePassword}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-5 h-5" />
        Generate Password
      </button>

      {password && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-900">Generated Password</span>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
            <p className="text-lg font-mono text-gray-700 break-all">{password}</p>
          </div>

          {strength && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Password Strength</span>
                <span className={`text-sm font-semibold ${
                  strength.label === 'Weak' ? 'text-red-600' :
                  strength.label === 'Medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {strength.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${strength.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: strength.width }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
