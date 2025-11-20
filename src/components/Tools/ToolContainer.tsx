import { ArrowLeft } from 'lucide-react';
import { HashGenerator } from './HashGenerator';
import { UUIDGenerator } from './UUIDGenerator';
import { PasswordGenerator } from './PasswordGenerator';
import { JSONFormatter } from './JSONFormatter';
import { Base64Tool } from './Base64Tool';
import { useToolTracking } from '../../hooks/useToolTracking';

interface ToolContainerProps {
  toolId: string;
  onBack: () => void;
}

const toolTitles: Record<string, string> = {
  hash: 'Hash Generator',
  uuid: 'UUID Generator',
  password: 'Password Generator',
  json: 'JSON Formatter',
  base64: 'Base64 Encoder/Decoder',
  url: 'URL Encoder/Decoder',
  color: 'Color Converter',
  timestamp: 'Timestamp Converter',
  regex: 'Regex Tester',
};

export function ToolContainer({ toolId, onBack }: ToolContainerProps) {
  useToolTracking(toolId, toolTitles[toolId] || 'Tool');
  const renderTool = () => {
    switch (toolId) {
      case 'hash':
        return <HashGenerator />;
      case 'uuid':
        return <UUIDGenerator />;
      case 'password':
        return <PasswordGenerator />;
      case 'json':
        return <JSONFormatter />;
      case 'base64':
        return <Base64Tool />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">This tool is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Tools</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {toolTitles[toolId] || 'Tool'}
          </h1>
          {renderTool()}
        </div>
      </div>
    </div>
  );
}
