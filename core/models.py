from django.db import models
import uuid

class SystemParameter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.CharField(max_length=500, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Paramètre système'
        verbose_name_plural = 'Paramètres système'
    
    def __str__(self):
        return self.key


class Document(models.Model):
    DOCUMENT_TYPES = [
        ('contrat', 'Contrat'),
        ('diplome', 'Diplôme'),
        ('id', 'Pièce d\'identité'),
        ('rib', 'RIB'),
        ('autre', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='documents/')
    
    related_object_id = models.CharField(max_length=255)
    related_object_type = models.CharField(max_length=100)
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Document'
        verbose_name_plural = 'Documents'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.get_document_type_display()} - {self.file.name}"
