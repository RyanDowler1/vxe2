import React from 'react';

class NewFootTemplate extends React.Component {
    constructor(props) {                
        super(props);        
        this.state = {                           
        }                        
    }    

    componentDidMount() {            
    }

    render() {  
        return (
            <div className="form-group" id="fmfootnote">
                <label className="popuplabel">Footnote:</label>
                <div className="form-control meta-form footnote-new" contentEditable={true} suppressContentEditableWarning={true} data-storeid={'pp1'+this.props.id} data-tagname="pp1" id="fm-fn"></div>                
            </div>
        )
    }
}

export default NewFootTemplate;