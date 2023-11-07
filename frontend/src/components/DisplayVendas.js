import React, { Component } from "react";
import axios from "axios";

class DisplayVendas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vendedores: [],
    };
  }

  componentDidMount() {
    axios.get("http://127.0.0.1:8000/clientes/")
    .then(res =>{
        this.setState({vendedores: res.data})
    })
    .catch(error =>{
        console.log(error)
    })
    
  }
  render() {
    const {vendedores} = this.state
    return (
        <div>
            {
                vendedores.map(vendendor => <div className="text-primary" key="vendedor.id">
                  <h1>{vendendor.nome}</h1>
                  <h1>{vendendor.email}</h1>
                  </div>)
            }
        </div>
    )
    
  }
}

export default DisplayVendas;
