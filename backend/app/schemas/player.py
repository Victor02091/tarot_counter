from pydantic import BaseModel, field_validator

class PlayerBase(BaseModel):
    first_name: str
    last_name: str

    # Normalize fields before any validation
    @field_validator("first_name", "last_name")
    def normalize_name(cls, v: str) -> str:
        return v.strip().title()

class PlayerCreate(PlayerBase):
    pass

class PlayerRead(PlayerBase):
    id: int
    visible: bool

    class Config:
        from_attributes = True
