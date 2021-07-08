import React from 'react';
import "../css/journals-main.css";
import "../css/file-attachments.css";

class SubmitAttachmentData extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount () {

    }

    render() {
        return (            
            <div className="attachments-uploaded">
                <ul className="attachments-uploaded-list">
                {this.props.attachedFileData.map((attachment, index) => {                    
                    return (
                    <li key={index} className="attachments-uploaded-item">
                        <div
                        className={`attachments-uploaded-card ${
                            attachment.isLoading
                            ? "loading-attachment"
                            : "loaded-attachment"
                        }`}
                        >
                        {!attachment.localeFile ? (
                            <a
                            href="#"
                            data-documentid={index}
                            >
                            {attachment.name}
                            </a>
                        ) : (
                            <p>{attachment.name}</p>
                        )}
                        {!attachment.isLoading && (
                            <button className="deanta-button">
                            <i
                                className="material-icons-outlined remove-attachment"
                                onClick={(e) => {
                                this.props.removeAttachment(e, index);
                                }}
                                title="Remove"
                            >
                                close
                            </i>
                            </button>
                        )}
                        <span className="progress-bar"></span>
                        </div>
                    </li>
                    );
                })}
                </ul>
            </div>              
        )
    }    
}

export default SubmitAttachmentData;