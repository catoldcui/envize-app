import { useState } from "react";
import type { ProfileSummary, TemplateSummary } from "../types";

interface SidebarProps {
  profiles: ProfileSummary[];
  activeProfiles: string[];
  selectedProfile: string | null;
  onSelectProfile: (name: string) => void;
  onToggleProfile: (name: string, active: boolean) => void;
  onAddProfile: (name: string, template?: string) => void;
  onDeleteProfile: (name: string) => void;
  templates?: TemplateSummary[];
  onFetchTemplates?: () => Promise<TemplateSummary[]>;
}

export function Sidebar({
  profiles, activeProfiles, selectedProfile, onSelectProfile, onToggleProfile, onAddProfile, onDeleteProfile, templates = [], onFetchTemplates,
}: SidebarProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newName, setNewName] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleAdd = async (template?: string) => {
    if (template) {
      onAddProfile(template, template);
    } else if (newName.trim()) {
      onAddProfile(newName.trim());
      setNewName("");
    }
    setShowAddMenu(false);
  };

  const handleDelete = () => {
    if (selectedProfile) {
      onDeleteProfile(selectedProfile);
      setShowConfirmDelete(false);
    }
  };

  return (
    <div className="w-64 border-r border-gray-200 flex flex-col h-full bg-gray-50">
      <div className="p-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">Profiles</div>
      <div className="flex-1 overflow-y-auto">
        {profiles.map((p) => {
          const isActive = activeProfiles.includes(p.name);
          const isSelected = selectedProfile === p.name;
          return (
            <div key={p.name} className={`flex items-center justify-between px-3 py-2 cursor-pointer ${isSelected ? "bg-blue-100" : "hover:bg-gray-100"}`} onClick={() => onSelectProfile(p.name)}>
              <span className="text-sm truncate">{p.name}</span>
              <button role="switch" aria-checked={isActive} onClick={(e) => { e.stopPropagation(); onToggleProfile(p.name, !isActive); }} className={`shrink-0 w-9 h-5 rounded-full relative transition-colors ${isActive ? "bg-green-500" : "bg-gray-300"}`}>
                <span className={`pointer-events-none absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          );
        })}
      </div>
      {showAddMenu && (
        <div className="border-t border-gray-200 p-3 bg-white">
          <div className="mb-2">
            <input type="text" placeholder="New profile name" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} className="w-full text-sm border border-gray-300 rounded px-2 py-1" />
            <button onClick={() => handleAdd()} disabled={!newName.trim()} className="mt-1 w-full text-sm bg-blue-500 text-white rounded px-2 py-1 disabled:opacity-50">Create Empty</button>
          </div>
          {templates.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 mb-1">From template:</div>
              {templates.map((t) => (<button key={t.name} onClick={() => handleAdd(t.name)} className="block w-full text-left text-sm px-2 py-1 hover:bg-gray-100 rounded">{t.name}</button>))}
            </div>
          )}
        </div>
      )}
      {showConfirmDelete && selectedProfile && (
        <div className="border-t border-gray-200 p-3 bg-white">
          <p className="text-sm mb-2">Delete <strong>{selectedProfile}</strong>?</p>
          <div className="flex gap-2">
            <button onClick={handleDelete} className="flex-1 text-sm bg-red-500 text-white rounded px-2 py-1">Delete</button>
            <button onClick={() => setShowConfirmDelete(false)} className="flex-1 text-sm border border-gray-300 rounded px-2 py-1">Cancel</button>
          </div>
        </div>
      )}
      <div className="border-t border-gray-200 flex">
        <button aria-label="Add profile" onClick={async () => { if (onFetchTemplates) await onFetchTemplates(); setShowAddMenu(!showAddMenu); setShowConfirmDelete(false); }} className="flex-1 py-2 text-center text-lg hover:bg-gray-100">+</button>
        <button aria-label="Remove profile" onClick={() => { setShowConfirmDelete(!showConfirmDelete); setShowAddMenu(false); }} disabled={!selectedProfile} className="flex-1 py-2 text-center text-lg hover:bg-gray-100 disabled:opacity-30">−</button>
      </div>
    </div>
  );
}
