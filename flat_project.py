#!/usr/bin/env python3
r"""
flatten_trim.py
---------------
Create a single text file that contains just the relevant *source* of a
project, while stripping obvious noise so the result stays concise.

Strategy
========
• Only include files with a developer-facing extension (see CODE_EXTS).
• Skip folders that are never useful for inspection (EXCLUDE_DIRS).
• Ignore files larger than MAX_BYTES (safety valve for vendored libs).
• Remove blank lines and full-line comments to cut token bloat.
  – JS/TS/JSX/TXS:   //, /* */, /** */
  – CSS:             /* */
  – JSON:            (none – keep all lines)
  – Any unsupported comment style => keep line (to avoid false positives).
• Prepend each file with a divider line:  # ===== relative/path/to/file =====
• Output goes to stdout *or* a file you specify.

Usage
=====
    python flatten_trim.py /path/to/project myoutput.txt
    python flat_project.py "C:\Users\me\MyProject\contracts" out.txt
    python flat_project.py . flat_out.txt

"""

from pathlib import Path
import sys
import re

ONLY_SUBDIRS: list[str] = ["src"]

CODE_EXTS = {
    ".js", ".jsx", ".sol",
     # ".ts", ".tsx",
    # ".json", ".mjs", ".cjs",
    # ".css", ".scss", ".sass",
    # ".html", ".md",
    # ".py", ".sh",
}

EXCLUDE_DIRS = {
    "contracts", "obs", "bck", "chk", "temp", "notas", "data_chain",
    "dist", "build", "out", "obs", "src0", "__pycache__", "test",
    ".git", "node_modules", "nevera", ".next", ".vercel",
}

MAX_BYTES = 200_000  # ~200 KB per file (adjust as needed)

COMMENT_PATTERNS = {
    ".js":  r"^\s*//|^\s*/\*|\*/\s*$",
    ".jsx": r"^\s*//|^\s*/\*|\*/\s*$",
    ".ts":  r"^\s*//|^\s*/\*|\*/\s*$",
    ".tsx": r"^\s*//|^\s*/\*|\*/\s*$",
    ".css": r"^\s*/\*|\*/\s*$",
    ".scss": r"^\s*/\*|\*/\s*$",
    ".sass": r"^\s*/\*|\*/\s*$",
    ".py":  r"^\s*#",
    ".sh":  r"^\s*#",
    ".md":  r"^\s*<!--|-->",
    ".html": r"^\s*<!--|-->",
}

def should_skip(path: Path) -> bool:
    return any(part in EXCLUDE_DIRS for part in path.parts)

def is_code_file(path: Path) -> bool:
    return path.suffix.lower() in CODE_EXTS

def strip_line(line: str, ext: str) -> str | None:
    """
    Return None for blank lines or pure comments, else the stripped line.
    Leave JSON untouched to avoid breaking structure.
    """
    if ext == ".json":
        return line.rstrip("\n")
    if not line.strip():
        return None
    pattern = COMMENT_PATTERNS.get(ext)
    if pattern and re.match(pattern, line):
        return None
    return line.rstrip("\n")

def flatten_trim(root: Path, dest):
    for file in sorted(root.rglob("*")):
        if file.is_file() and is_code_file(file) and not should_skip(file):
            if file.stat().st_size > MAX_BYTES:
                continue  # skip huge vendored libs
            rel = file.relative_to(root)
            dest.write(f"\n# ===== {rel} =====\n")
            try:
                for raw in file.read_text(encoding="utf-8", errors="replace").splitlines(True):
                    kept = strip_line(raw, file.suffix.lower())
                    if kept is not None:
                        dest.write(kept + "\n")
            except Exception as exc:
                dest.write(f"<<{exc}>>\n")

def main():
    if len(sys.argv) < 2:
        print("Usage: python flatten_trim.py /path/to/project [output.txt]")
        sys.exit(1)

    root = Path(sys.argv[1]).resolve()
    if not root.is_dir():
        print("Error: not a directory:", root)
        sys.exit(1)

    # decide el “root de búsqueda” interno sin usar args
    search_roots = [root]
    if ONLY_SUBDIRS:
        search_roots = []
        for sub in ONLY_SUBDIRS:
            p = (root / sub).resolve()
            if p.is_dir() and str(p).startswith(str(root)):
                search_roots.append(p)

    if len(sys.argv) > 2:
        out_path = Path(sys.argv[2]).resolve()
        with out_path.open("w", encoding="utf-8") as f:
            for sr in search_roots:
                flatten_trim(sr, f)
        print("Flattened project written to", out_path)
    else:
        flatten_trim(search_root, sys.stdout)

if __name__ == "__main__":
    main()
