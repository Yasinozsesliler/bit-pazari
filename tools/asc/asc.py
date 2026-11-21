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

P=json.load(open(os.path.join(os.path.dirname(__file__),'plan.json'),encoding='utf-8'))
def iap_state(iid): return get(f'/v2/inAppPurchases/{iid}')['data']['attributes']['state']
if MODE in('olustur','hepsi'):
    ex={i['attributes']['productId']:i for i in iaps()}
    kese=ex['com.ozsstudio.bitpazari.kese']['id']
    av=get(f'/v2/inAppPurchases/{kese}/inAppPurchaseAvailability')['data']
    terr=[{'type':'territories','id':t['id']} for t in allp(f"/v1/inAppPurchaseAvailabilities/{av['id']}/availableTerritories",limit=200)]
    print('territories',len(terr))
    for x in P['iap']:
        if x['pid'] in ex: iid=ex[x['pid']]['id'];print('var',x['pid'],iid)
        else:
            iid=req('POST','/v2/inAppPurchases',{'data':{'type':'inAppPurchases','attributes':{'name':x['ref'],'productId':x['pid'],'inAppPurchaseType':'CONSUMABLE','reviewNote':x['note'],'familySharable':False},'relationships':{'app':{'data':{'type':'apps','id':AID}}}}})['data']['id']
            print('olusturuldu',x['pid'],iid)
        have={l['attributes']['locale'] for l in allp(f'/v2/inAppPurchases/{iid}/inAppPurchaseLocalizations')}
        for loc,(n,d) in x['loc'].items():
            if loc in have: continue
            req('POST','/v1/inAppPurchaseLocalizations',{'data':{'type':'inAppPurchaseLocalizations','attributes':{'locale':loc,'name':n,'description':d},'relationships':{'inAppPurchaseV2':{'data':{'type':'inAppPurchases','id':iid}}}}});print('  loc',loc)
        # fiyat
        has_price=False
        try:
            ps=req('GET',f'/v2/inAppPurchases/{iid}/iapPriceSchedule',params={'include':'manualPrices'},ok=(200,404))
            has_price=any(i['type']=='inAppPurchasePrices' for i in ps.get('included',[]))
        except SystemExit: pass
        if not has_price:
            pts=allp(f'/v2/inAppPurchases/{iid}/pricePoints',**{'filter[territory]':'TUR','limit':200})
            pp=[p for p in pts if p['attributes']['customerPrice']==x['price']]
            if not pp: print('!! fiyat noktasi yok',x['price'],[p['attributes']['customerPrice'] for p in pts][:80]);raise SystemExit(1)
            req('POST','/v1/inAppPurchasePriceSchedules',{'data':{'type':'inAppPurchasePriceSchedules','relationships':{'inAppPurchase':{'data':{'type':'inAppPurchases','id':iid}},'baseTerritory':{'data':{'type':'territories','id':'TUR'}},'manualPrices':{'data':[{'type':'inAppPurchasePrices','id':'${p0}'}]}}},
               'included':[{'type':'inAppPurchasePrices','id':'${p0}','attributes':{'startDate':None},'relationships':{'inAppPurchasePricePoint':{'data':{'type':'inAppPurchasePricePoints','id':pp[0]['id']}}}}]})
            print('  fiyat',x['price'])
        # bulunabilirlik
        a=req('GET',f'/v2/inAppPurchases/{iid}/inAppPurchaseAvailability',ok=(200,404))
        if not a.get('data'):
            req('POST','/v1/inAppPurchaseAvailabilities',{'data':{'type':'inAppPurchaseAvailabilities','attributes':{'availableInNewTerritories':True},'relationships':{'inAppPurchase':{'data':{'type':'inAppPurchases','id':iid}},'availableTerritories':{'data':terr}}}});print('  ulkeler',len(terr))
        # inceleme görseli
        s=req('GET',f'/v2/inAppPurchases/{iid}/appStoreReviewScreenshot',ok=(200,404))
        if not s.get('data'):
            fp=os.path.join(os.path.dirname(__file__),x['shot']);data=open(fp,'rb').read()
            r=req('POST','/v1/inAppPurchaseAppStoreReviewScreenshots',{'data':{'type':'inAppPurchaseAppStoreReviewScreenshots','attributes':{'fileName':x['shot'],'fileSize':len(data)},'relationships':{'inAppPurchaseV2':{'data':{'type':'inAppPurchases','id':iid}}}}})['data']
            for op in r['attributes']['uploadOperations']:
                h={k['name']:k['value'] for k in op.get('requestHeaders',[])}
                rr=requests.request(op['method'],op['url'],headers=h,data=data[op['offset']:op['offset']+op['length']],timeout=120);print('  upload',rr.status_code)
            req('PATCH',f"/v1/inAppPurchaseAppStoreReviewScreenshots/{r['id']}",{'data':{'type':'inAppPurchaseAppStoreReviewScreenshots','id':r['id'],'attributes':{'uploaded':True,'sourceFileChecksum':hashlib.md5(data).hexdigest()}}});print('  gorsel')
        print('  durum',iap_state(iid))
    # ---- 1.9.0 sürümü ----
    vs={v['attributes']['versionString']:v for v in allp(f'/v1/apps/{AID}/appStoreVersions',**{'filter[platform]':'IOS','limit':20})}
    if P['version'] in vs: VID=vs[P['version']]['id']
    else:
        VID=req('POST','/v1/appStoreVersions',{'data':{'type':'appStoreVersions','attributes':{'platform':'IOS','versionString':P['version'],'releaseType':'AFTER_APPROVAL'},'relationships':{'app':{'data':{'type':'apps','id':AID}}}}})['data']['id']
    print('VERSION',VID)
    locs={l['attributes']['locale']:l for l in allp(f'/v1/appStoreVersions/{VID}/appStoreVersionLocalizations')}
    print('version locales',list(locs))
    tr=locs.get('tr')['attributes']
    if 'de-DE' not in locs:
        d=P['de'];r=req('POST','/v1/appStoreVersionLocalizations',{'data':{'type':'appStoreVersionLocalizations','attributes':{'locale':'de-DE','description':d['description'],'keywords':d['keywords'],'promotionalText':d['promo'],'supportUrl':tr.get('supportUrl'),'marketingUrl':tr.get('marketingUrl')},'relationships':{'appStoreVersion':{'data':{'type':'appStoreVersions','id':VID}}}}})
        locs['de-DE']=r['data'];print('de-DE surum metni eklendi')
    for loc,txt in P['whatsNew'].items():
        if loc in locs: req('PATCH',f"/v1/appStoreVersionLocalizations/{locs[loc]['id']}",{'data':{'type':'appStoreVersionLocalizations','id':locs[loc]['id'],'attributes':{'whatsNew':txt}}});print('whatsNew',loc)
    # app info (ad, alt başlık) de-DE
    ai=[a for a in allp(f'/v1/apps/{AID}/appInfos') if a['attributes'].get('state')!='READY_FOR_DISTRIBUTION' and a['attributes'].get('appStoreState')!='READY_FOR_SALE']
    if ai:
        al={l['attributes']['locale']:l for l in allp(f"/v1/appInfos/{ai[0]['id']}/appInfoLocalizations")}
        if 'de-DE' not in al:
            t=al['tr']['attributes'];req('POST','/v1/appInfoLocalizations',{'data':{'type':'appInfoLocalizations','attributes':{'locale':'de-DE','name':P['de']['name'],'subtitle':P['de']['subtitle'],'privacyPolicyUrl':t.get('privacyPolicyUrl')},'relationships':{'appInfo':{'data':{'type':'appInfos','id':ai[0]['id']}}}}});print('de-DE ad/alt baslik eklendi')
    else: print('!! duzenlenebilir appInfo yok')
    # derleme
    b=allp('/v1/builds',**{'filter[app]':AID,'filter[version]':P['build'],'filter[preReleaseVersion.version]':P['version']})
    if not b: print('!! derleme yok');raise SystemExit(1)
    req('PATCH',f'/v1/appStoreVersions/{VID}/relationships/build',{'data':{'type':'builds','id':b[0]['id']}});print('build bagli',b[0]['attributes']['version'])
    print('SURUM DURUMU',get(f'/v1/appStoreVersions/{VID}')['data']['attributes']['appStoreState'])
