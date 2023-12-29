
import React from 'react';
import Modal from 'react-modal';
import '../DeleteVendaModal.css'

const DeleteVendaModal = ({ isOpen, onClose, onDelete }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Delete Product Modal"
      style={{
        overlay: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          position: 'relative',
          top: 'auto',
          left: 'auto',
          transform: 'none',
          width: '500px',
          maxWidth: '80%',
          padding: '20px',
        },
      }}
    >
      <div className="closeButton topRight" onClick={onClose}>
        <h4>&times;</h4>
      </div>
      
      <h5>Remover venda</h5>
      <hr className="separatorLine" />
      <p>Deseja remover esta venda?</p>
      <hr className="separatorLine" />
      <div className='confirmBtns'>
      <button className='cancelBtn' onClick={onClose}>Não</button>
      <button className='deleteBtn' onClick={onDelete}>Sim</button>
      </div>
      
    </Modal>
  );
};

export default DeleteVendaModal;
