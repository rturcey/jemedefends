from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.templating import _TemplateResponse

from app.api.router import api_router
from app.config import settings

app = FastAPI(
    title="Je me défends API",
    description="Aide aux particuliers pour les litiges de consommation face aux professionnels",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files - DOIT être avant les routes
app.mount("/static", StaticFiles(directory="app/static"), name="static")

templates = Jinja2Templates(directory="app/templates")
app.state.templates = templates

# Include API router avec préfixe /api
app.include_router(api_router, prefix="/api/v1")

# ========================================
# ROUTES PAGES WEB
# ========================================


@app.get("/", response_class=HTMLResponse)
async def home_page(request: Request) -> _TemplateResponse:
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/eligibilite", response_class=HTMLResponse)
async def eligibility_page(request: Request) -> _TemplateResponse:
    return templates.TemplateResponse("test_eligibilite.html", {"request": request})


@app.get("/formulaire", response_class=HTMLResponse)
async def form_page(request: Request) -> _TemplateResponse:
    return templates.TemplateResponse("formulaire.html", {"request": request})


@app.get("/resultats", response_class=HTMLResponse)
async def resultats_page(request: Request) -> _TemplateResponse:
    return templates.TemplateResponse("resultats.html", {"request": request})


# Health check pour nginx
@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "healthy", "service": "je-me-defends"}
