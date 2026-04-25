# Product Context

## Neden Bu Proje?
LLM ekosistemi 2024-2026 arasında patladı; Ollama, llama.cpp, LM Studio, vLLM gibi araçlar ile Llama 3.x, Qwen 2.5, DeepSeek, Phi-4, Gemma 3 gibi açık modeller günlük hayatta kullanılabilir hâle geldi. Ancak:

- **Belirsizlik**: Hangi donanımda hangi model çalışır? Apple Silicon mı, NVIDIA GPU mu, yoksa CPU yeter mi?
- **Maliyet karmaşası**: 8.000$'lık bir workstation mı, yoksa aylık 20$'lık bir cloud API mi? Ara çözümler ne?
- **Yöntem zenginliği**: Runtime seçimi (Ollama vs vLLM vs llama.cpp) performansı, kurulum zorluğunu ve esnekliği radikal biçimde değiştiriyor.

Kullanıcı bu kararı almak için birden fazla blog, YouTube videosu ve Reddit başlığı okuduğunda bilgi dağınık ve güncelliğini çabuk yitiriyor. Bu proje **tek bir yerde, yapılandırılmış verilerle karşılaştırma** yapmayı amaçlar.

## Problemi Çözme Yaklaşımı
1. **Veri-öncelikli tasarım**: Her bilgi parçası `src/data/*.ts` içinde tek tipli TypeScript objesi. UI otomatik türemeli.
2. **Senaryo bazlı yorum**: "Chat", "Kod tamamlama", "RAG", "Özetleme", "Görsel üretimi" gibi somut senaryolara indirgenir.
3. **Çok eksenli karşılaştırma**: Kalite, hız, VRAM uygunluğu, kullanım kolaylığı, maliyet — radar, bar, scatter, heatmap ile paralel olarak sunulur.
4. **Canlı araştırma notları**: `MarkdownNote` bileşeni ile zamanla eklenen gözlemler bölümlere iliştirilir.

## Kullanıcı Deneyimi Hedefleri
- Koyu tema, yüksek kontrast, veri vurgulu (dashboard estetiği).
- Sol sticky nav + sağ akıcı içerik (scroll-spy ile aktif bölüm vurgusu).
- Tüm grafiklerde **veri tablosu karşılığı** (erişilebilirlik + yazdırma dostu).
- Minimum tıklama: hiçbir karar için 3+ etkileşim gerekmemeli.
- Hover efektlerinde translate hareketi YOK (user rule); yalnızca `shadow`, `color`, `scale`, `opacity`.
