import logging
import sys

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.templating import _TemplateResponse

from app.api.router import api_router
from app.config import settings

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stdout,
)

logging.getLogger("app").setLevel(logging.DEBUG)
logging.getLogger("app.core.letter_service").setLevel(logging.DEBUG)
logging.getLogger("app.api.v1.endpoints.letters").setLevel(logging.DEBUG)
logging.getLogger("app.api.v1.endpoints.form_drafts").setLevel(logging.DEBUG)

logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Je me défends API",
    description="Aide aux particuliers pour les litiges de consommation face aux professionnels",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

logger.info("FastAPI application initialized - Debug mode: %s", settings.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logger.info("CORS middleware configured - Origins: %s", settings.ALLOWED_ORIGINS)

app.mount("/static", StaticFiles(directory="app/static"), name="static")
logger.info("Static files mounted at /static")

templates = Jinja2Templates(directory="app/templates")
app.state.templates = templates
logger.info("Templates initialized from app/templates")

app.include_router(api_router, prefix="/api/v1")
logger.info("API router included with prefix /api/v1")


@app.get("/", response_class=HTMLResponse)
async def home_page(request: Request) -> _TemplateResponse:
    logger.debug("GET / - Serving home page")
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/eligibilite", response_class=HTMLResponse)
async def eligibility_page(request: Request) -> _TemplateResponse:
    logger.debug("GET /eligibilite - Serving eligibility test page")
    return templates.TemplateResponse("eligibilite.html", {"request": request})


@app.get("/formulaire", response_class=HTMLResponse)
async def form_page(request: Request) -> _TemplateResponse:
    logger.debug("GET /formulaire - Serving form page")
    return templates.TemplateResponse("formulaire.html", {"request": request})


@app.get("/resultats", response_class=HTMLResponse)
async def resultats_page(request: Request) -> _TemplateResponse:
    logger.debug("GET /resultats - Serving results page")
    return templates.TemplateResponse(
        "resultats.html",
        {
            "request": request,
        },
    )


@app.get("/mentions-legales", response_class=HTMLResponse)
async def mentions_legales_page(request: Request) -> _TemplateResponse:
    logger.debug("GET /mentions-legales - Serving results page")
    return templates.TemplateResponse(
        "mentions_legales.html",
        {
            "request": request,
        },
    )


@app.get("/politique-confidentialite", response_class=HTMLResponse)
async def politique_confidentialite_page(request: Request) -> _TemplateResponse:
    logger.debug("GET /politique-confidentialite - Serving results page")
    return templates.TemplateResponse(
        "politique_confidentialite.html",
        {
            "request": request,
        },
    )


@app.get("/health")
async def health_check() -> dict[str, str]:
    logger.info("Health check requested")
    return {"status": "healthy", "service": "je-me-defends"}
