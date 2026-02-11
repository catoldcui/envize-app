import { describe, it, expect } from "vitest";
import { parseProfile, serializeProfile, type Profile } from "./parser";

const SAMPLE = `# @description: My API keys for development
# @tags: ai, api

API_KEY=sk-abc123
API_URL=https://api.example.com
`;

describe("parseProfile", () => {
  it("parses metadata and variables", () => {
    const result = parseProfile(SAMPLE);
    expect(result.description).toBe("My API keys for development");
    expect(result.tags).toEqual(["ai", "api"]);
    expect(result.variables).toEqual([
      { key: "API_KEY", value: "sk-abc123" },
      { key: "API_URL", value: "https://api.example.com" },
    ]);
  });

  it("handles profile with no metadata", () => {
    const result = parseProfile("FOO=bar\nBAZ=qux\n");
    expect(result.description).toBe("");
    expect(result.tags).toEqual([]);
    expect(result.variables).toEqual([
      { key: "FOO", value: "bar" },
      { key: "BAZ", value: "qux" },
    ]);
  });

  it("handles empty profile", () => {
    const result = parseProfile("");
    expect(result.description).toBe("");
    expect(result.tags).toEqual([]);
    expect(result.variables).toEqual([]);
  });

  it("ignores plain comments", () => {
    const result = parseProfile("# just a comment\nFOO=bar\n");
    expect(result.variables).toEqual([{ key: "FOO", value: "bar" }]);
  });

  it("handles values with equals signs", () => {
    const result = parseProfile("URL=https://example.com?a=1&b=2\n");
    expect(result.variables).toEqual([
      { key: "URL", value: "https://example.com?a=1&b=2" },
    ]);
  });
});

describe("serializeProfile", () => {
  it("round-trips a profile", () => {
    const profile: Profile = {
      description: "My API keys",
      tags: ["ai", "api"],
      variables: [
        { key: "API_KEY", value: "sk-abc123" },
        { key: "API_URL", value: "https://api.example.com" },
      ],
    };
    const serialized = serializeProfile(profile);
    expect(serialized).toBe(
      `# @description: My API keys\n# @tags: ai, api\n\nAPI_KEY=sk-abc123\nAPI_URL=https://api.example.com\n`
    );
  });

  it("omits empty metadata", () => {
    const profile: Profile = {
      description: "",
      tags: [],
      variables: [{ key: "FOO", value: "bar" }],
    };
    expect(serializeProfile(profile)).toBe("FOO=bar\n");
  });
});
