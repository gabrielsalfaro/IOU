from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import db, Expense, ExpenseMember

expense_routes = Blueprint('expenses', __name__)

#show all expenses for the current user
@expense_routes.route('/')
@login_required
def get_user_expenses():
    #filter for owned expenses
    owned_expenses = Expense.query.filter(Expense.expense_owner == current_user.id).all()
    #filter for expenses where the current user is a expense member
    #SQL JOIN with expense members table, return list
    expense_member = Expense.query.join(ExpenseMember).filter(ExpenseMember.user_id == current_user.id).all()

    #turn into set which only stores unique values, return unique set of expenses user is a part of (duplicates are removed since user can be owner & expense member)
    all_expenses = set(owned_expenses + expense_member)
    return {"expenses": [expense.to_dict() for expense in all_expenses]}
