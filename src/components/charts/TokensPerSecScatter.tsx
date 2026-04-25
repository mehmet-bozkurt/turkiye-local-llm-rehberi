import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { models } from "@/data/models";
import { hardwareProfiles } from "@/data/hardware";
import { ChartTooltip } from "./ChartTooltip";

/**
 * X = model parametre sayısı (milyar)
 * Y = tokens/sec
 * Group = donanım
 */
export function TokensPerSecScatter() {
  const grouped = hardwareProfiles
    .map((hw) => {
      const points = models.flatMap((m) =>
        (m.benchmarks ?? [])
          .filter((b) => b.hardwareId === hw.id)
          .map((b) => ({
            model: m.name,
            params: m.params,
            tokensPerSec: b.tokensPerSec,
            quant: b.quant,
          }))
      );
      return { hardware: hw.name, id: hw.id, points };
    })
    .filter((g) => g.points.length > 0);

  const palette = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(340 82% 60%)",
    "hsl(160 70% 50%)",
  ];

  return (
    <div className="h-[420px] w-full">
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 40, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            dataKey="params"
            name="Parametre"
            unit="B"
            label={{
              value: "Parametre sayısı (milyar)",
              position: "insideBottom",
              offset: -6,
              style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
            }}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            type="number"
            dataKey="tokensPerSec"
            name="Tokens/s"
            label={{
              value: "Tokens / saniye",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
            }}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <ZAxis range={[80, 80]} />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ strokeDasharray: "3 3" }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          {grouped.map((g, idx) => (
            <Scatter
              key={g.id}
              name={g.hardware}
              data={g.points}
              fill={palette[idx % palette.length]}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
