import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sidebar } from "./Sidebar";
import type { ProfileSummary } from "../types";

const mockProfiles: ProfileSummary[] = [
  { name: "dev-api", path: "/home/user/.envize/profiles/dev-api.env", isLocal: false, description: "Dev API keys", tags: ["dev"], variableCount: 3 },
  { name: "staging", path: "/home/user/.envize/profiles/staging.env", isLocal: false, description: "Staging config", tags: ["staging"], variableCount: 2 },
];

describe("Sidebar", () => {
  it("renders profile names", () => {
    render(<Sidebar profiles={mockProfiles} activeProfiles={[]} selectedProfile={null} onSelectProfile={vi.fn()} onToggleProfile={vi.fn()} onAddProfile={vi.fn()} onDeleteProfile={vi.fn()} />);
    expect(screen.getByText("dev-api")).toBeInTheDocument();
    expect(screen.getByText("staging")).toBeInTheDocument();
  });

  it("highlights active profiles", () => {
    render(<Sidebar profiles={mockProfiles} activeProfiles={["dev-api"]} selectedProfile={null} onSelectProfile={vi.fn()} onToggleProfile={vi.fn()} onAddProfile={vi.fn()} onDeleteProfile={vi.fn()} />);
    const toggles = screen.getAllByRole("switch");
    expect(toggles[0]).toBeChecked();
    expect(toggles[1]).not.toBeChecked();
  });

  it("calls onSelectProfile when clicking a profile", async () => {
    const onSelect = vi.fn();
    render(<Sidebar profiles={mockProfiles} activeProfiles={[]} selectedProfile={null} onSelectProfile={onSelect} onToggleProfile={vi.fn()} onAddProfile={vi.fn()} onDeleteProfile={vi.fn()} />);
    await userEvent.click(screen.getByText("dev-api"));
    expect(onSelect).toHaveBeenCalledWith("dev-api");
  });

  it("renders + and - buttons", () => {
    render(<Sidebar profiles={mockProfiles} activeProfiles={[]} selectedProfile={null} onSelectProfile={vi.fn()} onToggleProfile={vi.fn()} onAddProfile={vi.fn()} onDeleteProfile={vi.fn()} />);
    expect(screen.getByLabelText("Add profile")).toBeInTheDocument();
    expect(screen.getByLabelText("Remove profile")).toBeInTheDocument();
  });
});
