from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Payment, Expense

payments_routes = Blueprint('payments', __name__)

#Get all payments related to a specific expense
@payments_routes.route('/expenses/<int:expense_id>/payments', methods=['GET'])
@login_required
def get_payments_by_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404

    payments = Payment.query.filter_by(expense_id=expense_id).all()

    return jsonify([{
        'id': payment.id,
        'expense_id': payment.expense_id,
        'payer_id': payment.payer_id,
        'amount': float(payment.amount),
        'status': payment.status,
        'created_at': payment.created_at,
        'updated_at': payment.updated_at
    } for payment in payments]), 200

# Updates payment status (mark as paid)
@payments_routes.route('/payments/<int:payment_id>', methods=['PUT'])
@login_required
def update_payment_status(payment_id):
    payment = Payment.query.get(payment_id)
    if not payment:
        return jsonify({'error': 'Payment not found'}), 404

    if payment.payer_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    payment.status = data.get('status', payment.status)

    db.session.commit()

    return jsonify({
        'id': payment.id,
        'status': payment.status
    }), 200

# Get all payments made by the logged-in user (for Payment History page)
@payments_routes.route('/history', methods=['GET'])
@login_required
def user_payment_history():
    payments = Payment.query.filter_by(payer_id=current_user.id).all()

    result = []
    for payment in payments:
        expense = Expense.query.get(payment.expense_id)
        result.append({
            "id": payment.id,
            "expense_id": expense.id,
            "expense_name": expense.name,
            "expense_description": expense.description,
            "amount": float(payment.amount),
            "status": payment.status,
            "updated_at": payment.updated_at.strftime('%B %Y')  # e.g., "July 2025"
        })

    return jsonify(result), 200
