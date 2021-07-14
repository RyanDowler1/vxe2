import React from 'react'

export default function editorLayout() {
    return (
        <div className="cstm-main-container ml-2">                    
            <EditorTools permissions={props.permissions} styleEdit = {props.showStyleEditor} contentVali = {props.showContentValidation} FindPan = {props.showFindPanel} grammerCheck = {props.showGrammerChecker} spellCheck = {props.showSpellChecker} consistencyVali = {props.showConsistency} ProjectId={props.ProjectId} />
            <PdfEditor chapter={props.selectedChapter} getTracked = {props.getTrackedData} selectedChapterXml = {props.selectedChapterXml}/>
        </div>
    )
}
