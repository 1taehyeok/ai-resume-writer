from decouple import config

GROK_API_KEY = config("GROK_API_KEY")

INSTALLED_APPS = [
    "rest_framework",  # REST API용
    "apps.ai",
]