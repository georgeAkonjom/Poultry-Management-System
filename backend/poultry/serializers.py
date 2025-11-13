from rest_framework import fields, serializers

from .models import *


class BirdBatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = BirdBatch
        fields = "__all__"


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = "__all__"


class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = "__all__"


class LossSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loss
        fields = "__all__"


class FinanceSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = FinanceSummary
        fields = "__all__"
