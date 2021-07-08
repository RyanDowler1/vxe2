import React from 'react';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip'; 
import "../css/journals-main.css";

class TokenModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {    
            openModal: false,
        };

        this.modalClose = this.modalClose.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    modalClose(){
        this.setState({openModal: false});
    }

    showModal(){
        setTimeout(
            ()=>{
                // Unauthorised Modal only appears after 2 seconds now 
                this.setState({openModal: true});
            }
        , 2000);
    }
    
    componentDidMount(){
        this.showModal();
    }

    render() {    
        const {openModal} = this.state;
        let closeTooltip = <Tooltip className={'closetooltip'}>Close</Tooltip>;
        return (
            <Modal 
                className="token-modal"
                show={openModal} 
                onHide={this.modalClose}                                 
                size='lg'
                aria-labelledby="contained-modal-title-vcenter"
                id="token-modal"
                >
                <Modal.Body>
                    <OverlayTrigger placement="top" overlay={closeTooltip}>
                        <button type="button" className="close" onClick={this.modalClose} aria-label="Close">
                            <i className="material-icons">close</i>
                        </button>                                           
                    </OverlayTrigger>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'150px'}}>
                        <span class="material-icons" style={{color: "red"}}>warning</span>
                        <h2>{this.props.modalHeader}</h2>
                        <span>{this.props.modalBody}</span> 
                        {this.props.modalBody2 &&
                        <span>{this.props.modalBody2}</span>}                       
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}

export default TokenModal;
