/* ===================== 1.6.0: Bit Pazarı Ansiklopedisi ===================== */
/*WIKI_DATA*/const WIKI={};/*WIKI_END*/
const RCH=[70,20,8,2];
function wkRec(k){S.wk=S.wk||{};return S.wk[k]=S.wk[k]||{b:0,s:0,best:0,d:0}}
const wkOpen=k=>!!(S.col&&S.col[k]!=null)||!!(S.wk&&S.wk[k]&&S.wk[k].b);
const wkSer=k=>SERIES.find(s=>s.ks.includes(k));
const _colAdd0=colAdd;colAdd=function(it){if(it&&it.k&&!it.chest&&WIKI[it.k]){const w=wkRec(it.k);w.b++;if(!w.d)w.d=S.day}return _colAdd0(it)};
const _logT0=logT;logT=function(t,it,amt){if(t==='sell'&&it&&it.k&&WIKI[it.k]&&!it.hurda){const w=wkRec(it.k);w.s++;if(amt>w.best)w.best=Math.round(amt)}return _logT0(t,it,amt)};
function wkFound(c){const out=[],s=wkSer(c.k);
  if(c.ev){const e=EVTS[c.ev];out.push(`🎄 <b>${e.n}</b> etkinliği sırasında satıcılar getirir`);return out}
  if(c.pack||(typeof TARIH!=='undefined'&&TARIH.has(c.k)))out.push(`📜 <b>Tarih Paketi</b> ile dükkâna gelmeye başlar`);
  const locs=s?LOCS.filter(l=>l.cats.includes(s.id)):[];
  out.push(locs.length?`🏪 Her semtte çıkabilir, en sık: <b>${locs.map(l=>l.n).join(', ')}</b>`:`🏪 Bütün semtlerde satıcılar getirebilir`);
  if(DIG_HOME.includes(c.k))out.push(`⛏️ <b>Anadolu Kazısı</b>nda topraktan çıkabilir`);
  if(typeof TARIH!=='undefined'&&TARIH.has(c.k))out.push(`🏛️ Kazıda bulunursa müzeye teslim edilir, ikramiye kazandırır`);
  out.push(`🔨 Ev boşaltma mezatlarında ve akşam açık artırmalarında da karşına çıkar`);return out}
function wkFake(c){if(!c.f)return `<p class="wk-p">Bu parçanın piyasada bilinen bir sahtesi yok. Yine de durumuna dikkat et: çizik ve kırık değerini düşürür.</p>`;
  const k=c.k;let t;
  if(c.sp)t=`🔦 <b>UV lamba:</b> taze mürekkep ve yeni baskı UV altında parlar. 🔍 <b>Büyüteç:</b> imzanın titrek ya da kopya gibi düzgün olup olmadığına bak.`;
  else if(typeof WATCH!=='undefined'&&WATCH.has(k)||/saat/.test(k))t=`🔍 <b>Büyüteç:</b> kasanın içindeki damga ve seri numarası sığ ya da bozuksa şüphelen. ⚖️ <b>Terazi:</b> sahte saatlerin mekanizması ucuzdur, beklenenden hafif gelir.`;
  else if(typeof JEWEL!=='undefined'&&JEWEL.has(k)||SERIES.find(s=>s.id==='takı').ks.includes(k))t=`🔍 <b>Büyüteç:</b> ayar damgası net olmalı. ⚖️ <b>Terazi:</b> kaplama ya da cam taşlı taklitler gerçeğinden hafiftir.`;
  else if(typeof METAL!=='undefined'&&METAL.has(k))t=`🔍 <b>Büyüteç:</b> döküm izi ve yeni kaynak yerleri sahteyi ele verir. ⚖️ <b>Terazi:</b> içi boş ya da ucuz alaşım taklitler hafif kalır.`;
  else t=`🔦 <b>UV lamba:</b> taze boya, rötuş ve yapıştırıcı UV altında parlar. 🔍 <b>Büyüteç:</b> usta damgası ya da imza sığ ve bozuksa dikkat.`;
  return `<p class="wk-p">Bu parçanın sahtesi piyasada dolaşıyor. Ekspertiz çantasıyla incele:</p><p class="wk-p wk-tip">${t}</p><p class="wk-p wk-dim">Emin olamıyorsan <b>Uzman</b> çağır: kesin raporu o verir.</p>`}
