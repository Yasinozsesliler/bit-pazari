import asyncio, base64, os, sys
from playwright.async_api import async_playwright
R='/home/claude/bit-pazari'
F=R+'/www/fonts/'
def ff(n): return 'data:font/woff2;base64,'+base64.b64encode(open(F+n,'rb').read()).decode()
CAP=[('02-pazarlik','PAZARLIK ET','Her müşterinin bir huyu var'),
('03-3d-inceleme','SAHTEYİ YAKALA','Büyüteç, UV lamba ve terazi'),
('06-e-mezat',"E-MEZAT'TA SAT",'Canlı açık artırmalara katıl'),
('07-harita',"İSTANBUL'DA BÜYÜ",'Kapalıçarşı’dan Nişantaşı’na'),
('04-raflar','120+ ANTİKA','Her biri elinde 3 boyutlu'),
('05-aksam','KEPENGİ İNDİR','Günün kârını say'),
('08-ustalik','USTALAŞ','Yeteneklerini geliştir'),
('09-koleksiyon','KOLEKSİYONU TAMAMLA','13 seri, 40 farklı saat'),
('01-menu','İNTERNETSİZ OYNA','Ücretsiz antika al-sat oyunu')]
CSS=f"""@font-face{{font-family:C;font-weight:900;src:url({ff('cinzel-latin-ext-900-normal.woff2')});unicode-range:U+0100-024F}}
@font-face{{font-family:C;font-weight:900;src:url({ff('cinzel-latin-900-normal.woff2')})}}
@font-face{{font-family:N;font-weight:800;src:url({ff('nunito-latin-ext-800-normal.woff2')});unicode-range:U+0100-024F}}
@font-face{{font-family:N;font-weight:800;src:url({ff('nunito-latin-800-normal.woff2')})}}
*{{margin:0;box-sizing:border-box}}body{{width:var(--w);height:var(--h);overflow:hidden;
background:radial-gradient(120% 60% at 50% 0%,#1f4a40 0%,#0d1f1c 55%,#08120f 100%);display:flex;flex-direction:column;align-items:center}}
.t{{font-family:C;font-weight:900;color:#f3c969;text-align:center;letter-spacing:.02em;text-shadow:0 .04em .12em #0008;line-height:1.05;white-space:nowrap}}
.s{{font-family:N;font-weight:800;color:#e9dcc0;text-align:center;opacity:.92}}
.ph{{border-radius:calc(var(--w)*.075);overflow:hidden;border:calc(var(--w)*.012) solid #c9a24a;box-shadow:0 0 0 calc(var(--w)*.006) #3a2a10,0 calc(var(--w)*.04) calc(var(--w)*.1) #000a}}
.ph img{{display:block;width:100%}}"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for tag,W,H,src in [('ios',1320,2868,'screens-ios'),('play',1080,2160,'screens')]:
      os.makedirs(tag,exist_ok=True)
      pg=await b.new_page(viewport={'width':W,'height':H})
      for i,(f,t,s) in enumerate(CAP,1):
        img='data:image/png;base64,'+base64.b64encode(open(f'{R}/store/{src}/{f}.png','rb').read()).decode()
        pw=0.80 if tag=='ios' else 0.74
        html=f"""<html><head><style>{CSS}</style></head><body style="--w:{W}px;--h:{H}px">
<div class=t style="font-size:{W*.092}px;margin-top:{H*.055}px;padding:0 {W*.05}px;width:100%;overflow:hidden;height:{W*.11}px;display:flex;align-items:center;justify-content:center">{t}</div>
<div class=s style="font-size:{W*.046}px;margin-top:{H*.012}px">{s}</div>
<div class=ph style="width:{W*pw}px;margin-top:{H*.035}px"><img src="{img}"></div></body></html>"""
        await pg.set_content(html); await pg.wait_for_timeout(150)
        await pg.evaluate("()=>{const t=document.querySelector('.t');let f=parseFloat(t.style.fontSize);while(t.scrollWidth>t.clientWidth&&f>20){f-=2;t.style.fontSize=f+'px'}}")
        await pg.screenshot(path=f'{tag}/{i:02d}-{f}.png')
    await b.close()
asyncio.run(main())
