import { ExternalLink } from "lucide-react";
import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";
import { RuntimeRadarChart } from "../charts/RuntimeRadarChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { runtimes } from "@/data/runtimes";
import { MarkdownNote } from "../MarkdownNote";

const categoryLabel: Record<string, string> = {
  desktop_app: "Masaüstü Uygulaması",
  cli: "CLI / Kütüphane",
  server: "Sunucu",
  library: "Kütüphane",
};

const categoryColor: Record<string, "default" | "accent" | "success" | "warning"> = {
  desktop_app: "default",
  cli: "accent",
  server: "success",
  library: "warning",
};

export function Runtimes() {
  return (
    <Section id="runtimes">
      <SectionHeader
        eyebrow="04 · Runtime"
        title="Hangi araçla çalıştırırsın?"
        description="Aynı model, farklı runtime'larda çok farklı performans ve deneyim verir. Ekosistemin haritası:"
      />

      <div className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Popüler 4 runtime karşılaştırması
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RuntimeRadarChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Nasıl seçilir?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <Decision title="Yeni başlıyorum" pick="Ollama" reason="Tek komutla model indir & çalıştır, OpenAI-uyumlu API built-in." />
            <Decision title="GUI istiyorum" pick="LM Studio / Jan" reason="Drag-drop, model keşfi, ayar paneli. Teknik olmayan kullanıcıya uygun." />
            <Decision title="Maksimum hız & kontrol" pick="llama.cpp" reason="Custom quant, flash attention, speculative decoding. Düşük seviye kontrol." />
            <Decision title="Üretim / çok kullanıcılı" pick="vLLM / TGI" reason="Continuous batching, paged attention, yüksek throughput." />
            <Decision title="Apple Silicon özel" pick="MLX" reason="Unified memory'yi gerçekten verimli kullanır; Metal backend native." />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {runtimes.map((r) => (
          <Card key={r.id} className="card-hover flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{r.name}</CardTitle>
                <Badge variant={categoryColor[r.category]} className="text-[10px]">
                  {categoryLabel[r.category]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3 text-xs">
              <p className="text-sm text-muted-foreground">{r.bestFor}</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                <Metric label="Kolaylık" value={r.ease} />
                <Metric label="Performans" value={r.performance} />
                <Metric label="Esneklik" value={r.flexibility} />
                <Metric label="Ekosistem" value={r.ecosystem} />
              </div>
              <div className="mt-auto flex items-center justify-between pt-2">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {r.osSupport.join(" · ")}
                </span>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:text-primary/80"
                >
                  <span className="text-[10px]">Site</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <MarkdownNote tone="info" title="Runtime başına özet tavsiye">
{`- **Başla**: Ollama (kurulum 2 dk, \`ollama run llama3.1\` yeter).
- **GUI sev**: LM Studio (modelleri arayüzden keşfet, OpenAI-uyumlu local server).
- **Production**: vLLM + Linux + 2+ GPU. Continuous batching 5-10x throughput.
- **Apple Silicon**: MLX + \`mlx-lm\` paketi. Bellek profili NVIDIA'dan farklı.
- **Deep custom**: llama.cpp main binary, CLI argümanlarıyla her şey özelleştirilebilir.`}
      </MarkdownNote>
    </Section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border/40 bg-secondary/30 px-2 py-1">
      <span>{label}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i < value ? "bg-primary" : "bg-secondary"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Decision({
  title,
  pick,
  reason,
}: {
  title: string;
  pick: string;
  reason: string;
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-secondary/30 p-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold text-foreground">{title}</span>
        <span className="text-xs font-mono text-primary">→ {pick}</span>
      </div>
      <div className="mt-0.5 text-[11px] leading-snug">{reason}</div>
    </div>
  );
}
