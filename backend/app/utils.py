import aiohttp
from typing import Optional

async def fetch_html(url: str, timeout: int = 10) -> str:
    """
    Fetches HTML from the given URL with a reasonable timeout.
    Raises on non-2xx status.
    """
    timeout_cfg = aiohttp.ClientTimeout(total=timeout)
    async with aiohttp.ClientSession(timeout=timeout_cfg) as session:
        async with session.get(url) as resp:
            resp.raise_for_status()
            return await resp.text()
