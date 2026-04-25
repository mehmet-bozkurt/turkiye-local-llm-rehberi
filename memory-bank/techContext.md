# Tech Context

## Teknolojiler
| Katman | Seçim | Neden |
|---|---|---|
| Build tool | Vite 5 | Next.js'e göre daha hafif; backend yok, SSR gereksiz |
| UI library | React 18 + TypeScript 5 | Ekosistem + tip güvenliği |
| Stil | Tailwind CSS 3.4 + CSS variables | Tutarlı koyu tema + dinamik renk |
| Component primitives | Radix UI (@radix-ui/react-*) | Shadcn-style kopyala-sahiplen yaklaşımı |
| Grafikler | Recharts 2.x | React-native API, TypeScript uyumlu |
| Animasyon | Framer Motion 11 | Güvenilir, kural uyumlu (translate'siz konfigürasyon) |
| Markdown | react-markdown + remark-gfm | Araştırma notları için |
| Icons | lucide-react | Tutarlı, ağaç-silinebilir |
| Utility | clsx + tailwind-merge + class-variance-authority | Tipik shadcn stack |

## Geliştirme Ortamı
- Node.js 18+.
- `npm run dev` → http://localhost:5173.
- `npm run build` → `dist/` static output.
- `npm run preview` → build çıktısını lokal sun.

## Kod Stili
- Strict TypeScript (`noUnusedLocals`, `noUnusedParameters` açık).
- Path alias: `@/*` → `src/*`.
- ESM only (`"type": "module"`).
- Markdown ve JSON importları bundler tarafından TypeScript path resolver ile çözülür.

## Teknik Kısıtlar
1. **Backend yasak** (user gereksinimi): Fetch yok, API yok. Veri derlenme zamanında gömülüdür.
2. **Hover efektleri**: `transform: translateY(...)` ve `transform: translateX(...)` kesinlikle yasak.
3. **GSB API yok**: Bu projede GSB API kullanılmaz (mevcut user rule'un bu projeyle ilgisi yok ama uyarı).
4. **Veri güncel tutulmalı**: Her veri objesinin `lastUpdated` veya kaynak URL'si eklenmeli.

## Deployment
- GitHub Pages, Vercel, Netlify veya herhangi bir static host.
- Custom base path gerekirse `vite.config.ts` içinde `base: '/LocalAI/'` ayarlanır (şu anda root).

## Güvenlik / Gizlilik
- Kullanıcı verisi toplanmaz.
- Harici fontlar dışında external request yok (Google Fonts; istenirse offline'a alınabilir).
