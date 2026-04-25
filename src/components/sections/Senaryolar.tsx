import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCases } from "@/data/useCases";
import { MarkdownNote } from "../MarkdownNote";

const recommendations: Record<
  string,
  { hw: string; model: string; runtime: string; reason: string }[]
> = {
  chat: [
    {
      hw: "M2 Air 16GB",
      model: "Llama 3.1 8B Q4",
      runtime: "LM Studio",
      reason: "Sessiz, pil dostu, 40+ tokens/s",
    },
    {
      hw: "RTX 4070",
      model: "Qwen 2.5 7B Q4",
      runtime: "Ollama",
      reason: "CUDA ile <200ms first-token",
    },
    {
      hw: "M3 Max 36GB",
      model: "Qwen 2.5 7B MLX",
      runtime: "MLX",
      reason: "Unified memory + uzun context",
    },
  ],
  code: [
    {
      hw: "RTX 4090",
      model: "Qwen 2.5 Coder 32B Q5",
      runtime: "vLLM",
      reason: "IDE entegrasyonu için >40 tokens/s",
    },
    {
      hw: "M3 Max 36GB",
      model: "Qwen 2.5 Coder 32B Q4",
      runtime: "MLX",
      reason: "14 tokens/s — yavaş ama kabul edilebilir",
    },
    {
      hw: "RTX 4070",
      model: "Phi-4 14B Q4",
      runtime: "llama.cpp",
      reason: "Küçük boyuta göre güçlü kod kalitesi",
    },
  ],
  rag: [
    {
      hw: "M3 Max 36GB",
      model: "Mistral Nemo 12B",
      runtime: "Ollama",
      reason: "Tool calling + uzun context",
    },
    {
      hw: "RTX 4090",
      model: "Llama 3.3 70B Q4",
      runtime: "vLLM",
      reason: "Kalite en yüksek; partial offload",
    },
    {
      hw: "RTX 4070",
      model: "Qwen 2.5 7B",
      runtime: "Ollama",
      reason: "Hızlı + 128K context yeterli",
    },
  ],
  summarize: [
    {
      hw: "M2 Air 16GB",
      model: "Llama 3.1 8B Q4",
      runtime: "LM Studio",
      reason: "Arka planda batch özetleme",
    },
    {
      hw: "CPU PC",
      model: "Llama 3.2 3B Q4",
      runtime: "Ollama",
      reason: "Gece çalışan scheduled job",
    },
    {
      hw: "Raspberry Pi 5",
      model: "Llama 3.2 3B Q4",
      runtime: "llama.cpp",
      reason: "Sürekli çalışan ucuz düğüm",
    },
  ],
  vision: [
    {
      hw: "M3 Max 36GB",
      model: "Gemma 3 12B",
      runtime: "MLX",
      reason: "Multimodal yükün altında verimli",
    },
    {
      hw: "RTX 4090",
      model: "Gemma 3 12B",
      runtime: "vLLM",
      reason: "Yüksek çözünürlük görsel batch",
    },
    {
      hw: "RTX 4070",
      model: "Gemma 3 12B Q4",
      runtime: "llama.cpp",
      reason: "VRAM sınırında; tek görsel yeterli",
    },
  ],
};

export function Senaryolar() {
  return (
    <Section id="senaryolar">
      <SectionHeader
        eyebrow="05 · Senaryolar"
        title="Gerçek kullanım, gerçek kararlar"
        description="Teorik performans bir yana; asıl soru şu: senin yapacağın iş ne? İşte 5 somut senaryo ve önerilen kombinasyonlar."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {useCases.map((uc) => {
          const recs = recommendations[uc.id] ?? [];
          return (
            <Card key={uc.id} className="card-hover">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">{uc.name}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {uc.description}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <Badge variant="muted">
                    Min {uc.minParams}B → Öneri {uc.recommendedParams}B
                  </Badge>
                  <Badge variant="muted">
                    Latency hassasiyeti: {"★".repeat(uc.latencySensitivity)}
                  </Badge>
                  <Badge variant="muted">
                    Kalite hassasiyeti: {"★".repeat(uc.qualitySensitivity)}
                  </Badge>
                  <Badge variant="outline">
                    ~{(uc.avgTokensPerDay / 1000).toFixed(0)}K token/gün
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Önerilen kombinasyonlar
                </div>
                <ul className="space-y-2">
                  {recs.map((r, idx) => (
                    <li
                      key={idx}
                      className="rounded-lg border border-border/50 bg-secondary/20 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">{r.hw}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {r.runtime}
                        </span>
                      </div>
                      <div className="mt-0.5 font-mono text-xs text-primary">
                        {r.model}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {r.reason}
                      </div>
                    </li>
                  ))}
                </ul>
                {uc.notes && (
                  <p className="mt-3 text-xs italic text-muted-foreground">
                    {uc.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <MarkdownNote tone="insight" title="Senaryodan modele doğru düşün">
{`Çoğu insan tersini yapar: önce modeli seçer ("Llama 3.1 kullanayım"), sonra donanım arar.
Doğrusu: **önce senaryonu tanımla** (günde ne yapacağım, kaç token, ne kadar hız + kalite),
sonra modelin minimum gereksinimlerinden donanıma yaklaş.`}
      </MarkdownNote>
    </Section>
  );
}
