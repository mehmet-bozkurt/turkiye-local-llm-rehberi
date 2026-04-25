# LocalAI Analiz Dashboard - Project Brief

## Amaç
Yerel bir bilgisayarda yapay zeka (özellikle LLM ve multimodal modeller) çalıştırmanın **mantıklı olup olmadığına** karar vermek, **en iyi yöntemi** analiz etmek ve bu analizi **interaktif bir dashboard** üzerinden görsel hale getirmek.

## Kapsam
- %100 client-side (backend yok), static deploy edilebilir bir web uygulaması.
- Model / donanım / runtime / kullanım senaryosu / maliyet (yerel vs cloud API) karşılaştırmaları.
- Araştırma sürecindeki bulguların biriktirildiği canlı bir belge niteliği taşır: veri dosyaları ve markdown notları üzerinden güncellenir.

## Hedef Kullanıcı
Proje sahibinin kendisi (kişisel karar destek aracı). İkincil olarak: benzer kararı vermek isteyen geliştiriciler için paylaşılabilir bir referans.

## Başarı Kriterleri
1. Kullanıcı, 5 dakika içinde kendi senaryosu için "yerel mi / cloud mu" kararına yönelik net bir veri seti ve öneri görebilmelidir.
2. Yeni bir model, donanım veya runtime ortaya çıktığında **sadece veri dosyasına ekleme yaparak** dashboard otomatik güncellenebilmelidir.
3. Görselleştirmeler tek sayfada akıcı biçimde okunabilir; scroll-spy ile navigasyon kolay olmalıdır.

## Kapsam Dışı (Non-Goals)
- Gerçek zamanlı benchmark çalıştırma.
- Sistem tarama (lokal donanım tespiti).
- Cloud API üzerinden canlı fiyat çekme.
- Kullanıcı hesabı, kayıt, backend servisleri.
