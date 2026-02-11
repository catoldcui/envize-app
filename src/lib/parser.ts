export interface Variable {
  key: string;
  value: string;
}

export interface Profile {
  description: string;
  tags: string[];
  variables: Variable[];
}

export function parseProfile(content: string): Profile {
  const lines = content.split("\n");
  let description = "";
  let tags: string[] = [];
  const variables: Variable[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("# @description:")) {
      description = trimmed.slice("# @description:".length).trim();
    } else if (trimmed.startsWith("# @tags:")) {
      tags = trimmed
        .slice("# @tags:".length)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    } else if (trimmed.startsWith("#") || trimmed === "") {
      continue;
    } else {
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex > 0) {
        variables.push({
          key: trimmed.slice(0, eqIndex),
          value: trimmed.slice(eqIndex + 1),
        });
      }
    }
  }

  return { description, tags, variables };
}

export function serializeProfile(profile: Profile): string {
  const lines: string[] = [];

  if (profile.description) {
    lines.push(`# @description: ${profile.description}`);
  }
  if (profile.tags.length > 0) {
    lines.push(`# @tags: ${profile.tags.join(", ")}`);
  }
  if (lines.length > 0) {
    lines.push("");
  }
  for (const v of profile.variables) {
    lines.push(`${v.key}=${v.value}`);
  }
  lines.push("");

  return lines.join("\n");
}
