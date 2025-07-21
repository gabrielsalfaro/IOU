from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Payment, Expense

payments_routes = Blueprint('payments', __name__)

# this endpoint returns all payments related to a specific expense
@payments_routes.route('/expenses/<int:expense_id>/payments', methods=['GET'])
@login_required
def get_payments_by_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    is_member = any(member.user_id == current_user.id for member in expense.members)
    if not is_member:
        return jsonify({"error": "Unauthorized"}), 403

    payments = Payment.query.filter_by(expense_id=expense_id).all()
    payments_data = []
    for payment in payments:
        payments_data.append({
            "id": payment.id,
            "amount": payment.amount,
            "payer_id": payment.payer_id,
            "payee_id": payment.payee_id,
            "status": payment.status,
            "created_at": payment.created_at.isoformat()
        })
    return jsonify(payments_data), 200


# this endpoint allows a user to create a new payment under an expense
@payments_routes.route('/expenses/<int:expense_id>/payments', methods=['POST'])
@login_required
def create_payment(expense_id):
    data = request.get_json()
    amount = data.get('amount')
    payee_id = data.get('payee_id')

    if amount is None or type(amount) not in [int, float] or amount <= 0:
        return jsonify({"error": "Invalid or missing amount"}), 400

    expense = Expense.query.get(expense_id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    is_member = any(member.user_id == current_user.id for member in expense.members)
    if not is_member:
        return jsonify({"error": "Unauthorized"}), 403

    if payee_id is None or not any(member.user_id == payee_id for member in expense.members):
        return jsonify({"error": "Invalid payee"}), 400

    new_payment = Payment(
        amount=amount,
        payer_id=current_user.id,
        payee_id=payee_id,
        expense_id=expense_id,
        status='unpaid',
    )

    db.session.add(new_payment)
    db.session.commit()

    return jsonify({
        "id": new_payment.id,
        "amount": new_payment.amount,
        "payer_id": new_payment.payer_id,
        "payee_id": new_payment.payee_id,
        "status": new_payment.status,
        "created_at": new_payment.created_at.isoformat()
    }), 201


# this endpoint lets a user update a payment status (paid/unpaid)
@payments_routes.route('/payments/<int:payment_id>', methods=['PUT'])
@login_required
def update_payment_status(payment_id):
    payment = Payment.query.get(payment_id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404

    expense = Expense.query.get(payment.expense_id)
    if not expense:
        return jsonify({"error": "Associated expense not found"}), 404

    if current_user.id not in [payment.payer_id, payment.payee_id]:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    status = data.get('status')
    if status not in ['paid', 'unpaid']:
        return jsonify({"error": "Invalid status value"}), 400

    payment.status = status
    db.session.commit()

    return jsonify({
        "id": payment.id,
        "status": payment.status,
    }), 200


# this endpoint allows deleting a payment by id
@payments_routes.route('/payments/<int:payment_id>', methods=['DELETE'])
@login_required
def delete_payment(payment_id):
    payment = Payment.query.get(payment_id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404

    if current_user.id != payment.payer_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(payment)
    db.session.commit()

    return jsonify({"message": "Payment deleted successfully"}), 200
