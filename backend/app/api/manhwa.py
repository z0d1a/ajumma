from typing import Optional

from fastapi import APIRouter, Query, HTTPException
from ..scraping.oppai import parse_trending, parse_popular_finished, parse_search, parse_chapters, parse_details, parse_pages, parse_newest_releases
from ..models import SeriesSummary, PopularFinished, SearchResults, SeriesDetail, ChapterSummary, PageImage, NewestRelease
from typing import List

from ..scraping.oppai import (
    parse_trending,
    parse_popular_finished,
    parse_search
)
from ..models import SeriesSummary, PopularFinished, SearchResults

router = APIRouter(prefix="/manhwa", tags=["manhwa"])


@router.get("/trending", response_model=List[SeriesSummary])
async def get_trending():
    return await parse_trending()


@router.get("/popular-finished", response_model=List[PopularFinished])
async def get_popular_finished():
    return await parse_popular_finished()


@router.get("/search", response_model=SearchResults)
async def get_search(
    t: str = Query(..., alias="t"),
    page: Optional[int]   = Query(1, ge=1),
    limit: Optional[int]  = Query(100, ge=1, le=200),
):
    """
    t=…         — search term
    page=…      — page number
    limit=…     — results per page
    """
    return await parse_search(query=t, page=page, limit=limit)

@router.get("", response_model=SeriesDetail)
async def get_series(
    m: str = Query(..., alias="m")
):
    return await parse_details(query=m)

@router.get("/chapters", response_model=List[ChapterSummary])
async def get_chapters(
    m: str = Query(..., alias="m")
):
    # m is the same slug you used for /manhwa?m=slug
    return await parse_chapters(series_slug=m)

@router.get("/page", response_model=List[PageImage])
async def get_pages(
    m: str = Query(..., alias="m"),
    c: int = Query(..., alias="c"),
):
    """
    Return the list of image URLs for chapter `c` of series `m`.
    """
    return await parse_pages(series_slug=m, chapter=c)

@router.get("/newest", summary="Newest Releases")
async def get_newest():
    try:
        items = await parse_newest_releases()
        return items
    except Exception as e:
        raise HTTPException(500, detail=f"Failed to fetch newest releases: {e}")