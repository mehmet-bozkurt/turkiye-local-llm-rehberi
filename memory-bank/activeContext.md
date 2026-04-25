# Active Context

## Şu Anki Odak
**v0.2 — Büyük Model Araştırma Genişletmesi.** Kullanıcının aktif hedefi net: **Büyük modelleri (30B-70B+) uygun fiyata çalıştırmak; hız ikincil ama kullanılabilir seviyede olmalı.** Dashboard bu hedefe göre yeniden kalibre edildi.

## Kullanıcı Hedefi (Öncelikli)
> "Burada amacımız gerekirse yavaş olması kullanılabilir seviyede olması önemli elbette. Ama Büyük modelleri uygun fiyata çalıştırabilmek."

Bu, karar ekseninin **ham tokens/s** değil, **kullanılabilir bellek / TL** olduğu anlamına gelir.

## v0.2.2 Güncelleme — Q4: 2026 Yeni Sınıf AI Workstation'lar
- Yeni donanımlar: ASUS Ascent GX10 (250K TL TR, GB10), NVIDIA DGX Spark (290K, aynı çip), Framework Desktop Strix Halo 128GB (140K tahmini) ve 64GB (85K).
- Feasibility matrisine 24 yeni hücre; BudgetPathChart yeni sistemleri gösterir.
- Q4 araştırma girdisi: 3 büyük oyuncu kartı (GX10 / Framework / M5 Ultra beklentisi), güncel 70B Q4 karşılaştırma tablosu, Exo hybrid notu, 120K TL bütçesi için özet uyarı.
- Ana bulgu: **70B hızı için yeni sınıf para kaybı** (Dual 3090 @ 105K: 20 tok/s · GX10 @ 250K: 4.4 tok/s). Yeni sınıfın değeri 200B+ modellerde ve CUDA ekosistem gerekenlerde.
- Apple M5 Ultra Mac Studio beklenti: 2026 Q2-Q3 (WWDC ihtimali), 256GB+ unified, 32 CPU + 80 GPU core. Oyun değiştirebilir.
- Kaynaklar: ASUS Pressroom (15 Ekim 2025), NVIDIA Marketplace, Ollama blog, LMSYS, Tom's Hardware, llm-tracker.info, Framework resmi, Exo Labs, Tebilon.com (TR satış 249.957 TL).

## v0.2.1 Güncelleme — Q3: 120K TL Bütçe + Cluster Analizi
- `HardwareType`'a `cluster` eklendi; `nodeCount` + `interconnect` ("thunderbolt-4" | "thunderbolt-5" | "10gbe" | "infiniband" | "pcie") alanları eklendi.
- Yeni donanım profilleri: Mac mini M4 Pro 24GB/48GB/64GB + 3 cluster (4x M4 16, 2x M4 Pro 64, 4x M4 Pro 64).
- `usableLLMMemoryGB` cluster için tensor parallel overhead'i hesaba katar (TB5: %85, TB4: %75).
- Yeni chart: `BudgetPathChart` — Llama 70B Q4 pratik tok/s, 120K TL bütçe renk kodlu.
- Q3 araştırma girdisi: 6 yol (A-F) kartı, cluster ne zaman anlamlı tablosu, Exo benchmark doğrulama kaynakları.
- Fiyat kaynakları: Hepsiburada/Trendyol/MediaMarkt (M4 Pro), Troyestore (48GB), Apple TR (64GB), Swappa/eBay (M2 Ultra ikinci el), Exo Labs blog (benchmark).

## Son Değişiklikler (v0.2)
- `Hardware` tipine `approxPriceTRY`, `market` ("new"/"used") ve `memoryBandwidthGBs` alanları eklendi.
- `hardware.ts` 7 yeni profille genişletildi: Mac mini M4 16GB (30K TL), Mac Studio M4 Max 36GB (120K) ve 48GB (150K), Mac Studio M2 Ultra 64GB ikinci el (~115K), Mac Studio M3 Ultra 192GB (320K), PC tek RTX 3090 ikinci el (~70K), PC Dual RTX 3090 ikinci el (~105K).
- Yeni kullanım senaryosu: `large_model` (30B-70B+ çalıştırma, hız ikincil).
- `feasibilityMatrix.ts` 49+ yeni hücre ile güncellendi; tüm mevcut donanımlara `large_model` sütunu, yeni donanımlara tüm senaryolar.
- Yeni section: **09 · Araştırma Notları** (`ArastirmaNotlari.tsx`). İki kart:
  - Q1: Kasa mı Apple Silicon mı + Mac mini vs Mac Studio.
  - Q2 (primary): Büyük modelleri uygun fiyata — TL/GB bar chart + 3 kazanan + elenen adaylar.
- Yeni chart: `TryPerGBBarChart` (yatay bar, renk kodlu: yeşil ≥40GB, mavi 20-39 yeni, mor 20-39 ikinci el).
- Donanım tablosuna TL fiyat, bellek bant genişliği ve "2. El" rozeti eklendi.
- FizibiliteMatrisi insight'ı 3 madde yerine 5 madde; büyük model perspektifi öne çıkarıldı.

## Sıradaki Adımlar
1. **Araştırma günlüğü akışı**: Her yeni soru için yeni `<ResearchEntry />` eklenir; şablon stabilize edilmiş.
2. **Token/sec verilerini doğrulama**: Özellikle M2 Ultra 64GB ve Dual 3090 70B ölçümlerini topluluk benchmark'larıyla teyit et.
3. **Fine-tune/LoRA bölümü** düşünülebilir (özellikle Dual 3090 gerekçelendirmesi için).
4. **Elektrik maliyeti TCO grafiği**ni TL cinsinden de göster.

## Aktif Kararlar
- **Dil**: Tüm UI metinleri Türkçe. Teknik terimler orijinal.
- **Para birimi**: TL birincil (kullanıcı Türkiye'de), USD ikincil referans.
- **İkinci el** profilleri ayrı bir `market: "used"` işaretiyle modellenir; uyarılar kartlarda görünür kalır.
- **Araştırma Notları bölümü** canlı tutulacak; her yeni soru ayrı bir `<ResearchEntry />` olarak eklenir.

## Açık Sorular
- Fine-tuning (LoRA/DPO) kullanıcı için gerçekten gerekli mi? Eğer değilse Apple tarafı rekabet daha güçlü.
- Ses seviyesi ve fiziksel yerleşim (ofis mi, oda mı) — karar ağacında ikinci kat ayrım olabilir.
