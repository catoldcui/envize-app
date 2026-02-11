import { useState } from "react";
import type { EnvizeStatus } from "../types";

interface StatusBarProps {
  status: EnvizeStatus | null;
}

export function StatusBar({ status }: StatusBarProps) {
  const [expanded, setExpanded] = useState(false);
  const activeCount = status?.active_profiles.length ?? 0;
  const variables = status ? Object.entries(status.variables) : [];

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <button onClick={() => setExpanded(!expanded)} className="w-full px-4 py-2 flex items-center justify-between text-sm hover:bg-gray-100">
        <span>{activeCount > 0 ? `${activeCount} active profile${activeCount > 1 ? "s" : ""}` : "No active profiles"}</span>
        <span className="text-gray-400">{expanded ? "▼" : "▶"}</span>
      </button>
      {expanded && variables.length > 0 && (
        <div className="px-4 pb-3 max-h-48 overflow-y-auto">
          <table className="w-full text-sm font-mono">
            <tbody>
              {variables.map(([key, { value, source }]) => (
                <tr key={key} className="border-t border-gray-100">
                  <td className="py-1 pr-3 font-medium">{key}</td>
                  <td className="py-1 pr-3 text-gray-600">{value}</td>
                  <td className="py-1 text-gray-400 text-xs">{source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
