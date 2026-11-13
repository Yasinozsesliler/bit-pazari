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
function wkLink(k,cls){const c=catOf(k),o=wkOpen(k);return `<a class="wkl${o?'':' red'}${cls?' '+cls:''}" data-act="wiki:${k}">${c.n}</a>`}
function wkTop(){return `<div class="wp-bar"><button class="wp-ic" data-act="wkHome" aria-label="Ana sayfa">☰</button><button class="wp-logo" data-act="wkHome"><b>Bit Pazarı</b><small>Ansiklopedisi</small></button><button class="wp-ic" data-act="wkHome" aria-label="Ara">🔍</button><button class="wp-ic" data-act="wikiX" aria-label="Kapat">✕</button></div>`}
function wkFooter(){return `<div class="wp-foot"><p>Bu sayfa en son ${S.day}. günde değiştirildi.</p><p>Metin, Bit Pazarı dükkân sahipleri tarafından yazılmıştır. <a class="wkl" data-act="wkHome">Ana Sayfa</a> · <a class="wkl" data-act="wikiX">Dükkâna dön</a></p></div>`}
function wikiHtml(k){const c=catOf(k),d=WIKI[k]||['?','?','?','',''],open=wkOpen(k),s=wkSer(k),w=(S.wk&&S.wk[k])||{b:0,s:0,best:0,d:0},best=S.col&&S.col[k]!=null?S.col[k]:-1;
  const ico=icon({k,i:c.i,cond:4,id:'wk'+k,known:{}});
  const serL=s?`<a class="wkl" data-act="wkser:${s.id}">${s.n}</a>`:(c.ev?EVTS[c.ev].n:'—');
  const ib=`<table class="wp-ib"><tr><th colspan="2" class="wp-ibt" style="--sc:${s?s.c:'#a2a9b1'}">${c.n}</th></tr><tr><td colspan="2" class="wp-ibi"><div class="wp-img${open?'':' dark'}">${ico}</div><div class="wp-cap">${open?`${d[2]}, ${d[0]}`:'Görsel henüz yok'}</div></td></tr>
    <tr><th>Koleksiyon</th><td>${serL}</td></tr><tr><th>Dönem</th><td>${d[0]}</td></tr><tr><th>Köken</th><td>${d[1]}</td></tr><tr><th>Malzeme</th><td>${d[2]}</td></tr>
    <tr><th>Taban değer</th><td>≈ ${fmt(c.v)}</td></tr><tr><th>Sahtesi</th><td>${c.f?'Var<sup>[a]</sup>':'Bilinmiyor'}</td></tr><tr><th>En iyi buluşun</th><td>${best>=0?`<span class="wp-rd" style="--rc:${RC[best]}"></span>${RN[best]}`:'—'}</td></tr></table>`;
  if(!open)return wkTop()+`<div class="wp-page"><h1 class="wp-h1">${c.n}</h1><div class="wp-sub">Bit Pazarı Ansiklopedisi'nden</div>
    <div class="wp-miss"><b>Bit Pazarı Ansiklopedisi'nde henüz bu adda bir madde yok.</b><p>Bu madde, parçayı ilk kez satın aldığında ya da kazıda bulduğunda kendiliğinden yazılır. O zamana kadar bildiklerimiz şunlar:</p></div>
    ${ib}<h2 class="wp-h2">Nerede bulunur?</h2><ul class="wp-ul">${wkFound(c).map(x=>`<li>${x}</li>`).join('')}</ul>
    ${s?`<h2 class="wp-h2">Ayrıca bakınız</h2><ul class="wp-ul">${s.ks.filter(x=>x!==k).map(x=>`<li>${wkLink(x)}</li>`).join('')}</ul>`:''}${wkFooter()}</div>`;
  const toc=[['wh1','Hakkında'],['wh2','Nadirlik ve değer'],['wh3','Sahtesini anlamak'],['wh4','Nerede bulunur?'],['wh5','Senin kayıtların']].concat(s?[['wh6','Ayrıca bakınız']]:[]).concat([['wh7','Notlar']]);
  const lead=`<p class="wp-p"><b>${c.n}</b>, ${d[0]} dönemine ait, ${d[1]} kökenli bir ${s?`<a class="wkl" data-act="wkser:${s.id}">${s.n}</a> serisi parçasıdır`:'koleksiyon parçasıdır'}. ${d[3]}</p>`;
  const rar=`<table class="wp-tbl"><tr><th>Nadirlik</th><th>Çıkma şansı<sup>[b]</sup></th><th>Değer</th></tr>${RN.map((n,i)=>`<tr${best===i?' class="me"':''}><td><span class="wp-rd" style="--rc:${RC[i]}"></span>${n}</td><td>~${pct(RCH[i])}</td><td>×${RMUL[i]} (≈ ${fmt(r10(c.v*RMUL[i]))})</td></tr>`).join('')}</table>`;
  const rec=`<table class="wp-tbl"><tr><th>Satın aldığın</th><td>${w.b} kez</td></tr><tr><th>Sattığın</th><td>${w.s} kez</td></tr><tr><th>En iyi satışın</th><td>${w.best?fmt(w.best):'—'}</td></tr><tr><th>İlk buluşun</th><td>${w.d?`${w.d}. gün`:'—'}</td></tr></table>`;
  const cats=[s?s.n:null,`${d[0]} eşyaları`,`${d[1]} kökenli eşyalar`,c.f?'Sahtesi dolaşan eşyalar':null].filter(Boolean);
  return wkTop()+`<div class="wp-page"><h1 class="wp-h1">${c.n}</h1>
   <div class="wp-tabs"><span class="on">Madde</span><a data-act="wkgo:wh5">Kayıtlarım</a><em>Oku</em></div>
   <div class="wp-sub">Bit Pazarı Ansiklopedisi'nden</div>
   ${ib}${lead}
   <div class="wp-toc"><b>İçindekiler</b><ol>${toc.map(([id,t])=>`<li><a class="wkl" data-act="wkgo:${id}">${t}</a></li>`).join('')}</ol></div>
   <h2 class="wp-h2" id="wh1">Hakkında</h2><p class="wp-p">${d[3]}</p><div class="wp-dyk"><b>Biliyor musunuz?</b><p>…${d[4].charAt(0).toLocaleLowerCase('tr-TR')+d[4].slice(1)}</p></div>
   <h2 class="wp-h2" id="wh2">Nadirlik ve değer</h2>${rar}
   <h2 class="wp-h2" id="wh3">Sahtesini anlamak</h2>${wkFake(c)}
   <h2 class="wp-h2" id="wh4">Nerede bulunur?</h2><ul class="wp-ul">${wkFound(c).map(x=>`<li>${x}</li>`).join('')}</ul>
   <h2 class="wp-h2" id="wh5">Senin kayıtların</h2>${rec}
   ${s?`<h2 class="wp-h2" id="wh6">Ayrıca bakınız</h2><ul class="wp-ul wp-cols">${s.ks.filter(x=>x!==k).map(x=>`<li>${wkLink(x)}</li>`).join('')}</ul>`:''}
   <h2 class="wp-h2" id="wh7">Notlar</h2><ol class="wp-notes" type="a"><li>${c.f?'Sahte kopyaları ekspertiz çantasıyla ya da uzman raporuyla ayırt edilebilir.':'Bilinen bir sahtesi yoktur.'}</li><li>Şanslar temel değerlerdir. Lüks semtler ve dükkân yetenekleri nadir parça şansını artırır.</li></ol>
   <div class="wp-cats"><b>Kategoriler:</b> ${cats.map(x=>`<span>${x}</span>`).join(' | ')}</div>${wkFooter()}</div>`}
