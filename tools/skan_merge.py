"""Info.plist'teki SKAdNetworkItems listesine Unity Ads ve Liftoff Monetize kimliklerini ekler.
CI'da (internet erişimi olan makinede) derlemeden önce çalışır. Bir kaynak açılmazsa atlar."""
import json, plistlib, re, sys, urllib.request

PLIST = "ios/App/App/Info.plist"
SOURCES = [
    ("Unity Ads", "https://skan.mz.unity3d.com/v3/partner/skadnetworks.plist.json"),
    ("Liftoff", "https://vungle.com/skadnetworkids.json"),
    ("Liftoff", "https://www.vungle.com/skadnetworkids.json"),
    ("Unity+Liftoff (AppLovin listesi)", "https://skadnetwork-ids.applovin.com/v1/skadnetworkids.json?ad_network=unityads,vungle,liftoff"),
]

def ids_from(text):
    return {m.lower() for m in re.findall(r"[a-z0-9]{6,12}\.skadnetwork", text, re.I)}

with open(PLIST, "rb") as f:
    pl = plistlib.load(f)
items = pl.setdefault("SKAdNetworkItems", [])
have = {i["SKAdNetworkIdentifier"].lower() for i in items}
before = len(have)
for name, url in SOURCES:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "BitPazari-CI"})
        txt = urllib.request.urlopen(req, timeout=20).read().decode("utf-8", "replace")
        got = ids_from(txt)
        new = sorted(got - have)
        for i in new:
            items.append({"SKAdNetworkIdentifier": i}); have.add(i)
        print(f"{name}: {len(got)} kimlik, {len(new)} yeni  ({url})")
    except Exception as e:
        print(f"{name}: alınamadı ({url}): {e}")
with open(PLIST, "wb") as f:
    plistlib.dump(pl, f)
print(f"SKAdNetworkItems: {before} -> {len(have)}")
