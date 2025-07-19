from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Payment(db.Model):
    __tablename__ = 'payments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)

    # I believe this stores the related expense ID
    expense_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('expenses.id')), nullable=False)

    # I believe this stores the user who is paying
    payer_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)

    # I believe this stores the amount paid
    amount = db.Column(db.Numeric(10, 2), nullable=False)


    # I believe this shows payment status
    status = db.Column(db.String(20), nullable=False, default="pending")

   
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    
    expense = db.relationship('Expense', backref='payments')
    payer = db.relationship('User', backref='payments')

    def to_dict(self):
        return {
            'id': self.id,
            'expense_id': self.expense_id,
            'payer_id': self.payer_id,
            'amount': float(self.amount),
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
