// actions.js

export const updateVendaData = (updatedData) => ({
  type: 'UPDATE_VENDA_DATA',
  payload: updatedData,
});

export const addProdutos = (produtoData) => ({
  type: 'ADD_PRODUTOS',
  payload: produtoData,
});

export const addClientes = (clienteData) => ({
  type: 'ADD_CLIENTES',
  payload: clienteData,
});

export const addVendedores = (vendedorData) => ({
  type: 'ADD_VENDEDORES',
  payload: vendedorData,
});