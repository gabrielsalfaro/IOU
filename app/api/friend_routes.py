from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Friend, User
from app.models import db
from datetime import datetime, timezone

friend_routes = Blueprint('friends', __name__)


# Get All Friends
@friend_routes.route('/', methods=['GET'])
@login_required
def get_friends():
    friends_as_user = Friend.query.filter_by(user_id=current_user.id, status='friends').all()
    friends_as_friend = Friend.query.filter_by(friend_id=current_user.id, status='friends').all()

    all_friends = friends_as_user + friends_as_friend

    return jsonify({
        "friends": [friend.to_dict() for friend in all_friends]
    })



# Get Pending Friend Requests
@friend_routes.route('/pending', methods=['GET'])
@login_required
def get_pending_friends():
    """
    Get all pending friend requests for the current user
    """

    pending = Friend.query.filter(
        ((Friend.friend_id == current_user.id)) &
        (Friend.status == 'pending')
    ).all()

    return jsonify({
        "pending": [pending_request.to_dict() for pending_request in pending]
    })


# Add a Friend
@friend_routes.route('/add', methods=['POST'])
@login_required
def add_friend():
    """
    Send a friend request to another user
    """

    data = request.get_json()
    friend_id = data.get('friendId')

    errors = {}

    # Check if a request or friendship already exists (either direction)
    existing = Friend.query.filter(
        ((Friend.user_id == current_user.id) & (Friend.friend_id == friend_id)) |
        ((Friend.user_id == friend_id) & (Friend.friend_id == current_user.id))
    ).first()

    if existing:
        return jsonify({
            "message": "Friend request already exists or users are already friends"
        }), 500

    # Create new friend request
    new_request = Friend(
        user_id=current_user.id,
        friend_id=friend_id,
        status='pending',
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )

    db.session.add(new_request)
    db.session.commit()

    return jsonify({
        "friend": new_request.to_dict()
    }), 201


# Accept a Pending Friend Request
@friend_routes.route('/accept/<int:friend_id>', methods=['PUT'])
@login_required
def accept_friend_request(friend_id):
    from datetime import datetime

    friend_request = Friend.query.filter_by(
        user_id=friend_id,
        friend_id=current_user.id,
        status='pending'
    ).first()

    if not friend_request:
        return jsonify({ "message": "No pending friend request found." }), 404

    # update status and timestamp
    friend_request.status = 'friends'
    friend_request.updated_at = datetime.now()

    friend_data = friend_request.to_dict()

    db.session.commit()

    return jsonify({
        "message": "Friend request accepted.",
        "friend": friend_data
    }), 200



# Decline a Pending Friend Request
@friend_routes.route('/decline/<int:friend_id>', methods=['DELETE'])
@login_required
def decline_friend_request(friend_id):
    friend_request = Friend.query.filter_by(
        user_id=friend_id,
        friend_id=current_user.id,
        status='pending'
    ).first()

    if not friend_request:
        return jsonify({
            "message": "No pending friend request found from that user."
        }), 404

    # convert to dict for bound error
    friend_data = friend_request.to_dict()

    db.session.delete(friend_request)
    db.session.commit()

    return jsonify({
        "message": "Friend request deleted.",
        "friend": friend_data
    }), 200




# Delete a Friend
@friend_routes.route('/delete/<int:friend_id>', methods=['DELETE'])
@login_required
def delete_friend_request(friend_id):
    """
    Remove a friend from the current_user friends list
    """

    # Find the request
    friend = Friend.query.filter(
        ((Friend.user_id == current_user.id) & (Friend.friend_id == friend_id)) |
        ((Friend.user_id == friend_id) & (Friend.friend_id == current_user.id))
    ).first()

    if not friend:
        return jsonify({ "message": "Friendship not found, even without status." }), 404
    else:
        print("Found friendship:", friend.to_dict())

    # print("Current user:", current_user.id)
    # print("Friend to remove:", friend_id)
    # print("Found friendship:", friend.to_dict())

    if not friend:
        return jsonify({ "message": "Friend relationship not found." }), 404

    db.session.delete(friend)

    db.session.commit()

    return jsonify({
        "message": "Removed friend from your list.",
        "friend": friend.to_dict()
    }), 200

@friend_routes.route('/test', methods=['GET'])
def test():
    print('test')
    return "test"