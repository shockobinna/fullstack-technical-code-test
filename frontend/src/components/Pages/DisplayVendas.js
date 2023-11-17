import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../DisplayVendas.css'
import * as FaIcons from "react-icons/fa";
import DeleteVendaModal from './DeleteVendaModal';
import { useDispatch, useSelector } from 'react-redux';
import { updateVendaData } from '../../redux/actions';


const DisplayVendas = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const vendaData = useSelector(state => state.venda);
  const produtosData = useSelector(state => state.produtos);
  const clientesData = useSelector(state => state.clientes);
  const vendedoresData = useSelector(state => state.vendedores);
  console.log('Current state in the store:', vendaData, vendaData.vendas.length);
  console.log('Current produtos in the store:', produtosData, produtosData.produtos.length);
  console.log('Current state in the store:', clientesData, clientesData.clientes.length);
  console.log('Current state in the store:', vendedoresData, vendedoresData.vendedores.length);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [produtoId, setProdutoId] = useState(null)
  const [produtoDeletado, setProdutoDeletado] = useState(false)
  const [produtos, setProdutos] = useState([])
  const [clientes, setClientes] = useState([])
  const [vendedores, setVendedores] = useState([])
  const [initialRender, setInitialRender] = useState(true); // logica para a função fetchVendas  funcionar quando o componente é renderizado
  const [totalsForRow, setTotalsForRow] = useState({
    totalQuantidade: 0,
    totalRowProduto: 0,
    totalComissao: 0
  });
  useEffect(() => {

    dispatch(updateVendaData([]))
  
    
  }, [dispatch])
  

  useEffect(() => {

    if(initialRender){
      fetchVendas(); //buscar todas vendas sempre quando o component é renderizado
      fetchProdutos();
      fetchClientes();
      fetchVendedores();
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

  const fetchProdutos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/produtos/");

      const formattedOptions = response.data.map((produto) => ({
        value: produto.id,
        label: `${produto.codigo} - ${produto.descricao}`,
        codigo: produto.codigo, // Add the product code to the option for filtering
      }));
      dispatch({ type: 'ADD_PRODUTOS', payload: response.data });
      // setProdutoSerachList(formattedOptions);
      setProdutos(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error fetching data1:", error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/clientes/");
      dispatch({ type: 'ADD_CLIENTES', payload: response.data });
      setClientes(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data1:", error);
    }
  };

  const fetchVendedores = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/vendedores/");
      dispatch({ type: 'ADD_VENDEDORES', payload: response.data });
      setVendedores(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data1:", error);
    }
  };

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

  const formatarData =(data)=>{
   const formatada = new Date(data).toLocaleString('pt-BR', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: 'UTC',
    }).replace(/,/g, ' -');;
    return formatada 
  }

  

  
  

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
            <th style={{paddingLeft:'40px'}}>Opcões</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map(item => (
            <React.Fragment key={item.id}>
              <tr >
                <td>{item.nota_fiscal}</td>
                <td>{item.cliente}</td>
                <td>{item.vendedor}</td>
                <td>{formatarData(item.datetime)}</td>
                <td style={{paddingLeft:'50px'}}>{item.total_compras}</td>
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
              // <tr className="">
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
                          <td style={{paddingLeft:'50px'}}>{produto.quantidade}</td>
                          <td style={{paddingLeft:'50px'}}>R${produto.valor_unitario}</td>
                          <td style={{paddingLeft:'50px'}}>R${produto.valor_unitario * produto.quantidade}</td>
                          <td style={{paddingLeft:'50px'}}>{produto.comissao_configurada}%</td>
                          <td style={{paddingLeft:'30px'}}>R${produto.comissao_a_receber}</td>
                        </tr>
                        
                      ))
                      }
                    </tbody>
                  </table>
                     <table className='table table-borderless'>
                          <thead>
                            <tr>
                              <th className='produto_servico'>Total de Venda</th>
                              <th style={{paddingLeft:'50px'}}>{totalsForRow.totalQuantidade}</th>
                              <th>&nbsp;</th>
                              <th style={{paddingRight:'23px'}}>R$ {totalsForRow.totalRowProduto}</th>
                              <th></th>
                              <th style={{paddingLeft:'30px'}} className='produto_comissao'>R$ {totalsForRow.totalComissao}</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>  
                </td>
              //  </tr>
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



