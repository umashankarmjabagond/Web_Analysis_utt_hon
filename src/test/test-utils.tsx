/* eslint-disable react-refresh/only-export-components */
import { render, type RenderOptions } from "@testing-library/react";
import type { PropsWithChildren, ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";

function AllProviders({ children }: PropsWithChildren) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, {
    wrapper: AllProviders,
    ...options,
  });
}

export * from "@testing-library/react";
export { customRender as render };
