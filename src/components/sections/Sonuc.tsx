import { CheckCircle2, XCircle, HelpCircle, ArrowRight } from "lucide-react";
import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkdownNote } from "../MarkdownNote";

const decisionTree = [
  {
    question: "Günde ne kadar token işliyorsun?",
    branches: [
      { answer: "< 30K", result: "Cloud API (pay-as-you-go) — yerel overkill." },
      {
        answer: "30K - 200K",
        result: "İkisi de makul; gizlilik/offline varsa yerele yatırım yap.",
      },
      { answer: "> 200K", result: "Yerel net kazanır — break-even 6-12 ayda tamamlanır." },
    ],
  },
  {
    question: "Frontier kalite (GPT-4 / Claude) şart mı?",
    branches: [
      {
        answer: "Evet",
        result:
          "Cloud API kullan. Lokal 70B Q4 bile kalite farkını tam kapatamıyor.",
      },
      {
        answer: "Hayır, 7-14B yeter",
        result: "Yerel yüksek oranda başarılı; ortalama laptopla bile çalışır.",
      },
    ],
  },
  {
    question: "Veriler cihazdan çıkabilir mi?",
    branches: [
      {
        answer: "Hayır (gizlilik)",
        result: "Yerel zorunlu. VPC cloud bile yetmeyebilir.",
      },
      { answer: "Evet", result: "Cloud teknik olarak mümkün." },
    ],
  },
  {
    question: "Hangi OS/ekosistemdesin?",
    branches: [
      {
        answer: "macOS",
        result: "Apple Silicon + MLX/Ollama ikilisi; M3/M4 ile harika deneyim.",
      },
      {
        answer: "Windows/Linux",
        result: "NVIDIA GPU + Ollama/vLLM; en geniş ekosistem seçenek.",
      },
      {
        answer: "Linux server",
        result: "vLLM veya TGI + 24-48GB VRAM; throughput odaklı production.",
      },
    ],
  },
];

export function Sonuc() {
  return (
    <Section id="sonuc">
      <SectionHeader
        eyebrow="08 · Sonuç"
        title="Kişisel karar rehberi"
        description="Tüm veriyi özetleyen 4 soruluk karar ağacı + son tavsiyeler."
      />

      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {decisionTree.map((step, idx) => (
          <Card key={idx} className="card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-mono text-sm font-bold text-primary">
                  {idx + 1}
                </div>
                <CardTitle className="text-base">{step.question}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {step.branches.map((b) => (
                  <li
                    key={b.answer}
                    className="flex gap-3 rounded-lg border border-border/50 bg-secondary/20 p-3"
                  >
                    <Badge variant="outline" className="shrink-0">
                      {b.answer}
                    </Badge>
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {b.result}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <SectionHeader
        eyebrow="Son sözler"
        title="Kendim için varılan sonuç"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Conclusion
          icon={CheckCircle2}
          tone="success"
          title="Mantıklı"
          body="Gizli veri, günlük yoğun kullanım, öğrenme motivasyonu, zaten güçlü donanım."
        />
        <Conclusion
          icon={HelpCircle}
          tone="warning"
          title="Hibrit"
          body="Çoğu kişisel kullanıcı için optimal: günlük işleri yerel, kritik işleri cloud."
        />
        <Conclusion
          icon={XCircle}
          tone="danger"
          title="Mantıksız"
          body="Düşük hacimli, frontier-bağımlı, donanım yatırımına kapasitesiz kullanıcılar."
        />
      </div>

      <MarkdownNote tone="insight" title="Benim sonuç notum (v0.1)">
{`Mevcut donanımın **MacBook Pro M3 Max 36GB** ise: Ollama veya MLX ile günlük chat, kod, RAG işlerini %90 lokalde halledersin — frontier gerektiğinde cloud API fallback'i bırak.

Yeni donanım alacaksan: **RTX 4070 + Ryzen 7 sistem** fiyat/performans kralı. Büyük modeller için **RTX 4090 + 64GB RAM**, eğer 70B hedefliyorsan **dual 4090 workstation**.

Cloud yalnız kullanımı: aylık ~20-30$ ile çoğu kullanıcıya yeter. Yerel-yalnız kullanımı: ancak 500K+ token/gün işliyorsan rasyonel.`}
      </MarkdownNote>

      <div className="mt-10 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Bu dashboard büyüyen bir araştırma günlüğüdür. Yeni model, donanım veya
          bulgu çıktıkça `src/data/*.ts` ve Memory Bank güncellenir.
        </p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          v0.1 · 2026-Q1 · LocalAI Fizibilite Dashboard
        </p>
      </div>
    </Section>
  );
}

function Conclusion({
  icon: Icon,
  tone,
  title,
  body,
}: {
  icon: typeof CheckCircle2;
  tone: "success" | "warning" | "danger";
  title: string;
  body: string;
}) {
  const toneClass = {
    success: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
    warning: "border-amber-500/30 bg-amber-500/5 text-amber-400",
    danger: "border-rose-500/30 bg-rose-500/5 text-rose-400",
  }[tone];
  return (
    <div className={`card-hover rounded-2xl border p-5 ${toneClass}`}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-5 w-5" />
        <div className="font-semibold">{title}</div>
      </div>
      <p className="text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
