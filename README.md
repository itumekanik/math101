# Matematik Öğrenme Yolu · Mathematics Learning Path

21 derslik üniversite matematiği müfredatını tarayıcıda tamamen çevrimdışı çalışan, etkileşimli 2B/3B görselleştirmeler, adım adım ispatlar, aranabilir kavram sözlüğü ve doğrulamalı alıştırmalarla sunan öğretim platformu.

## Kapsanan Müfredat (21 Ders · 18 Bölüm)

### I. Fonksiyonlar, Vektörler ve Analitik Geometri (Ders 1–5)
1. **Lecture 1:** Functions + Transcendental functions (`functions.html`)
2. **Lecture 2:** Numbers, points, and vectors (`vectors.html`)
3. **Lecture 3+4:** Plane geometry (`plane-geometry.html`)
4. **Lecture 5:** Space geometry (`space-geometry.html`) — *etkileşimli 3B döndürülebilir sahne*

### II. Lineer Cebir (Ders 6–12)
5. **Lecture 6:** Matrices and vectors (`matrices.html`)
6. **Lecture 7:** Square matrices (`square-matrices.html`)
7. **Lecture 8:** Linear systems (`linear-systems.html`) — *adım adım Gauss–Jordan (RREF) oynatıcı*
8. **Lecture 9+10:** Vector spaces (`vector-spaces.html`)
9. **Lecture 11:** Basis, dimension, and coordinates (`basis-dimension.html`)
10. **Lecture 12:** Inner product spaces + Best approximation (`inner-product.html`) — *Gram–Schmidt & En Küçük Kareler*

### III. Limit ve Türev (Ders 13–15)
11. **Lecture 13:** Limits (`limits.html`) — *etkileşimli ε–δ tüpü ve Sandviç Teoremi*
12. **Lecture 14+15:** Derivatives + Applications of derivatives (`derivatives.html`) — *Kiriş→Teğet, MVT ve Newton–Raphson*

### IV. Seriler ve İntegral Hesabı (Ders 16–20)
13. **Lecture 16:** Sequences + series of real numbers (`sequences-series.html`)
14. **Lecture 17:** Function series (`function-series.html`) — *Düzgün yakınsaklık ve Taylor/Maclaurin tezgâhı*
15. **Lecture 18:** Indefinite integrals (`indefinite-integrals.html`)
16. **Lecture 19:** Definite integrals (`definite-integrals.html`) — *Riemann toplamları ve FTC*
17. **Lecture 20:** Applications of definite integrals (`integral-apps.html`) — *3B dönel cisim hacmi & yay uzunluğu*

### V. Karmaşık Sayılar (Ders 21)
18. **Lecture 21:** Complex numbers (`complex-numbers.html`) — *Argand düzlemi, Euler & n. dereceden kökler*

## Nasıl Çalıştırılır?

- **Çevrimdışı (sunucusuz):** `dist/index.html` dosyasına doğrudan çift tıklayın. Tüm scriptler IIFE olarak paketlenmiştir ve KaTeX yazı tipleri CSS içine gömülüdür.
- **Windows tek tık:** `start.bat` dosyasına çift tıklayın (`http://127.0.0.1:4173/`).
- **Geliştirme (Node.js 22+):**
  ```bash
  npm install
  npm run dev       # http://127.0.0.1:5173/ (canlı yeniden yükleme)
  npm run build     # dist/ üretim derlemesi
  npm run preview   # dist/ önizleme sunucusu (http://127.0.0.1:4173/)
  npm run check     # typecheck + unit tests + build
  ```

## Özellikler

- **4 Sekme / Bölüm:** `Teori` (canlı 2B/3B görselleştirmeler), `Deneme alanı` (etkileşimli laboratuvar), `Formüller & İspat` (satır satır açılan ispatlar), `Alıştırma` (anında geri bildirim & tarayıcıda kayıtlı ilerleme).
- **TR / EN Anlık Dil Geçişi** ve **Açık / Koyu / Sistem Teması** (tüm 2B/3B canvaslar temayla anında yeniden boyanır).
- **Matematik Sözlüğü (`Sözlük` / `Glossary`):** Metin içi noktalı altı çizili kavram kartları ve sağdan açılan aranabilir kavram paneli.

## GitHub Pages Yayını

Bu depo, `main` dalına her push sonrasında [.github/workflows/pages.yml](.github/workflows/pages.yml) iş akışıyla otomatik olarak test edilip derlenir ve çevrimdışı indirilebilir ZIP paketi (`math-learning-path.zip`) ile birlikte GitHub Pages'e yayınlanır.

Tek seferlik GitHub ayarı: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
