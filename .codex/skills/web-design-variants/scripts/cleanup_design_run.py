#!/usr/bin/env python3
"""Safely remove generated web design-lab runs."""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from pathlib import Path


def find_workspace(start: Path) -> Path:
    for candidate in (start, *start.parents):
        if (candidate / ".git").exists():
            return candidate
    return start


def is_within(path: Path, root: Path) -> bool:
    return path == root or root in path.parents


def fail(message: str) -> int:
    print(f"error: {message}", file=sys.stderr)
    return 1


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Safely delete a generated web design variant run."
    )
    parser.add_argument("run_dir", help="Path to a generated run under design-lab/")
    parser.add_argument(
        "--allow-showcase",
        action="store_true",
        help="Also allow deletion under design-showcase/.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be deleted without deleting it.",
    )
    args = parser.parse_args()

    workspace = find_workspace(Path.cwd().resolve())
    run_dir = Path(args.run_dir)
    if not run_dir.is_absolute():
        run_dir = workspace / run_dir
    run_dir = run_dir.resolve()

    allowed_roots = [(workspace / "design-lab").resolve()]
    if args.allow_showcase:
        allowed_roots.append((workspace / "design-showcase").resolve())

    if not any(is_within(run_dir, root) for root in allowed_roots):
        return fail("refusing to delete outside design-lab/ without explicit showcase allowance")

    if run_dir in allowed_roots:
        return fail("refusing to delete the whole design-lab or design-showcase root")

    if not run_dir.is_dir():
        return fail(f"not a directory: {run_dir}")

    manifest_path = run_dir / "manifest.json"
    if not manifest_path.is_file():
        return fail("manifest.json is required for cleanup")

    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        return fail(f"manifest.json is invalid JSON: {exc}")

    if manifest.get("generatedBy") != "web-design-variants":
        return fail('manifest must contain "generatedBy": "web-design-variants"')

    if args.dry_run:
        print(f"would delete: {run_dir}")
        return 0

    shutil.rmtree(run_dir)
    print(f"deleted: {run_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
