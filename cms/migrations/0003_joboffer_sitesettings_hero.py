# Generated migration for Phase 4

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0002_partner_sitesettings_remove_service_icon_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='JobOffer',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=300, verbose_name='Titre du poste')),
                ('slug', models.SlugField(unique=True, verbose_name='Slug')),
                ('description', models.TextField(verbose_name='Description du poste')),
                ('requirements', models.TextField(verbose_name='Exigences')),
                ('benefits', models.TextField(verbose_name='Avantages')),
                ('department', models.CharField(max_length=200, verbose_name='Département')),
                ('location', models.CharField(max_length=200, verbose_name='Localisation')),
                ('contract_type', models.CharField(max_length=100, verbose_name='Type de contrat')),
                ('salary_min', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True, verbose_name='Salaire minimum')),
                ('salary_max', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True, verbose_name='Salaire maximum')),
                ('currency', models.CharField(default='USD', max_length=3, verbose_name='Devise')),
                ('status', models.CharField(choices=[('ouvert', 'Ouvert'), ('fermé', 'Fermé'), ('archivé', 'Archivé')], default='ouvert', max_length=20, verbose_name='Statut')),
                ('deadline', models.DateField(verbose_name='Date limite de candidature')),
                ('is_featured', models.BooleanField(default=False, verbose_name='En vedette')),
                ('order', models.IntegerField(default=0, verbose_name='Ordre')),
                ('posted_date', models.DateTimeField(auto_now_add=True, verbose_name='Date de publication')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Créé le')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Modifié le')),
            ],
            options={
                'verbose_name': "Offre d'emploi",
                'verbose_name_plural': "Offres d'emploi",
                'ordering': ['-posted_date'],
            },
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='hero_background_url',
            field=models.URLField(blank=True, null=True, verbose_name='URL fond héro'),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='hero_video_url',
            field=models.URLField(blank=True, null=True, verbose_name='URL vidéo héro'),
        ),
    ]
