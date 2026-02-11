import { useState, useEffect } from "react";
import type { Profile, Variable } from "../lib/parser";

interface ProfileEditorProps {
  name: string | null;
  profile: Profile | null;
  onSave: (profile: Profile) => void;
}

export function ProfileEditor({ name, profile, onSave }: ProfileEditorProps) {
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
        <div className="space-y-2">
          <input type="text" placeholder="Description" value={description} onChange={(e) => { setDescription(e.target.value); setDirty(true); }} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
          <input type="text" placeholder="Tags (comma-separated)" value={tagsStr} onChange={(e) => { setTagsStr(e.target.value); setDirty(true); }} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">Variables</span>
          <button onClick={addVariable} className="text-sm text-blue-500 hover:text-blue-700">+ Add</button>
        </div>
        <div className="space-y-1">
          {variables.map((v, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="text" placeholder="KEY" value={v.key} onChange={(e) => updateVariable(i, "key", e.target.value)} className="w-1/3 border border-gray-300 rounded px-2 py-1 text-sm font-mono" />
              <span className="text-gray-400">=</span>
              <input type="text" placeholder="value" value={v.value} onChange={(e) => updateVariable(i, "value", e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm font-mono" />
              <button onClick={() => removeVariable(i)} className="text-red-400 hover:text-red-600 text-sm">×</button>
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
