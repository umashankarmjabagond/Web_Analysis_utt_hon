import { useState } from "react";
import { CircleHelp, File, RefreshCcw, Trash2 } from "lucide-react";

import Dialog from "../../components/common/dialogue/Dialog";
import Button from "../../components/forms/button/Button";
import Input from "../../components/forms/input/Input";

interface ProjectAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const projects = [
  "Analyzer",
  "CO2",
  "FRN1",
  "HDS",
  "Instrument",
  "ISOM",
  "O2",
  "PBG1",
  "PBG2",
  "PFSPLIT",
  "Positioner",
  "Selector",
  "STL1",
];

const ProjectAnalysisDialog = ({
  isOpen,
  onClose,
}: ProjectAnalysisDialogProps) => {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [isNext, setIsNext] = useState<boolean>(false);
  const iconButtonClass = "!h-8 !w-8 !min-w-8 !p-0 !gap-0";

  const handleNextOrFinish = () => {
    if (!isNext) {
      setIsNext(true);
      return;
    }
    onClose();
  };

  const handleBack = () => {
    setIsNext(!isNext);
  };

  return (
    <Dialog
      isOpen={isOpen}
      title="Project and Analysis"
      width={900}
      onClose={onClose}
    >
      <div className="dark flex h-[520px] flex-col">
        <div className="flex flex-1 gap-8 overflow-hidden">
          {/* Left Panel */}
          <div className="flex w-[348px] flex-col rounded-[5px] bg-[var(--color-button-text-primary)]">
            {/* Header */}
            <div className="px-3 pt-3 pb-2">
              <p className="mb-3 text-xs font-medium text-[var(--color-text-primary)]">
                Choose a project
              </p>

              <div className="mb-2 flex items-center gap-2">
                <Button size="small" className="!h-8 !w-16">
                  New
                </Button>

                {isNext && (
                  <>
                    <Button size="small" className="!h-8 !w-16">
                      Clone
                    </Button>

                    <Button
                      variant="secondary"
                      size="small"
                      className={iconButtonClass}
                      icon={<File size={15} strokeWidth={1.5} />}
                    />
                  </>
                )}

                <Button
                  size="small"
                  className={iconButtonClass}
                  icon={<Trash2 size={15} strokeWidth={1.5} />}
                  disabled={!isNext}
                />

                <Button
                  size="small"
                  className={iconButtonClass}
                  icon={<RefreshCcw size={15} strokeWidth={1.5} />}
                />
              </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-3 px-3 pb-3">
                {!isNext &&
                  projects.map((project) => (
                    <label
                      key={project}
                      className="flex cursor-pointer items-center gap-3 py-[2px] text-[15px] text-[var(--color-text-primary)]"
                    >
                      <input
                        type="radio"
                        name="project"
                        checked={selectedProject === project}
                        onChange={() => setSelectedProject(project)}
                        className="h-[14px] w-[14px] cursor-pointer accent-[var(--color-primary)]"
                      />

                      <span>{project}</span>
                    </label>
                  ))}
                {isNext && (
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="project"
                      checked
                      className="h-[14px] w-[14px] cursor-pointer accent-[var(--color-primary)]"
                    />

                    <span>{selectedProject}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex flex-1">
            <div className="w-[348px] space-y-5">
              {/* Server */}
              <div>
                <Input label="Server" placeholder="Input text" />
              </div>

              {/* Checkbox */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-[var(--color-primary)]"
                />
                Check out this analysis
              </label>

              {/* Description */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  rows={4}
                  placeholder="Multiple lines of text go here..."
                  className="w-full resize-none rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-transparent p-3 outline-none transition focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Created By */}
              <div>
                <Input label="Created by" placeholder="cpmdc1\\cpmservice" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            size="small"
            variant="secondary"
            icon={<CircleHelp size={16} strokeWidth={1.5} />}
          >
            Help
          </Button>

          <div className="flex gap-2">
            <Button
              size="small"
              variant="secondary"
              disabled={!isNext}
              onClick={() => handleBack()}
            >
              Back
            </Button>

            <Button
              variant="primary"
              size="small"
              onClick={() => handleNextOrFinish()}
              disabled={!selectedProject}
            >
              {!isNext ? "Next" : "Finish"}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProjectAnalysisDialog;
