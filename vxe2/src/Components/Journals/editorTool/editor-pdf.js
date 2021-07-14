import React from 'react';
import "../css/journals-main.css";
import "../css/journals-editor-style.css";
import BreadCrumbTrigger from '../breadCrumb/breadcrumb-trigger';
import $ from 'jquery'; 

class PdfEditor extends React.Component {   

    componentDidUpdate() {        
        this.editContent();
    }

    editContent() {
        window.storedata = function (localdata_set,enter_key) {	
            var increment_local = 1;
            var totalvalue = +increment_local + +localdata_set;
            $('.localstorevalue').val(totalvalue);
            $('.localstoregetvalue').val(totalvalue);
            $('.limitforredovalue').val(totalvalue);
            $('.undoicon').css("pointer-events","");
            $('.undoicon').css("opacity","");
            var parentEl = null, sel;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.rangeCount) {
                    parentEl = sel.getRangeAt(0).commonAncestorContainer;
                    if (parentEl.nodeType != 1)
                        parentEl = parentEl.parentNode;   
                }
            } else if ( (sel = document.selection) && sel.type != "Control")
                parentEl = sel.createRange().parentElement();
            var cursorPosition = window.getCaretCharacterOffsetWithin(parentEl);
            var cursorSearchEle = "store";
            if(parentEl !== null){
                var cursorSearchVal = parentEl.getAttribute("store");
                if(cursorSearchVal === null){
                    cursorSearchEle = "data-time";
                    cursorSearchVal = parentEl.getAttribute("data-time");
                }
                if(enter_key === "EK"){
                    var parent_id = $("article").attr("store");
                    if(parent_id != null){
                        var getdata = $("#content [store ="+ parent_id +"]").html();
                        var tag_name = "article";        
                        $('.storelocal_data').append("<"+ tag_name +" role="+ parent_id +" searchEle="+cursorSearchEle+" searchVal="+cursorSearchVal+" cursorPos="+cursorPosition+">"+ getdata +"</"+ tag_name +">");
                    }
                }else if(parentEl != null){        
                    var span_tag = parentEl.tagName;
                    var tag_name,parent_id,getdata;
                    if(span_tag === "SPAN" || span_tag === "I" || span_tag === "B" || span_tag === "U" || span_tag === "DIV") {
                        tag_name = parentEl.parentNode.tagName;
                        parent_id = parentEl.parentNode.getAttribute("store");
                        getdata = parentEl.parentElement.innerHTML;
                        if(span_tag === "DIV"){
                            parent_id = $("article").attr("store");
                            if(parent_id != null){
                                getdata = $("#content [store ="+ parent_id +"]").html();
                                tag_name = "article";
                                parent_id = null;
                            }
                        }
                    } else {
                        tag_name = parentEl.tagName;
                        parent_id = parentEl.getAttribute("store");
                        getdata = parentEl.innerHTML;
                    }
                    if(parent_id != null){
                        $('.storelocal_data').append("<"+ tag_name +" role="+ parent_id +" searchEle="+cursorSearchEle+" searchVal="+cursorSearchVal+" cursorPos="+cursorPosition+">"+ getdata +"</"+ tag_name +">");  
                    }else{
                        getdata = $("#content article").html();
                        parent_id = $("#content article").attr("store");
                        tag_name = "article";
                        $('.storelocal_data').append("<"+ tag_name +" role="+ parent_id +" searchEle="+cursorSearchEle+" searchVal="+cursorSearchVal+" cursorPos="+cursorPosition+">"+ getdata +"</"+ tag_name +">");
                    }
                    return parentEl;
                }  
            }
        }
    }    

    render() {                
        return (
            <div id="textbody">
                <BreadCrumbTrigger/>
            </div> 
        );
    }
}

export default PdfEditor;
