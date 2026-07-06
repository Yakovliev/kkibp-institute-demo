---
name: web-design-variants
description: Create, compare, apply, and clean temporary responsive design variants for websites and web apps. Use when Codex needs to generate A/B/C visual concepts, alternate page or section layouts, color or content experiments, desktop/mobile preview pages, select a winning variant, move it into a real page, or remove old design-lab files.
---

# Web Design Variants

Use this skill to run controlled design experiments without destabilizing real pages. Variants are temporary until the user explicitly accepts one.

## Coordinate With Other Skills

- Use `web-frontend-design-direction` when forming visual directions.
- Use `web-playwright-visual-review` when checking rendered desktop/mobile behavior.
- Use `web-interface-review` when reviewing accessibility, responsive robustness, and handoff risks.
- Use `web-project-documentation` after the user accepts, rejects, or asks to record an experiment.

## Directory Model

Use two categories of outputs:

- `design-lab/`: temporary experiments. Add this folder to `.gitignore` unless the user wants design experiments committed.
- `design-showcase/`: longer-lived comparison sets for stakeholder review.

Default temporary run shape:

```text
design-lab/
  YYYY-MM-DD-page-scope/
    manifest.json
    preview.html
    mobile.html
    variant-a.html
    variant-b.html
    variant-c.html
```

Use fewer or more variants when the user asks. Keep filenames short and stable.

## Manifest

Create `manifest.json` for every run:

```json
{
  "generatedBy": "web-design-variants",
  "date": "2026-07-06",
  "target": "index.html",
  "scope": "hero",
  "status": "testing",
  "variants": [
    { "id": "a", "name": "Editorial", "file": "variant-a.html" },
    { "id": "b", "name": "Utility", "file": "variant-b.html" },
    { "id": "c", "name": "Community", "file": "variant-c.html" }
  ],
  "previews": {
    "desktop": "preview.html",
    "mobile": "mobile.html",
    "mobileViewport": "390x844"
  }
}
```

Use English ids and filenames. UI labels inside preview pages should match the project's content language.

## Workflow

1. Identify the target page and scope.
   - If the user names a page, use that page.
   - If the user names a section or component, keep the experiment scoped to it.
   - If the request is broad, default to the smallest useful surface.
2. Read local context before designing.
   - Inspect target HTML, shared CSS, JavaScript, relevant assets, and preview conventions.
   - Do not fetch external inspiration or assets unless the user asks.
3. Define variant directions before coding.
   - Make variants meaningfully different in layout, hierarchy, rhythm, and content emphasis.
   - Make color-only variants only when the user asks for palette exploration.
   - Keep text truthful and readable.
4. Create the run without modifying the target page.
   - Put temporary files under `design-lab/YYYY-MM-DD-page-scope/`.
   - Keep real pages unchanged until the user chooses a winner.
5. Build comparison previews.
   - `preview.html` should compare variants at desktop width.
   - `mobile.html` should compare variants in a realistic mobile frame or viewport.
6. Verify the variants.
   - Open or test the files locally.
   - Check that assets load, text fits, and layout does not overflow on mobile.
7. Apply a winner only after user approval.
   - Move the accepted design into the real HTML/CSS/JS files.
   - Rerun relevant checks.
   - Offer to document the decision.

## Cleanup

Use the bundled cleanup helper for generated runs:

```bash
python3 .codex/skills/web-design-variants/scripts/cleanup_design_run.py design-lab/YYYY-MM-DD-page-scope
```

The script refuses to delete paths outside `design-lab/` by default and requires a manifest with `"generatedBy": "web-design-variants"`.

## Output Style

Report the variant paths, the intended differences, and any verification performed. If a winner was applied, list the real source files changed.
