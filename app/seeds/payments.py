from app.models import db, Payment, environment, SCHEMA
from sqlalchemy.sql import text

def seed_payments():
    payment1 = Payment(
        expense_id=1,
        payer_id=1,
        amount=10.25,
        status="paid"
    )

    payment2 = Payment(
        expense_id=2,
        payer_id=2,
        amount=30.15,
        status="paid"
    )

    payment3 = Payment(
        expense_id=4,
        payer_id=1,
        amount=12.58,
        status="paid"
    )

    payment4 = Payment(
        expense_id=5,
        payer_id=2,
        amount=500.00,
        status="paid"
    )

    payment5 = Payment(
        expense_id=7,
        payer_id=3,
        amount=8.99,
        status="paid"
    )

    payment6 = Payment(
        expense_id=8,
        payer_id=2,
        amount=5.00,
        status="paid"
    )

    payment7 = Payment(
        expense_id=10,
        payer_id=1,
        amount=15.75,
        status="paid"
    )

    payment8 = Payment(
        expense_id=11,
        payer_id=5,
        amount=3.05,
        status="paid"
    )

    payment9 = Payment(
        expense_id=13,
        payer_id=6,
        amount=5.00,
        status="paid"
    )

    payment10 = Payment(
        expense_id=14,
        payer_id=4,
        amount=5.97,
        status="paid"
    )

    payment11 = Payment(
        expense_id=15,
        payer_id=6,
        amount=50.00,
        status="paid"
    )

    db.session.add_all([
    payment1, payment2, payment3, payment4, payment5, 
    payment6, payment7, payment8, payment9, payment10, payment11
    ])
    db.session.commit()


def undo_payments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.payments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM payments"))

    db.session.commit()
