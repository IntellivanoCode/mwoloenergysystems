"""
Générateur de PDF pour factures et reçus
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from django.conf import settings
import os
from datetime import datetime


def generate_invoice_pdf(invoice):
    """Générer le PDF d'une facture"""
    filename = f"invoice_{invoice.invoice_number}.pdf"
    filepath = os.path.join(settings.MEDIA_ROOT, 'invoices', filename)
    
    # Créer le répertoire si nécessaire
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    # Créer le document
    doc = SimpleDocTemplate(filepath, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    
    # Style personnalisé pour le titre
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1a5490'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    # En-tête
    elements.append(Paragraph("MWOLO ENERGY SYSTEMS", title_style))
    elements.append(Spacer(1, 0.3*cm))
    elements.append(Paragraph(f"<b>FACTURE N°: {invoice.invoice_number}</b>", styles['Heading2']))
    elements.append(Spacer(1, 0.5*cm))
    
    # Informations client et facture
    info_data = [
        ['<b>Client:</b>', f"{invoice.client.first_name} {invoice.client.last_name}"],
        ['<b>Email:</b>', invoice.client.email],
        ['<b>Téléphone:</b>', invoice.client.phone],
        ['<b>Adresse:</b>', invoice.client.address[:50] + '...' if len(invoice.client.address) > 50 else invoice.client.address],
        ['', ''],
        ['<b>Période:</b>', f"{invoice.period_start} au {invoice.period_end}"],
        ['<b>Date émission:</b>', invoice.created_at.strftime('%d/%m/%Y')],
        ['<b>Statut:</b>', invoice.get_status_display()],
    ]
    
    if invoice.site:
        info_data.insert(4, ['<b>Site:</b>', invoice.site.name])
    
    info_table = Table(info_data, colWidths=[4*cm, 12*cm])
    info_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 1*cm))
    
    # Tableau des lignes de facture
    data = [['Description', 'Qté', 'Prix Unit.', 'Remise', 'Total']]
    
    for line in invoice.lines.all():
        data.append([
            Paragraph(line.description, styles['Normal']),
            str(line.quantity),
            f"{line.unit_price} {invoice.currency}",
            f"{line.discount} {invoice.currency}",
            f"{line.total} {invoice.currency}"
        ])
    
    # Ligne vide
    data.append(['', '', '', '', ''])
    
    # Totaux
    data.append(['', '', '', '<b>Sous-total:</b>', f"<b>{invoice.subtotal} {invoice.currency}</b>"])
    data.append(['', '', '', '<b>Taxes:</b>', f"<b>{invoice.tax_amount} {invoice.currency}</b>"])
    data.append(['', '', '', '<b>TOTAL:</b>', f"<b>{invoice.total} {invoice.currency}</b>"])
    
    table = Table(data, colWidths=[8*cm, 2*cm, 3*cm, 3*cm, 3*cm])
    table.setStyle(TableStyle([
        # En-tête
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        
        # Corps
        ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 1), (-1, -4), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -4), 1, colors.grey),
        
        # Totaux
        ('ALIGN', (3, -3), (3, -1), 'RIGHT'),
        ('ALIGN', (4, -3), (4, -1), 'RIGHT'),
        ('FONTNAME', (3, -3), (-1, -1), 'Helvetica-Bold'),
        ('LINEABOVE', (3, -3), (-1, -3), 2, colors.black),
        ('LINEABOVE', (3, -1), (-1, -1), 2, colors.black),
    ]))
    
    elements.append(table)
    elements.append(Spacer(1, 2*cm))
    
    # Pied de page
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.grey,
        alignment=TA_CENTER
    )
    
    elements.append(Paragraph(
        "Merci de votre confiance | Mwolo Energy Systems",
        footer_style
    ))
    elements.append(Paragraph(
        f"Document généré le {datetime.now().strftime('%d/%m/%Y à %H:%M')}",
        footer_style
    ))
    
    # Construire le PDF
    doc.build(elements)
    
    return filepath


