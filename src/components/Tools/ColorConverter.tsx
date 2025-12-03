import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  rgba: string;
  hsla: string;
}

export function ColorConverter() {
  const [hex, setHex] = useState('#3b82f6');
  const [rgb, setRgb] = useState('rgb(59, 130, 246)');
  const [hsl, setHsl] = useState('hsl(217, 91%, 60%)');
  const [rgba, setRgba] = useState('rgba(59, 130, 246, 1)');
  const [hsla, setHsla] = useState('hsla(217, 91%, 60%, 1)');
  const [alpha, setAlpha] = useState(1);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // Convert HEX to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Convert RGB to HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  // Parse RGB string
  const parseRgb = (rgbStr: string): { r: number; g: number; b: number } | null => {
    const match = rgbStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (match) {
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
      };
    }
    return null;
  };

  // Parse HSL string
  const parseHsl = (hslStr: string): { h: number; s: number; l: number } | null => {
    const match = hslStr.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/i);
    if (match) {
      return {
        h: parseInt(match[1], 10),
        s: parseInt(match[2], 10),
        l: parseInt(match[3], 10),
      };
    }
    return null;
  };

  // Update all formats from HEX
  const updateFromHex = (hexValue: string) => {
    setError('');
    const rgbValue = hexToRgb(hexValue);
    if (rgbValue) {
      const { r, g, b } = rgbValue;
      const hslValue = rgbToHsl(r, g, b);
      setRgb(`rgb(${r}, ${g}, ${b})`);
      setRgba(`rgba(${r}, ${g}, ${b}, ${alpha})`);
      setHsl(`hsl(${hslValue.h}, ${hslValue.s}%, ${hslValue.l}%)`);
      setHsla(`hsla(${hslValue.h}, ${hslValue.s}%, ${hslValue.l}%, ${alpha})`);
    } else {
      setError('Invalid HEX color format');
    }
  };

  // Update all formats from RGB
  const updateFromRgb = (rgbStr: string) => {
    setError('');
    const rgbValue = parseRgb(rgbStr);
    if (rgbValue) {
      const { r, g, b } = rgbValue;
      const hexValue = rgbToHex(r, g, b);
      const hslValue = rgbToHsl(r, g, b);
      setHex(hexValue);
      setRgba(`rgba(${r}, ${g}, ${b}, ${alpha})`);
      setHsl(`hsl(${hslValue.h}, ${hslValue.s}%, ${hslValue.l}%)`);
      setHsla(`hsla(${hslValue.h}, ${hslValue.s}%, ${hslValue.l}%, ${alpha})`);
    } else {
      setError('Invalid RGB color format. Use: rgb(r, g, b)');
    }
  };

  // Update all formats from HSL
  const updateFromHsl = (hslStr: string) => {
    setError('');
    const hslValue = parseHsl(hslStr);
    if (hslValue) {
      const { h, s, l } = hslValue;
      const rgbValue = hslToRgb(h, s, l);
      const hexValue = rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b);
      setHex(hexValue);
      setRgb(`rgb(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b})`);
      setRgba(`rgba(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b}, ${alpha})`);
      setHsla(`hsla(${h}, ${s}%, ${l}%, ${alpha})`);
    } else {
      setError('Invalid HSL color format. Use: hsl(h, s%, l%)');
    }
  };

  // Update alpha channel
  useEffect(() => {
    const rgbValue = parseRgb(rgb);
    const hslValue = parseHsl(hsl);
    if (rgbValue) {
      setRgba(`rgba(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b}, ${alpha})`);
    }
    if (hslValue) {
      setHsla(`hsla(${hslValue.h}, ${hslValue.s}%, ${hslValue.l}%, ${alpha})`);
    }
  }, [alpha, rgb, hsl]);

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  const currentColor = hexToRgb(hex) || { r: 59, g: 130, b: 246 };

  return (
    <div className="space-y-6">
      {/* Color Preview */}
      <div className="flex items-center gap-4">
        <div
          className="w-24 h-24 rounded-lg border-2 border-gray-600 shadow-lg"
          style={{ backgroundColor: hex }}
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-100 mb-2">Color Preview</h3>
          <p className="text-sm text-gray-400">
            RGB: {currentColor.r}, {currentColor.g}, {currentColor.b}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* HEX Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          HEX
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={hex}
            onChange={(e) => {
              setHex(e.target.value);
              updateFromHex(e.target.value);
            }}
            className="w-16 h-10 rounded-lg border border-gray-600 cursor-pointer"
          />
          <input
            type="text"
            value={hex}
            onChange={(e) => {
              setHex(e.target.value);
              updateFromHex(e.target.value);
            }}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-100"
            placeholder="#3b82f6"
          />
          <button
            onClick={() => copyToClipboard(hex, 'hex')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
          >
            {copied === 'hex' ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* RGB Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          RGB
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={rgb}
            onChange={(e) => {
              setRgb(e.target.value);
              updateFromRgb(e.target.value);
            }}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-100"
            placeholder="rgb(59, 130, 246)"
          />
          <button
            onClick={() => copyToClipboard(rgb, 'rgb')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
          >
            {copied === 'rgb' ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* RGBA Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          RGBA
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={rgba}
            readOnly
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg font-mono text-sm text-gray-100"
          />
          <button
            onClick={() => copyToClipboard(rgba, 'rgba')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
          >
            {copied === 'rgba' ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
        <div className="mt-2">
          <label className="block text-xs text-gray-400 mb-1">Alpha: {alpha}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* HSL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          HSL
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={hsl}
            onChange={(e) => {
              setHsl(e.target.value);
              updateFromHsl(e.target.value);
            }}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-100"
            placeholder="hsl(217, 91%, 60%)"
          />
          <button
            onClick={() => copyToClipboard(hsl, 'hsl')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
          >
            {copied === 'hsl' ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* HSLA Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          HSLA
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={hsla}
            readOnly
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg font-mono text-sm text-gray-100"
          />
          <button
            onClick={() => copyToClipboard(hsla, 'hsla')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
          >
            {copied === 'hsla' ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
        <p className="text-sm text-blue-300">
          <strong>Tip:</strong> Use the color picker or enter values in any format. All formats will automatically sync. Adjust the alpha slider to change transparency.
        </p>
      </div>
    </div>
  );
}

