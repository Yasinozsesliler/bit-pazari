# Bit Pazarı: Google Play'e yayınlama rehberi

Bu klasör, oyunun Android uygulaması olarak derlenmeye hazır halidir.

- **Paket adı:** `com.ozsstudio.bitpazari`
- Paket adı Play'e ilk yüklemeden sonra bir daha değiştirilemez. Değiştirmek istersen şimdi `capacitor.config.json` ve `android/app/build.gradle` dosyalarında değiştir.

## Klasörde ne var?

| Dosya / klasör | Ne işe yarar |
|---|---|
| `src/game.html` | Oyunun kendisi (artifact'taki sürümün aynısı) |
| `src/native.js` | Android köprüsü: ödüllü reklam, geri tuşu, bildirimler, kayıt yedeği |
| `src/ads.config.js` | AdMob reklam kimliği ayarı |
| `build.py` | Oyunu internetsiz çalışacak hale getirir (fontlar ve three.js pakete gömülür) |
| `android/` | Android projesi (ikon, açılış ekranı, izinler, imzalama ayarı hazır) |
| `assets/` | İkon ve açılış ekranının kaynak görselleri |
| `.github/workflows/android.yml` | GitHub'a yüklenince AAB ve APK dosyalarını otomatik derler |
| `store/` | Mağaza simgesi, öne çıkan grafik, 9 ekran görüntüsü, açıklama metinleri, gizlilik politikası |

## Telefona gelenler (web sürümünden farkı)

- **Reklamlar gerçek.**
  - "Reklam izle" seçenekleri (günlük ödülü ikiye katla, müşteriyi ikna et vb.) AdMob ödüllü reklamı oynatır.
  - Ödül yalnızca reklam sonuna kadar izlenirse verilir.
  - Avrupa'daki oyunculara Google'ın izin formu otomatik çıkar. Ana menünün altında "Gizlilik ayarları" bağlantısı vardır.
- **Geri tuşu,** sırasıyla şunları yapar:
  1. Açık pencereyi kapatır (3B inceleme, harita, konuşma, paketleme).
  2. Dükkân sekmesine döner.
  3. Akşam menüsünde ana listeye döner.
  4. En son uygulamayı alta alır ve oyunu kaydeder.
- **Bildirimler:**
  - Oyuncu 2. güne geçtikten sonra bildirim izni bir kez istenir.
  - Uygulama kapanınca "dükkânın seni bekliyor / günlük ödülün hazır" hatırlatmaları planlanır.
- **Kayıt güvenliği:** İlerleme ikinci bir yere de yedeklenir. Android yedeklemesi açıksa telefon değiştirince de geri gelir.
- **İnternetsiz açılır:** Fontlar ve 3B motoru uygulamanın içindedir. Sadece reklamlar için internet gerekir.
- **Ses:** Uygulama arka plana geçince müzik durur, geri gelince devam eder.
- **Diğer:** Dikey ekrana kilitlidir. Kendi ikonu ve açılış ekranı vardır. Küçük ekranlı telefonlarda (360×640) dükkân sahnesi otomatik küçülür.

---

## 1. Adım: GitHub'da derle (Android Studio gerekmez)

1. GitHub'da **gizli (private)** bir repo aç, örneğin `bit-pazari`. Bu klasörü oraya yükleyeceğiz; bu adımı birlikte yaparız.
2. Repo › **Settings › Secrets and variables › Actions › New repository secret** yolunu izle ve şu 4 sırrı ekle. Değerler sana ayrıca gönderdiğim `imza-bilgileri.txt` dosyasında:
   - `KEYSTORE_BASE64`
   - `KEYSTORE_PASSWORD`
   - `KEY_ALIAS`
   - `KEY_PASSWORD`
3. **Actions** sekmesinde "Android derle (AAB + APK)" iş akışı her yüklemede kendiliğinden çalışır. Elle başlatmak için **Run workflow** düğmesini kullan.
4. Derleme yaklaşık 5–8 dakika sürer. Sonuçlar repodaki **`build-output`** dalında olur:
   - `bit-pazari-N.aab`: Play Console'a yüklenecek imzalı dosya
   - `bit-pazari-test-N.apk`: telefona doğrudan kurup denemek için
5. Derleme hata verirse hata günlüğü **`ci-log`** dalına yazılır. Bana haber ver, düzeltirim.

> **İmza anahtarı çok önemli.** `bitpazari-upload.jks` dosyasını ve şifresini iki ayrı yerde sakla (bulut + USB). Repoya koyma. Kaybedersen Play Console'dan "yükleme anahtarını sıfırla" talebi açman gerekir.

### İstersen Android Studio ile
1. [Node.js 22](https://nodejs.org) ve [Android Studio](https://developer.android.com/studio) kur.
2. Klasörde şunları çalıştır:
   ```
   npm install
   npm run build
   npm run open
   ```
3. Telefonu USB ile bağla ve ▶ Run tuşuna bas.

---

## 2. Adım: AdMob (reklam geliri)

Şu an **Google'ın test reklamları** açık. Reklamlar "Test Ad" yazısıyla gelir ve para kazandırmaz. Kapalı test için bu yeterli. Gerçek reklama geçmek için:

1. [admob.google.com](https://admob.google.com) adresinde uygulama ekle (Android, "henüz yayında değil").
2. **Uygulama kimliğini** (`ca-app-pub-…~…`) `android/app/src/main/res/values/strings.xml` dosyasındaki `admob_app_id` alanına yaz.
3. **Ödüllü reklam birimi** oluştur. Kimliğini (`ca-app-pub-…/…`) `src/ads.config.js` dosyasındaki `rewardedId` alanına yaz ve `testing: false` yap.
4. AdMob › Gizlilik ve mesajlaşma bölümünde **GDPR mesajı** oluştur ve yayınla.
5. Kendi reklamlarına kendi telefonundan **tıklama**. Telefonunu AdMob'a "test cihazı" olarak ekle.

---

## 3. Adım: Play Console ve kapalı test

1. [play.google.com/console](https://play.google.com/console) › **Uygulama oluştur**.
   - Ad: "Bit Pazarı: Antika Al-Sat"
   - Dil: Türkçe
   - Tür: Oyun, Ücretsiz
2. **Mağaza girişi:** `store/magaza-metinleri.md` dosyasındaki metinleri ve görselleri kullan.
3. **Gizlilik politikası:**
   - `store/gizlilik-politikasi.html` dosyasındaki `[DESTEK E-POSTA ADRESİN]` kısmını doldur.
   - Sayfayı yayınla (GitHub Pages, Google Sites ya da kendi sitende).
   - Adresi Play Console'a yaz.
4. **Uygulama içeriği:**
   - **Reklamlar:** Evet.
   - **Uygulama erişimi:** Tüm özellikler kısıtlamasız.
   - **Hedef kitle:** 13–15, 16–17 ve 18+ yaş gruplarını seç. 13 yaş altını seçme.
   - **İçerik derecelendirmesi (IARC anketi):**
     - Şiddet, cinsellik ve küfür yok.
     - Gerçek parayla kumar yok.
     - Simüle kumar sorusunu dürüstçe yanıtla. Oyunda oyun içi parayla açılan "gizemli sandık" ve açık artırmalar var, ama gerçek para yok.
     - Kullanıcılar arası iletişim yok.
   - **Veri güvenliği.** Kaynak: AdMob SDK'sı.
     - Veri toplanıyor mu: **Evet**.
     - Toplananlar:
       - Cihaz kimlikleri: Reklam kimliği
       - Konum: Yaklaşık konum
       - Uygulama etkinliği: Uygulama etkileşimleri
       - Uygulama bilgileri ve performansı: Kilitlenme günlükleri, Teşhis
     - Amaç: Reklam, Analiz, Dolandırıcılığı önleme.
     - Üçüncü tarafla paylaşılıyor: Evet (Google).
     - Aktarımda şifreleniyor: Evet.
     - Hesap oluşturma yok.
5. **Kapalı test:**
   - Test › Kapalı test › **Yeni sürüm** › `bit-pazari-N.aab` dosyasını yükle.
   - Play App Signing'i kabul et.
   - Testçi listesine Gmail adreslerini ekle.
   - İncelemeye gönder.
   - Kişisel geliştirici hesaplarında üretime çıkmadan önce **en az 12 testçinin 14 gün** boyunca kapalı testte kalması isteniyor. Güncel şartı Play Console'da kontrol et.
   - Testçiler, Play Console'un verdiği katılım bağlantısıyla oyunu indirir.

## Güncelleme nasıl yapılır?
1. Yeni `game.html` dosyasını `src/game.html` üzerine koy.
2. GitHub'a yükle. Sürüm numarası (versionCode) otomatik artar.
3. `build-output` dalındaki yeni AAB'yi Play Console'a yeni sürüm olarak yükle.
4. Görünen sürüm adını değiştirmek istersen `android/app/build.gradle` içindeki `versionName` alanını düzenle.

## Yayın öncesi kontrol listesi
- [ ] İmza anahtarı ve şifresi iki ayrı yerde yedekli
- [ ] Gerçek telefonda denendi: pazarlık, 3B inceleme, e-Mezat, kargo paketleme, reklam, geri tuşu, bildirim
- [ ] Gizlilik politikası yayında ve adresi Play Console'a girildi
- [ ] (Üretimden önce) AdMob kimlikleri gerçek kimliklerle değiştirildi, `testing: false` yapıldı
