import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { hardwareProfiles, usableLLMMemoryGB } from "@/data/hardware";
import { formatTRY } from "@/lib/utils";

const BUDGET_TRY = 120_000;

/**
 * Her donanımın "70B Q4 günlük pratik hız" tahmini.
 * Kaynak: feasibility matrix notes + Exo Labs Day-2 benchmark + topluluk ölçümleri.
 * "0" → 70B sığmaz veya anlamlı değil.
 */
const LLAMA_70B_Q4_TPS: Record<string, number> = {
  "cpu-ryzen-7": 0,
  "m2-air-16": 0,
  "mac-mini-m4-16": 0,
  "mac-mini-m4-pro-24": 0,
  "mac-mini-m4-pro-48": 7,
  "mac-mini-m4-pro-64": 8,
  "m3-max-36": 4,
  "mac-studio-m4-max-36": 5,
  "mac-studio-m4-max-48": 7,
  "mac-studio-m2-ultra-64-used": 13,
  "mac-studio-m3-ultra-192": 18,
  "rtx-4070": 3,
  "pc-single-3090": 6,
  "pc-dual-3090": 20,
  "rtx-4090": 10,
  "ws-dual-4090": 40,
  "raspberry-pi-5": 0,
  "cluster-4x-mac-mini-m4-16": 3,
  "cluster-2x-mac-mini-m4-pro-64": 6,
  "cluster-4x-mac-mini-m4-pro-64": 4,
  "asus-ascent-gx10": 4.4,
  "nvidia-dgx-spark": 4.4,
  "framework-desktop-amd-395-128": 8,
  "framework-desktop-amd-395-64": 7,
};

interface Row {
  id: string;
  name: string;
  tps: number;
  tl: number;
  usableGB: number;
  inBudget: boolean;
  market?: string;
  type: string;
}

export function BudgetPathChart() {
  const rows: Row[] = hardwareProfiles
    .filter(
      (hw) =>
        hw.approxPriceTRY != null && (LLAMA_70B_Q4_TPS[hw.id] ?? 0) > 0
    )
    .map((hw) => ({
      id: hw.id,
      name: hw.name,
      tps: LLAMA_70B_Q4_TPS[hw.id],
      tl: hw.approxPriceTRY!,
      usableGB: usableLLMMemoryGB(hw),
      inBudget: hw.approxPriceTRY! <= BUDGET_TRY * 1.05, // %5 tolerans
      market: hw.market,
      type: hw.type,
    }))
    .sort((a, b) => b.tps - a.tps);

  const maxTps = Math.max(...rows.map((r) => r.tps));

  const colorFor = (r: Row) => {
    if (!r.inBudget) return "hsl(var(--muted-foreground) / 0.35)";
    if (r.type === "cluster") return "hsl(var(--chart-4))";
    if (r.market === "used") return "hsl(var(--chart-2))";
    return "hsl(var(--chart-3))";
  };

  return (
    <div>
      <div className="h-[520px] w-full">
        <ResponsiveContainer>
          <BarChart
            data={rows}
            layout="vertical"
            margin={{ top: 10, right: 100, left: 10, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              domain={[0, Math.ceil(maxTps * 1.2)]}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              label={{
                value: "Llama 3.3 70B Q4 — pratik tokens/sec (yüksek daha iyi)",
                position: "insideBottom",
                offset: -8,
                style: {
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                },
              }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={280}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as Row;
                return (
                  <div className="rounded-lg border border-border/70 bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm">
                    <div className="mb-1 font-semibold">{d.name}</div>
                    <div className="text-muted-foreground">
                      70B Q4:{" "}
                      <span className="font-mono text-primary">
                        {d.tps} tok/s
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      Fiyat:{" "}
                      <span
                        className={`font-mono ${d.inBudget ? "text-emerald-400" : "text-rose-400"}`}
                      >
                        {formatTRY(d.tl)}
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      Kullanılabilir:{" "}
                      <span className="font-mono text-foreground">
                        {d.usableGB} GB
                      </span>
                    </div>
                    {!d.inBudget && (
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-rose-400">
                        120K TL bütçe dışı
                      </div>
                    )}
                    {d.type === "cluster" && (
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-chart-4">
                        Cluster
                      </div>
                    )}
                    {d.market === "used" && (
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                        İkinci El
                      </div>
                    )}
                  </div>
                );
              }}
              cursor={{ fill: "hsl(var(--secondary) / 0.3)" }}
            />
            <Bar dataKey="tps" radius={[0, 6, 6, 0]}>
              {rows.map((r) => (
                <Cell key={r.id} fill={colorFor(r)} />
              ))}
              <LabelList
                dataKey="tl"
                position="right"
                formatter={(v: number) => `${Math.round(v / 1000)}K TL`}
                style={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 11,
                }}
              />
            </Bar>
            <ReferenceLine
              x={0}
              stroke="hsl(var(--border))"
              strokeWidth={2}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 px-2 text-[11px] text-muted-foreground">
        <span>Renk:</span>
        <Legend color="hsl(var(--chart-3))" label="Yeni · bütçe içi" />
        <Legend color="hsl(var(--chart-2))" label="İkinci el · bütçe içi" />
        <Legend color="hsl(var(--chart-4))" label="Cluster · bütçe içi" />
        <Legend color="hsl(var(--muted-foreground) / 0.5)" label="Bütçe dışı (referans)" />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Bütçe hedefi: <span className="font-mono text-emerald-400">{formatTRY(BUDGET_TRY)}</span> (±%5 tolerans).
        Sayılar topluluk benchmark'ları + Exo Labs Day-2 ölçümlerinin özetidir.
      </p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