function wikiHomeHtml(){const all=CAT.filter(c=>WIKI[c.k]&&(!c.ev||evtOn(c.ev)||wkOpen(c.k))),open=all.filter(c=>wkOpen(c.k));
  const fe=open.length?open[(S.day*7+open.length)%open.length]:all[S.day%all.length],fd=WIKI[fe.k];
  const facts=open.slice().sort((a,b)=>hashStr(a.k+S.day)%97-hashStr(b.k+S.day)%97).slice(0,3);
  const inSer=new Set(SERIES.flatMap(s=>s.ks));const groups=SERIES.map(s=>[s.id,s.n,s.ks.filter(k=>all.some(c=>c.k===k))]);
  const rest=all.filter(c=>!inSer.has(c.k)).map(c=>c.k);if(rest.length)groups.push(['diger','Diğer parçalar',rest]);
  return wkTop()+`<div class="wp-page wp-home"><div class="wp-wel"><h1>Bit Pazarı Ansiklopedisi'ne hoş geldiniz</h1><p>dükkân sahiplerinin yazdığı özgür ansiklopedi</p><p class="wp-cnt"><b>${all.length}</b> maddeden <b>${open.length}</b> tanesi açık</p></div>
   <div class="wp-search"><span>🔍</span><input id="wkq" type="search" placeholder="Bit Pazarı Ansiklopedisi'nde ara" autocomplete="off"></div>
   <div class="wp-box wp-gr"><h2>Seçkin madde</h2><div class="wp-fe"><div class="wp-fei${wkOpen(fe.k)?'':' dark'}">${icon({k:fe.k,i:fe.i,cond:4,id:'wf'+fe.k,known:{}})}</div><p><b>${wkLink(fe.k)}</b>${wkOpen(fe.k)?`, ${fd[0]} dönemine ait ${fd[1]} kökenli bir parçadır. ${fd[3]}`:': bu madde henüz yazılmadı. Parçayı bulan ilk sen ol!'} <a class="wkl" data-act="wiki:${fe.k}">(Devamı…)</a></p></div></div>
   ${facts.length?`<div class="wp-box wp-bl"><h2>Biliyor musunuz…</h2><ul>${facts.map(c=>`<li>…${WIKI[c.k][4].charAt(0).toLocaleLowerCase('tr-TR')+WIKI[c.k][4].slice(1).replace(/\.$/,'')}? <small>(${wkLink(c.k)})</small></li>`).join('')}</ul></div>`:''}
   <div class="wp-box"><h2>Madde dizini</h2><p class="wp-leg"><a class="wkl">Mavi</a> bağlantılar açık maddelerdir, <a class="wkl red">kırmızı</a> olanlar henüz yazılmadı.</p>
    ${groups.filter(g=>g[2].length).map(([id,n,ks])=>`<div class="wp-grp" id="wks-${id}"><h3>${n} <small>(${ks.filter(wkOpen).length}/${ks.length})</small></h3><p>${ks.map(k=>`<span class="wp-li" data-n="${catOf(k).n.toLocaleLowerCase('tr-TR')}">${wkLink(k)}</span>`).join(' · ')}</p></div>`).join('')}</div>
   ${wkFooter()}</div>`}
