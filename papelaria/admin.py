from django.contrib import admin
from .models import Produto, Cliente, Vendedor, ComissaoBaseadoNoDia

class ComissaoBaseadoNoDiaInline(admin.TabularInline):
    model = ComissaoBaseadoNoDia

class ProductAdmin(admin.ModelAdmin):
    inlines = [ComissaoBaseadoNoDiaInline]

admin.site.register(Produto, ProductAdmin)
admin.site.register(Vendedor)
admin.site.register(Cliente)

