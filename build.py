#!/usr/bin/env python3
"""src/game.html -> www/index.html (çevrimdışı, Android uyumlu). Kullanım: npm run build"""
import os, re, shutil, subprocess
R=os.path.dirname(os.path.abspath(__file__)); os.chdir(R)
W='www'; shutil.rmtree(W,ignore_errors=True); os.makedirs(W+'/fonts'); os.makedirs(W+'/lib')
# ---- fontlar (latin + latin-ext: Türkçe karakterler) ----
FONTS=[("Cinzel","cinzel",[(700,"normal"),(900,"normal")]),("Lilita One","lilita-one",[(400,"normal")]),
("Nunito","nunito",[(w,"normal") for w in (600,700,800,900)]),("Mrs Saint Delafield","mrs-saint-delafield",[(400,"normal")])]
RANGES={"latin":"U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
"latin-ext":"U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"}
css=[];miss=[]
for fam,pkg,vs in FONTS:
  for w,st in vs:
    for sub in ("latin-ext","latin"):
      fn=f"{pkg}-{sub}-{w}-{st}.woff2";src=f"node_modules/@fontsource/{pkg}/files/{fn}"
      if not os.path.exists(src): miss.append(fn);continue
      shutil.copy(src,f"{W}/fonts/{fn}")
      css.append(f"@font-face{{font-family:'{fam}';font-style:{st};font-weight:{w};font-display:swap;src:url(./{fn}) format('woff2');unicode-range:{RANGES[sub]}}}")
open(f"{W}/fonts/fonts.css","w").write("\n".join(css))
if miss: raise SystemExit("eksik font: "+str(miss))
shutil.copy("node_modules/three/build/three.min.js",f"{W}/lib/three.min.js")
# ---- native köprü ----
subprocess.check_call(["npx","esbuild","src/native.js","--bundle","--minify","--format=iife","--target=chrome90",f"--outfile={W}/native.js"])
# ---- oyun HTML ----
s=open("src/game.html",encoding="utf-8").read()
def rep(a,b,cnt=1):
  global s
  if s.count(a)!=cnt: raise SystemExit(f"patch bulunamadı ({s.count(a)}x): "+a[:70])
  s=s.replace(a,b)
s=re.sub(r'<link rel="preconnect"[^>]*>\n?','',s)
s,n=re.subn(r'<link href="https://fonts.googleapis.com[^"]*" rel="stylesheet">','<link rel="stylesheet" href="fonts/fonts.css">',s)
if n!=1: raise SystemExit("font bağlantısı bulunamadı")
rep("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js","lib/three.min.js")
# reklam: gerçek AdMob ödüllü reklamı
rep("function adShow(cb,label){",
 "function adShow(cb,label){if(window.NATIVE&&NATIVE.isNative){if(window.__adBusy)return;window.__adBusy=1;closeModal();toast('Reklam yükleniyor…');"
 "try{AC&&AC.suspend()}catch(e){}NATIVE.rewarded().then(ok=>{window.__adBusy=0;try{AC&&AC.resume()}catch(e){}"
 "if(ok){sfx.ok();cb()}else toast('Reklam şu an yüklenemedi ya da yarıda kapandı. Biraz sonra tekrar dene.')});return}")
# açılış: Preferences yedeği geri yüklendikten sonra oyunu başlat
rep("<script>\n(function(){","<script>\n(window.__BP_PRE||Promise.resolve()).then(()=>0,()=>0).then(function(){")
rep("render();\n})();\n</script>","render();\n});\n</script>")
head='''<!doctype html>
<html lang="tr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="theme-color" content="#0d1f1c">
<meta name="format-detection" content="telephone=no">
<style>html.native,html.native body{-webkit-tap-highlight-color:transparent;overscroll-behavior:none;-webkit-user-select:none;user-select:none}html.native input,html.native textarea{-webkit-user-select:text;user-select:text}</style>
<script src="native.js"></script>
'''
s=re.sub(r'^\s*<!doctype html>\s*','',s,flags=re.I)
s=re.sub(r'^\s*<html[^>]*>\s*(<head>)?\s*','',s,flags=re.I)
s=re.sub(r'<meta (charset|name="viewport")[^>]*>\s*','',s)
s=head+s
if '</html>' not in s: s=s.rstrip()+'\n</body></html>\n'
open(f"{W}/index.html","w",encoding="utf-8").write(s)
print("www hazır:",round(sum(os.path.getsize(os.path.join(d,f)) for d,_,fs in os.walk(W) for f in fs)/1e6,2),"MB")
