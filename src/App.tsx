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
    // Check if the profile actually exists before trying to toggle it
    const profileExists = envize.profiles.some(p => p.name === name);
    if (!profileExists) {
      envize.setError(`Profile "${name}" does not exist and cannot be toggled`);
      return;
    }
    
    const currentActive = envize.status?.active_profiles ?? [];
    const newActive = active
      ? [...currentActive, name]
      : currentActive.filter((n) => n !== name);
    
    try {
      await envize.activateProfiles(newActive);
    } catch (error) {
      // Handle the error by showing it in the UI
      if (error instanceof Error) {
        envize.setError(`Failed to ${active ? 'activate' : 'deactivate'} profile "${name}": ${error.message}`);
      } else {
        envize.setError(`Failed to ${active ? 'activate' : 'deactivate'} profile "${name}"`);
      }
      
      // Revert the active profiles state
      if (envize.status) {
        envize.setStatus({
          ...envize.status,
          active_profiles: currentActive
        });
      }
    }
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
          {envize.error.includes('envize command not found') ? (
            <div>
              <p className="font-medium">envize CLI tool not found</p>
              <p className="mt-1">
                Please install envize from{' '}
                <a href="https://www.npmjs.com/package/envize" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                  npm
                </a>{' '}
                using: <code className="bg-gray-100 px-1 rounded">npm install -g envize</code>
              </p>
            </div>
          ) : (
            envize.error
          )}
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
