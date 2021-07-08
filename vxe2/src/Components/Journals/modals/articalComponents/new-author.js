import React from 'react';

class NewAuthorTemplate extends React.Component {
    constructor(props) {                
        super(props);        
        this.state = {                                       
        }                        
    }

    componentDidMount() {            
    }

    removeAutNewRow(e) {        
        e.target.closest('.form-group').remove();     
    }

    orcidNew(){        
    }
    
    render() {  
        return (             
            <div className="form-group fm-author-group new-author-row" contrib-storeid={'aut-'+this.props.id}>
                <div className="fm-author-form">
                    <label className="popuplabel">Surname:</label>
                    <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={'sur-'+this.props.id} data-tagname="surname" data-label="Surname">
                    </div>
                </div>
                <div className="fm-given-form">
                    <label className="popuplabel">Given Name:</label>
                    <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={'given-'+this.props.id} data-tagname="given-names" data-label="Given Name">
                    </div>
                </div>
                <div className="fm-xref-form">
                    <label className="popuplabel">Affiliation Citation:</label>
                    <div className="form-control meta-form citationlink" contentEditable={true} suppressContentEditableWarning={true} data-storeid={'aff-'+this.props.id} data-tagname="XREF" data-label="Affiliation Citation" onKeyUp={this.props.handleCitation}>
                    </div>
                </div>                
                <div className="fm-delete-form">
                    <span className="info-orcid" title="ORCID" onClick={() => this.orcidPopup('aut-'+this.props.id)} spellCheck={false}>ORCID</span>
                    <i className="material-icons-outlined new-footnote" title="Footnote" author-id="fm-author-1" author-storeid={'foot-'+this.props.id} onClick={()=> this.props.footNoteIns('aut-'+this.props.id)}>insert_link</i>
                    <i className="material-icons-outlined" title="New Citation" author-id="fm-author-1" author-storeid={'cit-'+this.props.id} onClick={() => this.props.addAuthorCition('aut-'+this.props.id)}>add</i>
                    <i className="material-icons-outlined" title="Delete" onClick={(e) => this.removeAutNewRow(e)}>delete</i>
                    <i className="material-icons-outlined author-drag ui-sortable-handle" title="Reorder" onMouseEnter={this.dragInit}>drag_indicator</i>
                </div>
            </div>
        )
    }
}

export default NewAuthorTemplate;