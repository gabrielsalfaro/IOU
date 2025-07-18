from app.models import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_comments():
    comment1 = Comment(
        expense_id=1,
        user_id=2,
        content="Hey, I paid for lunch!",
        created_at=datetime(2025, 7, 16, 10, 30),
        updated_at=datetime(2025, 7, 16, 10, 30)
    )

    comment2 = Comment(
        expense_id=1,
        user_id=3,
        content="Oops! My bad, sending it now.",
        created_at=datetime(2025, 7, 16, 11, 5),
        updated_at=datetime(2025, 7, 16, 11, 5)
    )

    comment3 = Comment(
        expense_id=2,
        user_id=4,
        content="Can we split the Uber fare evenly?",
        created_at=datetime(2025, 7, 15, 18, 42),
        updated_at=datetime(2025, 7, 15, 18, 42)
    )

    comment4 = Comment(
        expense_id=3,
        user_id=1,
        content="Just added the hotel booking. Check the amount.",
        created_at=datetime(2025, 7, 14, 9, 12),
        updated_at=datetime(2025, 7, 14, 9, 12)
    )

    db.session.add(comment1)
    db.session.add(comment2)
    db.session.add(comment3)
    db.session.add(comment4)
    db.session.commit()

def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))
        
    db.session.commit()