import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../DisplayVendas.css'
import * as FaIcons from "react-icons/fa";
import DeleteVendaModal from './DeleteVendaModal';
import { useDispatch, useSelector } from 'react-redux';


const DisplayVendas = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const vendaData = useSelector(state => state.venda);
  console.log('Current state in the store:', vendaData);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [produtoId, setProdutoId] = useState(null)
  const [produtoDeletado, setProdutoDeletado] = useState(false)
  const [initialRender, setInitialRender] = useState(true); // logica para a função fetchVendas  funcionar quando o componente é renderizado
  const [totalsForRow, setTotalsForRow] = useState({
    totalQuantidade: 0,
    totalRowProduto: 0,
    totalComissao: 0
  });

  useEffect(() => {

    if(initialRender){
      fetchVendas(); //buscar todas vendas sempre quando o component é renderizado
      setInitialRender(false)
    }

    if(produtoDeletado){
      fetchVendas(); // atualizar a list de vendas após deletar alguma venda
      setProdutoDeletado(false)
    }
    
    
  }, [produtoDeletado, initialRender]); // dependencias para o fetchVendas fucionar dinamicamente

  const fetchVendas = async () => {
    await axios.get('http://127.0.0.1:8000/listallvendas/')
    .then(response => {
      setSalesData(response.data);
    })
    .catch(error => {
      console.error('Error fetching sales data:', error);
    });
  }

  const toggleRow = (rowId) => {
    setSalesData(prevData => prevData.map(item => ({
      ...item,
      isExpanded: item.id === rowId && !item.isExpanded

    })));
    const calculateTotalsForRows = calculateTotalsForRow(rowId);
    setTotalsForRow(calculateTotalsForRows)
    
  };

  const handleUpdate = (item) => {
    // Add code to handle "Update" action here
    const data = JSON.stringify(item)
    dispatch({ type: 'UPDATE_VENDA_DATA', payload: data });
    navigate('/novaVenda', {state:{ editData: data}});
    console.log('Update clicked :'  + JSON.stringify(item));
  };


  const calculateTotalsForRow = (rowId) => {
    // Find the object with the matching 'id' in salesData
    const selectedItem = salesData.find(item => item.id === rowId);
  
    if (selectedItem) {
      let totalQuantidade = 0;
      let totalRowProduto = 0;
      let totalComissao = 0;
  
      selectedItem.produtos.forEach(produto => {
        totalQuantidade += produto.quantidade;
        totalRowProduto += parseFloat(produto.valor_unitario * produto.quantidade);
        if (produto.comissao_a_receber !== null) {
          totalComissao += parseFloat(produto.comissao_a_receber);
        }
      });
  
      return {
        totalQuantidade,
        totalRowProduto,
        totalComissao,
      };
    }
  
    return null; // Return null if no item with matching 'id' is found
  };

  const handleDeleteClick = (id) => {
    // Open the delete confirmation modal
    setDeleteModalOpen(true);
    setProdutoId(id)
  };

  const handleDeleteConfirm = async() => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/vendas/${produtoId}`)

      if(response.status === 204){
        setProdutoDeletado(true)
      }
      else{
        console.log("Falha em deletar o produto")
      }
    } catch (error) {
      console.log(error)
    }
    finally{
      setDeleteModalOpen(false)
    }
  };

  const handleModalClose = () => {
    // Close the delete confirmation modal
    setDeleteModalOpen(false);
  };

  const handleNovaVendaClick = () => {
    // Call updateTitle with the desired text
    // updateTitle('Nova Venda');
  };

  

  
  

  return (
    <div className="container-fluid mt-3">
      <div className="d-flex justify-content-between">
        <div> <h3>Vendas Realizadas</h3></div>
        <div>
          <Link to="/novaVenda" onClick={handleNovaVendaClick}>
          <button className='btn btn-secondary'>Inserir Nova Venda</button>
          </Link>
        </div> 
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Nota Fiscal</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Data da Venda</th>
            <th>Valor Total</th>
            <th>Opcões</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map(item => (
            <React.Fragment key={item.id}>
              <tr >
                <td>{item.nota_fiscal}</td>
                <td>{item.cliente}</td>
                <td>{item.vendedor}</td>
                <td>{item.datetime}</td>
                <td>{item.total_compras}</td>
                <td>

                  <tr>
                  <td> <i className="action-ver" onClick={() => toggleRow(item.id)}>{item.isExpanded ?'Fechar' : 'Ver Itens'}</i></td>
                  <td> <i className="action-edit" onClick={()=> handleUpdate(item)}> 
                  <FaIcons.FaEdit /> 
                  </i> 
                  </td>
                  <td> <i className="action-delete" onClick={() => handleDeleteClick(item.id)}><FaIcons.FaTrash /> </i> </td>
                  </tr>

                </td>
              </tr>
              {item.isExpanded && (
              <tr className="">
                <td colspan="6">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>Produtos/Serviço</th>
                        <th>Quantidade</th>
                        <th>Preço unitario</th>
                        <th>Total do Produto</th>
                        <th>% de Comissão</th>
                        <th>Comissão</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.produtos.map(produto => (
                        <tr key={produto.id}>
                          <td>{produto.descricao}</td>
                          <td>{produto.quantidade}</td>
                          <td>R${produto.valor_unitario}</td>
                          <td>R${produto.valor_unitario * produto.quantidade}</td>
                          <td>{produto.comissao_configurada}%</td>
                          <td>R${produto.comissao_a_receber}</td>
                        </tr>
                        
                      ))
                      }
                    </tbody>
                  </table>
                     <table className='table table-borderless'>
                          <thead>
                            <tr>
                              <th className='produto_servico'>Total de Venda</th>
                              <th>{totalsForRow.totalQuantidade}</th>
                              <th>&nbsp;</th>
                              <th className='produto_total'>R$ {totalsForRow.totalRowProduto}</th>
                              <th></th>
                              <th className='produto_comissao'>R$ {totalsForRow.totalComissao}</th>
                            </tr>
                          </thead>
                        </table>  
                </td>
               </tr>
            )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <DeleteVendaModal
        isOpen={isDeleteModalOpen}
        onClose={handleModalClose}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
};

export default DisplayVendas;



