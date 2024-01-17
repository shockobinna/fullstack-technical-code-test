import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../Styles/Navbar.module.css";
import * as FaIcons from "react-icons/fa";
import { SidebarData } from "./SidebarData";
import logo from "../../assets/images/image_1-removebg-preview 1.png";

function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const location = useLocation();
  const editData = location.state?.editData;
  console.log(SidebarData);

  const showSidebar = () => {
    setSidebar(!sidebar);
    console.log(sidebar);
  };

  // Function to get the title based on the current route
  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Vendas";
      case "/comissao":
        return "Comissão";
      case "/editarVenda":
        return `Alterar Venda - ${editData || ""}`;
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
      <div className={styles.nav_bar}>
        <div className="">
          <Link to="#" className={styles.nav_menu_icon} onClick={showSidebar}>
            <FaIcons.FaBars />
          </Link>
          <img src={logo} alt="Logo" className={styles.navbar_logo} />
        </div>
        <div className={styles.titulo}>
          <h3>{getTitle()}</h3>
        </div>
      </div>
      <div
        className={
          sidebar
            ? `${styles.sidebar_container} ${styles.active}`
            : `${styles.sidebar_container}`
        }
      >
        <ul className={styles.sidebar_items}>
          {SidebarData.map((sidebaritem) => {
            return (
              <li
                key={sidebaritem.id}
                className={styles.sidebar_item}
                onClick={showSidebar}
              >
                <Link to={sidebaritem.path}>
                  {sidebaritem.icon}
                  <span className="side">{sidebaritem.title}</span>
                </Link>
                <FaIcons.FaGreaterThan className={styles.greater_Sign} />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Navbar;
