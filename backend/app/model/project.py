from sqlalchemy import Column, Integer, String, Text, Enum, Date, TIMESTAMP
from app.config.db import Base

class Project(Base):
    __tablename__ = "project"
    id_project = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    addres = Column(String(255))
    state_project = Column(Enum('pendiente', 'en_progreso', 'finalizado'), default='pendiente')
    start_date = Column(Date)
    end_date = Column(Date)
    create_date = Column(TIMESTAMP)
    delete_date = Column(TIMESTAMP, nullable=True)