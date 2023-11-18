from django.http import HttpResponse
from django.db.models import Sum, F, Count
from django.http import JsonResponse
from datetime import datetime, timedelta
from django.utils import timezone
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import Vendedor, Cliente, Produto, Venda, ComissaoBaseadoNoDia, ProdutoVendido
from .serializers import VendedorSerializer, ClienteSerializer, ProdutoSerializer, VendaSerializer,ComissaoBaseadoNoDiaSerializer, ProdutoVendidoSerializer

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

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        # Update specific fields
        instance.cliente = serializer.validated_data.get('cliente', instance.cliente)
        instance.vendedor = serializer.validated_data.get('vendedor', instance.vendedor)
        instance.nota_fiscal = serializer.validated_data.get('nota_fiscal', instance.nota_fiscal)
        instance.datetime = serializer.validated_data.get('datetime', instance.datetime)
        
        instance.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

class ComissaoBaseadoNoDiaViewSet(viewsets.ModelViewSet):
    queryset = ComissaoBaseadoNoDia.objects.all()
    serializer_class = ComissaoBaseadoNoDiaSerializer

class ProdutoVendidoViewSet(viewsets.ModelViewSet):
    queryset = ProdutoVendido.objects.all()
    serializer_class = ProdutoVendidoSerializer



def index(request): 
    return HttpResponse('<h1>Django Include URLs</h1>')



@api_view(['GET'])
def get_vendas_with_produto_details(request):
    
    vendas = Venda.objects.all().order_by('-id')

    venda_details = []
    for venda in vendas:
        produtos_vendidos = ProdutoVendido.objects.filter(venda=venda)
        produtos_details = []
        valor_total = 0
        
        for produto_vendido in produtos_vendidos:
            produto = produto_vendido.produto
            sub_total = produto.valor_unitario * produto_vendido.quantidade  
            valor_total += sub_total
            
            produtos_details.append({
                'id': produto_vendido.id,
                'produto_id': produto.id,
                # 'id': produto.id,
                'codigo': produto.codigo,
                'descricao': produto.descricao,
                'valor_unitario': produto.valor_unitario,
                'percentual_comissao': produto.percentual_comissao,
                'quantidade': produto_vendido.quantidade,
                'comissao_configurada' : produto_vendido.comissao_configurado,
                'comissao_a_receber': produto_vendido.comissao 
            })
                
        venda_details.append({
            'id': venda.id,
            'nota_fiscal': venda.nota_fiscal,
            'datetime': venda.datetime,
            'cliente_id': venda.cliente.id,
            'cliente': venda.cliente.nome,
            'vendedor_id': venda.vendedor.id,
            'vendedor': venda.vendedor.nome,
            'total_compras':valor_total,
            'produtos': produtos_details,
            
            
        })

    return Response(venda_details)

@api_view(['GET'])

def get_comissoes_por_periodo (request):
    start_date_str = request.query_params.get('start_date')
    end_date_str = request.query_params.get('end_date')

    start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()

    # Convert dates to UTC if needed
    start_datetime_utc = timezone.make_aware(datetime.combine(start_date, datetime.min.time()))
    end_datetime_utc = timezone.make_aware(datetime.combine(end_date, datetime.max.time()))

    # Adjust filter to include only records on or after the start date and before the day or after the end date
    sales_within_date_range = Venda.objects.filter(datetime__gte=start_datetime_utc, datetime__lte=end_datetime_utc)
    
    results = (
    Vendedor.objects.filter(venda__in=sales_within_date_range)
    .annotate(
        total_comissao=Sum(F('venda__produtovendido__comissao'), default=0),
        total_venda=Count('venda')
    )
    .values('id', 'nome', 'total_comissao', 'total_venda')
)
    
    return JsonResponse(list(results), safe=False)
    
    



