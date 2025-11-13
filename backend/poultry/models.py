from django.db import models


# Create your models here.
class BirdBatch(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    bird_type = models.TextField(max_length=200)
    quantity = models.IntegerField()
    cost_per_bird = models.IntegerField()
    date_in = models.DateField()
    notes = models.TextField()


class Expense(models.Model):
    batch_id = models.ForeignKey(BirdBatch, on_delete=models.CASCADE)
    expense_type = models.TextField(max_length=200)
    amount = models.IntegerField()
    date = models.DateField()
    description = models.TextField(max_length=200)


class Income(models.Model):
    batch_id = models.ForeignKey(BirdBatch, on_delete=models.CASCADE)
    income_type = models.TextField(max_length=200)
    amount = models.IntegerField()
    date = models.DateField()
    description = models.TextField(max_length=200)


class Loss(models.Model):
    batch_id = models.ForeignKey(BirdBatch, on_delete=models.CASCADE)
    cause = models.TextField(max_length=200)
    quantity = models.IntegerField()
    value_loss = models.IntegerField()
    date = models.DateField()
    notes = models.TextField(200)


class FinanceSummary(models.Model):
    pass
    # Measure total income, total loss, total expenditure, over a timeframe, from period start to period end, where period start and end are variable? mutable? Not clear on the right terminonogy.
