from datetime import datetime
from django.utils.crypto import get_random_string
from rest_framework import serializers
from .models import Vendedor, Cliente, Produto, Venda, ComissaoBaseadoNoDia,ProdutoVendido

# locale.setlocale(locale.LC_ALL, 'pt_BR')

class VendedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendedor
        fields = '__all__'

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'
# class PessoaSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Pessoa
#         fields = ['id', 'nome', 'email', 'telefone']

# class ClienteSerializer(PessoaSerializer):
#     class Meta(PessoaSerializer.Meta):
#         model = Cliente

# class VendedorSerializer(PessoaSerializer):
#     class Meta(PessoaSerializer.Meta):
#         model = Vendedor

class ComissaoBaseadoNoDiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComissaoBaseadoNoDia
        fields = '__all__'

class ProdutoSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Produto
        fields = '__all__'

class ProdutoVendidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProdutoVendido
        fields = ['id', 'produto', 'quantidade', 'comissao_configurado','comissao']
        # extra_kwargs = {
        #     'id' : {'required': False},
        # }

class VendaSerializer(serializers.ModelSerializer):
    produtovendido_set = ProdutoVendidoSerializer(many=True)

    class Meta:
        model = Venda
        fields = ['id','nota_fiscal', 'datetime', 'cliente', 'vendedor', 'produtovendido_set']

        extra_kwargs = {
            'id' : {'required': False},
            'nota_fiscal': {'required': False},
            'datetime': {'required': False},
        }

    def create(self, validated_data):
        produtos_vendidos_data = validated_data.pop('produtovendido_set')

        # Generate nota_fiscal here (e.g., using a combination of a prefix and a random string)
        validated_data['nota_fiscal'] = 'NF' + get_random_string(length=8)

        # Set the datetime field to the current date and time
        validated_data['datetime'] = datetime.now()
        
        venda = Venda.objects.create(**validated_data)

        for produto_vendido_data in produtos_vendidos_data:
            produto = produto_vendido_data.get('produto')
            quantidade = produto_vendido_data.get('quantidade')
            
            comissao_baseado_no_dia = ComissaoBaseadoNoDia.objects.filter(
                dia_da_semana = venda.datetime.strftime('%A'),
                produto=produto
            ).first()
            
            if comissao_baseado_no_dia:
                max_comissao = comissao_baseado_no_dia.max_comissao
                min_comissao = comissao_baseado_no_dia.min_comissao

                percentual_comissao = produto.percentual_comissao
                if percentual_comissao >= max_comissao:
                    percentual_comissao = max_comissao
                    
                    comissao_vendedor = percentual_comissao/100 * produto.valor_unitario * quantidade
                    produto_vendido_data['comissao_configurado'] = percentual_comissao
                    produto_vendido_data['comissao'] = comissao_vendedor
                    
                else:
                    percentual_comissao = min_comissao

                    comissao_vendedor = percentual_comissao/100 * produto.valor_unitario * quantidade
                    produto_vendido_data['comissao_configurado'] = percentual_comissao
                    produto_vendido_data['comissao'] = comissao_vendedor
                    

            else:
                # Use default_comissao on produto if comissão do dia wasn't configured or found
                comissao_vendedor = (produto.valor_unitario * quantidade) * (produto.percentual_comissao / 100)

                produto_vendido_data['comissao_configurado'] = produto.percentual_comissao
                produto_vendido_data['comissao'] = comissao_vendedor

            ProdutoVendido.objects.create(venda=venda, **produto_vendido_data)

        return venda