from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import VendedorViewSet, ClienteViewSet, ProdutoViewSet, VendaViewSet, ComissaoBaseadoNoDiaViewSet, get_vendas_with_produto_details

router = DefaultRouter()
router.register(r'vendedores', VendedorViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'produtos', ProdutoViewSet)
router.register(r'vendas', VendaViewSet)
router.register(r'configurarcomissao', ComissaoBaseadoNoDiaViewSet)

urlpatterns = [
    path('', views.index, name = 'home'),
    path('listallvendas/', get_vendas_with_produto_details, name='listallvendas'),
    path('', include(router.urls)),
]