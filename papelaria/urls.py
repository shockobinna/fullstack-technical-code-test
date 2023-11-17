from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import VendedorViewSet, ClienteViewSet, ProdutoViewSet, ProdutoVendidoViewSet, VendaViewSet, ComissaoBaseadoNoDiaViewSet, get_vendas_with_produto_details, get_comissoes_por_periodo

router = DefaultRouter()
router.register(r'vendedores', VendedorViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'produtos', ProdutoViewSet)
router.register(r'vendas', VendaViewSet)
router.register(r'configurarcomissao', ComissaoBaseadoNoDiaViewSet)
router.register(r'produtosvendidos', ProdutoVendidoViewSet)

urlpatterns = [
    path('', views.index, name = 'home'),
    path('listallvendas/', get_vendas_with_produto_details, name='listallvendas'),
    path('listcomissoes/', get_comissoes_por_periodo, name = 'listcomissoes'),
    path('', include(router.urls)),
]