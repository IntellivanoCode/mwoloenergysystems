# Guide de Sécurité

## Principes de Sécurité

1. **Principle of Least Privilege** - Donner le minimum de permissions nécessaires
2. **Defense in Depth** - Plusieurs couches de sécurité
3. **Fail Secure** - En cas d'erreur, refuser l'accès
4. **Security by Design** - Intégrer la sécurité dès le départ

## Authentification

### JWT (JSON Web Tokens)
- Tokens stateless
- Refresh tokens pour la durée de vie
- Expiration des tokens
- Signature avec clé secrète

### Bonnes Pratiques
```python
# ✅ BON
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
}

# ❌ MAUVAIS
# Tokens sans expiration
# Tokens avec durée de vie trop longue
# Clé secrète faible
```

### 2FA (À implémenter)
```python
# Utiliser django-otp pour 2FA
pip install django-otp qrcode
```

## Autorisation

### RBAC (Role-Based Access Control)
- 8 rôles définis
- Permissions granulaires par module et action
- Vérification à chaque requête

### Bonnes Pratiques
```python
# ✅ BON
class HasModulePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Vérifier les permissions
        return check_permission(request.user, module, action)

# ❌ MAUVAIS
# Pas de vérification des permissions
# Permissions en dur dans le code
# Permissions basées sur le username
```

## Validation

### Validation Serveur
- Toujours valider côté serveur
- Ne pas faire confiance aux données du client
- Utiliser les serializers DRF

### Bonnes Pratiques
```python
# ✅ BON
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['first_name', 'last_name', 'email', 'nif']
    
    def validate_nif(self, value):
        if not value.isdigit() or len(value) != 9:
            raise serializers.ValidationError("NIF invalide")
        return value

# ❌ MAUVAIS
# Pas de validation
# Validation côté client uniquement
# Accepter n'importe quel format
```

## Injection SQL

### Protection
- Utiliser l'ORM Django
- Utiliser les paramètres liés
- Éviter les requêtes brutes

### Bonnes Pratiques
```python
# ✅ BON
clients = Client.objects.filter(last_name=last_name)

# ❌ MAUVAIS
clients = Client.objects.raw(f"SELECT * FROM crm_client WHERE last_name = '{last_name}'")
```

## XSS (Cross-Site Scripting)

### Protection
- Échapper les données HTML
- Utiliser les templates Django
- Content Security Policy

### Bonnes Pratiques
```html
<!-- ✅ BON -->
<p>{{ client.name }}</p>

<!-- ❌ MAUVAIS -->
<p>{{ client.name|safe }}</p>
```

## CSRF (Cross-Site Request Forgery)

### Protection
- Tokens CSRF sur les formulaires
- Vérification des origines
- SameSite cookies

### Configuration
```python
MIDDLEWARE = [
    'django.middleware.csrf.CsrfViewMiddleware',
]

CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Strict'
```

## Sécurité des Mots de Passe

### Hachage
- Utiliser Django's password hashers
- Bcrypt ou Argon2 recommandé
- Jamais stocker en clair

### Bonnes Pratiques
```python
# ✅ BON
from django.contrib.auth.hashers import make_password
password_hash = make_password(password)

# ❌ MAUVAIS
password_hash = password  # Stockage en clair
```

### Politique de Mots de Passe
- Minimum 12 caractères
- Majuscules, minuscules, chiffres, symboles
- Pas de mots courants
- Changement tous les 90 jours

## Gestion des Secrets

### Variables d'Environnement
```bash
# ✅ BON
SECRET_KEY = os.environ.get('SECRET_KEY')

# ❌ MAUVAIS
SECRET_KEY = 'my-secret-key'  # En dur dans le code
```

### Fichier .env
```
# Ne JAMAIS commiter .env
# Ajouter à .gitignore
.env
.env.local
```

### Secrets Manager
- Utiliser AWS Secrets Manager
- Utiliser HashiCorp Vault
- Utiliser Azure Key Vault

## HTTPS/TLS

### Configuration
```nginx
# ✅ BON
server {
    listen 443 ssl http2;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
}

# ❌ MAUVAIS
# HTTP sans SSL
# SSL v3 ou TLS 1.0
# Certificats auto-signés en production
```

### Certificats
- Utiliser Let's Encrypt (gratuit)
- Renouveler automatiquement
- Certificats wildcard pour les sous-domaines

