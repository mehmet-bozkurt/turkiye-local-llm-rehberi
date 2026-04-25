import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";
import { FeasibilityHeatmap } from "../charts/FeasibilityHeatmap";
import { MarkdownNote } from "../MarkdownNote";

export function FizibiliteMatrisi() {
  return (
    <Section id="fizibilite">
      <SectionHeader
        eyebrow="07 · Fizibilite Matrisi"
        title="Donanım × Senaryo tek ekranda"
        description="Her hücre 0-100 arası bir fizibilite skoru: VRAM uyumu, tokens/s, kalite ve kullanım kolaylığının ağırlıklı ortalaması. Hücreye hover yap, önerilen model ve runtime'ı gör."
      />

      <FeasibilityHeatmap />

      <MarkdownNote tone="info" title="Skor formülü">
{`\`score = weighted(vramFit, speed, quality, ease)\`, ağırlıklar senaryoya göre değişir:

- **Latency hassas** işler (chat, kod): speed ağırlığı yüksek.
- **Kalite hassas** işler (RAG, reasoning): quality ağırlığı yüksek.
- **VRAM sığmazsa**: skor otomatik kırpılır (partial offload cezası).`}
      </MarkdownNote>

      <MarkdownNote tone="insight" title="Matristen çıkan 5 büyük mesaj">
{`1. **Mac mini M4 16GB (30K TL) şok değer**: Chat/özetleme/RAG'te 80+ skor; ama "Büyük Model" sütununda 5'te kalır — 16GB unified bellek 30B'yi bile kaldırmaz.
2. **Mac Studio M4 Max 36GB (120K TL) tuzak olabilir**: Genel senaryolarda mükemmel ama büyük model sütununda sadece 48 — 4x fiyata aldığın şey büyük model değil, hızlı 32B.
3. **Büyük Model sütununda 2 gerçek kazanan**: **Dual RTX 3090 ikinci el (92)** ve **Mac Studio M2 Ultra 64GB ikinci el (88)**. İkisi de ~105-115K TL, ikisi de 70B Q4 makul hızda.
4. **RTX 4070 sweet spot**: 50K TL bütçede çoğu senaryoda "İyi-Mükemmel". Büyük modeller için zayıf, 7-14B için ideal.
5. **CPU-only / Raspberry Pi**: Sadece batch özetleme gibi arka plan işleri için anlamlı.`}
      </MarkdownNote>
    </Section>
  );
}
