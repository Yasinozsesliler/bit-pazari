/* ===================== 1.6.0: pazarlık masası (tek dokunuşla teklif) ===================== */
function dzMood(o){const c=S.cust;if(!c)return 'warn';if(c.fz==null)c.fz=rf(.92,1.08);o+=c.kind==='seller'&&c.trade?tradeValOf(c):0;
  if(c.kind==='seller'){if(o>=c.ask)return 'good';const r=o/(c.minAccept*c.fz);return r>=1?'good':r>=.8?'warn':'bad'}
  const it=itemById(c.itemId);if(!it)return 'warn';const knows=it.fake&&(it.known.expert||it.known.suspect);const cap=(c.honest&&knows)?it.appear*.33:c.maxPay;const r=o/(cap*c.fz);return r<=1?'good':r<=1.3?'warn':'bad'}
const DZE={good:'😊',warn:'😐',bad:'😠'};
function dzCards(){const c=S.cust;if(!c)return[];
  if(c.kind==='seller'){const a=c.ask,lo=c.hist&&c.hist.filter(h=>h.w==='p').map(h=>h.v).pop()||0;
    const L=[['Cesur',.6,.3],['Makul',.75,.55],['Güvenli',.9,.8]];let pv=lo;const out=[];
    L.forEach(([l,f,g])=>{let v=lo?r10(lo+(a-lo)*g):r10(a*f);if(v<=pv)v=pv+10;if(v<a){out.push([l,v]);pv=v}});return out}
  const it=itemById(c.itemId);if(!it)return[];const b=Math.max(it.appear,it.paid);
  return [['Güvenli',1.2],['Makul',1.5],['Cesur',1.9]].map(([l,f])=>[l,r10(b*f)])}
function dzHist(){const c=S.cust;if(!c)return '';c.hist=c.hist||[];const h=c.hist.slice(-5);if(!h.length)return '';
  return `<div class="hg-h">${h.map(x=>`<span class="hg-b ${x.w}">${x.w==='p'?'Sen':'Müşteri'} <b>${fmt(x.v)}</b></span>`).join('<i>›</i>')}</div>`}
function dzOffer(lbl){const c=S.cust;const cs=dzCards();const showMood=has('z1')||S.lv>=1;
  return `${dzHist()}<div class="hg-cards">${cs.map(([l,v])=>{const m=dzMood(v);return `<button class="hg-c ${m}" data-act="og:${v}" ${busy?'disabled':''}><small>${l}</small><b>${fmt(v)}</b><span class="hg-e">${showMood?DZE[m]:''}</span><em>${c.kind==='seller'?pct(Math.round(v/c.ask*100)):'×'+(v/Math.max(1,(itemById(c.itemId)||{}).appear||v)).toFixed(1)}</em></button>`}).join('')}</div>`}
function dzChips(){return ''}
function dzInfo(l1,v1,it,extra){return `<div class="of-info"><div class="of-pill"><small>${l1}</small><b>${v1}</b></div><div class="of-pill of-val"><small>Tahmini değer</small><div class="dz-vv">${dzVal(it)}</div></div>${extra||''}</div>`}
function dzTool(act,ic,t,dis,cls){return `<button class="of-t ${cls||''}" data-act="${act}" ${dis?'disabled':''}><span>${ic}</span><small>${t}</small></button>`}
function rlSync(){const hh=$('.hg-h');if(hh)hh.scrollLeft=hh.scrollWidth;const go=$('#offerGo');if(!go)return;go.dataset.act='customOffer';go.disabled=!!busy;go.classList.add('hg-own');go.innerHTML=`✎ Kendi teklifin<small>Tutarı sen yaz</small>`}
function customOffer(){const c=S.cust;if(!c||c.done)return;numPad({label:c.kind==='buyer'?'Fiyatın':'Teklifin',value:0,onDone:v=>{if(!(v>0))return;S.offer=v;c.kind==='seller'?sellerOffer():buyerPropose()}})}
function ogSend(v){const c=S.cust;if(!c||c.done||busy)return;S.offer=+v;c.kind==='seller'?sellerOffer():buyerPropose()}
const _sO0=sellerOffer;sellerOffer=function(){const c=S.cust;if(c){c.hist=c.hist||[];if(!c.hist.length)c.hist.push({w:'c',v:c.ask});const a0=c.ask;c.hist.push({w:'p',v:S.offer});_sO0();if(S.cust===c&&!c.done&&c.ask!==a0){c.hist.push({w:'c',v:c.ask});render()}}else _sO0()};
const _bP0=buyerPropose;buyerPropose=function(p){const c=S.cust;if(c){c.hist=c.hist||[];const k0=c.counter;c.hist.push({w:'p',v:p!=null?p:S.offer});_bP0(p);if(S.cust===c&&!c.done&&c.counter&&c.counter!==k0){c.hist.push({w:'c',v:c.counter});render()}}else _bP0(p)};
function updOffer(){reactPreview();save()}
