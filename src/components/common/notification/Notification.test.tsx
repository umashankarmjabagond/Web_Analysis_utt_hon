import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../test";

import Notification from "./Notification";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        SUCCESS: "Success",
        FAILURE: "Failure",
        WARNING: "Warning",
        INFO: "Info",
      };

      return translations[key] ?? key;
    },
  }),
}));

describe("Notification", () => {
  it("renders success notification", () => {
    render(
      <Notification
        type="success"
        message="Operation completed successfully"
      />,
    );

    expect(screen.getAllByText("Success")).toHaveLength(2);
    expect(
      screen.getByText("Operation completed successfully"),
    ).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(
      <Notification
        type="success"
        title="Saved Successfully"
        message="Changes have been saved"
      />,
    );

    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("Saved Successfully")).toBeInTheDocument();
    expect(screen.getByText("Changes have been saved")).toBeInTheDocument();
  });

  it("renders default warning title", () => {
    render(<Notification type="warning" message="Low battery" />);

    expect(screen.getAllByText("Warning")).toHaveLength(2);
    expect(screen.getByText("Low battery")).toBeInTheDocument();
  });

  it("renders failure notification", () => {
    render(<Notification type="danger" message="Something went wrong" />);

    expect(screen.getAllByText("Failure")).toHaveLength(2);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders info notification", () => {
    render(<Notification type="info" message="Application updated" />);

    expect(screen.getAllByText("Info")).toHaveLength(2);
    expect(screen.getByText("Application updated")).toBeInTheDocument();
  });

  it("renders warning notification", () => {
    render(<Notification type="warning" message="Disk space is low" />);

    expect(screen.getAllByText("Warning")).toHaveLength(2);
    expect(screen.getByText("Disk space is low")).toBeInTheDocument();
  });

  it("calls onClose when close icon is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { container } = render(
      <Notification type="success" message="Completed" onClose={onClose} />,
    );

    const closeIcon = container.querySelector(".lucide-x");

    expect(closeIcon).toBeTruthy();

    await user.click(closeIcon as HTMLElement);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("applies numeric width", () => {
    const { container } = render(
      <Notification type="success" message="Test notification" width={500} />,
    );

    expect(container.firstChild).toHaveStyle({
      width: "500px",
    });
  });

  it("applies string width", () => {
    const { container } = render(
      <Notification type="success" message="Test notification" width="100%" />,
    );

    expect(container.firstChild).toHaveStyle({
      width: "100%",
    });
  });

  it("uses default width", () => {
    const { container } = render(
      <Notification type="success" message="Test notification" />,
    );

    expect(container.firstChild).toHaveStyle({
      width: "400px",
    });
  });
});
