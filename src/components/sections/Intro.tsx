import { Cpu, Zap, Lock, DollarSign } from "lucide-react";
import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";
import { StatCard } from "../StatCard";
import { Badge } from "@/components/ui/badge";
import { models } from "@/data/models";
import { hardwareProfiles } from "@/data/hardware";
import { runtimes } from "@/data/runtimes";

export function Intro() {
  return (
    <Section id="intro">
      <div className="mb-10 flex flex-wrap items-center gap-2">
        <Badge variant="accent">Kişisel Araştırma</Badge>
        <Badge variant="outline">Client-side dashboard</Badge>
        <Badge variant="outline">Veri: 2026-Q1</Badge>
      </div>

      <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
        Yerel bir bilgisayarda{" "}
        <span className="section-gradient-text">yapay zeka çalıştırmak</span>{" "}
        mantıklı mı?
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        Bu dashboard; model, donanım, runtime ve maliyet ekseninde veri odaklı
        bir karar çerçevesi sunar. Kendi kullanım senaryon için en uygun
        yöntemi bulmak için aşağı kaydır.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Analiz edilen model"
          value={models.length}
          icon={Cpu}
          tone="primary"
        />
        <StatCard
          label="Donanım profili"
          value={hardwareProfiles.length}
          icon={Zap}
          tone="accent"
        />
        <StatCard
          label="Runtime / araç"
          value={runtimes.length}
          icon={Lock}
          tone="success"
        />
        <StatCard
          label="Karşılaştırma ekseni"
          value={4}
          unit="kalite · hız · maliyet · kolaylık"
          icon={DollarSign}
          tone="warning"
        />
      </div>

      <SectionHeader
        className="mt-16"
        eyebrow="Hızlı özet"
        title="TL;DR"
        description="Araştırmanın sonuçları tek bakışta."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard
          tone="success"
          title="Mantıklı"
          points={[
            "Gizlilik kritikse (tıbbi, hukuki, şirket içi)",
            "Günlük tüketim yüksekse (>500K token/gün)",
            "Zaten güçlü bir Apple Silicon / NVIDIA GPU varsa",
            "Offline / air-gapped senaryolar",
          ]}
        />
        <SummaryCard
          tone="warning"
          title="Duruma göre"
          points={[
            "Kod tamamlama: lokal 14-32B model iş görür",
            "Araştırma/öğrenme: lokal + cloud hibrit en iyisi",
            "Multimodal: güçlü donanım gerekli",
            "7-14B quant modeller çoğu iş için yeterli",
          ]}
        />
        <SummaryCard
          tone="danger"
          title="Mantıksız"
          points={[
            "Düşük kullanım + pahalı donanım yatırımı",
            "Frontier (GPT-4/Claude Opus) kalitesi şartsa",
            "Sadece sporadik kullanım",
            "Elektrik maliyeti çok yüksekse",
          ]}
        />
      </div>
    </Section>
  );
}

function SummaryCard({
  title,
  points,
  tone,
}: {
  title: string;
  points: string[];
  tone: "success" | "warning" | "danger";
}) {
  const toneClasses = {
    success: "border-emerald-500/30 bg-emerald-500/5",
    warning: "border-amber-500/30 bg-amber-500/5",
    danger: "border-rose-500/30 bg-rose-500/5",
  }[tone];
  const titleClasses = {
    success: "text-emerald-400",
    warning: "text-amber-400",
    danger: "text-rose-400",
  }[tone];
  return (
    <div
      className={`card-hover rounded-2xl border p-5 ${toneClasses}`}
    >
      <div className={`mb-3 font-semibold ${titleClasses}`}>{title}</div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {points.map((p) => (
          <li key={p} className="flex gap-2">
            <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${titleClasses} bg-current`} />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
