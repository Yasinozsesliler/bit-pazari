/* AdMob ayarları.
   Şu an Google'ın resmi TEST kimlikleri kullanılıyor: reklamlar "Test Ad" etiketiyle gelir, para kazandırmaz.
   AdMob'da Android ve iOS için AYRI iki uygulama açılır, her birinin kendi "Ödüllü" reklam birimi olur.
     1) android.rewardedId ve ios.rewardedId'yi kendi reklam birimi kimliklerinle değiştir (ca-app-pub-XXXX/YYYY)
     2) testing'i false yap
     3) Uygulama kimlikleri (ca-app-pub-XXXX~ZZZZ):
        Android: android/app/src/main/res/values/strings.xml > admob_app_id
        iOS:     ios/App/App/Info.plist > GADApplicationIdentifier
   Sonra: npm run build  */
export const ADS = {
  testing: true,
  android: { rewardedId: "ca-app-pub-3940256099942544/5224354917" },
  ios: { rewardedId: "ca-app-pub-3940256099942544/1712485313" },
};
