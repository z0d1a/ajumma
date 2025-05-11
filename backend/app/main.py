from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.manhwa import router as manhwa_router
import logging

# 1) configure the root logger to DEBUG
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)s %(name)s │ %(message)s",
)

# 2) Optionally, if you only want our `oppai` module to be verbose:
logging.getLogger("app.scraping.oppai").setLevel(logging.DEBUG)

app = FastAPI()

# ⬅️ allow our Vite dev server to talk to us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(manhwa_router, prefix="/api")