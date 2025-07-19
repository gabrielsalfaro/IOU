from app.models import db, Payment, environment, SCHEMA
from sqlalchemy.sql import text

def seed_payments():
    payments = [
        Payment(expense_id=1, payer_id=1, amount=10.25, note="Lunch share", status="paid"),
        Payment(expense_id=2, payer_id=2, amount=30.15, note="Groceries split", status="paid"),
        Payment(expense_id=4, payer_id=1, amount=12.58, note="Dinner contribution", status="paid"),
        Payment(expense_id=5, payer_id=2, amount=500.00, note="Rent", status="paid"),
        Payment(expense_id=7, payer_id=3, amount=8.99, note="Pizza night", status="paid"),
        Payment(expense_id=8, payer_id=2, amount=5.00, note="Bagel run", status="paid"),
        Payment(expense_id=10, payer_id=1, amount=15.75, note="Uber", status="paid"),
        Payment(expense_id=11, payer_id=5, amount=3.05, note="Breakfast", status="paid"),
        Payment(expense_id=13, payer_id=6, amount=5.00, note="Parking", status="paid"),
        Payment(expense_id=14, payer_id=4, amount=5.97, note="Snacks", status="paid"),
        Payment(expense_id=15, payer_id=6, amount=50.00, note="Airbnb", status="paid"),
    ]

    db.session.add_all(payments)
    db.session.commit()


def undo_payments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.payments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM payments"))

    db.session.commit()
