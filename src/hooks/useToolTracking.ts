import { useEffect } from 'react';
import { toolUsageService } from '../services/toolUsageService';
import { sessionService } from '../services/sessionService';

export function useToolTracking(toolId: string, toolName: string) {
  useEffect(() => {
    const trackUsage = async () => {
      await toolUsageService.trackToolUsage(toolId, toolName);
      await sessionService.addToolToSession(toolId);
    };

    trackUsage();
  }, [toolId, toolName]);
}