if MODE in('durum','gonder'):
    ex={i['attributes']['productId']:i for i in iaps()}
    for x in P['iap']:
        iid=ex[x['pid']]['id'];a=ex[x['pid']]['attributes']
        s=req('GET',f'/v2/inAppPurchases/{iid}/appStoreReviewScreenshot',ok=(200,404)).get('data') or {}
        print('IAP',x['pid'],a['state'],'| gorsel',(s.get('attributes') or {}).get('assetDeliveryState'))
    for ai in allp(f'/v1/apps/{AID}/appInfos'):
        print('APPINFO',ai['id'],ai['attributes'].get('state'),[l['attributes']['locale'] for l in allp(f"/v1/appInfos/{ai['id']}/appInfoLocalizations")])
if MODE=='gonder':
    ai=[a for a in allp(f'/v1/apps/{AID}/appInfos') if a['attributes'].get('state')=='PREPARE_FOR_SUBMISSION'][0]
    al={l['attributes']['locale']:l for l in allp(f"/v1/appInfos/{ai['id']}/appInfoLocalizations")}
    t=al['tr']['attributes'];d=al['de-DE']
    print('de-DE once',d['attributes'].get('name'),'|',d['attributes'].get('subtitle'))
    req('PATCH',f"/v1/appInfoLocalizations/{d['id']}",{'data':{'type':'appInfoLocalizations','id':d['id'],'attributes':{'name':P['de']['name'],'subtitle':P['de']['subtitle'],'privacyPolicyUrl':t.get('privacyPolicyUrl')}}});print('de-DE ad/alt baslik yazildi')
    for x in P['iap']:
        i=ex[x['pid']]
        if i['attributes']['state']=='READY_TO_SUBMIT':
            req('POST','/v1/inAppPurchaseSubmissions',{'data':{'type':'inAppPurchaseSubmissions','relationships':{'inAppPurchaseV2':{'data':{'type':'inAppPurchases','id':i['id']}}}}});print('IAP gonderildi',x['pid'])
    vs={v['attributes']['versionString']:v for v in allp(f'/v1/apps/{AID}/appStoreVersions',**{'filter[platform]':'IOS','limit':20})}
    VID=vs[P['version']]['id']
    open_=[s for s in get(f'/v1/apps/{AID}/reviewSubmissions',**{'filter[platform]':'IOS','filter[state]':'READY_FOR_REVIEW,UNRESOLVED_ISSUES','limit':5}).get('data',[])]
    RS=open_[0]['id'] if open_ else req('POST','/v1/reviewSubmissions',{'data':{'type':'reviewSubmissions','attributes':{'platform':'IOS'},'relationships':{'app':{'data':{'type':'apps','id':AID}}}}})['data']['id']
    items=get(f'/v1/reviewSubmissions/{RS}/items').get('data',[])
    if not items: req('POST','/v1/reviewSubmissionItems',{'data':{'type':'reviewSubmissionItems','relationships':{'reviewSubmission':{'data':{'type':'reviewSubmissions','id':RS}},'appStoreVersion':{'data':{'type':'appStoreVersions','id':VID}}}}})
    r=req('PATCH',f'/v1/reviewSubmissions/{RS}',{'data':{'type':'reviewSubmissions','id':RS,'attributes':{'submitted':True}}})
    print('INCELEMEYE GONDERILDI',r['data']['attributes'])
    print('SURUM',get(f'/v1/appStoreVersions/{VID}')['data']['attributes']['appStoreState'])
    for i in iaps():
        if i['attributes']['productId'] in [x['pid'] for x in P['iap']]: print('IAP',i['attributes']['productId'],i['attributes']['state'])

