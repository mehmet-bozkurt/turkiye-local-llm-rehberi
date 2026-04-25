import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { models } from "@/data/models";
import { ChartTooltip } from "./ChartTooltip";

interface Props {
  quantLevels?: string[];
}

/**
 * Her model için seçili quantization seviyelerinin VRAM ihtiyacını gösterir.
 */
export function ModelVramBarChart({
  quantLevels = ["FP16", "Q8_0", "Q5_K_M", "Q4_K_M"],
}: Props) {
  const data = models
    .slice()
    .sort((a, b) => a.params - b.params)
    .map((m) => {
      const row: Record<string, string | number> = { name: m.name };
      quantLevels.forEach((lvl) => {
        const q = m.quantizations.find((x) => x.level === lvl);
        if (q) row[lvl] = q.vramGB;
      });
      return row;
    });

  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ];

  return (
    <div className="h-[420px] w-full">
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, bottom: 40, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="name"
            interval={0}
            angle={-28}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            label={{
              value: "VRAM (GB)",
              angle: -90,
              position: "insideLeft",
              offset: 15,
              style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
            }}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--secondary) / 0.3)" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {quantLevels.map((lvl, idx) => (
            <Bar
              key={lvl}
              dataKey={lvl}
              fill={colors[idx % colors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
