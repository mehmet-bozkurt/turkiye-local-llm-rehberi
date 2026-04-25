import { useMemo } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  Cell,
} from "recharts";
import { hardwareProfiles } from "@/data/hardware";
import { ChartTooltip } from "./ChartTooltip";

/**
 * "Yaşanabilirlik" scatter grafiği:
 * - X ekseni: Yük altında ses (dBA) — düşük daha iyi
 * - Y ekseni: Yaz sıcağında performans kaybı (%) — düşük daha iyi
 * - Nokta boyutu: Yük gücü (W) — büyük = çok elektrik
 *
 * Sol-alt köşe = ideal (sessiz + termal dayanıklı + düşük güç).
 * Sağ-üst köşe = kabus (gürültülü + yaz sıcağında çöker + çok elektrik).
 */
export function LivabilityChart() {
  const data = useMemo(
    () =>
      hardwareProfiles
        .filter(
          (h) =>
            h.noiseDbLoad != null &&
            h.summerThermalPenalty != null &&
            h.loadPowerW != null,
        )
        .map((h) => ({
          name: h.name,
          db: h.noiseDbLoad!,
          summer: Math.round((h.summerThermalPenalty ?? 0) * 100),
          watts: h.loadPowerW,
          cls: h.acousticClass ?? "audible",
        })),
    [],
  );

  const classColor: Record<string, string> = {
    silent: "hsl(142 71% 45%)",
    quiet: "hsl(160 70% 50%)",
    audible: "hsl(210 90% 60%)",
    loud: "hsl(38 92% 55%)",
    server: "hsl(0 72% 55%)",
  };

  return (
    <div className="h-[420px] w-full">
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            dataKey="db"
            name="dB (yük)"
            domain={[0, 65]}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            label={{
              value: "Yük altında ses (dBA) →",
              position: "insideBottom",
              offset: -10,
              style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
            }}
          />
          <YAxis
            type="number"
            dataKey="summer"
            name="Yaz kaybı %"
            domain={[0, 35]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            label={{
              value: "↑ Yaz sıcağında performans kaybı",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
            }}
          />
          <ZAxis type="number" dataKey="watts" range={[40, 520]} name="Watt" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={<ChartTooltip />}
          />
          <Scatter data={data}>
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={classColor[entry.cls] ?? classColor.audible}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <LegendDot color={classColor.silent} label="Sessiz" />
        <LegendDot color={classColor.quiet} label="Sakin" />
        <LegendDot color={classColor.audible} label="Duyulur" />
        <LegendDot color={classColor.loud} label="Gürültülü" />
        <LegendDot color={classColor.server} label="Sunucu" />
        <span className="ml-auto italic">Nokta boyutu = yük gücü (W)</span>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
