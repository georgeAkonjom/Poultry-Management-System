from django.urls import path

from .views import *

urlpatterns = [
    path("expenses/", ExpenseView.as_view(), name="expenses"),
    path("expenses/<int:pk>/", ExpenseView.as_view(), name="expense_detail"),
    path("losses/", LossView.as_view(), name="losses"),
    path("losses/<int:pk>/", LossView.as_view(), name="loss_detail"),
    path("income/", IncomeView.as_view(), name="income"),
    path("income/<int:pk>/", IncomeView.as_view(), name="income_detail"),
    path("financesummary/", FinanceSummaryView.as_view(), name="losses"),
    path("birdbatches/", BirdBatchView.as_view(), name="bird_batches"),
    path("birdbatches/<int:pk>/", BirdBatchView.as_view(), name="bird_batch_detail"),
    path("health/", health_check),
]
