import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import * as FaIcons from "react-icons/fa";
import { SidebarData } from "./SidebarData";


function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const location = useLocation();
  const editData = location.state?.editData;

  const showSidebar = () => {
    setSidebar(!sidebar);
    
  };

  
  // Function to get the title based on the current route
  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Vendas";
      case "/comissao":
        return "Comissão";
      case "/editarVenda":
        return `Alterar Venda - ${editData || ''}`;
      case "/novaVenda":
        return "Nova Venda";
      
      default:
        return "Vendas";
    }
  };

  useEffect(() => {
    document.title = getTitle();
  }, [location]);
  
  return (
    <>
      <div className="navbar">
        <Link to="#" className="nav-menu-icon" onClick={showSidebar}>
          <FaIcons.FaBars />
        </Link>
        <h3 className="titulo">{getTitle()}</h3>
        <h3 className=""></h3>
      </div>
      <div
        className={sidebar ? "sidebar-container active" : "sidebar-container"}
      >
        <ul className="sidebar-items">
          <li className="sidebar-toggle">
            <Link to="#" className="nav-menu-icon" onClick={showSidebar}>
              <FaIcons.FaWindowClose />
            </Link>
            
          </li>
          {SidebarData.map((sidebaritem) => {
            return (
              <li
                key={sidebaritem.id}
                className={sidebaritem.cName}
                onClick={showSidebar }
              >
                <Link to={sidebaritem.path}>
                  {sidebaritem.icon}
                  <span className="side">{sidebaritem.title}</span>
                </Link>
                < FaIcons.FaGreaterThan className="greaterSign"/>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Navbar;