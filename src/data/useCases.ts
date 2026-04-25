import type { UseCase } from "@/types";

export const useCases: UseCase[] = [
  {
    id: "chat",
    name: "Genel Sohbet Asistanı",
    description:
      "Günlük sorular, beyin fırtınası, yazı yazımı, dil pratiği gibi genel amaçlı konuşmalar.",
    minParams: 3,
    recommendedParams: 8,
    latencySensitivity: 4,
    qualitySensitivity: 3,
    avgTokensPerDay: 50_000,
    notes:
      "7-8B quant modeller bu iş için yeterli. Cloud'un (GPT-4o) kalitesine yaklaşmak için 70B gerekli.",
  },
  {
    id: "code",
    name: "Kod Tamamlama & Yardım",
    description:
      "IDE entegrasyonu, kod açıklama, test üretimi, refactoring önerileri.",
    minParams: 7,
    recommendedParams: 14,
    latencySensitivity: 5,
    qualitySensitivity: 5,
    avgTokensPerDay: 150_000,
    notes:
      "Tokens/s burada kritik: <30 tokens/s üretkenliği azaltır. Qwen 2.5 Coder ve DeepSeek-R1 öne çıkar.",
  },
  {
    id: "rag",
    name: "RAG (Belge Soru-Cevap)",
    description:
      "Şirket içi dokümanlar, PDF, kod tabanı üzerinden retrieval-augmented sorgular.",
    minParams: 7,
    recommendedParams: 12,
    latencySensitivity: 3,
    qualitySensitivity: 4,
    avgTokensPerDay: 80_000,
    notes:
      "Uzun context ve tool-calling önemli. Mistral Nemo, Llama 3.1, Qwen 2.5 idealdir.",
  },
  {
    id: "summarize",
    name: "Özetleme & Yazım Yardımı",
    description:
      "Uzun metinleri özetleme, e-posta düzeltme, blog özeti, toplantı notu çıkarma.",
    minParams: 3,
    recommendedParams: 8,
    latencySensitivity: 3,
    qualitySensitivity: 4,
    avgTokensPerDay: 30_000,
    notes:
      "Küçük modeller bile başarılı; kalite için 8B+ önerilir. Batch çalıştırılabilir.",
  },
  {
    id: "large_model",
    name: "Büyük Model (30B-70B+)",
    description:
      "30B-70B+ modelleri yerel çalıştırma. Hız ikinci planda; kullanılabilir seviyede (≥5 tok/s) sığma şart.",
    minParams: 30,
    recommendedParams: 70,
    latencySensitivity: 2,
    qualitySensitivity: 5,
    avgTokensPerDay: 40_000,
    notes:
      "Kritik metrik: kullanılabilir bellek / TL. Dual 3090 ve M2 Ultra 64GB ikinci el sweet spot.",
  },
  {
    id: "vision",
    name: "Multimodal (Görsel Anlama)",
    description:
      "Görsel+metin girişi alıp açıklama, OCR, UI analizi, diyagram yorumlama.",
    minParams: 7,
    recommendedParams: 12,
    latencySensitivity: 3,
    qualitySensitivity: 4,
    avgTokensPerDay: 20_000,
    notes:
      "Gemma 3, Llama 3.2 Vision, Qwen2.5-VL gibi modeller; VRAM ihtiyacı metin-only'den fazla.",
  },
];

export const getUseCaseById = (id: string) => useCases.find((u) => u.id === id);
