import React from 'react';
import NewAuthorTemplate from './articalComponents/new-author';
import NewAffTemplate from './articalComponents/new-affiliation';
import NewFootTemplate from './articalComponents/new-footnote';
import NewHisTemplate from './articalComponents/new-history';
import $ from 'jquery'; 

class ArticleMetaPopup extends React.Component {
    constructor(props) {                
        super(props);        
        this.state = {
            date : new Date(),
            newAuthCount: [],
            newAffCount: [],
            newFootCount: [],
            newHisCount: [],
            newCitCount: [],
            selRow: [],
            id: '',            
            startRender: false,
        }                
    }

    addNewAuthor() {
        this.setState({newAuthCount: [...this.state.newAuthCount, 'aut' ]});
        this.setState({startRender: true});
    }

    addNewAff(e) {                        
        e.preventDefault();
        this.setState({newAffCount: [...this.state.newAffCount, 'aff' ]});
        this.setState({startRender: true});
        if($('.hide-first-sup').length> 0) {
            $('.hide-first-sup').removeClass('hide-first-sup');
        }            
    }

    addNewFootNote(e) {        
        this.setState({newFootCount: [...this.state.newFootCount, 'foot' ]});
        e.target.closest('#author-fn').classList.add("hide");
        this.setState({startRender: true});
    }    

    addNewHisNote() {
        this.setState({newHisCount: [...this.state.newHisCount, 'his' ]});
        this.setState({startRender: true});
    }

    addAuthorCition (rowId) {        
        let storeId = Date.parse(new Date()); 

        let addCitationTemp = '<div class="fm-separtor-form"><label class="popuplabel">Separaror:</label><div class="form-control meta-form has-new-fields" contenteditable="true" data-storeid="sup-'+storeId+'" data-tagname="XREF" data-label="Separaror">,</div></div><div class="fm-xref-form"><label class="popuplabel">Affiliation Citation: </label><div class="form-control meta-form newcitationlink has-new-fields" contenteditable="true" data-storeid="aff-'+storeId+'" data-tagname="XREF" data-label="Affiliation Citation"></div></div>';
        $('.fm-author-group[contrib-storeid="'+rowId+'"] .fm-delete-form').before(addCitationTemp);
        this.setState({startRender: true});
    }

    dragInit() {
        window.dragArticle();
    }    

    dragHis() {
        window.dragHistory();
    }

    deleteAuthorRow(e) {
        $(e.target).parents('.form-group').addClass("deleted-row hide");
    }

    orcidPopup (storeId) {
        window.orcidPopup(storeId);       
    }

    footNoteIns (rowId) {
        let storeId = Date.parse(new Date());
        let addFootTemp = '<div class="fm-separtor-form"><label class="popuplabel">Separaror:</label><div class="form-control meta-form has-new-fields" contenteditable="true" data-storeid="sup-'+storeId+'" data-tagname="XREF" data-label="Separaror">,</div></div><div class="fm-xref-form"><label class="popuplabel">Footnote Citation: </label><div class="form-control meta-form has-new-fields" contenteditable="true" data-storeid="foot-'+storeId+'" data-tagname="XREF" data-label="Footnote Citation"></div></div>';
        $('.fm-author-group[contrib-storeid="'+rowId+'"] .fm-delete-form').before(addFootTemp);
        let contentElement = document.getElementById('content');
        var metaDataElement = contentElement.querySelector('article-meta');
        let affEle = metaDataElement.querySelector('fn'),i;
        if(affEle === null){
            this.setState({newFootCount: [...this.state.newFootCount, 'foot' ]});
            var newFootnote = document.getElementById('author-fn');
            newFootnote.classList.add('hide');
        }
        this.setState({startRender: true});
    }

    checkDelSpan(chilDat) {   // Check Has Class Del
        return (" " + chilDat.childNodes[0].className + " ").replace(/[\n\t]/g, " ").indexOf(" del ") > -1 ?  false : true;
    }

    shouldComponentUpdate(nextProps, nextState){
        console.log(nextState);        
        if(nextProps.metadataEles.length === this.props.metadataEles.length && !this.state.startRender){            
            return false;
        } else {
            this.setState({startRender: false});
            return true;
        }
    }

    // getSnapshotBeforeUpdate(prevProps, prevState){
    //     console.log(prevState);
    // }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     console.log(snapshot);
    // }

