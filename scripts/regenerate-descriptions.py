#!/usr/bin/env python3
"""
regenerate-descriptions.py
--------------------------
Rewrites public/media/descriptions.json with varied, professional copy.

The product/project descriptions are auto-generated, and an earlier version used
a single template that read as repetitive. This rebuilds each description from a
rotating set of refined, brand-free sentences (woven with the detected finish
where available), so adjacent cards never read the same — written for an
informed, premium audience.

Run:  python scripts/regenerate-descriptions.py
"""

import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESC_PATH = os.path.join(ROOT, "public", "media", "descriptions.json")

# Rotating, non-repeating description sets. {mat} expands to ", finished in X"
# (or "" when no finish was detected).
TEMPLATES = {
    "kitchen": [
        "A made-to-measure kitchen{mat}, designed around the way you cook, host and live.",
        "Considered cabinetry{mat}, with generous, intelligent storage and a quietly luxurious finish.",
        "Clean architectural lines{mat}, soft-close hardware throughout and a layout tailored to your home.",
        "A timeless kitchen{mat}: precise craftsmanship, premium materials and a flawless finish.",
        "Understated and elegant{mat}, built to perform beautifully for years in any East African home.",
        "A bespoke kitchen{mat} that balances striking design with genuine everyday practicality.",
    ],
    "wardrobe": [
        "A fitted wardrobe{mat}, planned around your garments for effortless, organised storage.",
        "Floor-to-ceiling cabinetry{mat}, with a tailored interior where every centimetre is considered.",
        "Elegant, space-maximising storage{mat}, finished to a refined and hard-wearing standard.",
        "A made-to-measure wardrobe{mat}, with soft-close fittings and a calm, considered aesthetic.",
        "Bespoke storage{mat}, designed to bring quiet order and lasting quality to your bedroom.",
        "A wardrobe that is beautiful to look at and effortless to live with{mat}.",
    ],
    "bathroom": [
        "A bespoke vanity{mat}, pairing generous storage with a serene, spa-like calm.",
        "Wall-hung cabinetry{mat} that keeps surfaces clear and the room feeling open and composed.",
        "A made-to-measure vanity{mat}, built to handle daily life and the local climate with ease.",
        "Refined bathroom storage{mat}, with clean lines and quality, moisture-resistant materials.",
        "An elegant vanity{mat}: considered proportions, fine fittings and a faultless finish.",
        "Understated luxury{mat}, tailored precisely to your space and your routine.",
    ],
    "fitout": [
        "A complete interior fitout{mat}, uniting kitchen, storage and living spaces in one cohesive scheme.",
        "Considered, end-to-end interiors{mat}, designed, produced and installed to a premium standard.",
        "A tailored interior{mat}, bringing harmony to materials, proportion and light across the space.",
        "Full-room cabinetry and joinery{mat}, finished with precision and a quiet sense of luxury.",
        "A cohesive interior scheme{mat}, crafted around how you live and entertain.",
        "Bespoke interiors{mat}, delivered seamlessly from the first design to the final handover.",
    ],
    "project": [
        "A completed {sub} project{mat}, designed, produced and installed from start to finish.",
        "A finished {sub} installation{mat}, delivered to a premium standard and on schedule.",
        "Bespoke {sub} joinery completed for a private client{mat}, tailored precisely to the space.",
        "A {sub} project realised end to end{mat}, with craftsmanship in every detail.",
    ],
}


def category_of(filename):
    f = filename.lower()
    if f.startswith("completed-"):
        sub = "interior"
        for s in ("kitchen", "wardrobe", "bathroom"):
            if s in f:
                sub = s
                break
        return "project", sub
    if "kitchen" in f:
        return "kitchen", None
    if "wardrobe" in f:
        return "wardrobe", None
    if "bathroom" in f or "vanity" in f:
        return "bathroom", None
    return "fitout", None


def index_of(filename):
    m = re.search(r"(\d+)\.webp$", filename)
    return int(m.group(1)) if m else 0


def finish_phrase(materials):
    if not materials:
        return ""
    norm = []
    for m in materials:
        mm = "matte" if m in ("matt", "matte") else m
        mm = mm.replace("uv lacquer", "UV lacquer")
        if mm not in norm:
            norm.append(mm)
    if "UV lacquer" in norm and "lacquer" in norm:
        norm.remove("lacquer")
    if "high gloss" in norm and "gloss" in norm:
        norm.remove("gloss")
    norm = norm[:2]
    joined = " and ".join(norm)
    return f", finished in {joined}"


def main():
    if not os.path.exists(DESC_PATH):
        print("No descriptions.json found — nothing to do.")
        return
    data = json.load(open(DESC_PATH, encoding="utf-8"))
    for filename, entry in data.items():
        cat, sub = category_of(filename)
        idx = index_of(filename)
        mat = finish_phrase(entry.get("materials"))
        tpl = TEMPLATES[cat][idx % len(TEMPLATES[cat])]
        desc = tpl.format(mat=mat, sub=sub or "")
        # tidy any stray double spaces / space-before-punctuation
        desc = re.sub(r"\s+([,.])", r"\1", re.sub(r"\s{2,}", " ", desc)).strip()
        entry["description"] = desc
    with open(DESC_PATH, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=True, indent=0)
    print(f"Rewrote {len(data)} descriptions in {os.path.relpath(DESC_PATH, ROOT)}")


if __name__ == "__main__":
    main()
