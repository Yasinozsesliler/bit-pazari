# Bit Pazarı: App Store'a yayınlama rehberi

Oyunun iPhone sürümü hazır. Derleme GitHub'daki Mac sunucusunda yapılıyor, senin Mac'in olması gerekmiyor.

- **Paket kimliği (Bundle ID):** `com.ozsstudio.bitpazari` (Android ile aynı)
- **Desteklenen cihaz:** yalnızca iPhone, dikey ekran. iPad ekran görüntüsü gerekmez.
- **En düşük iOS:** 15.0
- **Derleme:** Xcode 26.6, iOS 26 SDK. Apple'ın güncel şartını karşılıyor.
- **Test:** Oyun iPhone simülatöründe açıldı ve çentik (Dynamic Island) altında doğru duruyor. Gerçek bir iPhone'da henüz denenmedi.

---

## 1. Adım: Apple Developer hesabı (bir kez)

1. [developer.apple.com/programs](https://developer.apple.com/programs) adresinden **Apple Developer Program**'a katıl.
   - Ücret yıllıktır (şu an 99 $).
   - Bireysel hesap açarsan App Store'da satıcı adı olarak kendi adın görünür.
   - "OZS Studio" görünsün istersen kurumsal (Organization) hesap gerekir. Bunun için şirket ve D-U-N-S numarası lazım.
2. Onay genelde 1–2 gün sürer.

## 2. Adım: App Store Connect'te uygulamayı oluştur

1. [appstoreconnect.apple.com](https://appstoreconnect.apple.com) › **Uygulamalar** › **＋** › **Yeni Uygulama**.
2. Formu şöyle doldur:
   - Platform: iOS
   - Ad: **Bit Pazarı: Antika Al-Sat**
   - Birincil dil: Türkçe
   - Paket kimliği: listede `com.ozsstudio.bitpazari` yoksa, önce [developer.apple.com › Identifiers](https://developer.apple.com/account/resources/identifiers/list) sayfasında **＋ › App IDs › App** ile bu kimliği oluştur. Ardından listeden seç.
   - SKU: `bitpazari`

## 3. Adım: GitHub'a 4 Apple sırrını ekle (otomatik TestFlight için)

Bu sırlar eklenince her GitHub güncellemesinde oyun imzalanıp **TestFlight'a kendiliğinden yüklenir**.

1. App Store Connect › **Kullanıcılar ve Erişim** › **Entegrasyonlar** › **App Store Connect API** › **＋**.
2. Ad olarak "GitHub" yaz, erişim olarak **Admin** seç. Admin şart, çünkü imza sertifikasını otomatik oluşturuyor.
3. Açılan sayfada şunları al:
   - **Issuer ID:** sayfanın üstünde yazıyor.
   - **Key ID:** anahtarın satırında yazıyor.
   - **.p8 dosyası:** "API Anahtarını İndir" ile indir. **Yalnızca bir kez indirilebilir**, bu yüzden sakla.
4. **Team ID:** [developer.apple.com › Membership](https://developer.apple.com/account#MembershipDetailsCard) sayfasında 10 karakterlik kod.
5. GitHub'da `bit-pazari` reposunda **Settings › Secrets and variables › Actions › New repository secret** yolunu izle ve şu 4 sırrı ekle:

| Sır adı | Değeri |
|---|---|
| `APPLE_TEAM_ID` | Team ID |
| `ASC_KEY_ID` | Key ID |
| `ASC_ISSUER_ID` | Issuer ID |
| `ASC_KEY_P8` | .p8 dosyasını not defteriyle aç, `-----BEGIN PRIVATE KEY-----` satırından `-----END PRIVATE KEY-----` satırına kadar **tamamını** yapıştır |

6. Bana "ekledim" de, derlemeyi başlatırım. 10–15 dakika sonra sürüm App Store Connect › **TestFlight** sekmesinde görünür.

## 4. Adım: Telefonda dene (TestFlight)

1. iPhone'una App Store'dan **TestFlight** uygulamasını kur.
2. App Store Connect › TestFlight › **Dahili Test** › grubuna kendi Apple kimliğini ekle.
3. TestFlight uygulamasından Bit Pazarı'nı kur.
4. Şunları kontrol et:
   - **Açılışta iki izin penceresi çıkar:** Google'ın reklam mesajı ve Apple'ın "takip izni" penceresi. İkisi de normal.
   - Ekranın üstü çentiğin altında kalmıyor mu?
   - 3B vitrin dönüyor mu, reklam butonları "Test Ad" gösteriyor mu?
   - Ses ve müzik çalıyor mu? iPhone sessize alınmışsa oyunun sesi çıkmaz, bu normal.

## 5. Adım: Mağaza sayfası

Metinlerin hepsi `store/app-store-metinleri.md` dosyasında. Görseller:

- **Ekran görüntüleri:** `store/screens-ios/`, 1320×2868. Bunları **6.9 inç** yuvasına yükle; Apple diğer iPhone boyutlarını bunlardan otomatik türetir. En fazla 10 görsel yüklenebilir, elimizde 9 tane var.
- **Uygulama simgesi:** Derlemenin içinde. Ayrıca yüklemen gerekmez.
- **Gizlilik Politikası URL'si:** `https://yasinozsesliler.github.io/bit-pazari/`
- **Destek URL'si:** Zorunlu. Aynı adresi kullanabilirsin, ama Apple orada iletişim bilgisi görmek ister. Destek e-postanı bana yaz, sayfaya ekleyeyim.

### Uygulama Gizliliği (App Privacy) formu

Veri toplanıyor mu: **Evet**. Toplanan verilerin hepsi Google AdMob reklam altyapısından geliyor.

| Veri türü | Amaç | Kimliğe bağlı mı | Takip için mi |
|---|---|---|---|
| Tanımlayıcılar › Cihaz Kimliği | Üçüncü taraf reklam, Analiz | Hayır | **Evet** |
| Kullanım Verileri › Ürün Etkileşimi | Üçüncü taraf reklam, Analiz | Hayır | Evet |
| Kullanım Verileri › Reklam Verileri | Üçüncü taraf reklam | Hayır | Evet |
| Konum › Kaba Konum | Üçüncü taraf reklam | Hayır | Evet |
| Teşhis › Çökme Verileri, Performans Verileri | Analiz | Hayır | Hayır |

### Yaş derecelendirmesi

Oyunda şunlar **yok**:
- Şiddet, cinsellik, küfür
- Gerçek parayla kumar
- Kullanıcıların birbiriyle iletişimi
- Web tarayıcısı

Dikkat edilecek nokta: oyunda **oyun içi parayla** açılan "kilitli sandık" ve açık artırmalar var. Gerçek para yok. Apple'ın "simüle kumar" ve "ganimet kutusu" sorularını bunu göz önüne alarak dürüstçe yanıtla.

### Diğer sorular

- **Şifreleme (Export Compliance):** Ayarı derlemeye ekledim (`ITSAppUsesNonExemptEncryption = NO`), Apple bunu artık sormaz.
- **Reklam kimliği (IDFA) kullanıyor musun:** Evet.
- **Kategori:** Oyunlar › Simülasyon. İkincil kategori: Oyunlar › Strateji.
- **Fiyat:** Ücretsiz.

## 6. Adım: İncelemeye gönder

App Store Connect › uygulama › **iOS Uygulaması 1.1.1**:
1. TestFlight'taki derlemeyi seç.
2. İnceleme notuna şunu yaz: "Hesap gerekmez, oyun doğrudan açılır."
3. **İncelemeye Gönder**.

İlk inceleme genelde 1–3 gün sürer.

---

## AdMob'un iOS tarafı (yayından önce)

Şu an Google'ın **test reklamları** açık.

1. AdMob'da Android uygulamasından **ayrı** bir **iOS uygulaması** ekle ve onun için bir **Ödüllü** reklam birimi oluştur.
2. Uygulama kimliğini (`ca-app-pub-…~…`) ve reklam birimi kimliğini (`ca-app-pub-…/…`) bana gönder. Ben şunları değiştiririm:
   - Uygulama kimliği: `ios/App/App/Info.plist` › `GADApplicationIdentifier`
   - Reklam birimi: `src/ads.config.js` › `ios.rewardedId`
3. AdMob › Gizlilik ve mesajlaşma bölümünde **IDFA açıklama mesajı** ve **GDPR mesajı** oluştur, dili Türkçe seç. Açılıştaki "Our app wants to stay free for you" yazısı bu mesajla Türkçe olur.

## Güncelleme nasıl yapılır?

Oyunda değişiklik yaptığımda GitHub'a yüklerim. Android AAB'si ve iOS TestFlight derlemesi aynı anda otomatik çıkar. Sürüm numarasını (ör. 1.1.2) ikisinde birlikte artırırım.
