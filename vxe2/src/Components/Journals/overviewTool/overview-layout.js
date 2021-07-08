import React from 'react';
import AdvanceSearch from "./overview-advance-search";
import SpellChecker from '../dynamicTool/dynamic-spell-check';

const OverviewTool = (props) => {
    return (
        <div id="toc-panel" className="w-250-p"> 
                <div className="dynamic-space">
                    <SpellChecker setClass={props.showOrHideSpellCheck} spellCheck = {props.showSpellChecker} trackSpell = {props.trackSpellData}/>
                </div>
            <div className="clearfix"></div>
            {(props.permissions.find && props.permissions.replace) && (   
                <AdvanceSearch FindPan={props.showFindPanel} ProjectId={props.ProjectId}/>      
            )}      
            <div className="clearfix"></div>
            <div className="thumb-pdf mt-2 py-3">
                <h6 className="ml-3 mr-3">Table of contents</h6>
                <hr></hr>
                <div className="chapter-tab toc-tab" id="toc_container">
                </div>
            </div>
        </div>
    )

}

export default OverviewTool;
