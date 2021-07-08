import React from 'react';

class AffDeleteConfirm extends React.Component {
    constructor(props) {                
        super(props);        
        this.state = {                                       
        }                        
    }

    componentDidMount() {  

    }

    deleteAfflication() {
        let affrow = this.props.affDeleterow;
        var affEle = document.getElementById(affrow);
        if(!(!affEle)){
            affEle.classList.add("deleted-row", "hide");
        }
        window.hideSecModal('fmSecondModal');
    }

    hideModal(){
        window.hideSecModal('fmSecondModal');
    }

    render() {  
        return (             
            <div>
                <div>
                    <center className="warningclass">
                        <h2>Confirm!</h2>
                    </center>
                    <span>If you delete the Affiliation it will affect the Affiliation Citation also.</span>
                </div>
                <div className="my-2">
                    <button id="deleteAffCancel" className="btn cstm-delete-btn mr-2 pull-right" onClick={() => this.hideModal()}>No</button>
                    <button id="deleteAff" className="btn cstm-save-btn mr-2 pull-right" onClick={() => this.deleteAfflication()}>Yes</button>
                </div>
            </div>
        )
    }
}

export default AffDeleteConfirm;