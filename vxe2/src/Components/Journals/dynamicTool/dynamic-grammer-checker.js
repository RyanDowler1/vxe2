import React from 'react';
import "../css/journals-main.css";

class GrammerChecker extends React.Component{
    constructor(props){
        super(props);
        this.closeGrammerChecker = this.closeGrammerChecker.bind(this);
    }

    closeGrammerChecker(){                     
        let close = false;
        this.props.grammerCheck(close);
    }

    render(){
        return(            
            <div className={this.props.setClass +" row"}>
            <div className="header-ds">
                <h6>Grammatical Validation</h6>     
                <button type="button" className="close close-pos" aria-label="Close">
                    <i className="material-icons text-right cstm-close" onClick={this.closeGrammerChecker}>close</i>
                </button>
            </div>
            <div className="language-content body-ds"></div>   
        </div>
        );
    }
}

export default GrammerChecker;