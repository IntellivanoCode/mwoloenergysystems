from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.http import FileResponse
from .models import Invoice, Payment
from .serializers import InvoiceSerializer, PaymentSerializer
from .pdf_generator import generate_invoice_pdf, generate_receipt_pdf
from .tasks import generate_invoice_pdf_task, generate_receipt_pdf_task
import os

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['client', 'status']
    search_fields = ['invoice_number', 'client__last_name']
    ordering_fields = ['created_at', 'total']
    
    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        """Générer et télécharger le PDF de la facture"""
        invoice = self.get_object()
        
        # Générer le PDF si pas déjà fait
        if not invoice.pdf_file or not os.path.exists(invoice.pdf_file.path):
            try:
                filepath = generate_invoice_pdf(invoice)
                invoice.pdf_file = filepath
                invoice.save()
            except Exception as e:
                return Response(
                    {'error': f'Erreur lors de la génération du PDF: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        # Retourner le fichier
        try:
            return FileResponse(
                open(invoice.pdf_file.path, 'rb'),
                content_type='application/pdf',
                as_attachment=True,
                filename=f"facture_{invoice.invoice_number}.pdf"
            )
        except Exception as e:
            return Response(
                {'error': f'Erreur lors de la lecture du PDF: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def generate_pdf_async(self, request, pk=None):
        """Générer le PDF de la facture de manière asynchrone"""
        invoice = self.get_object()
        
        # Lancer la tâche Celery
        task = generate_invoice_pdf_task.delay(str(invoice.id))
        
        return Response({
            'message': 'Génération du PDF en cours',
            'task_id': task.id
        })
    
    @action(detail=True, methods=['post'])
    def validate(self, request, pk=None):
        """Valider une facture"""
        invoice = self.get_object()
        
        if invoice.status != 'brouillon':
            return Response(
                {'error': 'Seules les factures en brouillon peuvent être validées'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        invoice.status = 'validee'
        invoice.save()
        
        # Générer le PDF automatiquement
        generate_invoice_pdf_task.delay(str(invoice.id))
        
        serializer = self.get_serializer(invoice)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        """Envoyer une facture au client"""
        invoice = self.get_object()
        
        if invoice.status not in ['validee', 'envoyee']:
            return Response(
                {'error': 'La facture doit être validée avant envoi'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        invoice.status = 'envoyee'
        invoice.save()
        
        # TODO: Envoyer par email
        
        serializer = self.get_serializer(invoice)
        return Response(serializer.data)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['invoice', 'status', 'method']
    ordering_fields = ['payment_date', 'created_at']
    
    @action(detail=True, methods=['get'])
    def receipt(self, request, pk=None):
        """Télécharger le reçu de paiement"""
        payment = self.get_object()
        
        # Générer le reçu si pas déjà fait
        if not payment.receipt_pdf or not os.path.exists(payment.receipt_pdf.path):
            try:
                filepath = generate_receipt_pdf(payment)
                payment.receipt_pdf = filepath
                payment.save()
            except Exception as e:
                return Response(
                    {'error': f'Erreur lors de la génération du reçu: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        # Retourner le fichier
        try:
            return FileResponse(
                open(payment.receipt_pdf.path, 'rb'),
                content_type='application/pdf',
                as_attachment=True,
                filename=f"recu_{payment.reference}.pdf"
            )
        except Exception as e:
            return Response(
                {'error': f'Erreur lors de la lecture du reçu: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirmer un paiement"""
        payment = self.get_object()
        
        if payment.status != 'pending':
            return Response(
                {'error': 'Seuls les paiements en attente peuvent être confirmés'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        payment.status = 'confirmed'
        payment.save()
        
        # Le signal va automatiquement générer le reçu et réactiver le service
        
        serializer = self.get_serializer(payment)
        return Response(serializer.data)
