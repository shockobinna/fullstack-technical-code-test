from django.db import models

# Create your models here.

DAY_CHOICES =( 
    ("Monday", "Segunda"), 
    ("Tuesday", "Terça"), 
    ("Wednesday", "Quarta"), 
    ("Thursday", "Quinta"),
    ("Friaday", "Sexta"),
    ("Saturday", "Sabado"),
    ("Sunday", "Domingo"),
)

class ComissaoBaseadoNoDia(models.Model):
    dia_da_semana = models.CharField(max_length=100, choices = DAY_CHOICES)
    produto = models.ForeignKey('Produto', on_delete=models.CASCADE)
    min_comissao = models.DecimalField(max_digits=5, decimal_places=2)
    max_comissao = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.produto

class Produto(models.Model):
    codigo = models.CharField(max_length=100)
    descricao = models.CharField(max_length=200)
    valor_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    percentual_comissao = models.DecimalField(max_digits=5, decimal_places=2)


    def __str__(self):
        return self.descricao

          

class Venda(models.Model):
    nota_fiscal = models.CharField(max_length=100)
    datetime = models.DateTimeField()
    cliente = models.ForeignKey('Cliente', on_delete=models.CASCADE)
    vendedor = models.ForeignKey('Vendedor', on_delete=models.CASCADE)
    produto = models.ManyToManyField(Produto, through='ProdutoVendido')

class Cliente(models.Model):
    nome = models.CharField(max_length=100)
    email = models.EmailField()
    telefone = models.CharField(max_length=15)

    def __str__(self):
        return self.nome    
    
class Vendedor(models.Model):
    nome = models.CharField(max_length=100)
    email = models.EmailField()
    telefone = models.CharField(max_length=15)

    def __str__(self):
        return self.nome 

# class Pessoa(models.Model):
#     nome = models.CharField(max_length=100)
#     email = models.EmailField()
#     telefone = models.CharField(max_length=15)

#     def __str__(self):
#         return self.nome

# class Cliente(Pessoa):
#     pass

# class Vendedor(Pessoa):
#     pass  

class ProdutoVendido(models.Model):
    venda = models.ForeignKey(Venda, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.IntegerField()
    comissao_configurado = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    comissao = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)


   
