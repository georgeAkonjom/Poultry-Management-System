from rest_framework import fields, serializers

from .models import *


class BirdBatchSerializer(serializers.ModelSerializer):
    total_amount = serializers.ReadOnlyField()

    class Meta:
        model = BirdBatch
        fields = "__all__"


class ExpenseSerializer(serializers.ModelSerializer):
    total_amount = serializers.ReadOnlyField()

    class Meta:
        model = Expense
        fields = "__all__"


class SaleSerializer(serializers.ModelSerializer):
    total_amount = serializers.ReadOnlyField()

    class Meta:
        model = Sale
        fields = "__all__"


class LossSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loss
        fields = "__all__"


class FinanceSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = FinanceSummary
        fields = "__all__"
