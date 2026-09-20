# Декларативная база — от неё наследуются все модели.
# SQLAlchemy 2.0 использует DeclarativeBase.
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass