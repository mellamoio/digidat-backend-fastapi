import enum
from sqlalchemy import Column, Integer, String, Text, Enum, Date, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.config.db import Base

class StateProjectEnum(str, enum.Enum):
    PRIORIZACION = "priorizacion"
    ACTOS_PREVIOS = "actos_previos"
    SELECCION = "seleccion"
    EJECUCION = "ejecucion"
    EMISION = "emision_de_ciprl_o_cipgn"

class Project(Base):
    __tablename__ = "project"

    id_project = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    address = Column(String(255), nullable=True)
    state_project = Column(Enum(StateProjectEnum), default=StateProjectEnum.PRIORIZACION, nullable=False)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    create_date = Column(TIMESTAMP, server_default=func.now())
    delete_date = Column(TIMESTAMP, nullable=True)

    documents = relationship("Document", back_populates="project")

    def __repr__(self):
        return f"<Project(id={self.id_project}, name='{self.name}', state='{self.state_project}')>"
