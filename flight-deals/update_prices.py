"""Refresh the BLR-SFO dashboard from Google Flights via Playwright."""
import base64, json, re, time
from datetime import datetime, timezone
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).parent
DATA = ROOT / "data.json"
PREFERRED = ("Air India", "Emirates", "Qatar", "Etihad", "Turkish", "Singapore", "Cathay", "JAL", "Japan Airlines", "Korean", "ANA", "EVA")
WINDOWS = [
    ("2027-04-27", "2027-05-18"), ("2027-04-28", "2027-05-19"),
    ("2027-05-01", "2027-05-25"), ("2027-05-02", "2027-05-26"),
    ("2027-05-04", "2027-05-25"), ("2027-05-05", "2027-05-26"),
    ("2027-04-30", "2027-05-21"),
]
BASE = "https://www.google.com/travel/flights/search?tfs=CBwQAhooEgoyMDI3LTA1LTAxagwIAxIIL20vMDljMTdyDAgDEggvbS8wZDZscBooEgoyMDI3LTA1LTI1agwIAxIIL20vMGQ2bHByDAgDEggvbS8wOWMxN0ABSAFwAYIBCwj___________8BmAEB&hl=en"

def token(date):
    return base64.b64encode(b"\x12\n" + date.encode()).decode().rstrip("=")

def url(depart, ret):
    return BASE.replace("EgoyMDI3LTA1LTAx", token(depart)).replace("EgoyMDI3LTA1LTI1", token(ret))

def minutes(duration):
    h = int(re.search(r"(\d+)\s*hr", duration).group(1)) if re.search(r"(\d+)\s*hr", duration) else 0
    m = int(re.search(r"(\d+)\s*min", duration).group(1)) if re.search(r"(\d+)\s*min", duration) else 0
    return h * 60 + m

def parse(text, depart, ret, link):
    pat = re.compile(r"\$(\d[\d,]*)\s+round trip\s+(\d+) stop(?:s)?\s*([\d]+ hr(?: [\d]+ min)?)([^\n]*)")
    out=[]
    for price, stops, duration, carrier in pat.findall(text):
        carrier = carrier.strip() or "Unknown"
        item={"departDate":depart,"returnDate":ret,"airline":carrier,"price":int(price.replace(",","")),"duration":duration,"durationMinutes":minutes(duration),"stops":int(stops),"preferred":any(x.lower() in carrier.lower() for x in PREFERRED),"url":link}
        out.append(item)
    return out

def main():
    data=json.loads(DATA.read_text())
    current=[]; errors=[]
    with sync_playwright() as p:
        browser=p.chromium.launch()
        page=browser.new_page()
        for depart, ret in WINDOWS:
            link=url(depart,ret)
            try:
                page.goto(link, wait_until="domcontentloaded", timeout=90000)
                page.wait_for_timeout(5000)
                current.extend(parse(page.locator("body").inner_text(), depart, ret, link))
            except Exception as exc:
                errors.append(f"{depart}–{ret}: {exc.__class__.__name__}")
        browser.close()
    # Keep the cheapest useful result per date window/carrier/duration.
    uniq={}
    for item in current:
        key=(item["departDate"],item["returnDate"],item["airline"],item["duration"],item["stops"])
        uniq[key]=item
    current=sorted(uniq.values(), key=lambda x:(not x["preferred"],x["price"],x["durationMinutes"],x["stops"]))
    now=datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00","Z")
    if current:
        data["current"]=current
        best=current[0]
        data.setdefault("history",[]).append({"date":now[:10],"fares":[{"date":now[:10],"price":x["price"],"airline":x["airline"],"departDate":x["departDate"],"returnDate":x["returnDate"]} for x in current[:10]]})
        data["history"]=data["history"][-90:]
    data["updatedAt"]=now
    data["windows"]=[{"departDate":a,"returnDate":b} for a,b in WINDOWS]
    data["error"]="; ".join(errors) if errors else ""
    DATA.write_text(json.dumps(data,indent=2)+"\n")
    print(f"Updated {len(current)} fares; errors={errors}")

if __name__ == "__main__": main()
