import { useState, useEffect } from "react";
import type { Profile, Variable } from "../lib/parser";

interface ProfileEditorProps {
  name: string | null;
  profile: Profile | null;
  isActive: boolean;
  onSave: (profile: Profile) => void;
}

export function ProfileEditor({ name, profile, isActive, onSave }: ProfileEditorProps) {
  const [description, setDescription] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [variables, setVariables] = useState<Variable[]>([]);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (profile) {
      setDescription(profile.description);
      setTagsStr(profile.tags.join(", "));
      setVariables([...profile.variables]);
      setDirty(false);
    }
  }, [profile, name]);

  if (!name || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a profile to edit
      </div>
    );
  }

  const updateVariable = (index: number, field: "key" | "value", val: string) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: val };
    setVariables(updated);
    setDirty(true);
  };

  const addVariable = () => {
    setVariables([...variables, { key: "", value: "" }]);
    setDirty(true);
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
    setDirty(true);
  };

  const handleSave = () => {
    onSave({
      description,
      tags: tagsStr.split(",").map((t) => t.trim()).filter(Boolean),
      variables: variables.filter((v) => v.key.trim()),
    });
    setDirty(false);
  };

  return (
    <div className="flex-1 flex flex-col p-4 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-3">{name}</h2>
        {isActive && (
          <div className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-1 mb-3">Deactivate this profile to edit</div>
        )}
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
            <input type="text" placeholder="Description" value={description} disabled={isActive} onChange={(e) => { setDescription(e.target.value); setDirty(true); }} className="w-full border border-gray-300 rounded px-2 py-1 text-sm disabled:bg-gray-100 disabled:text-gray-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tags</label>
            <input type="text" placeholder="Tags (comma-separated)" value={tagsStr} disabled={isActive} onChange={(e) => { setTagsStr(e.target.value); setDirty(true); }} className="w-full border border-gray-300 rounded px-2 py-1 text-sm disabled:bg-gray-100 disabled:text-gray-500" />
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">Variables</span>
          {!isActive && <button onClick={addVariable} className="text-sm text-blue-500 hover:text-blue-700">+ Add</button>}
        </div>
        <div className="space-y-1">
          {variables.map((v, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="text" placeholder="KEY" value={v.key} disabled={isActive} onChange={(e) => updateVariable(i, "key", e.target.value)} className="w-1/3 border border-gray-300 rounded px-2 py-1 text-sm font-mono disabled:bg-gray-100 disabled:text-gray-500" />
              <span className="text-gray-400">=</span>
              <input type="text" placeholder="value" value={v.value} disabled={isActive} onChange={(e) => updateVariable(i, "value", e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm font-mono disabled:bg-gray-100 disabled:text-gray-500" />
              {!isActive && <button onClick={() => removeVariable(i)} className="text-red-400 hover:text-red-600 text-sm">×</button>}
            </div>
          ))}
        </div>
      </div>
      {dirty && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <button onClick={handleSave} className="bg-blue-500 text-white rounded px-4 py-1.5 text-sm hover:bg-blue-600">Save</button>
        </div>
      )}
    </div>
  );
}
