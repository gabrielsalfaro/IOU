from app.models import db, Payment, environment, SCHEMA
from sqlalchemy.sql import text

def seed_payments():
    payments = [
        # Player ID 1 payments (4 ongoing, 4 paid)
        Payment(expense_id=1, payer_id=1, amount=25.50, status="ongoing"),  # Lunch
        Payment(expense_id=3, payer_id=1, amount=35.00, status="ongoing"),  # Gas
        Payment(expense_id=6, payer_id=1, amount=85.00, status="ongoing"),  # Internet
        Payment(expense_id=11, payer_id=1, amount=12.99, status="ongoing"), # Breakfast
        Payment(expense_id=2, payer_id=1, amount=65.00, status="paid"),     # Groceries
        Payment(expense_id=5, payer_id=1, amount=1200.00, status="paid"),   # Rent
        Payment(expense_id=8, payer_id=1, amount=15.25, status="paid"),    # Coffee
        Payment(expense_id=15, payer_id=1, amount=225.00, status="paid"),  # Airbnb

        # Player ID 2 payments (4 ongoing, 4 paid)
        Payment(expense_id=1, payer_id=2, amount=25.50, status="ongoing"),
        Payment(expense_id=3, payer_id=2, amount=35.00, status="ongoing"),
        Payment(expense_id=6, payer_id=2, amount=85.00, status="ongoing"),
        Payment(expense_id=11, payer_id=2, amount=12.99, status="ongoing"),
        Payment(expense_id=2, payer_id=2, amount=65.00, status="paid"),
        Payment(expense_id=5, payer_id=2, amount=1200.00, status="paid"),
        Payment(expense_id=8, payer_id=2, amount=15.25, status="paid"),
        Payment(expense_id=15, payer_id=2, amount=225.00, status="paid"),

        # Player ID 3 payments (4 ongoing, 4 paid)
        Payment(expense_id=1, payer_id=3, amount=25.50, status="ongoing"),
        Payment(expense_id=3, payer_id=3, amount=35.00, status="ongoing"),
        Payment(expense_id=6, payer_id=3, amount=85.00, status="ongoing"),
        Payment(expense_id=11, payer_id=3, amount=12.99, status="ongoing"),
        Payment(expense_id=2, payer_id=3, amount=65.00, status="paid"),
        Payment(expense_id=5, payer_id=3, amount=1200.00, status="paid"),
        Payment(expense_id=8, payer_id=3, amount=15.25, status="paid"),
        Payment(expense_id=15, payer_id=3, amount=225.00, status="paid"),

        # Player ID 4 payments (4 ongoing, 4 paid)
        Payment(expense_id=1, payer_id=4, amount=25.50, status="ongoing"),
        Payment(expense_id=3, payer_id=4, amount=35.00, status="ongoing"),
        Payment(expense_id=6, payer_id=4, amount=85.00, status="ongoing"),
        Payment(expense_id=11, payer_id=4, amount=12.99, status="ongoing"),
        Payment(expense_id=2, payer_id=4, amount=65.00, status="paid"),
        Payment(expense_id=5, payer_id=4, amount=1200.00, status="paid"),
        Payment(expense_id=8, payer_id=4, amount=15.25, status="paid"),
        Payment(expense_id=15, payer_id=4, amount=225.00, status="paid")
    ]
    
    db.session.add_all(payments)
    db.session.commit()

def undo_payments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.payments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM payments"))
    
    db.session.commit()