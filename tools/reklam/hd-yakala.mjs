// Bit Pazarı reklamı için HD oyun çekimleri (432×768 @5x → 2160×3840).
// Oyunun saati (performance.now, Date.now, zamanlayıcılar, requestAnimationFrame, CSS animasyonları) yavaşlatılır;
// yavaş akan oyundan art arda ekran görüntüsü alınır ve oyun saatine göre 30 fps'e oturtulur. Böylece 3B sahneler de
// akıcı ve keskin çıkar. Çalıştırma (önce `python3 build.py` ve `npx serve www -s -l 8090`):
//   CHROME=/yol/chrome node tools/reklam/hd-yakala.mjs <çıktı klasörü> [sahne,sahne]
import { copyFileSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let puppeteer;
try { puppeteer = require('puppeteer-core'); } catch { puppeteer = require('/home/claude/mma/node_modules/puppeteer-core'); }

const [OUT, SADECE = ''] = process.argv.slice(2);
// Çekim için oyun durumunu dışarı açan kopya: www/index.html'de oyun fonksiyonunun sonuna
// window.__BP={get S(){return S},get DG(){return DG},ACH,render,save}; eklenmiş hâli (yalnızca çekim, yayına girmez)
const URL = process.env.URL ?? 'http://localhost:8091/';
const DPR = +(process.env.DPR ?? 5);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
mkdirSync(OUT, { recursive: true });

// ---- Zaman genişletme (sayfa yüklenmeden enjekte edilir) ----
const ZAMAN = () => {
  const oP = performance.now.bind(performance), oD = Date.now, oST = window.setTimeout.bind(window), oSI = window.setInterval.bind(window), oRAF = window.requestAnimationFrame.bind(window);
  let F = 1, rb = oP(), vb = rb;
  const v = () => vb + (oP() - rb) / F;
  const d0 = oD() - oP();
  window.__oyunSaati = v;
  window.__hizAyarla = (f) => { vb = v(); rb = oP(); F = f; };
  performance.now = v;
  Date.now = () => Math.round(d0 + v());
  window.setTimeout = (fn, ms = 0, ...a) => oST(fn, (ms || 0) * F, ...a);
  window.setInterval = (fn, ms = 0, ...a) => oSI(fn, (ms || 0) * F, ...a);
  window.requestAnimationFrame = (cb) => oRAF(() => cb(v()));
};

const browser = await puppeteer.launch({ executablePath: process.env.CHROME, args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();
await page.setViewport({ width: 432, height: 768, deviceScaleFactor: DPR, isMobile: true, hasTouch: true });
await page.evaluateOnNewDocument(ZAMAN);
// Kayıt (varsa) sayfa yüklenmeden yerleştirilir; sessionStorage bayrağıyla yalnızca bir kez
await page.evaluateOnNewDocument(() => {
  const z = sessionStorage.getItem('zorla');
  if (z != null) { if (z === '') localStorage.removeItem('bitpazari.v1'); else localStorage.setItem('bitpazari.v1', z); sessionStorage.removeItem('zorla'); }
  localStorage.setItem('bitpazari.lang', 'tr');
});
page.on('pageerror', (e) => console.log('sayfa hatası:', e.message.slice(0, 160)));
let cdp;
const ac = async (kayit) => {
  await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
  await page.evaluate((k) => sessionStorage.setItem('zorla', k), kayit == null ? '' : JSON.stringify(kayit));
  await page.reload({ waitUntil: 'load', timeout: 60000 });
  await sleep(1800);
  cdp = await page.createCDPSession();
  await cdp.send('Animation.enable');
};
const yavasla = async (f) => {
  await page.evaluate((f) => window.__hizAyarla(f), f);
  await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 / f });
};
/** data-act ile tıkla (ilk görünen); ön ek verilirse data-act o önekle başlayan ilk öğe */
const tik = (act, onEk = false) => page.evaluate((act, onEk) => {
  const e = [...document.querySelectorAll('[data-act]')].find((e) => e.getBoundingClientRect().width > 0 && (onEk ? e.dataset.act.startsWith(act) : e.dataset.act === act));
  if (!e) return false;
  e.click();
  return true;
}, act, onEk);
/**
 * sure sn (oyun saati) kayıt. plan: [[oyun saniyesi, async fn]] kayıt sırasında sırayla çalışır.
 * Ekran görüntüleri oyun saatiyle damgalanır, sonra 30 fps karelere oturtulur.
 */
const hdKayit = async (ad, sure, plan = [], F = 10) => {
  const dir = `${OUT}/${ad}`;
  const ham = `${dir}-ham`;
  for (const d of [dir, ham]) { rmSync(d, { recursive: true, force: true }); mkdirSync(d, { recursive: true }); }
  await yavasla(F);
  const t0 = await page.evaluate(() => window.__oyunSaati());
  const list = [];
  let pi = 0;
  for (let i = 0; ; i++) {
    const t = ((await page.evaluate(() => window.__oyunSaati())) - t0) / 1000;
    while (pi < plan.length && plan[pi][0] <= t) await plan[pi++][1]();
    const f = `${ham}/${String(i).padStart(5, '0')}.jpg`;
    await page.screenshot({ path: f, type: 'jpeg', quality: 92 });
    list.push([t, f]);
    if (t > sure) break;
  }
  await yavasla(1);
  let j = 0;
  for (let k = 0; k < Math.round(sure * 30); k++) {
    while (j + 1 < list.length && list[j + 1][0] <= k / 30) j++;
    copyFileSync(list[j][1], `${dir}/${String(k + 1).padStart(5, '0')}.jpg`);
  }
  rmSync(ham, { recursive: true, force: true });
  console.log('✓', ad, `${list.length} görüntü → ${Math.round(sure * 30)} kare`);
};

// ---- Hazır kayıtlar ----
const yeni = { shop: 'Nostalji Köşesi', xp: 0, lv: 1, sp: 0, skills: [], money: 1500, rep: 50, day: 1, ci: 1, inv: [], pending: [], story: {}, stats: { start: 1500, buys: 0, sells: 0, startInv: 0 }, log: [], offer: 1000, tab: 'shop', mute: false, intro: false, mys: {}, phase: 'shop' };
const KURNAZ = {
  id: 'rk1', kind: 'seller', type: 'kurnaz', tag: 'Kurnaz', name: 'Cevdet Dayı', seed: 4242,
  item: { id: 'rkit1', k: 'gramofon', n: 'Borulu Gramofon', i: '📯', cond: 4, fake: true, appear: 3800, worth: 900, paid: 0, known: { insp: false, lo: 0, hi: 0, suspect: false, expert: false }, story: null, isNew: true, rar: 2 },
  ask: 3400, minAccept: 2100, patience: 2, maxPat: 2,
  line: 'Bak usta, bu gramofon Pera’dan çıkma, tek sahibinden! 3.400 ₺, kaçırma bence.',
  done: false, trzK: 'seller:3400:0:0', hist: [], fz: 1.05,
};
// Oyun ilerlemiş hâli: 17. gün, ipuçları ve başarımlar görülmüş (açılır pencere yok)
const olgun = async (phase) => {
  await ac(null);
  await tik('menuNew'); await sleep(400);
  await tik('nm:', true); await sleep(200);
  await tik('nameGo'); await sleep(900);
  const s = await page.evaluate(() => { const B = window.__BP; B.S.ach = B.S.ach || {}; B.ACH.forEach((a) => { B.S.ach[a[0]] = 1; }); B.save(); return localStorage.getItem('bitpazari.v1'); });
  const k = JSON.parse(s);
  Object.assign(k, { day: 17, money: 16809, lv: 8, xp: 292, rep: 61, streak: 5, phase, intro: true });
  delete k.tips;
  k.cust = structuredClone(KURNAZ);
  await ac(k);
  await tik('menuContinue');
  await sleep(1500);
  await page.evaluate(() => { document.querySelectorAll('.toast,.achpop').forEach((e) => e.remove()); });
};

const hedef = SADECE ? SADECE.split(',') : ['menu', 'acilis', 'pazarlik', 'inceleme', 'kazi', 'aksam'];

// 1) Açılış menüsü: döner 3B vitrin (gramofon), sonra sıradaki eşya
if (hedef.includes('menu')) {
  await ac(null);
  await hdKayit('menu', 5.5, [[3.2, () => tik('mhNext')]], 45);
}
// 2) Dükkânı aç: isim seç, kepenkleri aç
if (hedef.includes('acilis')) {
  await ac(null);
  await tik('menuNew'); await sleep(600);
  await hdKayit('acilis', 4.5, [[0.4, () => tik('nm:Nostalji Köşesi')], [1.2, () => tik('nameGo')]], 25);
}
// 3) Pazarlık: kurnaz satıcı, cesur teklif, karşı teklif
if (hedef.includes('pazarlik')) {
  await olgun('shop');
  await hdKayit('pazarlik', 6, [[1.3, () => tik('trz:', true)], [2.6, () => tik('offer')]], 25);
}
// 4) İnceleme: 3B, çevir, UV lamba, büyüteç
if (hedef.includes('inceleme')) {
  await olgun('shop');
  await hdKayit('inceleme', 6.5, [[0.2, () => tik('inspect')], [1.6, () => tik('vright')], [2.8, () => tik('xt:uv')], [4.3, () => tik('vback')], [5.4, () => tik('xt:mag')]], 45);
}
// 5) Anadolu Kazısı: kazıya başla, ipuçlarıyla buluntulara ilerle
if (hedef.includes('kazi')) {
  await olgun('dayEnd');
  await tik('eve:dig'); await sleep(900);
  await tik('digStart'); await sleep(900);
  const { finds, n } = await page.evaluate(() => ({ finds: window.__BP.DG.finds.map((f) => f.c), n: window.__BP.DG.left }));
  // önce iki boş (uzak/yakın) hücre, sonra buluntular
  const bos = [...Array(36).keys()].filter((i) => !finds.includes(i));
  const sira = [bos[0], bos[Math.floor(bos.length / 2)], ...finds].slice(0, Math.min(n, 6));
  console.log('kazı buluntuları', finds, 'sıra', sira);
  await hdKayit('kazi', 6, sira.map((c, i) => [0.5 + i * 0.75, () => tik(`dig:${c}`)]), 25);
}
// 6) Akşam: kepenk indi, günün kârı
if (hedef.includes('aksam')) {
  await olgun('dayEnd');
  await page.evaluate(() => { window.__BP.S.tab = 'skills'; window.__BP.render(); });
  await hdKayit('aksam', 4.5, [[0.3, () => tik('tab:shop')]], 25);
}
await browser.close();
