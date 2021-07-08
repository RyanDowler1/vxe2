import React from 'react';
import $ from 'jquery';

class ContentValidation extends React.Component{
    constructor(props){
        super(props);
        this.closeContentValidation = this.closeContentValidation.bind(this);
    }

    closeContentValidation(){                             
        let close = false;
        this.props.contentVali(close);
        this.closeFindPanel();
    }

    closeFindPanel(){
        $("#content [style='background-color: rgb(188, 188, 190);']").removeAttr("style");
        $(".found[style='background-color: rgb(188, 188, 190);']").removeAttr("style");  
        $(".found").removeAttr("id");  
        $("span.found").contents().unwrap();
        $('#content *').removeClass('found');
        $('.cstm-adv-srch input[type="checkbox"]').prop('checked', false);
        $('.cstm-adv-srch-bdy input').val("");
        $('.collapse').removeClass('show');
        $('#search-result-id').html('');
        $(".btn-clear").addClass('hide');
        $(".search-result").css('padding','0px');
        window.Journals.setRightSiderHeight();
    }

    render(){
        return(
            <div className={this.props.setClass +" row"}>
                <div className="header-ds">
                    <h6>Content Validation</h6>
                    <button type="button" className="close w-10 close-pos" aria-label="Close">
                        <i className="material-icons text-right cstm-close" onClick={this.closeContentValidation}>close</i>
                    </button>
                </div>
                <div className="contentvali-response body-ds">
                    {this.props.contentValidationVal.map((contVal, index) => {                                                                        
                        let contValChil = contVal.value;
                        let contentValListLen = contValChil.length;
                        let contentValidationTitle = contVal.title;
                        if(contentValidationTitle === "List Para")
                            contentValidationTitle = "List as Para";
                        return (
                            <div className="content-row" index={index}>
                            <h2 className="validation-title">{contentValidationTitle +'('+contentValListLen+')'}</h2>
                            <ol id="Unlinked-Years">
                            {                             
                            Array.from(contValChil).map((contChildVal, index2) => {                                 
                                let contentValicontent = "";                                
                                if(contChildVal.value !== undefined){                                    
                                    let subDataTit = contChildVal.subtitle;
                                    let subDataVal = contChildVal.value;                                    
                                    if(subDataTit != undefined){
                                        contentValicontent = subDataTit;                                                                           
                                        return (                                                                          
                                            <li index={index2}><h4 className="validation-ref">{ contentValicontent}</h4>
                                            <ul className="ref-ul">
                                                { Array.from(subDataVal).map((missedEleList, index3) => {
                                                    let passParam;
                                                    let notExist = false;
                                                    let disableCursor = false;
                                                    if(missedEleList.length < 20)
                                                        passParam = missedEleList.substring(0, missedEleList.length).toString().trim();                                      
                                                    else
                                                        passParam = missedEleList.substring(0, 20).toString().trim();                                                        
                                                    if(missedEleList === "Element is not exist"){
                                                        notExist = true;
                                                        disableCursor = true;
                                                    }                                                        
                                                    if(passParam.split(':').length > 1){
                                                        passParam = passParam.split(':')[0];
                                                        passParam.toString().trim();
                                                    }
                                                    return(
                                                        <li className={disableCursor + "validation-li"} index={index3}>                                                        
                                                        {!notExist &&
                                                        <a className="validation-value" onClick={() => window.style_editing_search(passParam)}>
                                                            {missedEleList}
                                                        </a>
                                                        }
                                                        {notExist &&
                                                        <a className="validation-value disble-cursor">
                                                            {missedEleList}
                                                        </a>
                                                        }
                                                        </li>
                                                    );
                                                }) }                                                
                                            </ul>
                                            </li>                                                      
                                        );                                      
                                    } else {
                                        contentValicontent = subDataVal;                                          
                                        // let listVal = contentValicontent.replace( /[\r\n]+/gm, "" ).split(" ").join("");
                                        let passParam;
                                        if(contentValicontent.length < 20)
                                            passParam = contentValicontent.substring(0, contentValicontent.length).toString().trim();                                      
                                        else
                                            passParam = contentValicontent.substring(0, 20).toString().trim();
                                        if(passParam.split(':').length > 1){
                                            passParam = passParam.split(':')[0];
                                            passParam.toString().trim();
                                        }
                                        return (                                     
                                            <li index={index2}><a className="validation-value" onClick={() => window.style_editing_search(passParam)}>{ contentValicontent}</a></li>                                 
                                        );
                                    }                                                                        
                                } else {                                      
                                    contentValicontent = contChildVal;
                                    let passParam = contentValicontent;
                                    if(passParam.split(':').length > 1){
                                        passParam = passParam.split(':')[0];
                                        passParam.toString().trim();
                                    }
                                    return (                                     
                                        <li index={index}><a className="validation-value" onClick={() => window.style_editing_search(passParam)}>{ contentValicontent}</a></li>
                                    );
                                }
                            })                                                    
                            }
                            </ol>
                            </div>          
                        );                                                                                                
                    }
                    )}                    
                </div> 
            </div>
        );
    }
}


export default ContentValidation;