import type { ReactNode } from "react";
import type { SpreadsheetProps } from "../../types/commonTypes";

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
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 text-[var(--color-text-primary)]">
        No data available
      </div>
    );
  }

  const rows: CellValue[][] = Array.isArray(data[0])
    ? (data as CellValue[][])
    : data.map((item) => Object.values(item) as CellValue[]);

  const totalColumns = Math.max(...rows.map((row) => row.length));

  return (
    <div
      className="
        dark
        h-full
        w-full
        overflow-auto
        rounded-[var(--radius-sm)]
        border
        border-[var(--color-border-1)]
        bg-[var(--color-table-row-odd)]
      "
    >
      <table
        className="
          min-w-max
          border-collapse
          bg-[var(--color-table-row-odd)]
        "
      >
        <thead>
          <tr>
            {/* Top Left Corner */}
            <th
              className="
                sticky
                top-0
                left-0
                z-30
                h-8
                w-12
                min-w-[48px]
                border
                border-[var(--color-border-1)]
                bg-[var(--color-table-header)]
              "
            />

            {/* Excel Columns */}
            {Array.from({ length: totalColumns }).map((_, index) => (
              <th
                key={index}
                className="
                  sticky
                  top-0
                  z-20
                  h-8
                  min-w-[120px]
                  border
                  border-[var(--color-border-1)]
                  bg-[var(--color-table-header)]
                  text-center
                  text-[13px]
                  font-semibold
                  text-[var(--color-text-primary)]
                "
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
              className="
                bg-[var(--color-table-row-odd)]
                transition-colors
                hover:bg-[var(--color-table-row-hover)]
              "
            >
              {/* Row Number */}
              <th
                className="
                  sticky
                  left-0
                  z-10
                  h-8
                  min-w-[48px]
                  border
                  border-[var(--color-border-1)]
                  bg-[var(--color-table-header)]
                  text-center
                  text-[13px]
                  font-medium
                  text-[var(--color-text-primary)]
                "
              >
                {rowIndex + 1}
              </th>

              {/* Cells */}
              {Array.from({ length: totalColumns }).map((_, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  contentEditable
                  suppressContentEditableWarning
                  className="
                    h-8
                    min-w-[120px]
                    border
                    border-[var(--color-border-1)]
                    bg-[var(--background-primary-container)]
                    px-2
                    py-1
                    text-[13px]
                    text-[var(--color-text-primary)]
                    outline-none
                    transition-colors
                    focus:bg-[var(--color-table-row-hover)]
                    focus:ring-1
                    focus:ring-[var(--color-primary)]
                  "
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
