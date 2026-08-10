import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test";

import Properties from "./Properties";

vi.mock("../../components/forms/button/Button", () => ({
  default: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("../../components/forms/iconbutton/IconButton", () => ({
  default: ({
    icon,
  }: {
    icon: React.ReactNode;
  }) => (
    <button data-testid="icon-button">
      {icon}
    </button>
  ),
}));

vi.mock("../../components/forms/input/Input", () => ({
  default: ({
    label,
    value,
    onChange,
  }: {
    label?: string;
    value?: string;
    onChange?: (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => void;
  }) => (
    <input
      aria-label={label}
      value={value}
      onChange={onChange}
    />
  ),
}));

vi.mock("../../components/forms/select/Select", () => ({
  default: ({
    value,
    options,
    onChange,
  }: {
    value?: string;
    options?: {
      label: string;
      value: string;
    }[];
    onChange?: (
      e: React.ChangeEvent<HTMLSelectElement>,
    ) => void;
  }) => (
    <select
      aria-label="Reference Column"
      value={value}
      onChange={onChange}
    >
      {options?.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock("../../components/forms/textarea/TextArea", () => ({
  default: ({
    label,
    value,
    onChange,
  }: {
    label?: string;
    value?: string;
    onChange?: (
      e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => void;
  }) => (
    <textarea
      aria-label={label}
      value={value}
      onChange={onChange}
    />
  ),
}));

describe("Properties", () => {
  it("renders page title", () => {
    render(<Properties />);

    expect(
      screen.getByText(
        "Data Preprocessing Wizard",
      ),
    ).toBeInTheDocument();
  });

  it("renders header buttons", () => {
    render(<Properties />);

    expect(
      screen.getByText("Help"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Apply To All"),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("Save"),
    ).toHaveLength(2);
  });

  it("renders section headings", () => {
    render(<Properties />);

    expect(
      screen.getByText("Threshold"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Expression"),
    ).toBeInTheDocument();
  });

  it("renders all column options", () => {
    render(<Properties />);

    expect(
      screen.getAllByText(
        "01-LC0524.MODE",
      ).length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText(
        "01-LC0524.OP",
      ).length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText(
        "01-LC0524.PV",
      ).length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText(
        "01-LC0524.SP",
      ).length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText(
        "01-LC0524.STATUS",
      ).length,
    ).toBeGreaterThan(0);
  });

  it("renders default threshold values", () => {
    render(<Properties />);

    expect(
      screen.getByLabelText(
        "Warning Threshold %",
      ),
    ).toHaveValue("10");

    expect(
      screen.getByLabelText(
        "Abort Threshold %",
      ),
    ).toHaveValue("20");
  });

  it("updates warning threshold", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const input =
      screen.getByLabelText(
        "Warning Threshold %",
      );

    await user.clear(input);
    await user.type(input, "15");

    expect(input).toHaveValue("15");
  });

  it("updates abort threshold", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const input =
      screen.getByLabelText(
        "Abort Threshold %",
      );

    await user.clear(input);
    await user.type(input, "25");

    expect(input).toHaveValue("25");
  });

  it("updates reference column", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const select =
      screen.getByLabelText(
        "Reference Column",
      );

    await user.selectOptions(
      select,
      "pv",
    );

    expect(select).toHaveValue("pv");
  });

  it("updates bad data expression", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const textarea =
      screen.getByLabelText(
        "Bad Data Expression",
      );

    await user.type(
      textarea,
      "bad data formula",
    );

    expect(textarea).toHaveValue(
      "bad data formula",
    );
  });

  it("updates replacement expression", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const textarea =
      screen.getByLabelText(
        "Replacement Expression",
      );

    await user.type(
      textarea,
      "replacement formula",
    );

    expect(textarea).toHaveValue(
      "replacement formula",
    );
  });

  it("changes selected column from left panel", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const pvButtons =
      screen.getAllByText(
        "01-LC0524.PV",
      );

    await user.click(pvButtons[0]);

    expect(
      screen.getByLabelText(
        "Reference Column",
      ),
    ).toHaveValue("pv");
  });

  it("updates entire form", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    await user.clear(
      screen.getByLabelText(
        "Warning Threshold %",
      ),
    );

    await user.type(
      screen.getByLabelText(
        "Warning Threshold %",
      ),
      "50",
    );

    await user.clear(
      screen.getByLabelText(
        "Abort Threshold %",
      ),
    );

    await user.type(
      screen.getByLabelText(
        "Abort Threshold %",
      ),
      "80",
    );

    await user.selectOptions(
      screen.getByLabelText(
        "Reference Column",
      ),
      "status",
    );

    await user.type(
      screen.getByLabelText(
        "Bad Data Expression",
      ),
      "bad expression",
    );

    await user.type(
      screen.getByLabelText(
        "Replacement Expression",
      ),
      "replacement expression",
    );

    expect(
      screen.getByLabelText(
        "Warning Threshold %",
      ),
    ).toHaveValue("50");

    expect(
      screen.getByLabelText(
        "Abort Threshold %",
      ),
    ).toHaveValue("80");

    expect(
      screen.getByLabelText(
        "Reference Column",
      ),
    ).toHaveValue("status");
  });

  it("clicks help button", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    await user.click(
      screen.getByRole("button", {
        name: "Help",
      }),
    );
  });

  it("clicks apply to all button", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    await user.click(
      screen.getByRole("button", {
        name: "Apply To All",
      }),
    );
  });

  it("clicks both save buttons", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const saveButtons =
      screen.getAllByText("Save");

    await user.click(saveButtons[0]);
    await user.click(saveButtons[1]);
  });

  it("renders footer buttons", () => {
    render(<Properties />);

    expect(
      screen.getByText("Cancel"),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("Save"),
    ).toHaveLength(2);
  });

  it("renders refresh icon buttons", () => {
    render(<Properties />);

    expect(
      screen.getAllByTestId(
        "icon-button",
      ),
    ).toHaveLength(2);
  });
});