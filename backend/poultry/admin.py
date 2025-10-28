from django.contrib import admin

from .models import *

# Register your models here.
admin.site.register(
    BirdBatches,
)

admin.site.register(
    Income,
)

admin.site.register(
    Losses,
)

admin.site.register(
    Expenses,
)

admin.site.register(
    FinanceSummary,
)
