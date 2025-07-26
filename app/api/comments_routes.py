from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Comment, Expense
from datetime import datetime

comment_routes = Blueprint('comments', __name__)

# Update a comment
@comment_routes.route('/<int:comment_id>', methods=['PUT'])
@login_required
def update_comment(comment_id):
    data = request.get_json()
    comment_text = data.get('message')

    if not comment_text or comment_text.strip() == "":
        return {
            "message": "Validation error",
            "errors": { "comment": "Comment text is required" }
        }, 400

    comment = Comment.query.get(comment_id)

    if not comment or comment.user_id != current_user.id:
        return { "message": "Expense couldn't be found or does not belong to the current user" }, 404

    comment.content = comment_text
    comment.updated_at = datetime.utcnow()

    db.session.commit()

    return comment.to_dict(), 200



# Delete a comment
@comment_routes.route('/<int:comment_id>', methods=['DELETE'])
@login_required
def delete_comment(comment_id):
    comment = Comment.query.get(comment_id)

    if not comment or comment.user_id != current_user.id:
        return { "message": "Comment couldn't be found or does not belong to the current user" }, 404

    db.session.delete(comment)
    db.session.commit()

    return { "message": "Successfully deleted" }, 200



# Add a comment
@comment_routes.route('/<int:expense_id>', methods=['POST'])
@login_required
def create_comment(expense_id):
    data = request.get_json()
    content = data.get('content')

    if not content:
        return {'errors': {'content': 'Comment content is required'}}, 400

    comment = Comment(
        expense_id=expense_id,
        user_id=current_user.id,
        content=content
    )

    db.session.add(comment)
    db.session.commit()
    return comment.to_dict()

