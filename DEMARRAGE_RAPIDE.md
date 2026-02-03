# Démarrage Rapide - Nouvelles Fonctionnalités

**Date**: 2026-02-01

---

## 🚀 INSTALLATION EN 5 MINUTES

### Étape 1: Installer les dépendances

```bash
cd mwolo-energy-systems
pip install reportlab
```

### Étape 2: Appliquer les migrations

```bash
python manage.py migrate
```

### Étape 3: Créer les répertoires

```bash
mkdir media\invoices
mkdir media\receipts
mkdir media\payrolls
```

### Étape 4: Tester l'installation

```bash
python test_implementation.py
```

Vous devriez voir:
```
✅ PASS - Champs Paiements Mobiles
✅ PASS - Tâches Celery
✅ PASS - Signaux Django
✅ PASS - Endpoints API
✅ PASS - Répertoires Media
✅ PASS - Génération PDF

RÉSULTAT: 6/6 tests réussis (100%)
🎉 Toutes les fonctionnalités sont opérationnelles!
```

---

## 🎯 UTILISATION RAPIDE

### Générer un PDF de facture

```python
python manage.py shell

from billing.models import Invoice
from billing.pdf_generator import generate_invoice_pdf

# Prendre une facture
invoice = Invoice.objects.first()

# Générer le PDF
filepath = generate_invoice_pdf(invoice)
print(f"PDF: {filepath}")
```

### Tester une tâche Celery

```python
from billing.tasks import generate_invoice_pdf_task

# Lancer la tâche (nécessite Celery worker actif)
task = generate_invoice_pdf_task.delay(str(invoice.id))
print(f"Task ID: {task.id}")
```

### Tester l'API

```bash
# Démarrer le serveur
python manage.py runserver

# Dans un autre terminal, tester l'endpoint agences
curl http://localhost:8000/api/agencies/public_list/
```

---

## 🔧 LANCER CELERY

### Option 1: Manuellement (3 terminaux)

**Terminal 1 - Django**:
```bash
python manage.py runserver
```

**Terminal 2 - Celery Worker**:
```bash
celery -A config worker -l info
```

**Terminal 3 - Celery Beat**:
```bash
celery -A config beat -l info
```

### Option 2: Avec Docker (recommandé)

```bash
docker-compose up -d
```

---

## 📋 CHECKLIST POST-INSTALLATION

- [ ] reportlab installé
- [ ] Migrations appliquées
- [ ] Répertoires media créés
- [ ] Tests passent (6/6)
- [ ] Redis installé/lancé
- [ ] Celery worker lancé
- [ ] Celery beat lancé

---

## 🧪 TESTS RAPIDES

### Test 1: PDF Facture

```bash
python manage.py shell
```

```python
from billing.models import Invoice
from billing.pdf_generator import generate_invoice_pdf

invoice = Invoice.objects.first()
if invoice:
    filepath = generate_invoice_pdf(invoice)
    print(f"✅ PDF généré: {filepath}")
else:
    print("❌ Aucune facture. Créez-en une d'abord.")
```

### Test 2: Champs Mobile Money

```bash
python manage.py shell
```

```python
from billing.models import Payment

# Vérifier les champs
print("mobile_operator" in [f.name for f in Payment._meta.fields])
print("mobile_number" in [f.name for f in Payment._meta.fields])
print("transaction_id" in [f.name for f in Payment._meta.fields])
# Devrait afficher: True, True, True
```

### Test 3: Tâches Celery

```bash
python manage.py shell
```

```python
from billing.tasks import check_unpaid_invoices

# Lancer manuellement
result = check_unpaid_invoices()
print(result)
```

---

## 🐛 PROBLÈMES COURANTS

### Erreur: "No module named 'reportlab'"

**Solution**:
```bash
pip install reportlab
```

### Erreur: "Connection refused" (Celery)

**Solution**: Redis n'est pas lancé
```bash
# Windows
redis-server

# Ou avec Docker
docker run -d -p 6379:6379 redis:alpine
```

### Erreur: "Permission denied" (media/)

**Solution**:
```bash
# Windows
icacls media /grant Everyone:F /T

# Linux/Mac
chmod -R 755 media/
```

### PDF ne se génère pas

**Solution**: Vérifier les répertoires
```bash
python test_implementation.py
```

---

## 📚 DOCUMENTATION

- **Analyse complète**: `ANALYSE_CONFORMITE.md`
- **Actions prioritaires**: `ACTIONS_PRIORITAIRES.md`
- **Implémentation**: `IMPLEMENTATION_COMPLETE.md`
- **Résumé**: `RESUME_ANALYSE.txt`

---

## 🎉 PROCHAINES ÉTAPES

1. ✅ Installation terminée
2. ✅ Tests passent
3. 🔄 Configurer email SMTP
4. 🔄 Tester envoi emails
5. 🔄 Intégrer API paiements mobiles
6. 🔄 Compléter frontend

---

## 💡 ASTUCES

### Générer des données de test

```bash
python manage.py populate_data
```

### Voir les tâches Celery actives

```bash
celery -A config inspect active
```

### Voir les logs Celery

```bash
celery -A config worker -l debug
```

### Purger la queue Celery

```bash
celery -A config purge
```

---

## 📞 SUPPORT

En cas de problème:
1. Vérifier les logs: `python manage.py runserver`
2. Lancer les tests: `python test_implementation.py`
3. Consulter: `IMPLEMENTATION_COMPLETE.md`

---

**Installation terminée! Le système est prêt à l'emploi. 🚀**
