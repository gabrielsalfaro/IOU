from app.models import db, Expense, environment, SCHEMA
from sqlalchemy.sql import text

def seed_expenses():
    #6 total users seeded, 1 being the demo user
    expense1 = Expense(description="Lunch", expense_owner=1, status="open")
    expense2 = Expense(description="Groceries", expense_owner=1, status="settled")
    expense3 = Expense(description="Gas for the weekend trip", expense_owner=1, status="open")
    expense4 = Expense(description="Dinner with coworkers", expense_owner=1, status="open")
    expense5 = Expense(description="Monthly rent payment", expense_owner=1, status="settled")
    expense6 = Expense(description="Internet and cable bill", expense_owner=2, status="open")
    expense7 = Expense(description="Late night pizza order", expense_owner=2, status="settled")
    expense8 = Expense(description="Coffee and bagels", expense_owner=3, status="settled")
    expense9 = Expense(description="Birthday cake", expense_owner=3, status="open")
    expense10 = Expense(description="Shared Uber to airport", expense_owner=3, status="open")
    expense11 = Expense(description="Breakfast", expense_owner=4, status="open")
    expense12 = Expense(description="Monthly gym membership", expense_owner=4, status="open")
    expense13 = Expense(description="Parking fee", expense_owner=5, status="open")
    expense14 = Expense(description="Snacks for movie night", expense_owner=6, status="settled")
    expense15 = Expense(description="Weekend trip Airbnb", expense_owner=6, status="settled")

    db.session.add(expense1)
    db.session.add(expense2)
    db.session.add(expense3)
    db.session.add(expense4)
    db.session.add(expense5)
    db.session.add(expense6)
    db.session.add(expense7)
    db.session.add(expense8)
    db.session.add(expense9)
    db.session.add(expense10)
    db.session.add(expense11)
    db.session.add(expense12)
    db.session.add(expense13)
    db.session.add(expense14)
    db.session.add(expense15)

    db.session.commit()

def undo_expenses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.expenses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM expenses"))

    db.session.commit()
