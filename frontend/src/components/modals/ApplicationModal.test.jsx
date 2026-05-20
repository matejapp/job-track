import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ApplicationModal from "./ApplicationModal";

describe("ApplicationModal", () => {
  it("blocks submit and shows schema errors for invalid values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<ApplicationModal open onClose={vi.fn()} onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: /add application/i }));

    expect(
      await screen.findByText(/company name must be at least 2 characters/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/position must be at least 2 characters/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/application link must be a valid http\(s\) url/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/description must be at least 10 characters/i),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits a valid new application form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<ApplicationModal open onClose={vi.fn()} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/company name/i), "OpenAI");
    await user.type(screen.getByLabelText(/position/i), "Frontend Engineer");
    await user.type(
      screen.getByLabelText(/application link/i),
      "https://openai.com/careers",
    );
    await user.type(
      screen.getByLabelText(/notes/i),
      "Applied through careers page.",
    );

    await user.click(screen.getByRole("button", { name: /add application/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          companyName: "OpenAI",
          position: "Frontend Engineer",
          applicationLink: "https://openai.com/careers",
          status: "Applied",
          description: "Applied through careers page.",
        }),
      ),
    );
  });

  it("loads edit values into the form", () => {
    render(
      <ApplicationModal
        open
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        app={{
          companyName: "Linear",
          position: "Product Engineer",
          applicationLink: "https://linear.app/careers",
          status: "Interview",
          description: "Interview loop is scheduled.",
          dateApplied: "2026-05-19T00:00:00Z",
        }}
      />,
    );

    expect(screen.getByLabelText(/company name/i)).toHaveValue("Linear");
    expect(screen.getByLabelText(/position/i)).toHaveValue("Product Engineer");
    expect(screen.getByLabelText(/status/i)).toHaveValue("Interview");
    expect(screen.getByLabelText(/date applied/i)).toHaveValue("2026-05-19");
  });
});
