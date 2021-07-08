import React from 'react';

class NewAffTemplate extends React.Component {
    constructor(props) {                
        super(props);        
        this.state = {         
            currAffCoun: '',               
            currAffCoundigit: '',               
        }                        
    }    

    componentDidMount() {  
        this.getAffCount();         
    }

    removeAffNewRow(e) {        
        e.target.closest('.form-group').remove();     
    }

    getAffCount () {        
        let afflen = document.querySelectorAll('#form_fm #affDrag .form-group').length;
        let digit = this.pad(afflen,4);
        this.setState({
            currAffCoun:afflen,
            currAffCoundigit: digit
        });
    }

    pad(n, length) {
        var len = length - (''+n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }

    render() {  
        return (             
            <div className="form-group new-aff-row" aff-storeid={'aff'+this.state.currAffCoundigit}>
                <div className="fm-xref-form fm-xref-aff-form">
                    <label className="popuplabel">Affiliation Citation:</label>
                    <div className="form-control meta-form" contentEditable={false} suppressContentEditableWarning={false} data-storeid={'sup-'+this.props.id} data-tagname="XREF"> 
                        {this.state.currAffCoun}                       
                    </div>
                </div>
                <div className="fm-aff-form">
                    <label className="popuplabel">Affiliation {this.state.currAffCoun}</label>
                    <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={'AF'+this.state.currAffCoundigit} data-tagname="aff">
                    </div>
                </div>
                <div className="fm-delete-form">
                    <i className="material-icons-outlined" title="Delete" onClick={(e) => this.removeAffNewRow(e)}>delete</i>
                    <i className="material-icons-outlined aff-drag hide ui-sortable-handle" title="Reorder">drag_indicator</i>
                </div>
            </div>
        )
    }
}

export default NewAffTemplate;