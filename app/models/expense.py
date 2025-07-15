from .db import db, environment, SCHEMA, add_prefix_for_prod

class Expense(db.Model):
  __tablename__ = 'expenses'

  if environment == "production":
        __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  description = db.Column(db.String(30), nullable=False)
  expense_owner = db.Column(db.Integer, nullable=False)
  status = db.Column(db.String(20), nullable=False)

  def to_dict(self):
      return {
        'id': self.id,
        'description': self.description,
        'expense_owner': self.expense_owner,
        'status': self.status
      }
