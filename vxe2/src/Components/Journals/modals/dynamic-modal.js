import React from 'react';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip'; 
import "../css/journals-main.css";

class DynamicModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {    
            openModal: true,
        };
        this.modalClose = this.modalClose.bind(this);
    }

    modalClose(){
        this.props.modalIsClose();
        this.setState({openModal: false});
    }

    render() {    
        const {openModal} = this.state;
        let closeTooltip = <Tooltip className={'closetooltip'}>Close</Tooltip>;
        return (
                 
            <Modal 
                className={this.props.modalName}
                show={openModal} 
                onHide={this.modalClose}                                 
                size={this.props.modalSize}
                aria-labelledby="contained-modal-title-vcenter"
                id={this.props.modalId}
                backdrop="static"
                >
                <Modal.Body>
                    <OverlayTrigger placement="top" overlay={closeTooltip}>
                        <button type="button" className="close" onClick={this.modalClose} aria-label="Close">
                            <i className="material-icons">close</i>
                        </button>                                           
                    </OverlayTrigger>
                    {this.props.children}
                </Modal.Body>
            </Modal>
      
        );
    }
}

export default DynamicModal;
