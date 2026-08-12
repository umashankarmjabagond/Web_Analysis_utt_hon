import type { ReactNode } from "react";
import type { SpreadsheetProps } from "../../types/commonTypes";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/utils";

type CellValue = string | number | boolean | null | undefined | object;

const getExcelColumn = (index: number): string => {
  let column = "";
  let dividend = index + 1;

  while (dividend > 0) {
    const modulo = (dividend - 1) % 26;
    column = String.fromCharCode(65 + modulo) + column;
    dividend = Math.floor((dividend - modulo) / 26);
  }

  return column;
};

const renderCellValue = (value: CellValue): ReactNode => {
  if (value === null) return "";

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const SpreadsheetTable = ({ data }: SpreadsheetProps) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 text-spreadsheet-cell-foreground">
        {t("COMMON_NO_DATA_AVAILABLE")}
      </div>
    );
  }

  const rows: CellValue[][] = Array.isArray(data[0])
    ? (data as CellValue[][])
    : data.map((item) => Object.values(item) as CellValue[]);

  const totalColumns = Math.max(...rows.map((row) => row.length));

  return (
    <div
      className={cn(
        "w-full overflow-auto",
        "rounded-sm border",
        "border-table-grid-border",
        "bg-surface",
      )}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {/* Top Left Corner */}
            <th
              className={cn(
                "sticky left-0 top-0 z-30",
                "h-8 min-w-12",
                "border",
                "border-spreadsheet-header-border",
                "bg-spreadsheet-header-background",
              )}
            />

            {/* Excel Columns */}
            {Array.from({ length: totalColumns }).map((_, index) => (
              <th
                key={index}
                className={cn(
                  "sticky top-0 z-20",
                  "h-8 min-w-[120px]",
                  "border",
                  "border-spreadsheet-header-border",
                  "bg-spreadsheet-header-background",
                  "px-2",
                  "text-center text-[13px]",
                  "font-semibold text-spreadsheet-header-foreground",
                )}
              >
                {getExcelColumn(index)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                "transition-colors",
                "bg-spreadsheet-row-background",
                "hover:bg-spreadsheet-row-hover-background",
              )}
            >
              {/* Row Number */}
              <th
                className={cn(
                  "sticky left-0 z-10",
                  "h-8 min-w-12",
                  "border",
                  "border-spreadsheet-row-number-border",
                  "bg-spreadsheet-row-number-background",
                  "text-center text-[13px]",
                  "font-medium text-spreadsheet-row-number-foreground",
                )}
              >
                {rowIndex + 1}
              </th>

              {/* Cells */}
              {Array.from({ length: totalColumns }).map((_, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  contentEditable
                  suppressContentEditableWarning
                  className={cn(
                    "h-8 min-w-[120px]",
                    "border",
                    "border-spreadsheet-cell-border",
                    "bg-spreadsheet-cell-background",
                    "px-2 py-1",
                    "text-[13px] text-spreadsheet-cell-foreground",
                    "outline-none",
                    "transition-colors",
                    "focus:bg-spreadsheet-cell-focus-background",
                    "focus:ring-1 focus:ring-spreadsheet-focus-ring",
                    "focus:border-spreadsheet-cell-focus-border",
                  )}
                >
                  {renderCellValue(row[colIndex])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpreadsheetTable;
