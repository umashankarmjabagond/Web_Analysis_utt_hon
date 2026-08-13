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
    <div className="flex h-full w-full flex-row">
      {/* Calculated KPIs */}
      <div className="box-border flex h-full w-1/2 flex-col gap-3 border-b border-l border-border-default bg-surface px-6 py-4">
        <span className="text-[12px] font-extrabold uppercase leading-4 tracking-[2px] text-foreground-secondary">
          {t("CALCULATED_KPIS_TITLE")}
        </span>

        <div className="flex w-full flex-col gap-1">
          {kpis.map((kpi, index) => (
            <div
              key={`${kpi.name}-${index}`}
              className="flex h-6 w-full flex-row items-center justify-between gap-1"
            >
              <span className="text-[12px] text-foreground">{kpi.name}</span>

              <span className="text-[12px] text-foreground">{kpi.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Errors */}
      <div className="flex h-full w-1/2 flex-col gap-3 border-b border-l border-r border-border-default bg-surface px-6 py-4">
        <span className="text-[12px] font-extrabold uppercase leading-4 tracking-[2px] text-foreground-secondary">
          {t("CALCULATED_KPIS_ERRORS_TITLE")}
        </span>

        {errors.length === 0 ? (
          <p className="m-0 text-[12px] italic text-foreground-secondary">
            {t("CALCULATED_KPIS_NO_ERRORS")}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {errors.map((error, index) => (
              <span
                key={`${error}-${index}`}
                className="text-[12px] text-danger"
              >
                {error}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculatedKpisAndErrors;
