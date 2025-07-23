from flask import Blueprint, jsonify, request
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
  return {"expenses": [expense.to_dict() for expense in all_expenses]}, 200

#get specific expense
@expense_routes.route('/<int:id>')
@login_required
def get_expense(id):
  expense = Expense.query.get(id)
  if expense is None:
    return {"errors": {"message": "Expense not found"}}, 404

  #add check if current user is authorized to view expense

  #get all members as list
  expense_members = ExpenseMember.query.filter_by(expense_id=id).all()

  #return expense and expense members detail
  return {
    "expense": expense.to_dict(),
    "members": [member.to_dict() for member in expense_members]
  }, 200

#create an expense (check if friends, happens in first step of expense modal?)
@expense_routes.route('/', methods=['POST'])
@login_required
def create_expense():
  #need a description, expense owner, status, amount from modal
  data = request.json

  errors = {}
  #check for empty data and incorrect types
  if not isinstance(data.get('description'), str):
    errors['description'] = "Description must be a string"
  elif not data.get('description'):
    errors['description'] = 'Description can not be empty'

  if not isinstance(data.get('amount'), (float)):
    errors['amount'] = "Amount must be a number"
  elif not data.get('amount'):
    errors['amount'] = 'Amount can not be empty'

  if not isinstance(data.get('expense_members'), list):
    errors['espense_members'] = "Expense Members must be a list" #do we need this?
  elif not data.get('expense_members'):
    errors['espense_members'] = 'Expense Members can not be empty'

  if errors:
    return {"errors": errors}, 400

  #create new expense
  new_expense = Expense(
    description = data['description'],
    expense_owner = current_user.id,
    status = 'pending'
  )

  db.session.add(new_expense)
  db.session.flush() # Accessing Generated Primary Keys after adding, need so we can add expense member amounts

  each_amount_owed = float(data['amount']/ (len(data['expense_members'])))

  for member in data['expense_members']:
    expense_member = ExpenseMember(
      expense_id = new_expense.id,
      user_id = member,
      amount_owed = each_amount_owed,
      settled = False
    )
    db.session.add(expense_member)

  db.session.commit()

  return {
    "expense": new_expense.to_dict(),
    "members": [member.to_dict() for member in new_expense.expense_members]
    }, 201


#update an expense (only if the expense has not yet been fully paid)
#delete an expense (only if no one has paid)
