import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileEditor } from "./ProfileEditor";
import type { Profile } from "../lib/parser";

const mockProfile: Profile = {
  description: "Dev API keys",
  tags: ["dev", "api"],
  variables: [
    { key: "API_KEY", value: "sk-abc123" },
    { key: "API_URL", value: "https://api.example.com" },
  ],
};

describe("ProfileEditor", () => {
  it("renders profile metadata", () => {
    render(<ProfileEditor name="dev-api" profile={mockProfile} onSave={vi.fn()} />);
    expect(screen.getByDisplayValue("Dev API keys")).toBeInTheDocument();
    expect(screen.getByDisplayValue("dev, api")).toBeInTheDocument();
  });

  it("renders variable rows", () => {
    render(<ProfileEditor name="dev-api" profile={mockProfile} onSave={vi.fn()} />);
    expect(screen.getByDisplayValue("API_KEY")).toBeInTheDocument();
    expect(screen.getByDisplayValue("sk-abc123")).toBeInTheDocument();
    expect(screen.getByDisplayValue("API_URL")).toBeInTheDocument();
  });

  it("shows empty state when no profile selected", () => {
    render(<ProfileEditor name={null} profile={null} onSave={vi.fn()} />);
    expect(screen.getByText(/select a profile/i)).toBeInTheDocument();
  });
});
