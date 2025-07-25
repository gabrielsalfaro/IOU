from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import CheckConstraint
from datetime import datetime

class Friend(db.Model):
    __tablename__ = 'friends'

    if environment == "production":
        __table_args__ = (
            {'schema': SCHEMA},
            #CheckConstraint("status IN ('friends', 'pending')", name="check_status_valid")
    )


    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    status = db.Column(db.String, nullable=False) # CheckConstraint
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

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
            'updated_at': self.updated_at,
            'friend': {
                'id': self.friend.id,
                'username': self.friend.username,
                'email': self.friend.email,
                'profile_img': self.friend.profile_img,
                'firstname': self.friend.firstname,
                'lastname': self.friend.lastname
            }
        }
