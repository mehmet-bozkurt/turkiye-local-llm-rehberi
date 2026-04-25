import { useState, useMemo } from "react";
import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";
import { ModelVramBarChart } from "../charts/ModelVramBarChart";
import { TokensPerSecScatter } from "../charts/TokensPerSecScatter";
import { ComparisonTable } from "../ComparisonTable";
import { MarkdownNote } from "../MarkdownNote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { models } from "@/data/models";
import type { Model } from "@/types";

export function Modeller() {
  const [sizeFilter, setSizeFilter] = useState<"all" | "small" | "mid" | "large">(
    "all"
  );

  const filtered = useMemo(() => {
    if (sizeFilter === "all") return models;
    if (sizeFilter === "small") return models.filter((m) => m.params <= 8);
    if (sizeFilter === "mid")
      return models.filter((m) => m.params > 8 && m.params <= 20);
    return models.filter((m) => m.params > 20);
  }, [sizeFilter]);

  return (
    <Section id="modeller">
      <SectionHeader
        eyebrow="03 · Modeller"
        title="Açık modeller artık frontier'a çok yakın"
        description="2024-2026 arasında Meta, Alibaba, Google, DeepSeek ve Mistral açık modelleri yayınladı. İşte uygulamalı bir karşılaştırma."
      />

      <Tabs defaultValue="chart" className="mb-8">
        <TabsList>
          <TabsTrigger value="chart">VRAM Grafiği</TabsTrigger>
          <TabsTrigger value="speed">Hız vs Parametre</TabsTrigger>
          <TabsTrigger value="table">Tablo</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Model × Quantization VRAM ihtiyacı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ModelVramBarChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="speed">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Donanıma göre tokens/saniye ölçümü
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TokensPerSecScatter />
              <p className="mt-3 text-xs text-muted-foreground">
                Değerler topluluk ölçümleri ve llama.cpp/Ollama raporlarına dayanır.
                Varsayılan Q4_K_M quantization, kısa context.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table">
          <div className="mb-3 flex flex-wrap gap-2">
            {[
              { id: "all", label: "Hepsi" },
              { id: "small", label: "≤8B (küçük)" },
              { id: "mid", label: "9-20B (orta)" },
              { id: "large", label: ">20B (büyük)" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSizeFilter(opt.id as typeof sizeFilter)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  sizeFilter === opt.id
                    ? "border-primary/60 bg-primary/20 text-primary"
                    : "border-border/60 bg-secondary/40 text-muted-foreground hover:bg-secondary"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <ComparisonTable<Model>
            caption="Model karşılaştırması"
            getRowKey={(m) => m.id}
            columns={[
              {
                key: "name",
                label: "Model",
                render: (m) => (
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {m.vendor} · {m.releaseYear}
                    </div>
                  </div>
                ),
              },
              {
                key: "params",
                label: "Params",
                align: "right",
                render: (m) => <span className="font-mono">{m.params}B</span>,
              },
              {
                key: "contextLength",
                label: "Context",
                align: "right",
                render: (m) => (
                  <span className="font-mono">
                    {(m.contextLength / 1000).toFixed(0)}K
                  </span>
                ),
              },
              {
                key: "q4",
                label: "Q4 VRAM",
                align: "right",
                render: (m) => {
                  const q = m.quantizations.find((x) => x.level === "Q4_K_M");
                  return q ? (
                    <span className="font-mono">{q.vramGB} GB</span>
                  ) : (
                    "—"
                  );
                },
              },
              {
                key: "strengths",
                label: "Güçlü olduğu",
                render: (m) => (
                  <div className="flex flex-wrap gap-1">
                    {m.strengths.slice(0, 3).map((s) => (
                      <Badge key={s} variant="muted" className="text-[10px]">
                        {s}
                      </Badge>
                    ))}
                  </div>
                ),
              },
            ]}
            data={filtered}
          />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Küçük (3-8B)",
            desc: "Günlük sohbet, özetleme, basit kod. Çoğu laptopta akıcı çalışır.",
            models: ["Llama 3.2 3B", "Llama 3.1 8B", "Qwen 2.5 7B"],
            tone: "text-sky-400",
          },
          {
            title: "Orta (9-20B)",
            desc: "Daha iyi reasoning, multimodal, orta seviye kod. 12GB+ VRAM veya 24GB+ unified.",
            models: ["Phi-4 14B", "Gemma 3 12B", "Mistral Nemo 12B"],
            tone: "text-primary",
          },
          {
            title: "Büyük (30B+)",
            desc: "GPT-4 seviyesine yaklaşan çıktı, ciddi donanım gerekli.",
            models: ["Qwen 2.5 Coder 32B", "Llama 3.3 70B"],
            tone: "text-accent",
          },
        ].map((group) => (
          <Card key={group.title} className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className={`text-base ${group.tone}`}>
                {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">{group.desc}</p>
              <ul className="space-y-1">
                {group.models.map((m) => (
                  <li key={m} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                    <span className="font-mono text-xs">{m}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <MarkdownNote tone="insight" title="Quantization pratikte neyi değiştirir?">
{`**Q4_K_M** günümüzde fiili standart: boyut ~4x küçülür, kalite kaybı %5-7'dir ve çoğu senaryoda farkedilmez.
**Q5_K_M** ve **Q6_K** daha büyük modellerde (30B+) tercih edilir; Q4'ün kayıpları burada artabilir.
**FP16** akademik/fine-tune senaryoları için anlamlı; üretkenlik kullanımında gereksiz VRAM harcar.`}
      </MarkdownNote>
    </Section>
  );
}
