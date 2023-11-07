from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import Vendedor, Cliente, Produto, Venda, ComissaoBaseadoNoDia, ProdutoVendido
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



@api_view(['GET'])
def get_vendas_with_produto_details(request):
    
    vendas = Venda.objects.all()

    venda_details = []
    for venda in vendas:
        produtos_vendidos = ProdutoVendido.objects.filter(venda=venda)
        produtos_details = []

        for produto_vendido in produtos_vendidos:
            produto = produto_vendido.produto
            produtos_details.append({
                'codigo': produto.codigo,
                'descricao': produto.descricao,
                'valor_unitario': produto.valor_unitario,
                'percentual_comissao': produto.percentual_comissao,
                'quantidade': produto_vendido.quantidade,
                'comissao_a_receber': produto_vendido.comissao 
            })

        venda_details.append({
            'nota_fiscal': venda.nota_fiscal,
            'datetime': venda.datetime,
            'cliente': venda.cliente.nome,
            'vendedor': venda.vendedor.nome,
            'produtos': produtos_details
        })

    return Response(venda_details)

