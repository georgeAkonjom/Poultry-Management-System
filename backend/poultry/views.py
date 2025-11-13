from django.http import JsonResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import BirdBatch, Expense, Income, Loss
from .serializers import *


@method_decorator(csrf_exempt, name="dispatch")
class BirdBatchView(APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                batch = BirdBatch.objects.get(pk=pk)
                serializer = BirdBatchSerializer(batch)
                return Response(serializer.data)
            except BirdBatch.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            batches = BirdBatch.objects.all()
            serializer = BirdBatchSerializer(batches, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = BirdBatchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, pk):
        try:
            batch = BirdBatch.objects.get(pk=pk)
        except BirdBatch.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = BirdBatchSerializer(batch, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            batch = BirdBatch.objects.get(pk=pk)
        except BirdBatch.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        batch.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name="dispatch")
class ExpenseView(APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                expense = Expense.objects.get(pk=pk)
                serializer = ExpenseSerializer(expense)
                return Response(serializer.data)
            except Expense.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            expenses = Expense.objects.all()
            serializer = ExpenseSerializer(expenses, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, pk):
        try:
            expense = Expense.objects.get(pk=pk)
        except Expense.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ExpenseSerializer(expense, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            expense = Expense.objects.get(pk=pk)
        except Expense.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        expense.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name="dispatch")
class LossView(APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                loss = Loss.objects.get(pk=pk)
                serializer = LossSerializer(loss)
                return Response(serializer.data)
            except Loss.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            losses = Loss.objects.all()
            serializer = LossSerializer(losses, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = LossSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, pk):
        try:
            loss = Loss.objects.get(pk=pk)
        except Loss.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = LossSerializer(loss, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            loss = Loss.objects.get(pk=pk)
        except Loss.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        loss.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name="dispatch")
class IncomeView(APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                income = Income.objects.get(pk=pk)
                serializer = IncomeSerializer(income)
                return Response(serializer.data)
            except Income.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            incomes = Income.objects.all()
            serializer = IncomeSerializer(incomes, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = IncomeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, pk):
        try:
            income = Income.objects.get(pk=pk)
        except Income.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = IncomeSerializer(income, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            income = Income.objects.get(pk=pk)
        except Income.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        income.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name="dispatch")
class FinanceSummaryView(APIView):
    def post(self, request):
        serializer = FinanceSummarySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


def health_check(request):
    return JsonResponse({"status": "ok"})