def generate_receipt_pdf(payment):
    """Générer le PDF d'un reçu de paiement"""
    filename = f"receipt_{payment.reference}.pdf"
    filepath = os.path.join(settings.MEDIA_ROOT, 'receipts', filename)
    
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    doc = SimpleDocTemplate(filepath, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    
    # Style personnalisé
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1a5490'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    # En-tête
    elements.append(Paragraph("MWOLO ENERGY SYSTEMS", title_style))
    elements.append(Spacer(1, 0.3*cm))
    elements.append(Paragraph("<b>REÇU DE PAIEMENT</b>", styles['Heading2']))
    elements.append(Spacer(1, 1*cm))
    
    # Informations paiement
    payment_data = [
        ['<b>Référence:</b>', payment.reference],
        ['<b>Facture:</b>', payment.invoice.invoice_number],
        ['<b>Client:</b>', f"{payment.invoice.client.first_name} {payment.invoice.client.last_name}"],
        ['<b>Montant:</b>', f"{payment.amount} {payment.invoice.currency}"],
        ['<b>Méthode:</b>', payment.get_method_display()],
        ['<b>Date:</b>', payment.payment_date.strftime('%d/%m/%Y')],
        ['<b>Statut:</b>', payment.get_status_display()],
    ]
    
    # Ajouter infos mobile money si applicable
    if payment.method == 'mobile_money' and payment.mobile_operator:
        payment_data.append(['<b>Opérateur:</b>', payment.get_mobile_operator_display()])
        if payment.mobile_number:
            payment_data.append(['<b>Numéro:</b>', payment.mobile_number])
        if payment.transaction_id:
            payment_data.append(['<b>Transaction ID:</b>', payment.transaction_id])
    
    payment_table = Table(payment_data, colWidths=[5*cm, 11*cm])
    payment_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
        ('PADDING', (0, 0), (-1, -1), 10),
    ]))
    
    elements.append(payment_table)
    elements.append(Spacer(1, 2*cm))
    
    # Message de confirmation
    if payment.status == 'confirmed':
        confirmation_style = ParagraphStyle(
            'Confirmation',
            parent=styles['Normal'],
            fontSize=14,
            textColor=colors.green,
            alignment=TA_CENTER,
            spaceAfter=20
        )
        elements.append(Paragraph("✓ PAIEMENT CONFIRMÉ", confirmation_style))
    
    # Pied de page
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.grey,
        alignment=TA_CENTER
    )
    
    elements.append(Spacer(1, 1*cm))
    elements.append(Paragraph(
        "Ce reçu certifie le paiement effectué",
        footer_style
    ))
    elements.append(Paragraph(
        "Merci de votre confiance | Mwolo Energy Systems",
        footer_style
    ))
    elements.append(Paragraph(
        f"Document généré le {datetime.now().strftime('%d/%m/%Y à %H:%M')}",
        footer_style
    ))
    
    doc.build(elements)
    
    return filepath


def generate_payroll_pdf(payroll):
    """Générer le PDF d'un bulletin de paie"""
    filename = f"payroll_{payroll.employee.employee_number}_{payroll.month.strftime('%Y%m')}.pdf"
    filepath = os.path.join(settings.MEDIA_ROOT, 'payrolls', filename)
    
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    doc = SimpleDocTemplate(filepath, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    
    # Style personnalisé
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1a5490'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    # En-tête
    elements.append(Paragraph("MWOLO ENERGY SYSTEMS", title_style))
    elements.append(Spacer(1, 0.3*cm))
    elements.append(Paragraph("<b>BULLETIN DE PAIE</b>", styles['Heading2']))
    elements.append(Spacer(1, 0.5*cm))
    elements.append(Paragraph(
        f"<b>Période: {payroll.month.strftime('%B %Y')}</b>",
        styles['Heading3']
    ))
    elements.append(Spacer(1, 1*cm))
    
    # Informations employé
    employee_data = [
        ['<b>INFORMATIONS EMPLOYÉ</b>', ''],
        ['Nom complet:', f"{payroll.employee.first_name} {payroll.employee.last_name}"],
        ['Matricule:', payroll.employee.employee_number],
        ['Poste:', payroll.employee.position],
        ['Département:', payroll.employee.department],
        ['Agence:', payroll.employee.agency.name],
    ]
    
    employee_table = Table(employee_data, colWidths=[5*cm, 11*cm])
    employee_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('PADDING', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('BACKGROUND', (0, 1), (0, -1), colors.lightgrey),
    ]))
    
    elements.append(employee_table)
    elements.append(Spacer(1, 1*cm))
    
    # Détails de paie
    payroll_data = [
        ['<b>DÉTAILS DE PAIE</b>', ''],
        ['Salaire de base:', f"{payroll.base_salary} USD"],
        ['Primes:', f"{payroll.bonuses} USD"],
        ['Retenues:', f"- {payroll.deductions} USD"],
        ['', ''],
        ['<b>SALAIRE NET:</b>', f"<b>{payroll.net_salary} USD</b>"],
    ]
    
    payroll_table = Table(payroll_data, colWidths=[10*cm, 6*cm])
    payroll_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('PADDING', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -2), 1, colors.grey),
        ('BACKGROUND', (0, 1), (0, -2), colors.lightgrey),
        ('ALIGN', (1, 1), (1, -1), 'RIGHT'),
        ('LINEABOVE', (0, -1), (-1, -1), 2, colors.black),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, -1), (-1, -1), 14),
        ('BACKGROUND', (0, -1), (-1, -1), colors.lightgreen),
    ]))
    
    elements.append(payroll_table)
    elements.append(Spacer(1, 2*cm))
    
    # Note confidentielle
    confidential_style = ParagraphStyle(
        'Confidential',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.red,
        alignment=TA_CENTER
    )
    elements.append(Paragraph(
        "<b>DOCUMENT CONFIDENTIEL</b>",
        confidential_style
    ))
    
    # Pied de page
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.grey,
        alignment=TA_CENTER
    )
    
    elements.append(Spacer(1, 0.5*cm))
    elements.append(Paragraph(
        "Mwolo Energy Systems - Service des Ressources Humaines",
        footer_style
    ))
    elements.append(Paragraph(
        f"Document généré le {datetime.now().strftime('%d/%m/%Y à %H:%M')}",
        footer_style
    ))
    
    doc.build(elements)
    
    return filepath
