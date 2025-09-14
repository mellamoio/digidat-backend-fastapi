from sqlalchemy import create_engine, MetaData

engine = create_engine(
    "mysql+pymysql://root:root@localhost:3308/team2_digidat",
    echo=True,
    future=True
                       )


meta_data = MetaData()