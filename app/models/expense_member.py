from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class ExpenseMember(db.Model):
  __tablename__ = 'expense_members'

  if environment == "production":
      __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  expense_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('expenses.id')), nullable=False)
  user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
  amount_owed = db.Column(db.Numeric(precision=10, scale=2), default=0)
  settled = db.Column(db.Boolean, nullable=False, default=False)
  created_at = db.Column(db.DateTime, default=datetime.now)
  updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

  expense = db.relationship("Expense",back_populates="expense_members")
  user = db.relationship("User", backref="expense_members")

  def to_dict(self):
    return {
      'id': self.id,
      'expense_id': self.expense_id,
      'user_id': self.user_id,
      'amount_owed': self.amount_owed,
      'settled': self.settled,
      'user': {
        'id': self.user.id,
        'username': self.user.username,
        'firstname': self.user.firstname,
        'lastname': self.user.lastname
      },
      'created_at': self.created_at,
      'updated_at': self.updated_at
    }
