from typing import List, Optional
from pydantic import BaseModel, HttpUrl

class SeriesSummary(BaseModel):
    title: str
    cover_url: str
    link: str
    chapters: int
    rating: Optional[float] = None
    updated_at: Optional[str] = None

class PopularFinished(BaseModel):
    title: str
    cover_url: str
    link: str
    chapters: int
    description: Optional[str]
    genres: List[str]

class SearchResults(BaseModel):
    total: int
    results: List[SeriesSummary]


class SeriesDetail(BaseModel):
    """
    Used for GET /manhwa?m={slug}
    """
    title:       str
    cover_url:   HttpUrl
    link:        HttpUrl
    chapters:    int
    rating:      float
    updated_at:  Optional[str] = None
    genres:      List[str]
    description: Optional[str] = None


class ChapterSummary(BaseModel):
    """
    Returned by GET /api/manhwa/chapters?m={slug}
    """
    id:          int      
    link:        HttpUrl    
    title:       str        
    released_at: str        


class PageImage(BaseModel):
    """
    A single panel image in a chapter.
    """
    url: HttpUrl

class NewestRelease(BaseModel):
    slug: str
    link: str
    cover: str
    time: str
    title: str
    chapters: int
    rating: Optional[float] = None