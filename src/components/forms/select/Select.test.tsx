import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";

import { render, screen } from "../../../test";

import Select from "./Select";

describe("Select", () => {
  const options = [
    {
      label: "Option 1",
      value: "option1",
    },
    {
      label: "Option 2",
      value: "option2",
    },
  ];

  it("renders select element", () => {
    render(
      <Select options={options} />,
    );

    expect(
      screen.getByRole("combobox"),
    ).toBeInTheDocument();
  });

  it("renders label", () => {
    render(
      <Select
        label="Country"
        options={options}
      />,
    );

    expect(
      screen.getByText("Country"),
    ).toBeInTheDocument();
  });

  it("does not render label when not provided", () => {
    render(
      <Select options={options} />,
    );

    expect(
      screen.queryByText("Country"),
    ).not.toBeInTheDocument();
  });

  it("renders placeholder option", () => {
    render(
      <Select
        options={options}
        placeHolder="Select Country"
      />,
    );

    expect(
      screen.getByText("Select Country"),
    ).toBeInTheDocument();
  });

  it("renders all options", () => {
    render(
      <Select options={options} />,
    );

    expect(
      screen.getByText("Option 1"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Option 2"),
    ).toBeInTheDocument();
  });

  it("allows option selection", async () => {
    const user = userEvent.setup();

    render(
      <Select options={options} />,
    );

    const select =
      screen.getByRole("combobox");

    await user.selectOptions(
      select,
      "option2",
    );

    expect(
      select,
    ).toHaveValue("option2");
  });

  it("renders helper text", () => {
    render(
      <Select
        options={options}
        helperText="Choose an option"
      />,
    );

    expect(
      screen.getByText(
        "Choose an option",
      ),
    ).toBeInTheDocument();
  });

  it("does not render helper text when error exists", () => {
    render(
      <Select
        options={options}
        helperText="Choose option"
        error="Required field"
      />,
    );

    expect(
      screen.queryByText(
        "Choose option",
      ),
    ).not.toBeInTheDocument();
  });

  it("renders error text", () => {
    render(
      <Select
        options={options}
        error="Required field"
      />,
    );

    expect(
      screen.getByText(
        "Required field",
      ),
    ).toBeInTheDocument();
  });

  it("applies error variant", () => {
  render(
    <Select
      options={options}
      error="Required field"
    />,
  );

  expect(
    screen.getByRole("combobox"),
  ).toHaveClass(
    "border-select-error-border",
  );
});

  it("applies default variant when no error", () => {
  render(
    <Select options={options} />,
  );

  expect(
    screen.getByRole("combobox"),
  ).toHaveClass(
    "border-select-border",
  );
});

  it("applies full width", () => {
    const { container } = render(
      <Select
        options={options}
        fullWidth
      />,
    );

    expect(
      container.querySelector(".w-full"),
    ).toBeInTheDocument();
  });

  it("renders without full width by default", () => {
  render(
    <Select options={options} />,
  );

  expect(
    screen.getByRole("combobox"),
  ).toHaveClass("w-auto");
});

  it("applies custom className", () => {
    render(
      <Select
        options={options}
        className="custom-class"
      />,
    );

    expect(
      screen.getByRole("combobox"),
    ).toHaveClass("custom-class");
  });

  it("renders empty options array", () => {
    render(
      <Select options={[]} />,
    );

    expect(
      screen.getByRole("combobox"),
    ).toBeInTheDocument();
  });

  it("passes additional props", () => {
    render(
      <Select
        options={options}
        data-testid="custom-select"
      />,
    );

    expect(
      screen.getByTestId(
        "custom-select",
      ),
    ).toBeInTheDocument();
  });

  it("renders placeholder and options together", () => {
    render(
      <Select
        options={options}
        placeHolder="Select Value"
      />,
    );

    expect(
      screen.getByText("Select Value"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Option 1"),
    ).toBeInTheDocument();
  });
});