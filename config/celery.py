import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('mwolo')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Tâches planifiées
app.conf.beat_schedule = {
    'send-invoice-reminders-j3': {
        'task': 'billing.tasks.send_reminders',
        'schedule': crontab(hour=9, minute=0),
        'args': ('j3',),
    },
    'send-invoice-reminders-j7': {
        'task': 'billing.tasks.send_reminders',
        'schedule': crontab(hour=9, minute=0),
        'args': ('j7',),
    },
    'send-invoice-reminders-j14': {
        'task': 'billing.tasks.send_reminders',
        'schedule': crontab(hour=9, minute=0),
        'args': ('j14',),
    },
}

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
