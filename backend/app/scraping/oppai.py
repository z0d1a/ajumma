# app/scraping/oppai.py
import os
import json
import logging
from typing import List

from bs4 import BeautifulSoup
from ..models import SeriesSummary, PopularFinished, SearchResults, ChapterSummary, SeriesDetail, PageImage, NewestRelease
from ..utils import fetch_html
from ..cache import cache
from .base import fetch_and_parse, SelectorConfig

logger = logging.getLogger(__name__)

# ── Load selectors from config ────────────────────────────────────────────────
CONFIG_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "config", "selectors.json")
)
with open(CONFIG_PATH, "r") as f:
    SELECTORS = json.load(f)

BASE_URL = SELECTORS["base_url"]


def _extract(elem, spec: str) -> str:
    """
    Given a BeautifulSoup element and a spec "selector" or "selector@attr",
    return either the node's text or the given attribute.
    """
    if "@" in spec:
        sel, attr = spec.split("@", 1)
        node = elem.select_one(sel)
        return node[attr].strip() if node and node.has_attr(attr) else ""
    else:
        node = elem.select_one(spec)
        return node.get_text(strip=True) if node else ""


@cache
async def parse_trending() -> List[SeriesSummary]:
    html = await fetch_html(BASE_URL)
    soup = BeautifulSoup(html, "html.parser")

    sel   = SELECTORS["trending"]["container"]
    items = soup.select(sel)[:5]

    results: List[SeriesSummary] = []
    for it in items:
        results.append(
            SeriesSummary(
                title     = _extract(it, SELECTORS["trending"]["title"]),
                cover_url = _extract(it, SELECTORS["trending"]["cover"]),
                link      = _extract(it, SELECTORS["trending"]["link"]),
                chapters  = int(_extract(it, SELECTORS["trending"]["chapters"]) or 0),
                rating    = float(_extract(it, SELECTORS["trending"]["rating"]) or 0)
            )
        )
    return results


@cache
async def parse_popular_finished() -> List[PopularFinished]:
    html = await fetch_html(BASE_URL)
    soup = BeautifulSoup(html, "html.parser")

    sel   = SELECTORS["popular_finished"]["container"]
    items = soup.select(sel)

    results: List[PopularFinished] = []
    for it in items:
        link     = _extract(it, SELECTORS["popular_finished"]["link"])
        cover    = _extract(it, SELECTORS["popular_finished"]["cover"])
        title    = _extract(it, SELECTORS["popular_finished"]["title"])
        chap_txt = _extract(it, SELECTORS["popular_finished"]["chapters"])
        chapters = int(chap_txt.split()[0]) if chap_txt else 0

        description = _extract(it, SELECTORS["popular_finished"]["description"])
        genres = [
            g.get_text(strip=True)
            for g in it.select(SELECTORS["popular_finished"]["genres"])
        ]

        results.append(
            PopularFinished(
                title       = title,
                cover_url   = cover,
                link        = link,
                chapters    = chapters,
                description = description or None,
                genres      = genres
            )
        )
    return results


async def parse_search(
    query: str,
    page: int = 1,
    limit: int = 100
) -> SearchResults:
    """
    Scrape search results via the PHP endpoint.
    """
    search_url = (
        f"{BASE_URL}/api-search.php?"
        f"text={query}&order=recent&page={page}&limit={limit}&status=all"
    )
    logger.debug("parse_search: fetching %s", search_url)
    html = await fetch_html(search_url)
    soup = BeautifulSoup(html, "html.parser")

    # total = amo attribute
    raw_total = _extract(soup, SELECTORS["search"]["total"])
    total = int(raw_total or 0)
    logger.debug("parse_search: total=%d", total)

    cards = soup.select(SELECTORS["search"]["container"])
    logger.debug("parse_search: found %d cards", len(cards))

    results: List[SeriesSummary] = []
    for it in cards:
        # extract each field
        title     = _extract(it, SELECTORS["search"]["title"])
        cover     = _extract(it, SELECTORS["search"]["cover"])
        link      = _extract(it, SELECTORS["search"]["link"])
        chap_txt  = _extract(it, SELECTORS["search"]["chapters"]) or "0"
        rate_txt  = _extract(it, SELECTORS["search"]["rating"])  or "0"

        try:
            chapters = int(chap_txt)
        except ValueError:
            chapters = 0

        try:
            rating = float(rate_txt)
        except ValueError:
            rating = 0.0

        results.append(
            SeriesSummary(
                title     = title,
                cover_url = cover,
                link      = link,
                chapters  = chapters,
                rating    = rating
            )
        )

    return SearchResults(total=total, results=results)


