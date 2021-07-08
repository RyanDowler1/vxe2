import React from 'react';
import '../css/journals-main.css';
import $ from 'jquery';
// import AcceptRejectAll from './dynamic-accept-reject-all';
import Spinner from '../loading/spinningTemp';

class TrackPanelTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: '',
      showLoader: false,
    };
  }

  stopPropagation = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  componentDidMount() {
    this.setCurrentUser();
  }

  setCurrentUser = () => {
    this.setState({ currentUser: $('#username').val() });
  };

  hideParentAccRej(e) {
    e.currentTarget.parentElement.classList.add('hide-acc-rej');
  }

  showParentAccRej(e) {
    e.currentTarget.parentElement.classList.remove('hide-acc-rej');
  }

  thAccept(id, yesAll) {
    this.trackAcceptRejectAction('Accept', id);
    let tableEle = $('#content [data-time=' + id + ']');
    if (tableEle.length > 0) {
      tableEle = $('#content [data-time=' + id + ']')[0];
      tableEle = tableEle.closest('table');
      let trEle = tableEle.querySelectorAll('tr[data-table="thchanged"]');
      if (trEle.length > 0) {
        Array.from(trEle).forEach((element) => {
          element.removeAttribute('data-table');
          element.removeAttribute('data-username');
          element.removeAttribute('data-tagname');
          element.removeAttribute('data-time');
        });
      }
    }
    if (!yesAll) window.autosavefunction_vxe();
  }

  thReject(id, yesAll) {
    this.trackAcceptRejectAction('Reject', id);
    let tableEle = $('#content [data-time=' + id + ']');
    if (tableEle.length > 0) {
      tableEle = $('#content [data-time=' + id + ']')[0];
      tableEle = tableEle.closest('table');
      if (!!tableEle) {
        let tbody = tableEle.querySelector('tbody');
        let trEle = tableEle.querySelectorAll('tr[data-table="thchanged"]');
        if (trEle.length > 0) {
          let trStr = '';
          Array.from(trEle).forEach((element) => {
            element.removeAttribute('data-table');
            element.removeAttribute('data-username');
            element.removeAttribute('data-tagname');
            element.removeAttribute('data-time');
            trStr = trStr + element.outerHTML;
            element.remove();
          });
          if (trStr !== '') {
            if (!!tbody) {
              tbody.innerHTML = trStr + tbody.innerHTML;
            }
            let trEle = tableEle.querySelector('thead td');
            if (trEle === null) {
              let theadEle = tableEle.querySelector('thead');
              if (!!theadEle) {
                theadEle.remove();
              }
            }
            if (!yesAll) window.autosavefunction_vxe();
          }
        }
      }
    }
  }

  changeEleParAccept(id, yesAll) {
    this.trackAcceptRejectAction('Accept', id);
    $('#content [data-time=' + id + ']').removeAttr('change-ele-history');
    $("#content [data-time='" + id + "']").removeAttr('data-username');
    $("#content [data-time='" + id + "']").removeAttr('data-tagname');
    $("#content [data-time='" + id + "']").removeAttr('role');
    $('#content [data-time=' + id + ']').removeAttr('data-time');
    if (!yesAll) window.autosavefunction_vxe();
  }

  changeEleParReject(id, yesAll) {
    this.trackAcceptRejectAction('Reject', id);
    var newtag_name = $("#content [data-time='" + id + "']").attr(
      'data-tagname'
    );
    var store_id = $("#content [data-time='" + id + "']").attr('store');
    var tag_name = $("#content [data-time='" + id + "']").prop('tagName');
    if (tag_name === 'PARA') {
      var html_content = $("#content [store='" + store_id + "']").html();
    } else {
      var html_content = $("#content [store='" + store_id + "']")
        .find('para')
        .html();
    }
    if (newtag_name === 'PARA') {
      $("#content [store='" + store_id + "']").replaceWith(
        '<' +
          newtag_name +
          ' store="' +
          store_id +
          '" contenteditable="true">' +
          html_content +
          '</' +
          newtag_name +
          '>'
      );
    } else {
      $("#content [store='" + store_id + "']").replaceWith(
        '<' +
          newtag_name +
          ' store="' +
          store_id +
          '" contenteditable="true"><para store="' +
          store_id +
          '_para">' +
          html_content +
          '</para></' +
          newtag_name +
          '>'
      );
    }
    $("#content [data-time='" + id + "']").removeAttr('data-username');
    $("#content [data-time='" + id + "']").removeAttr('data-tagname');
    $("#content [data-time='" + id + "']").removeAttr('role');
    $('#content [data-time=' + id + ']').removeAttr('change-ele-history');
    $('#content [data-time=' + id + ']').removeAttr('data-time');
    if (!yesAll) window.autosavefunction_vxe();
  }

  refAccept(id, yesAll) {
    this.trackAcceptRejectAction('Accept', id);
    $('#content [data-time=' + id + ']').removeAttr('data-time');
    if (!yesAll) window.autosavefunction_vxe();
  }

  refReject(id, yesAll) {
    this.trackAcceptRejectAction('Reject', id);
    let txt = $('#content [data-time=' + id + ']').text();
    $('#content [data-time=' + id + ']').html(txt);
    $('#content [data-time=' + id + ']')
      .contents()
      .unwrap();
    if (!yesAll) window.autosavefunction_vxe();
  }

  formatChangeAccept(id, yesAll) {
    this.trackAcceptRejectAction('Accept', id);
    $('#content [data-time=' + id + ']')
      .contents()
      .unwrap();
    if (!yesAll) window.autosavefunction_vxe();
  }

  formatChangeReject(id, yesAll) {
    this.trackAcceptRejectAction('Reject', id);
    let formatElement;
    let formatCmd;
    let formatTxt = $('#content [data-time=' + id + ']').text();
    let attrData;
    let d = new Date();
    let dt = Date.parse(d);
    if (!$('#content [data-time=' + id + ']').attr('prev-user')) {
      attrData = '';
    } else {
      let userName = $('#content [data-time=' + id + ']').attr('prev-user');
      attrData = ' data-username="' + userName + '" data-time="' + dt + '"';
    }
    formatCmd = $('#content [data-time=' + id + ']').attr('prev-format');
    switch (formatCmd) {
      case 'italic':
        formatElement = '<i' + attrData + '>' + formatTxt + '</i>';
        break;
      case 'bold':
        formatElement = '<b' + attrData + '>' + formatTxt + '</b>';
        break;
      case 'underline':
        formatElement = '<u' + attrData + '>' + formatTxt + '</u>';
        break;
      case 'subscript':
        formatElement = '<sub' + attrData + '>' + formatTxt + '</sub>';
        break;
      case 'superscript':
        formatElement = '<sup' + attrData + '>' + formatTxt + '</sup>';
        break;
    }

    $('#content [data-time=' + id + ']').after(formatElement);
    $('#content [data-time=' + id + ']').remove();
    if (!yesAll) window.autosavefunction_vxe();
  }

  addHighlight(e) {
    $(e.currentTarget).addClass('gray-highlights');
  }

  removeHighlight(e) {
    $(e.currentTarget).removeClass('gray-highlights');
  }

  newParaAccept(id, yesAll) {
    this.trackAcceptRejectAction('Accept', id);
    $('#content [data-time=' + id + ']').removeAttr('data-username');
    $('#content [data-time=' + id + ']').removeAttr('data-time');
    if (!yesAll) window.autosavefunction_vxe();
  }

  newParaReject(id, yesAll) {
    this.trackAcceptRejectAction('Reject', id);
    $('#content [data-time=' + id + ']').remove();
    if (!yesAll) window.autosavefunction_vxe();
  }

  splitParaAccept(id, yesAll) {
    this.trackAcceptRejectAction('Accept', id);
    $('#content [data-time=' + id + ']').removeAttr('enter_key');
    $('#content [data-time=' + id + ']').removeAttr('data-username');
    $('#content [data-time=' + id + ']').removeAttr('data-time');
    if (!yesAll) window.autosavefunction_vxe();
  }

  splitParaReject(id, yesAll) {
    this.trackAcceptRejectAction('Reject', id);
    let splitedParaTxt = $('#content [data-time=' + id + ']').text();
    let prevTxt = $('#content [data-time=' + id + ']')
      .prev()
      .text();
    $('#content [data-time=' + id + ']')
      .prev()
      .html(prevTxt + splitedParaTxt);
    $('#content [data-time=' + id + ']').remove();
    if (!yesAll) window.autosavefunction_vxe();
  }

  addRoleAccept(id, yesAll) {
    this.trackAcceptRejectAction('Accept', id);
    $('#content [data-time=' + id + ']').removeAttr('data-username');
    $('#content [data-time=' + id + ']').removeAttr('data-time');
    if (!yesAll) window.autosavefunction_vxe();
  }

  addRoleReject(id, yesAll) {
    this.trackAcceptRejectAction('Reject', id);
    if (
      $('#content [data-time=' + id + ']').removeAttr('wrap-space').length > 0
    )
      $('#content [data-time=' + id + ']').removeAttr('wrap-space');
    $('#content [data-time=' + id + ']').removeAttr('role');
    $('#content [data-time=' + id + ']').removeAttr('data-username');
    $('#content [data-time=' + id + ']').removeAttr('data-time');
    if (!yesAll) window.autosavefunction_vxe();
  }
    
  trackAcceptRejectAction =  (actionType, id) => {
        let userName = document.getElementById("username").value; 
        let contentOwner = $('#content [data-time="'+id+'"]').attr('data-username');
        if(userName !== contentOwner){
            let trackContent = $('.track-list#'+id +' .modified-txt').text();
            if(trackContent.length > 30){
                trackContent = trackContent.slice(0, 30);
                trackContent = trackContent + '...';
            } 
            let actionVal = actionType+ '---Current User: '+userName + '---Owner of content: ' + contentOwner + '---Track changes data: '+ trackContent;
            window.browser_details(actionVal);            
        }
  }  

  acceptRejectAll(trackData, accOrRej) {
    if (accOrRej === 'accept') {
      this.trackAcceptRejectAction('Accept All');
    } else {
      this.trackAcceptRejectAction('Reject All');
    }
    let trackDataArr = Array.from(trackData);
    trackDataArr.forEach((trackData) => {
      let trackId =
        trackData.attributes['data-time'] &&
        trackData.attributes['data-time'].value;
      let trackListCont = $('#track-list #' + trackId)
        .find('.modified-txt')
        .text();
      if (
        $('#track-list #' + trackId)
          .find('.changed-element')
          .text().length > 0
      )
        trackListCont = 'Changed Element';
      if (
        $('#track-list #' + trackId)
          .find('.add-role')
          .text().length > 0
      )
        trackListCont = 'Add Role';
      if (
        $('#track-list #' + trackId)
          .find('.tablechange')
          .text().length > 0
      )
        trackListCont = 'Table Change';
      if (accOrRej === 'accept') {
        this.selectAccRejAll(trackListCont, trackId, true);
      } else {
        this.selectAccRejAll(trackListCont, trackId, false);
      }
    });
    window.autosavefunction_vxe();
  }

  selectAccRejAll(trackListCont, trackId, accOrRej) {
    let yesAll = true;
    switch (trackListCont) {
      case 'Merged Paragraph':
        accOrRej
          ? this.mergeParaAccept(trackId, yesAll)
          : this.mergeParaReject(trackId, yesAll);
        break;

      case 'Splited Paragraph':
        accOrRej
          ? this.splitParaAccept(trackId, yesAll)
          : this.splitParaReject(trackId, yesAll);
        break;

      case 'Changed Element':
        accOrRej
          ? this.changeEleParAccept(trackId, yesAll)
          : this.changeEleParReject(trackId, yesAll);
        break;

      case 'Add Role':
        accOrRej
          ? this.addRoleAccept(trackId, yesAll)
          : this.addRoleReject(trackId, yesAll);
        break;

      case 'Table Change':
        accOrRej
          ? this.thAccept(trackId, yesAll)
          : this.thReject(trackId, yesAll);
        break;

      default:
        //Track accept & Reject for Insert content, delete content, Bold, italic, underline, superscript, subscript, Add Element
        accOrRej
          ? window.changeAccept(trackId, '', yesAll)
          : window.changeReject(trackId, '', yesAll);
    }
  }

  refTrackAccept(id) {
    this.trackAcceptRejectAction('Accept', id);
    let refNo = document.querySelectorAll(
      '#content [data-time=' + id + '] label1 span'
    )[1].innerText;
    document.querySelectorAll(
      '#content [data-time=' + id + '] label1'
    )[0].innerHTML = '';
    document.querySelectorAll(
      '#content [data-time=' + id + '] label1'
    )[0].innerHTML = refNo;
    $('#content [data-time=' + id + ']').removeAttr('data-username');
    $('#content [data-time=' + id + ']').removeAttr('track-ref-id');
    $('#content [data-time=' + id + ']').removeAttr('data-date');
    $('#content [data-time=' + id + ']').removeAttr('track-change');
    $('#content [data-time=' + id + ']').removeAttr('data-time');
    window.autosavefunction_vxe();
  }

  refTrackReject(id) {
    this.trackAcceptRejectAction('Reject', id);
    let sortListId = $('#content [data-time=' + id + ']').attr('track-ref-id');
    let sortingList = sortListId.split('-');
    let sortingArr = [];
    sortingList.shift();
    let firstVal = sortingList[0];
    let spanOneVal = document.querySelectorAll(
      '#content ref[id="' + firstVal + '"] label1 span'
    )[0].innerText;
    let spanTwoVal = document.querySelectorAll(
      '#content ref[id="' + firstVal + '"] label1 span'
    )[1].innerText;
    if (spanOneVal.split('.')[0] - 1 === parseInt(spanTwoVal.split('.')[0])) {
      let lastVal = sortingList[sortingList.length - 1];
      sortingList.pop();
      sortingList.unshift(lastVal);
    } else {
      sortingList.shift();
      sortingList.push(firstVal);
    }
    let firstEle = $('#' + firstVal).prev();
    sortingList.forEach((data) => {
      sortingArr.unshift(document.getElementById(data));
      document.getElementById(data).remove();
    });

    sortingArr.forEach((data) => {
      $(firstEle).after(data);
      let id = data.getAttribute('data-time');
      let xmlId = data.getAttribute('id');
      let refNo = document.querySelectorAll(
        '#content [data-time=' + id + '] label1 span'
      )[0].innerText;
      document.querySelectorAll(
        '#content [data-time=' + id + '] label1'
      )[0].innerHTML = '';
      document.querySelectorAll(
        '#content [data-time=' + id + '] label1'
      )[0].innerHTML = refNo;

      document.querySelectorAll(
        '#content xref[rid="' + xmlId + '"]'
      )[0].innerHTML = '';
      document.querySelectorAll(
        '#content xref[rid="' + xmlId + '"]'
      )[0].innerHTML = refNo.split('.')[0];
      $('#content [data-time=' + id + ']').removeAttr('data-username');
      $('#content [data-time=' + id + ']').removeAttr('track-ref-id');
      $('#content [data-time=' + id + ']').removeAttr('data-date');
      $('#content [data-time=' + id + ']').removeAttr('track-change');
      $('#content [data-time=' + id + ']').removeAttr('data-time');
    });
    window.autosavefunction_vxe();
  }

  eqTrackAccept(id) {
    this.trackAcceptRejectAction('Accept', id);
    if ($('#content [data-time="' + id + '"]').hasClass('math_figold')) {
      $('#content [data-time="' + id + '"]')
        .next('.math_fignew')
        .remove();
      $('#content [data-time=' + id + ']').removeAttr('data-username');
      $('#content [data-time=' + id + ']').removeAttr('data-date');
      $('#content [data-time=' + id + ']').removeAttr('data-time');
    } else if ($('#content [data-time="' + id + '"]').hasClass('math_fignew')) {
      $('#content [data-time="' + id + '"]')
        .prev('.math_figold')
        .remove();
      $('#content [data-time=' + id + ']').removeAttr('data-username');
      $('#content [data-time=' + id + ']').removeAttr('data-date');
      $('#content [data-time=' + id + ']').removeAttr('data-time');
    }

    window.autosavefunction_vxe();
  }

  eqTrackReject(id) {
    this.trackAcceptRejectAction('Reject', id);
    if ($('#content [data-time="' + id + '"]').hasClass('math_fignew')) {
      $('#content [data-time=' + id + ']')
        .prev('.math_figold')
        .removeAttr('data-username');
      $('#content [data-time=' + id + ']')
        .prev('.math_figold')
        .removeAttr('data-date');
      $('#content [data-time=' + id + ']')
        .prev('.math_figold')
        .removeAttr('data-time');
      let oldEq = $('#content [data-time="' + id + '"]')
        .prev('.math_figold')
        .attr('old-eq');
      $('#content [data-time="' + id + '"]')
        .parent()
        .find('mathphrase')
        .html(JSON.parse(oldEq));
      $('#content [data-time="' + id + '"]')
        .prev('.math_figold')
        .removeAttr('old-eq');
      $('#content [data-time=' + id + ']')
        .prev('.math_figold')
        .removeClass('math_figold');
      $('#content [data-time="' + id + '"]').remove();
    } else if ($('#content [data-time="' + id + '"]').hasClass('math_figold')) {
      $('#content [data-time="' + id + '"]')
        .next('.math_fignew')
        .removeAttr('data-username');
      $('#content [data-time="' + id + '"]')
        .next('.math_fignew')
        .removeAttr('data-date');
      $('#content [data-time="' + id + '"]')
        .next('.math_fignew')
        .removeAttr('data-time');
      $('#content [data-time="' + id + '"]')
        .next('.math_fignew')
        .removeClass('math_fignew');
      $('#content [data-time="' + id + '"]').remove();
    }
    window.autosavefunction_vxe();
  }

  render() {
    const { currentUser } = this.state;
    return (
      <>
        <ul id="track-list" className="pl-0">
          {this.props.trackingCont.map((trackValues, index) => {
            let tagName = trackValues.tagName;
            let dataTime = trackValues.attributes['data-time'];
            let dataUser = '';
            if (trackValues.attributes['data-username'])
              dataUser = trackValues.attributes['data-username'].value;
            let dataTimeVal = '';
            if (dataTime) dataTimeVal = dataTime.value;
            let styleAttr = trackValues.attributes['style'];
            let roleAttr = trackValues.attributes['role'];
            let roleAttr2 = trackValues.attributes['sec-type'];
            let prevFormat = trackValues.attributes['prev-format'];
            let posAttr = trackValues.attributes['position'];
            let styleAttrVal = styleAttr && styleAttr.value;
            let hiddenTrackRow = styleAttrVal === 'display: none;';
            let markDone = '';
            let childReply = '';
            let tableInsert = '';
            let markStatus = trackValues.attributes['status'];
            let childReplyData =
              trackValues.parentElement &&
              trackValues.parentElement.tagName === 'REPLY';
            let classAttr = trackValues.attributes['class'];
            let enterKeyAttr = trackValues.attributes['enter_key'];
            let changeEleHistory = trackValues.attributes['change-ele-history'];
            let delQuery = false;
            let acceptRejectSection = false;
            let querySection = false;
            let commentSection = false;
            let replySection = false;
            let insertFootnote = false;
            let spanTag = false;
            let refTag = false;
            let imageobject = false;
            let sameUser = false;
            let otherUser = false;
            let tableTag = false;
            let tableChangeTag = trackValues.attributes['data-table'];
            let blockQuoteTag = false;
            let boldTag = false;
            let italicTag = false;
            let pTag = false;
            let underlineTag = false;
            let orderListTag = false;
            let unorderListTag = false;
            let splitPara = false;
            let newPara = false;
            let scTag = false;
            let commOrQueryTxt = '';
            let yesOtherContent = false;
            let yesOwnContent = true;
            let chanEleHis = false;
            let hisValArr = '';
            let insTableRow = false;
            let insTableCol = false;
            let delTableRow = false;
            let delTableCol = false;
            let tableHide = false;
            let beforeSort = '';
            let afterSort = '';
            let tableTh = '';
            if (tagName === 'TR') {
              if (classAttr && classAttr.value === 'insert') insTableRow = true;
              if (classAttr && classAttr.value === 'delete') delTableRow = true;
            }
            switch (tagName) {
              case 'SPAN':
                spanTag = true;
                break;
              case 'QUERY':
                querySection = true;
                break;
              case 'COMMENT':
                commentSection = true;
                break;
              case 'REPLY':
                replySection = true;
                break;
              case 'TABLE-WRAP':
                tableTag = true;
                break;
              case 'BLOCKQUOTE':
                blockQuoteTag = true;
                break;
              case 'B':
                boldTag = true;
                break;
              case 'I':
                italicTag = true;
                break;
              case 'U':
                underlineTag = true;
                break;
              case 'UL':
                unorderListTag = true;
                break;
              case 'OL':
                orderListTag = true;
                break;
              case 'PP1':
                pTag = true;
                break;
              case 'PARA':
                pTag = true;
                break;
              case 'REF':
                refTag = true;
                break;
              case 'IMG':
                imageobject = true;
                break;
              case 'SC':
                scTag = true;
                break;
            }
            if (roleAttr && roleAttr.value) {
              var roleValue = roleAttr.value;
              var trackRoleTxt = '';
              switch (roleValue) {
                case 'bib_para':
                  trackRoleTxt = 'Bib Para';
                  break;
                case 'bib_text':
                  trackRoleTxt = 'Bib Text';
                  break;
                case 'symbol_para':
                  trackRoleTxt = 'Symbol Para';
                  break;
                case 'noindent':
                  trackRoleTxt = 'No Indent';
                  break;
                case 'source':
                  trackRoleTxt = 'Source';
                  break;
                case 'pararight':
                  trackRoleTxt = 'Para Right';
                  break;
                case 'paraleftabove':
                  trackRoleTxt = 'Para Left Above';
                  break;
                case 'pararightabove':
                  trackRoleTxt = 'Para Right Above';
                  break;
                case 'paracenterabove':
                  trackRoleTxt = 'Para Center Above';
                  break;
                case 'paracenter':
                  trackRoleTxt = 'Para Center';
                  break;
                case 'inline_caption':
                  trackRoleTxt = 'Inline Caption';
                  break;
                case 'ExtractAff':
                  trackRoleTxt = 'Exract Aff';
                  break;
                case 'ExtractAuthor':
                  trackRoleTxt = 'Extract Author';
                  break;
                case 'ExtractText':
                  trackRoleTxt = 'Extract Text';
                  break;
                case 'ExtractOpen':
                  trackRoleTxt = 'Extract Open';
                  break;
              }
            }
            if (markStatus && markStatus.value === 'marks-done')
              markDone = 'marks-done';
            if (childReplyData) childReply = ' child-reply';
            if (dataUser === currentUser) sameUser = true;
            else otherUser = true;
            if (querySection && !classAttr) delQuery = true;
            if (
              tagName === 'LABEL1' &&
              trackValues.parentElement &&
              trackValues.parentElement.tagName === 'TABLE-WRAP'
            )
              tableHide = true;
            if (commentSection || querySection) {
              const Entities = require('html-entities').XmlEntities;
              const entities = new Entities();
              commOrQueryTxt = entities.decode(
                trackValues.attributes['title'].value
              );
            }
            if (!commentSection && !querySection && !replySection)
              acceptRejectSection = true;
            if (
              classAttr &&
              classAttr.value.split(' ')[0] === 'new_footnoteadded'
            )
              insertFootnote = true;

            if (
              enterKeyAttr &&
              enterKeyAttr.value === 'success' &&
              $('#content pp1[data-time="' + dataTime.value + '"]').find('br')
                .length === 1
            )
              $('#content pp1[data-time="' + dataTime.value + '"] br').remove();
            if (
              enterKeyAttr &&
              enterKeyAttr.value === 'success' &&
              trackValues.innerText.length === 0
            )
              newPara = true;
            else if (enterKeyAttr && enterKeyAttr.value === 'success')
              splitPara = true;
            if (tableTag && posAttr !== undefined) {
              if (
                posAttr &&
                posAttr.value !== undefined &&
                posAttr.value === 'inline'
              )
                tableInsert = 'New Inline table has been inserted';
              else if (posAttr.value === 'float')
                tableInsert =
                  trackValues.attributes['linkend_tbl'].value +
                  ' has been inserted';
            }
            if (!!tableChangeTag) {
              tableTh = 'TR changed to TH';
            }
            if (
              spanTag &&
              dataUser === currentUser &&
              $('#content [data-time="' + dataTimeVal + '"]').hasClass('ins')
            ) {
              var ownContentInitTrack = $(
                '#content [data-time="' + dataTimeVal + '"]'
              )
                .clone()
                .find('.ins')
                .remove()
                .end()
                .text();
              yesOwnContent = true;
              if (ownContentInitTrack === ' ') hiddenTrackRow = true;
            }
            if (
              spanTag &&
              dataUser !== currentUser &&
              $('#content [data-time="' + dataTimeVal + '"]').hasClass('ins')
            ) {
              var otherContentInitTrack = $(
                '#content [data-time="' + dataTimeVal + '"]'
              )
                .clone()
                .find('.ins')
                .remove()
                .end()
                .text();
              yesOtherContent = true;
              if (otherContentInitTrack === ' ') hiddenTrackRow = true;
            }
            if (
              spanTag &&
              $('#content [data-time="' + dataTimeVal + '"]').hasClass('del')
            ) {
              var delTxt = $(
                '#content [data-time="' + dataTimeVal + '"]'
              ).text();
              if (delTxt === '') hiddenTrackRow = true;
            }
            if (changeEleHistory !== undefined && changeEleHistory) {
              chanEleHis = true;
              let historyVal =
                trackValues.attributes['change-ele-history'].value;
              hisValArr = historyVal.split(',');
              hisValArr.pop();
            }
            if (!!refTag && refTag) {
              let trackRefChanges =
                trackValues.attributes['track-change'].value;
              trackRefChanges.split('-');
              beforeSort = trackRefChanges[0];
              afterSort = trackRefChanges[2];
            }
            return (
              !tableHide &&
              !delQuery &&
              !hiddenTrackRow && (
                <li
                  onMouseOver={this.addHighlight}
                  onMouseLeave={this.removeHighlight}
                  className={
                    tagName.toLowerCase() +
                    '-track-row row mx-1 px-2 pt-3 b-1-grey track-list ' +
                    markDone +
                    childReply
                  }
                  key={index}
                  id={dataTime && dataTimeVal}
                  onClick={() =>
                    window.scrollToViewContent(
                      dataTime ? dataTimeVal : '',
                      true
                    )
                  }
                >
                  <div className="col-1 p-0">
                    {classAttr &&
                      classAttr.value.split(' ')[0] === 'del' &&
                      spanTag && (
                        <i className="material-icons cstm-danger-color f-18-px">
                          remove
                        </i>
                      )}
                    {tagName === 'IMAGEOBJECT' &&
                      classAttr &&
                      classAttr.value.split(' ')[0] === 'math_figold' && (
                        <i className="material-icons cstm-danger-color f-18-px">
                          remove
                        </i>
                      )}
                    {classAttr &&
                      classAttr.value.split(' ')[0] === 'ins' &&
                      spanTag && (
                        <i className="material-icons cstm-success-color f-18-px">
                          add
                        </i>
                      )}
                    {(blockQuoteTag ||
                      prevFormat ||
                      boldTag ||
                      italicTag ||
                      underlineTag ||
                      unorderListTag ||
                      orderListTag ||
                      pTag ||
                      refTag ||
                      scTag ||
                      tagName === 'SIDEBAR' ||
                      tagName === 'BOXED-TEXT' ||
                      tagName === 'EPIGRAPH' ||
                      tagName === 'SOURCE' ||
                      tagName === 'EXAMPLE' ||
                      tagName === 'SUP' ||
                      tagName === 'SUB' ||
                      (classAttr &&
                        classAttr.value.split(' ')[0] ===
                          'new_footnoteadded') ||
                      (tagName === 'IMAGEOBJECT' &&
                        classAttr &&
                        classAttr.value.split(' ')[0] === 'math_fignew') ||
                      tagName === 'LINE' ||
                      tagName === 'SOURCE1' ||
                      tagName === 'TR' ||
                      tagName === 'LABEL1' ||
                      (roleAttr && roleAttr.value === 'bibr')) && (
                      <i className="material-icons cstm-success-color f-18-px">
                        add
                      </i>
                    )}
                    {commentSection && (
                      <i className="material-icons-outlined cstm-primary-color f-18-px">
                        mode_comment
                      </i>
                    )}
                    {querySection && (
                      <i className="material-icons f-18-px cstm-primary-color">
                        help_outline
                      </i>
                    )}
                    {replySection && (
                      <i className="material-icons cstm-primary-color f-18-px">
                        reply
                      </i>
                    )}
                    {tableTag && (
                      <i className="material-icons cstm-success-color f-18-px">
                        table_chart
                      </i>
                    )}
                    {classAttr &&
                      (tagName === 'FIG' || tagName === 'INFORMALFIGURE') && (
                        <i className="material-icons cstm-success-color f-18-px">
                          crop_original
                        </i>
                      )}
                    {roleAttr2 && tagName === 'SEC' && (
                      <i className="material-icons cstm-success-color f-18-px">
                        add
                      </i>
                    )}
                  </div>
                  <div className="col-11 pl-1 track-data-row pb-2">
                    <div className="track-wrapper">
                      <div className="track-info">
                        <h6 className="">
                          {trackValues.attributes['data-username'] && dataUser}
                        </h6>
                        {chanEleHis && <span className="most-rec"></span>}
                        <span className="track-time">
                          {trackValues.attributes['data-date'].value}
                        </span>
                      </div>
                      {commentSection && (
                        <div className="track-action-row">
                          {this.props.permissions.done && (
                            <>
                              <button
                                type="button"
                                className="btn cstm-primary-btn float-right solve-btn"
                                onClick={() =>
                                  window.doneCommentQuery(
                                    dataTimeVal,
                                    'comment'
                                  )
                                }
                              >
                                Mark as Done
                              </button>
                              <button
                                type="button"
                                className="btn cstm-primary-btn float-right undone-btn"
                                onClick={() =>
                                  window.unDoneCommentQuery(
                                    dataTimeVal,
                                    'comment'
                                  )
                                }
                              >
                                Mark as Undone
                              </button>
                            </>
                          )}
                          {sameUser && (
                            <i
                              className="material-icons-outlined float-right comment-edit-btn"
                              onClick={() =>
                                window.addCommentText(
                                  trackValues.attributes['id'].value
                                )
                              }
                            >
                              edit
                            </i>
                          )}
                          {sameUser && (
                            <i
                              className="material-icons-outlined float-right comment-del-btn"
                              onClick={(e) =>
                                window.trackDeleteCommentQuery(
                                  dataTimeVal,
                                  'comment',
                                  e
                                )
                              }
                            >
                              delete
                            </i>
                          )}
                        </div>
                      )}
                      {querySection && !delQuery && (
                        <div className="track-action-row">
                          {this.props.permissions.done && (
                            <>
                              <button
                                type="button"
                                className="btn cstm-primary-btn float-right solve-btn"
                                onClick={() =>
                                  window.doneCommentQuery(dataTimeVal, 'query')
                                }
                              >
                                Mark as Done
                              </button>
                              <button
                                type="button"
                                className="btn cstm-primary-btn float-right undone-btn"
                                onClick={() =>
                                  window.unDoneCommentQuery(
                                    dataTimeVal,
                                    'comment'
                                  )
                                }
                              >
                                Mark as Undone
                              </button>
                            </>
                          )}
                          {sameUser && (
                            <i
                              className="material-icons-outlined float-right comment-edit-btn"
                              onClick={() =>
                                window.addQueryText(
                                  trackValues.attributes['id'].value,
                                  'query'
                                )
                              }
                            >
                              edit
                            </i>
                          )}
                          {otherUser && this.props.permissions.reply_for_query && (
                            <button
                              type="button"
                              className="btn cstm-primary-btn reply-btn float-right"
                              onClick={() => window.replyquery(dataTimeVal, 0)}
                            >
                              Reply
                            </button>
                          )}
                          {sameUser && (
                            <i
                              className="material-icons-outlined float-right comment-del-btn"
                              onClick={(e) =>
                                window.trackDeleteCommentQuery(
                                  dataTimeVal,
                                  'query',
                                  e
                                )
                              }
                            >
                              delete
                            </i>
                          )}
                        </div>
                      )}
                    </div>{' '}
                    {/* end track-wrapper */}
                    {replySection && this.props.permissions.reply_for_comments && (
                      <div className="track-action-row">
                        {sameUser && (
                          <i
                            className="material-icons-outlined float-right comment-edit-btn"
                            onClick={() => window.updatereply_edit(dataTimeVal)}
                          >
                            edit
                          </i>
                        )}
                        {otherUser && (
                          <i
                            className="material-icons-outlined reply-btn cstm-success-color"
                            onClick={() => window.replyquery(dataTimeVal, 1)}
                          >
                            reply
                          </i>
                        )}
                        {sameUser && (
                          <i
                            className="material-icons-outlined float-right comment-del-btn"
                            onClick={(e) =>
                              window.trackDeleteCommentQuery(
                                dataTimeVal,
                                'reply',
                                e
                              )
                            }
                          >
                            delete
                          </i>
                        )}
                      </div>
                    )}
                    {acceptRejectSection &&
                      this.props.permissions.accept_changes &&
                      this.props.permissions.reject_changes && (
                        <div className="track-action-row">
                          {roleAttr &&
                            roleAttr.value === 'change-element' &&
                            !splitPara && (
                              <>
                                <i
                                  className="material-icons cstm-success-color float-right track-accept"
                                  title="Accept change"
                                  onClick={(e) =>
                                    this.changeEleParAccept(dataTimeVal)
                                  }
                                >
                                  done
                                </i>
                                <i
                                  className="material-icons cstm-danger-color float-right track-reject"
                                  title="Reject change"
                                  onClick={(e) =>
                                    this.changeEleParReject(dataTimeVal)
                                  }
                                >
                                  close
                                </i>
                              </>
                            )}
                          {roleAttr && roleAttr.value === 'bibr' && (
                            <>
                              <i
                                className="material-icons cstm-success-color float-right track-accept"
                                title="Accept change"
                                onClick={(e) => this.refAccept(dataTimeVal)}
                              >
                                done
                              </i>
                              <i
                                className="material-icons cstm-danger-color float-right track-reject"
                                title="Reject change"
                                onClick={(e) => this.refReject(dataTimeVal)}
                              >
                                close
                              </i>
                            </>
                          )}
                          {prevFormat && (
                            <>
                              <i
                                className="material-icons cstm-success-color float-right track-accept"
                                title="Accept change"
                                onClick={(e) =>
                                  this.formatChangeAccept(dataTimeVal)
                                }
                              >
                                done
                              </i>
                              <i
                                className="material-icons cstm-danger-color float-right track-reject"
                                title="Reject change"
                                onClick={(e) =>
                                  this.formatChangeReject(dataTimeVal)
                                }
                              >
                                close
                              </i>
                            </>
                          )}
                          {newPara && (
                            <>
                              <i
                                className="material-icons cstm-success-color float-right track-accept"
                                title="Accept change"
                                onClick={(e) => this.newParaAccept(dataTimeVal)}
                              >
                                done
                              </i>
                              <i
                                className="material-icons cstm-danger-color float-right track-reject"
                                title="Reject change"
                                onClick={(e) => this.newParaReject(dataTimeVal)}
                              >
                                close
                              </i>
                            </>
                          )}
                          {splitPara && (
                            <>
                              <i
                                className="material-icons cstm-success-color float-right track-accept"
                                title="Accept change"
                                onClick={(e) =>
                                  this.splitParaAccept(dataTimeVal)
                                }
                              >
                                done
                              </i>
                              <i
                                className="material-icons cstm-danger-color float-right track-reject"
                                title="Reject change"
                                onClick={(e) =>
                                  this.splitParaReject(dataTimeVal)
                                }
                              >
                                close
                              </i>
                            </>
                          )}
                          {trackRoleTxt && !splitPara && (
                            <>
                              <i
                                className="material-icons cstm-success-color float-right track-accept as"
                                title="Accept change"
                                onClick={(e) => this.addRoleAccept(dataTimeVal)}
                              >
                                done
                              </i>
                              <i
                                className="material-icons cstm-danger-color float-right track-reject"
                                title="Reject change"
                                onClick={(e) => this.addRoleReject(dataTimeVal)}
                              >
                                close
                              </i>
                            </>
                          )}
                          {!prevFormat &&
                            !(
                              roleAttr &&
                              roleAttr.value === 'change-element' &&
                              !splitPara
                            ) &&
                            !(roleAttr && roleAttr.value === 'bibr') &&
                            !(roleAttr && roleAttr.value === 'merge_para') &&
                            !newPara &&
                            !splitPara &&
                            !trackRoleTxt && (
                              <>
                                <i
                                  className="material-icons cstm-success-color float-right track-accept"
                                  title="Accept change"
                                  onClick={(e) =>
                                    window.changeAccept(dataTimeVal)
                                  }
                                >
                                  done
                                </i>
                                {!trackValues.attributes['prev_role'] && (
                                  <i
                                    className="material-icons cstm-danger-color float-right track-reject"
                                    title="Reject change"
                                    onClick={(e) =>
                                      window.changeReject(dataTimeVal)
                                    }
                                  >
                                    close
                                  </i>
                                )}
                                {trackValues.attributes['prev_role'] && (
                                  <i
                                    className="material-icons cstm-danger-color mari2 float-right track-reject"
                                    title="Reject change"
                                    onClick={(e) =>
                                      window.changeHeaderReject(dataTimeVal, e)
                                    }
                                  >
                                    close
                                  </i>
                                )}
                              </>
                            )}
                          {refTag && (
                            <>
                              <i
                                className="material-icons cstm-success-color float-right track-accept as"
                                title="Accept change"
                                onClick={(e) =>
                                  this.refTrackAccept(dataTimeVal)
                                }
                              >
                                done
                              </i>
                              <i
                                className="material-icons cstm-danger-color float-right track-reject"
                                title="Reject change"
                                onClick={(e) =>
                                  this.refTrackReject(dataTimeVal)
                                }
                              >
                                close
                              </i>
                            </>
                          )}
                          {imageobject && (
                            <>
                              <i
                                className="material-icons cstm-success-color float-right track-accept"
                                title="Accept change"
                                onClick={(e) => this.eqTrackAccept(dataTimeVal)}
                              >
                                done
                              </i>
                              <i
                                className="material-icons cstm-danger-color float-right track-reject"
                                title="Reject change"
                                onClick={(e) => this.eqTrackReject(dataTimeVal)}
                              >
                                close
                              </i>
                            </>
                          )}
                          {!!tableChangeTag && (
                            <>
                              <i
                                className="material-icons cstm-success-color float-right track-accept"
                                title="Accept change"
                                onClick={(e) => this.thAccept(dataTimeVal)}
                              >
                                done
                              </i>
                              <i
                                className="material-icons cstm-danger-color float-right track-reject"
                                title="Reject change"
                                onClick={(e) => this.thReject(dataTimeVal)}
                              >
                                close
                              </i>
                            </>
                          )}
                        </div>
                      )}
                    <p className="modified-txt">
                      {(spanTag ||
                        tagName === 'LABEL1' ||
                        tagName === 'CAPTION1') &&
                        dataTime &&
                        dataTimeVal.split('_del').length < 2 &&
                        (trackValues.innerText === ' ' ||
                          trackValues.innerText === '\u00a0') && (
                          <span>Whitespace</span>
                        )}
                      {tagName === 'LINE' && (
                        <span>Inserted New Poem Line</span>
                      )}
                      {(tagName === 'LABEL1' || tagName === 'CAPTION1') &&
                        dataTime &&
                        dataTimeVal.split('_del').length < 2 &&
                        trackValues.innerText !== ' ' &&
                        yesOtherContent !== undefined &&
                        !yesOtherContent && (
                          <span>{trackValues.innerText}</span>
                        )}
                      {spanTag && yesOwnContent && (
                        <span>{ownContentInitTrack}</span>
                      )}
                      {yesOtherContent && <span>{otherContentInitTrack}</span>}
                      {classAttr &&
                        classAttr.value.split(' ')[0] === 'del' &&
                        spanTag && <span>{trackValues.innerText}</span>}
                      {replySection && (
                        <span>{trackValues.attributes['title'].value}</span>
                      )}
                      {roleAttr && roleAttr.value === 'bibr' && (
                        <span>{trackValues.innerText}</span>
                      )}
                      {insTableRow && <span>Inserted Table Row</span>}
                      {delTableRow && <span>Deleted Table Row</span>}
                      {spanTag &&
                        dataTimeVal.split('_del').length > 1 &&
                        trackValues.attributes['del-role'] &&
                        trackValues.attributes['del-role'].value === 'tab' && (
                          <span>Deleted Table</span>
                        )}
                      {spanTag &&
                        dataTimeVal.split('_del').length > 1 &&
                        trackValues.attributes['del-role'] &&
                        trackValues.attributes['del-role'].value === 'fig' && (
                          <span>Deleted Figure</span>
                        )}
                      {(commentSection || querySection) && (
                        <span>{commOrQueryTxt}</span>
                      )}
                      {insertFootnote && <span>New Footnote Inserted</span>}
                      {tableInsert && <span>{tableInsert}</span>}
                      {tableTh && (
                        <span className="tablechange">{tableTh}</span>
                      )}
                      {tagName === 'FIG' && (
                        <span>
                          {trackValues.attributes['linkend_fig'].value} has been
                          inserted
                        </span>
                      )}
                      {tagName === 'INFORMALFIGURE' && (
                        <span>New Inline figure has been inserted</span>
                      )}
                      {boldTag && <span>Bolded Text</span>}
                      {italicTag && <span>Italic Text</span>}
                      {underlineTag && <span>Underline Text</span>}
                      {(unorderListTag || orderListTag) &&
                        roleAttr &&
                        roleAttr.value === 'new-element' && (
                          <span>New List Inserted</span>
                        )}
                      {tagName === 'SOURCE1' && (
                        <span>Inserted Source Element</span>
                      )}
                      {tagName === 'SEC' &&
                        !trackValues.attributes['prev_role'] && (
                          <span>
                            New {trackValues.attributes['sec-type'].value}{' '}
                            Section Inserted
                          </span>
                        )}
                      {tagName === 'SEC' &&
                        trackValues.attributes['prev_role'] && (
                          <span>
                            {trackValues.attributes['prev_role'].value} changed
                            to{' '}
                            {trackValues.attributes['sec-type'] &&
                              trackValues.attributes['sec-type'].value}
                          </span>
                        )}
                      {(tagName === 'SIDEBAR' || tagName === 'BOXED-TEXT') && (
                        <span>New Box Inserted</span>
                      )}
                      {tagName === 'SUP' && !prevFormat && (
                        <span>Superscript</span>
                      )}
                      {tagName === 'SUB' && !prevFormat && (
                        <span>Subscript</span>
                      )}
                      {tagName === 'EPIGRAPH' && !roleAttr && (
                        <span>New Epigraph Element Inserted</span>
                      )}
                      {tagName === 'IMG' && (
                        <img src={trackValues.attributes.src.value} />
                      )}
                      {blockQuoteTag && !roleAttr && (
                        <span>New Blockquote Element Inserted</span>
                      )}
                      {pTag && splitPara && <span>Splited Paragraph</span>}
                      {pTag && newPara && <span>New Paragraph Inserted</span>}
                      {pTag &&
                        roleAttr &&
                        roleAttr.value === 'merge_para' &&
                        !splitPara && <span>Merged Paragraph</span>}
                      {tagName === 'SOURCE' && (
                        <span>New Source Element Inserted</span>
                      )}
                      {tagName === 'EXAMPLE' && (
                        <span>New Example Element Inserted</span>
                      )}
                      {refTag && (
                        <span>
                          Ref. sorted from {beforeSort} to {afterSort}
                        </span>
                      )}
                      {scTag && <span>Small Caps Text</span>}
                      {trackRoleTxt && !splitPara && (
                        <span className="add-role">
                          Changed Role as {trackRoleTxt}
                        </span>
                      )}
                      {roleAttr &&
                        roleAttr.value === 'change-element' &&
                        !splitPara && (
                          <span className="changed-element">
                            Element changed from{' '}
                            {trackValues.attributes['data-tagname'] &&
                              trackValues.attributes[
                                'data-tagname'
                              ].value.toLowerCase()}{' '}
                            to {tagName.toLowerCase()}
                          </span>
                        )}
                      {prevFormat && (
                        <span>
                          Changed from{' '}
                          {prevFormat.value.charAt(0).toUpperCase() +
                            prevFormat.value.slice(1)}{' '}
                          to Normal
                        </span>
                      )}
                    </p>
                  </div>

                  {chanEleHis && (
                    <>
                      {hisValArr.map((arr, index) => {
                        return (
                          <div
                            onMouseOver={this.hideParentAccRej}
                            onMouseLeave={this.showParentAccRej}
                            className="change-ele-his row ml-2 px-2 pt-3 pb-2 b-1-grey"
                            key={index}
                          >
                            <div className="col-1 p-0">
                              <i className="material-icons cstm-success-color f-18-px">
                                add
                              </i>
                            </div>
                            <div className="col-11 pl-1 track-data-row">
                              <h6 className="mb-0 col-10 row">
                                {arr.split('-')[0]}
                              </h6>
                              <span className="track-time">
                                {new Date(arr.split('-')[3]).toLocaleString()}
                              </span>
                              <div className="track-action-row-child">
                                <i
                                  className="material-icons cstm-success-color float-right track-accept"
                                  title="Accept change"
                                  onClick={(e) =>
                                    window.changeEleAccept(
                                      dataTimeVal,
                                      arr.split('-')[1],
                                      arr.split('-')[2],
                                      index
                                    )
                                  }
                                >
                                  done
                                </i>
                                <i
                                  className="material-icons cstm-danger-color float-right track-reject"
                                  title="Reject change"
                                  onClick={(e) =>
                                    window.changeEleReject(dataTimeVal, index)
                                  }
                                >
                                  close
                                </i>
                              </div>
                              <p className="modified-txt">
                                <span>
                                  Element changed from{' '}
                                  {arr.split('-')[1].toLowerCase()} to{' '}
                                  {arr.split('-')[2].toLowerCase()}
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </li>
              )
            );
          })}
        </ul>
        {this.props.trackingCont.length > 0 &&
          this.props.permissions.accept_changes &&
          this.props.permissions.reject_changes && (
            // <AcceptRejectAll trackingList = {this.props.trackingCont} acceptRejectAll = {this.acceptRejectAll} selectAccRejAll = {this.selectAccRejAll} mergeParaAccept= {this.mergeParaAccept} mergeParaReject={this.mergeParaReject} splitParaAccept={this.splitParaAccept} splitParaReject={this.splitParaReject} changeEleParAccept={this.changeEleParAccept} changeEleParReject={this.changeEleParReject} thAccept={this.thAccept} thReject={this.thReject} addRoleAccept={this.addRoleAccept} addRoleReject={this.addRoleReject} loaderStart={this.loaderStart} loadingDiv={this.loadingDiv} loaderStop ={this.loaderStop} />

            <>
              <div className="accept-reject-all pt-2">
                <button
                  className="btn cstm-save-btn mr-2 float-right"
                  onClick={() =>
                    this.acceptRejectAll(this.props.trackingCont, 'accept')
                  }
                >
                  <i className="material-icons cstm-success-color">done</i>
                  Accept All
                </button>
                <button
                  className="btn cstm-delete-btn mr-2 float-right"
                  onClick={() =>
                    this.acceptRejectAll(this.props.trackingCont, 'reject')
                  }
                >
                  <i className="material-icons cstm-danger-color">close</i>
                  Reject All
                </button>
              </div>
              {this.state.showLoader && <Spinner loadingText={'Loading...'} />}
            </>
          )}
      </>
    );
  }
}
export default TrackPanelTemplate;
