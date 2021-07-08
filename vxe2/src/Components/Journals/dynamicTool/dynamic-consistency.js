import React from 'react';

class Consistency extends React.Component{
    constructor(props){
        super(props);

        this.closeConsistency = this.closeConsistency.bind(this);              
    }

    closeConsistency(){                             
        let close = false;
        this.props.consistencyVali(close);
    }

    render(){
        return(
            <div className={this.props.setClass +" row"}>
                <div className="header-ds">
                    <h6>Consistency Validation</h6>
                    <button type="button" className="close close-pos" aria-label="Close">
                        <i className="material-icons text-right cstm-close" onClick={this.closeConsistency}>close</i>
                    </button>
                </div>
                <div className="consistency-response body-ds"></div>
            </div>
        );
    }
}


export default Consistency;