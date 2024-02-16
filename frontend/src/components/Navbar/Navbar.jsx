import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../Styles/Navbar.module.css";
import * as FaIcons from "react-icons/fa";
import { SidebarData } from "./SidebarData";
import logo from "../../assets/images/image_1-removebg-preview 1.png";

function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const location = useLocation();
  const editData = location.state?.editData;
  const sidebarRef = useRef(null);

  const showSidebar = (e) => {
    e.preventDefault();
    setSidebar(!sidebar);
  };

  //Function to close the sidebar from anywhere
  const handleClickOutside = (e) => {
    if (sidebarRef.current.contains(e.target)) {
      return;
    }
    setSidebar(false);
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
  }, [location, getTitle()]);

  useEffect(() => {
    if (sidebar === true) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      // Remove event listener when component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebar]);

  return (
    <>
      <div className={styles.nav_bar}>
        <div className="col-5">
          <Link to="#" className={styles.nav_menu_icon} onClick={showSidebar}>
            <FaIcons.FaBars />
          </Link>
          <img src={logo} alt="Logo" className={styles.navbar_logo} />
        </div>
        <div className={`col-7 ${styles.titulo}`}>
          <h4>{getTitle()}</h4>
        </div>
      </div>
      <div
        ref={sidebarRef}
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
