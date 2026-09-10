import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DEFAULT_PREFERENCES } from "../core/preferences";
import { buildDemoModel } from "../demo/data";
import { NetflixShell } from "./NetflixShell";

describe("NetflixShell", () => {
  it("renders the hero and opens and closes details", () => {
    render(<NetflixShell model={buildDemoModel()} preferences={DEFAULT_PREFERENCES} preview />);
    expect(screen.getByRole("heading", { name: "Beyond the Map" })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: "More Info" })[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
