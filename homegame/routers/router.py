from typing import (
    List,
    Optional,
    Type,
    get_args,
    get_origin,
    get_type_hints,
)

import sqlalchemy.orm
from db.core import NotFoundError, get_db, USE_PSQL

if USE_PSQL:
    from db.core import get_psql_db
from fastapi import APIRouter, HTTPException, Request
from fastapi.params import Depends
from fastapi.responses import FileResponse
from pydantic import BaseModel
from routers.limiter import limiter
from sqlalchemy.orm import Session, sessionmaker


def extract_mapped_type(mapped_type):
    """Extract the inner type from a Mapped type."""
    if get_origin(mapped_type) is sqlalchemy.orm.Mapped:
        return get_args(mapped_type)[0]
    return mapped_type


def create_router(
    DBType: Type,
) -> APIRouter:
    item = DBType.__tablename__[:-1]
    router = APIRouter(
        prefix=f"/{DBType.__tablename__}",
    )

    main_db = get_db
    if USE_PSQL:
        main_db = get_psql_db

    def create_classes(DBType: Type):
        annotations_create = {}
        annotations_update = {}
        annotations_base = {"id": int}  # Add the id field to the base class annotations
        defaults_create = {}
        defaults_update = {}

        for attr, attr_type in get_type_hints(DBType).items():
            if attr in ("__tablename__", "id"):
                continue
            inner_type = extract_mapped_type(attr_type)
            # Make the attribute optional if it's nullable
            is_optional = (
                getattr(inner_type, "__args__", None)
                and type(None) in inner_type.__args__
            )
            if is_optional:
                inner_type = Optional[inner_type.__args__[0]]
                defaults_create[attr] = None  # Set default to None for nullable fields
            annotations_create[attr] = inner_type
            annotations_update[attr] = Optional[inner_type]
            defaults_update[attr] = None  # Set default to None for update fields
            annotations_base[attr] = (
                inner_type  # BaseType should have the same annotations as CreateType
            )

        # Create new classes with the updated annotations and defaults
        name = DBType.__name__[2:]
        create_class = type(
            f"{name}Create",
            (BaseModel,),
            {
                "__annotations__": annotations_create,
                **defaults_create,  # Add default values directly in the class definition
            },
        )
        update_class = type(
            f"{name}Update",
            (BaseModel,),
            {
                "__annotations__": annotations_update,
                **defaults_update,  # Add default values directly in the class definition
            },
        )
        base_class = type(
            name,
            (BaseModel,),
            {
                "__annotations__": annotations_base,
                **defaults_create,  # Add default values directly in the class definition
            },
        )

        return create_class, update_class, base_class

    CreateType, UpdateType, BaseType = create_classes(DBType)

    @router.get("/")
    @limiter.limit("1000/second")
    def read(
        request: Request,
        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(main_db),
    ) -> List[BaseType]:
        try:
            db_items = db.query(DBType).offset(skip).limit(limit).all()
        except NotFoundError as e:
            raise HTTPException(status_code=404) from e
        items = []
        for item in db_items:
            items.append(BaseType(**item.__dict__))
        return items

    @router.post("/")
    @limiter.limit("1000/second")
    def create(
        request: Request, create_item: CreateType, db: Session = Depends(main_db)
    ) -> BaseType:
        db_item = DBType(**create_item.model_dump(exclude_none=True))
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return BaseType(**db_item.__dict__)

    @router.get("/{id}")
    @limiter.limit("1000/second")
    def read_one(request: Request, id: int, db: Session = Depends(main_db)) -> BaseType:
        db_item = db.query(DBType).filter(DBType.id == id).first()
        if db_item is None:
            raise HTTPException(
                status_code=404, detail={"message": f"{item} with id {id} not found."}
            )
        return BaseType(**db_item.__dict__)

    @router.put("/{id}")
    @limiter.limit("1000/second")
    def update(
        request: Request,
        id: int,
        item_update: UpdateType,
        db: Session = Depends(main_db),
    ) -> BaseType:
        db_item = db.query(DBType).filter(DBType.id == id).first()
        if db_item is None:
            raise HTTPException(
                status_code=404, detail={"message": f"{item} with id {id} not found."}
            )
        for key, value in item_update.model_dump(exclude_none=True).items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
        return BaseType(**db_item.__dict__)

    @router.delete("/{id}")
    @limiter.limit("1000/second")
    def delete(request: Request, id: int, db: Session = Depends(main_db)) -> BaseType:
        db_item = db.query(DBType).filter(DBType.id == id).first()
        if db_item is None:
            raise HTTPException(
                status_code=404, detail={"message": f"{item} with id {id} not found."}
            )
        db.delete(db_item)
        db.commit()
        return BaseType(**db_item.__dict__)

    if USE_PSQL:

        @router.get("/insert_psql/")
        @limiter.limit("1000/second")
        def insert(
            request: Request,
            db: Session = Depends(get_psql_db),
            old_db: Session = Depends(get_db),
        ):
            old_items = read(request, 0, 1000, old_db)
            for item in old_items:
                delattr(item, "id")
                create(request, item, db)
            return "succes"

        @router.get("/read_psql/")
        @limiter.limit("1000/second")
        def read_psql(
            request: Request,
            db: Session = Depends(get_psql_db),
            old_db: Session = Depends(get_db),
        ):
            items = read(request, 0, 1000, db)
            old_items = read(request, 0, 1000, old_db)
            for item in old_items:
                delete(request, item.id, old_db)
            for item in items:
                delattr(item, "id")
                create(request, item, old_db)
            return FileResponse(
                path="./poker.db", media_type="database/db", filename="poker.db"
            )

    return router
