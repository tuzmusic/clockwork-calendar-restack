import { DistanceData } from "~/data/models/types";

export function DistanceInfo({ info }: { info: Record<string, DistanceData> }) {
  return (
    <div>
      <h4 className="underline">Distances</h4>
      <ul>
        {
          Object.entries(info).map(([key, value]) => (
            <li key={key}>{key}: {value.formattedTime}</li>
          ))
        }
      </ul>

    </div>
  );
}
