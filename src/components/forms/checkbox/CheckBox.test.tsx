import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "../../../test";

import Checkbox from "./CheckBox";

vi.mock("lucide-react", () => ({
  Check: () => (
    <span data-testid="check-icon">
      Check
    </span>
  ),
}));

describe("Checkbox", () => {
  it("renders checkbox", () => {
    render(<Checkbox checked={false} />);

    expect(
      screen.getByRole("checkbox"),
    ).toBeInTheDocument();
  });

  it("renders unchecked by default", () => {
    render(<Checkbox checked={false} />);

    expect(
      screen.getByRole("checkbox"),
    ).not.toBeChecked();
  });

  it("renders checked checkbox", () => {
    render(<Checkbox checked />);

    expect(
      screen.getByRole("checkbox"),
    ).toBeChecked();
  });

  it("renders label", () => {
    render(
  <Checkbox
    checked={false}
    label="Accept Terms"
  />,
);

    expect(
      screen.getByText("Accept Terms"),
    ).toBeInTheDocument();
  });

  it("does not render label when not provided", () => {
    render(<Checkbox checked={false} />);

    expect(
      screen.queryByText("Accept Terms"),
    ).not.toBeInTheDocument();
  });

  it("renders check icon", () => {
    render(<Checkbox checked={false} />);

    expect(
      screen.getByTestId("check-icon"),
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
  <Checkbox
    checked={false}
    className="custom-class"
  />,
);


    expect(
      document.querySelector(
        ".custom-class",
      ),
    ).toBeInTheDocument();
  });

//   it("supports disabled state", () => {
//     render(<Checkbox disabled />);

//     expect(
//       screen.getByRole("checkbox"),
//     ).toBeDisabled();
//   });

  it("calls onChange handler", () => {
    const handleChange = vi.fn();

    render(
  <Checkbox
    checked={false}
    onChange={handleChange}
  />,
);

    fireEvent.click(
      screen.getByRole("checkbox"),
    );

    expect(
      handleChange,
    ).toHaveBeenCalledTimes(1);
  });

  it("applies custom size to input", () => {
   render(
  <Checkbox
    checked={false}
    size={24}
  />,
);

    const checkbox =
      screen.getByRole("checkbox");

    expect(
      checkbox,
    ).toHaveStyle({
      width: "24px",
      height: "24px",
    });
  });

  it("applies default size", () => {
    render(<Checkbox checked={false} />);

    const checkbox =
      screen.getByRole("checkbox");

    expect(
      checkbox,
    ).toHaveStyle({
      width: "16px",
      height: "16px",
    });
  });

  it("accepts additional props", () => {
    render(
      <Checkbox
        checked={false}
        name="agreement"
        data-testid="agreement-checkbox"
      />,
    );

    expect(
      screen.getByTestId(
        "agreement-checkbox",
      ),
    ).toHaveAttribute(
      "name",
      "agreement",
    );
  });

//   it("renders checked and disabled together", () => {
//     render(
//       <Checkbox
//         checked
//         disabled
//       />,
//     );

//     const checkbox =
//       screen.getByRole("checkbox");

//     expect(
//       checkbox,
//     ).toBeChecked();

//     expect(
//       checkbox,
//     ).toBeDisabled();
//   });

  it("renders label with checked state", () => {
    render(
      <Checkbox
        checked
        label="Enabled"
      />,
    );

    expect(
      screen.getByText("Enabled"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("checkbox"),
    ).toBeChecked();
  });
});