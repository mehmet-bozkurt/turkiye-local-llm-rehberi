import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";
import { ComparisonTable } from "../ComparisonTable";
import { MarkdownNote } from "../MarkdownNote";
import { Badge } from "@/components/ui/badge";
import { ProductLink } from "../ProductLink";
import { hardwareProfiles } from "@/data/hardware";
import { formatTRY, usdToTry } from "@/lib/utils";
import type { Hardware } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Donanim() {
  return (
    <Section id="donanim">
      <SectionHeader
        eyebrow="02 · Donanım"
        title="Hangi donanım neyi çalıştırır?"
        description="Yerel AI'ın en somut kısıtı: RAM/VRAM. İşte tüketici ve workstation sınıfında tipik profiller."
      />

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FormulaCard />
        <KeyInsightCard />
      </div>

      <ComparisonTable<Hardware>
        caption="Donanım profilleri"
        getRowKey={(h) => h.id}
        columns={[
          {
            key: "name",
            label: "Donanım",
            render: (h) => (
              <div>
                <div className="flex flex-wrap items-center gap-1.5 font-medium">
                  <ProductLink name={h.name} url={h.url} />
                  {h.market === "used" && (
                    <Badge variant="warning" className="px-1.5 py-0 text-[9px]">
                      2. El
                    </Badge>
                  )}
                  <ImportRiskBadge risk={h.importRisk} />
                </div>
                <div className="text-xs text-muted-foreground">{h.vendor}</div>
              </div>
            ),
          },
          {
            key: "type",
            label: "Tip",
            render: (h) => (
              <Badge variant="outline" className="capitalize">
                {h.type}
              </Badge>
            ),
          },
          {
            key: "memory",
            label: "Bellek",
            align: "right",
            render: (h) =>
              h.gpu
                ? `${h.gpu.vramGB}GB VRAM + ${h.ramGB}GB RAM`
                : h.unifiedMemoryGB
                  ? `${h.unifiedMemoryGB}GB Unified`
                  : `${h.ramGB}GB RAM`,
          },
          {
            key: "bandwidth",
            label: "Bant gen.",
            align: "right",
            render: (h) =>
              h.memoryBandwidthGBs ? (
                <span className="font-mono text-xs text-muted-foreground">
                  {h.memoryBandwidthGBs} GB/s
                </span>
              ) : (
                "—"
              ),
          },
          {
            key: "promptEval",
            label: "Prompt TPS",
            align: "right",
            render: (h) =>
              h.promptEvalTPS70BQ4 ? (
                <span
                  className={`font-mono text-xs ${
                    h.promptEvalTPS70BQ4 >= 2000
                      ? "text-emerald-400"
                      : h.promptEvalTPS70BQ4 >= 500
                        ? "text-sky-400"
                        : h.promptEvalTPS70BQ4 >= 150
                          ? "text-amber-400"
                          : "text-rose-400"
                  }`}
                  title="70B Q4 için prompt işleme hızı (uzun context'te kritik)"
                >
                  {h.promptEvalTPS70BQ4}
                </span>
              ) : (
                "—"
              ),
          },
          {
            key: "approxPriceTRY",
            label: "Fiyat (TL)",
            align: "right",
            render: (h) => {
              const tl = h.approxPriceTRY ?? usdToTry(h.approxPriceUSD);
              const isEstimate = h.approxPriceTRY == null;
              return (
                <span
                  className={`font-mono ${isEstimate ? "text-muted-foreground" : "text-primary"}`}
                  title={
                    isEstimate
                      ? "TR pazar fiyatı girilmemiş — USD liste fiyatı × 45 TL/USD ile tahmin"
                      : "Türkiye gerçek pazar fiyatı (Apple TR / Hepsiburada / 2. el ortalaması)"
                  }
                >
                  {formatTRY(tl)}
                  {isEstimate && <span className="ml-0.5 text-[10px]">*</span>}
                </span>
              );
            },
          },
          {
            key: "loadPowerW",
            label: "Yük gücü",
            align: "right",
            render: (h) => (
              <span className="font-mono">{h.loadPowerW} W</span>
            ),
          },
          {
            key: "noise",
            label: "Ses (yük)",
            align: "right",
            render: (h) => <AcousticCell hw={h} />,
          },
          {
            key: "summer",
            label: "Yaz ↓",
            align: "right",
            render: (h) =>
              h.summerThermalPenalty != null ? (
                <span
                  className={`font-mono text-xs ${
                    h.summerThermalPenalty <= 0.07
                      ? "text-emerald-400"
                      : h.summerThermalPenalty <= 0.15
                        ? "text-sky-400"
                        : h.summerThermalPenalty <= 0.22
                          ? "text-amber-400"
                          : "text-rose-400"
                  }`}
                  title="Yaz sıcağında (32-38°C ortam) beklenen performans düşüşü"
                >
                  −%{Math.round(h.summerThermalPenalty * 100)}
                </span>
              ) : (
                "—"
              ),
          },
        ]}
        data={hardwareProfiles}
      />

      <p className="mt-2 text-[11px] text-muted-foreground">
        <span className="font-mono text-muted-foreground">*</span> — Türkiye
        pazar fiyatı girilmemiş kalemler için tahmin:{" "}
        <span className="font-mono">USD liste × 45 TL</span> (TCMB 2026-Q2). Apple
        TR ve 2. el piyasa kendine has fiyatlandığı için gerçek TR fiyatı varsa
        doğrudan o kullanılır.
      </p>

      <SectionHeader
        className="mt-12"
        eyebrow="Güçlü ve zayıf yönler"
        title="Her donanımın kendi profili var"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {hardwareProfiles.map((hw) => (
          <Card key={hw.id} className="card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">
                  <ProductLink name={hw.name} url={hw.url} />
                </CardTitle>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  {hw.market === "used" && (
                    <Badge variant="warning" className="text-[10px]">
                      2. El
                    </Badge>
                  )}
                  <ImportRiskBadge risk={hw.importRisk} />
                </div>
              </div>
              <div className="font-mono text-xs text-muted-foreground">
                <span className="text-primary">
                  {formatTRY(hw.approxPriceTRY ?? usdToTry(hw.approxPriceUSD))}
                </span>
                {hw.approxPriceTRY == null && (
                  <span
                    className="ml-0.5 text-[10px]"
                    title="USD liste fiyatı × 45 TL/USD ile tahmin"
                  >
                    *
                  </span>
                )}{" "}
                · {hw.loadPowerW}W yük
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Güçlü
                </div>
                <ul className="space-y-1">
                  {hw.strengths.map((s) => (
                    <li key={s} className="flex gap-2 text-muted-foreground">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-rose-400">
                  Zayıf
                </div>
                <ul className="space-y-1">
                  {hw.weaknesses.map((w) => (
                    <li key={w} className="flex gap-2 text-muted-foreground">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <MarkdownNote tone="info" title="Apple Silicon'un sırrı">
{`Apple Silicon'da **unified memory architecture**; CPU ve GPU aynı belleği paylaşır ve kopyalama maliyeti yoktur.
Bu, 36GB veya 64GB M3 Max gibi bir laptopta 30-70B quant modelleri çalıştırmayı mümkün kılar — NVIDIA 4090 bile 24GB VRAM ile sınırlıdır.

Ancak CUDA ekosistemi yoktur: vLLM gibi optimize serving stack'leri Apple'da çalışmaz, MLX veya llama.cpp Metal backend kullanılır.`}
      </MarkdownNote>
    </Section>
  );
}

function FormulaCard() {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">VRAM Tahmini Formülü</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 font-mono text-xs">
          VRAM ≈ params(B) × bytesPerParam × 1.15 + KV_cache
        </div>
        <ul className="space-y-1 text-muted-foreground">
          <li>
            <span className="font-mono text-primary">FP16</span> → 2 byte/param
          </li>
          <li>
            <span className="font-mono text-primary">Q8_0</span> → ~1 byte/param
          </li>
          <li>
            <span className="font-mono text-primary">Q5_K_M</span> → ~0.6 byte/param
          </li>
          <li>
            <span className="font-mono text-primary">Q4_K_M</span> → ~0.5 byte/param
          </li>
        </ul>
        <p className="text-xs text-muted-foreground">
          Örnek: 8B model Q4 → 8 × 0.5 × 1.15 ≈ 4.6 GB + context cache.
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Akustik hücre — dB + ikon. Sınıflandırmaya göre renklendirilir.
 * silent 🤫 · quiet 🟢 · audible 🟡 · loud 🟠 · server 🔴
 */
function AcousticCell({ hw }: { hw: Hardware }) {
  const db = hw.noiseDbLoad;
  if (db == null) return <span>—</span>;
  const cls = hw.acousticClass;
  const toneClass = {
    silent: "text-emerald-400",
    quiet: "text-emerald-400",
    audible: "text-sky-400",
    loud: "text-amber-400",
    server: "text-rose-400",
  }[cls ?? "audible"];
  const icon = {
    silent: "🤫",
    quiet: "🟢",
    audible: "🟡",
    loud: "🟠",
    server: "🔴",
  }[cls ?? "audible"];
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-xs ${toneClass}`}
      title={`Idle ${hw.noiseDbIdle ?? "?"} dB · Load ${db} dB · sınıf: ${cls ?? "—"}`}
    >
      <span className="text-[10px]">{icon}</span>
      {db === 0 ? "fansız" : `${db} dB`}
    </span>
  );
}

/**
 * Türkiye pazarı için tedarik/garanti riski rozeti.
 * `none` (varsayılan) için hiçbir şey göstermez — sessiz iyi durum.
 */
function ImportRiskBadge({ risk }: { risk?: Hardware["importRisk"] }) {
  if (!risk || risk === "none") return null;
  const map: Record<
    Exclude<NonNullable<Hardware["importRisk"]>, "none">,
    { label: string; tone: "warning" | "danger" | "muted"; title: string }
  > = {
    "warranty-risk": {
      label: "Garantisiz",
      tone: "warning",
      title: "İkinci el / üretici garantisi yok · madencilik kartı riski",
    },
    "customs-high": {
      label: "İthalat",
      tone: "danger",
      title:
        "Türkiye'de resmi satış yok · ~%60 gümrük + KDV · yurt dışı garanti",
    },
    unavailable: {
      label: "TR'de yok",
      tone: "muted",
      title: "Türkiye pazarında bulunmuyor",
    },
  };
  const cfg = map[risk];
  const variant = cfg.tone === "danger" ? "warning" : cfg.tone === "muted" ? "muted" : "warning";
  return (
    <Badge
      variant={variant}
      className={`px-1.5 py-0 text-[9px] ${
        cfg.tone === "danger" ? "bg-rose-500/20 text-rose-300 border-rose-500/40" : ""
      }`}
      title={cfg.title}
    >
      {cfg.label}
    </Badge>
  );
}

function KeyInsightCard() {
  return (
    <Card className="card-hover border-primary/30 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Altın Kural</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p>
          <strong className="text-primary">Model Q4 boyutu &lt; VRAM × 0.9</strong>
          {" "}ise: lokal çalıştırma akıcıdır.
        </p>
        <p>
          <strong className="text-accent">Model &lt; VRAM ise</strong>: GPU
          tamamen beslenir; tokens/s donanımın ham gücüyle orantılıdır.
        </p>
        <p>
          <strong className="text-rose-400">VRAM aşılırsa</strong>: katmanlar
          RAM'e taşar (partial offload), hız dramatik düşer (3-10x).
        </p>
      </CardContent>
    </Card>
  );
}
