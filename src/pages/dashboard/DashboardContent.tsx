import { useParams } from "react-router-dom";

export default function DashboardContent() {
  const { section } = useParams();

  return (
    <div className="flex h-full items-center justify-center text-4xl font-bold text-white">
      {section}
    </div>
  );
}
