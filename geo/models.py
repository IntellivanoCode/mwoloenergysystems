from django.db import models
import uuid

class Country(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, verbose_name="Pays")
    code = models.CharField(max_length=3, unique=True, verbose_name="Code")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Pays'
        verbose_name_plural = 'Pays'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Nationality(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='nationalities', verbose_name="Pays")
    name = models.CharField(max_length=100, verbose_name="Nationalité")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Nationalité'
        verbose_name_plural = 'Nationalités'
        unique_together = ('country', 'name')
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Province(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='provinces', verbose_name="Pays")
    name = models.CharField(max_length=100, verbose_name="Province")
    code = models.CharField(max_length=10, verbose_name="Code")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Province'
        verbose_name_plural = 'Provinces'
        unique_together = ('country', 'code')
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.country.code})"


class Commune(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    province = models.ForeignKey(Province, on_delete=models.CASCADE, related_name='communes', verbose_name="Province")
    name = models.CharField(max_length=100, verbose_name="Commune")
    code = models.CharField(max_length=10, verbose_name="Code")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Commune'
        verbose_name_plural = 'Communes'
        unique_together = ('province', 'code')
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.province.name})"


class Territory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    commune = models.ForeignKey(Commune, on_delete=models.CASCADE, related_name='territories', verbose_name="Commune")
    name = models.CharField(max_length=100, verbose_name="Territoire")
    code = models.CharField(max_length=10, verbose_name="Code")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Territoire'
        verbose_name_plural = 'Territoires'
        unique_together = ('commune', 'code')
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.commune.name})"
