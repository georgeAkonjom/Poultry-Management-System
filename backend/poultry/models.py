from django.db import models


# Create your models here.
class BirdBatches(models.Model):
    id = models.IntegerField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    bird_type = models.TextField(max_length=200)
    quantity = models.IntegerField()
    cost_per_bird = models.IntegerField()
    date_in = models.DateField()
    notes = models.CharField()


class Expenses(models.Model):
    id = models.IntegerField(primary_key=True)
    batch_id = models.ForeignKey(BirdBatches, on_delete=models.CASCADE)
    expense_type = models.TextField(max_length=200)
    amount = models.IntegerField()
    date = models.DateField()
    description = models.TextField(max_length=200)


class Income(models.Model):
    id = models.IntegerField(primary_key=True)
    batch_id = models.ForeignKey(BirdBatches, on_delete=models.CASCADE)
    income_type = models.TextField(max_length=200)
    amount = models.IntegerField()
    date = models.DateField()
    description = models.TextField(max_length=200)


class Losses(models.Model):
    id = models.IntegerField(primary_key=True)
    batch_id = models.ForeignKey(BirdBatches, on_delete=models.CASCADE)
    cause = models.TextField(max_length=200)
    quantity = models.IntegerField()
    value_loss = models.IntegerField()
    date = models.DateField()
    notes = models.TextField(200)


class FinanceSummary(models.Model):
    pass
    # Measure total income, total loss, total expenditure, over a timeframe, from period start to period end.
