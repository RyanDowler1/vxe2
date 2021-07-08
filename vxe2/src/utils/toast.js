import React from 'react'

class toast extends React.Component {
    constructor(props) {
        super(props);
    }

    showWarningToast = (message) =>  {
        document.querySelector('.deanta-toast-alert').classList.remove('hidden');
    
        if (message.statusType !== "") {
            document.querySelector('.deanta-toast-alert').classList.add(message.statusType);
        } else {
            document.querySelector('.deanta-toast-alert').classList.add('warning');
        }
    
        if (message.statusIcon !== "") {
            document.querySelector('.deanta-toast-alert > i').innerHTML = message.statusIcon;
        } else {
            document.querySelector('.deanta-toast-alert > i').innerHTML = "warning";
        }
    
        document.querySelector('.deanta-toast-close').addEventListener('click',
            () => {
                document.querySelector('.deanta-toast-alert').classList.add('hidden');
                window.localStorage.setItem("show-VXE-warning", "false");
    
                // track when it was closed last
                // would like to remind people every 2 days
                window.localStorage.setItem("show-VXE-warning-time", `${Date.now()}`);
            })
    
        if (message === "error" || message.status === 400) {
            document.querySelector('.deanta-toast-text').innerHTML = 'Due to connectivity issues the request could not be fulfilled. Please, try again.'
        } else {
            document.querySelector('.link-text').innerHTML = message.linkText;
            document.querySelector('.deanta-toast-text').innerHTML = message.statusText;
        }
    }

    
    render () {
    return (
        <div className="deanta-toast-alert warning hidden">
            <i className="material-icons-outlined">warning1</i>
            <p className="link-text py-2 mb-0" onClick={() => this.props.triggerManualSave()}></p>&nbsp;<p className="deanta-toast-text"></p>
            <button className="deanta-toast-close"><i className="material-icons-outlined">close</i></button>
        </div>
        )
    }
}
export default toast;

