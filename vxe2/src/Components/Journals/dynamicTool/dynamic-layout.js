import React from "react";
import "@trendmicro/react-paginations/dist/react-paginations.css";
import DynamicHeader from "./dynamic-header";
 import TrackPanel from "./dynamic-track-panel";
 import StyleEditor from "./dynamic-style-editor";
 import ContentValidation from "./dynamic-content-validation";
import Consistency from "./dynamic-consistency";
import GrammerChecker from "./dynamic-grammer-checker";

const DynamicTool = (props) => {
  return (
    <div className="w-350-p ml-2">
      <DynamicHeader
        permissions={{
          ...props.permissions.pdf_upload_and_download,
          submit_button: props.permissions.editor_buttons.submit_button,
          oup: props.permissions.oup,
        }}
        selectedChapterXmlName={props.selectedChapterXmlName}
        ProjectId={props.ProjectId}
        ChapterId={props.ChapterId}
        APIURL={props.APIURL}
        pdfIsCreated={props.pdfIsCreated}
      />
      <div className="dynamic-space">
        <StyleEditor
          setClass={props.showOrHideStyleEdit}
          styleEdit={props.showStyleEditor}
        />
        <ContentValidation
          setClass={props.showOrHideContentValidation}
          contentValidationVal={props.contentValidationVal}
          contentVali={props.showContentValidation}
          selectedChapterXmlName={props.selectedChapterXmlName}
          contentValidationProp={props.contentValidationProp}
        />
        <Consistency
          selectedChapterXmlName={props.selectedChapterXmlName}
          setClass={props.showOrHideConsistency}
          consistencyRespData={props.consistencyRespData}
          finalitalic_duplication={props.finalitalic_duplication}
          finalbold_duplication={props.finalbold_duplication}
          captilization_list={props.captilization_list}
          consistencyVali={props.showConsistency}
        />
        <GrammerChecker
          setClass={props.showOrHideGrammerChecker}
          grammerCheck={props.showGrammerChecker}
          trackSpell={props.trackSpellData}
        />
      </div>
      <TrackPanel
        permissions={props.permissions.track_changes}
        trackingContent={props.trackData}
        trackCounts={props.trackCount}
      />
    </div>
  );
};

export default DynamicTool;
