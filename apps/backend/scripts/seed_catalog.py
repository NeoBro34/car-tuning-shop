from __future__ import annotations

import sys
from dataclasses import dataclass
from pathlib import Path

from sqlalchemy.orm import Session

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.database import SessionLocal
from app.models.brand import Brand
from app.models.car_model import CarModel
from app.models.category import Category
from app.services.slug import slugify


@dataclass(frozen=True)
class CategorySeed:
    group: str
    name: str


BRANDS = [
    "Hyundai",
    "Kia",
    "Genesis",
    "KGM (SsangYong)",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Volkswagen",
    "Porsche",
    "MINI",
    "Land Rover",
    "Volvo",
    "Toyota",
    "Lexus",
    "Honda",
    "Nissan",
    "Chevrolet",
    "Ford",
    "Tesla",
    "Ferrari",
    "Lamborghini",
    "Maserati",
    "Bentley",
    "Rolls-Royce",
    "McLaren",
    "Jeep",
    "Cadillac",
    "GMC",
    "Peugeot",
    "Renault",
    "Jaguar",
    "Subaru",
    "Mazda",
    "Suzuki",
]

CATEGORIES = [
    CategorySeed("Performance", "Exhaust"),
    CategorySeed("Performance", "Suspension"),
    CategorySeed("Performance", "Turbo"),
    CategorySeed("Performance", "Brake System"),
    CategorySeed("Performance", "Air Intake"),
    CategorySeed("Performance", "ECU Tuning"),
    CategorySeed("Performance", "Coilovers"),
    CategorySeed("Performance", "Intercooler"),
    CategorySeed("Exterior", "Body Kit"),
    CategorySeed("Exterior", "Spoiler"),
    CategorySeed("Exterior", "Front Lip"),
    CategorySeed("Exterior", "Rear Diffuser"),
    CategorySeed("Exterior", "Side Skirt"),
    CategorySeed("Exterior", "LED Lights"),
    CategorySeed("Exterior", "Fog Lights"),
    CategorySeed("Exterior", "Mirror Covers"),
    CategorySeed("Interior", "Seat Covers"),
    CategorySeed("Interior", "Steering Wheel"),
    CategorySeed("Interior", "Ambient Lighting"),
    CategorySeed("Interior", "Floor Mats"),
    CategorySeed("Interior", "Dashboard Accessories"),
    CategorySeed("Wheels", "Wheels"),
    CategorySeed("Wheels", "Tires"),
    CategorySeed("Wheels", "Wheel Spacers"),
    CategorySeed("Maintenance", "Engine Oil"),
    CategorySeed("Maintenance", "Filters"),
    CategorySeed("Maintenance", "Brake Pads"),
    CategorySeed("Maintenance", "Battery"),
    CategorySeed("Maintenance", "Spark Plugs"),
    CategorySeed("SUV / Camping", "Roof Box"),
    CategorySeed("SUV / Camping", "Roof Rack"),
    CategorySeed("SUV / Camping", "Camping Accessories"),
    CategorySeed("SUV / Camping", "Off-road Parts"),
]

CAR_MODELS = {
    "Audi": ["A4", "A6", "Q5", "RS6"],
    "Bentley": ["Continental GT", "Flying Spur", "Bentayga"],
    "BMW": ["3 Series", "5 Series", "M3", "M4", "M5", "X5M"],
    "Cadillac": ["CT5", "Escalade", "XT5"],
    "Chevrolet": ["Camaro", "Corvette", "Tahoe"],
    "Ferrari": ["488", "F8 Tributo", "Roma"],
    "Ford": ["Mustang", "Bronco", "F-150"],
    "Genesis": ["G70", "G80", "GV70", "GV80"],
    "GMC": ["Sierra", "Yukon", "Hummer EV"],
    "Honda": ["Civic", "Accord", "CR-V"],
    "Hyundai": ["Avante", "Sonata", "Grandeur", "Palisade"],
    "Jaguar": ["XE", "F-Type", "F-Pace"],
    "Jeep": ["Wrangler", "Grand Cherokee", "Gladiator"],
    "KGM (SsangYong)": ["Torres", "Rexton", "Tivoli"],
    "Kia": ["K5", "K8", "Sorento", "Carnival", "Sportage"],
    "Lamborghini": ["Huracan", "Aventador", "Urus"],
    "Land Rover": ["Defender", "Range Rover", "Discovery"],
    "Lexus": ["IS", "ES", "RX"],
    "Maserati": ["Ghibli", "Levante", "GranTurismo"],
    "Mazda": ["Mazda3", "Mazda6", "CX-5", "MX-5"],
    "McLaren": ["570S", "720S", "Artura"],
    "Mercedes-Benz": ["C-Class", "E-Class", "C63 AMG", "E63 AMG", "G63 AMG"],
    "MINI": ["Cooper", "Clubman", "Countryman"],
    "Nissan": ["GT-R", "Z", "Altima", "Rogue"],
    "Peugeot": ["208", "308", "3008"],
    "Porsche": ["911", "Cayman", "Cayenne", "Taycan"],
    "Renault": ["Clio", "Megane", "Koleos"],
    "Rolls-Royce": ["Ghost", "Phantom", "Cullinan"],
    "Subaru": ["WRX", "BRZ", "Forester"],
    "Suzuki": ["Swift", "Jimny", "Vitara"],
    "Tesla": ["Model 3", "Model Y", "Model S"],
    "Toyota": ["Camry", "Supra", "Land Cruiser", "RAV4"],
    "Volkswagen": ["Golf GTI", "Passat", "Tiguan"],
    "Volvo": ["S60", "XC60", "XC90"],
}


def seed_brands(db: Session) -> dict[str, Brand]:
    brands: dict[str, Brand] = {}

    for name in BRANDS:
        slug = slugify(name)
        brand = db.query(Brand).filter(Brand.slug == slug).one_or_none()
        if brand is None:
            brand = Brand(
                name=name,
                slug=slug,
                description=f"{name} automotive manufacturer",
                is_active=True,
            )
            db.add(brand)
            db.flush()
        else:
            brand.name = name
            brand.is_active = True
        brands[name] = brand

    return brands


def seed_categories(db: Session) -> None:
    for item in CATEGORIES:
        slug = slugify(item.name)
        category = db.query(Category).filter(Category.slug == slug).one_or_none()
        description = f"{item.group} category for Korea automotive marketplace catalog"
        if category is None:
            db.add(
                Category(
                    name=item.name,
                    slug=slug,
                    description=description,
                    is_active=True,
                )
            )
        else:
            category.name = item.name
            category.description = category.description or description
            category.is_active = True


def seed_car_models(db: Session, brands: dict[str, Brand]) -> None:
    for brand_name, model_names in CAR_MODELS.items():
        brand = brands[brand_name]
        for model_name in model_names:
            slug = slugify(model_name)
            car_model = (
                db.query(CarModel)
                .filter(CarModel.brand_id == brand.id, CarModel.slug == slug)
                .one_or_none()
            )
            if car_model is None:
                db.add(
                    CarModel(
                        brand_id=brand.id,
                        name=model_name,
                        slug=slug,
                        is_active=True,
                    )
                )
            else:
                car_model.name = model_name
                car_model.is_active = True


def seed_catalog() -> None:
    db = SessionLocal()
    try:
        brands = seed_brands(db)
        seed_categories(db)
        seed_car_models(db, brands)
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_catalog()
    print("Catalog seed completed.")
