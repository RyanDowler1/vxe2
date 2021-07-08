import React from 'react';
import "../css/journals-main.css";

class SpellChecker extends React.Component {
    constructor(props) {
        super(props);
        this.closeSpellCheck = this.closeSpellCheck.bind(this);
    }

    closeSpellCheck() {
        let close = false;
        this.props.spellCheck(close);
    }

    render() {
        return (
            <div className={this.props.setClass + " row"}>
                <div className="header-ds">
                    <h6>Spell Check</h6>
                    <button type="button" className="close close-pos" aria-label="Close">
                        <i className="material-icons text-right cstm-close" onClick={this.closeSpellCheck}>close</i>
                    </button>
                </div>
                <div className="spell-content body-ds">
                    <div className="panel-spellcheck">
                        <div className="sp-trackchange">
                            <span className="spellerror_tc"></span>
                            <span className="spellerror_cp"></span>
                        </div>
                        <div className="np-trackchange">
                            <button className="btn cstm-primary-btn np-pervious cstm-spell-btn" title="Pre. Word">Prev Word</button>
                            <button className="btn cstm-primary-btn float-right np-next cstm-spell-btn" title="Next">Next Word</button>
                        </div>
                        <div className="validation-spellcheck"></div>
                        <div className="search-result-spell"></div>
                        <div className="row float-right pr-3">
                            <button className="btn cstm-primary-btn cstm-spell-btn" id="replace_sug">Replace All Matches</button>
                        </div>
                        <div className="clearfix"></div>
                        <div className="row float-right pr-3 pt-1">
                            <button className="btn cstm-primary-btn cstm-spell-btn" id="ignore_sug">Ignore</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SpellChecker;