import "@xyflow/react/dist/style.css";

import { ReactFlowProvider } from "@xyflow/react";

import Canvas from "./components/Canvas";
import JsonViewer from "./components/JsonViewer";

export default function WorkflowBuilder() {
  return (
    <ReactFlowProvider>
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Canvas />
          <JsonViewer />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
