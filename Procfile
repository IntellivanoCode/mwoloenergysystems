# Mwolo Energy Systems - Procfile for Render/Heroku
web: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --threads 4 --timeout 120
release: python manage.py migrate --no-input && python manage.py collectstatic --no-input
