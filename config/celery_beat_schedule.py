"""
Configuration des tâches périodiques Celery Beat
"""
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    # Vérifier les factures impayées tous les jours à 9h
    'check-unpaid-invoices-daily': {
        'task': 'billing.tasks.check_unpaid_invoices',
        'schedule': crontab(hour=9, minute=0),
        'options': {
            'expires': 3600,  # Expire après 1 heure
        }
    },
    
    # Vérifier les factures impayées toutes les 6 heures (optionnel)
    'check-unpaid-invoices-periodic': {
        'task': 'billing.tasks.check_unpaid_invoices',
        'schedule': crontab(minute=0, hour='*/6'),  # Toutes les 6 heures
        'options': {
            'expires': 3600,
        }
    },
}
