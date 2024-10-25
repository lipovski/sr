import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import App from "./App";

describe("Scoreboard", () => {
  it("renders app", () => {
    render(<App />);
    expect(screen.getByTestId("app")).toBeTruthy();
  });
});