if MODE=='aso':
    for v in allp(f'/v1/apps/{AID}/appStoreVersions',**{'filter[platform]':'IOS','limit':3}):
        a=v['attributes'];print('VER',a['versionString'],a['appStoreState'])
        for l in allp(f"/v1/appStoreVersions/{v['id']}/appStoreVersionLocalizations"):
            la=l['attributes'];print('  VLOC',la['locale'],'| KW:',la.get('keywords'),'| PROMO:',(la.get('promotionalText') or '')[:170])
            print('  DESC',la['locale'],(la.get('description') or '').replace('\n',' / ')[:600])
        break
    for ai in allp(f'/v1/apps/{AID}/appInfos'):
        print('APPINFO',ai['attributes'].get('state'))
        for l in allp(f"/v1/appInfos/{ai['id']}/appInfoLocalizations"): print('  AILOC',l['attributes']['locale'],'|',l['attributes'].get('name'),'|',l['attributes'].get('subtitle'))
        try:
            pc=get(f"/v1/appInfos/{ai['id']}/primaryCategory"); print('  CAT',pc['data']['id'] if pc.get('data') else None)
            sc=get(f"/v1/appInfos/{ai['id']}/secondaryCategory"); print('  CAT2',sc['data']['id'] if sc.get('data') else None)
        except SystemExit: pass
    try:
        r=get(f'/v1/apps/{AID}/customerReviews',**{'limit':50,'sort':'-createdDate'})
        print('REVIEWS',len(r.get('data',[])),[ (x['attributes']['rating'],x['attributes'].get('territory')) for x in r.get('data',[])][:50])
    except SystemExit: pass
    try:
        r=get(f'/v1/apps/{AID}/appStoreVersionExperimentsV2',limit=5); print('PPO',len(r.get('data',[])))
    except SystemExit: pass
    try:
        r=get(f'/v1/apps/{AID}/appCustomProductPages',limit=10); print('CPP',[x['attributes'].get('name') for x in r.get('data',[])])
    except SystemExit: pass
    vs=allp(f'/v1/apps/{AID}/appStoreVersions',**{'filter[platform]':'IOS','limit':1})
    vl=allp(f"/v1/appStoreVersions/{vs[0]['id']}/appStoreVersionLocalizations")
    for l in vl:
        for ss in allp(f"/v1/appStoreVersionLocalizations/{l['id']}/appScreenshotSets"):
            print('SHOTSET',l['attributes']['locale'],ss['attributes']['screenshotDisplayType'],len(allp(f"/v1/appScreenshotSets/{ss['id']}/appScreenshots")))
        for ps in allp(f"/v1/appStoreVersionLocalizations/{l['id']}/appPreviewSets"):
            print('PREVIEWSET',l['attributes']['locale'],ps['attributes']['previewType'])
