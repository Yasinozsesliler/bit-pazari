/* AdMob ayarları. Her platformun kendi "testing" bayrağı var.
   iOS: GERÇEK kimlikler (ca-app-pub-6387108639379747). Uygulama kimliği: ios/App/App/Info.plist > GADApplicationIdentifier
   Android: henüz Google TEST kimlikleri. Gerçek kimlikler gelince rewardedId'yi ve
            android/app/src/main/res/values/strings.xml > admob_app_id değerini değiştir, testing:false yap. */
export const ADS = {
  android: { testing: true,  rewardedId: "ca-app-pub-3940256099942544/5224354917",
             interstitialId: "ca-app-pub-3940256099942544/1033173712" },
  ios:     { testing: false, rewardedId: "ca-app-pub-6387108639379747/5365824891",
             interstitialId: "ca-app-pub-6387108639379747/9357040799" },
};
