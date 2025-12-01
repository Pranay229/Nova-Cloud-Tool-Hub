import {
  Hash,
  Key,
  Lock,
  FileJson,
  Binary,
  Link2,
  Palette,
  Clock,
  Code
} from 'lucide-react';
import { UserStats } from './UserStats';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const tools: Tool[] = [
  {
    id: 'hash',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and other hash algorithms',
    icon: Hash,
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/30',
  },
  {
    id: 'uuid',
    name: 'UUID Generator',
    description: 'Generate unique identifiers (UUID v4)',
    icon: Key,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-900/30',
  },
  {
    id: 'password',
    name: 'Password Generator',
    description: 'Create strong, random passwords with custom rules',
    icon: Lock,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/30',
  },
  {
    id: 'json',
    name: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data',
    icon: FileJson,
    color: 'text-green-400',
    bgColor: 'bg-green-900/30',
  },
  {
    id: 'base64',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings',
    icon: Binary,
    color: 'text-orange-400',
    bgColor: 'bg-orange-900/30',
  },
  {
    id: 'url',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URL strings',
    icon: Link2,
    color: 'text-pink-400',
    bgColor: 'bg-pink-900/30',
  },
  {
    id: 'color',
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL color formats',
    icon: Palette,
    color: 'text-red-400',
    bgColor: 'bg-red-900/30',
  },
  {
    id: 'timestamp',
    name: 'Timestamp Converter',
    description: 'Convert Unix timestamps to readable dates',
    icon: Clock,
    color: 'text-teal-400',
    bgColor: 'bg-teal-900/30',
  },
  {
    id: 'regex',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions',
    icon: Code,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-900/30',
  },
];

interface DashboardProps {
  onSelectTool: (toolId: string) => void;
}

export function Dashboard({ onSelectTool }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-100 mb-4">Developer Tools</h1>
          <p className="text-xl text-gray-400">
            Professional utilities to boost your productivity
          </p>
        </div>

        <UserStats />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                className="group p-6 bg-gray-800 rounded-2xl border border-gray-700 hover:border-blue-500 hover:shadow-xl transition-all duration-300 text-left"
              >
                <div className={`w-12 h-12 ${tool.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-gray-700`}>
                  <Icon className={`w-6 h-6 ${tool.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-100 mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {tool.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
