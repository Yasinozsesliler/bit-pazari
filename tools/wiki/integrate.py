import json,re,os
R='/home/claude/bit-pazari/'
W={}
for i in range(1,7):
  d={}; exec(open(R+f'tools/wiki/w{i}.py').read(),d); W.update(d['W'])
tr={k:[f.split('||')[0] for f in v] for k,v in W.items()}
en_pairs={}
for k,v in W.items():
  for f in v:
    a,b=f.split('||')
    if a!=b: en_pairs[a]=b
data='const WIKI='+json.dumps(tr,ensure_ascii=False,separators=(',',':'))+';'
p=R+'src/game.html'; s=open(p).read()
feat=(open(R+'tools/wiki/feature.js').read()+open(R+'tools/wiki/offer.js').read()).replace('/*WIKI_DATA*/const WIKI={};/*WIKI_END*/','/*WIKI_DATA*/'+data+'/*WIKI_END*/')
css=open(R+'tools/wiki/feature.css').read()+open(R+'tools/wiki/offer.css').read()
def sub(old,new,cnt=1):
  global s
  assert s.count(old)>=1,old[:80]
  s=s.replace(old,new,cnt)
if '/* ===== 1.6.0 Ansiklopedi =====' not in s:
  sub('family=Cinzel:wght@700;900&','family=Cinzel:wght@700;900&family=Lora:ital,wght@0,500;0,600;1,500&family=Playfair+Display:wght@700;900&')
  i=s.index('</style>'); s=s[:i]+css+s[i:]
  sub('/* rastgele seçimlerde sahip olunmayan paket eşyaları çıkmasın */',feat+'\n/* rastgele seçimlerde sahip olunmayan paket eşyaları çıkmasın */')
  sub("  if(a.startsWith('ust:')){","""  if(a.startsWith('wiki:')){wikiOpen(a.slice(5));return}
  if(a==='wikiX'){sfx.tap();wikiClose();return}
  if(a==='wkList'){wikiHome();return}
  if(a.startsWith('wkser:')){wikiHome(a.slice(6));return}
  if(a==='wkHome'){wikiHome();return}
  if(a.startsWith('og:')){ogSend(a.slice(3));return}
  if(a==='customOffer'){sfx.tap();customOffer();return}
  if(a.startsWith('wkgo:')){const t=document.getElementById(a.slice(5)),el=$('#wiki');if(t&&el)el.scrollTo({top:t.offsetTop-56,behavior:'smooth'});return}
  if(a.startsWith('ust:')){""")
  sub("else reactPreview()}}","else{reactPreview();rlSync()}}}")
  sub("""  if(ustTab==='col')return `<div class="page ust">${seg}${renderCol()}</div>`;""","""  if(ustTab==='wiki')return `<div class="page ust">${seg}${wikiListHtml()}</div>`;
  if(ustTab==='col')return `<div class="page ust">${seg}${renderCol()}</div>`;""")
  sub("if(ustTab==='col')return `<div class=\"page ust\">${seg}${renderCol()}</div>`;","if(ustTab==='col')return `<div class=\"page ust\">${seg}${wikiBanner()}${renderCol()}</div>`;")
  # album slots (both renderCol versions + event album)
  s=s.replace('''return `<div class="slot${got?' got':''}" style="--rc:${RC[r]}" title="${got?c.n:'?'}">''','''return `<div class="slot${got?' got':''}" data-act="wiki:${k}" style="--rc:${RC[r]}" title="${got?c.n:'?'}">''')
  sub('''return `<div class="slot${got?' got':''}" style="--rc:#4fd18a">''','''return `<div class="slot${got?' got':''}" data-act="wiki:${c.k}" style="--rc:#4fd18a">''')
  sub('''<h2 class="h">${it.n}</h2></div><button class="vclose" data-act="vclose" aria-label="Kapat">✕</button></div>''','''<h2 class="h">${it.n}</h2></div><div style="display:flex;align-items:center">${WIKI[it.k]&&!it.chest?`<button class="vwiki" data-act="wiki:${it.k}">📖 Ansiklopedi</button>`:''}<button class="vclose" data-act="vclose" aria-label="Kapat">✕</button></div></div>''')
open(p,'w').write(s)
# en.json
ep=R+'tools/i18n/en.json'; en=json.load(open(ep))
n0=len(en)
for a,b in en_pairs.items(): en.setdefault(a,b)
d={}; exec(open(R+'tools/wiki/en_ui.py').read(),d)
for a,b in d['E'].items(): en[a]=b
json.dump(en,open(ep,'w'),ensure_ascii=False,indent=0)
print('ok', len(tr), 'en added', len(en)-n0)
