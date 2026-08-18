import { useReactFlow, useViewport } from "@xyflow/react";
import { ZoomIn, ZoomOut } from "lucide-react";
import Button from "../../../components/forms/button/Button";

export default function ZoomControls() {
  const { zoomIn, zoomOut, zoomTo } = useReactFlow();
  const { zoom } = useViewport();

  const zoomPercentage = Math.round(zoom * 100);

  return (
    <div className="absolute bottom-4 right-4 z-10 flex h-9 overflow-hidden rounded-md border border-[#3A3A3A] bg-accordion-background shadow-lg">
      <Button
        type="button"
        variant="secondary"
        fill="solid"
        size="medium"
        iconOnly
        icon={<ZoomOut size={14} strokeWidth={1.5} />}
        onClick={() => zoomOut()}
        aria-label="Zoom out"
        className="h-full w-10 rounded-none border-0 text-[#D1D1D1] hover:bg-[#3A3A3A]"
      />

      <Button
        type="button"
        variant="secondary"
        fill="solid"
        size="medium"
        onClick={() => zoomTo(1)}
        aria-label="Reset zoom"
        className="h-full min-w-[58px] rounded-none border-none px-2 text-xs font-medium text-[#D1D1D1] hover:bg-[#3A3A3A]"
      >
        {zoomPercentage}%
      </Button>

      <Button
        type="button"
        variant="secondary"
        fill="solid"
        size="medium"
        iconOnly
        icon={<ZoomIn size={14} strokeWidth={1.5} />}
        onClick={() => zoomIn()}
        aria-label="Zoom in"
        className="h-full w-10 rounded-none border-0 text-[#D1D1D1] hover:bg-[#3A3A3A]"
      />
    </div>
  );
}
