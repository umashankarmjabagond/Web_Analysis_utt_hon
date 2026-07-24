import React from "react";
import type {
  CalculatedKpisAndErrorsProps,
  KpiItem,
} from "../../types/workFlowTypes";

const MOCK_KPIS: KpiItem[] = [
  { name: "KPI 1", value: "124.5" },
  { name: "KPI 2", value: "87.2" },
  { name: "KPI 3", value: "56.9" },
  { name: "KPI 4", value: "210.0" },
  { name: "KPI 5", value: "3.14" },
  { name: "KPI 6", value: "98.6" },
  { name: "KPI 7", value: "42.0" },
  { name: "KPI 8", value: "77.7" },
];

const MOCK_ERRORS: string[] = [];

const CalculatedKpisAndErrors: React.FC<CalculatedKpisAndErrorsProps> = ({
  kpis = MOCK_KPIS,
  errors = MOCK_ERRORS,
}) => {
  return (
    <div className="flex flex-col w-full h-full bg-panel-bg border border-border-1">
      <div className="flex flex-row w-full border-b border-border-1">
        <div className="w-1/2 py-2 text-center text-[13px] text-text-accent border-r border-border-1">
          Calculated KPIs
        </div>
        <div className="w-1/2 py-2 text-center text-[13px] text-text-accent">
          Errors
        </div>
      </div>

      <div className="flex flex-row w-full h-full">
        <div className="flex flex-col w-1/2 !h-full px-6 py-4 gap-3 border-r border-border-1 box-border">
          <span className="font-extrabold text-[12px] leading-4 tracking-[2px] uppercase text-text-accent">
            Calculated KPIs
          </span>
          <div className="flex flex-col w-1/2 gap-1">
            {kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="flex flex-row justify-between items-center w-full h-6 gap-1"
              >
                <span className="text-[12px] text-text-accent">{kpi.name}</span>
                <span className="text-[12px] text-text-accent">
                  {kpi.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col w-1/2 px-6 py-4 gap-3">
          {errors.length === 0 ? (
            <p className="text-[12px] italic text-text-disabled m-0">
              No errors found
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {errors.map((err, idx) => (
                <span key={idx} className="text-[12px] text-danger">
                  {err}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculatedKpisAndErrors;
