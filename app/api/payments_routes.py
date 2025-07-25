from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Payment, Expense
from datetime import datetime

payments_routes = Blueprint('payments', __name__)

@payments_routes.route('/expenses/<int:expense_id>/payments', methods=['GET'])
@login_required
def get_payments_by_expense(expense_id):
    try:
        expense = Expense.query.get(expense_id)
        if not expense or expense.user_id != current_user.id:
            return jsonify({'error': 'Expense not found or unauthorized'}), 404

        payments = Payment.query.filter_by(expense_id=expense_id).all()
        return jsonify([payment.to_dict() for payment in payments]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payments_routes.route('/<int:payment_id>', methods=['PUT'])
@login_required
def update_payment_status(payment_id):
    try:
        payment = Payment.query.get(payment_id)
        if not payment:
            return jsonify({'error': 'Payment not found'}), 404
        if payment.payer_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403

        data = request.get_json()
        if 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400

        payment.status = data['status']
        payment.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(payment.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@payments_routes.route('/history', methods=['GET'])
@login_required
def user_payment_history():
    try:
        payments = Payment.query.filter_by(payer_id=current_user.id)\
                      .order_by(Payment.updated_at.desc())\
                      .all()
        
        history = []
        for payment in payments:
            expense = Expense.query.get(payment.expense_id)
            history.append({
                "id": payment.id,
                "expense_id": expense.id,
                "expense_name": expense.description,
                "amount": float(payment.amount),
                "status": payment.status,
                "updated_at": payment.updated_at.strftime('%B %Y')
            })
        
        return jsonify(history), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payments_routes.route('/', methods=['GET'])
@login_required
def get_all_payments():
    try:
        payments = Payment.query.filter_by(payer_id=current_user.id)\
                      .order_by(Payment.updated_at.desc())\
                      .all()
        return jsonify([payment.to_dict() for payment in payments]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payments_routes.route('/summary', methods=['GET'])
@login_required
def payment_summary():
    try:
        total_paid = db.session.query(db.func.sum(Payment.amount))\
                      .filter(Payment.payer_id == current_user.id,
                             Payment.status == 'Paid')\
                      .scalar() or 0.0

        total_unpaid = db.session.query(db.func.sum(Payment.amount))\
                        .filter(Payment.payer_id == current_user.id,
                               Payment.status == 'Unpaid')\
                        .scalar() or 0.0

        return jsonify({
            "total_paid": float(total_paid),
            "total_unpaid": float(total_unpaid)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500