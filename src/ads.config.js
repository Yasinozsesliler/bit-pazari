/* AdMob ayarları.
   Şu an Google'ın resmi TEST kimlikleri kullanılıyor: reklamlar "Test Ad" etiketiyle gelir, para kazandırmaz.
   AdMob hesabını açınca:
     1) rewardedId'yi kendi "Ödüllü" reklam birimi kimliğinle değiştir (ca-app-pub-XXXX/YYYY)
     2) testing'i false yap
     3) android/app/src/main/res/values/strings.xml içindeki admob_app_id'yi kendi UYGULAMA kimliğinle değiştir (ca-app-pub-XXXX~ZZZZ)
   Sonra: npm run build  */
export const ADS = {
  testing: true,
  rewardedId: "ca-app-pub-3940256099942544/5224354917",
};
