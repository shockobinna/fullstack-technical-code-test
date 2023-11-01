from django.db import models

# Create your models here.

DAY_CHOICES =( 
    ("Segunda", "Segunda"), 
    ("Terça", "Terça"), 
    ("Quarta", "Quarta"), 
    ("Quinta", "Quinta"),
    ("Sexta", "Sexta"),
    ("Sabado", "Sabado"),
    ("Domingo", "Domingo"),
)

class ComissaoBaseadoNoDia(models.Model):
    dia_da_semana = models.CharField(max_length=100, choices = DAY_CHOICES, unique=True)
    produto = models.ForeignKey('Produto', on_delete=models.CASCADE)
    min_comissao = models.DecimalField(max_digits=5, decimal_places=2)
    max_comissao = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.get_dia_da_semana_display()} - {self.produto}"

class Produto(models.Model):
    codigo = models.CharField(max_length=100)
    descricao = models.CharField(max_length=200)
    valor_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    percentual_comissao = models.DecimalField(max_digits=5, decimal_places=2)


    def __str__(self):
        return self.descricao

    # Função para extrair a comissão configurado no dia para aquele produto
    def get_commissao_baseado_do_dia(self, dia):
        try:
            commissao_do_dia = ComissaoBaseadoNoDia.objects.get(dia_da_semana=dia, produto=self)
            return (commissao_do_dia.min_comissao, commissao_do_dia.max_comissao)
        except ComissaoBaseadoNoDia.DoesNotExist:
            return (self.percentual_comissao, self.percentual_comissao)
          

class Venda(models.Model):
    nota_fiscal = models.CharField(max_length=100)
    datetime = models.DateTimeField()
    cliente = models.ForeignKey('Cliente', on_delete=models.CASCADE)
    vendedor = models.ForeignKey('Vendedor', on_delete=models.CASCADE)
    produto = models.ManyToManyField(Produto, through='ProdutoVendido')
    

class Vendedor(models.Model):
    nome = models.CharField(max_length=100)
    email = models.EmailField()
    telefone = models.CharField(max_length=15)

    def __str__(self):
        return self.nome

class Cliente(models.Model):
    nome = models.CharField(max_length=100)
    email = models.EmailField()
    telefone = models.CharField(max_length=15)

    def __str__(self):
        return self.nome

class ProdutoVendido(models.Model):
    venda = models.ForeignKey(Venda, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.IntegerField()

    def calcular_commissao(self):
        min_percentual, max_percentual = self.produto.get_commissao_baseado_do_dia(self.venda.datetime.strftime('%A'))
        percentual_comissao = min(max(self.produto.percentual_comissao, min_percentual), max_percentual)
        return self.quantidade * self.produto.valor_unitario * percentual_comissao
