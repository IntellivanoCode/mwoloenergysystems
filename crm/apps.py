from django.apps import AppConfig


class CrmConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'crm'
    verbose_name = 'CRM'

    def ready(self):
        # Import signals to register them
        from . import signals  # noqa: F401
