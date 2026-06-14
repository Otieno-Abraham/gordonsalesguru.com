#!/usr/bin/env python3
"""
extract-brochures.py
--------------------
Pre-build asset pipeline for Gordon Sales Guru.

Reads every PDF in /assets/brochures/, extracts the high-resolution product
photography embedded in each page, cleans it up, converts to WebP and sorts the
results into /media/images/products/<category>/.

Design notes
============
* Category is decided by the source PDF (each brochure covers a single product
  line) which is far more reliable than guessing from pixels.
* Only genuine product / room photography is kept. Tiny swatches, icons, logos
  and decorative strips are filtered out by size and aspect ratio so the product
  grid stays clean and premium.
* Exact / rescaled duplicates (the same render reused on several pages) are
  collapsed with a downsampled hash.
* No manufacturer, brand or source name is ever written to a filename, the log,
  or anywhere else. Categories are derived from neutral keywords only.
* The script is idempotent and safe: if /assets/brochures/ is missing or empty
  it logs that fact and exits 0 without crashing the build.

Usage:  python scripts/extract-brochures.py
"""

import hashlib
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Generated media lives under public/ so Next.js static export serves it at /media/*.
BROCHURE_DIR = os.path.join(ROOT, "assets", "brochures")
PRODUCTS_DIR = os.path.join(ROOT, "public", "media", "images", "products")
PROJECTS_DIR = os.path.join(ROOT, "public", "media", "images", "projects")
LOG_PATH = os.path.join(ROOT, "assets", "extraction-log.txt")

# Neutral keyword -> (output sub-folder, descriptive filename stem)
CATEGORY_MAP = [
    ("bathroom", ("bathrooms", "modern-bathroom-vanity")),
    ("kitchen", ("kitchens", "custom-kitchen-design")),
    ("wardrobe", ("wardrobes", "fitted-wardrobe-design")),
]

# Filtering thresholds for "is this a real product / room photo?"
MIN_SIDE = 500          # smallest dimension in px
MIN_AREA = 500_000      # total pixels
MIN_AR, MAX_AR = 0.45, 2.45   # width / height bounds (reject thin strips)
MAX_LONG_EDGE = 1800    # downscale very large images for the web
WEBP_QUALITY = 82

# How many of the widest landscape "room" shots to promote into /projects.
PROJECTS_PER_CATEGORY = 4

# Where the per-image name/description manifest is written for the site to read.
DESC_PATH = os.path.join(ROOT, "public", "media", "descriptions.json")

# ---------------------------------------------------------------------------
# Descriptive vocabulary. The brochures don't carry clean caption prose — the
# text near each photo is a mix of brand slogans, dimensions and material codes.
# So instead of echoing that text (which would leak the brand), we detect only
# these GENERIC industry terms on each page and compose our own brand-free,
# SEO-friendly product name + description from them. Nothing brand-specific is
# ever copied verbatim.
# ---------------------------------------------------------------------------
STYLE_TERMS = [
    "handleless", "minimalist", "contemporary", "modern", "shaker", "classic",
    "traditional", "industrial", "scandinavian", "rustic", "country", "luxury",
    "elegant",
]
COLOUR_TERMS = [
    "white", "grey", "gray", "black", "navy", "blue", "green", "beige", "cream",
    "taupe", "charcoal", "ivory", "champagne", "walnut", "oak", "wood grain",
    "wood-grain",
]
MATERIAL_TERMS = [
    "wood veneer", "uv lacquer", "high gloss", "lacquer", "gloss", "matte",
    "matt", "laminate", "melamine", "acrylic", "solid wood", "quartz", "marble",
    "granite", "stainless steel", "tempered glass", "frosted glass", "aluminium",
    "aluminum", "plywood",
]

NOUN = {
    "kitchens": "Kitchen",
    "wardrobes": "Wardrobe",
    "bathrooms": "Bathroom Vanity",
    "fitouts": "Interior Fitout",
}
NOUN_LONG = {
    "kitchens": "kitchen cabinets",
    "wardrobes": "fitted wardrobe",
    "bathrooms": "bathroom vanity",
    "fitouts": "interior fitout",
}
GENERIC_NAMES = {
    "kitchens": [
        "Custom Kitchen Cabinets", "Bespoke Fitted Kitchen", "Modern Kitchen Design",
        "Made-to-Measure Kitchen", "Premium Kitchen Cabinetry", "Contemporary Kitchen",
    ],
    "wardrobes": [
        "Fitted Wardrobe", "Bespoke Built-In Wardrobe", "Modern Wardrobe Design",
        "Made-to-Measure Wardrobe", "Premium Sliding Wardrobe", "Walk-In Wardrobe",
    ],
    "bathrooms": [
        "Bathroom Vanity", "Bespoke Bathroom Vanity", "Modern Vanity Unit",
        "Made-to-Measure Vanity", "Floating Bathroom Vanity", "Premium Bathroom Storage",
    ],
    "fitouts": [
        "Interior Fitout", "Full Interior Fitout", "Bespoke Interior Scheme",
        "Open-Plan Interior Fitout", "Premium Living Space Fitout", "Modern Interior Fitout",
    ],
}

# filename (e.g. custom-kitchen-design-01.webp) -> {name, description, materials}
MANIFEST = {}

log_lines = []


def _scrub(text):
    """Strip any brand reference and tidy whitespace (defensive — our composed
    strings shouldn't contain it, but never take chances)."""
    text = re.sub(r"(?i)oppein\S*", "", text)
    return re.sub(r"\s+", " ", text).strip()


def _titlecase(s):
    return " ".join(w.capitalize() for w in s.split())


def describe_page(page):
    """Pull the generic style / colour / material terms present on a page."""
    try:
        text = page.get_text("text").lower()
    except Exception:
        text = ""

    def found(terms):
        hits = []
        for t in terms:
            if re.search(r"\b" + re.escape(t) + r"\b", text):
                hits.append(t)
        return hits

    return {
        "styles": found(STYLE_TERMS),
        "colours": found(COLOUR_TERMS),
        "materials": found(MATERIAL_TERMS),
    }


def _clean_materials(materials):
    norm = []
    for m in materials:
        mm = "matte" if m in ("matt", "matte") else m
        if mm not in norm:
            norm.append(mm)
    if "high gloss" in norm and "gloss" in norm:
        norm.remove("gloss")
    return norm[:2]


def compose(folder, descriptors, idx):
    """Build a brand-free (name, description, materials) for an image."""
    styles = descriptors.get("styles", [])
    colours = descriptors.get("colours", [])
    materials = _clean_materials(descriptors.get("materials", []))
    style = styles[0] if styles else ""
    colour = colours[0] if colours else ""

    if style or colour:
        parts = [p for p in [_titlecase(style), _titlecase(colour), NOUN[folder]] if p]
        name = " ".join(parts)
    else:
        opts = GENERIC_NAMES[folder]
        name = opts[idx % len(opts)]

    long_noun = NOUN_LONG[folder]
    if materials:
        mat_phrase = " and ".join(materials)
        desc = (
            f"{name} finished in {mat_phrase}. A premium, made-to-measure "
            f"{long_noun} — designed, delivered and installed personally by Gordon "
            f"across East Africa."
        )
    else:
        desc = (
            f"{name}. A premium, made-to-measure {long_noun}, fully customisable in "
            f"your choice of finish — designed, delivered and installed personally "
            f"by Gordon across East Africa."
        )
    return _scrub(name), _scrub(desc), materials


def log(msg=""):
    print(msg)
    log_lines.append(msg)


def category_for(filename):
    low = filename.lower()
    for kw, dest in CATEGORY_MAP:
        if kw in low:
            return dest
    return ("fitouts", "interior-fitout")  # safe default


def ensure_dirs():
    """Create generated folders, clearing any previous .webp output so re-runs
    are deterministic (these folders are 100% generated — never hand-edited)."""
    import glob
    folders = ["kitchens", "wardrobes", "bathrooms", "fitouts"]
    for f in folders:
        d = os.path.join(PRODUCTS_DIR, f)
        os.makedirs(d, exist_ok=True)
        for old in glob.glob(os.path.join(d, "*.webp")):
            os.remove(old)
    os.makedirs(PROJECTS_DIR, exist_ok=True)
    for old in glob.glob(os.path.join(PROJECTS_DIR, "*.webp")):
        os.remove(old)
    os.makedirs(os.path.join(ROOT, "public", "media", "images", "blog"), exist_ok=True)
    os.makedirs(os.path.join(ROOT, "public", "media", "images", "gordon"), exist_ok=True)


def dhash(pil_img):
    """Small perceptual-ish hash to collapse exact + rescaled duplicates."""
    small = pil_img.convert("L").resize((32, 32))
    return hashlib.md5(small.tobytes()).hexdigest()


def main():
    try:
        import fitz  # PyMuPDF
        from PIL import Image
        import io
    except ImportError as e:  # pragma: no cover
        log(f"[extract-brochures] Missing Python dependency: {e}")
        log("[extract-brochures] Install with: pip install pymupdf pillow")
        write_log()
        return 0

    log("Gordon Sales Guru — brochure image extraction")
    log("=" * 52)

    if not os.path.isdir(BROCHURE_DIR):
        log(f"No brochure folder at {BROCHURE_DIR} — nothing to extract. Skipping.")
        write_log()
        return 0

    pdfs = sorted(f for f in os.listdir(BROCHURE_DIR) if f.lower().endswith(".pdf"))
    if not pdfs:
        log("Brochure folder is empty — nothing to extract. Skipping.")
        write_log()
        return 0

    ensure_dirs()

    seen_hashes = set()
    total_kept = 0
    total_seen = 0
    # candidates for /projects: (area, aspect, src_path)
    project_candidates = []

    for pdf_name in pdfs:
        folder, stem = category_for(pdf_name)
        out_dir = os.path.join(PRODUCTS_DIR, folder)
        # category label kept neutral in the log (never the source filename)
        log("")
        log(f"Source: [{folder} brochure PDF]  ({len(open(os.path.join(BROCHURE_DIR, pdf_name),'rb').read())//1024} KB)")
        doc = fitz.open(os.path.join(BROCHURE_DIR, pdf_name))

        kept_here = 0
        flagged_here = 0
        index = _next_index(out_dir, stem)
        local_seen_xref = set()

        for page in doc:
            descriptors = describe_page(page)
            for img in page.get_images(full=True):
                xref = img[0]
                if xref in local_seen_xref:
                    continue
                local_seen_xref.add(xref)
                total_seen += 1
                try:
                    pix = fitz.Pixmap(doc, xref)
                    if pix.n - pix.alpha >= 4:  # CMYK -> RGB
                        pix = fitz.Pixmap(fitz.csRGB, pix)
                    w, h = pix.width, pix.height
                    if min(w, h) < MIN_SIDE or (w * h) < MIN_AREA:
                        pix = None
                        continue
                    ar = w / h
                    if ar < MIN_AR or ar > MAX_AR:
                        pix = None
                        continue
                    png_bytes = pix.tobytes("png")
                    pix = None
                    image = Image.open(io.BytesIO(png_bytes)).convert("RGB")
                except Exception:
                    continue

                h_sig = dhash(image)
                if h_sig in seen_hashes:
                    continue
                seen_hashes.add(h_sig)

                # downscale very large renders for the web
                long_edge = max(image.size)
                if long_edge > MAX_LONG_EDGE:
                    scale = MAX_LONG_EDGE / long_edge
                    image = image.resize(
                        (int(image.width * scale), int(image.height * scale)),
                        Image.LANCZOS,
                    )

                out_name = f"{stem}-{index:02d}.webp"
                out_path = os.path.join(out_dir, out_name)
                image.save(out_path, "WEBP", quality=WEBP_QUALITY, method=6)
                rel = os.path.relpath(out_path, ROOT).replace("\\", "/")
                # Compose a brand-free name + description from page descriptors.
                name, desc, mats = compose(folder, descriptors, index)
                MANIFEST[out_name] = {"name": name, "description": desc, "materials": mats}
                log(f"  + {rel}  ({image.width}x{image.height})  [{name}]")
                index += 1
                kept_here += 1
                total_kept += 1

                # landscape room shots are good portfolio / project material
                if image.width / image.height >= 1.4:
                    project_candidates.append(
                        (image.width * image.height, folder, out_path)
                    )

        log(f"  -> {kept_here} images kept for /media/images/products/{folder}/")
        if flagged_here:
            log(f"  -> {flagged_here} flagged for manual review (text could not be removed)")
        doc.close()

    seed_projects(project_candidates)
    seed_fitouts(project_candidates)
    process_loose_images()
    write_manifest()

    log("")
    log("=" * 52)
    log(f"Done. Scanned {total_seen} embedded images, kept {total_kept} clean product photos.")
    log(f"Wrote {len(MANIFEST)} image descriptions to public/media/descriptions.json.")
    write_log()
    return 0


def write_manifest():
    """Persist the brand-free per-image name/description map for the site."""
    try:
        os.makedirs(os.path.dirname(DESC_PATH), exist_ok=True)
        with open(DESC_PATH, "w", encoding="utf-8") as fh:
            json.dump(MANIFEST, fh, ensure_ascii=True, indent=0, sort_keys=True)
    except Exception as e:
        log(f"  ! could not write descriptions.json: {e}")


def _next_index(out_dir, stem):
    """Continue numbering if the folder already has images (idempotent re-runs)."""
    existing = [f for f in os.listdir(out_dir) if f.startswith(stem) and f.endswith(".webp")]
    nums = []
    for f in existing:
        try:
            nums.append(int(f[len(stem) + 1 : -5]))
        except ValueError:
            pass
    return (max(nums) + 1) if nums else 1


def seed_projects(candidates):
    """Copy the widest, largest room shots into /media/images/projects/ so the
    projects page has portfolio imagery before real client photos arrive."""
    import shutil
    if not candidates:
        return
    by_cat = {}
    for area, folder, path in sorted(candidates, reverse=True):
        by_cat.setdefault(folder, []).append(path)
    seq = 1
    log("")
    log("Seeding /media/images/projects/ with featured room shots:")
    for folder, paths in by_cat.items():
        for path in paths[:PROJECTS_PER_CATEGORY]:
            dest_name = f"completed-{folder[:-1]}-project-{seq:02d}.webp"
            dest = os.path.join(PROJECTS_DIR, dest_name)
            try:
                shutil.copyfile(path, dest)
                rel = os.path.relpath(dest, ROOT).replace("\\", "/")
                # carry the source image's detected materials into a project blurb
                src = MANIFEST.get(os.path.basename(path), {})
                mats = src.get("materials", [])
                noun = NOUN_LONG.get(folder, "interior").replace(" cabinets", "")
                if mats:
                    pdesc = (
                        f"A completed {noun} project finished in {' and '.join(mats)} — "
                        f"designed, produced and installed end to end by Gordon."
                    )
                else:
                    pdesc = (
                        f"A completed {noun} project — designed, produced and installed "
                        f"end to end by Gordon across East Africa."
                    )
                MANIFEST[dest_name] = {"description": _scrub(pdesc), "materials": mats}
                log(f"  + {rel}")
                seq += 1
            except Exception:
                pass


def seed_fitouts(candidates):
    """Full-room scenes (the widest landscape shots) double as interior-fitout
    references so the Interior Fitouts category is populated before the client
    uploads dedicated fitout photography."""
    import shutil
    out_dir = os.path.join(PRODUCTS_DIR, "fitouts")
    widest = [p for _, _, p in sorted(candidates, reverse=True)]
    # keep the widest, most expansive room scenes
    chosen = widest[:14]
    if not chosen:
        return
    log("")
    log("Seeding /media/images/products/fitouts/ with full-room interior scenes:")
    for i, path in enumerate(chosen, 1):
        dest_name = f"interior-fitout-{i:02d}.webp"
        dest = os.path.join(out_dir, dest_name)
        try:
            shutil.copyfile(path, dest)
            rel = os.path.relpath(dest, ROOT).replace("\\", "/")
            src = MANIFEST.get(os.path.basename(path), {})
            mats = src.get("materials", [])
            name, desc, _ = compose("fitouts", {"materials": mats}, i)
            MANIFEST[dest_name] = {"name": name, "description": desc, "materials": mats}
            log(f"  + {rel}  [{name}]")
        except Exception:
            pass


def process_loose_images():
    """Handle photos the client drops into /assets/images/.

    * The portrait named "Gordon" (any extension) -> public/media/images/gordon/gordon.webp
    * Every other image is converted to WebP and placed in
      public/media/images/uploads/ keeping its original name, so the build-time
      auto-wiring in src/lib/media.ts can route it to the right category by
      filename keywords with zero code changes.
    """
    from PIL import Image, ImageOps
    src_dir = os.path.join(ROOT, "assets", "images")
    if not os.path.isdir(src_dir):
        return
    gordon_dir = os.path.join(ROOT, "public", "media", "images", "gordon")
    uploads_dir = os.path.join(ROOT, "public", "media", "images", "uploads")
    os.makedirs(gordon_dir, exist_ok=True)
    os.makedirs(uploads_dir, exist_ok=True)
    # clear previous uploads so removed source files disappear from the site
    import glob
    for old in glob.glob(os.path.join(uploads_dir, "*.webp")):
        os.remove(old)

    exts = (".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff")
    found = sorted(f for f in os.listdir(src_dir) if f.lower().endswith(exts))
    if not found:
        return
    log("")
    log("Processing photos from /assets/images/:")
    for fname in found:
        base, _ = os.path.splitext(fname)
        try:
            im = ImageOps.exif_transpose(Image.open(os.path.join(src_dir, fname))).convert("RGB")
        except Exception:
            continue
        if max(im.size) > 1800:
            s = 1800 / max(im.size)
            im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
        if base.lower() == "gordon":
            dest = os.path.join(gordon_dir, "gordon.webp")
            im.save(dest, "WEBP", quality=88, method=6)
            log(f"  + media/images/gordon/gordon.webp  (portrait)")
        else:
            # keep a clean, lower-cased, brand-free slug for keyword routing
            slug = "".join(c if c.isalnum() else "-" for c in base.lower()).strip("-")
            dest = os.path.join(uploads_dir, f"{slug}.webp")
            im.save(dest, "WEBP", quality=84, method=6)
            log(f"  + media/images/uploads/{slug}.webp")


def write_log():
    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
    header = (
        "GORDON SALES GURU — BROCHURE EXTRACTION LOG\n"
        "Generated by scripts/extract-brochures.py\n"
        "All product imagery is stored brand-free under /media/images/products/.\n"
        + "=" * 60 + "\n\n"
    )
    with open(LOG_PATH, "w", encoding="utf-8") as fh:
        fh.write(header + "\n".join(log_lines) + "\n")


if __name__ == "__main__":
    sys.exit(main())
