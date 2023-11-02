from django.http import HttpResponse
from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import Vendedor, Cliente, Produto, Venda, ComissaoBaseadoNoDia
from .serializers import VendedorSerializer, ClienteSerializer, ProdutoSerializer, VendaSerializer,ComissaoBaseadoNoDiaSerializer

class VendedorViewSet(viewsets.ModelViewSet):
    queryset = Vendedor.objects.all()
    serializer_class = VendedorSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

class VendaViewSet(viewsets.ModelViewSet):
    queryset = Venda.objects.all()
    serializer_class = VendaSerializer

class ComissaoBaseadoNoDiaViewSet(viewsets.ModelViewSet):
    queryset = ComissaoBaseadoNoDia.objects.all()
    serializer_class = ComissaoBaseadoNoDiaSerializer


def index(request): 
    return HttpResponse('<h1>Django Include URLs</h1>')
