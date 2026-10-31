/* Bit Pazarı — Android köprüsü (Capacitor). Web'de her şey sessizce eski davranışa düşer. */
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Preferences } from "@capacitor/preferences";
import { LocalNotifications } from "@capacitor/local-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { AdMob, AdmobConsentStatus } from "@capacitor-community/admob";
import { ADS } from "./ads.config.js";

const isNative = Capacitor.isNativePlatform();
const platform = Capacitor.getPlatform();
const isIOS = platform === "ios";
const AD_CFG = isIOS ? ADS.ios : ADS.android;
const AD_UNIT = AD_CFG.rewardedId;
const KEY = "bitpazari.v1";
const N = { isNative, platform, notifPerm: "default" };
window.NATIVE = N;

/* ---------- Kayıt: localStorage + Preferences yedeği (WebView verisi silinirse geri yükler) ---------- */
window.__BP_PRE = (async () => {
  if (!isNative) return;
  try {
    const ls = localStorage.getItem(KEY);
    const { value } = await Preferences.get({ key: KEY });
    if (!ls && value) localStorage.setItem(KEY, value);
  } catch (e) {}
})();
let saveT = 0;
N.backup = (now) => {
  if (!isNative) return;
  clearTimeout(saveT);
  const go = () => { try { const v = localStorage.getItem(KEY); if (v) Preferences.set({ key: KEY, value: v }); } catch (e) {} };
  if (now) go(); else saveT = setTimeout(go, 1500);
};
if (isNative) {
  const orig = Storage.prototype.setItem;
  Storage.prototype.setItem = function (k, v) { orig.call(this, k, v); if (k === KEY) N.backup(); };
}

/* ---------- Ödüllü reklam (AdMob + UMP/GDPR onayı) ---------- */
let adsReady = null, canAds = true;
async function initAds() {
  try {
    await AdMob.initialize({ initializeForTesting: AD_CFG.testing });
    try {
      const info = await AdMob.requestConsentInfo();
      if (info.isConsentFormAvailable && info.status === AdmobConsentStatus.REQUIRED) {
        const r = await AdMob.showConsentForm();
        canAds = r.canRequestAds !== false;
      } else canAds = info.canRequestAds !== false;
    } catch (e) {}
    /* iOS: Apple'ın uygulama takip izni (ATT). Reddedilse de reklamlar kişiselleştirilmeden gösterilir. */
    if (isIOS) {
      try {
        const t = await AdMob.trackingAuthorizationStatus();
        if (t.status === "notDetermined") await AdMob.requestTrackingAuthorization();
      } catch (e) {}
    }
    return true;
  } catch (e) { return false; }
}
N.privacyOptions = async () => { try { await AdMob.showPrivacyOptionsForm(); } catch (e) {} };
N.rewarded = async () => {
  if (!isNative) return false;
  if (!adsReady) adsReady = initAds();
  if (!(await adsReady) || !canAds) return false;
  try { await AdMob.prepareRewardVideoAd({ adId: AD_UNIT, isTesting: AD_CFG.testing }); } catch (e) { return false; }
  return new Promise((resolve) => {
    let got = false, done = false;
    const fin = (v) => { if (done) return; done = true; hs.forEach((h) => h.then((x) => x.remove())); resolve(v); };
    const hs = [
      AdMob.addListener("onRewardedVideoAdReward", () => { got = true; }),
      AdMob.addListener("onRewardedVideoAdDismissed", () => setTimeout(() => fin(got), 300)),
      AdMob.addListener("onRewardedVideoAdFailedToShow", () => fin(false)),
    ];
    AdMob.showRewardVideoAd().then(() => { got = true; }).catch(() => fin(false));
  });
};

/* ---------- Geçiş reklamı: her 2 günün sonunda, "Kepenkleri Aç"a basınca ---------- */
N.interstitial = async () => {
  if (!isNative || !AD_CFG.interstitialId) return false;
  try {
    if (!adsReady) adsReady = initAds();
    if (!(await adsReady) || !canAds) return false;
    await AdMob.prepareInterstitial({ adId: AD_CFG.interstitialId, isTesting: AD_CFG.testing });
    await new Promise((resolve) => {
      let done = false;
      const fin = () => { if (done) return; done = true; hs.forEach((h) => h.then((x) => x.remove())); resolve(); };
      const hs = [
        AdMob.addListener("interstitialAdDismissed", fin),
        AdMob.addListener("interstitialAdFailedToShow", fin),
      ];
      try { window.BP_PAUSE && window.BP_PAUSE(true); } catch (e) {}
      AdMob.showInterstitial().catch(fin);
      setTimeout(fin, 90000);
    });
    return true;
  } catch (e) { return false; }
};

/* ---------- Yerel bildirimler ---------- */
N.askNotif = async () => {
  try { const r = await LocalNotifications.requestPermissions(); N.notifPerm = r.display === "granted" ? "granted" : "denied"; } catch (e) {}
  return N.notifPerm;
};
async function scheduleAll() {
  if (N.notifPerm !== "granted") return;
  const now = Date.now(), list = [];
  let S = {};
  try { S = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}
  const name = S.shop || "Dükkânın";
  const add = (id, at, body) => { if (at > now + 5000) list.push({ id, title: "Bit Pazarı", body, schedule: { at: new Date(at) } }); };
  const t = new Date(); t.setDate(t.getDate() + 1); t.setHours(10, 0, 0, 0);
  add(1, t.getTime(), `${name} kepenkleri açmanı bekliyor. Günlük giriş ödülün hazır!`);
  add(2, now + 3 * 86400e3, "Kurnaz Cemil kapışılacak mallarını kaptı bile… Pazara dönme vakti!");
  try { const p = await LocalNotifications.getPending(); if (p.notifications.length) await LocalNotifications.cancel(p); } catch (e) {}
  if (list.length) try { await LocalNotifications.schedule({ notifications: list }); } catch (e) {}
}

/* ---------- Geri tuşu ---------- */
function onBack() {
  let handled = false;
  try { handled = window.BP_BACK ? window.BP_BACK() : false; } catch (e) {}
  if (!handled) { N.backup(true); App.minimizeApp(); }
}

if (isNative) {
  document.documentElement.classList.add("native");
  document.documentElement.classList.add("plat-" + platform);
  if (!isIOS) App.addListener("backButton", onBack);
  App.addListener("appStateChange", async ({ isActive }) => {
    try { window.BP_PAUSE && window.BP_PAUSE(!isActive); } catch (e) {}
    if (isActive) { try { const p = await LocalNotifications.getPending(); if (p.notifications.length) await LocalNotifications.cancel(p); } catch (e) {} }
    else { N.backup(true); scheduleAll(); }
  });
  LocalNotifications.checkPermissions().then((r) => {
    N.notifPerm = r.display === "granted" ? "granted" : r.display === "denied" ? "denied" : "default";
    /* ilk günü oynadıktan sonra bir kez izin iste */
    if (N.notifPerm === "default") setTimeout(() => { try { const S = JSON.parse(localStorage.getItem(KEY) || "{}"); if ((S.day || 1) >= 2) N.askNotif(); } catch (e) {} }, 60000);
  }).catch(() => {});
  StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
  if (!isIOS) StatusBar.setBackgroundColor({ color: "#0d1f1c" }).catch(() => {});
  window.addEventListener("load", () => setTimeout(() => SplashScreen.hide().catch(() => {}), 300));
  setTimeout(() => { adsReady = adsReady || initAds(); }, 4000);
}
