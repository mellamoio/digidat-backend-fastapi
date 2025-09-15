from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine(
    "mysql+pymysql://root:c4b3rl456@localhost:3306/team2_digidat",
    echo=True,
    future=True
)

Base = declarative_base()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


meta_data = MetaData()