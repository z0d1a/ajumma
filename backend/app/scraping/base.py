# backend/app/scraping/base.py

import json
from pathlib import Path
import aiohttp
from bs4 import BeautifulSoup
from pydantic import RootModel
from typing import Any, Dict

# ─ locate selectors.json in backend/config/selectors.json ────────────────
_BASE_DIR = Path(__file__).resolve().parents[2]   # backend/
_CONFIG = _BASE_DIR / "config" / "selectors.json"
if not _CONFIG.exists():
    raise FileNotFoundError(f"Could not find selectors.json at {_CONFIG}")

_RAW = json.loads(_CONFIG.read_text("utf-8"))

# ─ define a RootModel for your selectors ───────────────────────────────────
class SelectorConfig(RootModel[Dict[str, Any]]):
    """
    Wrap the raw dict so you can do: selectors.trending.container, etc.
    """
    def __getattr__(self, name: str) -> Any:
        try:
            return self.root[name]
        except KeyError:
            raise AttributeError(f"No selector group named {name!r}")

selectors = SelectorConfig(root=_RAW)


# ─ fetch_and_parse: pull HTML via aiohttp + parse with BeautifulSoup ───────
async def fetch_and_parse(url: str, timeout: int = 10) -> BeautifulSoup:
    """
    Fetch the URL and return a BeautifulSoup parser.
    """
    async with aiohttp.ClientSession() as session:
        async with session.get(url, timeout=timeout) as resp:
            resp.raise_for_status()
            html = await resp.text()
    return BeautifulSoup(html, "html.parser")