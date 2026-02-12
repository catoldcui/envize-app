import { useState, useCallback } from "react";
import { Command } from "@tauri-apps/plugin-shell";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import type { ProfileSummary, EnvizeStatus, TemplateSummary } from "../types";

async function runEnvize(...args: string[]): Promise<string> {
  // Use system PATH - this works in development and should work in bundled apps
  // if envize is properly installed and in PATH
  const cmd = Command.create("envize", args);
  const output = await cmd.execute();
  if (output.code !== 0) {
    throw new Error(output.stderr || `envize ${args.join(" ")} failed with exit code ${output.code}`);
  }
  return output.stdout;
}

export function useEnvize() {
  const [profiles, setProfiles] = useState<ProfileSummary[]>([]);
  const [status, setStatus] = useState<EnvizeStatus | null>(null);
  const [templates, setTemplates] = useState<TemplateSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profilesJson, statusJson] = await Promise.all([
        runEnvize("ls", "--json"),
        runEnvize("status", "--json"),
      ]);
      setProfiles(JSON.parse(profilesJson));
      setStatus(JSON.parse(statusJson));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    const json = await runEnvize("templates", "--json");
    const parsed = JSON.parse(json) as TemplateSummary[];
    setTemplates(parsed);
    return parsed;
  }, []);

  const activateProfiles = useCallback(
    async (profileNames: string[]) => {
      if (profileNames.length === 0) return;
      await runEnvize("use", ...profileNames, "--global");
      await refresh();
    },
    [refresh]
  );

  const createProfile = useCallback(
    async (name: string, template?: string) => {
      if (template) {
        await runEnvize("init", "--template", template, "--global");
      } else {
        await runEnvize("create", name, "--global");
      }
      await refresh();
    },
    [refresh]
  );

  const deleteProfile = useCallback(
    async (name: string) => {
      await runEnvize("rm", name);
      await refresh();
    },
    [refresh]
  );

  const readProfileContent = useCallback(async (profilePath: string) => {
    return await readTextFile(profilePath);
  }, []);

  const writeProfileContent = useCallback(
    async (profilePath: string, content: string) => {
      await writeTextFile(profilePath, content);
      await refresh();
    },
    [refresh]
  );

  return {
    profiles,
    status,
    templates,
    loading,
    error,
    setError,
    setStatus,
    refresh,
    fetchTemplates,
    activateProfiles,
    createProfile,
    deleteProfile,
    readProfileContent,
    writeProfileContent,
  };
}
