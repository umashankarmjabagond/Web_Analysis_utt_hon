import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

import { useWorkflowCanvasInteractions } from "./useWorkflowInteractions";
import { useTemplateExecutionStore } from "../store/templateExecutionStore";

vi.mock(
  "../store/templateExecutionStore",
  () => ({
    useTemplateExecutionStore: vi.fn(),
  }),
);

describe(
  "useWorkflowCanvasInteractions",
  () => {
    const toggleSelectedNode = vi.fn();

    const setNodeDrawerOpen =
      vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it(
      "toggles selected node",
      () => {
        (
          useTemplateExecutionStore as any
        ).mockImplementation(
          (selector: any) =>
            selector({
              selectedNodeIds: [],
              toggleSelectedNode,
              setNodeDrawerOpen,
            }),
        );

        const { result } =
          renderHook(() =>
            useWorkflowCanvasInteractions(),
          );

        result.current.handleNodeSelection(
          "node-1",
          "success",
        );

        expect(
          toggleSelectedNode,
        ).toHaveBeenCalledWith(
          "node-1",
        );
      },
    );

    it(
      "does not open drawer for warning status",
      () => {
        (
          useTemplateExecutionStore as any
        ).mockImplementation(
          (selector: any) =>
            selector({
              selectedNodeIds: [],
              toggleSelectedNode,
              setNodeDrawerOpen,
            }),
        );

        const { result } =
          renderHook(() =>
            useWorkflowCanvasInteractions(),
          );

        result.current.handleNodeSelection(
          "node-1",
          "warning",
        );

        expect(
          toggleSelectedNode,
        ).toHaveBeenCalledWith(
          "node-1",
        );

        expect(
          setNodeDrawerOpen,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "does not open drawer for error status",
      () => {
        (
          useTemplateExecutionStore as any
        ).mockImplementation(
          (selector: any) =>
            selector({
              selectedNodeIds: [],
              toggleSelectedNode,
              setNodeDrawerOpen,
            }),
        );

        const { result } =
          renderHook(() =>
            useWorkflowCanvasInteractions(),
          );

        result.current.handleNodeSelection(
          "node-1",
          "error",
        );

        expect(
          toggleSelectedNode,
        ).toHaveBeenCalledWith(
          "node-1",
        );

        expect(
          setNodeDrawerOpen,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "does not open drawer when node is already selected",
      () => {
        (
          useTemplateExecutionStore as any
        ).mockImplementation(
          (selector: any) =>
            selector({
              selectedNodeIds: [
                "node-1",
              ],
              toggleSelectedNode,
              setNodeDrawerOpen,
            }),
        );

        const { result } =
          renderHook(() =>
            useWorkflowCanvasInteractions(),
          );

        result.current.handleNodeSelection(
          "node-1",
          "success",
        );

        expect(
          toggleSelectedNode,
        ).toHaveBeenCalledWith(
          "node-1",
        );

        expect(
          setNodeDrawerOpen,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "opens drawer for unselected success node",
      () => {
        (
          useTemplateExecutionStore as any
        ).mockImplementation(
          (selector: any) =>
            selector({
              selectedNodeIds: [],
              toggleSelectedNode,
              setNodeDrawerOpen,
            }),
        );

        const { result } =
          renderHook(() =>
            useWorkflowCanvasInteractions(),
          );

        result.current.handleNodeSelection(
          "node-1",
          "success",
        );

        expect(
          toggleSelectedNode,
        ).toHaveBeenCalledWith(
          "node-1",
        );

        expect(
          setNodeDrawerOpen,
        ).toHaveBeenCalledWith(
          true,
        );
      },
    );
  },
);