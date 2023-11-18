from django.test import TestCase
from django.test import override_settings
from rest_framework.test import APITestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from django.utils.crypto import get_random_string
from .models import ComissaoBaseadoNoDia, Produto, Venda, Cliente, Vendedor, ProdutoVendido

class ModelsTestCase(TestCase):
    def setUp(self):
        # Create test data for the models
        self.produto = Produto.objects.create(codigo='123', descricao='Test Product', valor_unitario=10.0, percentual_comissao=5.0)
        self.cliente = Cliente.objects.create(nome='Test Client', email='client@example.com', telefone='123456789')
        self.vendedor = Vendedor.objects.create(nome='Test Seller', email='seller@example.com', telefone='987654321')
        self.venda = Venda.objects.create(nota_fiscal='ABC123', datetime='2023-01-01T12:00:00Z', cliente=self.cliente, vendedor=self.vendedor)
        self.produto_vendido = ProdutoVendido.objects.create(venda=self.venda, produto=self.produto, quantidade=2)

    def test_comissao_baseado_no_dia_creation(self):
        comissao = ComissaoBaseadoNoDia.objects.create(
            dia_da_semana='Monday',
            produto=self.produto,
            min_comissao=5.0,
            max_comissao=10.0
        )
        self.assertEqual(comissao.dia_da_semana, 'Monday')
        self.assertEqual(comissao.produto, self.produto)
        self.assertEqual(comissao.min_comissao, 5.0)
        self.assertEqual(comissao.max_comissao, 10.0)

    def test_produto_creation(self):
        self.assertEqual(self.produto.codigo, '123')
        self.assertEqual(self.produto.descricao, 'Test Product')
        self.assertEqual(self.produto.valor_unitario, 10.0)
        self.assertEqual(self.produto.percentual_comissao, 5.0)

    def test_venda_creation(self):
        self.assertEqual(self.venda.nota_fiscal, 'ABC123')
        self.assertEqual(self.venda.datetime, '2023-01-01T12:00:00Z')
        self.assertEqual(self.venda.cliente, self.cliente)
        self.assertEqual(self.venda.vendedor, self.vendedor)

    def test_cliente_creation(self):
        self.assertEqual(self.cliente.nome, 'Test Client')
        self.assertEqual(self.cliente.email, 'client@example.com')
        self.assertEqual(self.cliente.telefone, '123456789')

    def test_vendedor_creation(self):
        self.assertEqual(self.vendedor.nome, 'Test Seller')
        self.assertEqual(self.vendedor.email, 'seller@example.com')
        self.assertEqual(self.vendedor.telefone, '987654321')

    def test_produto_vendido_creation(self):
        self.assertEqual(self.produto_vendido.venda, self.venda)
        self.assertEqual(self.produto_vendido.produto, self.produto)
        self.assertEqual(self.produto_vendido.quantidade, 2)


class VendaAPITestCase(APITestCase):
    @override_settings(TIME_ZONE='UTC')
    def setUp(self):
        # Create test data for the models
        self.vendedor = Vendedor.objects.create(nome='Test Seller', email='seller@example.com', telefone='987654321')
        self.cliente = Cliente.objects.create(nome='Test Client', email='client@example.com', telefone='123456789')
        self.new_cliente = Cliente.objects.create(nome='Test new Client', email='newclient@example.com', telefone='0923456789')
        self.produto = Produto.objects.create(codigo='123', descricao='Test Product', valor_unitario=10.0, percentual_comissao=5.0)
        self.comissao_dia = ComissaoBaseadoNoDia.objects.create(
            dia_da_semana='Monday',
            produto=self.produto,
            min_comissao=2.0,
            max_comissao=7.0
        )

        # Create a Venda object for testing
        self.venda = Venda.objects.create(
            nota_fiscal='NF' + get_random_string(length=8),
            datetime='2023-01-01T12:00:00Z',
            cliente=self.cliente,
            vendedor=self.vendedor
        )

        # Create a ProdutoVendido object associated with the Venda
        self.produto_vendido = ProdutoVendido.objects.create(
            venda=self.venda,
            produto=self.produto,
            quantidade=2,
            comissao_configurado=5.0,
            comissao=1.0
        )



    @override_settings(TIME_ZONE='UTC')
    def test_edit_venda(self):
        url = reverse('venda-detail', kwargs={'pk': self.venda.id})
        new_data = {
            'datetime': '2023-01-02T14:00:00Z',
            'cliente': self.new_cliente.id,
            'vendedor': self.vendedor.id,
        }

        response = self.client.patch(url, new_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Retrieve the updated Venda object from the database
        updated_venda = Venda.objects.get(id=self.venda.id)
        updated_produto_vendido = ProdutoVendido.objects.get(id=self.produto_vendido.id)

        # Assert that the fields have been updated
        self.assertEqual(updated_venda.datetime.replace(tzinfo=None).isoformat() + 'Z', '2023-01-02T14:00:00Z')
        self.assertEqual(updated_produto_vendido.venda.cliente, self.new_cliente)

    def test_delete_venda(self):
        url = reverse('venda-detail', kwargs={'pk': self.venda.id})

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Verify that the Venda object has been deleted
        with self.assertRaises(Venda.DoesNotExist):
            Venda.objects.get(id=self.venda.id)
        
        # Verify that associated ProdutoVendido objects have been deleted
        with self.assertRaises(ProdutoVendido.DoesNotExist):
            ProdutoVendido.objects.get(id=self.produto_vendido.id)

    