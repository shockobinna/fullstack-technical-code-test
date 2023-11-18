import React, { useEffect, useState } from 'react'
import axios from "axios";
import '../comissao.css'
import * as FaIcons from "react-icons/fa";


function Comissao() {

  const [comissoesDetails, setComissoesDetails] = useState([])
  const [totalComissao, setTotalComissao] = useState(0)

  const [periodo, setPeriodo] = useState({
    start_date:'',
    end_date : ''
  })

  useEffect(() => {
    const newTotal = comissoesDetails.reduce(
      (acc, comissao) => acc + parseFloat(comissao.total_comissao),
      0
    );
    setTotalComissao(newTotal.toFixed(2));
    
  }, [comissoesDetails])


  

  const handleDate = (field, value) => {
    setPeriodo({
      ...periodo,
      [field]: value,
    });
  };

  const handleSearch = () => {
    console.log(periodo.start_date, periodo.end_date)
    axios.get('http://127.0.0.1:8000/listcomissoes/',{
      params: {
        start_date: periodo.start_date,
        end_date: periodo.end_date,
      },
      headers:{'Content-Type': 'application/json',}
    })
      .then(response => {
        setComissoesDetails(response.data)
        console.log(response.data);
      })
      .catch(error => {
        // Handle errors
        console.error(error);
    })

  

  }
    
  return (
    <div className='container-fluid mt-5 min-vh-100'>
        <div className='row mb-5'>
          <div className='col-6'>
          <h3>Relatório de Comissões</h3>
          </div>
          <div className='col-6'>
          <div className=" d-flex justify-content-end comissao_data">
            <div className="form-group startDate mr-3">
              <input type="date" 
              className="form-control" 
              id="dateInput1"
              value={periodo.start_date}
              onChange={(e)=>handleDate('start_date', e.target.value)}
              />
            </div>
            <div className="form-group endDate mr-3">
              <input 
              type="date" 
              className="form-control" 
              id="dateInput2"
              value={periodo.end_date}
              onChange={(e)=>handleDate('end_date', e.target.value)}
              />
            </div>
            <button 
            type="button" 
            className="btn btn-primary searchbtn" 
            onClick={handleSearch}>
              <FaIcons.FaSearch/>
              </button>
          </div>
        </div>
        </div>
        <div className='row'>
          <div className='col'>
          { comissoesDetails.length > 0 ? (
        <table className="table table-light">
          <thead>
            <tr>
              <th scope="col">Cód.</th>
              <th scope="col">vendedor</th>
              <th scope="col">Total de Vendas</th>
              <th scope="col">Total de Comissões</th>
            </tr>
          </thead>
          <tbody>
            { comissoesDetails.map(comissao => (
              <React.Fragment key={comissao.id}>
                  <tr className='nome'>
                    <th scope="row">{comissao.id}</th>
                    <td>{comissao.nome}</td>
                    <td style={{paddingLeft:'50px'}}>{comissao.total_venda}</td>
                    <td style={{paddingLeft:'50px'}}>R${comissao.total_comissao}</td>
                  </tr>
              </React.Fragment>
            ))
            }
          </tbody>
          <tfoot>
          <tr>
            <td colSpan="4">
          <table className='table table-light'>
            <thead>
              <tr colSpan="">
                <th colSpan=""scope="col">Total de comissão de período</th>
                <th colSpan=""scope="col">R${totalComissao}</th>

              </tr>
            </thead>
          </table>
          </td>
          </tr>
          </tfoot>
        </table>
        
          ):(
            <div className='row msg-row'>
               <div className='col msg'>

                <h5>Para visualizar o relatório, selecione um periódo nos campos acima </h5>

               </div>
            </div>
          )
          }
          </div>
        </div>
    </div>
  )
}



export default Comissao
