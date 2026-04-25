import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { runtimes } from "@/data/runtimes";
import { ChartTooltip } from "./ChartTooltip";

interface Props {
  runtimeIds?: string[];
}

const AXES = [
  { key: "ease", label: "Kurulum Kolaylığı" },
  { key: "performance", label: "Performans" },
  { key: "flexibility", label: "Esneklik" },
  { key: "ecosystem", label: "Ekosistem" },
  { key: "gpuAcceleration", label: "GPU Hızlandırma" },
] as const;

const palette = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function RuntimeRadarChart({
  runtimeIds = ["ollama", "llama-cpp", "lm-studio", "vllm"],
}: Props) {
  const selected = runtimes.filter((r) => runtimeIds.includes(r.id));

  const data = AXES.map((axis) => {
    const row: Record<string, string | number> = { metric: axis.label };
    selected.forEach((r) => {
      row[r.name] = r[axis.key];
    });
    return row;
  });

  return (
    <div className="h-[420px] w-full">
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            stroke="hsl(var(--border))"
          />
          {selected.map((r, idx) => (
            <Radar
              key={r.id}
              name={r.name}
              dataKey={r.name}
              stroke={palette[idx % palette.length]}
              fill={palette[idx % palette.length]}
              fillOpacity={0.18}
              strokeWidth={2}
            />
          ))}
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
