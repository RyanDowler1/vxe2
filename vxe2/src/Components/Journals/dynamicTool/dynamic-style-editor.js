import React from 'react';
import $ from 'jquery';

class StyleEditor extends React.Component{
    constructor(props){
        super(props);
        this.closeStyleEditor = this.closeStyleEditor.bind(this);
    }

    closeStyleEditor = () => {               
        let close = false;
        this.props.styleEdit(close);       
        $('#description_value').html("");
        $('#description_value').hide();
    }

    render(){
        return(
            <div className={this.props.setClass +" row"}>
                <div className="header-ds">
                    <h6 className="style-edit-heading">Style Editing (BioScientifica)</h6>
                    <button type="button" className="close close-pos" aria-label="Close">
                        <i className="material-icons text-right cstm-close" onClick={this.closeStyleEditor}>close</i>
                    </button>
                </div>
                <div className="body-ds">                   
                    <div id="description_value"></div>
                </div>
            </div>
      );
    }
}

export default StyleEditor;