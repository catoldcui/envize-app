import { useEffect, useState } from "react";
import { useEnvize } from "./hooks/useEnvize";
import { parseProfile, serializeProfile } from "./lib/parser";
import { Sidebar } from "./components/Sidebar";
import { ProfileEditor } from "./components/ProfileEditor";
import { StatusBar } from "./components/StatusBar";
import type { Profile } from "./lib/parser";

function App() {
  const envize = useEnvize();
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  useEffect(() => {
    envize.refresh();
  }, []);

  useEffect(() => {
    const onFocus = () => envize.refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [envize.refresh]);

  const handleSelectProfile = async (name: string) => {
    setSelectedName(name);
    const profile = envize.profiles.find((p) => p.name === name);
    if (profile) {
      const content = await envize.readProfileContent(profile.path);
      setEditingProfile(parseProfile(content));
    }
  };

  const handleToggleProfile = async (name: string, active: boolean) => {
    const currentActive = envize.status?.active_profiles ?? [];
    const newActive = active
      ? [...currentActive, name]
      : currentActive.filter((n) => n !== name);
    await envize.activateProfiles(newActive);
  };

  const handleSave = async (profile: Profile) => {
    const p = envize.profiles.find((p) => p.name === selectedName);
    if (p) {
      await envize.writeProfileContent(p.path, serializeProfile(profile));
      setEditingProfile(profile);
    }
  };

  const handleAddProfile = async (name: string, template?: string) => {
    await envize.createProfile(name, template);
    setSelectedName(name);
  };

  const handleDeleteProfile = async (name: string) => {
    await envize.deleteProfile(name);
    if (selectedName === name) {
      setSelectedName(null);
      setEditingProfile(null);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {envize.error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 text-sm">
          {envize.error}
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          profiles={envize.profiles}
          activeProfiles={envize.status?.active_profiles ?? []}
          selectedProfile={selectedName}
          onSelectProfile={handleSelectProfile}
          onToggleProfile={handleToggleProfile}
          onAddProfile={handleAddProfile}
          onDeleteProfile={handleDeleteProfile}
          templates={envize.templates}
          onFetchTemplates={envize.fetchTemplates}
        />
        <ProfileEditor
          name={selectedName}
          profile={editingProfile}
          onSave={handleSave}
        />
      </div>
      <StatusBar status={envize.status} />
    </div>
  );
}

export default App;
