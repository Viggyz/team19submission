from .base import *

import dj_database_url
import psycopg2
import django_on_heroku
from decouple import config

DEBUG = False
SECRET_KEY = config("SECRET_KEY")

ALLOWED_HOSTS = ["*.herokuapp.com"]

DEBUG_PROPAGATE_EXCEPTIONS = True

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
            "datefmt": "%d/%b/%Y %H:%M:%S",
        },
        "simple": {"format": "%(levelname)s %(message)s"},
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "MYAPP": {
            "handlers": ["console"],
            "level": "DEBUG",
        },
    },
}

DATABASES = {
    "default": dj_database_url.config(
        default="sqlite:///db.sqlite3", conn_max_age=600, ssl_require=False
    )
}

WHITENOISE_INDEX_FILE = True
WHITENOISE_ROOT = os.path.join(STATIC_ROOT, 'vue')

django_on_heroku.settings(locals(), staticfiles=True)
del DATABASES["default"]["OPTIONS"]["sslmode"]