## Audit Logs

### Enregistrement
- Qui a fait quoi
- Quand
- Où (IP)
- Avant/Après (pour les modifications)

### Bonnes Pratiques
```python
# ✅ BON
AuditLog.objects.create(
    user=request.user,
    action='update',
    module='billing',
    object_id=invoice.id,
    object_repr=str(invoice),
    changes={'status': ['brouillon', 'validee']},
    ip_address=get_client_ip(request),
)

# ❌ MAUVAIS
# Pas d'audit logs
# Audit logs incomplets
# Audit logs modifiables
```

## Rate Limiting

### Protection contre les attaques par force brute
```python
# Utiliser django-ratelimit
from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='5/m', method='POST')
def login(request):
    pass
```

### Configuration
```python
# 5 tentatives par minute par IP
# 100 requêtes par heure par utilisateur
```

## CORS

### Configuration
```python
# ✅ BON
CORS_ALLOWED_ORIGINS = [
    'https://your-domain.com',
    'https://www.your-domain.com',
]

# ❌ MAUVAIS
CORS_ALLOW_ALL_ORIGINS = True
```

## Dépendances

### Mises à Jour de Sécurité
```bash
# Vérifier les vulnérabilités
pip install safety
safety check

# Mettre à jour les dépendances
pip install --upgrade -r requirements.txt
```

### Audit des Dépendances
```bash
# Utiliser Snyk
pip install snyk
snyk test
```

## Déploiement Sécurisé

### Checklist
- [ ] DEBUG = False
- [ ] SECRET_KEY unique et fort
- [ ] ALLOWED_HOSTS configuré
- [ ] HTTPS/TLS activé
- [ ] Cookies sécurisés
- [ ] CSRF protection activée
- [ ] CORS configuré correctement
- [ ] Logs configurés
- [ ] Monitoring activé
- [ ] Backups configurés
- [ ] Firewall configuré
- [ ] Fail2ban configuré

### Firewall
```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Fail2ban
```bash
# Protéger contre les attaques par force brute
sudo apt-get install fail2ban
sudo systemctl start fail2ban
```

## Monitoring de Sécurité

### Logs
- Centraliser les logs (ELK)
- Alertes sur les erreurs
- Alertes sur les accès non autorisés

### Intrusion Detection
- Utiliser Snort ou Suricata
- Monitorer les patterns suspects
- Alertes en temps réel

## Incident Response

### Plan d'Action
1. Détecter l'incident
2. Contenir l'incident
3. Éradiquer la menace
4. Récupérer les systèmes
5. Analyser et apprendre

### Contacts d'Urgence
- [ ] Administrateur système
- [ ] Responsable sécurité
- [ ] Responsable légal
- [ ] Responsable communication

## Conformité

### RGPD (Règlement Général sur la Protection des Données)
- Consentement explicite
- Droit à l'oubli
- Portabilité des données
- Notification des violations

### Chiffrement des Données
```python
# Chiffrer les données sensibles
from django_cryptography.fields import encrypt

class Client(models.Model):
    nif = encrypt(models.CharField(max_length=50))
```

## Ressources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Django Security](https://docs.djangoproject.com/en/4.2/topics/security/)
- [Django REST Framework Security](https://www.django-rest-framework.org/topics/security/)

### Outils
- [OWASP ZAP](https://www.zaproxy.org/) - Penetration testing
- [Burp Suite](https://portswigger.net/burp) - Security testing
- [Snyk](https://snyk.io/) - Dependency scanning

### Communautés
- [OWASP](https://owasp.org/)
- [Django Security](https://www.djangoproject.com/weblog/security/)
- [Python Security](https://python.readthedocs.io/en/latest/library/security_warnings.html)

## Checklist de Sécurité

### Avant le Déploiement
- [ ] Audit de sécurité
- [ ] Tests de pénétration
- [ ] Vérification des dépendances
- [ ] Vérification des secrets
- [ ] Vérification des logs
- [ ] Vérification des permissions
- [ ] Vérification des certificats SSL
- [ ] Vérification du firewall
- [ ] Vérification du monitoring
- [ ] Vérification du plan de récupération

### Après le Déploiement
- [ ] Monitoring actif
- [ ] Logs centralisés
- [ ] Alertes configurées
- [ ] Backups testés
- [ ] Plan d'incident prêt
- [ ] Équipe formée
- [ ] Documentation à jour
