import { useState } from "react";
import type { ProfileSummary, TemplateSummary } from "../types";

interface SidebarProps {
  profiles: ProfileSummary[];
  activeProfiles: string[];
  selectedProfile: string | null;
  onSelectProfile: (name: string) => void;
  onToggleProfile: (name: string, active: boolean) => void;
  onAddProfile: (name: string, template?: string) => void;
  onCopyProfile: (name: string) => void;
  onRenameProfile: (oldName: string, newName: string) => void;
  onDeleteProfile: (name: string) => void;
  templates?: TemplateSummary[];
  onFetchTemplates?: () => Promise<TemplateSummary[]>;
}

export function Sidebar({
  profiles, activeProfiles, selectedProfile, onSelectProfile, onToggleProfile, onAddProfile, onCopyProfile, onRenameProfile, onDeleteProfile, templates = [], onFetchTemplates,
}: SidebarProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newName, setNewName] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState("");

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
              {editingName === p.name ? (
                <input
                  type="text"
                  value={editNameValue}
                  onChange={(e) => setEditNameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && editNameValue.trim() && editNameValue.trim() !== p.name) {
                      onRenameProfile(p.name, editNameValue.trim());
                      setEditingName(null);
                    } else if (e.key === "Escape") {
                      setEditingName(null);
                    }
                  }}
                  onBlur={() => setEditingName(null)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                  className="text-sm border border-blue-400 rounded px-1 py-0 flex-1 min-w-0 mr-2"
                />
              ) : (
                <span className="text-sm truncate">{p.name}</span>
              )}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  aria-label={`Rename ${p.name}`}
                  title={isActive ? "Deactivate profile before renaming" : "Rename profile"}
                  onClick={(e) => { e.stopPropagation(); setEditingName(p.name); setEditNameValue(p.name); }}
                  disabled={isActive}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                >
                  ✎
                </button>
                <button role="switch" aria-checked={isActive} title={isActive ? "Deactivate profile" : "Activate profile"} onClick={(e) => { e.stopPropagation(); onToggleProfile(p.name, !isActive); }} className={`shrink-0 inline-flex h-5 w-9 items-center rounded-full transition-colors ${isActive ? "bg-green-500" : "bg-gray-300"}`}>
                  <span className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${isActive ? "translate-x-[18px]" : "translate-x-[3px]"}`} />
                </button>
              </div>
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
        <button aria-label="Add profile" title="Add new profile" onClick={async () => { if (onFetchTemplates) await onFetchTemplates(); setShowAddMenu(!showAddMenu); setShowConfirmDelete(false); }} className="flex-1 py-2 text-center text-lg hover:bg-gray-100">+</button>
        <button aria-label="Duplicate profile" title={!selectedProfile ? "Select a profile to duplicate" : "Duplicate profile"} onClick={() => { if (selectedProfile) onCopyProfile(selectedProfile); }} disabled={!selectedProfile} className="flex-1 py-2 text-center text-sm hover:bg-gray-100 disabled:opacity-30">⧉</button>
        <button aria-label="Remove profile" title={!selectedProfile ? "Select a profile to delete" : activeProfiles.includes(selectedProfile) ? "Deactivate profile before deleting" : "Delete profile"} onClick={() => { setShowConfirmDelete(!showConfirmDelete); setShowAddMenu(false); }} disabled={!selectedProfile || activeProfiles.includes(selectedProfile)} className="flex-1 py-2 text-center text-lg hover:bg-gray-100 disabled:opacity-30">−</button>
      </div>
    </div>
  );
}
