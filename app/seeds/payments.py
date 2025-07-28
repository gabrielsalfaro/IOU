from app.models import db, Payment, environment, SCHEMA
from sqlalchemy.sql import text

def seed_payments():
    payments = [
        # Player ID 1 payments (4 ongoing, 4 paid)
        Payment(expense_id=1, payer_id=1, amount=10.25, status="paid"),  # Lunch
        Payment(expense_id=2, payer_id=1, amount=30.15, status="paid"),     # Groceries
        Payment(expense_id=3, payer_id=1, amount=15.07, status="paid"),  # Gas
        Payment(expense_id=4, payer_id=1, amount=12.58, status="paid"),
        Payment(expense_id=5, payer_id=1, amount=500.00, status="paid"),
        Payment(expense_id=6, payer_id=1, amount=20.01, status="ongoing"),  # Internet
        Payment(expense_id=8, payer_id=1, amount=5.00, status="paid"),    # Coffee
        Payment(expense_id=9, payer_id=1, amount=7.50, status="ongoing"), # Breakfast

        # Player ID 2 payments (4 ongoing, 4 paid)
        Payment(expense_id=1, payer_id=2, amount=10.25, status="ongoing"),
        Payment(expense_id=2, payer_id=2, amount=30.15, status="paid"),
        Payment(expense_id=4, payer_id=2, amount=12.58, status="ongoing"),
        Payment(expense_id=5, payer_id=2, amount=500, status="paid"),
        Payment(expense_id=6, payer_id=2, amount=20.01, status="ongoing"),
        Payment(expense_id=7, payer_id=2, amount=8.99, status="paid"),
        Payment(expense_id=9, payer_id=2, amount=7.50, status="ongoing"),
        Payment(expense_id=10, payer_id=2, amount=15.75, status="ongoing"),

        # Player ID 3 payments (4 ongoing, 4 paid)
        Payment(expense_id=1, payer_id=3, amount=10.25, status="ongoing"),
        Payment(expense_id=3, payer_id=3, amount=15.07, status="ongoing"),
        Payment(expense_id=4, payer_id=3, amount=12.58, status="ongoing"),
        Payment(expense_id=7, payer_id=3, amount=8.99, status="paid"),
        Payment(expense_id=8, payer_id=3, amount=5.00, status="paid"),
        Payment(expense_id=9, payer_id=3, amount=7.50, status="paid"),
        Payment(expense_id=10, payer_id=3, amount=15.75, status="paid"),

        # Player ID 4 payments (4 ongoing, 4 paid)
        Payment(expense_id=12, payer_id=4, amount=10.00, status="paid"),
        Payment(expense_id=14, payer_id=4, amount=5.97, status="paid"),
        Payment(expense_id=15, payer_id=4, amount=50.00, status="paid")
    ]

    db.session.add_all(payments)
    db.session.commit()

def undo_payments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.payments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM payments"))

    db.session.commit()
