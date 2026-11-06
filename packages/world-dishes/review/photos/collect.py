"""Collect photo candidates; never decide whether a picture depicts a dish.

Run from any directory with Python 3.11+. Cached responses and thumbnails stay in
.cache/photos. Review candidates.json with the contact sheets before recording a
decision in review/photos/verdicts.jsonl. Only explicit keep decisions are applied.
"""

import argparse
import fcntl
import hashlib
from html.parser import HTMLParser
import json
import pathlib
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
CACHE = ROOT / ".cache/photos"
UA = "FlavorDB-photo-review/1.0 (https://github.com/Andrew-Chen-Wang/flavor-db)"


class PlainText(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.parts = []
        self.feed(html)

    def handle_data(self, data):
        self.parts.append(data)

    def text(self):
        return " ".join("".join(self.parts).split())


def save(file, value):
    file.parent.mkdir(parents=True, exist_ok=True)
    temporary = file.with_suffix(file.suffix + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
    temporary.replace(file)


def request(url, binary=False):
    key = hashlib.sha256(url.encode()).hexdigest()
    file = CACHE / "http" / key
    if file.exists():
        data = file.read_bytes()
        return data if binary else json.loads(data)
    CACHE.mkdir(parents=True, exist_ok=True)
    with (CACHE / "request.lock").open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        return fetch_uncached(url, file, binary)


def fetch_uncached(url, file, binary):
    if file.exists():
        data = file.read_bytes()
        return data if binary else json.loads(data)
    for attempt in range(6):
        time.sleep(1.5)
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as response:
                data = response.read()
            if not binary:
                parsed = json.loads(data)
                if "error" in parsed:
                    if parsed["error"]["code"] in ("maxlag", "ratelimited"):
                        time.sleep(min(300, 15 * 2**attempt))
                        continue
                    raise RuntimeError(parsed["error"])
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_bytes(data)
            return data if binary else parsed
        except urllib.error.HTTPError as error:
            if error.code != 429 and error.code < 500:
                raise
            delay = max(float(error.headers.get("Retry-After", 0)), 15 * 2**attempt)
            print(f"HTTP {error.code}; backing off {delay}s", flush=True)
            time.sleep(delay)
        except (TimeoutError, urllib.error.URLError):
            time.sleep(15 * 2**attempt)
    raise RuntimeError(f"Request failed after backoff: {url}")


def api(host, **params):
    return request(f"https://{host}/w/api.php?" + urllib.parse.urlencode({
        "format": "json", "formatversion": 2, "maxlag": 5, **params,
    }))


def missing():
    found = json.loads((ROOT / "data/images.json").read_text())
    return [d for file in sorted((ROOT / "data").glob("dishes-*.jsonl"))
            for line in file.read_text().splitlines() if line
            for d in [json.loads(line)]
            if not (d.get("image") or d.get("imageUrl") or d["id"] in found)]


def collect(args):
    file = CACHE / "candidates.json"
    candidates = json.loads(file.read_text()) if file.exists() else []
    known = {(c["id"], c["image"]) for c in candidates}
    dishes = missing()

    def add(dish, image, source):
        if (dish["id"], image) not in known:
            candidates.append({"id": dish["id"], "name": dish["name"],
                               "description": dish.get("description", ""),
                               "image": image, "from": source})
            known.add((dish["id"], image))

    if args.source == "known":
        found = json.loads((ROOT / "data/images.json").read_text())
        names = {}
        for shard in sorted((ROOT / "data").glob("dishes-*.jsonl")):
            for line in shard.read_text().splitlines():
                other = json.loads(line)
                extra = found.get(other["id"], {})
                image = other.get("image") or extra.get("image")
                if not image:
                    continue
                source = extra.get("from") or next((s["url"] for s in other["sources"] if s["name"] == "Wikidata"), None)
                if not source:
                    continue
                for name in sorted({other["name"], *other["names"].values()}):
                    names.setdefault(name.casefold(), set()).add((image, source))
        for dish in dishes:
            for name in sorted({dish["name"], *dish["names"].values()}):
                for image, source in sorted(names.get(name.casefold(), [])):
                    add(dish, image, source)
        save(file, candidates)
        print("Candidates", len(candidates), flush=True)
    elif args.source == "wikipedia":
        groups = {}
        for dish in dishes:
            for url in dish["wikipedia"].values():
                parsed = urllib.parse.urlparse(url)
                title = urllib.parse.unquote(parsed.path.removeprefix("/wiki/"))
                groups.setdefault(parsed.hostname, {}).setdefault(title, []).append((dish, url))
        for host, titles in groups.items():
            names = list(titles)
            for start in range(0, len(names), 40):
                batch = names[start:start + 40]
                data = api(host, action="query", prop="pageimages", piprop="name",
                           pilicense="free", redirects=1, titles="|".join(batch))
                aliases = {p["title"]: p for p in data.get("query", {}).get("pages", [])}
                for redirect in reversed(data.get("query", {}).get("redirects", [])):
                    if redirect["to"] in aliases:
                        aliases[redirect["from"]] = aliases[redirect["to"]]
                for norm in data.get("query", {}).get("normalized", []):
                    if norm["to"] in aliases:
                        aliases[norm["from"]] = aliases[norm["to"]]
                for title in batch:
                    image = aliases.get(title, {}).get("pageimage")
                    if image:
                        for dish, url in titles[title]:
                            add(dish, image, url)
                save(file, candidates)
                print(host, start + len(batch), "/", len(names), "candidates", len(candidates), flush=True)
    elif args.source == "search":
        for dish in dishes[args.offset:args.offset + args.limit]:
            for name in dict.fromkeys([dish["name"], *dish["names"].values()]):
                data = api("commons.wikimedia.org", action="query", list="search",
                           srsearch=name, srnamespace=6, srlimit=3)
                for hit in data.get("query", {}).get("search", []):
                    add(dish, hit["title"].removeprefix("File:"),
                        "https://commons.wikimedia.org/w/index.php?" + urllib.parse.urlencode({"search": name, "title": "Special:MediaSearch", "type": "image"}))
            save(file, candidates)
            print(dish["id"], "candidates", len(candidates), flush=True)
    else:
        ids = {d["id"]: d for d in dishes if d["id"].startswith("Q")}
        names = list(ids)[args.offset:args.offset + args.limit]
        for start in range(0, len(names), 40):
            data = api("www.wikidata.org", action="wbgetentities", ids="|".join(names[start:start + 40]), props="claims")
            for qid, entity in data["entities"].items():
                claims = entity.get("claims", {})
                for claim in claims.get("P18", []):
                    value = claim["mainsnak"].get("datavalue", {}).get("value")
                    if value:
                        add(ids[qid], value, f"https://www.wikidata.org/wiki/{qid}#P18")
                for claim in claims.get("P373", []):
                    category = claim["mainsnak"].get("datavalue", {}).get("value")
                    if not category:
                        continue
                    data = api("commons.wikimedia.org", action="query", list="categorymembers", cmtitle=f"Category:{category}", cmnamespace=6, cmlimit=5)
                    for hit in data.get("query", {}).get("categorymembers", []):
                        add(ids[qid], hit["title"].removeprefix("File:"), "https://commons.wikimedia.org/wiki/Category:" + urllib.parse.quote(category))
            save(file, candidates)
            print("Wikidata", start + 40, "/", len(names), "candidates", len(candidates), flush=True)


def metadata(args):
    file = CACHE / "candidates.json"
    candidates = json.loads(file.read_text())
    names = list(dict.fromkeys(c["image"] for c in candidates if "commons" not in c))
    for start in range(0, len(names), 40):
        data = api("commons.wikimedia.org", action="query", prop="imageinfo", iiprop="url|extmetadata", iiurlwidth=240, titles="|".join("File:" + n for n in names[start:start + 40]))
        pages = {p["title"].removeprefix("File:"): p for p in data.get("query", {}).get("pages", [])}
        for norm in data.get("query", {}).get("normalized", []):
            if norm["to"].removeprefix("File:") in pages:
                pages[norm["from"].removeprefix("File:")] = pages[norm["to"].removeprefix("File:")]
        for c in candidates:
            if c["image"] in pages:
                page = pages[c["image"]]
                c["commons"] = page.get("imageinfo", [{}])[0] if page.get("imagerepository") == "local" else {}
        save(file, candidates)
        print("Metadata", start + 40, "/", len(names), flush=True)


def sheets(args):
    from PIL import Image, ImageDraw, ImageFont
    candidates = json.loads((CACHE / "candidates.json").read_text())
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Unicode.ttf", 13)
    for start in range(args.offset, min(len(candidates), args.offset + args.limit), 30):
        sheet = Image.new("RGB", (1500, 1320), "white")
        draw = ImageDraw.Draw(sheet)
        for i, candidate in enumerate(candidates[start:start + 30]):
            x, y = (i % 6) * 250, (i // 6) * 264
            info = candidate.get("commons", {})
            url = info.get("thumburl")
            if url:
                import io
                try:
                    picture = Image.open(io.BytesIO(request(url, binary=True))).convert("RGB")
                    picture.thumbnail((244, 180))
                    sheet.paste(picture, (x, y))
                except (OSError, urllib.error.HTTPError) as error:
                    draw.text((x, y), str(error)[:35], fill="red", font=font)
            draw.text((x + 3, y + 182), f"{start + i}: {candidate['name'][:30]}", fill="black", font=font)
            draw.text((x + 3, y + 200), candidate["image"][:32], fill="black", font=font)
            draw.text((x + 3, y + 218), candidate["image"][32:64], fill="black", font=font)
            license = info.get("extmetadata", {}).get("LicenseShortName", {}).get("value", "NO COMMONS LICENSE")
            draw.text((x + 3, y + 236), license[:33], fill="black", font=font)
        sheet.save(CACHE / f"sheet-{start:05}.jpg")
        print("Sheet", start, flush=True)


def apply(args):
    candidates = json.loads((ROOT / "review/photos/candidates.json").read_text())
    images_file = ROOT / "data/images.json"
    images = json.loads(images_file.read_text())
    verdicts = [json.loads(line) for line in (ROOT / "review/photos/verdicts.jsonl").read_text().splitlines()]
    assert sorted(v["candidate"] for v in verdicts) == list(range(len(candidates))), "Every candidate needs exactly one review"
    accepted = set()
    for verdict in verdicts:
        candidate = candidates[verdict["candidate"]]
        assert candidate["id"] == verdict["id"] and candidate["image"] == verdict["image"]
        assert verdict["verdict"] in ("keep", "drop") and verdict["reason"]
        if verdict["verdict"] != "keep":
            continue
        assert candidate["id"] not in accepted, "Choose only one photo per dish"
        accepted.add(candidate["id"])
        info = candidate.get("commons", {})
        assert info.get("descriptionurl", "").startswith("https://commons.wikimedia.org/wiki/File:")
        assert verdict["license"] == info.get("extmetadata", {}).get("LicenseShortName", {}).get("value")
        assert verdict["reason"]
        value = {"image": candidate["image"], "from": candidate["from"]}
        meta = info["extmetadata"]
        credit = {"author": verdict.get("author") or PlainText(meta.get("Attribution", meta.get("Artist", {})).get("value", "")).text(), "license": verdict["license"]}
        license_url = meta.get("LicenseUrl", {}).get("value")
        if license_url:
            assert urllib.parse.urlparse(license_url).scheme in ("http", "https")
            credit["licenseUrl"] = license_url
        assert credit["author"]
        value["credit"] = credit
        assert candidate["id"] not in images or images[candidate["id"]] == value
        images[candidate["id"]] = value
    save(images_file, dict(sorted(images.items())))


def snapshot(args):
    candidates = json.loads((CACHE / "candidates.json").read_text())
    for candidate in candidates:
        info = candidate.get("commons", {})
        candidate["commons"] = {k: info[k] for k in ("descriptionurl", "extmetadata") if k in info}
        meta = candidate["commons"].get("extmetadata", {})
        candidate["commons"]["extmetadata"] = {k: meta[k] for k in (
            "ImageDescription", "Artist", "Credit", "LicenseShortName", "LicenseUrl",
            "UsageTerms", "Attribution", "Restrictions",
        ) if k in meta}
    save(ROOT / "review/photos/candidates.json", candidates)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["collect", "metadata", "sheets", "snapshot", "apply"])
    parser.add_argument("--source", choices=["wikipedia", "wikidata", "search", "known"], default="wikipedia")
    parser.add_argument("--offset", type=int, default=0)
    parser.add_argument("--limit", type=int, default=30)
    args = parser.parse_args()
    {"collect": collect, "metadata": metadata, "sheets": sheets, "snapshot": snapshot, "apply": apply}[args.command](args)
