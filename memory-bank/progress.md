# Progress

## Tamamlananlar
- [x] Proje iskeleti: Vite + React 18 + TS + Tailwind + Radix primitives
- [x] Memory Bank dokümantasyon dosyaları (6 çekirdek dosya)
- [x] Veri modelleri (`src/types/index.ts`)
- [x] Veri katmanı: `models.ts`, `hardware.ts`, `runtimes.ts`, `useCases.ts`, `cloudPricing.ts`, `feasibilityMatrix.ts`
- [x] Hesaplama lib'i (`src/lib/calc.ts`) — VRAM tahmini, TCO, fizibilite skoru
- [x] Layout + SideNav + scroll-spy
- [x] Chart'lar: ModelVramBar, RuntimeRadar, CostTco, FeasibilityHeatmap, TokensPerSecScatter
- [x] 9 bölüm (00-Intro → 08-Sonuc)
- [x] Koyu tema, hover kuralına uyum
- [x] README

## Tamamlananlar (v0.2)
- [x] `Hardware` tipine `approxPriceTRY` + `market` + `memoryBandwidthGBs` alanları.
- [x] 7 yeni donanım profili (Mac mini M4, Mac Studio M4 Max 36/48, M2 Ultra 64 ikinci el, M3 Ultra 192, tek/dual RTX 3090 ikinci el).
- [x] Yeni `large_model` kullanım senaryosu (kullanıcının aktif hedefi).
- [x] Fizibilite matrisi 49+ yeni hücre ile güncellendi.
- [x] Yeni section: **09 · Araştırma Notları** (Q1: kasa vs Apple + mini/studio; Q2: büyük model sweet spot).
- [x] Yeni chart: TL/GB bar (büyük model perspektifi).
- [x] Donanım tablosu: TL fiyat, bant genişliği, "2. El" rozeti.

## Yapılacaklar
- [ ] Tokens/sec için daha kapsamlı gerçek benchmark verisi (özellikle 70B ölçümleri).
- [ ] "Maliyet" bölümünde interaktif slider (günlük token sayısı).
- [ ] Karar ağacı / flowchart görseli (mermaid yerine özel SVG).
- [ ] TCO bölümüne TL senaryosu (Türkiye elektrik fiyatı).
- [ ] Fine-tune / LoRA bölümü (Dual 3090 gerekçelendirmesi).
- [ ] Erişilebilirlik denetimi (axe-core manuel).
- [ ] Deployment pipeline (GitHub Pages veya Vercel).

## Bilinen Sorunlar / Notlar
- Model/runtime verileri 2025 ortası-2026 başı referanslıdır; her ay tazelenmesi gerekir.
- TL fiyatlar Türkiye pazarı (2026-Q1) referanslı, Apple resmi + ikinci el platform ortalaması.
- FeasibilityHeatmap ve Donanım tablosu 14 satıra ulaştı; mobilde yatay kaydırma zorunlu.

## Sürüm
- v0.1.0 — İlk çalışır versiyon.
- v0.2.0 — Türkiye pazarı + büyük model perspektifi + araştırma günlüğü.
- v0.2.1 — Q3: 120K TL bütçe optimizasyonu + Mac mini cluster (Exo) analizi + BudgetPathChart.
- v0.2.2 — Q3-ek: Head-to-Head (4x Mac mini vs Dual 3090 spec-spec karşılaştırma).
- v0.2.3 — Q4: 2026 yeni sınıf AI workstation'lar (ASUS GX10, DGX Spark, Strix Halo, M5 Ultra beklentisi).