function wkEl(){let el=$('#wiki');if(!el){el=document.createElement('div');el.id='wiki';el.className='wiki';el.setAttribute('role','dialog');$('#app').appendChild(el)}return el}
function wikiOpen(k){if(!WIKI[k])return;const el=wkEl();el.innerHTML=wikiHtml(k);el.scrollTop=0;sfx.tap();T('wiki_open',{item:k});
  if(wkOpen(k)){S.wkRead=S.wkRead||{};if(!S.wkRead[k]){S.wkRead[k]=1;gainXP(10);setTimeout(()=>toast('📖 Yeni sayfa okundu · +10 TP'),300);save()}}}
function wikiHome(ser){const el=wkEl();el.innerHTML=wikiHomeHtml();el.scrollTop=0;sfx.tap();if(ser){const g=document.getElementById('wks-'+ser);if(g)setTimeout(()=>{el.scrollTop=g.offsetTop-60},30)}}
function wikiClose(){const el=$('#wiki');if(el)el.remove()}
document.addEventListener('input',e=>{if(e.target&&e.target.id==='wkq'){const q=e.target.value.trim().toLocaleLowerCase('tr-TR');document.querySelectorAll('.wp-li').forEach(b=>{b.style.display=!q||b.dataset.n.includes(q)?'':'none'});document.querySelectorAll('.wp-grp').forEach(g=>{g.style.display=[...g.querySelectorAll('.wp-li')].some(b=>b.style.display!=='none')?'':'none'})}});
function wikiBanner(){const all=CAT.filter(c=>WIKI[c.k]&&!c.ev),n=all.filter(c=>wkOpen(c.k)).length;return `<button class="wk-ban" data-act="wkHome"><span>📖</span><div><b>Bit Pazarı Ansiklopedisi</b><small>${n} / ${all.length} madde açık · her parçanın hikâyesi</small></div><i>›</i></button>`}
function wikiListHtml(){return renderCol()}
