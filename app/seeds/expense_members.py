from app.models import db, ExpenseMember, environment, SCHEMA
from sqlalchemy.sql import text

def seed_expense_members():
    #Users 1, 2, 3 are friends. Users 4, 5, 6 are friends. Cannot have expenses with people who are not friends. If a user deletes a friend from their friend lists the expenses they share that are still unsettled should remain.

    em1 = ExpenseMember(expense_id=1, user_id=1, amount_owed=10.25, settled=True)
    em2 = ExpenseMember(expense_id=1, user_id=2, amount_owed=10.25, settled=False)
    em3 = ExpenseMember(expense_id=1, user_id=3, amount_owed=10.25, settled=False)

    em4 = ExpenseMember(expense_id=2, user_id=1, amount_owed=30.15, settled=True)
    em5 = ExpenseMember(expense_id=2, user_id=2, amount_owed=30.15, settled=True)

    em6 = ExpenseMember(expense_id=3, user_id=1, amount_owed=15.07, settled=True)
    em7 = ExpenseMember(expense_id=3, user_id=3, amount_owed=15.07, settled=False)

    em8 = ExpenseMember(expense_id=4, user_id=1, amount_owed=12.58, settled=True)
    em9 = ExpenseMember(expense_id=4, user_id=2, amount_owed=12.58, settled=False)
    em10 = ExpenseMember(expense_id=4, user_id=3, amount_owed=12.58, settled=False)

    em11 = ExpenseMember(expense_id=5, user_id=1, amount_owed=500.00, settled=True)
    em12 = ExpenseMember(expense_id=5, user_id=2, amount_owed=500.00, settled=True)

    em13 = ExpenseMember(expense_id=6, user_id=2, amount_owed=20.01, settled=True)
    em14 = ExpenseMember(expense_id=6, user_id=1, amount_owed=20.01, settled=False)

    em15 = ExpenseMember(expense_id=7, user_id=3, amount_owed=8.99, settled=True)
    em16 = ExpenseMember(expense_id=7, user_id=2, amount_owed=8.99, settled=True)

    em17 = ExpenseMember(expense_id=8, user_id=3, amount_owed=5.00, settled=True)
    em18 = ExpenseMember(expense_id=8, user_id=1, amount_owed=5.00, settled=True)

    em19 = ExpenseMember(expense_id=9, user_id=3, amount_owed=7.50, settled=True)
    em20 = ExpenseMember(expense_id=9, user_id=2, amount_owed=7.50, settled=False)
    em21 = ExpenseMember(expense_id=9, user_id=1, amount_owed=7.50, settled=False)

    em22 = ExpenseMember(expense_id=10, user_id=3, amount_owed=15.75, settled=True)
    em23 = ExpenseMember(expense_id=10, user_id=2, amount_owed=15.75, settled=False)

    em25 = ExpenseMember(expense_id=11, user_id=4, amount_owed=3.05, settled=True)
    em26 = ExpenseMember(expense_id=11, user_id=5, amount_owed=3.05, settled=True)
    em27 = ExpenseMember(expense_id=11, user_id=6, amount_owed=3.05, settled=False)

    em28 = ExpenseMember(expense_id=12, user_id=4, amount_owed=10.00, settled=True)
    em29 = ExpenseMember(expense_id=12, user_id=6, amount_owed=10.00, settled=False)

    em30 = ExpenseMember(expense_id=13, user_id=5, amount_owed=5.00, settled=True)
    em31 = ExpenseMember(expense_id=13, user_id=6, amount_owed=5.00, settled=False)

    em32 = ExpenseMember(expense_id=14, user_id=4, amount_owed=5.97, settled=True)
    em33 = ExpenseMember(expense_id=14, user_id=5, amount_owed=5.97, settled=True)
    em34 = ExpenseMember(expense_id=14, user_id=6, amount_owed=5.97, settled=True)

    em35 = ExpenseMember(expense_id=15, user_id=4, amount_owed=50.00, settled=True)
    em36 = ExpenseMember(expense_id=15, user_id=5, amount_owed=50.00, settled=True)
    em37 = ExpenseMember(expense_id=15, user_id=6, amount_owed=50.00, settled=True)

    db.session.add_all([
      em1, em2, em3, em4, em5, em6, em7, em8, em9, em10, em11, em12, em13, em14, em15,
      em16, em17, em18, em19, em20, em21, em22, em23, em25, em26, em27, em28,
      em29, em30, em31, em32, em33, em34, em35, em36, em37
    ])
    db.session.commit()

def undo_expense_members():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.expense_members RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM expense_members"))

    db.session.commit()
