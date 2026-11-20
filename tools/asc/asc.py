"""App Store Connect API yardımcısı (GitHub Actions'ta çalışır).
MODE dosyası: kesif (yalnız okur) | olustur | gonder"""
import os, sys, time, json, hashlib, jwt, requests
B='https://api.appstoreconnect.apple.com'
KEY=open(os.environ['KEYFILE']).read(); KID=os.environ['ASC_KEY_ID']; ISS=os.environ['ASC_ISSUER_ID']
BUNDLE='com.ozsstudio.bitpazari'
def tok():
    n=int(time.time());return jwt.encode({'iss':ISS,'iat':n,'exp':n+1100,'aud':'appstoreconnect-v1'},KEY,algorithm='ES256',headers={'kid':KID,'typ':'JWT'})
def req(m,path,body=None,ok=(200,201,204),params=None):
    r=requests.request(m,path if path.startswith('http') else B+path,headers={'Authorization':'Bearer '+tok(),'Content-Type':'application/json'},json=body,params=params,timeout=60)
    if r.status_code not in ok:
        print('!!',m,path,r.status_code,r.text[:1500]);raise SystemExit(1)
    return r.json() if r.text else {}
def get(path,**p): return req('GET',path,params=p or None)
def allp(path,**p):
    out=[];j=get(path,**p)
    while True:
        out+=j.get('data',[]);nx=j.get('links',{}).get('next')
        if not nx:return out
        j=req('GET',nx)
app=get('/v1/apps',**{'filter[bundleId]':BUNDLE})['data'][0];AID=app['id']
print('APP',AID,app['attributes']['name'],'primaryLocale',app['attributes'].get('primaryLocale'))
MODE=open(os.path.join(os.path.dirname(__file__),'MODE')).read().strip()
print('MODE',MODE)
def iaps(): return allp(f'/v1/apps/{AID}/inAppPurchasesV2',limit=200)
if MODE=='kesif':
    for i in iaps():
        a=i['attributes'];print('IAP',i['id'],a['productId'],a['inAppPurchaseType'],a['state'],'|',a['name'])
        for l in allp(f"/v2/inAppPurchases/{i['id']}/inAppPurchaseLocalizations"):
            print('   loc',l['attributes'].get('locale'),'|',l['attributes'].get('name'),'|',l['attributes'].get('description'))
        try:
            ps=get(f"/v2/inAppPurchases/{i['id']}/iapPriceSchedule",**{'include':'manualPrices,baseTerritory'})
            for inc in ps.get('included',[]): print('   price-inc',inc['type'],inc['id'],json.dumps(inc.get('attributes'))[:120])
        except SystemExit: pass
        try:
            av=get(f"/v2/inAppPurchases/{i['id']}/inAppPurchaseAvailability")
            print('   avail',json.dumps(av['data']['attributes']))
        except SystemExit: pass
    for v in allp(f'/v1/apps/{AID}/appStoreVersions',limit=10):
        a=v['attributes'];print('VER',v['id'],a['versionString'],a['appStoreState'],a.get('appVersionState'))
    for ai in allp(f'/v1/apps/{AID}/appInfos'):
        print('APPINFO',ai['id'],ai['attributes'].get('appStoreState'),ai['attributes'].get('state'))
        for l in allp(f"/v1/appInfos/{ai['id']}/appInfoLocalizations"): print('   ailoc',l['attributes']['locale'],'|',l['attributes'].get('name'),'|',l['attributes'].get('subtitle'))
    for b in allp('/v1/builds',**{'filter[app]':AID,'sort':'-uploadedDate','limit':5,'include':'preReleaseVersion'}):
        a=b['attributes'];print('BUILD',b['id'],a['version'],a['processingState'],a.get('usesNonExemptEncryption'),a.get('uploadedDate'))
    r=get(f'/v1/apps/{AID}/reviewSubmissions',**{'filter[platform]':'IOS','limit':5})
    for s in r.get('data',[]): print('REVSUB',s['id'],s['attributes'])
