from rest_framework import serializers
from .models import Invoice, InvoiceLine, Payment


class InvoiceLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceLine
        fields = ['id', 'description', 'quantity', 'unit_price', 'discount', 'total']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id',
            'invoice',
            'reference',
            'amount',
            'method',
            'mobile_operator',
            'mobile_number',
            'transaction_id',
            'status',
            'payment_date',
            'receipt_pdf',
            'created_by',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['reference', 'created_by', 'created_at', 'updated_at']


class InvoiceSerializer(serializers.ModelSerializer):
    lines = InvoiceLineSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    amount_paid = serializers.SerializerMethodField()
    balance = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Invoice
        fields = [
            'id',
            'invoice_number',
            'client',
            'site',
            'period_start',
            'period_end',
            'currency',
            'subtotal',
            'tax_amount',
            'total',
            'status',
            'status_display',
            'pdf_file',
            'lines',
            'payments',
            'amount_paid',
            'balance',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['invoice_number', 'created_at', 'updated_at']

    def get_amount_paid(self, obj):
        return sum(payment.amount for payment in obj.payments.all())

    def get_balance(self, obj):
        return max(obj.total - self.get_amount_paid(obj), 0)
