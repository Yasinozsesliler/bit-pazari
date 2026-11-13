/* ===================== 1.6.0: yeni pazarlık paneli (cetvel) ===================== */
const RLPX=12;let RLB=null;
function rlConf(){const c=S.cust;if(!c)return null;let ref,max,marks;
  if(c.kind==='seller'){ref=c.ask;max=r10(ref*1.25);marks=[[r10(ref*.5),'%50'],[r10(ref*.7),'%70'],[r10(ref*.85),'%85'],[ref,'İstediği']]}
  else{const it=itemById(c.itemId);if(!it)return null;ref=Math.max(it.appear,it.paid);max=r10(ref*2.6);marks=[[it.paid||r10(ref*.5),'Maliyet'],[r10(ref*1.3),'×1.3'],[r10(ref*1.6),'×1.6'],[r10(ref*2),'×2']]}
  let step=stepOf(ref*.3);while(max/step>260)step*=2;return{ref,max,step,marks,n:Math.ceil(max/step)}}
function rlPct(){const c=S.cust;if(!c||!(S.offer>0))return '';const f=rlConf();if(!f)return '';
  if(c.kind==='seller'){const p=Math.round(S.offer/f.ref*100);return `<span class="ofx ${p>=100?'g':p>=80?'y':'r'}">İstenene göre ${pct(p)}</span>`}
  const it=itemById(c.itemId),p=it&&it.paid?Math.round((S.offer-it.paid)/it.paid*100):0;return it&&it.paid?`<span class="ofx ${p>=0?'g':'r'}">${p>=0?'+':''}${pct(p)} kâr</span>`:''}
function dzInfo(l1,v1,it,extra){return `<div class="of-info"><div class="of-pill"><small>${l1}</small><b>${v1}</b></div><div class="of-pill of-val"><small>Tahmini değer</small><div class="dz-vv">${dzVal(it)}</div></div>${extra||''}</div>`}
function dzOffer(lbl){const f=rlConf();if(!f)return '';let t='';
  for(let i=0;i<=f.n;i++){const v=i*f.step,maj=i%5===0;t+=`<i class="${maj?'mj':''}" style="left:${i*RLPX}px">${maj&&v?`<em>${fmt(v).replace(/\s?₺/,'')}</em>`:''}</i>`}
  const mk=f.marks.map(([v,l])=>`<button class="rl-mk" data-act="q:${v}" style="left:${v/f.step*RLPX}px">${l}</button>`).join('');
  return `<div class="of-card"><div class="of-hd"><small>${lbl}</small><span id="ofPct">${rlPct()}</span></div>
   <div class="of-num"><button class="of-sb" data-act="dec" aria-label="Azalt">−</button><button class="of-v" data-act="typeOffer" id="offerBox" aria-label="Tutarı elle yaz"><b id="offerV">${S.offer>0?fmt(S.offer):'<span class="ph">Kaydır ya da dokun</span>'}</b><span class="pen">✎</span></button><button class="of-sb" data-act="inc" aria-label="Artır">+</button></div>
   <div class="rl" id="rl" data-step="${f.step}" data-max="${f.max}"><div class="rl-sp"></div><div class="rl-tr" style="width:${f.n*RLPX}px">${t}${mk}</div><div class="rl-sp"></div></div><div class="rl-nd"></div></div>`}
function dzChips(){return ''}
function dzTool(act,ic,t,dis,cls){return `<button class="of-t ${cls||''}" data-act="${act}" ${dis?'disabled':''}><span>${ic}</span><small>${t}</small></button>`}
function rlPaint(){const v=$('#offerV');if(v)v.innerHTML=S.offer>0?fmt(S.offer):'<span class="ph">Kaydır ya da dokun</span>';const p=$('#ofPct');if(p)p.innerHTML=rlPct();
  const go=$('#offerGo');if(go){go.disabled=busy||!(S.offer>0||(S.cust&&S.cust.trade));let s=go.querySelector('small.ov');if(!s){s=document.createElement('small');s.className='ov';go.appendChild(s)}s.textContent=S.offer>0?fmt(S.offer):''}
  document.querySelectorAll('.rl-mk').forEach(q=>q.classList.toggle('on',+q.dataset.act.slice(2)===S.offer))}
function rlSync(smooth){const r=$('#rl');if(!r)return;const st=+r.dataset.step;const x=Math.max(0,(S.offer||0)/st*RLPX);RLB=Date.now()+(smooth?600:120);
  try{r.scrollTo({left:x,behavior:smooth?'smooth':'auto'})}catch(e){r.scrollLeft=x}rlPaint()}
let RLT=0,RLS=0;
document.addEventListener('scroll',e=>{const r=e.target;if(!r||r.id!=='rl')return;if(RLB&&Date.now()<RLB)return;
  const st=+r.dataset.step,mx=+r.dataset.max;let v=Math.round(r.scrollLeft/RLPX)*st;v=Math.max(0,Math.min(mx,v));if(v===S.offer)return;
  S.offer=v;rlPaint();const now=Date.now();if(now-RLT>45){RLT=now;try{tone(1500,.012,'square',.012)}catch(_){}buzz(4)}
  clearTimeout(RLS);RLS=setTimeout(()=>{reactPreview();save()},90)},true);
function updOffer(){rlSync(true);const r=$('#offerR');if(r){if(S.offer>+r.max)r.max=S.offer;r.value=S.offer}reactPreview();save()}
