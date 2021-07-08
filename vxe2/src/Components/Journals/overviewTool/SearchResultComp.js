import React from 'react';
import $ from 'jquery';

class SearchResultComp extends React.Component {
    constructor(props) {                
        super(props);        
        this.state = {  
            showReplace : false
        }                        
    }

    componentDidMount() {
    }

    componentWillReceiveProps(prevProps) {        
        if(prevProps.replaceChecked === true){
            this.setState({showReplace: true});            
        }
        if(prevProps.tiggerReplaceAll === true){
            this.replaceAllFormattedTxt();
        }        
    }

    replaceAllFormattedTxt(){                        
        let replaceList = document.getElementById('search-result-id');
        replaceList = replaceList.getElementsByClassName('result-row');
        Array.from(replaceList).forEach((data, index) => {            
            this.singleReplace(data,'find-res-'+index, true);
        })        
        this.props.resetState();
        window.autosavefunction_vxe();
    }

    singleReplace(e, selId, isReplaceAll) {
        let selFindFilter = this.props.selAdvanceFind;
        let selReplaceFilter = this.props.selAdvanceReplace;
        let findTag;
        switch(selFindFilter){
            case 'bold_character':
                findTag = 'b';
                break;
            case 'italic_character':
                findTag = 'i';
                break;
        }

        let replaceTag;
        switch(selReplaceFilter){
            case 'bold_characterrep':
                replaceTag = 'b';
                break;
            case 'italic_characterrep':
                replaceTag = 'i';
                break;
        }        
        
        if(findTag !== replaceTag){
            let findNode = document.getElementById(selId);
            if(!(!findNode)){                
                let selHtml = document.getElementById(selId).innerHTML;
                let replaceNode = document.createElement(replaceTag);
                replaceNode.innerHTML = selHtml;
                Array.from(document.getElementById(selId).attributes).forEach( (data) => {
                    replaceNode.setAttribute(data.name, data.value);
                });
                let findParNode = document.getElementById(selId).parentNode;
                findParNode.replaceChild(replaceNode, findNode);
                replaceNode.classList.remove('find-res-cls', 'add-highlights');
                replaceNode.removeAttribute('id');                
                if(!isReplaceAll){
                    e.target.closest('.result-row').remove();
                    window.autosavefunction_vxe();
                }
            }
        }
    }

    render() {          
        if(!(!this.props.findFormatResults) && this.props.findFormatResults.length > 0){
            document.getElementsByClassName("btn-clear")[0].classList.remove('hide');
            return (
            <>
            <div className="searchCount">Matches {this.props.findFormatResults.length}</div>
            {this.props.findFormatResults.map((data, index) => {
                data.classList.add('add-highlights');
                data.classList.add('find-res-cls');
                data.setAttribute('id','find-res-'+index);
                if(data.innerText !== ""){
                    let formatStyle;
                    switch(data.tagName) {
                    case "B":
                        formatStyle = "bold_res";
                        break;
                    case "I":
                        formatStyle = "italic_res";
                        break;
                    case "U":
                        formatStyle = "underLine_res";
                        break;
                    }
                return(
                <p onClick={() => window.scrollToViewContent('find-res-'+index)} className={"result-row " + formatStyle} key={index}>
                    <span className="searched-txt">
                        {data.innerText}
                    </span>
                    {this.state.showReplace &&
                    <span onClick={(e) => this.singleReplace(e, 'find-res-'+index, false)} className="replaceText_only">
                        <i className="fa fa-random find-replace-btn pl-2" title="Replace" aria-hidden="true"></i>                        
                    </span>
                    }
                </p>
                );
                }
            })}
            </>
            )
        } else {
            return(
            <div className="find-no-result">
            <p>No Results Found</p>
            </div>
            );
        }
    }
}

export default SearchResultComp;