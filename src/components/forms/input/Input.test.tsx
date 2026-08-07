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

  render(
    <Input
      type="password"
      showPasswordToggle
      data-testid="password-input"
    />,
  );

  const input =
    screen.getByTestId(
      "password-input",
    );

  const button =
    screen.getByRole("button");

  expect(input).toHaveAttribute(
    "type",
    "password",
  );

  await user.click(button);

  expect(input).toHaveAttribute(
    "type",
    "text",
  );
});


  it("renders start adornment", () => {
    render(<Input startAdornment={<span>₹</span>} />);

    expect(screen.getByText("₹")).toBeInTheDocument();
  });

  it("supports disabled state", () => {
    render(<Input disabled />);

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("keeps password type when showPassword is false", () => {
  render(
    <Input
      type="password"
      data-testid="password-input"
    />,
  );

  expect(
    screen.getByTestId("password-input"),
  ).toHaveAttribute(
    "type",
    "password",
  );
});

it("uses text type when input type is text", () => {
  render(
    <Input
      type="text"
      data-testid="text-input"
    />,
  );

  expect(
    screen.getByTestId("text-input"),
  ).toHaveAttribute(
    "type",
    "text",
  );
});

it("changes password input to text after toggle", async () => {
  const user = userEvent.setup();

  render(
    <Input
      type="password"
      showPasswordToggle
      data-testid="password-input"
    />,
  );

  const input =
    screen.getByTestId("password-input");

  const toggleButton =
    screen.getByRole("button");

  expect(input).toHaveAttribute(
    "type",
    "password",
  );

  await user.click(toggleButton);

  expect(input).toHaveAttribute(
    "type",
    "text",
  );
});

it("changes text back to password after second toggle", async () => {
  const user = userEvent.setup();

  render(
    <Input
      type="password"
      showPasswordToggle
      data-testid="password-input"
    />,
  );

  const input =
    screen.getByTestId("password-input");

  const toggleButton =
    screen.getByRole("button");

  await user.click(toggleButton);

  expect(input).toHaveAttribute(
    "type",
    "text",
  );

  await user.click(toggleButton);

  expect(input).toHaveAttribute(
    "type",
    "password",
  );
});

it("does not apply w-full when fullWidth is false", () => {
  const { container } = render(
    <Input
      fullWidth={false}
      data-testid="input"
    />,
  );

  const wrapper = container.firstChild as HTMLElement;

  expect(wrapper).not.toHaveClass("w-full");
});

});