    render() {              
        let i = 1; 
        let j=1;
        console.log('mani',j+1);
        return (    
            <>
            {this.props.metadataEles.map( (dat, index1) => {                 
                if(dat.tagName !== 'ABSTRACT1' && dat.tagName !== 'HR' && dat.tagName !=='KWD-GROUP'){
                    console.log('test');
                return(
                <div key={index1} className="main-row">
                    {dat.tagName === "ARTICLE-CATEGORIES" &&           
                        <div className="form-group art-categ">
                            <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Article Category:</label>
                            <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={dat.attributes['store'] && dat.attributes['store'].value} data-tagname="subject" id="fm-subject" dangerouslySetInnerHTML={{__html: dat.innerHTML}}></div>                        
                        </div>
                    }
                    {dat.tagName === "TITLE-GROUP" && 
                        <div className="form-group art-title">
                            <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Article Title:</label>
                            <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={dat.attributes['store'] && dat.attributes['store'].value} data-tagname="article-title" id="fm-article-title" spellCheck={false} dangerouslySetInnerHTML={{__html: dat.innerHTML}}></div>                        
                        </div>
                    }
                    {dat.tagName === "CONTRIB-GROUP" &&
                    <>
                        <div className="fm-author-label">Author(s):</div>
                        <div id="authorDrag" className="ui-sortable">
                            {Array.from(dat.children).map((chilDat, index2)=> {                        
                                // console.log('index2', index2)
                                if(chilDat.tagName === "CONTRIB" && this.checkDelSpan(chilDat)){
                                    let surName = false;
                                    let giveName = false;
                                    let surNameTxt, giveNameTxt, surnameId, giveNameId;                    
                                    if(chilDat.getElementsByTagName("SURNAME").length > 0)  { 
                                        surName = true;
                                        let surNameData = chilDat.getElementsByTagName("SURNAME")[0];                        
                                        surNameTxt = surNameData.innerHTML;
                                        surnameId = surNameData.attributes["store"];
                                        if(!(!surnameId))
                                            surnameId = surnameId.value;                        
                                    }                                        
                                    if(chilDat.getElementsByTagName("GIVEN-NAMES").length > 0){                        
                                        giveName = true;
                                        let giveNameData = chilDat.getElementsByTagName("GIVEN-NAMES")[0];
                                        giveNameTxt = giveNameData.innerHTML;
                                        giveNameId = giveNameData.attributes["store"];
                                        if(!(!giveNameId))
                                            giveNameId = giveNameId.value;
                                    }
                                    
                                    return(                                                                        
                                        <div className="form-group fm-author-group"  contrib-storeid={chilDat.attributes['store'].value} key={index2}>
                                            { surName && //Display Surname
                                            <div className="fm-author-form">
                                                <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Surname:</label>
                                                <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={surnameId} data-tagname="surname" data-label="Surname" spellCheck={false} dangerouslySetInnerHTML={{__html: surNameTxt}}>
                                                    
                                                </div>
                                            </div>
                                            }
                                            {giveName > 0 && //Display Give Name
                                            <div className="fm-given-form">
                                                <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Given Name:</label>
                                                <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={giveNameId} data-tagname="given-names" data-label="Given Name" spellCheck={false} dangerouslySetInnerHTML={{__html: giveNameTxt}}></div>
                                            </div>
                                            }                                            
                                            {Array.from(chilDat.children).map((subChild, index3) => {
                                                // console.log('index3', index3)
                                                let separateTag = false;
                                                let fnTag = false;
                                                let affTag = false;
                                                let fmClass;
                                                if(subChild.tagName === "SUP"){
                                                    fmClass ="fm-separtor-form";
                                                    separateTag = true;
                                                }                                                        
                                                if(subChild.tagName === "XREF" && subChild.attributes['ref-type'].value === 'fn'){
                                                    fmClass ="fm-xref-form";
                                                    fnTag = true;
                                                }                                                        
                                                if(subChild.tagName === "XREF" && subChild.attributes['ref-type'].value === 'aff'){
                                                    let supEle = subChild.getElementsByTagName('SUP');
                                                    if(supEle.length > 0){
                                                        subChild = supEle[0];
                                                    }
                                                    fmClass = "fm-xref-form";
                                                    affTag = true;
                                                }      
                                                if(affTag || separateTag || fnTag ) {
                                                    return(                                                
                                                    <div key={index3} className={fmClass}>                                                        
                                                        {affTag && //Display Citation
                                                            <>                                                        
                                                                <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Affiliation Citation:</label>
                                                                <div className="form-control meta-form citationlink" contentEditable={true} data-storeid={subChild.attributes['store'].value} data-tagname="XREF" onKeyUp={this.props.handleCitation} data-label="Affiliation Citation" dangerouslySetInnerHTML={{__html: subChild.innerHTML}}></div>                                                        
                                                            </>
                                                        }
                                                        {separateTag && //Display Separator
                                                            <>
                                                                <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Separator:</label>
                                                                <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={subChild.attributes['store'].value} data-tagname="XREF" data-label="Separaror" dangerouslySetInnerHTML={{__html: subChild.innerHTML}}></div>
                                                            </>
                                                        }
                                                        {fnTag &&
                                                            <>
                                                                <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Footnote Citation:</label>
                                                                <div className="form-control meta-form" contentEditable={true} data-storeid={subChild.attributes['store'].value} data-tagname="XREF" onKeyUp={this.props.handleCitation} data-label="Footnote Citation" dangerouslySetInnerHTML={{__html: subChild.innerHTML}}></div>
                                                            </>  
                                                        }
                                                    </div>
                                                    );
                                                }
                                            })                                                                                   
                                            }
                                            <div className="fm-delete-form">
                                                <span className="info-orcid" title="ORCID" onClick={() => this.orcidPopup(chilDat.attributes['store'].value)} spellCheck={false}>ORCID</span>
                                                <i className="material-icons-outlined new-footnote" title="Footnote" author-id="fm-author-1" author-storeid={chilDat.attributes['store'].value} onClick={()=> this.footNoteIns(chilDat.attributes['store'].value)}>insert_link</i>
                                                <i className="material-icons-outlined" title="New Citation" author-id="fm-author-1" author-storeid={chilDat.attributes['store'].value} onClick={() => this.addAuthorCition(chilDat.attributes['store'].value)}>add</i>
                                                <i className="material-icons-outlined" title="Delete" onClick={(e) => this.deleteAuthorRow(e)}>delete</i>
                                                <i className="material-icons-outlined author-drag ui-sortable-handle" title="Reorder" onMouseEnter={this.dragInit}>drag_indicator</i>
                                            </div>
                                        </div>              
                                    )    
                                }  
                            })}
                            
                            {Array.from(this.state.newAuthCount).map((data, index4) =>{                                               
                                return(                     
                                <NewAuthorTemplate 
                                newAuthCount = {data} id ={'00'+index4}  
                                footNoteIns= {this.footNoteIns}
                                addAuthorCition = {this.addAuthorCition}
                                dragInit = {this.dragInit}   
                                handleCitation={this.props.handleCitation}                     
                                key={index4}/>                    
                                )
                            })}

                        </div>

                        <div className="mb-2">
                            <span className="material-icons">add</span>
                            <span className="fm-new-label" spellCheck={false} onClick={() => this.addNewAuthor()}>New Author</span>
                        </div>

                        <div className="fm-author-label mb-3">Affiliation(s):</div>   
                        <div id="affDrag" className="ui-sortable aff-container">
                        {Array.from(dat.children).map((chilDat, index5)=> {                            
                            if(chilDat.tagName === "AFF" && this.checkDelSpan(chilDat)){               
                                let chilDatRow = chilDat;                                   
                                let subValues = [];
                                let affCont = [];
                                let haveSubNo = false;
                                Array.from(chilDatRow.childNodes).forEach((affData, ind) =>{                                
                                    if(ind === 0 && affData.tagName === 'SUP'){
                                        subValues.push(affData);
                                        haveSubNo = true;
                                    } else {
                                        let spanTag = document.createElement('span');
                                        if(affData.nodeType === 3){
                                            spanTag.innerHTML = affData.textContent; 
                                            affCont.push(spanTag.innerHTML);
                                        } else {
                                            affCont.push(affData.outerHTML);
                                        }
                                    }
                                })
                                affCont = affCont.join('');                                
                                return(                                            
                                <div className="form-group" aff-storeid={chilDat.attributes['store'].value} id={'aff'+index5} key={index5}>   
                                        {haveSubNo &&
                                            <>
                                            {Array.from(subValues).map((affDat, index6)=> {  
                                                // console.log('index6', index6);
                                            return(                                    
                                                <div className="fm-xref-form fm-xref-aff-form" key={index6}>
                                                    <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Affiliation Citation:</label>
                                                    <div className="form-control meta-form"  contentEditable={false} suppressContentEditableWarning={false} data-storeid={!(!affDat.attributes['store']) && affDat.attributes['store'].value} data-tagname="XREF" spellCheck={false} dangerouslySetInnerHTML={{__html: affDat.innerHTML}}>
                                                    </div>
                                                </div>
                                                )
                                            }) }
                                            </>
                                        }
                                        {haveSubNo === false &&                                                                         
                                            <div className="fm-xref-form fm-xref-aff-form first-sup hide-first-sup">
                                                <label className="popuplabel">Affiliation Citation:</label>
                                                <div className="form-control meta-form"  contentEditable={false} suppressContentEditableWarning={false} data-storeid={'sup-' + Date.parse(new Date())} data-tagname="XREF" spellCheck={false}>1
                                                </div>
                                            </div>                                        
                                        }   
                                        <div className="fm-aff-form aff-container">
                                            <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Affiliation {i++}</label>
                                            <div className="form-control meta-form aff-box" contentEditable={true} suppressContentEditableWarning={true} data-storeid={chilDat.attributes['store'].value} data-tagname="aff" spellCheck={false} dangerouslySetInnerHTML={{__html: affCont}}>                   
                                            </div>
                                        </div>                                
                                    <div className="fm-delete-form">
                                        <i className="material-icons-outlined" title="Delete" onClick={this.props.deleteAff}>delete</i>
                                    </div>
                                </div>                            
                                );
                            }
                        })}
                                        
                        {this.state.newAffCount.length > 0 &&
                        <>
                        {Array.from(this.state.newAffCount).map((data, index7) =>{                            
                            return(                     
                            <NewAffTemplate newAffCount = {data} id ={'00'+index7} key={index7} />                    
                            )
                        })}
                        </>
                        }
                        </div> 

                        <div className="mb-2">
                            <span className="material-icons">add</span>
                            <span className="fm-new-label" spellCheck={false} onClick={(e) => this.addNewAff(e)}>New Affiliation</span>
                        </div>
                    </>
                    }

                    {dat.tagName === "AUTHOR-NOTES" &&
                    <>                    
                    {Array.from(dat.children).map((corrDat, index8)=> {                       
                        if(corrDat.tagName === "CORRESP"){
                            return(
                                <div className="form-group" id="notes" key={index8}>
                                    <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Correspondence:</label>
                                    <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={corrDat.attributes['store'].value} data-tagname="CORRESP" spellCheck={false} dangerouslySetInnerHTML={{__html: corrDat.innerHTML}}>                                    
                                    </div>
                                </div>
                            )
                        }
                        if(corrDat.tagName === "FN"){
                            return(
                                <div className="form-group" id="footnote" key={index8}>
                                    <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Footnote:</label>
                                    <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={corrDat.attributes['store'].value} data-tagname="FN" spellCheck={false} dangerouslySetInnerHTML={{__html: corrDat.innerHTML}}>                                    
                                    </div>
                                </div>
                            )
                        }
                    })}  

                    {Array.from(this.state.newFootCount).map((data, index9) =>{                    
                        return(                     
                            <NewFootTemplate newFootCount = {data} id ={'00'+index9} key={index9}/>
                        )
                    })}
                    {dat.getElementsByTagName("FN").length === 0 &&
                        <div className="mb-2" id="author-fn">
                            <span className="material-icons">add</span>
                            <span className="fm-new-label" spellCheck={false} onClick={(e) => this.addNewFootNote(e)}>New Footnote</span>
                        </div>
                    }
                    </>
                }

                {dat.tagName === "PERMISSIONS" &&
                    <>
                        <div className="fm-author-label mb-3">Copyright Information:</div>
                        {Array.from(dat.children).map((permissionDat, index10) => {
                            let permissintag = permissionDat.tagName;
                            if(permissintag === 'COPYRIGHT-STATEMENT' || permissintag  === 'COPYRIGHT-YEAR' || permissintag === 'VOL' || permissintag === 'ISS'){
                            return(
                                <div key={index10} className="form-group">
                                    {permissintag === 'COPYRIGHT-STATEMENT' && 
                                        <>
                                            <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Copyright Statement:</label>
                                            <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={permissionDat.attributes['store'].value} data-tagname="LPAGE" dangerouslySetInnerHTML={{__html: permissionDat.innerHTML}}>
                                            </div>
                                        </>
                                    }

                                    {permissintag === 'COPYRIGHT-YEAR' && 
                                        <>
                                            <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Copyright Year:</label>
                                            <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={permissionDat.attributes['store'].value} data-tagname="LPAGE" dangerouslySetInnerHTML={{__html: permissionDat.innerHTML}}>
                                            </div>
                                        </>
                                    }

                                    {permissintag === 'VOL' && 
                                        <>
                                            <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Volume:</label>
                                            <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={permissionDat.attributes['store'].value} data-tagname="LPAGE" dangerouslySetInnerHTML={{__html: permissionDat.innerHTML}}>
                                            </div>
                                        </>
                                    }

                                    {permissintag === 'ISS' && 
                                        <>                                        
                                            <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Issue:</label>
                                            <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={permissionDat.attributes['store'].value} data-tagname="LPAGE" dangerouslySetInnerHTML={{__html: permissionDat.innerHTML}}>
                                            </div>                                        
                                        </>
                                    }
                                </div>
                            )
                            }
                        })}                    
                    </>
                }

                {dat.tagName === "HISTORY" &&
                <>
                <div className="fm-author-label mb-3">History Information:</div>
                <div id="hisDrag" className="ui-sortable">
                {Array.from(dat.children).map((hisDat, index11) => {                         
                    return(
                        <>
                        <div className="form-group fm-author-group" date-cont-storeid={hisDat.attributes['store'].value} key={index11}>   
                            {Array.from(hisDat.childNodes).map((dateDat, index12) => {                                      
                                return(
                                <>                                                                    
                                    {dateDat.nodeName === "#text" &&                                
                                    <div className="fm-author-form fm-his-form" key={index12}>
                                        <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Date:</label>
                                        <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={hisDat.attributes['store'].value} data-tagname="history" data-label="Date">
                                                {dateDat.textContent}
                                        </div>
                                    </div>
                                    }
                                </>
                                )
                            })}
                            {Array.from(hisDat.children).map((dateDat, index13) => {                                   
                                return(                                
                                <div className="fm-author-form" key={index13}>
                                    {dateDat.getElementsByTagName("DAY").length > 0 &&
                                        <>
                                            <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Day:</label>
                                            <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={Array.from(dateDat.getElementsByTagName("DAY"))[0].attributes['store'].value} data-tagname="DAY" data-label="Day" dangerouslySetInnerHTML={{__html: Array.from(dateDat.getElementsByTagName("DAY"))[0].innerHTML}}>                                            
                                            </div>
                                        </>                                    
                                    }

                                    {dateDat.getElementsByTagName("MONTH").length > 0 &&                                     
                                        <>
                                        <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Month:</label>
                                        <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={Array.from(dateDat.getElementsByTagName("MONTH"))[0].attributes['store'].value}data-tagname="MONTH" data-label="Month" dangerouslySetInnerHTML={{__html: Array.from(dateDat.getElementsByTagName("MONTH"))[0].innerHTML}}>                                            
                                        </div>
                                        </>                                    
                                    }

                                    {dateDat.getElementsByTagName("YEAR").length > 0 &&                                     
                                        <>
                                        <label spellCheck={false} contentEditable={false} suppressContentEditableWarning={false}  className="popuplabel">Year:</label>
                                        <div className="form-control meta-form" contentEditable={true} suppressContentEditableWarning={true} data-storeid={Array.from(dateDat.getElementsByTagName("YEAR"))[0].attributes['store'].value}data-tagname="YEAR" data-label="Year" dangerouslySetInnerHTML={{__html: Array.from(dateDat.getElementsByTagName("YEAR"))[0].innerHTML}}>                                            
                                        </div>                                    
                                        </>
                                    }
                                </div>
                                )
                            })}
                            
                            
                            <div className="fm-delete-form">
                                <i className="material-icons-outlined" title="Delete" onClick={() => window.deleteMetaAuthor()}>delete</i>
                                <i className="material-icons-outlined his-drag ui-sortable-handle" title="Reorder" onMouseEnter={this.dragHis}>drag_indicator</i>
                            </div>
                        </div>
                        </>           
                    )
                })}
                </div> 

                {Array.from(this.state.newHisCount).map((data, index14) =>{                    
                    return(                     
                    <NewHisTemplate newHisCount = {data} id ={'00'+index14} key={index14}/>
                    )
                })}

                <div className="mb-2" id="author-history">
                    <span className="material-icons">add</span>
                    <span className="fm-new-label" spellCheck={false} onClick={(e) => this.addNewHisNote(e)}>New History</span>
                </div>  
                </>
                }  
                </div>                                 
                );
                }
                })}  
            </>
        );           
    }
}

export default ArticleMetaPopup;
