from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import UserMixin
from sqlalchemy import CheckConstraint
import datetime

class Friends(db.Model):
    __table__ = 'comments'

    if environment == "production": 
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    expense_id = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.String())
    created_at = db.Column(db.DateTime, default=datetime.now) # check date stuff
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

def to_dict(self):
    return {
        'id': self.id,
        'expense_id': self.expense_id,
        'user_id': self.user_id,
        'content': self.content,
        'created_at': self.created_at,
        'updated_at': self.updated_at
    }