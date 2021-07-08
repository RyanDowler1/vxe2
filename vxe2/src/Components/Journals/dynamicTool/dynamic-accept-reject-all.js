import React from 'react';
import "../css/journals-main.css";
import Spinner from '../loading/spinningTemp';

class AcceptRejectAll extends React.Component {
    constructor(props) {        
        super(props);        
        this.state = {
            currentUser: "",
            showLoader: false
        }
    }

    componentWillReceiveProps(prevProps) {        
               
    }

    acceptRejAllAct (accept) {
        // this.setState({showLoader: true});        
        let showLoader = true;
        this.props.acceptRejectAll(this.props.trackingList, accept);
        // this.setState({showLoader: true});
    }

    render() {                   
        return (                
            <>
            <div className="accept-reject-all pt-2">
                <button className="btn cstm-save-btn mr-2 float-right" onClick = {() => this.acceptRejAllAct('accept')}><i className="material-icons cstm-success-color">done</i>Accept All</button>
                <button className="btn cstm-delete-btn mr-2 float-right" onClick = {() => this.acceptRejAllAct('reject')}><i className="material-icons cstm-danger-color">close</i>Reject All</button>
            </div>
            {this.state.showLoader &&
                <Spinner loadingText={'Loading...'} />
            }
            </>
        );
    }  
}

export default AcceptRejectAll;
