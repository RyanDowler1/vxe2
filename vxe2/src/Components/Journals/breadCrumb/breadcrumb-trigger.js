import React from 'react';
import $ from 'jquery'; 

class BreadCrumbTrigger extends React.Component {
    constructor(props) {        
        super(props);        
        this.state = {
            selectedTagArr: []
        }        
        this.breadCrumb = this.breadCrumb.bind(this);
    }

    componentDidMount() {
        window.BreadCrumbTrigger = this;
    }

    breadCrumb = (e) => {                             
            var currSelection = window.getSelection();					
            var currElement = currSelection.anchorNode;
            var allParents = $(currElement).parents();
            var allParentsLen = $(currElement).parents().length;

            if(!(!e) && !(!e.target.attributes['data-time'])) {
                var id = e.target.attributes['data-time'].value;
                window.scrollToLastTrack(id);
            } else {                        
                $('.track-changes-list .track-list').removeClass('add-highlights');
            }

            var breadCrumbIns = [];
            var j = 0;
            for(var i =0; i<allParentsLen; i++){
                if(allParents[i].nodeName == "ARTICLE")
                    j = i;
            }
            var selTagArr = [];    
            for(var k=0; k<=j; k++){
                if(allParents[k]){
                    let tagName = allParents[k].nodeName;
                    let tagNameLen = tagName.length;
                    let breadCrumbTag = '';
                    if(tagName === 'FONT'){
                        let fontTitle = allParents[k].getAttribute('title');
                        if(fontTitle !== null){
                            tagName = fontTitle;
                        }
                    }
                    if(tagName === 'SPAN'){
                        let fontTitle = allParents[k].getAttribute('data-title');
                        if(fontTitle !== null){
                            tagName = fontTitle;
                        }
                    }
                    if(tagName[tagNameLen-1] == "1")
                        tagName = tagName.slice(0,-1);
                    if(tagName == "PP")
                        tagName = "PARA";
                    if(tagName == "AFF")
                        tagName = "AFFILIATION";
                    if(tagName == "PERSON")
                        tagName = "PERSON-GROUP";
                    if(tagName != "SPAN")
                        breadCrumbTag = '<span>'+ tagName + '</span><i class="fa fa-chevron-right" aria-hidden="true"></i>';

                    if(tagName === "MIXED-CITATION"){
                        let type = allParents[k].getAttribute('publication-type');
                        let roleType = "";
                        if(type !== ""){
                            roleType = "-"+type;
                        }
                        breadCrumbTag = '<span>'+ tagName + roleType +'</span><i class="material-icons">keyboard_arrow_right</i>';
                    }
                    if(breadCrumbTag !== ""){
                        breadCrumbIns.unshift(breadCrumbTag);
                        selTagArr.push(tagName);
                    }
                }
            }
            $('.bread-crumbs').html(breadCrumbIns);
            $('#content .add-highlights').removeClass('add-highlights');
            if(selTagArr.length != 0)
                this.activeInactiveFontStyle(selTagArr);
            //Reset track filter result
            var filterEle = document.getElementById('filter');
            if(filterEle !== null){
                document.getElementById('filter').value = '';
            }
            document.querySelectorAll('#track-list li').forEach(data => {
                data.style.display = "";
                document.getElementsByClassName('no-data-txt')[0].style.display = "none";
            });
    }

    activeInactiveFontStyle = (selTagArr) => {              
        $('[data-cmdvalue="underline"]').removeClass('active');
        $('[data-cmdvalue="bold"]').removeClass('active');
        $('[data-cmdvalue="italic"]').removeClass('active');
        $('[data-cmdvalue="superscript"]').removeClass('active');
        $('[data-cmdvalue="subscript"]').removeClass('active');

        let rangeData = window.getSelection().getRangeAt(0);
        let selValue = rangeData.cloneContents();
            selValue = selValue.children;        
        let formatterTag = [];
        Array.prototype.forEach.call(selValue, function (selVal) {            
            formatterTag.push(selVal.tagName);
        });
        
        formatterTag.forEach( formTag =>{
            this.activeTextStyler(formTag);
        });              
        selTagArr.forEach( selTag => {
            this.activeTextStyler(selTag);
        })         
    }

    activeTextStyler(selectTagName) {
            if(selectTagName === "B")
                $('[data-cmdvalue="bold"]').addClass('active');            
            else if(selectTagName === "I")
                $('[data-cmdvalue="italic"]').addClass('active');            
            else if(selectTagName === "U")
                $('[data-cmdvalue="underline"]').addClass('active');            
            else if(selectTagName === "SUB")
                $('[data-cmdvalue="subscript"]').addClass('active');            
            else if(selectTagName === "SUP")
                $('[data-cmdvalue="superscript"]').addClass('active');            
    }              

    render() {        

        return (
            <div id="content" className="pdf-editor mt-2 p-5 del-hide" onClick={this.breadCrumb} >                     
            </div>
        );
    }
}

export default BreadCrumbTrigger;