async def parse_chapters(series_slug: str) -> List[ChapterSummary]:
    """
    Given a manhwa slug (the `m=` query param), fetch
    https://read.oppai.stream/manhwa?m={series_slug} and parse its chapters.
    """
    url = f"{BASE_URL}/manhwa?m={series_slug}"
    logger.debug("parse_chapters: fetching %s", url)
    html = await fetch_html(url)
    soup = BeautifulSoup(html, "html.parser")

    # the container holding all <a ch-num=...>
    container = soup.select_one(SELECTORS["chapters"]["container"])
    if not container:
        logger.debug("parse_chapters: no chapters container found")
        return []

    items = container.select(SELECTORS["chapters"]["item"])
    results: List[ChapterSummary] = []
    for a in items:
        ch_num = int(a.get("ch-num", "0"))
        link   = a["href"]
        # release text is inside <h6 class="gray">
        released = a.select_one(SELECTORS["chapters"]["time"]).get_text(strip=True)
        # title is inside <h4 class="white">
        title_tag = a.select_one(SELECTORS["chapters"]["title"])
        title = title_tag.get_text(strip=True) if title_tag else f"Chapter {ch_num}"

        results.append(ChapterSummary(
            id          = ch_num,
            link        = link,
            title       = title,
            released_at = released  # keep the raw “1 week ago” string
        ))

    logger.debug("parse_chapters: found %d chapters", len(results))
    return results


async def parse_details(query: str) -> SeriesDetail:
    url  = f"{BASE_URL}/manhwa?m={query}"
    html = await fetch_html(url)
    soup = BeautifulSoup(html, "html.parser")

    # grab the block
    block = soup.select_one(SELECTORS["details"]["container"]) or soup

    title      = _extract(block, SELECTORS["details"]["title"])
    cover_url  = _extract(block, SELECTORS["details"]["cover"])
    status_txt = _extract(block, SELECTORS["details"]["status"]) or None
    # numeric rating
    try:
        rating = float(_extract(block, SELECTORS["details"]["rating"]) or 0)
    except ValueError:
        rating = 0.0

    # genres list
    genres = [
        g.get_text(strip=True)
        for g in block.select(SELECTORS["details"]["genres"])
    ]

    description = _extract(block, SELECTORS["details"]["description"]) or None

    # get chapter count by scraping chapters endpoint
    from ..scraping.oppai import parse_chapters
    chapters_list = await parse_chapters(series_slug=query)
    chapters = len(chapters_list)

    return SeriesDetail(
        title       = title,
        cover_url   = cover_url,
        link        = url,
        chapters    = chapters,
        rating      = rating,
        updated_at  = status_txt,
        genres      = genres,
        description = description
    )

async def parse_pages(series_slug: str, chapter: int) -> List[PageImage]:
    # 1) hit the PHP count endpoint
    count_url = SELECTORS["pages"]["count_url"].format(
        slug=series_slug,
        chapter=chapter,
    )
    logger.debug("parse_pages: fetching count from %s", count_url)
    raw = await fetch_html(count_url)
    try:
        total = int(raw.strip())
    except ValueError:
        logger.warning("parse_pages: non-int count: %r", raw)
        total = 0

    logger.debug("parse_pages: total panels = %d", total)

    # 2) build each image URL
    tmpl = SELECTORS["pages"]["image_url"]
    images: List[PageImage] = []
    for i in range(1, total + 1):
        url = tmpl.format(slug=series_slug, chapter=chapter, i=i)
        images.append(PageImage(url=url))

    logger.debug("parse_pages: returning %d urls", len(images))
    return images


async def parse_newest_releases() -> list[dict]:
    """
    Scrape the homepage “Newest Releases” section and return
    a list of { link, cover_url, title, released_at, chapters, rating }.
    """
    # selectors is a dict loaded from selectors.json
    base_url = SELECTORS["base_url"]
    cfg = SELECTORS["newest_releases"]

    soup = await fetch_and_parse(base_url)
    items = []

    for el in soup.select(cfg["container"]):
        try:
            # link
            link_sel, link_attr = cfg["link"].split("@")
            link = el.select_one(link_sel).get(link_attr)

            # cover
            cover_sel, cover_attr = cfg["cover"].split("@")
            cover = el.select_one(cover_sel).get(cover_attr)

            # title & time
            title = el.select_one(cfg["title"]).get_text(strip=True)
            released_at = el.select_one(cfg["time"]).get_text(strip=True)

            # chapters
            chap_text = el.select_one(cfg["chapters"]).get_text(strip=True)
            chapters = int(chap_text)

            # rating (optional)
            rating = None
            if cfg.get("rating"):
                rating_node = el.select_one(cfg["rating"])
                if rating_node:
                    rating = float(rating_node.get_text(strip=True))

            items.append({
                "link":        link,
                "cover_url":   cover,
                "title":       title,
                "released_at": released_at,
                "chapters":    chapters,
                "rating":      rating,
            })
        except Exception as e:
            logger.debug("parse_newest_releases: failed item: %s", e)

    return items