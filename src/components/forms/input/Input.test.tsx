import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../test";

import Input from "./Input";

describe("Input", () => {
  it("renders the input", () => {
    render(<Input />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders the label", () => {
    render(<Input label="Username" />);

    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("renders the placeholder", () => {
    render(<Input placeholder="Enter username" />);

    expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
  });

  it("renders helper text", () => {
    render(<Input helperText="Minimum 8 characters" />);

    expect(screen.getByText("Minimum 8 characters")).toBeInTheDocument();
  });

  it("renders error message", () => {
    render(<Input error="Username is required" />);

    expect(screen.getByText("Username is required")).toBeInTheDocument();
  });

  it("does not render helper text when error exists", () => {
    render(<Input helperText="Minimum 8 characters" error="Required" />);

    expect(screen.queryByText("Minimum 8 characters")).not.toBeInTheDocument();

    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("calls onChange when typing", async () => {
    const user = userEvent.setup();

    const handleChange = vi.fn();

    render(<Input onChange={handleChange} />);

    const input = screen.getByRole("textbox");

    await user.type(input, "React");

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue("React");
  });

  it("renders password toggle", () => {
    render(<Input type="password" showPasswordToggle />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();

    render(<Input type="password" showPasswordToggle />);

    const input = screen.getByDisplayValue("") as HTMLInputElement;

    expect(input.type).toBe("password");

    await user.click(screen.getByRole("button"));

    expect(input.type).toBe("text");

    await user.click(screen.getByRole("button"));

    expect(input.type).toBe("password");
  });

  it("renders start adornment", () => {
    render(<Input startAdornment={<span>₹</span>} />);

    expect(screen.getByText("₹")).toBeInTheDocument();
  });

  it("supports disabled state", () => {
    render(<Input disabled />);

    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
