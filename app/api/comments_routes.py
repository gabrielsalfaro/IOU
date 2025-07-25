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



# Get all comments for an expense
# @comment_routes.route('/expense/<int:expense_id>/comments', methods=['GET'])
# @login_required
# def get_comments(expense_id):
#     expense = Expense.query.get(expense_id)
#     if not expense:
#         return jsonify({ "message": "Expense couldn't be found" }), 404

#     comments = Comment.query.filter_by(expense_id=expense_id).all()

#     return jsonify({
#         "comments": [comment.to_dict() for comment in comments]
#     })


# Create a comment on an expense
# @comment_routes.route('/expense/<int:expense_id>/comments', methods=['POST'])
# @login_required
# def create_comment(expense_id):
#     data = request.get_json()
#     comment_text = data.get('message')

#     if not comment_text or comment_text.strip() == "":
#         return jsonify({
#             "message": "Validation error",
#             "errors": { "comment": "Comment text is required" }
#         }), 400

#     expense = Expense.query.get(expense_id)
#     if not expense:
#         return jsonify({ "message": "Expense couldn't be found" }), 404

#     # Check if the user already has a comment on this expense
#     existing = Comment.query.filter_by(expense_id=expense_id, user_id=current_user.id).first()
#     if existing:
#         return jsonify({ "message": "User already has a comment for this expense" }), 500

#     comment = Comment(
#         user_id=current_user.id,
#         expense_id=expense_id,
#         comment=comment_text,
#         created_at=datetime.utcnow(),
#         updated_at=datetime.utcnow()
#     )

#     db.session.add(comment)
#     db.session.commit()

#     return jsonify({ "comments": comment.to_dict() }), 201