function wkInfoRow(l,v){return `<tr><th>${l}</th><td>${v}</td></tr>`}
function wikiHtml(k){const c=catOf(k),d=WIKI[k]||['?','?','?','',''],open=wkOpen(k),s=wkSer(k),w=(S.wk&&S.wk[k])||{b:0,s:0,best:0,d:0},best=S.col&&S.col[k]!=null?S.col[k]:-1;
  const ico=icon({k,i:c.i,cond:4,id:'wk'+k,known:{}});
  const serChip=s?`<button class="wk-ser" style="--sc:${s.c}" data-act="wkser:${s.id}">${s.n}</button>`:(c.ev?`<span class="wk-ser" style="--sc:#4fd18a">${EVTS[c.ev].n}</span>`:`<span class="wk-dim">Seri dışı parça</span>`);
  const rows=wkInfoRow('Koleksiyon',serChip)+wkInfoRow('Dönem',d[0])+wkInfoRow('Köken',d[1])+wkInfoRow('Malzeme',d[2])+wkInfoRow('Taban değer',`≈ ${fmt(c.v)}`)+wkInfoRow('Sahtesi',c.f?'<span class="wk-bad">Var</span>':'<span class="wk-good">Bilinmiyor</span>')+wkInfoRow('En iyi bulduğun',best>=0?`<span style="color:${RC[best]}">${RN[best]}</span>`:'—');
  const rar=`<table class="wk-rar"><thead><tr><th>Nadirlik</th><th>Şans</th><th>Değer</th></tr></thead><tbody>${RN.map((n,i)=>`<tr class="${best>=i?'got':''}"><td><i style="background:${RC[i]}"></i>${n}${best===i?' <em>✓</em>':''}</td><td>~${pct(RCH[i])}</td><td>×${RMUL[i]} · ${fmt(r10(c.v*RMUL[i]))}</td></tr>`).join('')}</tbody></table><p class="wk-p wk-dim">Şanslar temel değerlerdir. Lüks semtler ve dükkân yetenekleri nadir parça şansını artırır.</p>`;
  const sib=s?`<div class="wk-sib">${s.ks.filter(x=>x!==k).map(x=>{const cc=catOf(x),o=wkOpen(x);return `<button class="wk-sc${o?'':' lock'}" data-act="wiki:${x}"><div class="wk-ic">${icon({k:x,i:cc.i,cond:4,id:'wks'+x,known:{}})}</div><div class="wk-nm">${cc.n}</div></button>`}).join('')}</div>`:'';
  const rec=open?`<div class="wk-rec"><div><b>${w.b}</b><small>kez aldın</small></div><div><b>${w.s}</b><small>kez sattın</small></div><div><b>${w.best?fmt(w.best):'—'}</b><small>en iyi satış</small></div><div><b>${w.d?`${w.d}. gün`:'—'}</b><small>ilk buluş</small></div></div>`:'';
  const body=open?`<h3 class="wk-h">Hakkında</h3><p class="wk-p wk-lead"><b>${c.n}</b>: ${d[3]}</p>
    <div class="wk-fact"><span>💡</span><div><small>Biliyor muydun?</small><p>${d[4]}</p></div></div>`
   :`<div class="wk-locked"><span>🔒</span><p><b>Bu sayfa henüz kilitli.</b> Parçayı bir kez satın aldığında ya da kazıda bulduğunda ansiklopedideki bütün bilgileri açılır.</p><div class="wk-blur"><i></i><i></i><i></i></div></div>`;
  return `<div class="wk-top"><button class="wk-back" data-act="wkList">‹ Ansiklopedi</button><button class="vclose" data-act="wikiX" aria-label="Kapat">✕</button></div>
   <div class="wk-page"><div class="wk-brand">Bit Pazarı Ansiklopedisi</div><h1 class="wk-title">${c.n}</h1><div class="wk-rule"></div>
    <div class="wk-box"><div class="wk-img${open?'':' dark'}" style="--rc:${RC[Math.max(0,best)]}">${ico}</div><table class="wk-tbl">${rows}</table></div>
    ${body}
    <h3 class="wk-h">Nadirlik ve değer</h3>${rar}
    <h3 class="wk-h">Sahtesini nasıl anlarsın?</h3>${wkFake(c)}
    <h3 class="wk-h">Nerede bulunur?</h3><ul class="wk-ul">${wkFound(c).map(x=>`<li>${x}</li>`).join('')}</ul>
    ${open?`<h3 class="wk-h">Senin kayıtların</h3>${rec}`:''}
    ${s?`<h3 class="wk-h">${s.n} serisinin diğer parçaları</h3>${sib}`:''}
    <p class="wk-foot">Bu sayfa en son ${S.day}. günde güncellendi.</p></div>`}
