from fastapi import APIRouter

from app.api.v1 import auth, brands, car_models, categories, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(brands.router, prefix="/brands", tags=["brands"])
api_router.include_router(car_models.router, prefix="/car-models", tags=["car_models"])
