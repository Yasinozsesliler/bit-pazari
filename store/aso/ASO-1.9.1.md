# Bit Pazarı 1.9.1: mağaza sayfası ve yeni paketler

Bu dosya, 1.9.1 ile App Store Connect'e girilecek her şeyi bir arada tutar. Karakter sayıları kontrol edildi.

## Düzeltme: Türkiye'de hangi İngilizce sayfa aranıyor?

`ASO-PLANI.md` İngilizce (ABD) sayfanın Türkiye'de arandığını söylüyordu. Doğrusu **İngilizce (Birleşik Krallık)**: Türkiye mağazası Türkçe sayfanın yanında İngilizce (Birleşik Krallık) ve Fransızca sayfaları da arama için tarıyor. Bizde İngilizce (Birleşik Krallık) sayfa yok, yani 100 karakterlik kelime alanı ve 30+30 karakterlik ad/alt başlık boşta duruyor.

Apple bir kelimeyi bu sayfaların hangisinde geçerse geçsin bir kez sayar. Bu yüzden aşağıda Türkçe ve İngilizce (Birleşik Krallık) alanlarında aynı kelime iki kez geçmiyor.

## 1. Hemen (sürüm beklemeden): tanıtım metni

Tanıtım metni (Promotional Text) yeni sürüm gerektirmez, kaydedince yayına girer.

| Dil | Metin | Karakter |
|---|---|---|
| Türkçe | Yeni: Mezat Gecesi! Kendi müzayedeni kur, tokmağı sen vur. Kırık malı onar, paketleyip kargola, İstanbul'un en büyük antikacısı ol. | 131/170 |
| İngilizce (ABD ve Birleşik Krallık) | New: Auction Night! Run your own auction and bring down the hammer. Restore broken finds, pack and ship them, and become Istanbul's top antique dealer. | 151/170 |

1.9.1 onaylanınca tanıtım metnini paketlere çevir:

| Dil | Metin | Karakter |
|---|---|---|
| Türkçe | Yeni: 7 paket! 90'lar, Eski İstanbul, Hamam, Hat ve Harita, Halı ve Kilim, Para ve Altın, Mahalle Bakkalı. 51 yeni 3B eşya, hikâyeli müşteriler. | 144/170 |
| İngilizce | New: 7 packs! 90s Nostalgia, Old Istanbul, Hammam, Calligraphy & Maps, Carpets & Kilims, Coins & Gold, Corner Grocer. 51 new 3D items. | 134/170 |

## 2. 1.9.1 ile: ad, alt başlık, anahtar kelimeler

| Dil | Ad | Alt başlık | Anahtar kelimeler |
|---|---|---|---|
| Türkçe | `Bit Pazarı: Antika Simülatörü` (aynı, 29) | `Pazarlık, Mezat, Rehinci Oyunu` (30) | `ikinci el,dükkan,antikacı,simülasyon,tüccar,esnaf,işletme,nostalji,müzayede,koleksiyon,tamir,sahte` (98) |
| **İngilizce (Birleşik Krallık), yeni** | `Bit Pazari: Pawn Shop Tycoon` (28) | `Antique Haggle & Auction Sim` (28) | `dealer,flea,market,bargain,trade,collector,fake,merchant,store,restore,treasure,business,thrift` (95) |
| İngilizce (ABD) | `Bit Pazari: Antique Dealer` (aynı, 26) | `Pawn Shop & Auction Simulator` (29) | `flea,market,bargain,trade,tycoon,business,store,collector,fake,merchant,offline,haggle,thrift` (93) |
| Almanca | aynı | aynı | mevcut listeye `pfandhaus,trödel,simulator` ekle, yer açmak için tekrar edenleri çıkar |

Neden böyle:
- Türk oyuncular bu türü "ikinci el dükkânı" ve "rehinci / pawn shop" diye arıyor. Rakip Dealer's Life Türkiye'de "İkinci El Dükkânı İşletme" alt başlığını kullanıyor.
- "tycoon" Türkçe kelimelerden çıktı, çünkü artık İngilizce (Birleşik Krallık) adında geçiyor. Yerine yeni paketle gelen "nostalji" girdi.
- İsteğe bağlı: Türkiye Fransızca sayfayı da tarıyor. Bir Fransızca sayfa açılırsa 100 karakter daha kazanılır (`brocante,antiquaire,marchandage,enchères,prêteur,boutique,simulateur`).

