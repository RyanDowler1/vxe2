import React from 'react';
import "../css/journals-main.css";
import "../css/journals-advance-search.css";
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import SearchResultComp from './SearchResultComp'
import $ from 'jquery';

class AdvanceSearch extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            checkedBoldVal: "boldfalse",
            checkedItalicVal: "italicfalse",
            checkedUnderlineVal: "underlinefalse",
            checkedSuperScriptVal: "superscriptfalse",
            checkedSubScriptVal: "subscriptfalse",
            checkedBoldRep: "boldfalse",
            checkedItalicRep: "italicfalse",
            checkedUnderlineRep: "underlinefalse",
            checkedSuperScriptRep: "superscriptfalse", 
            checkedSubScriptRep: "subscriptfalse",
            setPadding: "",
            findFormatResult: [],
            formattedSearchClear: false,
            replaceChecked: false,
            selAdvanceFind: '',
            selAdvanceReplace: '',
            tiggerReplaceAll: false,
            formatClear: false
        }
        // preserve the initial state in a new object
        this.baseState = this.state;
        this.resetState = this.resetState.bind(this);
    }

    resetState(){
        this.setState(this.baseState);
    }
    
    closeFindPanel(formatFilter){         
        if(formatFilter === 'formatFilter'){
            this.setState(this.baseState);
            setTimeout(()=> {
                this.clearFindFormattingResults();
            }, 500)
        } else{
            this.generalClearSearch();
        }                      
    }

    generalClearSearch () {            
        this.resetState();
        $("#content [style='background-color: rgb(188, 188, 190);']").removeAttr("style");
        $(".found[style='background-color: rgb(188, 188, 190);']").removeAttr("style");
        $("span.found").contents().unwrap();
        $('#content .found').removeClass('found');                            
        $('#search-result-id').html('');
        $(".btn-clear").addClass('hide');
        $(".search-result").css('padding','0px'); 
        $('.cstm-adv-srch input[type="checkbox"]').prop('checked', false);
        window.collapseFun();
        window.Journals.setRightSiderHeight();
    }

    clearFindFormattingResults() {                        
        $('.cstm-adv-srch input[type="checkbox"]').prop('checked', false);
        $('#content .add-highlights').removeClass('add-highlights');
        $("#content .find-res-cls").removeAttr("id");
        $('#content .find-res-cls').removeClass('find-res-cls');
        $('.search-result').removeClass('cstm-p-15');
        $('#search-result-id').html('');
        window.collapseFun();
        $(".btn-clear").addClass('hide');        
        this.setRightpanelHeight();
    }

    setRightpanelHeight() {
        let windowHeight = window.innerHeight;
        document.querySelector(".thumb-pdf").style.height = windowHeight+55 +"px";
    }

    resetFormattedSearch() {                
        $('.search-result').removeClass('cstm-p-15');
        $(".btn-clear").addClass('hide');
        $('#content .add-highlights').removeClass('add-highlights');
        $(".found, .find-res-cls").removeAttr("id");
        $('#content .find-res-cls').removeClass('find-res-cls');
        window.Journals.setRightSiderHeight();
    }

    findFormattingOption(event) {               
        let val = event.target.value;
        let targetEle = event.target;
        switch(val) {
            case "boldtrue":                
                this.setState({checkedBoldVal: "boldnull"});
                targetEle.indeterminate = true;
                break;
            case "boldfalse":
                this.setState({checkedBoldVal: "boldtrue"});
                targetEle.checked = true;
                break;
            case "boldnull":
                this.setState({checkedBoldVal: "boldfalse"});
                targetEle.checked = false;
                break;
            case "italictrue":
                this.setState({checkedItalicVal: "italicnull"});
                targetEle.indeterminate = true;
                break;
            case "italicfalse":
                this.setState({checkedItalicVal: "italictrue"});
                targetEle.checked = true;
                break;
            case "italicnull":
                this.setState({checkedItalicVal: "italicfalse"});
                targetEle.checked = false;
                break;
            case "underlinetrue":
                this.setState({checkedUnderlineVal: "underlinenull"});
                targetEle.indeterminate = true;
                break;
            case "underlinefalse":
                this.setState({checkedUnderlineVal: "underlinetrue"});
                targetEle.checked = true;
                break;
            case "underlinenull":
                this.setState({checkedUnderlineVal: "underlinefalse"});
                targetEle.checked = false;
                break;
            case "superscripttrue":
                this.setState({checkedSuperScriptVal: "superscriptnull"});
                targetEle.indeterminate = true;
                break;
            case "superscriptfalse":
                this.setState({checkedSuperScriptVal: "superscripttrue"});
                targetEle.checked = true;                
                break;
            case "superscriptnull":
                this.setState({checkedSuperScriptVal: "superscriptfalse"});
                targetEle.checked = false;
                break;
            case "subscripttrue":
                this.setState({checkedSubScriptVal: "subscriptnull"});
                targetEle.indeterminate = true;
                break;
            case "subscriptfalse":
                this.setState({checkedSubScriptVal: "subscripttrue"});
                targetEle.checked = true;
                break;            
            case "subscriptnull":
                this.setState({checkedSubScriptVal: "subscriptfalse"});
                targetEle.checked = false;
                break;            
          }                   
          if((document.getElementById('find').value === "" ) &&  (val === "boldfalse" || val === "boldtrue" || val === "boldnull" || val === "italicfalse" || val === "italictrue" || val === "italicnull" || val === "underlinefalse" || val === "underlinetrue" || val === "underlinenull" || val === "superscriptfalse" || val === "superscripttrue" || val === "superscriptnull" || val === "subscripttrue" ||val === "subscriptfalse" || val === "subscriptnull")){              
            if(targetEle.checked === true || targetEle.indeterminate === true){
              let filterFormat = true;
              this.findInit('', filterFormat);
              this.showReplaceOptionFormattedTxt();
            }
        }
        else{            
          this.resetFormattedSearch(true);
          this.findReplaceAction();
        }
  }

  replaceFormattingOption(event) {
      debugger;
        let val = event.target.value;
        switch(val) {
            case "boldtrue":
                this.setState({checkedBoldRep: "boldfalse"});
                break;
            case "boldfalse":
                this.setState({checkedBoldRep: "boldtrue"});
                break;
            case "italictrue":
                this.setState({checkedItalicRep: "italicfalse"});
                break;
            case "italicfalse":
                this.setState({checkedItalicRep: "italictrue"});
                break;
            case "underlinetrue":
                this.setState({checkedUnderlineRep: "underlinefalse"});
                break;
            case "underlinefalse":
                this.setState({checkedUnderlineRep: "underlinetrue"});
                break;
            case "superscripttrue":
                this.setState({checkedSuperScriptRep: "superscriptfalse"});
                break;
            case "superscriptfalse":
                this.setState({checkedSuperScriptRep: "superscripttrue"});
                break;
            case "subscripttrue":
                this.setState({checkedSubScriptRep: "subscriptfalse"});
                break;
            case "subscriptfalse":
                this.setState({checkedSubScriptRep: "subscripttrue"});
                break;            
          }  
          if((document.getElementById('replace').value === "" && document.getElementById('find').value === "" ) && (val === "boldfalse" || val === "italicfalse")){
              this.showReplaceOptionFormattedTxt();
          } else {
            //   this.selectattime(event);
          }
    }

    showReplaceOptionFormattedTxt() {
        let findCheckedLen = 0;
        let replaceCheckedLen = 0;
        let filterSelFind, filterSelReplace;
        Array.from(document.querySelectorAll('.find-filters .form-check-input')).forEach((data) =>{
            let checkFindId = data.attributes['id'].value;
            if( checkFindId === "bold_character" || checkFindId === "italic_character"){
                if(data.checked === true){
                    findCheckedLen++;
                    filterSelFind = data.attributes['id'].value;
                }
            }
        })
        Array.from(document.querySelectorAll('.replace-filters .form-check-input')).forEach((data) =>{
            let checkReplaceId = data.attributes['id'].value;
            if( checkReplaceId === "bold_characterrep" || checkReplaceId === "italic_characterrep"){
                if(data.checked === true){
                    replaceCheckedLen++;
                    filterSelReplace = data.attributes['id'].value;
                }
            }
        })       
        if(findCheckedLen === 1 && replaceCheckedLen === 1){     
            this.setState({replaceChecked: true, selAdvanceFind: filterSelFind, selAdvanceReplace: filterSelReplace});
        }
    }

    selectattime(event) {
        let selectOptionReplace = Array.from(document.querySelectorAll(".replace-options input"));
        let shouldStateChange = false;
        selectOptionReplace.forEach((item) => {
            if(item.id != event.target.id){
                item.checked = false;
                shouldStateChange = true;
            }
        });
        if(shouldStateChange  && !this.state.replaceChecked)
            this.setState(this.baseState);        
    }    
    
    selectReplaceOpt(event) {         
        this.setState(this.baseState);
        let selectOptionReplace = Array.from(document.querySelectorAll(".replace-options-2 input"));
        selectOptionReplace.forEach((item) => {
            if(item.id != event.target.id)
                item.checked = false;                     
        });             
    }

    findReplaceAction(){        
        setTimeout(() => {            
            window.findPanelSearch("pdf-editor");
        },500);        
    }

    findInit(e, filterFormat){
        let rootEle = "pdf-editor";
        if (((!(!e) && e.key === 'Enter') || filterFormat) && document.getElementById('find').value === ""){
            let findCheckFields = document.querySelectorAll('.find-filters .form-check-input');
            let formattingTags = [];
            Array.from(findCheckFields).forEach((data, index) => {
                if(data.checked === true && (data.id === 'bold_character' || data.id === 'italic_character' || data.id === 'superscript_character' || data.id === 'subscript_character' || data.id === 'underline_character')){
                    formattingTags.push(data.attributes['id'].value);
                }
            })
            if(formattingTags.length > 1){
                this.findMultiTxt(formattingTags);
            } else{
                this.findTxt(formattingTags);
            }

        } else if(document.getElementById('find').value !== "" && (!(!e) && e.key === 'Enter')){            
            this.setState({formattedSearchClear: false});
            this.resetFormattedSearch();
            setTimeout(() => {
                window.findPanelSearch(rootEle);
            }, 1000);
            
        } else {
            $("#findPanelText").val($("#find").val());
            $("#findPanelTextinside").val($("#find").val());
        }
    }

    findTxt(tagName){
        this.resetFormattedSearch();        
        let formatRes = [];
        tagName.forEach((data)=> {
            let tag;
            switch(data){
                case 'bold_character':
                    tag = 'b';
                    break;
                case 'italic_character':
                    tag = 'i';
                    break;
                case 'superscript_character':
                    tag = 'sup';
                    break;
                case 'subscript_character':
                    tag = 'sub';
                    break;
                case 'underline_character':
                    tag = 'u';
                    break;
            }
            let selTag = document.getElementById('content').getElementsByTagName(tag);
            if(!(!selTag))
                formatRes.push(Array.from(selTag));
        })  
        let newClassName = 'cstm-p-15 ';
        let mergeFilter = [].concat.apply([], formatRes);
        this.setState({findFormatResult: mergeFilter, setPadding: newClassName, formattedSearchClear: true, replaceChecked: false});
    }

    findMultiTxt(tagName){
        this.resetFormattedSearch();
        let formatRes = [];
        tagName.forEach((data)=> {
            let tag;
            switch(data){
                case 'bold_character':
                    tag = 'b';
                    break;
                case 'italic_character':
                    tag = 'i';
                    break;
                case 'superscript_character':
                    tag = 'sup';
                    break;
                case 'subscript_character':
                    tag = 'sub';
                    break;
                case 'underline_character':
                    tag = 'u';
                    break;
            }            
            formatRes.push(Array.from(tag));
        }) 
        let mergeFilter = [].concat.apply([], formatRes);

        let selectedMultiTag = [];
        mergeFilter.forEach((data, index)=> {    
            let selTag = Array.from(document.getElementById('content').getElementsByTagName(data));
            if(document.getElementById('content').getElementsByTagName(data).length > 0){
                selTag.forEach((data2) => {
                    let selChild = data2.children;
                    let childLen = selChild.length;
                    if(childLen > 0 ){                        
                        mergeFilter.forEach((dat, ind)=> { 
                            if(selChild[0].tagName.toLowerCase() === dat){
                                if(!(!selTag[index]))
                                selectedMultiTag.push(Array.from(selChild));
                            }
                        })                
                    }
                })
            }
        })
        let newClassName = 'cstm-p-15 ';
        let selMutli = [].concat.apply([], selectedMultiTag);
        this.setState({findFormatResult: selMutli, setPadding: newClassName, formattedSearchClear: true, replaceChecked: false});
    }

    replaceAllAction() {
        if(this.state.replaceChecked){
            this.setState({tiggerReplaceAll: true});            
        } else{
            window.replace_allcontent();
        }         
    }

    render() {                
        const {checkedBoldVal, checkedItalicVal, checkedUnderlineVal, checkedSuperScriptVal, checkedSubScriptVal, 
            checkedBoldRep, checkedItalicRep, checkedUnderlineRep, checkedSuperScriptRep, checkedSubScriptRep} = this.state;            
        return (  
            <div className="cstm-adv-srch-bdy p-3 mt-2">                                                                      
                <div className=" row cstm-pos-r">       
                            
                    <div className="col-10 pr-0">
                        <input type="text" className="form-control" autoComplete="off" id="find" name="Find" placeholder="Find" onKeyPress={(e) => this.findInit(e)}/>
                        <i className="material-icons" id="findBtn">search</i>
                    </div>
                    
                    <Accordion defaultActiveKey="0" className="w-100">                                
                        <Accordion.Toggle as={Button} variant="link" eventKey="1" className="cstm-hum-pos">
                        <i className="material-icons-outlined">more_vert</i>
                        </Accordion.Toggle>                    
                        <Accordion.Collapse eventKey="1" id="main-search-div">
                        <div className="col-12">
                        {this.props.ProjectId !== "244616" &&
                            <Accordion defaultActiveKey="2" className="my-0 cstm-adv-srch float-left">                                
                            <Accordion.Toggle as={Button} variant="link" eventKey="3" className="cstm-adv-srch-btn">
                                Advanced Options <i className="material-icons">keyboard_arrow_down</i>
                            </Accordion.Toggle>                    
                            <Accordion.Collapse eventKey="3">
                            <Form.Group controlId="formBasicCheckbox" className="px-2  find-filters">                            
                                <div className="find-filter">
                                    <Form.Check type="checkbox" className="findnreplace_checkbok" label="Match case" id="match_case" value="1" />                                                                          
                                    <Form.Check type="checkbox" className="findnreplace_checkbok" label="Match whole word" id="match_whole" value="2" />
                                    <Form.Check type="checkbox" className="findnreplace_checkbok" label="Bold" id="bold_character" onChange= {(event) =>this.findFormattingOption(event)} value={checkedBoldVal} />
                                    <Form.Check type="checkbox" className="findnreplace_checkbok" label="Italic" id="italic_character" value={checkedItalicVal} onChange={(event) =>this.findFormattingOption(event)}/>
                                </div>
                                <div className="find-filter-2">
                                    <Form.Check type="checkbox" className="findnreplace_checkbok" label="Wildcard" id="wildcard_search" value="3" />
                                    <Form.Check type="checkbox" className="findnreplace_checkbok" label="Underline" id="underline_character" value={checkedUnderlineVal} onChange={(event) => this.findFormattingOption(event)}/>
                                    <Form.Check type="checkbox" className="findnreplace_checkbok" label="Subscript" id="subscript_character" value={checkedSubScriptVal} onChange={(event) =>this.findFormattingOption(event)}/>
                                    <Form.Check type="checkbox" className="findnreplace_checkbok" label="Superscript" id="superscript_character" value={checkedSuperScriptVal} onChange={(event) =>this.findFormattingOption(event)}/>
                                </div>
                            </Form.Group>              
                            </Accordion.Collapse>  
                            </Accordion>
                        }
                        <div className="clearfix"></div> <hr className="cstm-m-0-6"/>
                            <div className="col-12 p-0">
                                <input type="text" className="form-control" id="replace" name="Replace" placeholder="Replace" />
                                {/* <i className="fa fa-clone replace-icon-pos" id="replaceBtn"></i>     */}
                            </div>
                            {this.props.ProjectId !== "244616" &&
                            <Accordion defaultActiveKey="3" className="my-0 cstm-adv-srch float-left">                                
                            <Accordion.Toggle as={Button} variant="link" eventKey="4" className="cstm-adv-srch-btn">
                                Advanced Options <i className="material-icons">keyboard_arrow_down</i>
                            </Accordion.Toggle>                    
                            <Accordion.Collapse eventKey="4">                  
                                <Form.Group controlId="formBasicCheckbox" className="px-2 pb-5 replace-filters">
                                <div className="find-filter replace-options">
                                    <Form.Check type="checkbox" className="findnreplace_checkbok selectattime" label="Bold" id="bold_characterrep" onChange={(event) => {this.replaceFormattingOption(event)}}  value={checkedBoldRep}/>
                                    <Form.Check type="checkbox" className="findnreplace_checkbok selectattime" label="Italic" id="italic_characterrep" onChange={(event)=> {this.replaceFormattingOption(event)}} value={checkedItalicRep}/> 
                                    <Form.Check type="checkbox" className="findnreplace_checkbok selectattime" label="Underline" id="underline_characterrep" onChange={(event)=> {this.replaceFormattingOption(event)}} value={checkedUnderlineRep}/>
                                    <Form.Check type="checkbox" className="findnreplace_checkbok selectattime" label="Superscript" id="superscript_characterrep" onChange={(event)=> {this.replaceFormattingOption(event)}}  value={checkedSuperScriptRep}/>
                                    <Form.Check type="checkbox" className="findnreplace_checkbok selectattime" label="Subscript" id="subscript_characterrep" onChange={(event)=> {this.replaceFormattingOption(event)}} value={checkedSubScriptRep}/>
                                </div>
                                <div className="find-filter-2 replace-options-2">
                                    <Form.Check type="checkbox" className="findnreplace_checkbok selectattimecase" label="Wildcard" id="wildcard_rep" value="wildcard" onChange={(event) => {this.selectReplaceOpt(event)}} />
                                    <Form.Check type="checkbox" className="findnreplace_checkbok selectattimecase" label="Sentence case" id="sentence_case" value="sentenceCase" onChange={(event)=> {this.selectReplaceOpt(event)}} />
                                    <Form.Check type="checkbox" className="findnreplace_checkbok selectattimecase" label="Uppercase" id="to_uppercase" value="uppercase" onChange={(event)=> {this.selectReplaceOpt(event)}} />                                                                        
                                    <Form.Check type="checkbox" className="findnreplace_checkbok selectattimecase" label="Lowercase" id="to_lowercase" value="lowercase" onChange={(event)=> {this.selectReplaceOpt(event)}} />
                                    <Form.Check type="checkbox" className="findnreplace_checkbok selectattimecase" label="Capitalize Word" id="capitalize_eachword" value="capitalize" onChange={(event)=> {this.selectReplaceOpt(event)}} />
                                </div>
                                <button type="button" className="replace-all-btn" id="replaceAllBtn" aria-label="Close" onClick={() => this.replaceAllAction()}>
                                    Replace All
                                </button>
                                </Form.Group>
                                
                            </Accordion.Collapse>  
                            </Accordion> 
                            }
                            {this.props.ProjectId === "244616" &&
                            <button type="button" className="replace-all-btn oup-replace-all" id="replaceAllBtn" aria-label="Close" onClick={() => this.closeFindPanel()}>
                                    Replace All
                            </button>
                            }
                        </div>
                    </Accordion.Collapse>
                    </Accordion>
                    <div className={"search-result " + this.state.setPadding} id="search-result-id">
                        {this.state.formattedSearchClear &&
                            <SearchResultComp 
                                findFormatResults= {this.state.findFormatResult}
                                replaceChecked={this.state.replaceChecked}
                                selAdvanceFind={this.state.selAdvanceFind}
                                selAdvanceReplace={this.state.selAdvanceReplace}
                                tiggerReplaceAll={this.state.tiggerReplaceAll}
                                formatClear={this.state.formatClear}
                                resetState={this.resetState}
                            />
                        } 
                    </div>
                    <div className="w-100">
                    <button type="button" className="btn-clear close close-pos hide" aria-label="Close" onClick={() => this.closeFindPanel(this.state.formattedSearchClear ? 'formatFilter': "")}>
                            Clear Search
                        </button>
                    </div>                   
                </div>                                                     
            </div>                                       
        );
    }
}

export default AdvanceSearch;
