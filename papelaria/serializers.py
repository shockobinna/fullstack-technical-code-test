from rest_framework import serializers
from .models import Vendedor, Cliente, Produto, Venda, ComissaoBaseadoNoDia

class VendedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendedor
        fields = '__all__'

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class VendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venda
        fields = '__all__'

class ComissaoBaseadoNoDiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComissaoBaseadoNoDia
        fields = '__all__'

class ProdutoSerializer(serializers.ModelSerializer):
    comissao_do_dia = ComissaoBaseadoNoDiaSerializer(many=True, required=False)
    
    class Meta:
        model = Produto
        fields = '__all__'




