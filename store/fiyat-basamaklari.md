# Fiyat basamakları (1.9.0)

Oyun kodu yeni ürünleri hazır bekliyor. App Store Connect'te (ve Android satın alma açıldığında Play Console'da) aşağıdaki üç ürünü **aynı kimliklerle** oluşturman gerekiyor. Ürün mağazada yoksa oyun o kartı göstermez, bir şey bozulmaz.

## Yeni ürünler

| Kimlik (Product ID) | Tür | Önerilen TR fiyatı | Not |
|---|---|---|---|
| `com.ozsstudio.bitpazari.baslangic` | Tüketilebilir (Consumable) | ₺49,99 | İçinde oyun parası olduğu için tüketilebilir. Bir kez alınabilmesini oyun sağlar. |
| `com.ozsstudio.bitpazari.kese_kucuk` | Tüketilebilir | ₺29,99 | Küçük Kese: normal kesenin %30'u |
| `com.ozsstudio.bitpazari.kese_buyuk` | Tüketilebilir | ₺199,99 | Büyük Sandık: normal kesenin 3 katı |

Mevcut `com.ozsstudio.bitpazari.kese` orta boy olarak kalıyor (önerilen ₺79,99, "En popüler" etiketli).

## Tüm merdiven

| Basamak | Ürün | Önerilen fiyat | Oyunda ne zaman çıkar |
|---|---|---|---|
| İlk ödeme | Başlangıç Paketi | ₺49,99 | 2. günün sabahı, 48 saat. Para + nadir parça + 3 gün reklamsız |
| Küçük harcama | Küçük Kese / Esnaf Kesesi / Büyük Sandık | ₺29,99 / ₺79,99 / ₺199,99 | Mağazada her zaman |
| Biriken değer | Kumbara | ₺79,99 | Kumbara 3.000 ₺'yi geçince |
| Düzenli gelir | Sezon Kartı | ₺99,99 | Her sezon |
| İçerik | Çırak, Tarih, Dekor paketleri | ₺99,99–129,99 | İlgili özelliğe dokununca |
| Hepsi bir arada | Premium | ₺249,99 | Mağazada her zaman. Üç paketin toplamı üstü çizili görünür |
| İndirim | Premium fırsat | ₺174,99 | **Değişti:** artık 4. günde ya da ilk satın almadan hemen sonra (önceden 2. gündeydi, Başlangıç Paketi ile çakışmasın diye) |

## Fiyatı elle sabitle

Apple, Türkiye fiyatlarını kur değişince otomatik günceller. ₺49,99 gibi eşikleri korumak için App Store Connect › Fiyatlandırma'da Türkiye fiyatını elle belirle (otomatik eşitlemeyi kapat).

## Ölçülecekler (Firebase)

- `deal_start` (k: `baslangic`) → `iap_result` (product: `baslangic`, result: `ok`): Başlangıç Paketi dönüşümü
- `iap_result` içinde ürün dağılımı: kese boylarından hangisi seçiliyor
- Başlangıç Paketi alanların sonradan Premium alma oranı
