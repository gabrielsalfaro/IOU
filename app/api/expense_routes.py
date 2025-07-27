from flask import Blueprint, request
from flask_login import login_required, current_user
from decimal import Decimal, ROUND_HALF_EVEN, ROUND_HALF_UP
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
    errors['description'] = "Description can not be empty"

  if not data.get('amount'):
    errors['amount'] = "Amount can not be empty"
  else:
      try:
        amount = Decimal(data['amount']).quantize(Decimal('0.00'), rounding=ROUND_HALF_EVEN) #use decimal library (decimal TYPE) to handle amounts
        if amount <= Decimal('0'):
          errors['amount'] = "Amount must be positive"
      except (ValueError, TypeError): #make sure amount is not mixed with other strings, as well as a valid number
        errors['amount'] = "Amount must be a number"

  if not data.get('expense_members'):
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

  total_amount = Decimal(data['amount']).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
  num_members = len(data['expense_members']) + 1 #add one to the length, because we are only passing in the friends and not ourselves yet
  each_amount = (total_amount / num_members).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)

  owner_member = ExpenseMember(
        expense_id=new_expense.id,
        user_id=current_user.id,
        amount_owed=each_amount,
        settled=True #logic is user has already paid for the full expensec
    )

  db.session.add(owner_member)


  for member in data['expense_members']:
    expense_member = ExpenseMember(
      expense_id = new_expense.id,
      user_id = member,
      amount_owed = each_amount,
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

@expense_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_expense(id):
    expense = Expense.query.get(id)
    if not expense:
        return {"errors": {"message": "Expense not found"}}, 404

    if (expense.expense_owner != current_user.id):
        return {"errors": {"message": "Unauthorized"}}, 403

    if expense.status == "settled":
        return {"errors": {"message": "Cannot edit a settled expense"}}, 403

    data = request.json
    errors = {}

    expense_members = ExpenseMember.query.filter_by(expense_id=id).all()
    has_settled_members = any(
        member.settled for member in expense_members
        if member.user_id != expense.expense_owner #don't check for the expense owner since they have already "paid"
    )

    if not isinstance(data.get('description'), str):
        errors['description'] = "Description must be a string"
    elif not data.get('description'):
        errors['description'] = 'Description cannot be empty'
    elif len(data.get('description')) > 30:
        errors['description'] = 'Description must be less than 30 characters'

    if errors:
        return {"errors": errors}, 400

    expense.description = data['description']

    if not has_settled_members and 'amount' in data:
      try:
        new_amount = Decimal(data['amount']).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
        if new_amount <= Decimal('0'):
          errors['amount'] = "Amount must be positive"
        else:
          each_amount = (new_amount / Decimal(len(expense_members))).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
          for member in expense_members:
            member.amount_owed = each_amount
      except (ValueError, TypeError):
        errors['amount'] = "Amount must be a number"

    db.session.commit()

    return {
        "expense": expense.to_dict(),
        "members": [member.to_dict() for member in expense.expense_members]
    }, 200

@expense_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_expense(id):
    expense = Expense.query.get(id)
    if not expense:
      return {"errors": {"message": "Expense not found"}}, 404

    if expense.expense_owner != current_user.id:
      return {"errors": {"message": "Unauthorized: only the expense owner can delete this"}}, 403

    expense_members = ExpenseMember.query.filter_by(expense_id=id).all()

    has_settled_members = False #loop through members to see if anyone has paid, disregard expense owner (they already paid)
    for member in expense_members:
      if member.user_id != expense.expense_owner and member.settled:
        has_settled_members = True
        break

    if has_settled_members:
      return {"errors": {"message": "Cannot delete expense: some payments have already been made"}}, 403

    db.session.delete(expense)
    db.session.commit()

    return {
      "message": "Successfully deleted",
      "id": id
    }, 200
