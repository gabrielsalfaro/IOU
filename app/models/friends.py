from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import UserMixin
from sqlalchemy import CheckConstraint
import datetime

class Friends(db.Model, UserMixin):
    __tablename__ = 'friends'

    if environment == "production": 
        __table_args__ = (
    {'schema': SCHEMA}, 
    CheckConstraint("status IN ('friends', 'pending')", name="check_status_valid")
    )
    

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    status = db.Column(db.String, nullable=False)

    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)

    # only allow friends or pending in status
    __table_args__ = (
       
    )

    # relationships
    user = db.relationship('User', foreign_keys=[user_id], backref=db.backref('friends', lazy=True))
    friend = db.relationship('User', foreign_keys=[friend_id], backref=db.backref('friendships', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'friend_id': self.friend_id,
            'status': self.status,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }