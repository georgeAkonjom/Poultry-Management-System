from django.db import models


# Create your models here.
class BirdBatch(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    batch_name = models.TextField(max_length=200)
    bird_type = models.TextField(max_length=200)
    quantity = models.IntegerField()
    cost_per_bird = models.IntegerField()
    date_in = models.DateField()
    notes = models.TextField()

    @property
    def total_amount(self):
        return self.cost_per_bird * self.quantity


class Expense(models.Model):
    batch_id = models.ForeignKey(BirdBatch, on_delete=models.CASCADE)
    date = models.DateField()
    item = models.TextField(max_length=200)
    cost_per_unit = models.IntegerField()
    quantity = models.IntegerField()
    description = models.TextField(max_length=200)

    @property
    def total_amount(self):
        return self.cost_per_unit * self.quantity


class Sale(models.Model):
    batch_id = models.ForeignKey(BirdBatch, on_delete=models.CASCADE)
    date = models.DateField()
    cost_per_unit = models.IntegerField()
    quantity = models.IntegerField()
    item = models.TextField(max_length=200)

    @property
    def total_amount(self):
        return self.cost_per_unit * self.quantity


class Loss(models.Model):
    batch_id = models.ForeignKey(BirdBatch, on_delete=models.CASCADE)
    cause = models.TextField(max_length=200)
    quantity = models.IntegerField()
    value_loss = models.IntegerField()
    date = models.DateField()
    notes = models.TextField(200)
