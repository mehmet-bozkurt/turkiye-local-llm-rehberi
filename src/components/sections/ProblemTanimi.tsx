import { Shield, Gauge, WifiOff, Wallet, Settings, GitBranch } from "lucide-react";
import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { MarkdownNote } from "../MarkdownNote";

const pros = [
  {
    icon: Shield,
    title: "Gizlilik",
    body: "Veriler makineden çıkmaz. Tıbbi, hukuki, şirket içi belgeler için kritik avantaj.",
  },
  {
    icon: WifiOff,
    title: "Offline & Bağımsızlık",
    body: "İnternet yoksa veya API servisleri düşerse çalışmaya devam eder. API fiyat/kota değişikliklerinden etkilenmez.",
  },
  {
    icon: Gauge,
    title: "Düşük Latency",
    body: "RTT ortadan kalkar. İlk token bekleme süresi düşer (özellikle küçük modellerde).",
  },
  {
    icon: Wallet,
    title: "Yüksek Hacim Maliyet",
    body: "Günlük tüketim yüksekse (>500K token) amortize yerel donanım cloud API'den ucuza gelir.",
  },
  {
    icon: Settings,
    title: "Tam Kontrol",
    body: "Model, prompt, system message, log — her şey senin. Fine-tune, LoRA, özel quantization yapılabilir.",
  },
  {
    icon: GitBranch,
    title: "Araştırma & Öğrenme",
    body: "Modelin iç mekanizmasını (logits, attention, embeddings) doğrudan gözlemleyebilirsin.",
  },
];

const cons = [
  {
    title: "Başlangıç yatırımı",
    body: "Güçlü bir GPU veya Apple Silicon laptop 65.000-160.000 ₺ arası. Çoğu kullanıcı için sabit giderleşir.",
  },
  {
    title: "Bakım yükü",
    body: "Driver, CUDA, ROCm, Python env, quantization — zaman alır. Bir hobi/öğrenme aktivitesi olmadığı sürece yorucu.",
  },
  {
    title: "Kalite tavanı",
    body: "Frontier modeller (GPT-4, Claude Opus) tüketici donanımında lokal çalışmaz. 70B Q4 en iyi senaryo.",
  },
  {
    title: "Güç + ısı + ses",
    body: "Dual 4090 workstation kWh başına ciddi elektrik, aktif soğutma ve gürültü demektir.",
  },
  {
    title: "Zaman harcama",
    body: "Yerel kurulum + deneme iterasyonu saatlerce sürebilir. Cloud API 5 dakikada çalışır.",
  },
];

export function ProblemTanimi() {
  return (
    <Section id="problem">
      <SectionHeader
        eyebrow="01 · Problem Tanımı"
        title="Neden Yerel AI? Neden olmasın?"
        description="Yerel çalıştırmanın avantajları ve dezavantajları. Karar çerçevesinin temeli burada."
      />

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pros.map((p) => (
          <Card key={p.title} className="card-hover">
            <CardContent className="flex flex-col gap-2 p-5">
              <div className="flex items-center gap-2 text-primary">
                <p.icon className="h-5 w-5" />
                <span className="font-semibold">{p.title}</span>
              </div>
              <p className="text-sm text-muted-foreground">{p.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <SectionHeader
        eyebrow="Dezavantajlar"
        title="Gerçekçi olalım: karanlık taraf"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {cons.map((c) => (
          <div
            key={c.title}
            className="card-hover rounded-2xl border border-rose-500/25 bg-rose-500/5 p-5"
          >
            <div className="mb-1 font-semibold text-rose-300">{c.title}</div>
            <p className="text-sm text-muted-foreground">{c.body}</p>
          </div>
        ))}
      </div>

      <MarkdownNote tone="insight" title="Araştırma notu">
{`Yerel AI tartışmasında **tek doğru cevap yok**. Kararı 3 boyutta ver:

1. **Kullanım hacmi** — günde kaç token?
2. **Kalite hassasiyeti** — frontier şart mı, 8B yeter mi?
3. **Gizlilik/kontrol** — veriler dışarı çıkabilir mi?

Sonraki bölümlerde her boyutu veriyle eşleştireceğiz.`}
      </MarkdownNote>
    </Section>
  );
}
