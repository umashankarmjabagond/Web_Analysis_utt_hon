import { useState } from "react";
import DataSource from "./DataSource";
import type { DataSourceType } from "./dataSourceTypes";

export default function DataSourcePreview() {
  const [type, setType] = useState<DataSourceType>("text-file");

  return (
    <div className="min-h-screen bg-gray-300 p-10">
      <DataSource type={type} dataSourceName="HDS2" onTypeChange={setType} />
    </div>
  );
}
