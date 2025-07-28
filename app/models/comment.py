from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import UserMixin
from sqlalchemy import CheckConstraint
from datetime import datetime

class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == "production": 
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    # expense_id = db.Column(db.Integer, db.ForeignKey('expenses.id'), nullable=False)
    expense_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod('expenses.id')),
        nullable=False
    )

    # user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)

    content = db.Column(db.String(), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now) 
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    expense = db.relationship("Expense", back_populates="comments")
    user = db.relationship("User", backref="comments")


    def to_dict(self):
        return {
            'id': self.id,
            'expense_id': self.expense_id,
            'user_id': self.user_id,
            'content': self.content,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'user': {
            'id': self.user.id,
            'firstname': self.user.firstname,
            'profile_img': self.user.profile_img
        }
        }