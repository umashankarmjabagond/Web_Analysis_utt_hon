import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row w-full">
        <div
          className="w-1/2 py-2 text-center text-[13px] text-foreground-secondary border-l border-r border-b border-border-default
        bg-surface"
        >
          {t("CALCULATED_KPIS_TITLE")}
        </div>
        <div
          className="w-1/2 py-2 text-center text-[13px] text-foreground-secondary border-r border-b border-border-default
        bg-surface"
        >
          {t("CALCULATED_KPIS_ERRORS_TITLE")}
        </div>
      </div>

      <div className="flex flex-row w-full h-full">
        <div className="flex flex-col w-1/2 !h-full px-6 py-4 gap-3 box-border border-l border-b border-border-default bg-surface">
          <span className="font-extrabold text-[12px] leading-4 tracking-[2px] uppercase text-foreground-secondary">
            {t("CALCULATED_KPIS_TITLE")}
          </span>

          <div className="flex flex-col w-1/2 gap-1">
            {kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="flex flex-row justify-between items-center w-full h-6 gap-1"
              >
                <span className="text-[12px] text-foreground">{kpi.name}</span>
                <span className="text-[12px] text-foreground">{kpi.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col w-1/2 px-6 py-4 gap-3 border-r border-b border-l border-border-default bg-surface">
          {errors.length === 0 ? (
            <p className="text-[12px] italic text-foreground-secondary m-0">
              {t("CALCULATED_KPIS_NO_ERRORS")}
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