İngilizce (Birleşik Krallık) sayfanın açıklaması ABD sayfasıyla aynı olabilir (`ASO-PLANI.md` içindeki İngilizce açıklama). Son paragraftaki "120+ ITEMS / 13 collection series" kısmını şöyle güncelle: **"200+ ITEMS: … each with its own 3D model. Complete 29 collection series. New packs: 90s Nostalgia, Old Istanbul, Hammam, Calligraphy & Maps, Carpets & Kilims, Coins & Gold, Corner Grocer."**

## 3. Bu sürümdeki yenilikler (What's New)

**Türkçe**
> 7 yeni paket geldi: Nostalji 90'lar, Eski İstanbul, Hamam Takımı, Hat, Kitap ve Harita, Halı ve Kilim, Para ve Altın, Mahalle Bakkalı. 51 yeni 3B eşya, 7 koleksiyon serisi ve kendi hikâyesiyle gelen yeni müşteriler: emekli kaptan, sahaf, halıcı, bakkal Hüsnü Amca… Her paketten bir parça herkese açık, tamamı Premium'a dahil.

**İngilizce**
> 7 new packs: 90s Nostalgia, Old Istanbul, Hammam Set, Calligraphy & Maps, Carpets & Kilims, Coins & Gold and Corner Grocer. 51 new 3D items, 7 collection series and new customers with their own stories. One item from every pack is free for everyone; all packs are included in Premium.

**Almanca**
> 7 neue Pakete: 90er-Nostalgie, Altes Istanbul, Hamam-Set, Kalligrafie & Karten, Teppiche & Kelims, Münzen & Gold und Tante-Emma-Laden. 51 neue 3D-Gegenstände, 7 Sammelserien und neue Kunden mit eigenen Geschichten. Ein Stück aus jedem Paket ist für alle frei, alle Pakete sind in Premium enthalten.

## 4. Yeni uygulama içi satın almalar (App Store Connect › Uygulama İçi Satın Almalar)

Oyun aşağıdaki kimlikleri hazır bekliyor. Ürün mağazada yoksa kartta "Premium'a dahil" yazar, satın alma düğmesi çıkmaz; bir şey bozulmaz. Yani ürünleri sonra da açabilirsin. Hepsi **Tüketilemez (Non-Consumable)**.

| Kimlik | Ad | Önerilen TR fiyatı |
|---|---|---|
| `com.ozsstudio.bitpazari.paket_nostalji` | Nostalji 90'lar Paketi | ₺79,99 |
| `com.ozsstudio.bitpazari.paket_vapur` | Eski İstanbul Paketi | ₺79,99 |
| `com.ozsstudio.bitpazari.paket_hamam` | Hamam Takımı Paketi | ₺79,99 |
| `com.ozsstudio.bitpazari.paket_hat` | Hat, Kitap ve Harita Paketi | ₺79,99 |
| `com.ozsstudio.bitpazari.paket_hali` | Halı ve Kilim Paketi | ₺79,99 |
| `com.ozsstudio.bitpazari.paket_para` | Para ve Altın Paketi | ₺79,99 |
| `com.ozsstudio.bitpazari.paket_bakkal` | Mahalle Bakkalı Paketi | ₺79,99 |

Fiyat önerisi: tek paket Tarih Paketi'nden (42 eşya) ucuz olmalı, çünkü her biri 7–8 eşya. ₺79,99'da üç paket Premium'u (₺249,99) geçtiği için Premium daha cazip görünür.

## 5. Puan isteği (1.9.1 kodunda)

Oyun mağaza puanını şimdiye kadar 4 anda istiyordu: büyük kârlı satış, mezat kazanma, ev boşaltma, garaj. 1.9.1 ile üç an daha eklendi:
- Onarım mini oyununda 3 yıldız
- Mezat Gecesi'nde tahminin %20 üstünde satış
- Paketlemede %90 üstü kalite

Sınırlar aynı kaldı: oyunun 3. gününden önce sorulmaz, iki istek arasında en az 20 gün olur, toplamda en fazla 3 kez sorulur (Apple da yılda en fazla 3 kez gösterir).

## 6. Ekran görüntüleri (ayrıca hazırlanacak)

Şu an sadece küçük iPhone boyutunda 9 eski görsel var; 3B dükkân, Mezat ve onarım görünmüyor, İngilizce ve Almanca sayfalar Türkçe görselleri gösteriyor. Önerilen 8 kare, büyük iPhone boyutunda (6,9"), Türkçe, İngilizce ve Almanca:
1. 3B dükkân
2. Pazarlık
3. Sahteyi yakala (UV ve büyüteç)
4. Mezat Gecesi
5. Onarım
6. Kargo ve paketleme
7. Yeni paketler (halı, altın, 90'lar rafı)
8. İstanbul haritası

Türkçe sayfaya bir de 15–30 saniyelik önizleme videosu.
