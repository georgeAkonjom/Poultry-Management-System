from django.contrib import admin

from .models import *

# Register your models here.
admin.site.register(
    BirdBatch,
)

admin.site.register(
    Income,
)

admin.site.register(
    Loss,
)

admin.site.register(
    Expense,
)

admin.site.register(
    FinanceSummary,
)
