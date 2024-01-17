import React from "react";
import Modal from "react-modal";
import styles from "../Styles/DeleteVendaModal.module.css";

const DeleteVendaModal = ({ isOpen, onClose, onDelete }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Delete Product Modal"
      style={{
        overlay: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        content: {
          position: "relative",
          top: "auto",
          left: "auto",
          transform: "none",
          width: "500px",
          maxWidth: "80%",
          padding: "20px",
        },
      }}
    >
      <div
        className={`${styles.closeButton} ${styles.topRight}`}
        onClick={onClose}
      >
        <h4>&times;</h4>
      </div>

      <h5>Remover venda</h5>
      <hr className={`${styles.separatorLine}`} />
      <p>Deseja remover esta venda?</p>
      <hr className={`${styles.separatorLine}`} />
      <div className={`${styles.confirmBtns}`}>
        <button className={`${styles.cancelBtn}`} onClick={onClose}>
          Não
        </button>
        <button className={`${styles.deleteBtn}`} onClick={onDelete}>
          Sim
        </button>
      </div>
    </Modal>
  );
};

export default DeleteVendaModal;
