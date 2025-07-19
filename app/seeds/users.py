from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo',
        firstname='demo',
        lastname='user',
        email='demo@aa.io', 
        password='password',
        # profile_img='url'
        )
    marnie = User(
        username='marnie',
        firstname='marnie',
        lastname='johnson',
        email='marnie@aa.io', 
        password='password',
        # profile_img='url'
        )
    bobbie = User(
        username='bobbie',
        firstname='bobbie',
        lastname='thompson',
        email='bobbie@aa.io', 
        password='password',
        # profile_img='url'
        )
    liam = User(
        username='liam',
        firstname='Liam',
        lastname='Garcia',
        email='liam@aa.io', 
        password='password',
        # profile_img='url'
        )
    noah = User(
        username='noah',
        firstname='Noah',
        lastname='Patel',
        email='noah@aa.io', 
        password='password',
        # profile_img='url'
        )
    sophia = User(
        username='sophia',
        firstname='Sophia',
        lastname='Kim',
        email='sophia@aa.io', 
        password='password',
        # profile_img='url'
        )

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.add(liam)
    db.session.add(noah)
    db.session.add(sophia)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
