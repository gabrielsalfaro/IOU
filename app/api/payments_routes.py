from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Payment, Expense, ExpenseMember

payments_routes = Blueprint('payments', __name__)

# Get all payments for a specific expense (Payments List)
@payments_routes.route('/expenses/<int:expense_id>/payments', methods=['GET'])
@login_required
def get_payments_by_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404

    payments = Payment.query.filter_by(expense_id=expense_id).all()

    return jsonify([
        {
            'id': payment.id,
            'expense_id': payment.expense_id,
            'payer_id': payment.payer_id,
            'amount': float(payment.amount),
            'status': payment.status,
            'created_at': payment.created_at,
            'updated_at': payment.updated_at
        } for payment in payments
    ]), 200

#pay up route
@payments_routes.route('/expenses/<int:expense_id>/pay', methods=['POST'])
@login_required
def pay_up(expense_id):
    expense = Expense.query.get(expense_id)
    if expense is None:
        return {"errors": {"message": "Expense not found"}}, 404

    #get the expensemember details which holds settled value
    #get the actual member from object
    member = ExpenseMember.query.filter_by(expense_id = expense_id, user_id = current_user.id).first()

    #validation
    if member is None:
        return {"errors": {"message": "Member not found in Expense"}}, 404

    if member.settled == True:
        return jsonify({"error": "You have already paid this expense"}), 400

    member.settled = True

    #now we have to recheck if al members of the expense have paid to update the expense status
    all_members = ExpenseMember.query.filter_by(expense_id = expense_id).all()
    if all(member.settled for member in all_members): expense.status = "settled"

    payment_for_expense = Payment(
        expense_id=expense_id,
        payer_id=current_user.id,
        amount=member.amount_owed,
        status="paid"
    )

    db.session.add(payment_for_expense)
    db.session.commit()

    return {
    "payment": payment_for_expense.to_dict(),
    "expense": expense.to_dict(),
    "members": [member.to_dict() for member in expense.expense_members]
    }, 201

# Mark payment as paid (PUT /api/payments/:paymentId)
@payments_routes.route('/payments/<int:payment_id>', methods=['PUT'])
@login_required
def update_payment_status(payment_id):
    payment = Payment.query.get(payment_id)
    if not payment:
        return jsonify({'error': 'Payment not found'}), 404

    if payment.payer_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    new_status = data.get('status')

    if new_status not in ['Paid', 'Unpaid']:
        return jsonify({'error': 'Invalid status'}), 400

    payment.status = new_status
    db.session.commit()

    return jsonify({
        'id': payment.id,
        'status': payment.status
    }), 200


# Get all payments made by the current user (Payment History)
@payments_routes.route('/history', methods=['GET'])
@login_required
def user_payment_history():
    payments = Payment.query.filter_by(payer_id=current_user.id).order_by(Payment.updated_at.desc()).all()

    history = []
    for payment in payments:
        expense = Expense.query.get(payment.expense_id)
        history.append({
            "id": payment.id,
            "expense_id": expense.id,
            "expense_description": expense.description,
            "amount": float(payment.amount),
            "status": payment.status,
            "updated_at": payment.updated_at.strftime('%B %Y')  # e.g., "July 2025"
        })

    return jsonify(history), 200