let WKF='all';
function wikiListHtml(){const all=CAT.filter(c=>WIKI[c.k]&&(!c.ev||S.evCol&&S.evCol[c.k]||evtOn(c.ev)||wkOpen(c.k)));const n=all.filter(c=>wkOpen(c.k)).length;
  const groups=[];SERIES.forEach(s=>groups.push([s.n,s.c,s.ks.map(k=>catOf(k)).filter(c=>all.includes(c))]));
  const inSer=new Set(SERIES.flatMap(s=>s.ks));const rest=all.filter(c=>!inSer.has(c.k)&&!c.ev),ev=all.filter(c=>c.ev);
  if(rest.length)groups.push(['Diğer parçalar','#9aa1a8',rest]);if(ev.length)groups.push(['Yılbaşı koleksiyonu','#4fd18a',ev]);
  const show=c=>WKF==='all'||(WKF==='got'?wkOpen(c.k):!wkOpen(c.k));
  return `<div class="colhead"><div><span class="lbl">Bit Pazarı Ansiklopedisi</span><h2 class="h">${n} / ${all.length} sayfa</h2><div class="capbar"><i style="width:${n/Math.max(1,all.length)*100}%"></i></div></div><span class="bigtrophy sm">📖</span></div>
   <p class="sub" style="margin:0">Her parçanın bir sayfası var. Bulduğun parçaların sayfası açılır: hikâyesi, nadirliği, sahtesinin nasıl anlaşılacağı ve senin kayıtların.</p>
   <input class="wk-q" id="wkq" type="search" placeholder="Parça ara…" autocomplete="off">
   <div class="wk-f">${[['all','Hepsi'],['got','Açık sayfalar'],['miss','Kilitli']].map(([id,t])=>`<button class="${WKF===id?'on':''}" data-act="wkf:${id}">${t}</button>`).join('')}</div>
   ${groups.map(([gn,gc,cs])=>{const v=cs.filter(show);if(!v.length)return '';return `<div class="wk-g" style="--sc:${gc}"><h4>${gn}<em>${cs.filter(c=>wkOpen(c.k)).length}/${cs.length}</em></h4><div class="wk-grid">${v.map(c=>{const o=wkOpen(c.k),r=S.col&&S.col[c.k]!=null?S.col[c.k]:0;return `<button class="wk-it${o?'':' lock'}" data-act="wiki:${c.k}" data-n="${c.n.toLocaleLowerCase('tr-TR')}" style="--rc:${RC[r]}"><div class="wk-ic">${icon({k:c.k,i:c.i,cond:4,id:'wl'+c.k,known:{}})}</div><div class="wk-nm">${c.n}</div>${o?'':'<i>🔒</i>'}</button>`}).join('')}</div></div>`}).join('')}`}
function wikiOpen(k){if(!WIKI[k])return;let el=$('#wiki');if(!el){el=document.createElement('div');el.id='wiki';el.className='wiki';el.setAttribute('role','dialog');$('#app').appendChild(el)}
  el.innerHTML=wikiHtml(k);el.scrollTop=0;sfx.tap();T('wiki_open',{item:k});
  if(wkOpen(k)){S.wkRead=S.wkRead||{};if(!S.wkRead[k]){S.wkRead[k]=1;gainXP(10);setTimeout(()=>toast('📖 Yeni sayfa okundu · +10 TP'),300);save()}}}
function wikiClose(){const el=$('#wiki');if(el)el.remove()}
document.addEventListener('input',e=>{if(e.target&&e.target.id==='wkq'){const q=e.target.value.trim().toLocaleLowerCase('tr-TR');document.querySelectorAll('.wk-it').forEach(b=>{b.style.display=!q||b.dataset.n.includes(q)?'':'none'});document.querySelectorAll('.wk-g').forEach(g=>{g.style.display=[...g.querySelectorAll('.wk-it')].some(b=>b.style.display!=='none')?'':'none'})}});
function wikiBanner(){const all=CAT.filter(c=>WIKI[c.k]&&!c.ev),n=all.filter(c=>wkOpen(c.k)).length;return `<button class="wk-ban" data-act="ust:wiki"><span>📖</span><div><b>Bit Pazarı Ansiklopedisi</b><small>${n} / ${all.length} sayfa açık · her parçanın hikâyesi</small></div><i>›</i></button>`}
