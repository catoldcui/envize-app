import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusBar } from "./StatusBar";
import type { EnvizeStatus } from "../types";

const mockStatus: EnvizeStatus = {
  active_profiles: ["dev-api", "local-db"],
  variables: {
    API_KEY: { value: "sk-a****", source: "dev-api" },
    DATABASE_URL: { value: "post****", source: "local-db" },
  },
  applied_at: "2026-02-11T06:56:06.192Z",
};

describe("StatusBar", () => {
  it("shows active profile count when collapsed", () => {
    render(<StatusBar status={mockStatus} />);
    expect(screen.getByText(/2 active/i)).toBeInTheDocument();
  });

  it("expands to show variables on click", async () => {
    render(<StatusBar status={mockStatus} />);
    await userEvent.click(screen.getByText(/2 active/i));
    expect(screen.getByText("API_KEY")).toBeInTheDocument();
    expect(screen.getByText("DATABASE_URL")).toBeInTheDocument();
  });

  it("shows nothing active when no status", () => {
    render(<StatusBar status={null} />);
    expect(screen.getByText(/no active/i)).toBeInTheDocument();
  });
});
