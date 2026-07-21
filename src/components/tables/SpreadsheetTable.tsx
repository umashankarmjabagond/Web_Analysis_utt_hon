import "./Table.css";

interface SpreadsheetProps {
  data: any[];
}

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

const SpreadsheetTable = ({ data }: SpreadsheetProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="table-message">
        No data available
      </div>
    );
  }

  // Convert object rows into array rows
  const rows: any[][] = Array.isArray(data[0])
    ? data
    : data.map((item) => Object.values(item));

  const totalColumns = Math.max(...rows.map((r) => r.length));

  return (
    <div className="spreadsheet-container dark">
      <table className="spreadsheet-table">
        <thead>
          <tr>
            <th className="corner-cell"></th>

            {Array.from({ length: totalColumns }).map((_, index) => (
              <th key={index}>
                {getExcelColumn(index)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th className="row-header">{rowIndex + 1}</th>

              {Array.from({ length: totalColumns }).map((_, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  contentEditable
                  suppressContentEditableWarning
                >
                  {row[colIndex] ?? ""}
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