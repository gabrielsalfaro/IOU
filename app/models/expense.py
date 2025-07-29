from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Expense(db.Model):
  __tablename__ = 'expenses'

  if environment == "production":
        __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  description = db.Column(db.String(30), nullable=False)
  expense_owner = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
  status = db.Column(db.String(20), nullable=False)
  created_at = db.Column(db.DateTime, default=datetime.now)
  updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

  expense_members = db.relationship("ExpenseMember",back_populates="expense", cascade="all")
  comments = db.relationship("Comment", back_populates="expense", cascade="all")
  payments = db.relationship("Payment", back_populates="expense", cascade="all")

  def to_dict(self):
      return {
        'id': self.id,
        'description': self.description,
        'expense_owner': self.expense_owner,
        'status': self.status,
        'created_at': self.created_at,
        'updated_at': self.updated_at,
        'expense_members': [member.to_dict() for member in self.expense_members],
        'comments': [comment.to_dict() for comment in self.comments]
      }
