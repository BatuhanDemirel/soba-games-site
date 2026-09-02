# soba.games — SoBa oyun stüdyosu sitesi

Bağımlılıksız statik site. GitHub Pages, `main` dalı, kök dizinden yayın. `main`'e push edilen her şey otomatik yayına girer.

## Yapı

```
/                      Stüdyo ana sayfası (index.html)
/kahvehane/            Kahvehane oyun sayfası
/support.html          Destek + SSS (tüm oyunlar)
/privacy.html          → /gizlilik/ yönlendirmesi (URL Play Console'da kayıtlı, DEĞİŞTİRME)
/gizlilik/             Gizlilik politikası, dil başına ayrı sayfa (kendi CSS'i var, DOKUNMA)
/assets/css/site.css   Ortak stil (yeşil çuha + altın + serif)
/assets/js/i18n.js     Ortak dil motoru (tr/en/de/fr)
/assets/img/<oyun>/    Oyun görselleri (hero.webp, og.png, ekran görüntüleri)
/_template-game/       Yeni oyun sayfası şablonu (robots.txt ile taramadan hariç)
/sitemap.xml, /robots.txt, /404.html
```

**Dokunulmazlar:** `app-ads.txt` (AdMob doğrulaması), `CNAME` (soba.games), `/gizlilik/*` ve `privacy.html` URL'i.

## Diller

Her sayfa tek HTML dosyasıdır; metinler sayfanın altındaki `window.PAGE_I18N` sözlüğünde 4 dilde tutulur, ortak öğeler (menü, altbilgi) `assets/js/i18n.js` içindeki `COMMON`'da.

- `data-i18n="key"` → metin, `data-i18n-html="key"` → HTML, `data-i18n-attr="alt:key"` → nitelik.
- `meta_title` / `meta_desc` anahtarları `<title>`, description, OG ve Twitter etiketlerini günceller.
- Türkçe temiz URL'de (`/kahvehane/`), diğer diller `?lang=en|de|fr` ile. hreflang etiketleri ve sitemap bu adresleri kullanır.
- Dil seçimi önceliği: `?lang=` → localStorage → tarayıcı dili → tr.

Yeni bir metin eklerken **dört dilde de** anahtarı doldur; eksik anahtar öğeyi boş bırakır.

## Yeni oyun ekleme (4 adım)

1. **Klasör:** `_template-game/` klasörünü `/<slug>/` olarak kopyala. İçindeki `SLUG`, `OYUN_ADI`/`GAME_NAME`, `PAKET_ADI` yer tutucularını değiştir; `<meta name="robots" content="noindex">` satırını `index, follow` yap; `PAGE_I18N` sözlüğünü 4 dilde doldur.
2. **Görseller:** `/assets/img/<slug>/` altına `hero.webp` (1024×500, üstünde yazı OLMASIN — slogan `tagline` anahtarıyla HTML olarak biner), `og.png` (1200×630) ve ekran görüntülerini koy.
3. **Ana sayfa kartı:** `index.html` içindeki `<!-- OYUN KARTI -->` bloğunu kopyala, yolları ve anahtarları (`kh_*` → `<kısaltma>_*`) değiştir, anahtarları ana sayfanın `PAGE_I18N` sözlüğüne 4 dilde ekle.
4. **Sitemap:** `sitemap.xml` içindeki `<!-- OYUN: Kahvehane -->` bloğunu kopyalayıp `<slug>` ile güncelle. Gerekirse `support.html` SSS'ine oyuna özel soru ekle.

Yerelde test: `python3 -m http.server 8000` → `http://localhost:8000/`, `?lang=en` ile dilleri kontrol et.
