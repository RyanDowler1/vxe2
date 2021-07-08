import React from 'react';

class NewHisTemplate extends React.Component {
    constructor(props) {                
        super(props);        
        this.state = {                           
        }                        
    }    

    componentDidMount() {            
    }

    removeHisNewRow(e) {        
        e.target.closest('.form-group').remove();     
    }

    render() {  
        return (             
            <div className="form-group fm-author-group" id="his5" date-cont-storeid={"datecont"+this.props.id}>
                <div className="fm-author-form fm-his-form">
                    <label className="popuplabel">Date:</label>
                    <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={"datecont"+this.props.id} data-tagname="history" data-label="Date">
                        {/* <span className="ins cts-1" data-cid="66" data-userid="2269" data-username="Darren Ryan" data-time="1614333066000_ins1">
                        </span> */}
                    </div>
                </div>
                <div className="fm-author-form">
                    <label className="popuplabel">Day:</label>
                    <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={"day"+this.props.id} data-tagname="DAY" data-label="Day">                    
                    </div>
                </div>
                <div className="fm-author-form">
                    <label className="popuplabel">Month:</label>
                    <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={"month"+this.props.id} data-tagname="MONTH" data-label="Month">                        
                    </div>
                </div>
                <div className="fm-author-form">
                    <label className="popuplabel">Year:</label>
                    <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={"year"+this.props.id} data-tagname="YEAR" data-label="Year">                        
                    </div>
                </div>
                <div className="fm-delete-form">
                    <i className="material-icons-outlined" title="Delete" onClick={(e) => this.removeHisNewRow(e)}>delete</i>
                    <i className="material-icons-outlined his-drag ui-sortable-handle" title="Reorder">drag_indicator</i>
                </div>
            </div>
        )
    }
}

export default NewHisTemplate;