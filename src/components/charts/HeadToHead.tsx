import { useState, type ReactNode } from "react";
import { Check, Minus, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Winner = "A" | "B" | "tie";

interface Row {
  label: string;
  a: ReactNode;
  b: ReactNode;
  winner: Winner;
  hint?: string;
}

interface Matchup {
  id: string;
  label: string;
  sublabel: string;
  a: { title: string; price: string; tag: string };
  b: { title: string; price: string; tag: string };
  rows: Row[];
  verdict: string;
}

const MATCHUPS: Matchup[] = [
  {
    id: "budget-equal",
    label: "Bütçe-eşit",
    sublabel: "~105-125K TL aynı parayla",
    a: {
      title: "4x Mac mini M4 16GB (Exo + TB4)",
      price: "~124K TL",
      tag: "Cluster",
    },
    b: {
      title: "PC + 2x RTX 3090 ikinci el",
      price: "~105K TL",
      tag: "Tek kasa",
    },
    rows: [
      {
        label: "Toplam bellek",
        a: "64GB unified pool",
        b: "48GB VRAM + 128GB RAM",
        winner: "A",
      },
      {
        label: "LLM'e kullanılabilir",
        a: "~44GB (TP overhead)",
        b: "~43GB VRAM",
        winner: "tie",
      },
      {
        label: "Bellek bant genişliği",
        a: "120 GB/s × 4 (bölünmüş)",
        b: "936 GB/s × 2",
        winner: "B",
        hint: "Inference memory-bound; bant genişliği doğrudan tok/s demek.",
      },
      {
        label: "Interconnect",
        a: "Thunderbolt 4 (40 Gb/s)",
        b: "PCIe 4.0 x8 + opsiyonel NVLink",
        winner: "B",
      },
      {
        label: "Llama 3.3 70B Q4",
        a: "~3 tok/s",
        b: "~20 tok/s",
        winner: "B",
        hint: "Dual 3090 yaklaşık 6-7x daha hızlı.",
      },
      {
        label: "32B Coder Q4",
        a: "~14 tok/s (cluster)",
        b: "~50 tok/s (vLLM)",
        winner: "B",
      },
      {
        label: "Maksimum güç",
        a: "180 W",
        b: "750 W",
        winner: "A",
      },
      {
        label: "Aylık elektrik (3h/gün, 3 TL/kWh)",
        a: "~49 TL",
        b: "~203 TL",
        winner: "A",
      },
      {
        label: "Ses seviyesi (yük)",
        a: "Fansız · ~0 dB",
        b: "~45-55 dB",
        winner: "A",
      },
      {
        label: "Fiziksel yer",
        a: "4 kasa + TB kablolar + hub",
        b: "1 mid-tower kasa",
        winner: "B",
      },
      {
        label: "Ekosistem",
        a: "MLX · Exo · Ollama",
        b: "CUDA · vLLM · llama.cpp · transformers",
        winner: "B",
      },
      {
        label: "Fine-tune / LoRA",
        a: "❌ Sınırlı",
        b: "✅ QLoRA, DPO rahat",
        winner: "B",
      },
      {
        label: "Kurulum karmaşıklığı",
        a: "Plug & play + Exo kurulumu",
        b: "PC montaj + sürücü + multi-GPU",
        winner: "tie",
      },
      {
        label: "Garanti",
        a: "Apple 1 yıl + AppleCare seçeneği",
        b: "❌ İkinci el · madencilik riski",
        winner: "A",
      },
      {
        label: "Upgrade yolu",
        a: "+1 node = +30K TL (8x pool)",
        b: "RAM/CPU yükseltilebilir; VRAM sabit",
        winner: "A",
      },
      {
        label: "Token/s başına TL (düşük iyi)",
        a: "~41.300 TL/(tok/s)",
        b: "~5.250 TL/(tok/s)",
        winner: "B",
        hint: "Dual 3090 yaklaşık 8x daha verimli.",
      },
    ],
    verdict:
      "**70B hızı odakta ise Dual 3090 ezici favori** (6-7x hız, 8x TL/tok verimi). Mac mini cluster sadece **sessizlik + düşük güç + yeni garanti** tercih ediliyorsa ve hız ~3 tok/s yeterli görülüyorsa anlamlı. Exo-clustering öğrenme projesi için ise mükemmel; üretim için değil.",
  },
  {
    id: "capability-equal",
    label: "Yetenek referansı",
    sublabel: "4x M4 Pro 64GB cluster (480K TL) — benchmark için",
    a: {
      title: "4x Mac mini M4 Pro 64GB (Exo + TB5)",
      price: "~480K TL",
      tag: "Cluster",
    },
    b: {
      title: "PC + 2x RTX 3090 ikinci el",
      price: "~105K TL",
      tag: "Tek kasa",
    },
    rows: [
      {
        label: "Toplam bellek",
        a: "256GB unified pool",
        b: "48GB VRAM + 128GB RAM",
        winner: "A",
      },
      {
        label: "LLM'e kullanılabilir",
        a: "~152GB (TB5 RDMA %85)",
        b: "~43GB VRAM",
        winner: "A",
        hint: "Burada cluster eşsiz: 120B-400B modeller tek kasaya sığmaz.",
      },
      {
        label: "Bellek bant genişliği",
        a: "273 GB/s × 4 (bölünmüş)",
        b: "936 GB/s × 2",
        winner: "B",
      },
      {
        label: "Interconnect",
        a: "Thunderbolt 5 + RDMA (80 Gb/s)",
        b: "PCIe 4.0 x8 + opsiyonel NVLink",
        winner: "tie",
      },
      {
        label: "Llama 3.3 70B Q4",
        a: "~4 tok/s (Exo Day-2)",
        b: "~20 tok/s",
        winner: "B",
      },
      {
        label: "Nemotron 70B Q4 (topluluk)",
        a: "~8 tok/s (heise.de)",
        b: "~22 tok/s",
        winner: "B",
      },
      {
        label: "DeepSeek V3 671B Q4",
        a: "~5.4 tok/s çalışır",
        b: "❌ Sığmaz (VRAM+RAM yetmez)",
        winner: "A",
      },
      {
        label: "Llama 4 400B Q4",
        a: "✅ Çalışır",
        b: "❌",
        winner: "A",
      },
      {
        label: "Maksimum güç",
        a: "300 W",
        b: "750 W",
        winner: "A",
      },
      {
        label: "Fine-tune / LoRA",
        a: "MLX distributed (erken)",
        b: "✅ Olgun ekosistem",
        winner: "B",
      },
      {
        label: "Fiyat",
        a: "~480K TL",
        b: "~105K TL",
        winner: "B",
        hint: "Dual 3090 yaklaşık 4.5x daha ucuz.",
      },
      {
        label: "70B için TL/tok·s",
        a: "~120.000 TL/(tok/s)",
        b: "~5.250 TL/(tok/s)",
        winner: "B",
      },
    ],
    verdict:
      "**Hedef 70B ise Dual 3090 çok daha iyi** (5x hız, 4.5x fiyat avantajı). **Hedef 200B+ veya DeepSeek V3 / Llama 4 frontier ise 4x M4 Pro cluster eşsiz** — bu boyutta Dual 3090 fiziksel olarak çalıştıramaz. İki sistem aynı ligde değil; 'büyük model hedefi' = 70B ise PC kazanır, 'en büyük' = 400-700B ise cluster tek seçenek.",
  },
];

export function HeadToHead() {
  const [activeId, setActiveId] = useState<string>(MATCHUPS[0].id);
  const active = MATCHUPS.find((m) => m.id === activeId)!;

  const scoreA = active.rows.filter((r) => r.winner === "A").length;
  const scoreB = active.rows.filter((r) => r.winner === "B").length;
  const ties = active.rows.filter((r) => r.winner === "tie").length;

  return (
    <div className="space-y-4">
      {/* Mode switcher */}
      <div className="flex flex-wrap gap-2">
        {MATCHUPS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setActiveId(m.id)}
            className={cn(
              "rounded-lg border px-3 py-2 text-left text-xs transition-colors",
              activeId === m.id
                ? "border-primary/50 bg-primary/10 text-foreground"
                : "border-border/60 bg-card/40 text-muted-foreground hover:bg-secondary/40"
            )}
          >
            <div className="font-semibold">{m.label}</div>
            <div className="text-[10px] opacity-70">{m.sublabel}</div>
          </button>
        ))}
      </div>

      {/* Headline */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <ContestantHeader
          side="A"
          title={active.a.title}
          price={active.a.price}
          tag={active.a.tag}
          score={scoreA}
          total={active.rows.length}
        />
        <ContestantHeader
          side="B"
          title={active.b.title}
          price={active.b.price}
          tag={active.b.tag}
          score={scoreB}
          total={active.rows.length}
        />
      </div>

      {/* Score bar */}
      <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2 text-xs">
        <span className="font-semibold text-chart-4">A: {scoreA}</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background">
          <div className="flex h-full">
            <div
              className="bg-chart-4 transition-all"
              style={{
                width: `${(scoreA / active.rows.length) * 100}%`,
              }}
            />
            <div
              className="bg-muted-foreground/40 transition-all"
              style={{
                width: `${(ties / active.rows.length) * 100}%`,
              }}
            />
            <div
              className="bg-chart-3 transition-all"
              style={{
                width: `${(scoreB / active.rows.length) * 100}%`,
              }}
            />
          </div>
        </div>
        <span className="font-semibold text-chart-3">{scoreB} :B</span>
        <span className="text-muted-foreground">
          ({ties} berabere)
        </span>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/40">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground">
              <th className="w-1/4 px-3 py-2 text-left">Özellik</th>
              <th className="w-[37%] px-3 py-2 text-left">A · Mac mini cluster</th>
              <th className="w-[37%] px-3 py-2 text-left">B · Dual RTX 3090</th>
            </tr>
          </thead>
          <tbody>
            {active.rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-border/40 last:border-0"
              >
                <td className="px-3 py-2 align-top">
                  <div className="text-xs font-medium text-muted-foreground">
                    {row.label}
                  </div>
                  {row.hint && (
                    <div className="mt-0.5 text-[10px] italic text-muted-foreground/70">
                      {row.hint}
                    </div>
                  )}
                </td>
                <td
                  className={cn(
                    "px-3 py-2 align-top",
                    row.winner === "A" && "bg-chart-4/10"
                  )}
                >
                  <div className="flex items-start gap-1.5">
                    <WinnerIcon winner={row.winner} side="A" />
                    <span className={row.winner === "A" ? "text-foreground" : "text-muted-foreground"}>
                      {row.a}
                    </span>
                  </div>
                </td>
                <td
                  className={cn(
                    "px-3 py-2 align-top",
                    row.winner === "B" && "bg-chart-3/10"
                  )}
                >
                  <div className="flex items-start gap-1.5">
                    <WinnerIcon winner={row.winner} side="B" />
                    <span className={row.winner === "B" ? "text-foreground" : "text-muted-foreground"}>
                      {row.b}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verdict */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 text-sm leading-relaxed">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
            Sonuç
          </div>
          <MarkdownInline text={active.verdict} />
        </CardContent>
      </Card>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Yardımcı bileşenler
// -----------------------------------------------------------------------------

function ContestantHeader({
  side,
  title,
  price,
  tag,
  score,
  total,
}: {
  side: "A" | "B";
  title: string;
  price: string;
  tag: string;
  score: number;
  total: number;
}) {
  const isA = side === "A";
  const sideTone = isA
    ? "border-chart-4/40 bg-chart-4/5"
    : "border-chart-3/40 bg-chart-3/5";
  const labelTone = isA ? "text-chart-4" : "text-chart-3";
  const pct = Math.round((score / total) * 100);
  return (
    <div className={cn("rounded-xl border p-4", sideTone)}>
      <div className="mb-1 flex items-center gap-2">
        <span
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center rounded-md font-mono text-xs font-bold",
            isA ? "bg-chart-4/20 text-chart-4" : "bg-chart-3/20 text-chart-3"
          )}
        >
          {side}
        </span>
        <Badge variant="outline" className="text-[10px]">
          {tag}
        </Badge>
      </div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 font-mono text-xs text-muted-foreground">{price}</div>
      <div className={cn("mt-2 text-xs", labelTone)}>
        {score}/{total} eksende kazanıyor ({pct}%)
      </div>
    </div>
  );
}

function WinnerIcon({
  winner,
  side,
}: {
  winner: Winner;
  side: "A" | "B";
}) {
  if (winner === "tie")
    return <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />;
  if (winner === side)
    return (
      <Check
        className={cn(
          "mt-0.5 h-3.5 w-3.5 shrink-0",
          side === "A" ? "text-chart-4" : "text-chart-3"
        )}
      />
    );
  return <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />;
}

/** Çok basit inline markdown: sadece **bold** kalın yapar. */
function MarkdownInline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {p.slice(2, -2)}
            </strong>
          );
        }
        return (
          <span key={i} className="text-muted-foreground">
            {p}
          </span>
        );
      })}
    </p>
  );
}
