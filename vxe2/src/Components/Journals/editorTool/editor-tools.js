import React from 'react';
import { Prompt } from 'react-router-dom';
import '../css/journals-main.css';
import '../css/reusables.css';
import '../css/journals-editor-tools.css';
import Select from 'react-select';
import Dropdown from 'react-bootstrap/Dropdown';
import LZUTF8 from 'lzutf8';
import ArticleMetaPopup from '../modals/artical-meta-edit-modal';
import AffDeleteConfirm from '../modals/articalComponents/aff-delete';
import Toast, { showWarningToast } from '../../../utils/toast';
import $ from 'jquery';
import ElementBuilder from './editorComponents/ElementBuilder';
import {
  loadFromIndexedDB,
  saveToIndexedDB,
  removeFromIndexDB,
} from '../../../utils/indexDB';
import builderVals from '../../../utils/ElementBuilderValues';
import Loading from '../loading/spinningCircle';

class EditorTools extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectChangeElement: null,
      selectedChangeElement: '',
      selectNewElement: null,
      selectedNewElement: '',
      selectedTitleRole: '',
      selectRole: null,
      selectedRole: '',
      styleEditList: [],
      affDeleterow: '',
      md5Data: '',
      metadataEle: '',
      undoTriggered: false,
      isFormIncomplete: true,
      builderValues: builderVals(),
      loading: false,
      userTyped: false,
    };
    this.toast = React.createRef();
    this.contentValidation = this.contentValidation.bind(this);
    this.styleEditorDropDown = this.styleEditorDropDown.bind(this);
    this.handleCitation = this.handleCitation.bind(this);
    this.deleteAff = this.deleteAff.bind(this);
  }

  componentDidUpdate() {
    const { callAutoSave } = this.props;
    if (callAutoSave > 0) {
      this.syncWithserver();
    }
  }

  componentDidMount() {
    //Update api before page open to ensuere nothing is lost
    this.syncWithserver();

    window.EditorTools = this;
    $('#savingStatus').val('Yes');
    const script = document.createElement('script');
    script.src = '/assets/js/editor-tool.js';
    document.body.appendChild(script);
    this.styleEditorDropDown();
    // this.openArticalModal();

    this.timer = setInterval(() => {
      this.syncWithserver();
    }, 30000);

    window.addEventListener('beforeunload', async (ev) => {
      ev.preventDefault();

      if (this.state.userTyped) {
        this.syncWithserver();
        ev.returnValue = '';
      }
    });
  }

  triggerManualSave = () => {
    this.syncWithserver();
    document.querySelector('.deanta-toast-alert').classList.remove('hidden');
  };

  //TODO1: Add descriptive comment here please eg: //Removes the write lock to allow a user ......
  removeLoggedSession() {
    let token = window.localStorage.getItem('lanstad-token');
    fetch('https://api.stg-lanstad.com/VXE/OxygenLogUserUpdate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Lanstad-Token': token,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log('error', err);
        return false;
      });
  }

  componentWillUnmount() {
    //Update api before page closes to ensuere nothing is lost
    this.syncWithserver();

    //Cleanup for the api syncs
    clearInterval(this.timer);
  }

  trackUserKeys(
    md5,
    project_id,
    task_id,
    chapter_id,
    user_id,
    filename,
    filename_path,
    html_content
  ) {
    //saves to indexDB for each key press

    //We need to review it future. Today we are compressing the html content
    let htmlContentCompressed = LZUTF8.compress(html_content);

    let arrayDataToSaveOnLocalStorage = {
      id: 1,
      md5,
      project_id,
      task_id,
      chapter_id,
      user_id,
      filename,
      filename_path,
      htmlContentCompressed,
    };

    this.setState({ userTyped: true });

    saveToIndexedDB('proEditorData', arrayDataToSaveOnLocalStorage)
      .then(function (response) {
        // alert('data saved');
      })
      .catch(function (error) {
        // alert(error.message);
      });
    $('#savingStatus').val('No');
  }

  //[1/2] //send message to api
  callAPI(dataIndexDB) {
    //call API HERE

    var htmlContentDescompressed = '';

    //Changing the icon and text of status
    const statusText = document.getElementById('data-status');
    const statusIcon = document.getElementById('data-status-icon');

    if (statusText && statusIcon) {
      statusText.innerHTML = 'Saving...';
      statusIcon.innerHTML = 'sync';
    }

    if (dataIndexDB) {
      htmlContentDescompressed = LZUTF8.decompress(
        dataIndexDB?.htmlContentCompressed
      );
    }

    let api_url = $('#api_url').val();
    $.ajax({
      type: 'POST',
      url: api_url + '/VXE/SaveXMLJournal',
      data: {
        project_id: dataIndexDB.project_id,
        chapter_id: dataIndexDB.chapter_id,
        task_id: dataIndexDB.task_id,
        filename: dataIndexDB.filename,
        filename_path: dataIndexDB.filename_path,
        user_id: dataIndexDB.user_id,
        // html_content: dataLocalStorage.html_content,
        html_content: htmlContentDescompressed,
        md5: dataIndexDB.md5,
      },
      beforeSend: function () {
        $('.saving_file').removeClass('hide');
        $('.saved_file').addClass('hide');
        $('#savingStatus').val('No');
      },
      success: function (res) {
        $('.saving_file').addClass('hide');
        $('.saved_file').removeClass('hide');
        $('.saved_file').fadeOut(5000);
        window.Journals.trackListCount();
        $('#savingStatus').val('Yes');
        var chg = $('#change-element').val();
        let msg = '';
        if (chg == 1) {
          window.tocforjournals();
        }

        removeFromIndexDB('proEditorData', 1);
      },
      error: function (x, e) {
        if (x.status == 0) {
          // alert('You are offline!!\n Please Check Your Network.');
        } else if (x.status == 404) {
          console.log('Requested URL not found.');
        } else if (x.status == 500) {
          console.log('Internel Server Error.');
        } else if (e == 'parsererror') {
          console.log('Error.\nParsing JSON Request failed.');
        } else if (e == 'timeout') {
          console.log('Request Time out.');
        } else {
          console.log('Unknow Error.\n' + x.responseText);
        }
      },
    });

    this.setState({ userTyped: false });
  }

  //[2/2] updates the server every X seconds with all the user changes that were tracked locally
  syncWithserver = async () => {
    const dataIndexBD = await this.checkIndexDbData('proEditorData', 1);

    if (this.state.md5Data !== dataIndexBD?.md5 && dataIndexBD) {
      this.callAPI(dataIndexBD);
      this.setState({ md5Data: dataIndexBD?.md5 });
    }
  };

  checkIndexDbData = async (storeName, id) => {
    let dataIndexBD = null;

    await loadFromIndexedDB(storeName, id)
      .then(function (reponse) {
        dataIndexBD = reponse;
        // alert('data loaded OK');
      })
      .catch(function (error) {
        // alert(error.message);
      });

    return dataIndexBD;
  };

  styleEditorDropDown() {
    var api_url = $('#api_url').val();
    var project_id = $('#projectid').val();
    var chapter_id = $('#chapterid').val();
    this.setState({
      loading: true,
    });
    fetch(api_url + '/VXE/StyleEditingList/', {
      method: 'POST',
      body: JSON.stringify({
        ProjectId: project_id,
        ChapterId: chapter_id,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          styleEditList: response.group_list,
        });
      })
      .catch(function (error) {});
    this.setState({
      loading: false,
    });
  }

  styleEditingAction = (selectedStyle) => {
    var show = true;
    this.props.styleEdit(show, selectedStyle);
    window.style_editing(selectedStyle);
  };

  contentValidation = () => {
    var show = true;
    this.props.contentVali(show);
  };

  consistencyAction = () => {
    var show = true;
    this.props.consistencyVali(show);
  };

  //This function handleChangeElement is invoked every
  //time the user type something?

  handleChangeElement = (selectChangeElement) => {
    console.log('INSIDE HANDLE chanmge ELEM', selectChangeElement);
    this.setState({ selectChangeElement });
    let selectedChangeElement = '';
    let Change_list_elements = document.querySelector('#Change_list_elements');
    Change_list_elements.classList.add('hide');
    this.removeActiveDropdown('.chg-select');
    if (selectChangeElement !== null) {
      this.addActiveDropdown('.chg-select');
      selectedChangeElement = selectChangeElement.value;
      if (selectedChangeElement === 'List_Sublist') {
        Change_list_elements.classList.remove('hide');
      }
    }
    this.setState({ selectedChangeElement });
  };

  handleNewElement = (selectNewElement) => {
    console.log('INSIDE HANDLE NEW ELEM', selectNewElement);
    this.setState({ selectNewElement });
    let selectedNewElement = '';
    let heading_element = document.querySelector('#heading_element');
    let list_elements = document.querySelector('#list_elements');
    heading_element.classList.add('hide');
    list_elements.classList.add('hide');
    this.removeActiveDropdown('#new-element-select-drop');
    if (selectNewElement !== null) {
      this.addActiveDropdown('#new-element-select-drop');
      selectedNewElement = selectNewElement.value;
      if (selectedNewElement === 'Heading') {
        heading_element.classList.remove('hide');
      } else if (selectedNewElement === 'List_Sublist') {
        list_elements.classList.remove('hide');
      }
    }
    this.setState({ selectedNewElement });
  };

  handleTitleRole = (selectedTitleRole) => {
    this.setState({ selectedTitleRole });
    let selectedRole = selectedTitleRole.value;
    this.setState({ selectedRole });
  };

  handleRole = (selectRole) => {
    this.setState({ selectRole });
    let selectedRole = selectRole.value;
    this.setState({ selectedRole });
  };

  addActiveDropdown(id) {
    let DropdownList = document.querySelectorAll(id);
    if (DropdownList !== null) {
      [].forEach.call(DropdownList, (e) => {
        e.classList.add('active');
      });
    }
  }

  removeActiveDropdown(id) {
    let DropdownList = document.querySelectorAll(id);
    if (DropdownList !== null) {
      [].forEach.call(DropdownList, (e) => {
        e.classList.remove('active');
      });
    }
  }

  grammerChecker = () => {
    var show = true;
    this.props.grammerCheck(show);
  };

  spellChecker = (type) => {
    $('#us_uk_spellcheck').val(type);
    var show = true;
    this.props.spellCheck(show);
  };

  findPanel = () => {
    var show = true;
    this.props.findPan(show);
  };

  openArticalModal() {
    document.getElementById('myModalfront').removeAttribute('contenteditable');
    this.setState({
      metadataEle: Array.from(document.querySelector('article-meta').children),
    });
  }

  cancelArticleChanges() {
    if (document.getElementById('store-fm-undo').children.length > 0) {
      document.getElementById('store-fm-undo').innerHTML = '';
    }
    if (document.getElementById('store-fm-redo').children.length > 0) {
      document.getElementById('store-fm-redo').innerHTML = '';
    }
    window.modelHide('myModalfront');
    if (!this.state.undoTriggered) this.setState({ metadataEle: '' });
  }

  saveArticleChanges() {
    let errTemp = '<span class="article-error">Field is empty.</span>';
    let err2Temp = '<span class="article-error">Invalid Citation.</span>';
    let allFields = $('#myModalfront .form-control');
    let allowSave = true;
    Array.from(allFields).forEach((data, index) => {
      $(data).next('.article-error').remove();
      let notCompleteDel = false;
      let delTxt = [];
      let rowTxt = [];
      Array.from($(data).find('.del')).forEach((dat, ind) => {
        delTxt.push($(dat).text());
      });
      Array.from(data.childNodes).forEach((dat, ind) => {
        if (dat.nodeName !== 'ALT-TITLE' && $(dat).text() !== ' ')
          rowTxt.push($(dat).text());
      });
      if (rowTxt.toString() === delTxt.toString()) notCompleteDel = true;
      if ($(data).text() === '' || notCompleteDel) {
        $(data).after(errTemp);
        $(data).addClass('err-border');
        allowSave = false;
      } else {
        if ($(data).next('.article-error').length > 0)
          $(data).next('.article-error').remove();
        $(data).removeClass('err-border');
      }
      let citationEle = data.classList.contains('citationlink');
      if (citationEle) {
        let citationRes = window.authorCitationValidate(data, 'action');
        if (!citationRes) {
          if ($(data).next('.article-error').length === 0) {
            $(data).after(err2Temp);
            $(data).addClass('err-border');
          }
          allowSave = false;
        }
      }
    });
    if (allowSave) {
      this.saveWithOutErrArticleChanges();
    }
  }

  saveWithOutErrArticleChanges() {
    this.authorChangesSave();
    this.articleModified();
    this.hasNewFields();
    this.hasNewFootnote();
    this.dragAuthFields();
    this.dragHisFields();
    this.deleteField();

    let addAffFields;
    let findLastChild = $('#content aff').length - 1;
    let newAffFields = document.getElementById('myModalfront');
    newAffFields = newAffFields.getElementsByClassName('new-aff-row');
    if ($('.first-sup').length > 1) {
      let storeId = $('.first-sup').parent('.form-group').attr('aff-storeid');
      let initHtml = $('aff[store="' + storeId + '"]').html();
      let firstSupTag =
        '<sup store="' +
        $($('.first-sup')[0]).children('[data-storeid]').attr('data-storeid') +
        '" contenteditable="true" spellcheck="false">1</sup>';
      $('aff[store="' + storeId + '"]').html(firstSupTag + initHtml);
    }
    Array.from(newAffFields).forEach((data, index) => {
      let contribId = $(data).attr('aff-storeid');
      let parentRow = $(
        '#myModalfront [aff-storeid="' + contribId + '"] .form-control'
      );
      let affCont;
      let affId;
      let xrefId;
      let xrefCont;
      Array.from($(parentRow)).forEach((dat, ind) => {
        if ($(parentRow[ind]).attr('data-tagname') === 'XREF') {
          xrefId = $(parentRow[ind]).attr('data-storeid');
          xrefCont = $(parentRow[ind]).html();
          if (xrefCont.split('<br').length > 1)
            xrefCont = xrefCont.split('<br')[0];
        } else if ($(parentRow[ind]).attr('data-tagname') === 'aff') {
          affId = $(parentRow[ind]).attr('data-storeid');
          affCont = $(parentRow[ind]).html();
          if (affCont.split('<br').length > 1)
            affCont = affCont.split('<br')[0];
        }
      });
      addAffFields =
        '<aff id="' +
        affId +
        '" store="' +
        contribId +
        '" contenteditable="true" spellcheck="false" class="hidden_para"><sup store="' +
        xrefId +
        '" contenteditable="true" spellcheck="false">' +
        xrefCont +
        '</sup> ' +
        affCont +
        '</aff>';
    });
    window.closePopup('myModalfront');
    $($('#content aff')[findLastChild]).after(addAffFields);
    $('#content contrib br').remove();
    window.autosavefunction_vxe();
  }

  authorChangesSave() {
    let newAuthFields = document.getElementById('myModalfront');
    newAuthFields = newAuthFields.getElementsByClassName('new-author-row');
    Array.from(newAuthFields).forEach((data, index) => {
      let contribId = $(data).attr('contrib-storeid');
      let parentRow = $(
        '#myModalfront [contrib-storeid="' + contribId + '"] .form-control'
      );
      let authId;
      let givenId;
      let affId;
      let authCont;
      let givenCont;
      let affCont;
      Array.from($(parentRow)).forEach((dat, ind) => {
        if ($(parentRow[ind]).attr('data-tagname') === 'surname') {
          authId = $(parentRow[ind]).attr('data-storeid');
          authCont = $(parentRow[ind]).html();
          if (authCont.split('<br').length > 1)
            authCont = authCont.split('<br')[0];
        } else if ($(parentRow[ind]).attr('data-tagname') === 'given-names') {
          givenId = $(parentRow[ind]).attr('data-storeid');
          givenCont = $(parentRow[ind]).html();
          if (givenCont.split('<br').length > 1)
            givenCont = givenCont.split('<br')[0];
        } else if ($(parentRow[ind]).attr('data-tagname') === 'XREF') {
          affId = $(parentRow[ind]).attr('data-storeid');
          affCont = $(parentRow[ind]).html();
          if (affCont.split('<br').length > 1)
            affCont = affCont.split('<br')[0];
        }
      });

      let addAuthFields =
        '<!--punc-->, <!--punc--><contrib contrib-type="author" corresp="no" store="' +
        contribId +
        '" contenteditable="true" spellcheck="false"><name store="name-' +
        authId +
        '" contenteditable="true" spellcheck="false"><surname store="' +
        authId +
        '" contenteditable="true" spellcheck="false">' +
        authCont +
        '</surname> <given-names store="' +
        givenId +
        '" contenteditable="true" spellcheck="false">' +
        givenCont +
        '</given-names></name><xref ref-type="aff" rid="AF0002" store="xref' +
        affId +
        '" contenteditable="true" spellcheck="false"><sup store="' +
        affId +
        '" contenteditable="true" spellcheck="false">' +
        affCont +
        '</sup></xref></contrib>';
      let findLastChild = $('#content contrib').length - 1;
      $($('#content contrib')[findLastChild]).after(addAuthFields);
    });
  }

  handleCitation(e) {
    let data = e.currentTarget;
    window.authorCitationValidate(data);
  }

  deleteAff(e) {
    let affElement = e.target.closest('.form-group');
    if (!!affElement) {
      let id = affElement.getAttribute('id');
      this.setState({ affDeleterow: id });
      window.deleteAffConfirm();
    }
  }

  articleModified() {
    let modifiedFields = document.getElementById('myModalfront');
    modifiedFields = modifiedFields.getElementsByClassName('modified-article');
    Array.from(modifiedFields).forEach((data) => {
      let modifiedFieldsId = data.attributes['data-storeid'];
      if (!!modifiedFieldsId) {
        let modifiedHtml = data.innerHTML;
        if (
          $(data).hasClass('citationlink') &&
          data.attributes['data-tagname'].value === 'XREF'
        ) {
          this.addAffCitationId(data, modifiedFieldsId);
        }
        if (
          $(data).hasClass('aff-box') &&
          data.attributes['data-tagname'].value === 'aff'
        ) {
          let supTxt = data
            .closest('.form-group')
            .querySelector('.form-control[data-tagname="XREF"]').innerText;
          let storId = data
            .closest('.form-group')
            .querySelector('.form-control[data-tagname="XREF"]').attributes[
            'data-storeid'
          ].value;
          let supTag =
            '<sup store="' +
            storId +
            '" contenteditable="true" spellcheck="false">' +
            supTxt +
            '</sup>';
          $('#content [store="' + modifiedFieldsId.value + '"]').html(
            supTag + modifiedHtml
          );
        } else {
          $('#content [store="' + modifiedFieldsId.value + '"]').html(
            modifiedHtml
          );
        }
      }
    });
  }

  addAffCitationId(data, modifiedFieldsId) {
    let contentEle = document.getElementById('content');
    let affEle = contentEle.getElementsByTagName('aff'),
      i;
    let dataNew = data.cloneNode(true);
    let citationtext = window.getInsertEle(dataNew, 'i');
    if (affEle.length > 0 && citationtext !== '') {
      for (i = 0; i < affEle.length; ++i) {
        let element = affEle[i];
        let elementNew = element.cloneNode(true);
        let supEle = elementNew.querySelector('sup');
        let rid = element.getAttribute('id');
        if (!!supEle) {
          let affText = window.getInsertEle(supEle, 'i');
          if (citationtext == affText) {
            let newCitation = contentEle.querySelector(
              "[store='" + modifiedFieldsId.value + "']"
            );
            if (!!newCitation) {
              let parTag = newCitation.parentElement.tagName;
              if (parTag === 'XREF') {
                newCitation.parentElement.setAttribute('rid', rid);
              }
            }
          }
        }
      }
    }
  }

  hasNewFields() {
    let hasNewFields = document.getElementById('myModalfront');
    hasNewFields = hasNewFields.getElementsByClassName('has-new-fields');

    Array.from(hasNewFields).forEach((data) => {
      let hasNewFieldsId = data.attributes['data-storeid'];
      if (!!hasNewFieldsId) {
        hasNewFieldsId = hasNewFieldsId.value;
        let parentId = $(data).parent().parent().attr('contrib-storeid');
        let findLastChild =
          $('#content contrib[store="' + parentId + '"]').children().length - 1;
        let newFieldHtml = $(
          '.fm-author-group [data-storeid="' + hasNewFieldsId + '"]'
        ).html();
        if (newFieldHtml.split('<br').length > 1)
          newFieldHtml = newFieldHtml.split('<br')[0];
        if (
          $('.fm-author-group [data-storeid="' + hasNewFieldsId + '"]').attr(
            'data-label'
          ) === 'Separaror'
        ) {
          let supTag =
            '<!--punc--><sup store="' +
            hasNewFieldsId +
            '" contenteditable="true" spellcheck="false">' +
            newFieldHtml +
            '</sup>';
          $(
            $('#content contrib[store="' + parentId + '"]').children()[
              findLastChild
            ]
          ).after(supTag);
        } else if (
          $('.fm-author-group [data-storeid="' + hasNewFieldsId + '"]').attr(
            'data-label'
          ) === 'Affiliation Citation'
        ) {
          let xrefTag =
            '<!--punc--><xref ref-type="aff" rid="" store="xref' +
            hasNewFieldsId +
            '" contenteditable="true" spellcheck="false"><sup store="' +
            hasNewFieldsId +
            '" contenteditable="true" spellcheck="false">' +
            newFieldHtml +
            '</sup></xref>';
          $(
            $('#content contrib[store="' + parentId + '"]').children()[
              findLastChild
            ]
          ).after(xrefTag);
          this.addAffCitationId(data, data.attributes['data-storeid']);
        } else if (
          $('.fm-author-group [data-storeid="' + hasNewFieldsId + '"]').attr(
            'data-label'
          ) === 'Footnote Citation'
        ) {
          let xrefTag =
            '<!--punc--><xref ref-type="fn" rid="fn1" store="xref' +
            hasNewFieldsId +
            '" contenteditable="true" spellcheck="false"><sup store="' +
            hasNewFieldsId +
            '" contenteditable="true" spellcheck="false">' +
            newFieldHtml +
            '</sup></xref>';
          $(
            $('#content contrib[store="' + parentId + '"]').children()[
              findLastChild
            ]
          ).after(xrefTag);
        }
      }
    });
  }

  dragAuthFields() {
    let dragFields = document.getElementById('myModalfront');
    dragFields = dragFields.getElementsByClassName('drag-change');

    Array.from(dragFields).forEach((data, index) => {
      if ($(data).hasClass('drag-count-' + index)) {
        let searchId = 'contrib-storeid';
        window.metaReorder(searchId, data, 'author');
      }
    });
  }

  hasNewFootnote() {
    let hasNewFields = document.getElementById('myModalfront');
    hasNewFields = hasNewFields.getElementsByClassName('footnote-new');
    let storeId = Date.parse(new Date());
    Array.from(hasNewFields).forEach((data) => {
      let hasNewFieldsId = data.attributes['data-storeid'];
      let newFieldHtml = data.innerHTML;
      if (!!hasNewFieldsId) {
        hasNewFieldsId = hasNewFieldsId.value;
        let footnoteTag =
          '<fn store="fn' +
          storeId +
          '" id="fn1"><pp1 store="pp1' +
          storeId +
          '">' +
          newFieldHtml +
          '</pp1></fn>';
        let contentElement = document.getElementById('content');
        let metaDataElement =
          contentElement.getElementsByTagName('article-meta');
        if (metaDataElement.length > 0) {
          metaDataElement = metaDataElement[0];
          let affEle = metaDataElement.getElementsByTagName('fn'),
            i;
          if (affEle.length === 0) {
            let affElee = metaDataElement.getElementsByTagName('corresp');
            if (affElee.length > 0) {
              affElee = affElee[0];
              let storeId = affElee.getAttribute('store');
              $("#content [store='" + storeId + "']").after(footnoteTag);
            }
          }
        }
      }
    });
  }

  dragHisFields() {
    let dragHisFields = document.getElementById('myModalfront');
    dragHisFields = dragHisFields.getElementsByClassName('drag-his-change');

    Array.from(dragHisFields).forEach((data, index) => {
      if ($(data).hasClass('drag-his-count-' + index)) {
        let searchId = 'date-cont-storeid';
        window.metaReorder(searchId, data, 'his');
      }
    });
  }

  deleteField() {
    let delRow = document.getElementById('myModalfront');
    delRow = delRow.getElementsByClassName('deleted-row');

    let parentId;
    Array.from(delRow).forEach((data, index) => {
      let hasAttr = false;
      if (!!data.attributes['aff-storeid']) {
        parentId = data.attributes['aff-storeid'].value;
        hasAttr = true;
      } else if (!!data.attributes['contrib-storeid']) {
        parentId = data.attributes['contrib-storeid'].value;
        hasAttr = true;
      }
      if (hasAttr) {
        let delRowHtml = document.querySelector(
          '#content [store="' + parentId + '"]'
        ).innerHTML;
        let userName = document.getElementById('username').value;
        let dataTime = Date.parse(new Date());
        let delSpanTemp =
          '<span class="del cts-2" data-username="' +
          userName +
          '" data-time="' +
          dataTime +
          '" data-user="current-user" title="Deleted by ' +
          userName +
          ' - ' +
          dataTime.toLocaleString() +
          '">' +
          delRowHtml +
          '</span>';
        document.querySelector(
          '#content [store="' + parentId + '"]'
        ).innerHTML = delSpanTemp;
        let contentElement = document.getElementById('content');
        let rid = document
          .querySelector('#content [store="' + parentId + '"]')
          .getAttribute('id');
        let xrefEle = contentElement.querySelectorAll('[rid="' + rid + '"]');
        Array.from(xrefEle).forEach((data, index) => {
          let affElement = xrefEle[index];
          let prevEle = affElement.previousElementSibling;
          if (!!prevEle && prevEle.tagName !== 'SUP') {
            prevEle = affElement.nextElementSibling;
          }
          let supElement = affElement.querySelector('sup');
          if (!!supElement) {
            let supStoreId = supElement.getAttribute('store');
            this.deleteCitationAuthor(supElement, contentElement, supStoreId);
          }
          if (!!prevEle && prevEle.tagName === 'SUP') {
            let supStoreId = prevEle.getAttribute('store');
            this.deleteCitationAuthor(prevEle, contentElement, supStoreId);
          }
        });
      }
    });
  }

  deleteCitationAuthor = (ele, contentElement, supStoreId) => {
    ele = window.getOldEle(ele, 'text');
    let userName = $('#username').val();
    let d = new Date();
    let dt = Date.parse(d);
    const userId = $('#userid').val();
    let str =
      '<span class="del cts-1" data-cid="66" data-userid="' +
      userId +
      '" data-username="' +
      userName +
      '" data-time="' +
      dt +
      '">' +
      ele +
      '</span>';
    if (ele !== '') {
      let element = contentElement.querySelector(
        "[store='" + supStoreId + "']"
      );
      element.innerHTML = str;
    }
  };

  render() {
    const changeElement = [
      { value: 'blockquote', label: 'Blockquote' },
      { value: 'Epigraph', label: 'Epigraph' },
      { value: 'Para', label: 'Para' },
      { value: 'List_Sublist', label: 'List/Sublist' },
    ];
    const changeElementPara = [
      { value: 'blockquote', label: 'Blockquote' },
      { value: 'Epigraph', label: 'Epigraph' },
      { value: 'List_Sublist', label: 'List/Sublist' },
    ];
    const newElement = [
      { value: 'Heading', label: 'Heading' },
      { value: 'List_Sublist', label: 'List/Sublist' },
      { value: 'Sidebar', label: 'Box' },
      { value: 'Epigraph', label: 'Epigraph' },
      { value: 'source', label: 'Source' },
      { value: 'blockquote', label: 'Blockquote' },
      { value: 'example', label: 'Example' },
    ];
    const TitleRole = [
      { value: 'ExtractTitle', label: 'Extract Title' },
      { value: 'chaptertitle', label: 'Chapter Title' },
    ];
    const RoleOption = [
      { value: 'symbol_para', label: ' Symbol para' },
      { value: 'bib_text', label: ' Bib text' },
      { value: 'noindent', label: ' No indent' },
      { value: 'bib_para', label: ' Bib para' },
      { value: 'source', label: ' Source' },
      { value: 'pararight', label: ' Para right' },
      { value: 'pararightabove', label: ' Para right above' },
      { value: 'paraleftabove', label: ' Para left above' },
      { value: 'paracenterabove', label: ' Para center above' },
      { value: 'paracenter', label: ' Para center' },
      { value: 'inline_caption', label: ' Inline caption' },
      { value: 'ExtractAff', label: ' Extract Aff' },
      { value: 'ExtractAuthor', label: ' Extract Author' },
      { value: 'ExtractText', label: ' Extract Text' },
      { value: 'ExtractOpen', label: ' Extract Open' },
    ];
    const {
      selectChangeElement,
      selectedChangeElement,
      selectNewElement,
      selectedNewElement,
      styleEditList,
      loading,
    } = this.state;
    return (
      <div>
        {loading && <Loading loadingText={'Loading...'} />}
        {/* Toast Message */}
        <Toast syncWithserver={() => this.syncWithserver()} ref={this.toast} />
        <div className="editor-tools ">
          <div className="row-editor">
            {this.props.permissions.show_changes && (
              <>
                <i
                  className="material-icons hide_trackchanges active"
                  title="Hide changes"
                  onClick={() => window.hide_trackchanges()}
                >
                  track_changes
                </i>
                <i
                  className="material-icons show_trackchanges hide"
                  title="Show changes"
                  onClick={() => window.show_trackchanges()}
                >
                  track_changes
                </i>
              </>
            )}
            {this.props.permissions.show_xml_elements && (
              <>
                <i
                  className="material-icons show_xmltag"
                  title="Show XML Elements"
                >
                  code
                </i>
                <i
                  className="material-icons hide hide_xmltag active"
                  title="Hide XML Elements"
                >
                  code
                </i>
              </>
            )}
            {(this.props.permissions.show_changes ||
              this.props.permissions.show_xml_elements) && (
              <span className="separator"></span>
            )}
            {this.props.permissions.comments && (
              <i
                className="material-icons-outlined addComment"
                title="Add Comment"
                onMouseDown={(e) => window.addComment(e)}
              >
                add_comment
              </i>
            )}
            {this.props.permissions.query && (
              <i
                className="material-icons-outlined addQuery"
                title="Add Query"
                onMouseDown={(e) => window.addQuery(e)}
              >
                help_outline
              </i>
            )}
            {this.props.permissions.query_sheet && (
              <i
                className="material-icons ShowQuery tour-show-query-btn"
                title="Query Sheet"
                onClick={() => window.ShowQuery()}
              >
                list_alt
              </i>
            )}
            {(this.props.permissions.comments ||
              this.props.permissions.query ||
              this.props.permissions.query_sheet) && (
              <span className="separator"></span>
            )}
            {this.props.permissions.undo && (
              <i
                className="material-icons undoicon retrievedata"
                title="Undo"
                onMouseDown={(e) => window.retrievedata(e)}
              >
                undo
              </i>
            )}
            {this.props.permissions.redo && (
              <i
                className="material-icons redoicon redofunctiondata"
                title="Redo"
                onMouseDown={(e) => window.redofunctiondata(e)}
              >
                redo
              </i>
            )}
            {(this.props.permissions.undo || this.props.permissions.redo) && (
              <span className="separator"></span>
            )}
            {/* {this.props.permissions.add_elements && (
                            <i className="material-icons addnewelements hide" title="Add new element">text_format</i>
                        )} */}
            {this.props.permissions.add_element && (
              <Dropdown className="m-0" alignRight>
                <Dropdown.Toggle
                  id="dropdown-basic"
                  className="pt-0 cstm-dropdown-icon"
                >
                  <i className="material-icons drop-itens" title="Add Element">
                    text_format
                  </i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    className="dropdrownoption"
                    data-label="Box"
                    data-option="Sidebar"
                  >
                    Box
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
            {this.props.permissions.head_level && (
              <Dropdown className="m-0" alignRight>
                <Dropdown.Toggle
                  id="dropdown-header"
                  className="pt-0 cstm-dropdown-icon"
                >
                  <i className="fas fa-heading drop-itens" title="Headings"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    className="headerchg"
                    data-label="H1"
                    data-option="H1"
                  >
                    Heading 1
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="headerchg"
                    data-label="H2"
                    data-option="H2"
                  >
                    Heading 2
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="headerchg"
                    data-label="H3"
                    data-option="H3"
                  >
                    Heading 3
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="headerchg"
                    data-label="H4"
                    data-option="H4"
                  >
                    Heading 4
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="headerchg"
                    data-label="H5"
                    data-option="H5"
                  >
                    Heading 5
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="headerchg"
                    data-label="H6"
                    data-option="H6"
                  >
                    Heading 6
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
            {this.props.permissions.extract && (
              <i
                className="fa fa-quote-right extractpara hide"
                title="Extract"
                onMouseDown={(e) =>
                  window.changeBQEleToElement(
                    e,
                    window.getSelectionParentElement()
                  )
                }
              ></i>
            )}
            {(this.props.permissions.add_elements ||
              this.props.permissions.head_level ||
              this.props.permissions.extract) && (
              <span className="separator"></span>
            )}
            {this.props.permissions.bold && (
              <i
                className="material-icons styleComponent"
                data-cmdvalue="bold"
                title="Bold"
              >
                format_bold
              </i>
            )}
            {this.props.permissions.italic && (
              <i
                className="material-icons styleComponent"
                data-cmdvalue="italic"
                title="Italic"
              >
                format_italic
              </i>
            )}
            {this.props.permissions.underline && (
              <i
                className="material-icons styleComponent"
                data-cmdvalue="underline"
                title="Underline"
              >
                format_underlined
              </i>
            )}
            {this.props.permissions.superscript && (
              <i
                className="fa fa-superscript styleComponent"
                data-cmdvalue="superscript"
                title="Superscript"
              ></i>
            )}
            {this.props.permissions.subscript && (
              <i
                className="fa fa-subscript styleComponent"
                data-cmdvalue="subscript"
                title="Subscript"
              ></i>
            )}
            {this.props.permissions.show_paragraph && (
              <>
                <i
                  className="material-icons showpara_element"
                  title="Show paragraph"
                >
                  format_textdirection_l_to_r
                </i>
                <i
                  className="material-icons hide hidepara_element active"
                  title="Hide paragraph"
                >
                  format_textdirection_l_to_r
                </i>
              </>
            )}
            {(this.props.permissions.bold ||
              this.props.permissions.italic ||
              this.props.permissions.underline ||
              this.props.permissions.superscript ||
              this.props.permissions.subscript ||
              this.props.permissions.show_paragraph) && (
              <span className="separator"></span>
            )}
            {this.props.permissions.add_table && (
              <Dropdown className="m-0" alignRight>
                <Dropdown.Toggle
                  id="dropdown-basic"
                  className="pt-0 cstm-dropdown-icon"
                >
                  <i
                    className="material-icons-outlined drop-itens"
                    title="Table Options"
                  >
                    table_chart
                  </i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="table-dropdown-basic">
                  <Dropdown.Item
                    className="table_insertion"
                    data-label="Display Table"
                    data-option="DisplayTable"
                  >
                    Display Table
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="table_insertion"
                    data-label="Inline Table"
                    data-option="InlineTable"
                  >
                    Inline Table
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="table_insertion"
                    data-label="Paste from Word / Excel"
                    data-option="PasteFromExcel"
                  >
                    Paste from Word / Excel
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="table_insertion"
                    data-label="Footnote"
                    data-option="Footnote"
                  >
                    New Footnote
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="table_insertion"
                    data-label=""
                    data-option="TableHead"
                  >
                    Add Table Head
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="table_insertion"
                    data-label=""
                    data-option="AddRow"
                  >
                    Add Table Row
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="table_insertion"
                    data-label=""
                    data-option="RemoveRow"
                  >
                    Remove Table Row
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="table_insertion"
                    data-label=""
                    data-option="AddColumn"
                  >
                    Add Table Column
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="table_insertion"
                    data-label=""
                    data-option="RemoveColumn"
                  >
                    Remove Table Column
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="table_insertion"
                    data-label=""
                    data-option="MergeCell"
                  >
                    Merge cells
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="table_insertion"
                    data-label=""
                    data-option="DeleteTable"
                  >
                    Delete Table
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
            {this.props.permissions.add_figure && (
              <Dropdown className="m-0" alignRight>
                <Dropdown.Toggle
                  id="dropdown-basic"
                  className="pt-0 pl-0 cstm-dropdown-icon"
                >
                  <i
                    className="material-icons-outlined drop-itens"
                    title="Image Options"
                  >
                    insert_photo
                  </i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    className="insertimages"
                    data-label="Display Image"
                    data-option="DisplayImage"
                  >
                    Display Image
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="insertimages"
                    data-label="Inline Image"
                    data-option="InlineImage"
                  >
                    Inline Image
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="insertimages"
                    data-label="Delete Image"
                    data-option="DeleteImage"
                  >
                    Delete Image
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
            {this.props.permissions.symbol && (
              <i
                className="material-icons specialchar"
                title="Add Symbol"
                onMouseDown={(e) => window.specialchar(e, 'pdf-editor')}
              >
                emoji_symbols
              </i>
            )}
            {this.props.permissions.footnote_options && (
              <Dropdown className="m-0" alignRight>
                <Dropdown.Toggle
                  id="dropdown-basic"
                  className="pt-0 cstm-dropdown-icon hide"
                >
                  <i
                    className="material-icons-outlined drop-itens"
                    title="Footnote Options"
                  >
                    note
                  </i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="table-dropdown-basic">
                  <Dropdown.Item
                    className="footnoteno_insert"
                    data-label="Add Footnote"
                    data-option="DisplayTable"
                  >
                    Add Footnote
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="footnotedelete"
                    data-label="Delete Footnote"
                    data-option="InlineTable"
                  >
                    Delete Footnote
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
            {this.props.permissions.reference && (
              <Dropdown className="m-0" alignRight>
                <Dropdown.Toggle
                  id="dropdown-basic"
                  className="pt-0 cstm-dropdown-icon"
                >
                  <i
                    className="material-icons-outlined drop-itens"
                    title="Reference"
                  >
                    link
                  </i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    className="reference_insert"
                    data-label="Add Reference"
                    data-option="AddReference"
                  >
                    Add Reference
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="reference_delete"
                    data-label="Delete Reference"
                    data-option="RemoveReference"
                  >
                    Delete Reference
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
            {(this.props.permissions.add_table ||
              this.props.permissions.add_figure ||
              this.props.permissions.symbol ||
              this.props.permissions.footnote_options ||
              this.props.permissions.reference) && (
              <span className="separator"></span>
            )}
            {this.props.permissions.style_editing &&
              this.props.ProjectId !== '244616' &&
              this.props.ProjectId !== '245695' && (
                <>
                  <Dropdown className="m-0" alignRight>
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      className="pt-0 cstm-dropdown-icon"
                    >
                      <i
                        className="material-icons-outlined drop-itens"
                        title="Style Editing"
                      >
                        style
                      </i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {styleEditList &&
                        styleEditList.map((styleData, index) => (
                          <Dropdown.Item
                            className="style-edit"
                            id="style_editing"
                            data-label={styleData}
                            data-option="stylEdit"
                            key={index}
                            onClick={() => this.styleEditingAction(styleData)}
                          >
                            {styleData}
                          </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  <span className="separator"></span>
                </>
              )}
            {(this.props.permissions.spell_check ||
              this.props.ProjectId === '5831') && (
              <>
                <Dropdown className="m-0" alignRight>
                  <Dropdown.Toggle
                    id="dropdown-basic"
                    className="pt-0 cstm-dropdown-icon"
                  >
                    <i
                      className="material-icons-outlined drop-itens"
                      title="Spell Check"
                    >
                      spellcheck
                    </i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      className="style-edit"
                      id="style_editing"
                      data-option="Spell Check"
                      onClick={() => this.spellChecker('US')}
                    >
                      US
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="style-edit"
                      id="style_editing"
                      data-option="Spell Check"
                      onClick={() => this.spellChecker('UK')}
                    >
                      UK
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <span className="separator"></span>
              </>
            )}
            {this.props.permissions.grammatical_options &&
              this.props.ProjectId !== '244616' &&
              this.props.ProjectId !== '245695' && (
                <i
                  className="material-icons"
                  title="Grammatical validation"
                  onClick={this.grammerChecker}
                >
                  translate
                </i>
              )}
            {this.props.permissions.content_validation &&
              this.props.ProjectId !== '244616' &&
              this.props.ProjectId !== '245695' && (
                <i
                  className="material-icons"
                  title="Content validation"
                  onClick={this.contentValidation}
                >
                  spellcheck
                </i>
              )}
            {this.props.permissions.consistency_validation &&
              this.props.ProjectId !== '244616' &&
              this.props.ProjectId !== '245695' && (
                <i
                  className="material-icons"
                  title="Consistency validation"
                  onClick={this.consistencyAction}
                >
                  playlist_add_check
                </i>
              )}
            {this.props.permissions.document_score &&
              this.props.ProjectId !== '244616' &&
              this.props.ProjectId !== '245695' && (
                <i
                  className="material-icons-outlined documentscore"
                  aria-hidden="true"
                  title="Document Score"
                >
                  star_border
                </i>
              )}
          </div>
        </div>

        <input type="hidden" id="tableinsert_flag" value="0" />
        <input type="hidden" id="tableinsert_id" value="0" />
        <input type="hidden" id="figureinsert_flag" value="0" />
        <input type="hidden" id="figureinsert_id" value="0" />
        <input type="hidden" id="us_uk_spellcheck" />
        <input type="hidden" id="spellcheck_innertext" />
        <input type="hidden" id="spellcheckSearch" value="0" />
        <input type="hidden" id="spellcheck_xhref_storeid" />
        <input type="hidden" id="paraenter_id" />
        <input type="hidden" className="replace_hyphen" />
        <input type="hidden" className="other_replaceword" />
        <input type="hidden" id="replaceVal" />
        <input
          type="hidden"
          id="spellcheck_value"
          className="spellcheck_value"
        />
        <input
          type="hidden"
          id="spellcheck_innerstoreid"
          className="spellcheck_innerstoreid"
        />
        <textarea id="store_mathml" className="hide"></textarea>
        <div className="grammer_issue hide">
          <div className="grammer_total">4611</div>
          <div className="grammer_spelling">6</div>
          <div className="grammer_issues">14 </div>
          <div className="grammer_sentence">16.4</div>
          <div className="punctuations">3</div>
          <div className="grammer_consistancy">70.9</div>
        </div>
        <div id="ref" className="hide"></div>
        <div id="metaData" className="hide"></div>
        <div id="ref-element-prev" className="hide"></div>
        <input type="hidden" id="edit-ref-id" />
        <div id="reference_request" className="hide"></div>
        <input type="hidden" id="deleteConfirm" />
        <div id="reference_xslt" className="hide"></div>
        <div id="reference_xsltget" className="hide"></div>
        <div id="commentModal" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <div>
                  <span
                    className="close"
                    aria-hidden="true"
                    data-dismiss="modal"
                  >
                    <i className="material-icons">close</i>
                  </span>
                  <h5 className="popuptitleHead" id="commentHead">
                    Comment
                  </h5>
                </div>
                <div className="model-comment"></div>
                <textarea
                  className="form-control"
                  rows="8"
                  data-text="Click here to add comment"
                  id="commentText"
                ></textarea>
                <span
                  className="add_comments"
                  id="commentErrorText"
                  style={{ color: '#bf3434', display: 'none' }}
                >
                  Please Enter the Comment{' '}
                </span>
                <div id="commentconverttext" style={{ display: 'none' }}></div>
              </div>
              <div className="my-2">
                <div className="button-group">
                  <button id="commentSubmit" className="btn cstm-save-btn">
                    Add Comment
                  </button>
                  <button
                    id="commentdelete"
                    className="btn cstm-delete-btn ml-2"
                  >
                    Delete Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="queryModal" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <div>
                  <span
                    className="close"
                    aria-hidden="true"
                    data-dismiss="modal"
                  >
                    <i className="material-icons">close</i>
                  </span>
                  <h5 className="popuptitleHead" id="queryHead">
                    Query
                  </h5>
                </div>
                <div className="model-query"></div>
                <textarea
                  className="form-control"
                  rows="8"
                  data-text="Click here to add query"
                  id="queryText"
                ></textarea>
                <span
                  className="add_query"
                  id="queryErrorText"
                  style={{ color: '#bf3434', display: 'none' }}
                >
                  Please Enter the Query{' '}
                </span>
                <div id="queryconverttext" style={{ display: 'none' }}></div>

                <div className="button-group">
                  <button id="querySubmit" className="btn cstm-save-btn ml-2">
                    Add Query
                  </button>
                  <button id="querydelete" className="btn cstm-delete-btn ml-2">
                    Delete Query
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="elementModal"
          className="modal fade bd-example-modal-lg"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <span className="close" data-dismiss="modal">
                  <i className="material-icons">close</i>
                </span>
                <div className="newElementsText hide">
                  <div className="warningclass">
                    <h2>Warning!</h2>
                    <span>Please place the cursor inside the editor.</span>
                  </div>
                </div>
                <div className="newElementsWarningText hide">
                  <div className="warningclass">
                    <h2>Warning!</h2>
                    <span>You have no access to add the element here!</span>
                  </div>
                </div>
                <div className="newElements">
                  <div>
                    <h5 className="popuptitleHead">New Elements</h5>
                  </div>
                  <div className="row filter-selector mt-3">
                    <label className="popuplabel ml-3 pt-2">Elements :</label>
                    <select
                      id="new-element-select-drop"
                      className="form-control new_elements hide"
                    >
                      <option value="">--Select Elements--</option>
                      <option value="Heading">Heading</option>
                      <option value="List_Sublist">List/Sublist</option>
                      <option value="Sidebar">Box</option>
                      <option value="Epigraph">Epigraph</option>
                      <option value="source">Source</option>
                      <option value="blockquote">Blockquote</option>
                      <option value="example">Example </option>
                    </select>
                    <span id="text_new_element" className="pt-2"></span>
                    <input
                      type="hidden"
                      id="new_elements"
                      value={selectedNewElement}
                    />
                  </div>
                  <div className="mt-3" id="heading_element">
                    <label className="popuplabel">Heading :</label>
                    <label
                      className="pure-material-checkbox mr-1"
                      id="elements_H1"
                    >
                      <input
                        type="checkbox"
                        value="H1"
                        className="selectattimeElem"
                      />
                      <span>H1</span>
                    </label>
                    <label
                      className="pure-material-checkbox mr-1"
                      id="elements_H2"
                    >
                      <input
                        type="checkbox"
                        value="H2"
                        className="selectattimeElem"
                      />
                      <span>H2</span>
                    </label>
                    <label
                      className="pure-material-checkbox mr-1"
                      id="elements_H3"
                    >
                      <input
                        type="checkbox"
                        value="H3"
                        className="selectattimeElem"
                      />
                      <span>H3</span>
                    </label>
                    <label
                      className="pure-material-checkbox mr-1"
                      id="elements_H4"
                    >
                      <input
                        type="checkbox"
                        value="H4"
                        className="selectattimeElem"
                      />
                      <span>H4</span>
                    </label>
                    <label
                      className="pure-material-checkbox mr-1"
                      id="elements_H5"
                    >
                      <input
                        type="checkbox"
                        value="H5"
                        className="selectattimeElem"
                      />
                      <span>H5</span>
                    </label>
                    <label className="pure-material-checkbox" id="elements_H6">
                      <input
                        type="checkbox"
                        value="H6"
                        className="selectattimeElem"
                      />
                      <span>H6</span>
                    </label>
                  </div>
                  <div id="list_elements" className="mt-3">
                    <label className="popuplabel">List :</label>
                    <label className="pure-material-checkbox mr-4">
                      <input
                        type="checkbox"
                        value="bulletlist"
                        className="selectattimeList"
                      />
                      <span>
                        <i className="fa fa-list-ul pt-1"></i>
                      </span>
                    </label>
                    <label className="pure-material-checkbox mr-4">
                      <input
                        type="checkbox"
                        value="numberlist"
                        className="selectattimeList"
                      />
                      <span>
                        <i className="fa fa-list-ol pt-1"></i>
                      </span>
                    </label>
                    <label className="pure-material-checkbox mr-4">
                      <input
                        type="checkbox"
                        value="simplelist"
                        className="selectattimeList"
                      />
                      <span>
                        <i className="fa fa-bars pt-1"></i>
                      </span>
                    </label>
                    <div>
                      <label className="popuplabel">Sub List :</label>
                      <label className="pure-material-checkbox ">
                        <input
                          type="checkbox"
                          value="sublist"
                          className="sublistelement"
                        />
                        <span></span>
                      </label>
                    </div>
                  </div>
                  <span
                    className="pt-2 new-element-error hide"
                    style={{ color: '#bf3434' }}
                  >
                    Please Select a checkbox{' '}
                  </span>
                  <div className="mt-2">
                    <div className="button-group">
                      <button
                        className="btn cstm-save-btn cursor-pointer"
                        id="new_elementsubmit"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="changeelementModal" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <span className="close" aria-hidden="true" data-dismiss="modal">
                  <i className="material-icons">close</i>
                </span>
                <div className="changeElementsText hide">
                  <div>
                    <h2>Warning!</h2>
                    <span>Please place the cursor inside the editor.</span>
                  </div>
                </div>
                <div className="changeElementsWarningText hide">
                  <div>
                    <h2>Warning!</h2>
                    <span>You have no access to change the element here!</span>
                  </div>
                </div>
                <div className="changeElements">
                  <div>
                    <h5 className="popuptitleHead">Change Elements</h5>
                  </div>
                  <div
                    className="row filter-selector mt-3"
                    id="chenage_element_list"
                  >
                    <label className="popuplabel ml-3 pt-2">Elements :</label>
                    <Select
                      id="chg-element-select-new"
                      className="chg-select"
                      isClearable
                      options={changeElement}
                      onChange={this.handleChangeElement}
                      value={selectChangeElement}
                    />
                    <Select
                      id="chg-element-select-new-para"
                      className="chg-select hide"
                      isClearable
                      options={changeElementPara}
                      onChange={this.handleChangeElement}
                      value={selectChangeElement}
                    />
                    <input
                      type="hidden"
                      id="chg-element-select"
                      value={selectedChangeElement}
                    />
                  </div>
                  <div id="Change_list_elements" className="Chg-list mt-3 hide">
                    <label className="popuplabel">List :</label>
                    <label className="pure-material-checkbox mr-4">
                      <input
                        type="checkbox"
                        value="bulletlist"
                        className="selectattimeListChange"
                      />
                      <span>
                        <i className="fa fa-list-ul" aria-hidden="true"></i>
                      </span>
                    </label>
                    <label className="pure-material-checkbox mr-4">
                      <input
                        type="checkbox"
                        value="numberlist"
                        className="selectattimeListChange"
                      />
                      <span>
                        <i className="fa fa-list-ol" aria-hidden="true"></i>
                      </span>
                    </label>
                    <label className="pure-material-checkbox mr-4">
                      <input
                        type="checkbox"
                        value="simplelist"
                        className="selectattimeListChange"
                      />
                      <span>
                        <i className="fa fa-bars" aria-hidden="true"></i>
                      </span>
                    </label>
                    <div className="Chg-sublist">
                      <label className="popuplabel">Sub List :</label>
                      <label className="pure-material-checkbox ">
                        <input
                          type="checkbox"
                          value="sublist"
                          className="sublistelementChange"
                        />
                        <span></span>
                      </label>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="button-group">
                      <button
                        className="btn cstm-save-btn cursor-pointer mt-4"
                        id="chg-element-submit"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="queryListModal" className="modal fade" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-body">
                <span className="close" aria-hidden="true" data-dismiss="modal">
                  <i className="material-icons">close</i>
                </span>
                <div className="QueryList"></div>
                <div id="author_comment" className="hide">
                  <h2 className="author_popup_heading">
                    The following are comments/queries on this paper that need
                    your attention.
                  </h2>
                  <ul id="author_table"></ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="addroleModal" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <span className="close" aria-hidden="true" data-dismiss="modal">
                  <i className="material-icons">close</i>
                </span>
                <div className="addroleElementsText hide">
                  <div>
                    <h2>Warning!</h2>
                    <span>Please place the cursor inside para/heading!</span>
                  </div>
                </div>
                <div className="addroleElements">
                  <div>
                    <h5 className="popuptitleHead">Add Attribute</h5>
                  </div>
                  <div className="row mt-3">
                    <label className="ml-3 pt-2 popuplabel">Attribute :</label>
                    <Select
                      id="role-title-select"
                      className="chg-select hide"
                      isClearable
                      options={TitleRole}
                      onChange={this.handleTitleRole}
                      value={this.state.selectedTitleRole}
                    />
                    <Select
                      id="role-select"
                      className="chg-select"
                      isClearable
                      options={RoleOption}
                      onChange={this.handleRole}
                      value={this.state.selectRole}
                    />
                    <input
                      type="hidden"
                      id="add_roleattribute"
                      value={this.state.selectedRole}
                    />
                    <select className="add_roleattribute hide">
                      <option value="">--Select Attribute--</option>
                      <option value="symbol_para">Symbol para</option>
                      <option value="bib_text">Bib text</option>
                      <option value="noindent">No indent</option>
                      <option value="bib_para">Bib para</option>
                      <option value="source">Source</option>
                      <option value="pararight">Para right</option>
                      <option value="pararightabove">Para right above</option>
                      <option value="paraleftabove">Para left above</option>
                      <option value="paracenterabove">Para center above</option>
                      <option value="paracenter">Para center</option>
                      <option value="inline_caption">Inline caption</option>
                      <option value="ExtractAff">Extract Aff</option>
                      <option value="ExtractAuthor">Extract Author</option>
                      <option value="ExtractText">Extract Text</option>
                      <option value="ExtractOpen">Extract Open</option>
                    </select>
                  </div>
                  <div className="mt-3">
                    <div className="button-group">
                      <button
                        className="btn cstm-save-btn mt-4"
                        id="Role_addattr"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="tableModal" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <span
                  className="close closetbl"
                  aria-hidden="true"
                  data-dismiss="modal"
                >
                  <i className="material-icons">close</i>
                </span>
                <div className="tableElementsText" id="tableElementsText"></div>
                <div className="tableElements" id="tableElements">
                  <div>
                    <h5 className="popuptitleHead" id="tableHeaderText">
                      Insert Table
                    </h5>
                  </div>
                  <div className="tablelist hide">
                    <div className="table_option">
                      <span>
                        <input type="checkbox" className="inline_table" />
                        <label> Inline Table </label>
                      </span>
                      <span>
                        <input type="checkbox" className="paste_table" />
                        <label> Paste from Word / Excel</label>
                      </span>
                    </div>
                  </div>
                  <div className="table_value" id="inlineTable">
                    <div className="row ml-1 mb-2" id="inlineCheckbox">
                      <label className="pure-material-checkbox mr-1">
                        <input type="checkbox" className="inlinePaste" />
                        <span>Paste from Word / Excel</span>
                      </label>
                    </div>
                    <div className="table_value hide" id="inlinePaste">
                      <div className="form-group table_container">
                        <label className="popuplabel">Paste Here: </label>
                        <div
                          contentEditable="true"
                          className="form-control table_content"
                        ></div>
                      </div>
                    </div>
                    <div id="inlineNormal">
                      <div className="form-group">
                        <label className="popuplabel">No of Columns:</label>
                        <input
                          name="tablecolumn"
                          type="number"
                          min="0"
                          max="99"
                          maxLength="1"
                          className="form-control number_of_columns numbervalidate"
                        />
                      </div>
                      <div className="form-group">
                        <label className="popuplabel">No of Rows:</label>
                        <input
                          name="tablerow"
                          type="number"
                          min="0"
                          max="99"
                          maxLength="1"
                          className="form-control number_of_rows numbervalidate"
                        />
                      </div>
                      <div className="form-group">
                        <label className="popuplabel">No of Thead:</label>
                        <input
                          min="0"
                          type="number"
                          min="0"
                          max="99"
                          maxLength="1"
                          className="form-control number_of_thead numbervalidate"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="table_value row" id="paste_table">
                    <div className="form-group mx-3 ">
                      <label className="popuplabel">Table No:</label>
                      <input
                        type="text"
                        className="form-control table_caption"
                        readOnly
                      />
                    </div>
                    <div className="form-group mx-3  table_container">
                      <label className="popuplabel">Paste Here: </label>
                      <div
                        contentEditable="true"
                        className="form-control table_content"
                      ></div>
                    </div>

                    <div className="form-group mx-3  inline_tblhd">
                      <label className="popuplabel">Table Caption: </label>
                      <textarea
                        type="text"
                        className="form-control table_title"
                      ></textarea>
                    </div>
                    <div className="form-group mx-3  inline_tblhd">
                      <label className="popuplabel">Table Footnote: </label>
                      <textarea
                        type="text"
                        className="form-control table_footnote"
                      ></textarea>
                    </div>
                    <div className="form-group mx-3  inline_tblhd">
                      <label className="popuplabel">Table Source: </label>
                      <textarea
                        type="text"
                        className="form-control table_source"
                      ></textarea>
                    </div>
                  </div>
                  <div className="tablefootnote hide">
                    <div className="form-group inline_tblhd">
                      <label className="popuplabel">Table Footnote: </label>
                      <textarea
                        type="text"
                        className="form-control table_footnoteNew"
                      ></textarea>
                    </div>
                  </div>
                  <span
                    className="table_error hide"
                    style={{ color: '#bf3434' }}
                  ></span>
                  <div className="button-group">
                    <button id="table_submission" className="btn cstm-save-btn">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="addLink" className="modal fade linkModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <span
                  className="close closelink"
                  aria-hidden="true"
                  data-dismiss="modal"
                >
                  <i className="material-icons">close</i>
                </span>
                <div>
                  <h5 className="popuptitleHead pull-left">Add Link</h5>
                  <div className="row form-group">
                    <div className="col-9 pl-0">
                      <input
                        type="text"
                        className="search_link mr-2 form-control col-8"
                        placeholder="Search ...."
                      />
                    </div>
                    <div className="col-3 pl-0">
                      <span className="new-ref-text col-4 hide">
                        New Reference +
                      </span>
                    </div>
                  </div>
                  <div className="hide" id="new-ref-div">
                    <div className="row form-group">
                      <div className="col-10 pl-0">
                        <div
                          id="reference_div_new"
                          contentEditable="true"
                        ></div>
                        <span
                          id="add_reference_error"
                          className="hide"
                          style={{ color: '#bf3434' }}
                        >
                          Please Enter the Reference
                        </span>
                      </div>
                      <div className="col-2 ref-right-ele">
                        <a href="#" className="save-icon" id="ref_submission">
                          <i
                            className="material-icons-outlined"
                            data-toggle="tooltip"
                            data-placement="top"
                            title=""
                            data-original-title="Update"
                          >
                            save
                          </i>
                        </a>
                        <a href="#" className="cancel-icon" id="ref_cancel">
                          <i
                            className="material-icons-outlined"
                            data-toggle="tooltip"
                            data-placement="top"
                            title=""
                            data-original-title="Cancel"
                          >
                            close
                          </i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="listOfLinks pt-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="deleteTable" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <span className="close" aria-hidden="true" data-dismiss="modal">
                  <i className="material-icons">close</i>
                </span>
                <div>
                  <h5 className="popuptitleHead pull-left">Delete Table</h5>
                  <div className="tablelist_del" id="tablelist_del"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="tableDelAlert" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <span className="close" data-dismiss="modal">
                  <i className="material-icons">close</i>
                </span>
                <div>
                  <center className="warningclass">
                    <h2>Warning!</h2>
                    <span>
                      This column having Columnspan/Rowspan, so we could not
                      delete it.
                    </span>
                  </center>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="insertFootnote" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <span className="close" data-dismiss="modal">
                  <i className="material-icons">close</i>
                </span>
                <div>
                  <center className="warningclass">
                    <h2>Warning!</h2>
                    <span id="footnoteWarningtext">
                      Please place the cursor inside the editor.
                    </span>
                  </center>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="offlinemode"
          className="modal fade"
          tabIndex="-1"
          data-backdrop="static"
          data-keyboard="false"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <div>
                  <center className="warningclass">
                    <h2>Warning!</h2>
                    <span id="offlinemodewarningtext">
                      ! Please check the internet connection.
                    </span>
                  </center>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="fmSecondModal" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <div id="orcidEle">
                  <h5 className="popuptitleHead pull-left">ORCID Number</h5>
                  <div className="form-group">
                    <label className="popuplabel">ORCID</label>
                    <input type="text" id="orcID" className="form-control" />
                    <span className="orcidError fmErrorClass hide">
                      ORCID cannot be blank.
                    </span>
                  </div>
                  <div className="example-orcid">(Ex: 1234-5637-1234-1234)</div>
                  <div className="my-2">
                    <button
                      className="btn cstm-primary-btn float-right"
                      id="orchidSave"
                      onClick={() => window.orchidSave()}
                    >
                      Save
                    </button>
                    <button
                      className="btn cstm-primary-btn float-right mr-2"
                      id="orchidCancel"
                      onClick={() => window.hideSecModal('fmSecondModal')}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <div id="editorErrorEle">
                  <span className="close" data-dismiss="modal">
                    <i className="material-icons">close</i>
                  </span>
                  <center className="warningclass">
                    <h2>Warning!</h2>
                    <span id="fmEditorError">
                      Please check the internet connection.
                    </span>
                  </center>
                </div>
                <div id="affDeleteConfm">
                  <AffDeleteConfirm affDeleterow={this.state.affDeleterow} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="figureModal" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <span
                  className="close closefig"
                  aria-hidden="true"
                  data-dismiss="modal"
                >
                  <i className="material-icons">close</i>
                </span>
                <div
                  className="insertFigureText warningclass hide"
                  id="insertFigureText"
                ></div>
                <div className="insertFigure" id="insertFigure">
                  <div>
                    <h5 className="popuptitleHead pull-left" id="figureheader">
                      Insert Figure
                    </h5>
                  </div>
                  <div className="hide">
                    <span>
                      <input
                        type="checkbox"
                        className="inline_figure"
                        id="inline-fig"
                      />
                      <label> Inline Figure </label>
                    </span>
                  </div>
                  <div className="row form-group display_figure ml-1">
                    <label className="popuplabel">Figure Label:</label>
                    <input
                      type="text"
                      className="form-control inline_figure"
                      id="figure_label"
                    />
                  </div>
                  <div className="row form-group display_figure ml-1">
                    <label className="popuplabel">Figure Caption:</label>
                    <textarea
                      className="form-control inline_figure"
                      id="figure_caption"
                    ></textarea>
                  </div>
                  <div className="row form-group ml-1">
                    <label className="popuplabel">Figure Insert:</label>
                    <input
                      type="file"
                      className="form-control inline_figure"
                      id="fileinsert"
                      accept="image/x-png,image/gif,image/jpeg,image/jpg"
                    />
                    <span className="inline_error" id="inline_fig_error">
                      Please upload figure
                    </span>
                  </div>
                  <div className="button-group">
                    <button
                      id="figure_submission"
                      className="btn cstm-save-btn"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="deleteFigure" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <span className="close" aria-hidden="true" data-dismiss="modal">
                  <i className="material-icons">close</i>
                </span>
                <div>
                  <h5 className="popuptitleHead pull-left">Delete Figure</h5>
                  <div className="figurelist_del" id="figurelist_del"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="referenceModal" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <span className="close" aria-hidden="true" data-dismiss="modal">
                  <i className="material-icons">close</i>
                </span>
                <div>
                  <div id="referenceContent">
                    <h5 className="modal-title" id="new_book_modal">
                      Insert Reference
                    </h5>
                    <div className="row form-group ">
                      <div id="reference_div" contentEditable="true"></div>
                      <span
                        id="add_reference"
                        className="hide"
                        style={{ color: '#bf3434' }}
                      >
                        Please Enter the Reference
                      </span>
                    </div>
                    <div className="row ml-1" id="refTypeSection">
                      <label
                        className="pure-material-checkbox mr-1"
                        id="refType1"
                      >
                        <input
                          type="checkbox"
                          value="Type1"
                          className="refType"
                        />
                        <span>Numbered References</span>
                      </label>
                    </div>
                    <span
                      id="reference_type"
                      className="hide"
                      style={{ color: '#bf3434' }}
                    >
                      Please Select Type
                    </span>
                    <button
                      id="reference_submission"
                      className="btn cstm-save-btn"
                    >
                      Submit
                    </button>
                  </div>
                  <div className="warningclass hide" id="referenceText">
                    <h2>Warning!</h2>
                    <span>Please place the cursor inside para/heading!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="refEditModal" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <span className="close" aria-hidden="true" data-dismiss="modal">
                  <i className="material-icons">close</i>
                </span>
                <div>
                  <h5 className="modal-title" id="new_book_modal">
                    Reference Edit
                  </h5>
                  <div className="row form-group pt-2">
                    <div className="col col-5 pl-0">
                      <div className="col-5">
                        <select
                          className="form-control ref-dropdown"
                          id="publication_select"
                        >
                          <option value="">Type</option>
                          <option value="book">Books</option>
                          <option value="journal">Journals</option>
                          <option value="proceedings">Proceedings</option>
                          <option value="report">Report</option>
                          <option value="series">Series</option>
                          <option value="newspaper">Newspaper</option>
                          <option value="web">Web</option>
                        </select>
                      </div>
                    </div>
                    <div className="col col-7 pl-0 ref-header-options">
                      <div className="row-editor editor-tools ref-editor-tools">
                        <i
                          className="material-icons ref-editor"
                          data-cmdvalue="bold"
                          title="Bold"
                        >
                          format_bold
                        </i>
                        <i
                          className="material-icons ref-editor"
                          data-cmdvalue="italic"
                          title="Italic"
                        >
                          format_italic
                        </i>
                        <i
                          className="fa fa-superscript ref-editor"
                          data-cmdvalue="superscript"
                          title="Superscript"
                          aria-hidden="true"
                        ></i>
                        <i
                          className="fa fa-subscript ref-editor"
                          data-cmdvalue="subscript"
                          title="Subscript"
                          aria-hidden="true"
                        ></i>
                        <i
                          className="material-icons specialchar"
                          title="Add Symbol"
                          onMouseDown={(e) =>
                            window.specialchar(e, 'form-group')
                          }
                        >
                          emoji_symbols
                        </i>
                      </div>
                      <div className="pr-2">
                        <select
                          className="form-control ref-dropdown"
                          id="reference_changeElement"
                        >
                          <option value="">Change Element</option>
                          <option value="Delimiter">Delimiter</option>
                          <option value="Title">Title</option>
                          <option value="Address">Address</option>
                          <option value="Pubdate">Pubdate</option>
                          <option value="Publisher">Publisher</option>
                          <option value="Volumenum">Volumenum</option>
                          <option value="Issuenum">Issuenum</option>
                          <option value="Pagenums">Pagenums</option>
                          <option value="Articletitle">Article Title</option>
                          <option value="Chaptertitle">Chapter Title</option>
                          <option value="Booktitle">Book Title</option>
                          <option value="Journaltitle">Journal Title</option>
                        </select>
                      </div>
                      <div className="pr-0">
                        <select
                          className="form-control ref-dropdown"
                          id="reference_element"
                        >
                          <option value="">Add Elements</option>
                          <option value="Delimiter">Delimiter</option>
                          <option value="Title">Title</option>
                          <option value="Address">Address</option>
                          <option value="Pubdate">Pubdate</option>
                          <option value="Publisher">Publisher</option>
                          <option value="Volumenum">Volumenum</option>
                          <option value="Issuenum">Issuenum</option>
                          <option value="Pagenums">Pagenums</option>
                          <option value="Articletitle">Article Title</option>
                          <option value="Chaptertitle">Chapter Title</option>
                          <option value="Booktitle">Book Title</option>
                          <option value="Journaltitle">Journal Title</option>
                        </select>
                      </div>
                      <div className="inline-arrow arrow-button-group">
                        <button>
                          <i
                            className="material-icons-outlined reference_leftmovement"
                            title="Move Previous"
                          >
                            arrow_back
                          </i>
                        </button>
                        <button>
                          <i
                            className="material-icons-outlined reference_rightmovement"
                            title="Move Next"
                          >
                            arrow_forward
                          </i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div id="publication-type"></div>
                  <div id="form"></div>
                  <div className="ml-1">
                    <div id="reference_edit" contentEditable="true"></div>
                  </div>
                  <div className="ml-1">
                    <div>
                      <h5>Current Reference</h5>
                    </div>
                    <div
                      className=""
                      id="reference_editpreview"
                      contentEditable="true"
                    ></div>
                  </div>
                  <div className="ml-1 hide" id="refEmptyError">
                    <span style={{ color: '#bf3434' }}>
                      Reference panel should not be empty
                    </span>
                  </div>
                  <div className="button-group">
                    <button
                      id="reference_editsub"
                      className="btn cstm-save-btn"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="deleteFootnote" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header pb-0">
                <h5 className="modal-title" id="new_book_modal">
                  Delete Footnote
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="material-icons">close</i>
                </button>
              </div>
              <div className="modal-body">
                <div>
                  <div className="footnotelist_del"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="mathEditor" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div id="editorContent">
                <div className="modal-header">
                  <h5 className="modal-title" id="new_book_modal">
                    Math Editor
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <i className="material-icons">close</i>
                  </button>
                </div>
                <div className="modal-body">
                  <div>
                    <div id="editorContainer"></div>
                    <div className="mt-2 button-group">
                      <button id="mathml_image" className="btn cstm-save-btn">
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div id="editorContentError" className="hide">
                <div className="modal-body">
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <i className="material-icons">close</i>
                  </button>
                  <div>
                    <h2>Warning!</h2>
                    <span>
                      Move the equations to the VXE page and click the equation
                      to edit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="headingModal" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <span className="close" aria-hidden="true" data-dismiss="modal">
                  <i className="material-icons">close</i>
                </span>
                <div>
                  <div className="warningclass">
                    <h2>Warning!</h2>
                    <span id="heading-warning">
                      Please select the content for add heading!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="specialChar" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="new_book_modal">
                  Special Characters
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="material-icons">close</i>
                </button>
              </div>
              <div className="modal-body pt-0 pr-0">
                <div className="tab">
                  {/* Element builder here */}
                  {/* <ElementBuilder keyLocalStorage={"languages"} builderVals={this.state.builderValues.languageValues} />
                   */}
                  <button
                    className="tablinks active"
                    data-linkid="Currencies"
                    id="defaultOpen"
                  >
                    Currencies
                  </button>
                  <button className="tablinks" data-linkid="Czech">
                    Czech
                  </button>
                  <button className="tablinks" data-linkid="Danish">
                    Danish
                  </button>
                  <button className="tablinks" data-linkid="Dutch">
                    Dutch
                  </button>
                  <button className="tablinks" data-linkid="Finnish">
                    Finnish
                  </button>
                  <button className="tablinks" data-linkid="French">
                    French
                  </button>
                  <button className="tablinks" data-linkid="German">
                    German
                  </button>
                  <button className="tablinks" data-linkid="Greek">
                    Greek
                  </button>
                  <button className="tablinks" data-linkid="Hungarian">
                    Hungarian
                  </button>
                  <button className="tablinks" data-linkid="Icelandic">
                    Icelandic
                  </button>
                  <button className="tablinks" data-linkid="IPAEnglish">
                    IPA English
                  </button>
                  <button className="tablinks" data-linkid="IPAFull">
                    IPA Full
                  </button>
                  <button className="tablinks" data-linkid="Italian">
                    Italian
                  </button>
                  <button className="tablinks" data-linkid="MathSci">
                    Math / Sci.
                  </button>
                  <button className="tablinks" data-linkid="Norwegian">
                    Norwegian
                  </button>
                  <button className="tablinks" data-linkid="Pinyin">
                    Pinyin
                  </button>
                  <button className="tablinks" data-linkid="Portuguese">
                    Portuguese
                  </button>
                  <button className="tablinks" data-linkid="Romanian">
                    Romanian
                  </button>
                  <button className="tablinks" data-linkid="Russian">
                    Russian
                  </button>
                  <button className="tablinks" data-linkid="Spanish">
                    Spanish
                  </button>
                  <button className="tablinks" data-linkid="Swedish">
                    Swedish
                  </button>
                  <button className="tablinks" data-linkid="Symbols">
                    Symbols
                  </button>
                  <button className="tablinks" data-linkid="Turkish">
                    Turkish
                  </button>
                  <button className="tablinks" data-linkid="Vietnamese">
                    Vietnamese
                  </button>
                  <button className="tablinks" data-linkid="Welsh">
                    Welsh
                  </button>
                  <button
                    className="tablinks"
                    data-linkid="ChineseJapaneseKorean"
                  >
                    Chinese / Japanese / Korean
                  </button>
                  <button className="tablinks" data-linkid="Arabic">
                    Arabic
                  </button>
                  <button className="tablinks" data-linkid="Sanskrit">
                    Sanskrit
                  </button>
                  <button
                    className="tablinks"
                    data-linkid="MathematicalOperators"
                  >
                    Mathematical Operators
                  </button>
                  <button className="tablinks" data-linkid="Hebrew">
                    Hebrew
                  </button>
                  <button className="tablinks" data-linkid="Others">
                    Others
                  </button>
                </div>
                <div id="Currencies" className="tabcontent">
                  <h3>Currencies</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="$" className="sym_cl">
                            $
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="€" className="sym_cl">
                            €
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¢" className="sym_cl">
                            ¢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="£" className="sym_cl">
                            £
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¥" className="sym_cl">
                            ¥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="₩" className="sym_cl">
                            ₩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="₪" className="sym_cl">
                            ₪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="฿" className="sym_cl">
                            ฿
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="¥" className="sym_cl">
                            ¥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="₫" className="sym_cl">
                            ₫
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Czech" className="tabcontent hide">
                  <h3>Czech</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="ú" className="sym_cl">
                            ú
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="u" className="sym_cl">
                            u
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ý" className="sym_cl">
                            ý
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ž" className="sym_cl">
                            ž
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="’" className="sym_cl">
                            ’
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="„" className="sym_cl">
                            „
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="“" className="sym_cl">
                            “
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="“" className="sym_cl">
                            “
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="”" className="sym_cl">
                            ”
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="–" className="sym_cl">
                            –
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="—" className="sym_cl">
                            —
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="á" className="sym_cl">
                            á
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="é" className="sym_cl">
                            é
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="í" className="sym_cl">
                            í
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ó" className="sym_cl">
                            ó
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="š" className="sym_cl">
                            š
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Danish" className="tabcontent hide">
                  <h3>Danish</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="å" className="sym_cl">
                            å
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="æ" className="sym_cl">
                            æ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="é" className="sym_cl">
                            é
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ø" className="sym_cl">
                            ø
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Dutch" className="tabcontent hide">
                  <h3>Dutch</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="é" className="sym_cl">
                            é
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ë" className="sym_cl">
                            ë
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ï" className="sym_cl">
                            ï
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ó" className="sym_cl">
                            ó
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ö" className="sym_cl">
                            ö
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ü" className="sym_cl">
                            ü
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="€" className="sym_cl">
                            €
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="’" className="sym_cl">
                            ’
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Finnish" className="tabcontent hide">
                  <h3>Finnish</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="ä" className="sym_cl">
                            ä
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="å" className="sym_cl">
                            å
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ö" className="sym_cl">
                            ö
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="€" className="sym_cl">
                            €
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="French" className="tabcontent hide">
                  <h3>French</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="ù" className="sym_cl">
                            ù
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="û" className="sym_cl">
                            û
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ü" className="sym_cl">
                            ü
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ÿ" className="sym_cl">
                            ÿ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="à" className="sym_cl">
                            à
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="â" className="sym_cl">
                            â
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="€" className="sym_cl">
                            €
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="«" className="sym_cl">
                            «
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="»" className="sym_cl">
                            »
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="æ" className="sym_cl">
                            æ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ç" className="sym_cl">
                            ç
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="é" className="sym_cl">
                            é
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="è" className="sym_cl">
                            è
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ê" className="sym_cl">
                            ê
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ë" className="sym_cl">
                            ë
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ï" className="sym_cl">
                            ï
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="î" className="sym_cl">
                            î
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ô" className="sym_cl">
                            ô
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="œ" className="sym_cl">
                            œ
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="German" className="tabcontent hide">
                  <h3>German</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="ä" className="sym_cl">
                            ä
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ö" className="sym_cl">
                            ö
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ü" className="sym_cl">
                            ü
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ß" className="sym_cl">
                            ß
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="€" className="sym_cl">
                            €
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Greek" className="tabcontent hide">
                  <h3>Greek</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="ά" className="sym_cl">
                            ά
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="έ" className="sym_cl">
                            έ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ή" className="sym_cl">
                            ή
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ί" className="sym_cl">
                            ί
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ϊ" className="sym_cl">
                            ϊ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ΐ" className="sym_cl">
                            ΐ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ό" className="sym_cl">
                            ό
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ύ" className="sym_cl">
                            ύ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ϋ" className="sym_cl">
                            ϋ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ΰ" className="sym_cl">
                            ΰ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ώ" className="sym_cl">
                            ώ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="€" className="sym_cl">
                            €
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="θ" className="sym_cl">
                            θ
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ω" className="sym_cl">
                            ω
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="e" className="sym_cl">
                            e
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ρ" className="sym_cl">
                            ρ
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="ψ" className="sym_cl">
                            ψ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="υ" className="sym_cl">
                            υ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ι" className="sym_cl">
                            ι
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ο" className="sym_cl">
                            ο
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ξ" className="sym_cl">
                            ξ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ω" className="sym_cl">
                            ω
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ß" className="sym_cl">
                            ß
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="µ" className="sym_cl">
                            µ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="f" className="sym_cl">
                            f
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="γ" className="sym_cl">
                            γ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="η" className="sym_cl">
                            η
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ς" className="sym_cl">
                            ς
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="κ" className="sym_cl">
                            κ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="λ" className="sym_cl">
                            λ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ζ" className="sym_cl">
                            ζ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="χ" className="sym_cl">
                            χ
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Hungarian" className="tabcontent hide">
                  <h3>Hungarian</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="á" className="sym_cl">
                            á
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="é" className="sym_cl">
                            é
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="í" className="sym_cl">
                            í
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ö" className="sym_cl">
                            ö
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ó" className="sym_cl">
                            ó
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ü" className="sym_cl">
                            ü
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ú" className="sym_cl">
                            ú
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Icelandic" className="tabcontent hide">
                  <h3>Icelandic</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="á" className="sym_cl">
                            á
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="æ" className="sym_cl">
                            æ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ð" className="sym_cl">
                            ð
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="é" className="sym_cl">
                            é
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="í" className="sym_cl">
                            í
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ó" className="sym_cl">
                            ó
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ö" className="sym_cl">
                            ö
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="þ" className="sym_cl">
                            þ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ú" className="sym_cl">
                            ú
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ý" className="sym_cl">
                            ý
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="IPAEnglish" className="tabcontent hide">
                  <h3>IPA English</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="ʃ" className="sym_cl">
                            ʃ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="θ" className="sym_cl">
                            θ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="t" className="sym_cl">
                            t
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʊ" className="sym_cl">
                            ʊ
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ʊ" className="sym_cl">
                            ʊ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¨" className="sym_cl">
                            ¨
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʌ" className="sym_cl">
                            ʌ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʒ" className="sym_cl">
                            ʒ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ʔ" className="sym_cl">
                            ʔ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᵊ" className="sym_cl">
                            ᵊ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʳ" className="sym_cl">
                            ʳ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="→" className="sym_cl">
                            →
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ᵗ" className="sym_cl">
                            ᵗ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="’" className="sym_cl">
                            ’
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="“" className="sym_cl">
                            “
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="”" className="sym_cl">
                            ”
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="–" className="sym_cl">
                            –
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="—" className="sym_cl">
                            —
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="'" className="sym_cl">
                            '
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ˌ" className="sym_cl">
                            ˌ
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ː" className="sym_cl">
                            ː
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="æ" className="sym_cl">
                            æ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɑ" className="sym_cl">
                            ɑ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ð" className="sym_cl">
                            ð
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ə" className="sym_cl">
                            ə
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɚ" className="sym_cl">
                            ɚ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɛ" className="sym_cl">
                            ɛ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɜ" className="sym_cl">
                            ɜ
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ɝ" className="sym_cl">
                            ɝ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɪ" className="sym_cl">
                            ɪ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɪ" className="sym_cl">
                            ɪ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɫ" className="sym_cl">
                            ɫ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ŋ" className="sym_cl">
                            ŋ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɔ" className="sym_cl">
                            ɔ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɒ" className="sym_cl">
                            ɒ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɹ" className="sym_cl">
                            ɹ
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ɾ" className="sym_cl">
                            ɾ
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="IPAFull" className="tabcontent hide">
                  <h3>IPA Full</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="ɑ" className="sym_cl">
                            ɑ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="æ" className="sym_cl">
                            æ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɐ" className="sym_cl">
                            ɐ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɑ" className="sym_cl">
                            ɑ
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ß" className="sym_cl">
                            ß
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɓ" className="sym_cl">
                            ɓ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʙ" className="sym_cl">
                            ʙ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɕ" className="sym_cl">
                            ɕ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ç" className="sym_cl">
                            ç
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ð" className="sym_cl">
                            ð
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="d" className="sym_cl">
                            d
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʒ" className="sym_cl">
                            ʒ
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ɖ" className="sym_cl">
                            ɖ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɗ" className="sym_cl">
                            ɗ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ə" className="sym_cl">
                            ə
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɚ" className="sym_cl">
                            ɚ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ɵ" className="sym_cl">
                            ɵ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɘ" className="sym_cl">
                            ɘ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɛ" className="sym_cl">
                            ɛ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɜ" className="sym_cl">
                            ɜ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɝ" className="sym_cl">
                            ɝ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɛ" className="sym_cl">
                            ɛ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɞ" className="sym_cl">
                            ɞ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɠ" className="sym_cl">
                            ɠ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ɢ" className="sym_cl">
                            ɢ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʛ" className="sym_cl">
                            ʛ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɥ" className="sym_cl">
                            ɥ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɦ" className="sym_cl">
                            ɦ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ħ" className="sym_cl">
                            ħ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɧ" className="sym_cl">
                            ɧ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʜ" className="sym_cl">
                            ʜ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɪ" className="sym_cl">
                            ɪ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ɪ" className="sym_cl">
                            ɪ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɨ" className="sym_cl">
                            ɨ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʝ" className="sym_cl">
                            ʝ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɟ" className="sym_cl">
                            ɟ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʄ" className="sym_cl">
                            ʄ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɫ" className="sym_cl">
                            ɫ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɬ" className="sym_cl">
                            ɬ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʟ" className="sym_cl">
                            ʟ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ɮ" className="sym_cl">
                            ɮ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɭ" className="sym_cl">
                            ɭ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɱ" className="sym_cl">
                            ɱ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ŋ" className="sym_cl">
                            ŋ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɲ" className="sym_cl">
                            ɲ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɴ" className="sym_cl">
                            ɴ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɳ" className="sym_cl">
                            ɳ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɔ" className="sym_cl">
                            ɔ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="œ" className="sym_cl">
                            œ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ø" className="sym_cl">
                            ø
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɒ" className="sym_cl">
                            ɒ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɔ" className="sym_cl">
                            ɔ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɶ" className="sym_cl">
                            ɶ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɸ" className="sym_cl">
                            ɸ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɾ" className="sym_cl">
                            ɾ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʁ" className="sym_cl">
                            ʁ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ɹ" className="sym_cl">
                            ɹ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɻ" className="sym_cl">
                            ɻ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʀ" className="sym_cl">
                            ʀ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɽ" className="sym_cl">
                            ɽ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɺ" className="sym_cl">
                            ɺ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʃ" className="sym_cl">
                            ʃ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʂ" className="sym_cl">
                            ʂ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="θ" className="sym_cl">
                            θ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="t" className="sym_cl">
                            t
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʃ" className="sym_cl">
                            ʃ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="t" className="sym_cl">
                            t
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="s" className="sym_cl">
                            s
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʈ" className="sym_cl">
                            ʈ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʊ" className="sym_cl">
                            ʊ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʊ" className="sym_cl">
                            ʊ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʉ" className="sym_cl">
                            ʉ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ʌ" className="sym_cl">
                            ʌ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʋ" className="sym_cl">
                            ʋ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ⱱ" className="sym_cl">
                            ⱱ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʍ" className="sym_cl">
                            ʍ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɯ" className="sym_cl">
                            ɯ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɰ" className="sym_cl">
                            ɰ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="χ" className="sym_cl">
                            χ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʎ" className="sym_cl">
                            ʎ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ɣ" className="sym_cl">
                            ɣ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʏ" className="sym_cl">
                            ʏ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɤ" className="sym_cl">
                            ɤ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʒ" className="sym_cl">
                            ʒ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʐ" className="sym_cl">
                            ʐ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʑ" className="sym_cl">
                            ʑ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʔ" className="sym_cl">
                            ʔ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʕ" className="sym_cl">
                            ʕ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ʢ" className="sym_cl">
                            ʢ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʡ" className="sym_cl">
                            ʡ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="|" className="sym_cl">
                            |
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∅" className="sym_cl">
                            ∅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ˈ" className="sym_cl">
                            ˈ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ˌ" className="sym_cl">
                            ˌ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ː" className="sym_cl">
                            ː
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ˑ" className="sym_cl">
                            ˑ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="‿" className="sym_cl">
                            ‿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="→" className="sym_cl">
                            →
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᵊ" className="sym_cl">
                            ᵊ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʳ" className="sym_cl">
                            ʳ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʰ" className="sym_cl">
                            ʰ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʷ" className="sym_cl">
                            ʷ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʲ" className="sym_cl">
                            ʲ
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Italian" className="tabcontent hide">
                  <h3>Italian</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="à" className="sym_cl">
                            à
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="è" className="sym_cl">
                            è
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="é" className="sym_cl">
                            é
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ì" className="sym_cl">
                            ì
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ò" className="sym_cl">
                            ò
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ó" className="sym_cl">
                            ó
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ù" className="sym_cl">
                            ù
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="€" className="sym_cl">
                            €
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="MathSci" className="tabcontent hide">
                  <h3>Math / Sci.</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="~" className="sym_cl">
                            ~
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="?" className="sym_cl">
                            ?
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="½" className="sym_cl">
                            ½
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¼" className="sym_cl">
                            ¼
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="/" className="sym_cl">
                            /
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="°" className="sym_cl">
                            °
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‰" className="sym_cl">
                            ‰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ø" className="sym_cl">
                            ø
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="α" className="sym_cl">
                            α
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="β" className="sym_cl">
                            β
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="γ" className="sym_cl">
                            γ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="δ" className="sym_cl">
                            δ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="˜" className="sym_cl">
                            ˜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="²" className="sym_cl">
                            ²
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="³" className="sym_cl">
                            ³
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="'" className="sym_cl">
                            '
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ε" className="sym_cl">
                            ε
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ζ" className="sym_cl">
                            ζ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="η" className="sym_cl">
                            η
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="θ" className="sym_cl">
                            θ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="κ" className="sym_cl">
                            κ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="λ" className="sym_cl">
                            λ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="μ" className="sym_cl">
                            μ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ν" className="sym_cl">
                            ν
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ξ" className="sym_cl">
                            ξ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="π" className="sym_cl">
                            π
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ρ" className="sym_cl">
                            ρ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="σ" className="sym_cl">
                            σ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="τ" className="sym_cl">
                            τ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="υ" className="sym_cl">
                            υ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="φ" className="sym_cl">
                            φ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="χ" className="sym_cl">
                            χ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ψ" className="sym_cl">
                            ψ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ω" className="sym_cl">
                            ω
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¬" className="sym_cl">
                            ¬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="n" className="sym_cl">
                            n
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="\" className="sym_cl">
                            \
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ø" className="sym_cl">
                            Ø
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="-" className="sym_cl">
                            -
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="±" className="sym_cl">
                            ±
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="·" className="sym_cl">
                            ·
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="×" className="sym_cl">
                            ×
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="÷" className="sym_cl">
                            ÷
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Norwegian" className="tabcontent hide">
                  <h3>Norwegian</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="å" className="sym_cl">
                            å
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="æ" className="sym_cl">
                            æ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="â" className="sym_cl">
                            â
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="é" className="sym_cl">
                            é
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="è" className="sym_cl">
                            è
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ê" className="sym_cl">
                            ê
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ø" className="sym_cl">
                            ø
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ó" className="sym_cl">
                            ó
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ò" className="sym_cl">
                            ò
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ô" className="sym_cl">
                            ô
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Pinyin" className="tabcontent hide">
                  <h3>Pinyin</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="ü" className="sym_cl">
                            ü
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="á" className="sym_cl">
                            á
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="é" className="sym_cl">
                            é
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="í" className="sym_cl">
                            í
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ó" className="sym_cl">
                            ó
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ú" className="sym_cl">
                            ú
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="à" className="sym_cl">
                            à
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="è" className="sym_cl">
                            è
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ì" className="sym_cl">
                            ì
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ò" className="sym_cl">
                            ò
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ù" className="sym_cl">
                            ù
                          </span>
                        </td>
                      </tr>
                      <tr></tr>
                    </tbody>
                  </table>
                </div>
                <div id="Portuguese" className="tabcontent hide">
                  <h3>Portuguese</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="ã" className="sym_cl">
                            ã
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="á" className="sym_cl">
                            á
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="à" className="sym_cl">
                            à
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="â" className="sym_cl">
                            â
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ç" className="sym_cl">
                            ç
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="é" className="sym_cl">
                            é
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ê" className="sym_cl">
                            ê
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="í" className="sym_cl">
                            í
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="õ" className="sym_cl">
                            õ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ó" className="sym_cl">
                            ó
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ô" className="sym_cl">
                            ô
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ú" className="sym_cl">
                            ú
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="€" className="sym_cl">
                            €
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ü" className="sym_cl">
                            ü
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Romanian" className="tabcontent hide">
                  <h3>Romanian</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="â" className="sym_cl">
                            â
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="î" className="sym_cl">
                            î
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="s" className="sym_cl">
                            s
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Russian" className="tabcontent hide">
                  <h3>Russian</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="€" className="sym_cl">
                            €
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="р" className="sym_cl">
                            р
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="т" className="sym_cl">
                            т
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ы" className="sym_cl">
                            ы
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="у" className="sym_cl">
                            у
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="и" className="sym_cl">
                            и
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="о" className="sym_cl">
                            о
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="п" className="sym_cl">
                            п
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ю" className="sym_cl">
                            ю
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="щ" className="sym_cl">
                            щ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="э" className="sym_cl">
                            э
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="д" className="sym_cl">
                            д
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ф" className="sym_cl">
                            ф
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="г" className="sym_cl">
                            г
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ъ" className="sym_cl">
                            ъ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="я" className="sym_cl">
                            я
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ч" className="sym_cl">
                            ч
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="й" className="sym_cl">
                            й
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="к" className="sym_cl">
                            к
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="л" className="sym_cl">
                            л
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ь" className="sym_cl">
                            ь
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ж" className="sym_cl">
                            ж
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="з" className="sym_cl">
                            з
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="х" className="sym_cl">
                            х
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ц" className="sym_cl">
                            ц
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="в" className="sym_cl">
                            в
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="б" className="sym_cl">
                            б
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="н" className="sym_cl">
                            н
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="м" className="sym_cl">
                            м
                          </span>
                        </td>
                        <td className="zoom">
                          <span id=";" className="sym_cl">
                            ;
                          </span>
                        </td>
                        <td className="zoom">
                          <span id=":" className="sym_cl">
                            :
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ё" className="sym_cl">
                            Ё
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ъ" className="sym_cl">
                            Ъ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Я" className="sym_cl">
                            Я
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ш" className="sym_cl">
                            Ш
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ы" className="sym_cl">
                            Ы
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="И" className="sym_cl">
                            И
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="П" className="sym_cl">
                            П
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ю" className="sym_cl">
                            Ю
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Щ" className="sym_cl">
                            Щ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Д" className="sym_cl">
                            Д
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ф" className="sym_cl">
                            Ф
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Г" className="sym_cl">
                            Г
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ч" className="sym_cl">
                            Ч
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Й" className="sym_cl">
                            Й
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="К" className="sym_cl">
                            К
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Л" className="sym_cl">
                            Л
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ь" className="sym_cl">
                            Ь
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ж" className="sym_cl">
                            Ж
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="З" className="sym_cl">
                            З
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Х" className="sym_cl">
                            Х
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ц" className="sym_cl">
                            Ц
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Б" className="sym_cl">
                            Б
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Н" className="sym_cl">
                            Н
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ш" className="sym_cl">
                            ш
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Э" className="sym_cl">
                            Э
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Spanish" className="tabcontent hide">
                  <h3>Spanish</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="á" className="sym_cl">
                            á
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="é" className="sym_cl">
                            é
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="í" className="sym_cl">
                            í
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ñ" className="sym_cl">
                            ñ
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ó" className="sym_cl">
                            ó
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ú" className="sym_cl">
                            ú
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ü" className="sym_cl">
                            ü
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¿" className="sym_cl">
                            ¿
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="¡" className="sym_cl">
                            ¡
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Á" className="sym_cl">
                            Á
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="É" className="sym_cl">
                            É
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Í" className="sym_cl">
                            Í
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="Ñ" className="sym_cl">
                            Ñ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ó" className="sym_cl">
                            Ó
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ú" className="sym_cl">
                            Ú
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ü" className="sym_cl">
                            Ü
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Swedish" className="tabcontent hide">
                  <h3>Swedish</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="ä" className="sym_cl">
                            ä
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="å" className="sym_cl">
                            å
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="é" className="sym_cl">
                            é
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ö" className="sym_cl">
                            ö
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ä" className="sym_cl">
                            Ä
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Å" className="sym_cl">
                            Å
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="É" className="sym_cl">
                            É
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ö" className="sym_cl">
                            Ö
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Symbols" className="tabcontent hide">
                  <h3>Symbols</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="✓" className="sym_cl">
                            ✓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="✗" className="sym_cl">
                            ✗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="☐" className="sym_cl">
                            ☐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="☑" className="sym_cl">
                            ☑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="☒" className="sym_cl">
                            ☒
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="«" className="sym_cl">
                            «
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="»" className="sym_cl">
                            »
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‹" className="sym_cl">
                            ‹
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="★" className="sym_cl">
                            ★
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="☆" className="sym_cl">
                            ☆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="☀" className="sym_cl">
                            ☀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="☼" className="sym_cl">
                            ☼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="☁" className="sym_cl">
                            ☁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="☂" className="sym_cl">
                            ☂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="☃" className="sym_cl">
                            ☃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="❄" className="sym_cl">
                            ❄
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="☽" className="sym_cl">
                            ☽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="°" className="sym_cl">
                            °
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="′" className="sym_cl">
                            ′
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="″" className="sym_cl">
                            ″
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‴" className="sym_cl">
                            ‴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="µ" className="sym_cl">
                            µ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ø" className="sym_cl">
                            ø
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‰" className="sym_cl">
                            ‰
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="←" className="sym_cl">
                            ←
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="→" className="sym_cl">
                            →
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↑" className="sym_cl">
                            ↑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↓" className="sym_cl">
                            ↓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↔" className="sym_cl">
                            ↔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↕" className="sym_cl">
                            ↕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="›" className="sym_cl">
                            ›
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="*" className="sym_cl">
                            *
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="#" className="sym_cl">
                            #
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="@" className="sym_cl">
                            @
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="©" className="sym_cl">
                            ©
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="™" className="sym_cl">
                            ™
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="®" className="sym_cl">
                            ®
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="±" className="sym_cl">
                            ±
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="−" className="sym_cl">
                            −
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="÷" className="sym_cl">
                            ÷
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="×" className="sym_cl">
                            ×
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="·" className="sym_cl">
                            ·
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="~" className="sym_cl">
                            ~
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≈" className="sym_cl">
                            ≈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≠" className="sym_cl">
                            ≠
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≤" className="sym_cl">
                            ≤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≥" className="sym_cl">
                            ≥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="½" className="sym_cl">
                            ½
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="¼" className="sym_cl">
                            ¼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¾" className="sym_cl">
                            ¾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⅓" className="sym_cl">
                            ⅓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⅔" className="sym_cl">
                            ⅔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∕" className="sym_cl">
                            ∕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="²" className="sym_cl">
                            ²
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="³" className="sym_cl">
                            ³
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Δ" className="sym_cl">
                            Δ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∞" className="sym_cl">
                            ∞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="☺" className="sym_cl">
                            ☺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="☹" className="sym_cl">
                            ☹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="❤" className="sym_cl">
                            ❤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="$" className="sym_cl">
                            $
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="€" className="sym_cl">
                            €
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¢" className="sym_cl">
                            ¢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="£" className="sym_cl">
                            £
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="¥" className="sym_cl">
                            ¥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="•" className="sym_cl">
                            •
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="◦" className="sym_cl">
                            ◦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‣" className="sym_cl">
                            ‣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="№" className="sym_cl">
                            №
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="§" className="sym_cl">
                            §
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="†" className="sym_cl">
                            †
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‡" className="sym_cl">
                            ‡
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="‹" className="sym_cl">
                            ‹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="›" className="sym_cl">
                            ›
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="–" className="sym_cl">
                            –
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="—" className="sym_cl">
                            —
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‑" className="sym_cl">
                            ‑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="―" className="sym_cl">
                            ―
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⁓" className="sym_cl">
                            ⁓
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="‒" className="sym_cl">
                            ‒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="­" className="sym_cl">
                            ­
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="?" className="sym_cl">
                            ?
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="°" className="sym_cl">
                            °
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="'" className="sym_cl">
                            '
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="µ" className="sym_cl">
                            µ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ø" className="sym_cl">
                            ø
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‰" className="sym_cl">
                            ‰
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="*" className="sym_cl">
                            *
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="#" className="sym_cl">
                            #
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="@" className="sym_cl">
                            @
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="©" className="sym_cl">
                            ©
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="™" className="sym_cl">
                            ™
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="®" className="sym_cl">
                            ®
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="±" className="sym_cl">
                            ±
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="-" className="sym_cl">
                            -
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="÷" className="sym_cl">
                            ÷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="×" className="sym_cl">
                            ×
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="·" className="sym_cl">
                            ·
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="~" className="sym_cl">
                            ~
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="˜" className="sym_cl">
                            ˜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="?" className="sym_cl">
                            ?
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="=" className="sym_cl">
                            =
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="=" className="sym_cl">
                            =
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="½" className="sym_cl">
                            ½
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¼" className="sym_cl">
                            ¼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¾" className="sym_cl">
                            ¾
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="?" className="sym_cl">
                            ?
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="/" className="sym_cl">
                            /
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="²" className="sym_cl">
                            ²
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="³" className="sym_cl">
                            ³
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="’" className="sym_cl">
                            ’
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="8" className="sym_cl">
                            8
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¶" className="sym_cl">
                            ¶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⁂" className="sym_cl">
                            ⁂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="…" className="sym_cl">
                            …
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="$" className="sym_cl">
                            $
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="€" className="sym_cl">
                            €
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¢" className="sym_cl">
                            ¢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‘" className="sym_cl">
                            ‘
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="£" className="sym_cl">
                            £
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¥" className="sym_cl">
                            ¥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="•" className="sym_cl">
                            •
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="?" className="sym_cl">
                            ?
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="§" className="sym_cl">
                            §
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="†" className="sym_cl">
                            †
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="…" className="sym_cl">
                            …
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‡" className="sym_cl">
                            ‡
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="¶" className="sym_cl">
                            ¶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="?" className="sym_cl">
                            ?
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Turkish" className="tabcontent hide">
                  <h3>Turkish</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="ç" className="sym_cl">
                            ç
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="â" className="sym_cl">
                            â
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Û" className="sym_cl">
                            Û
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="î" className="sym_cl">
                            î
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ö" className="sym_cl">
                            ö
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ü" className="sym_cl">
                            Ü
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ü" className="sym_cl">
                            ü
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="û" className="sym_cl">
                            û
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Â" className="sym_cl">
                            Â
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ç" className="sym_cl">
                            Ç
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="G" className="sym_cl">
                            G
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="Î" className="sym_cl">
                            Î
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ö" className="sym_cl">
                            Ö
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Vietnamese" className="tabcontent hide">
                  <h3>Vietnamese</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="á" className="sym_cl">
                            á
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="é" className="sym_cl">
                            é
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="í" className="sym_cl">
                            í
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ó" className="sym_cl">
                            ó
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ú" className="sym_cl">
                            ú
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="à" className="sym_cl">
                            à
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="è" className="sym_cl">
                            è
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ì" className="sym_cl">
                            ì
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ò" className="sym_cl">
                            ò
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ù" className="sym_cl">
                            ù
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ả" className="sym_cl">
                            ả
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ẻ" className="sym_cl">
                            ẻ
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ỉ" className="sym_cl">
                            ỉ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ỏ" className="sym_cl">
                            ỏ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ủ" className="sym_cl">
                            ủ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ã" className="sym_cl">
                            ã
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ẽ" className="sym_cl">
                            ẽ
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="õ" className="sym_cl">
                            õ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ụ" className="sym_cl">
                            ụ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="â" className="sym_cl">
                            â
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ạ" className="sym_cl">
                            ạ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ẹ" className="sym_cl">
                            ẹ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ị" className="sym_cl">
                            ị
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ọ" className="sym_cl">
                            ọ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ê" className="sym_cl">
                            ê
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ô" className="sym_cl">
                            ô
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Welsh" className="tabcontent hide">
                  <h3>Welsh</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="ô" className="sym_cl">
                            ô
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="û" className="sym_cl">
                            û
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="w" className="sym_cl">
                            w
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="y" className="sym_cl">
                            y
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="â" className="sym_cl">
                            â
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ê" className="sym_cl">
                            ê
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="î" className="sym_cl">
                            î
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ô" className="sym_cl">
                            ô
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="û" className="sym_cl">
                            û
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="â" className="sym_cl">
                            â
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ê" className="sym_cl">
                            ê
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ä" className="sym_cl">
                            ä
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ë" className="sym_cl">
                            ë
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ï" className="sym_cl">
                            ï
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ö" className="sym_cl">
                            ö
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ü" className="sym_cl">
                            ü
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ÿ" className="sym_cl">
                            ÿ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="á" className="sym_cl">
                            á
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="é" className="sym_cl">
                            é
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="î" className="sym_cl">
                            î
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="í" className="sym_cl">
                            í
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ó" className="sym_cl">
                            ó
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ú" className="sym_cl">
                            ú
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ẃ" className="sym_cl">
                            ẃ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ý" className="sym_cl">
                            ý
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="à" className="sym_cl">
                            à
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="è" className="sym_cl">
                            è
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ì" className="sym_cl">
                            ì
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ò" className="sym_cl">
                            ò
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ù" className="sym_cl">
                            ù
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ẁ" className="sym_cl">
                            ẁ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ỳ" className="sym_cl">
                            ỳ
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="ChineseJapaneseKorean" className="tabcontent hide">
                  <h3>Chinese / Japanese / Korean</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="⺀" className="sym_cl">
                            ⺀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺁" className="sym_cl">
                            ⺁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺄" className="sym_cl">
                            ⺄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺆" className="sym_cl">
                            ⺆
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="⺇" className="sym_cl">
                            ⺇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺈" className="sym_cl">
                            ⺈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺊" className="sym_cl">
                            ⺊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺋" className="sym_cl">
                            ⺋
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⺌" className="sym_cl">
                            ⺌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺍" className="sym_cl">
                            ⺍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺗" className="sym_cl">
                            ⺗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺕" className="sym_cl">
                            ⺕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺜" className="sym_cl">
                            ⺜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺝" className="sym_cl">
                            ⺝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺥" className="sym_cl">
                            ⺥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺧" className="sym_cl">
                            ⺧
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⺪" className="sym_cl">
                            ⺪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺬" className="sym_cl">
                            ⺬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺮" className="sym_cl">
                            ⺮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺳" className="sym_cl">
                            ⺳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺶" className="sym_cl">
                            ⺶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺷" className="sym_cl">
                            ⺷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺻" className="sym_cl">
                            ⺻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⺼" className="sym_cl">
                            ⺼
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⺾" className="sym_cl">
                            ⺾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⻆" className="sym_cl">
                            ⻆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⻊" className="sym_cl">
                            ⻊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⻌" className="sym_cl">
                            ⻌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⻍" className="sym_cl">
                            ⻍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⻏" className="sym_cl">
                            ⻏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⻖" className="sym_cl">
                            ⻖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⻗" className="sym_cl">
                            ⻗
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⻞" className="sym_cl">
                            ⻞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⻣" className="sym_cl">
                            ⻣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⼳" className="sym_cl">
                            ⼳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㇀" className="sym_cl">
                            ㇀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㇁" className="sym_cl">
                            ㇁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㇂" className="sym_cl">
                            ㇂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㇃" className="sym_cl">
                            ㇃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㇄" className="sym_cl">
                            ㇄
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="㇅" className="sym_cl">
                            ㇅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㇆" className="sym_cl">
                            ㇆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㇇" className="sym_cl">
                            ㇇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㇈" className="sym_cl">
                            ㇈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㇉" className="sym_cl">
                            ㇉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㇊" className="sym_cl">
                            ㇊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㇋" className="sym_cl">
                            ㇋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㇌" className="sym_cl">
                            ㇌
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="㇍" className="sym_cl">
                            ㇍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㇎" className="sym_cl">
                            ㇎
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㇏" className="sym_cl">
                            ㇏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="憧" className="sym_cl">
                            憧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="れ" className="sym_cl">
                            れ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="る" className="sym_cl">
                            る
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="あ" className="sym_cl">
                            あ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="こ" className="sym_cl">
                            こ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="が" className="sym_cl">
                            が
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="と" className="sym_cl">
                            と
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="は" className="sym_cl">
                            は
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="何" className="sym_cl">
                            何
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="か" className="sym_cl">
                            か
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ア" className="sym_cl">
                            ア
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="コ" className="sym_cl">
                            コ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ガ" className="sym_cl">
                            ガ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="レ" className="sym_cl">
                            レ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="の" className="sym_cl">
                            の
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐀" className="sym_cl">
                            㐀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐁" className="sym_cl">
                            㐁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐂" className="sym_cl">
                            㐂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐃" className="sym_cl">
                            㐃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐄" className="sym_cl">
                            㐄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐅" className="sym_cl">
                            㐅
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="㐆" className="sym_cl">
                            㐆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐇" className="sym_cl">
                            㐇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐈" className="sym_cl">
                            㐈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐉" className="sym_cl">
                            㐉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐊" className="sym_cl">
                            㐊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐌" className="sym_cl">
                            㐌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐍" className="sym_cl">
                            㐍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐎" className="sym_cl">
                            㐎
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="㐏" className="sym_cl">
                            㐏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐐" className="sym_cl">
                            㐐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐑" className="sym_cl">
                            㐑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐔" className="sym_cl">
                            㐔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐕" className="sym_cl">
                            㐕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐖" className="sym_cl">
                            㐖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐗" className="sym_cl">
                            㐗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐘" className="sym_cl">
                            㐘
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="㐜" className="sym_cl">
                            㐜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐝" className="sym_cl">
                            㐝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐰" className="sym_cl">
                            㐰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐱" className="sym_cl">
                            㐱
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐲" className="sym_cl">
                            㐲
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐳" className="sym_cl">
                            㐳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐴" className="sym_cl">
                            㐴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐵" className="sym_cl">
                            㐵
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="㐶" className="sym_cl">
                            㐶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐷" className="sym_cl">
                            㐷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㐸" className="sym_cl">
                            㐸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㒰" className="sym_cl">
                            㒰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㒱" className="sym_cl">
                            㒱
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㒲" className="sym_cl">
                            㒲
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㒳" className="sym_cl">
                            㒳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㒴" className="sym_cl">
                            㒴
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="㒵" className="sym_cl">
                            㒵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㒸" className="sym_cl">
                            㒸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㒹" className="sym_cl">
                            㒹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㒺" className="sym_cl">
                            㒺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㒻" className="sym_cl">
                            㒻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㓀" className="sym_cl">
                            㓀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㓁" className="sym_cl">
                            㓁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㓂" className="sym_cl">
                            㓂
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="㓃" className="sym_cl">
                            㓃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㓅" className="sym_cl">
                            㓅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㓆" className="sym_cl">
                            㓆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㓇" className="sym_cl">
                            㓇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㌠" className="sym_cl">
                            ㌠
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㌧" className="sym_cl">
                            ㌧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㉃" className="sym_cl">
                            ㉃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㈨" className="sym_cl">
                            ㈨
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="㈩" className="sym_cl">
                            ㈩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㈪" className="sym_cl">
                            ㈪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㈫" className="sym_cl">
                            ㈫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㈬" className="sym_cl">
                            ㈬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㉂" className="sym_cl">
                            ㉂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㉶" className="sym_cl">
                            ㉶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㉵" className="sym_cl">
                            ㉵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="㉴" className="sym_cl">
                            ㉴
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Arabic" className="tabcontent hide">
                  <h3>Arabic</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="؀" className="sym_cl">
                            ؀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="؁" className="sym_cl">
                            ؁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="؂" className="sym_cl">
                            ؂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="؃" className="sym_cl">
                            ؃
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="؋" className="sym_cl">
                            ؋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="،" className="sym_cl">
                            ،
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="؍" className="sym_cl">
                            ؍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="؎" className="sym_cl">
                            ؎
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="؏" className="sym_cl">
                            ؏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ء" className="sym_cl">
                            ء
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="آ" className="sym_cl">
                            آ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="أ" className="sym_cl">
                            أ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ؤ" className="sym_cl">
                            ؤ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="إ" className="sym_cl">
                            إ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ئ" className="sym_cl">
                            ئ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ا" className="sym_cl">
                            ا
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ب" className="sym_cl">
                            ب
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ة" className="sym_cl">
                            ة
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ت" className="sym_cl">
                            ت
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ث" className="sym_cl">
                            ث
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ج" className="sym_cl">
                            ج
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ح" className="sym_cl">
                            ح
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="خ" className="sym_cl">
                            خ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="د" className="sym_cl">
                            د
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="ذ" className="sym_cl">
                            ذ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ر" className="sym_cl">
                            ر
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ز" className="sym_cl">
                            ز
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="س" className="sym_cl">
                            س
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⻍" className="sym_cl">
                            ⻍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ش" className="sym_cl">
                            ش
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ص" className="sym_cl">
                            ص
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ض" className="sym_cl">
                            ض
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ط" className="sym_cl">
                            ط
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ظ" className="sym_cl">
                            ظ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⼳" className="sym_cl">
                            ⼳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ع" className="sym_cl">
                            ع
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="غ" className="sym_cl">
                            غ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ف" className="sym_cl">
                            ف
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ق" className="sym_cl">
                            ق
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ك" className="sym_cl">
                            ك
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ل" className="sym_cl">
                            ل
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="م" className="sym_cl">
                            م
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ن" className="sym_cl">
                            ن
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ه" className="sym_cl">
                            ه
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="و" className="sym_cl">
                            و
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ى" className="sym_cl">
                            ى
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ي" className="sym_cl">
                            ي
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="١" className="sym_cl">
                            ١
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="٠" className="sym_cl">
                            ٠
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="٢" className="sym_cl">
                            ٢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="٣" className="sym_cl">
                            ٣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="٤" className="sym_cl">
                            ٤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="٥" className="sym_cl">
                            ٥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="٦" className="sym_cl">
                            ٦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="٧" className="sym_cl">
                            ٧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="٨" className="sym_cl">
                            ٨
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="٩" className="sym_cl">
                            ٩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="٪" className="sym_cl">
                            ٪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="٫" className="sym_cl">
                            ٫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="٬" className="sym_cl">
                            ٬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="٭" className="sym_cl">
                            ٭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ٮ" className="sym_cl">
                            ٮ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ٯ" className="sym_cl">
                            ٯ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ٱ" className="sym_cl">
                            ٱ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ٵ" className="sym_cl">
                            ٵ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ٶ" className="sym_cl">
                            ٶ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ٷ" className="sym_cl">
                            ٷ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ٸ" className="sym_cl">
                            ٸ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ٹ" className="sym_cl">
                            ٹ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ٺ" className="sym_cl">
                            ٺ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ٻ" className="sym_cl">
                            ٻ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ټ" className="sym_cl">
                            ټ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ٽ" className="sym_cl">
                            ٽ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="پ" className="sym_cl">
                            پ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ٿ" className="sym_cl">
                            ٿ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڀ" className="sym_cl">
                            ڀ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ځ" className="sym_cl">
                            ځ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڂ" className="sym_cl">
                            ڂ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڃ" className="sym_cl">
                            ڃ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڄ" className="sym_cl">
                            ڄ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="څ" className="sym_cl">
                            څ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="چ" className="sym_cl">
                            چ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڇ" className="sym_cl">
                            ڇ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڈ" className="sym_cl">
                            ڈ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ډ" className="sym_cl">
                            ډ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ډ" className="sym_cl">
                            ډ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڋ" className="sym_cl">
                            ڋ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڌ" className="sym_cl">
                            ڌ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ڍ" className="sym_cl">
                            ڍ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڎ" className="sym_cl">
                            ڎ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڏ" className="sym_cl">
                            ڏ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڐ" className="sym_cl">
                            ڐ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڑ" className="sym_cl">
                            ڑ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڒ" className="sym_cl">
                            ڒ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ړ" className="sym_cl">
                            ړ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڔ" className="sym_cl">
                            ڔ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ڕ" className="sym_cl">
                            ڕ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ږ" className="sym_cl">
                            ږ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڗ" className="sym_cl">
                            ڗ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ژ" className="sym_cl">
                            ژ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڙ" className="sym_cl">
                            ڙ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ښ" className="sym_cl">
                            ښ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڛ" className="sym_cl">
                            ڛ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڜ" className="sym_cl">
                            ڜ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ڝ" className="sym_cl">
                            ڝ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڞ" className="sym_cl">
                            ڞ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڟ" className="sym_cl">
                            ڟ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڠ" className="sym_cl">
                            ڠ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڡ" className="sym_cl">
                            ڡ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڢ" className="sym_cl">
                            ڢ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڣ" className="sym_cl">
                            ڣ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڤ" className="sym_cl">
                            ڤ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ڥ" className="sym_cl">
                            ڥ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڦ" className="sym_cl">
                            ڦ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڧ" className="sym_cl">
                            ڧ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڨ" className="sym_cl">
                            ڨ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ک" className="sym_cl">
                            ک
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڪ" className="sym_cl">
                            ڪ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ګ" className="sym_cl">
                            ګ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڬ" className="sym_cl">
                            ڬ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ڭ" className="sym_cl">
                            ڭ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڮ" className="sym_cl">
                            ڮ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="گ" className="sym_cl">
                            گ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڰ" className="sym_cl">
                            ڰ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڱ" className="sym_cl">
                            ڱ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڲ" className="sym_cl">
                            ڲ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڳ" className="sym_cl">
                            ڳ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڴ" className="sym_cl">
                            ڴ
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="ڵ" className="sym_cl">
                            ڵ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڷ" className="sym_cl">
                            ڷ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڸ" className="sym_cl">
                            ڸ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڹ" className="sym_cl">
                            ڹ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ں" className="sym_cl">
                            ں
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڻ" className="sym_cl">
                            ڻ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڼ" className="sym_cl">
                            ڼ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڽ" className="sym_cl">
                            ڽ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ھ" className="sym_cl">
                            ھ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ڿ" className="sym_cl">
                            ڿ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۀ" className="sym_cl">
                            ۀ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ہ" className="sym_cl">
                            ہ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۂ" className="sym_cl">
                            ۂ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۃ" className="sym_cl">
                            ۃ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۄ" className="sym_cl">
                            ۄ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۅ" className="sym_cl">
                            ۅ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ۆ" className="sym_cl">
                            ۆ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۇ" className="sym_cl">
                            ۇ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۈ" className="sym_cl">
                            ۈ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۉ" className="sym_cl">
                            ۉ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۊ" className="sym_cl">
                            ۊ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۋ" className="sym_cl">
                            ۋ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ی" className="sym_cl">
                            ی
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۍ" className="sym_cl">
                            ۍ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ێ" className="sym_cl">
                            ێ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۏ" className="sym_cl">
                            ۏ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ې" className="sym_cl">
                            ې
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۑ" className="sym_cl">
                            ۑ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ے" className="sym_cl">
                            ے
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۓ" className="sym_cl">
                            ۓ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="۩" className="sym_cl">
                            ۩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۮ" className="sym_cl">
                            ۮ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ۯ" className="sym_cl">
                            ۯ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="۰" className="sym_cl">
                            ۰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="۱" className="sym_cl">
                            ۱
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="۲" className="sym_cl">
                            ۲
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="۳" className="sym_cl">
                            ۳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="۴" className="sym_cl">
                            ۴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="۵" className="sym_cl">
                            ۵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="۶" className="sym_cl">
                            ۶
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="۷" className="sym_cl">
                            ۷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="۸" className="sym_cl">
                            ۸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="۹" className="sym_cl">
                            ۹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۺ" className="sym_cl">
                            ۺ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۻ" className="sym_cl">
                            ۻ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ۼ" className="sym_cl">
                            ۼ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="۽" className="sym_cl">
                            ۽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="۾" className="sym_cl">
                            ۾
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Sanskrit" className="tabcontent hide">
                  <h3>Sanskrit</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="ऄ" className="sym_cl">
                            ऄ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="अ" className="sym_cl">
                            अ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="आ" className="sym_cl">
                            आ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="इ" className="sym_cl">
                            इ
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="ई" className="sym_cl">
                            ई
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ऊ" className="sym_cl">
                            ऊ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ऋ" className="sym_cl">
                            ऋ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ऌ" className="sym_cl">
                            ऌ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ऍ" className="sym_cl">
                            ऍ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ऎ" className="sym_cl">
                            ऎ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ए" className="sym_cl">
                            ए
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ऐ" className="sym_cl">
                            ऐ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ऑ" className="sym_cl">
                            ऑ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ऒ" className="sym_cl">
                            ऒ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ओ" className="sym_cl">
                            ओ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="औ" className="sym_cl">
                            औ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="क" className="sym_cl">
                            क
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ख" className="sym_cl">
                            ख
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ग" className="sym_cl">
                            ग
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="घ" className="sym_cl">
                            घ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ङ" className="sym_cl">
                            ङ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="च" className="sym_cl">
                            च
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="छ" className="sym_cl">
                            छ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ज" className="sym_cl">
                            ज
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="झ" className="sym_cl">
                            झ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ञ" className="sym_cl">
                            ञ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ट" className="sym_cl">
                            ट
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ठ" className="sym_cl">
                            ठ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ड" className="sym_cl">
                            ड
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ढ" className="sym_cl">
                            ढ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ण" className="sym_cl">
                            ण
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="त" className="sym_cl">
                            त
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="थ" className="sym_cl">
                            थ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="द" className="sym_cl">
                            द
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ध" className="sym_cl">
                            ध
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="न" className="sym_cl">
                            न
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ऩ" className="sym_cl">
                            ऩ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="प" className="sym_cl">
                            प
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="फ" className="sym_cl">
                            फ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ब" className="sym_cl">
                            ब
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="भ" className="sym_cl">
                            भ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="म" className="sym_cl">
                            म
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="य" className="sym_cl">
                            य
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="र" className="sym_cl">
                            र
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ऱ" className="sym_cl">
                            ऱ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ल" className="sym_cl">
                            ल
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ळ" className="sym_cl">
                            ळ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ऴ" className="sym_cl">
                            ऴ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="व" className="sym_cl">
                            व
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="श" className="sym_cl">
                            श
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ष" className="sym_cl">
                            ष
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="स" className="sym_cl">
                            स
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ह" className="sym_cl">
                            ह
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ऽ" className="sym_cl">
                            ऽ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ा" className="sym_cl">
                            ा
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ि" className="sym_cl">
                            ि
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ॐ" className="sym_cl">
                            ॐ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="क़" className="sym_cl">
                            क़
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ख़" className="sym_cl">
                            ख़
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ग़" className="sym_cl">
                            ग़
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ज़" className="sym_cl">
                            ज़
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ड़" className="sym_cl">
                            ड़
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ढ़" className="sym_cl">
                            ढ़
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="फ़" className="sym_cl">
                            फ़
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="य़" className="sym_cl">
                            य़
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ॠ" className="sym_cl">
                            ॠ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ॡ" className="sym_cl">
                            ॡ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ॢ" className="sym_cl">
                            ॢ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ॣ" className="sym_cl">
                            ॣ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="।" className="sym_cl">
                            ।
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="॥" className="sym_cl">
                            ॥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="०" className="sym_cl">
                            ०
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="१" className="sym_cl">
                            १
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="२" className="sym_cl">
                            २
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="३" className="sym_cl">
                            ३
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="४" className="sym_cl">
                            ४
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="५" className="sym_cl">
                            ५
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="६" className="sym_cl">
                            ६
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="७" className="sym_cl">
                            ७
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="८" className="sym_cl">
                            ८
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="९" className="sym_cl">
                            ९
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ॲ" className="sym_cl">
                            ॲ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ॿ" className="sym_cl">
                            ॿ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="॰" className="sym_cl">
                            ॰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ॻ" className="sym_cl">
                            ॻ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ॼ" className="sym_cl">
                            ॼ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ॽ" className="sym_cl">
                            ॽ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ॾ" className="sym_cl">
                            ॾ
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="MathematicalOperators" className="tabcontent hide">
                  <h3>Mathematical Operators</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="∀" className="sym_cl">
                            ∀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∁" className="sym_cl">
                            ∁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∂" className="sym_cl">
                            ∂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∃" className="sym_cl">
                            ∃
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="∄" className="sym_cl">
                            ∄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∅" className="sym_cl">
                            ∅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∆" className="sym_cl">
                            ∆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∇" className="sym_cl">
                            ∇
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∈" className="sym_cl">
                            ∈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∉" className="sym_cl">
                            ∉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∊" className="sym_cl">
                            ∊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∋" className="sym_cl">
                            ∋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∌" className="sym_cl">
                            ∌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∍" className="sym_cl">
                            ∍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∎" className="sym_cl">
                            ∎
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∏" className="sym_cl">
                            ∏
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∐" className="sym_cl">
                            ∐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∑" className="sym_cl">
                            ∑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="−" className="sym_cl">
                            −
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∓" className="sym_cl">
                            ∓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∔" className="sym_cl">
                            ∔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∕" className="sym_cl">
                            ∕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∖" className="sym_cl">
                            ∖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∗" className="sym_cl">
                            ∗
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="∘" className="sym_cl">
                            ∘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∙" className="sym_cl">
                            ∙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="√" className="sym_cl">
                            √
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∛" className="sym_cl">
                            ∛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∜" className="sym_cl">
                            ∜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∝" className="sym_cl">
                            ∝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∞" className="sym_cl">
                            ∞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∟" className="sym_cl">
                            ∟
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∠" className="sym_cl">
                            ∠
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∡" className="sym_cl">
                            ∡
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∢" className="sym_cl">
                            ∢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∣" className="sym_cl">
                            ∣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∤" className="sym_cl">
                            ∤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∥" className="sym_cl">
                            ∥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∦" className="sym_cl">
                            ∦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∧" className="sym_cl">
                            ∧
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∨" className="sym_cl">
                            ∨
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∩" className="sym_cl">
                            ∩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∪" className="sym_cl">
                            ∪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∫" className="sym_cl">
                            ∫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∬" className="sym_cl">
                            ∬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∭" className="sym_cl">
                            ∭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∮" className="sym_cl">
                            ∮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∯" className="sym_cl">
                            ∯
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∰" className="sym_cl">
                            ∰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∱" className="sym_cl">
                            ∱
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∲" className="sym_cl">
                            ∲
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∳" className="sym_cl">
                            ∳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∴" className="sym_cl">
                            ∴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∵" className="sym_cl">
                            ∵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∶" className="sym_cl">
                            ∶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∷" className="sym_cl">
                            ∷
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∸" className="sym_cl">
                            ∸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∹" className="sym_cl">
                            ∹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∺" className="sym_cl">
                            ∺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∻" className="sym_cl">
                            ∻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∼" className="sym_cl">
                            ∼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∾" className="sym_cl">
                            ∾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∿" className="sym_cl">
                            ∿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≀" className="sym_cl">
                            ≀
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≁" className="sym_cl">
                            ≁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≂" className="sym_cl">
                            ≂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≃" className="sym_cl">
                            ≃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≄" className="sym_cl">
                            ≄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≅" className="sym_cl">
                            ≅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≆" className="sym_cl">
                            ≆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≇" className="sym_cl">
                            ≇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≈" className="sym_cl">
                            ≈
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≉" className="sym_cl">
                            ≉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≊" className="sym_cl">
                            ≊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≋" className="sym_cl">
                            ≋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≌" className="sym_cl">
                            ≌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≍" className="sym_cl">
                            ≍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≎" className="sym_cl">
                            ≎
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≏" className="sym_cl">
                            ≏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≐" className="sym_cl">
                            ≐
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≑" className="sym_cl">
                            ≑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≒" className="sym_cl">
                            ≒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≓" className="sym_cl">
                            ≓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≔" className="sym_cl">
                            ≔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≕" className="sym_cl">
                            ≕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≖" className="sym_cl">
                            ≖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≗" className="sym_cl">
                            ≗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≘" className="sym_cl">
                            ≘
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≙" className="sym_cl">
                            ≙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≚" className="sym_cl">
                            ≚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≛" className="sym_cl">
                            ≛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≜" className="sym_cl">
                            ≜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≝" className="sym_cl">
                            ≝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≞" className="sym_cl">
                            ≞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≟" className="sym_cl">
                            ≟
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≠" className="sym_cl">
                            ≠
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≡" className="sym_cl">
                            ≡
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≢" className="sym_cl">
                            ≢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≣" className="sym_cl">
                            ≣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≤" className="sym_cl">
                            ≤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≥" className="sym_cl">
                            ≥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≦" className="sym_cl">
                            ≦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≧" className="sym_cl">
                            ≧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≨" className="sym_cl">
                            ≨
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≩" className="sym_cl">
                            ≩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≪" className="sym_cl">
                            ≪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≫" className="sym_cl">
                            ≫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≬" className="sym_cl">
                            ≬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≭" className="sym_cl">
                            ≭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≮" className="sym_cl">
                            ≮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≯" className="sym_cl">
                            ≯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≰" className="sym_cl">
                            ≰
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≱" className="sym_cl">
                            ≱
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≲" className="sym_cl">
                            ≲
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≳" className="sym_cl">
                            ≳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≴" className="sym_cl">
                            ≴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≵" className="sym_cl">
                            ≵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≶" className="sym_cl">
                            ≶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≷" className="sym_cl">
                            ≷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≸" className="sym_cl">
                            ≸
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≹" className="sym_cl">
                            ≹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≺" className="sym_cl">
                            ≺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≻" className="sym_cl">
                            ≻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≼" className="sym_cl">
                            ≼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≽" className="sym_cl">
                            ≽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≾" className="sym_cl">
                            ≾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≿" className="sym_cl">
                            ≿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊀" className="sym_cl">
                            ⊀
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="⊁" className="sym_cl">
                            ⊁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊂" className="sym_cl">
                            ⊂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊃" className="sym_cl">
                            ⊃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊄" className="sym_cl">
                            ⊄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊅" className="sym_cl">
                            ⊅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊆" className="sym_cl">
                            ⊆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊇" className="sym_cl">
                            ⊇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊈" className="sym_cl">
                            ⊈
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊉" className="sym_cl">
                            ⊉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊊" className="sym_cl">
                            ⊊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊋" className="sym_cl">
                            ⊋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊌" className="sym_cl">
                            ⊌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊍" className="sym_cl">
                            ⊍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊎" className="sym_cl">
                            ⊎
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊏" className="sym_cl">
                            ⊏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊐" className="sym_cl">
                            ⊐
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊑" className="sym_cl">
                            ⊑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊒" className="sym_cl">
                            ⊒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊓" className="sym_cl">
                            ⊓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊔" className="sym_cl">
                            ⊔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊕" className="sym_cl">
                            ⊕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊖" className="sym_cl">
                            ⊖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊗" className="sym_cl">
                            ⊗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊘" className="sym_cl">
                            ⊘
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊙" className="sym_cl">
                            ⊙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊚" className="sym_cl">
                            ⊚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊛" className="sym_cl">
                            ⊛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊜" className="sym_cl">
                            ⊜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊝" className="sym_cl">
                            ⊝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊞" className="sym_cl">
                            ⊞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊟" className="sym_cl">
                            ⊟
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊠" className="sym_cl">
                            ⊠
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊡" className="sym_cl">
                            ⊡
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊢" className="sym_cl">
                            ⊢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊣" className="sym_cl">
                            ⊣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊤" className="sym_cl">
                            ⊤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊥" className="sym_cl">
                            ⊥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊦" className="sym_cl">
                            ⊦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊧" className="sym_cl">
                            ⊧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊨" className="sym_cl">
                            ⊨
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊩" className="sym_cl">
                            ⊩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊪" className="sym_cl">
                            ⊪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊫" className="sym_cl">
                            ⊫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊬" className="sym_cl">
                            ⊬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊭" className="sym_cl">
                            ⊭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊮" className="sym_cl">
                            ⊮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊯" className="sym_cl">
                            ⊯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊰" className="sym_cl">
                            ⊰
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="⊲" className="sym_cl">
                            ⊲
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊳" className="sym_cl">
                            ⊳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊴" className="sym_cl">
                            ⊴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊵" className="sym_cl">
                            ⊵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊶" className="sym_cl">
                            ⊶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊷" className="sym_cl">
                            ⊷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊸" className="sym_cl">
                            ⊸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊹" className="sym_cl">
                            ⊹
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊺" className="sym_cl">
                            ⊺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊻" className="sym_cl">
                            ⊻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊼" className="sym_cl">
                            ⊼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊽" className="sym_cl">
                            ⊽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊾" className="sym_cl">
                            ⊾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊿" className="sym_cl">
                            ⊿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋀" className="sym_cl">
                            ⋀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋁" className="sym_cl">
                            ⋁
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋂" className="sym_cl">
                            ⋂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋃" className="sym_cl">
                            ⋃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋄" className="sym_cl">
                            ⋄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋅" className="sym_cl">
                            ⋅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋆" className="sym_cl">
                            ⋆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋇" className="sym_cl">
                            ⋇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋈" className="sym_cl">
                            ⋈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋉" className="sym_cl">
                            ⋉
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋊" className="sym_cl">
                            ⋊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋋" className="sym_cl">
                            ⋋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋌" className="sym_cl">
                            ⋌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋍" className="sym_cl">
                            ⋍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋎" className="sym_cl">
                            ⋎
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋏" className="sym_cl">
                            ⋏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋐" className="sym_cl">
                            ⋐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋑" className="sym_cl">
                            ⋑
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋒" className="sym_cl">
                            ⋒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋓" className="sym_cl">
                            ⋓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋔" className="sym_cl">
                            ⋔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋕" className="sym_cl">
                            ⋕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋖" className="sym_cl">
                            ⋖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋗" className="sym_cl">
                            ⋗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋘" className="sym_cl">
                            ⋘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋙" className="sym_cl">
                            ⋙
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋚" className="sym_cl">
                            ⋚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋛" className="sym_cl">
                            ⋛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋜" className="sym_cl">
                            ⋜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋝" className="sym_cl">
                            ⋝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋞" className="sym_cl">
                            ⋞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋟" className="sym_cl">
                            ⋟
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋠" className="sym_cl">
                            ⋠
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋡" className="sym_cl">
                            ⋡
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋢" className="sym_cl">
                            ⋢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋣" className="sym_cl">
                            ⋣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋤" className="sym_cl">
                            ⋤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋥" className="sym_cl">
                            ⋥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋦" className="sym_cl">
                            ⋦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋧" className="sym_cl">
                            ⋧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋨" className="sym_cl">
                            ⋨
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋩" className="sym_cl">
                            ⋩
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋪" className="sym_cl">
                            ⋪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋫" className="sym_cl">
                            ⋫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋬" className="sym_cl">
                            ⋬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋭" className="sym_cl">
                            ⋭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋮" className="sym_cl">
                            ⋮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋯" className="sym_cl">
                            ⋯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋰" className="sym_cl">
                            ⋰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋱" className="sym_cl">
                            ⋱
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋲" className="sym_cl">
                            ⋲
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋳" className="sym_cl">
                            ⋳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋴" className="sym_cl">
                            ⋴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋵" className="sym_cl">
                            ⋵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋶" className="sym_cl">
                            ⋶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋷" className="sym_cl">
                            ⋷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋸" className="sym_cl">
                            ⋸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋹" className="sym_cl">
                            ⋹
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋺" className="sym_cl">
                            ⋺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋻" className="sym_cl">
                            ⋻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋼" className="sym_cl">
                            ⋼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋽" className="sym_cl">
                            ⋽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋾" className="sym_cl">
                            ⋾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋿" className="sym_cl">
                            ⋿
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Mathematical Operators" className="tabcontent hide">
                  <h3>Mathematical Operators</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="∀" className="sym_cl">
                            ∀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∁" className="sym_cl">
                            ∁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∂" className="sym_cl">
                            ∂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∃" className="sym_cl">
                            ∃
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="∄" className="sym_cl">
                            ∄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∅" className="sym_cl">
                            ∅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∆" className="sym_cl">
                            ∆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∇" className="sym_cl">
                            ∇
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∈" className="sym_cl">
                            ∈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∉" className="sym_cl">
                            ∉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∊" className="sym_cl">
                            ∊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∋" className="sym_cl">
                            ∋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∌" className="sym_cl">
                            ∌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∍" className="sym_cl">
                            ∍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∎" className="sym_cl">
                            ∎
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∏" className="sym_cl">
                            ∏
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∐" className="sym_cl">
                            ∐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∑" className="sym_cl">
                            ∑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="−" className="sym_cl">
                            −
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∓" className="sym_cl">
                            ∓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∔" className="sym_cl">
                            ∔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∕" className="sym_cl">
                            ∕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∖" className="sym_cl">
                            ∖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∗" className="sym_cl">
                            ∗
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="∘" className="sym_cl">
                            ∘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∙" className="sym_cl">
                            ∙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="√" className="sym_cl">
                            √
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∛" className="sym_cl">
                            ∛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∜" className="sym_cl">
                            ∜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∝" className="sym_cl">
                            ∝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∞" className="sym_cl">
                            ∞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∟" className="sym_cl">
                            ∟
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∠" className="sym_cl">
                            ∠
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∡" className="sym_cl">
                            ∡
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∢" className="sym_cl">
                            ∢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∣" className="sym_cl">
                            ∣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∤" className="sym_cl">
                            ∤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∥" className="sym_cl">
                            ∥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∦" className="sym_cl">
                            ∦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∧" className="sym_cl">
                            ∧
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∨" className="sym_cl">
                            ∨
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∩" className="sym_cl">
                            ∩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∪" className="sym_cl">
                            ∪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∫" className="sym_cl">
                            ∫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∬" className="sym_cl">
                            ∬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∭" className="sym_cl">
                            ∭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∮" className="sym_cl">
                            ∮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∯" className="sym_cl">
                            ∯
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∰" className="sym_cl">
                            ∰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∱" className="sym_cl">
                            ∱
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∲" className="sym_cl">
                            ∲
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∳" className="sym_cl">
                            ∳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∴" className="sym_cl">
                            ∴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∵" className="sym_cl">
                            ∵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∶" className="sym_cl">
                            ∶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∷" className="sym_cl">
                            ∷
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∸" className="sym_cl">
                            ∸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∹" className="sym_cl">
                            ∹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∺" className="sym_cl">
                            ∺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∻" className="sym_cl">
                            ∻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∼" className="sym_cl">
                            ∼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∾" className="sym_cl">
                            ∾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∿" className="sym_cl">
                            ∿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≀" className="sym_cl">
                            ≀
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≁" className="sym_cl">
                            ≁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≂" className="sym_cl">
                            ≂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≃" className="sym_cl">
                            ≃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≄" className="sym_cl">
                            ≄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≅" className="sym_cl">
                            ≅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≆" className="sym_cl">
                            ≆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≇" className="sym_cl">
                            ≇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≈" className="sym_cl">
                            ≈
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≉" className="sym_cl">
                            ≉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≊" className="sym_cl">
                            ≊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≋" className="sym_cl">
                            ≋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≌" className="sym_cl">
                            ≌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≍" className="sym_cl">
                            ≍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≎" className="sym_cl">
                            ≎
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≏" className="sym_cl">
                            ≏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≐" className="sym_cl">
                            ≐
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≑" className="sym_cl">
                            ≑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≒" className="sym_cl">
                            ≒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≓" className="sym_cl">
                            ≓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≔" className="sym_cl">
                            ≔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≕" className="sym_cl">
                            ≕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≖" className="sym_cl">
                            ≖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≗" className="sym_cl">
                            ≗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≘" className="sym_cl">
                            ≘
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≙" className="sym_cl">
                            ≙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≚" className="sym_cl">
                            ≚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≛" className="sym_cl">
                            ≛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≜" className="sym_cl">
                            ≜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≝" className="sym_cl">
                            ≝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≞" className="sym_cl">
                            ≞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≟" className="sym_cl">
                            ≟
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≠" className="sym_cl">
                            ≠
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≡" className="sym_cl">
                            ≡
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≢" className="sym_cl">
                            ≢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≣" className="sym_cl">
                            ≣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≤" className="sym_cl">
                            ≤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≥" className="sym_cl">
                            ≥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≦" className="sym_cl">
                            ≦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≧" className="sym_cl">
                            ≧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≨" className="sym_cl">
                            ≨
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≩" className="sym_cl">
                            ≩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≪" className="sym_cl">
                            ≪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≫" className="sym_cl">
                            ≫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≬" className="sym_cl">
                            ≬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≭" className="sym_cl">
                            ≭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≮" className="sym_cl">
                            ≮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≯" className="sym_cl">
                            ≯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≰" className="sym_cl">
                            ≰
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≱" className="sym_cl">
                            ≱
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≲" className="sym_cl">
                            ≲
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≳" className="sym_cl">
                            ≳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≴" className="sym_cl">
                            ≴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≵" className="sym_cl">
                            ≵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≶" className="sym_cl">
                            ≶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≷" className="sym_cl">
                            ≷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≸" className="sym_cl">
                            ≸
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≹" className="sym_cl">
                            ≹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≺" className="sym_cl">
                            ≺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≻" className="sym_cl">
                            ≻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≼" className="sym_cl">
                            ≼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≽" className="sym_cl">
                            ≽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≾" className="sym_cl">
                            ≾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≿" className="sym_cl">
                            ≿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊀" className="sym_cl">
                            ⊀
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="⊁" className="sym_cl">
                            ⊁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊂" className="sym_cl">
                            ⊂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊃" className="sym_cl">
                            ⊃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊄" className="sym_cl">
                            ⊄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊅" className="sym_cl">
                            ⊅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊆" className="sym_cl">
                            ⊆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊇" className="sym_cl">
                            ⊇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊈" className="sym_cl">
                            ⊈
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊉" className="sym_cl">
                            ⊉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊊" className="sym_cl">
                            ⊊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊋" className="sym_cl">
                            ⊋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊌" className="sym_cl">
                            ⊌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊍" className="sym_cl">
                            ⊍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊎" className="sym_cl">
                            ⊎
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊏" className="sym_cl">
                            ⊏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊐" className="sym_cl">
                            ⊐
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊑" className="sym_cl">
                            ⊑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊒" className="sym_cl">
                            ⊒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊓" className="sym_cl">
                            ⊓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊔" className="sym_cl">
                            ⊔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊕" className="sym_cl">
                            ⊕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊖" className="sym_cl">
                            ⊖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊗" className="sym_cl">
                            ⊗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊘" className="sym_cl">
                            ⊘
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊙" className="sym_cl">
                            ⊙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊚" className="sym_cl">
                            ⊚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊛" className="sym_cl">
                            ⊛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊜" className="sym_cl">
                            ⊜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊝" className="sym_cl">
                            ⊝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊞" className="sym_cl">
                            ⊞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊟" className="sym_cl">
                            ⊟
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊠" className="sym_cl">
                            ⊠
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊡" className="sym_cl">
                            ⊡
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊢" className="sym_cl">
                            ⊢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊣" className="sym_cl">
                            ⊣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊤" className="sym_cl">
                            ⊤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊥" className="sym_cl">
                            ⊥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊦" className="sym_cl">
                            ⊦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊧" className="sym_cl">
                            ⊧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊨" className="sym_cl">
                            ⊨
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊩" className="sym_cl">
                            ⊩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊪" className="sym_cl">
                            ⊪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊫" className="sym_cl">
                            ⊫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊬" className="sym_cl">
                            ⊬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊭" className="sym_cl">
                            ⊭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊮" className="sym_cl">
                            ⊮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊯" className="sym_cl">
                            ⊯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊰" className="sym_cl">
                            ⊰
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="⊲" className="sym_cl">
                            ⊲
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊳" className="sym_cl">
                            ⊳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊴" className="sym_cl">
                            ⊴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊵" className="sym_cl">
                            ⊵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊶" className="sym_cl">
                            ⊶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊷" className="sym_cl">
                            ⊷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊸" className="sym_cl">
                            ⊸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊹" className="sym_cl">
                            ⊹
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊺" className="sym_cl">
                            ⊺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊻" className="sym_cl">
                            ⊻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊼" className="sym_cl">
                            ⊼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊽" className="sym_cl">
                            ⊽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊾" className="sym_cl">
                            ⊾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊿" className="sym_cl">
                            ⊿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋀" className="sym_cl">
                            ⋀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋁" className="sym_cl">
                            ⋁
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋂" className="sym_cl">
                            ⋂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋃" className="sym_cl">
                            ⋃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋄" className="sym_cl">
                            ⋄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋅" className="sym_cl">
                            ⋅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋆" className="sym_cl">
                            ⋆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋇" className="sym_cl">
                            ⋇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋈" className="sym_cl">
                            ⋈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋉" className="sym_cl">
                            ⋉
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋊" className="sym_cl">
                            ⋊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋋" className="sym_cl">
                            ⋋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋌" className="sym_cl">
                            ⋌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋍" className="sym_cl">
                            ⋍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋎" className="sym_cl">
                            ⋎
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋏" className="sym_cl">
                            ⋏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋐" className="sym_cl">
                            ⋐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋑" className="sym_cl">
                            ⋑
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋒" className="sym_cl">
                            ⋒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋓" className="sym_cl">
                            ⋓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋔" className="sym_cl">
                            ⋔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋕" className="sym_cl">
                            ⋕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋖" className="sym_cl">
                            ⋖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋗" className="sym_cl">
                            ⋗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋘" className="sym_cl">
                            ⋘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋙" className="sym_cl">
                            ⋙
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋚" className="sym_cl">
                            ⋚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋛" className="sym_cl">
                            ⋛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋜" className="sym_cl">
                            ⋜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋝" className="sym_cl">
                            ⋝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋞" className="sym_cl">
                            ⋞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋟" className="sym_cl">
                            ⋟
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋠" className="sym_cl">
                            ⋠
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋡" className="sym_cl">
                            ⋡
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋢" className="sym_cl">
                            ⋢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋣" className="sym_cl">
                            ⋣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋤" className="sym_cl">
                            ⋤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋥" className="sym_cl">
                            ⋥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋦" className="sym_cl">
                            ⋦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋧" className="sym_cl">
                            ⋧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋨" className="sym_cl">
                            ⋨
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋩" className="sym_cl">
                            ⋩
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋪" className="sym_cl">
                            ⋪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋫" className="sym_cl">
                            ⋫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋬" className="sym_cl">
                            ⋬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋭" className="sym_cl">
                            ⋭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋮" className="sym_cl">
                            ⋮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋯" className="sym_cl">
                            ⋯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋰" className="sym_cl">
                            ⋰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋱" className="sym_cl">
                            ⋱
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋲" className="sym_cl">
                            ⋲
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋳" className="sym_cl">
                            ⋳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋴" className="sym_cl">
                            ⋴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋵" className="sym_cl">
                            ⋵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋶" className="sym_cl">
                            ⋶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋷" className="sym_cl">
                            ⋷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋸" className="sym_cl">
                            ⋸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋹" className="sym_cl">
                            ⋹
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋺" className="sym_cl">
                            ⋺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋻" className="sym_cl">
                            ⋻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋼" className="sym_cl">
                            ⋼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋽" className="sym_cl">
                            ⋽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋾" className="sym_cl">
                            ⋾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋿" className="sym_cl">
                            ⋿
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Hebrew" className="tabcontent hide">
                  <h3>Hebrew</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="־" className="sym_cl">
                            ־
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="׀" className="sym_cl">
                            ׀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="׃" className="sym_cl">
                            ׃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="׆" className="sym_cl">
                            ׆
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="א" className="sym_cl">
                            א
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ב" className="sym_cl">
                            ב
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ג" className="sym_cl">
                            ג
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ד" className="sym_cl">
                            ד
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ה" className="sym_cl">
                            ה
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ו" className="sym_cl">
                            ו
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ז" className="sym_cl">
                            ז
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ח" className="sym_cl">
                            ח
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ט" className="sym_cl">
                            ט
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="י" className="sym_cl">
                            י
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ך" className="sym_cl">
                            ך
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="כ" className="sym_cl">
                            כ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ל" className="sym_cl">
                            ל
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ם" className="sym_cl">
                            ם
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="מ" className="sym_cl">
                            מ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ן" className="sym_cl">
                            ן
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="נ" className="sym_cl">
                            נ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ס" className="sym_cl">
                            ס
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ע" className="sym_cl">
                            ע
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ף" className="sym_cl">
                            ף
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="פ" className="sym_cl">
                            פ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ץ" className="sym_cl">
                            ץ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="צ" className="sym_cl">
                            צ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ק" className="sym_cl">
                            ק
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ר" className="sym_cl">
                            ר
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ש" className="sym_cl">
                            ש
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ת" className="sym_cl">
                            ת
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="װ" className="sym_cl">
                            װ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ױ" className="sym_cl">
                            ױ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ײ" className="sym_cl">
                            ײ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="׳" className="sym_cl">
                            ׳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="״" className="sym_cl">
                            ״
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="יִ‬" className="sym_cl">
                            יִ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ﬞ‬" className="sym_cl">
                            ﬞ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ײַ" className="sym_cl">
                            ײַ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ﬠ" className="sym_cl">
                            ﬠ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ﬡ‬" className="sym_cl">
                            ﬡ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ﬢ" className="sym_cl">
                            ﬢ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ﬣ‬" className="sym_cl">
                            ﬣ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ﬤ‬" className="sym_cl">
                            ﬤ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ﬥ‬" className="sym_cl">
                            ﬥ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ﬦ" className="sym_cl">
                            ﬦ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ﬧ‬" className="sym_cl">
                            ﬧ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ﬨ‬" className="sym_cl">
                            ﬨ‬
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="﬩" className="sym_cl">
                            ﬩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="שׁ‬" className="sym_cl">
                            שׁ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="שׂ‬" className="sym_cl">
                            שׂ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="שּׁ‬" className="sym_cl">
                            שּׁ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="שּׂ‬" className="sym_cl">
                            שּׂ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="אַ‬" className="sym_cl">
                            אַ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="אָ‬" className="sym_cl">
                            אָ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="אּ‬" className="sym_cl">
                            אּ‬
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="בּ‬" className="sym_cl">
                            בּ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="גּ" className="sym_cl">
                            גּ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="דּ‬" className="sym_cl">
                            דּ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="הּ‬" className="sym_cl">
                            הּ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="וּ‬" className="sym_cl">
                            וּ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="זּ‬" className="sym_cl">
                            זּ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="טּ‬" className="sym_cl">
                            טּ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="יּ‬" className="sym_cl">
                            יּ‬
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ךּ‬" className="sym_cl">
                            ךּ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="כּ" className="sym_cl">
                            כּ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="לּ" className="sym_cl">
                            לּ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="מּ" className="sym_cl">
                            מּ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="נּ‬" className="sym_cl">
                            נּ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="סּ‬" className="sym_cl">
                            סּ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ףּ‬" className="sym_cl">
                            ףּ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="פּ‬" className="sym_cl">
                            פּ‬
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="צּ" className="sym_cl">
                            צּ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="קּ‬" className="sym_cl">
                            קּ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="רּ‬" className="sym_cl">
                            רּ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="שּ‬" className="sym_cl">
                            שּ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="תּ‬" className="sym_cl">
                            תּ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="וֹ‬" className="sym_cl">
                            וֹ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="בֿ‬" className="sym_cl">
                            בֿ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="כֿ" className="sym_cl">
                            כֿ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="פֿ‬" className="sym_cl">
                            פֿ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ﭏ‬" className="sym_cl">
                            ﭏ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="וֹ‬" className="sym_cl">
                            וֹ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="וּ‬" className="sym_cl">
                            וּ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ְ" className="sym_cl">
                            ְ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="י" className="sym_cl">
                            י
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ְ‬" className="sym_cl">
                            ְ‬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ֶ‬" className="sym_cl">
                            ֶ‬
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="Others" className="tabcontent hide">
                  <h3>Others</h3>
                  <table border="1" className="sym_table">
                    <tbody>
                      <tr>
                        <td className="zoom">
                          <span id="tridotright" className="sym_cl">
                            ჻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‘" className="sym_cl" title="lsquo">
                            ‘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="’" className="sym_cl" title="rsquo">
                            ’
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‚" className="sym_cl" title="lsquor">
                            ‚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‛" className="sym_cl" title="rsquorev">
                            ‛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="“" className="sym_cl" title="ldquo">
                            “
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="”" className="sym_cl" title="rdquo">
                            ”
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="„" className="sym_cl" title="ldquor">
                            „
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="‟" className="sym_cl" title="rdquorev">
                            ‟
                          </span>
                        </td>
                        <td className="zoom">
                          <span id='"' className="sym_cl" title="quot ">
                            "
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="`" className="sym_cl" title="grave">
                            `
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¡" className="sym_cl" title="iexcl">
                            ¡
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¢" className="sym_cl" title="cent">
                            ¢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="£" className="sym_cl" title="pound">
                            £
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¤" className="sym_cl" title="curren">
                            ¤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¥" className="sym_cl" title="yen">
                            ¥
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="¦" className="sym_cl" title="brvbar">
                            ¦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="§" className="sym_cl" title="sect">
                            §
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¨" className="sym_cl" title="uml">
                            ¨
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="©" className="sym_cl" title="copy">
                            ©
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ª" className="sym_cl" title="ordf">
                            ª
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="«" className="sym_cl" title="laquo">
                            «
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¬" className="sym_cl" title="not">
                            ¬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="­" className="sym_cl" title="shy">
                            ­
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="®" className="sym_cl" title="reg">
                            ®
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¯" className="sym_cl" title="macr">
                            ¯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="°" className="sym_cl" title="deg">
                            °
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="±" className="sym_cl" title="plusmn">
                            ±
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="²" className="sym_cl" title="sup2">
                            ²
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="³" className="sym_cl" title="sup3">
                            ³
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="´" className="sym_cl" title="acute">
                            ´
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="µ" className="sym_cl" title="micro">
                            µ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="¶" className="sym_cl" title="para">
                            ¶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="·" className="sym_cl" title="middot">
                            ·
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¸" className="sym_cl" title="cedil">
                            ¸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¹" className="sym_cl" title="sup1">
                            ¹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="º" className="sym_cl" title="ordm">
                            º
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="»" className="sym_cl" title="raquo">
                            »
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¼" className="sym_cl" title="frac14">
                            ¼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="½" className="sym_cl" title="frac12">
                            ½
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="¾" className="sym_cl" title="frac34">
                            ¾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="¿" className="sym_cl" title="iquest">
                            ¿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="À" className="sym_cl" title="Agrave">
                            À
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Á" className="sym_cl" title="Aacute">
                            Á
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Â" className="sym_cl" title="Acirc">
                            Â
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ã" className="sym_cl" title="Atilde">
                            Ã
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ä" className="sym_cl" title="Auml">
                            Ä
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Å" className="sym_cl" title="Aring">
                            Å
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Æ" className="sym_cl" title="AElig">
                            Æ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ç" className="sym_cl" title="Ccedil">
                            Ç
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="È" className="sym_cl" title="Egrave">
                            È
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="É" className="sym_cl" title="Eacute">
                            É
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ê" className="sym_cl" title="Ecirc">
                            Ê
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ë" className="sym_cl" title="Euml">
                            Ë
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ì" className="sym_cl" title="Igrave">
                            Ì
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Í" className="sym_cl" title="Iacute">
                            Í
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Î" className="sym_cl" title="Icirc">
                            Î
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ï" className="sym_cl" title="Iuml">
                            Ï
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ð" className="sym_cl" title="ETH">
                            Ð
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ñ" className="sym_cl" title="Ntilde">
                            Ñ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ò" className="sym_cl" title="Ograve">
                            Ò
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ó" className="sym_cl" title="Oacute">
                            Ó
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ô" className="sym_cl" title="Ocirc">
                            Ô
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Õ" className="sym_cl" title="Otilde">
                            Õ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ö" className="sym_cl" title="Ouml">
                            Ö
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="×" className="sym_cl" title="times">
                            ×
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ø" className="sym_cl" title="Oslash">
                            Ø
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ù" className="sym_cl" title="Ugrave">
                            Ù
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ú" className="sym_cl" title="Uacute">
                            Ú
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Û" className="sym_cl" title="Ucirc">
                            Û
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ü" className="sym_cl" title="Uuml">
                            Ü
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ý" className="sym_cl" title="Yacute">
                            Ý
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Þ" className="sym_cl" title="THORN">
                            Þ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ß" className="sym_cl" title="szlig">
                            ß
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="à" className="sym_cl" title="agrave">
                            à
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="á" className="sym_cl" title="aacute">
                            á
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="â" className="sym_cl" title="acirc">
                            â
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ã" className="sym_cl" title="atilde">
                            ã
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ä" className="sym_cl" title="auml">
                            ä
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="å" className="sym_cl" title="aring">
                            å
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="æ" className="sym_cl" title="aelig">
                            æ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ç" className="sym_cl" title="ccedil">
                            ç
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="è" className="sym_cl" title="egrave">
                            è
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="é" className="sym_cl" title="eacute">
                            é
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ê" className="sym_cl" title="ecirc">
                            ê
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ë" className="sym_cl" title="euml">
                            ë
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ì" className="sym_cl" title="igrave">
                            ì
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="í" className="sym_cl" title="iacute">
                            í
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="î" className="sym_cl" title="icirc">
                            î
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ï" className="sym_cl" title="iuml">
                            ï
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ð" className="sym_cl" title="eth">
                            ð
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ñ" className="sym_cl" title="ntilde">
                            ñ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ò" className="sym_cl" title="ograve">
                            ò
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ó" className="sym_cl" title="oacute">
                            ó
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ô" className="sym_cl" title="ocirc">
                            ô
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="õ" className="sym_cl" title="otilde">
                            õ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ö" className="sym_cl" title="ouml">
                            ö
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="÷" className="sym_cl" title="div">
                            ÷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ø" className="sym_cl" title="oslash">
                            ø
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ù" className="sym_cl" title="ugrave">
                            ù
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ú" className="sym_cl" title="uacute">
                            ú
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="û" className="sym_cl" title="ucirc">
                            û
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ü" className="sym_cl" title="uuml">
                            ü
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ý" className="sym_cl" title="yacute">
                            ý
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="þ" className="sym_cl" title="thorn">
                            þ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ÿ" className="sym_cl" title="yuml">
                            ÿ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ā" className="sym_cl" title="Amacr">
                            Ā
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ā" className="sym_cl" title="amacr">
                            ā
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ă" className="sym_cl" title="Abreve">
                            Ă
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ă" className="sym_cl" title="abreve">
                            ă
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ą" className="sym_cl" title="Aogon">
                            Ą
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ą" className="sym_cl" title="aogon">
                            ą
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ć" className="sym_cl" title="Cacute">
                            Ć
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ć" className="sym_cl" title="cacute">
                            ć
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ĉ" className="sym_cl" title="Ccirc">
                            Ĉ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ĉ" className="sym_cl" title="ccirc">
                            ĉ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ċ" className="sym_cl" title="Cdot">
                            Ċ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ċ" className="sym_cl" title="cdot">
                            ċ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Č" className="sym_cl" title="Ccaron">
                            Č
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="č" className="sym_cl" title="ccaron">
                            č
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ď" className="sym_cl" title="Dcaron">
                            Ď
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ď" className="sym_cl" title="dcaron">
                            ď
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Đ" className="sym_cl" title="Dstrok">
                            Đ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="đ" className="sym_cl" title="dstrok">
                            đ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ē" className="sym_cl" title="Emacr">
                            Ē
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ē" className="sym_cl" title="emacr">
                            ē
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ĕ" className="sym_cl" title="Ebreve">
                            Ĕ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ĕ" className="sym_cl" title="ebreve">
                            ĕ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ė" className="sym_cl" title="Edot">
                            Ė
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ė" className="sym_cl" title="edot">
                            ė
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ę" className="sym_cl" title="Eogon">
                            Ę
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ę" className="sym_cl" title="eogon">
                            ę
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ě" className="sym_cl" title="Ecaron">
                            Ě
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ě" className="sym_cl" title="ecaron">
                            ě
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ĝ" className="sym_cl" title="Gcirc">
                            Ĝ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ĝ" className="sym_cl" title="gcirc">
                            ĝ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ğ" className="sym_cl" title="Gbreve">
                            Ğ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ğ" className="sym_cl" title="gbreve">
                            ğ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ġ" className="sym_cl" title="Gdot">
                            Ġ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ġ" className="sym_cl" title="gdot">
                            ġ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ģ" className="sym_cl" title="Gcedil">
                            Ģ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ĥ" className="sym_cl" title="Hcirc">
                            Ĥ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ĥ" className="sym_cl" title="hcirc">
                            ĥ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ħ" className="sym_cl" title="Hstrok">
                            Ħ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ħ" className="sym_cl" title="hstrok">
                            ħ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ĩ" className="sym_cl" title="Itilde">
                            Ĩ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ĩ" className="sym_cl" title="itilde">
                            ĩ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ī" className="sym_cl" title="Imacr">
                            Ī
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ī" className="sym_cl" title="imacr">
                            ī
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ĭ" className="sym_cl" title="Ibreve">
                            Ĭ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ĭ" className="sym_cl" title="ibreve">
                            ĭ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Į" className="sym_cl" title="Iogon">
                            Į
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="į" className="sym_cl" title="iogon">
                            į
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="İ" className="sym_cl" title="Idot">
                            İ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ı" className="sym_cl" title="imath">
                            ı
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ĳ" className="sym_cl" title="IJlig">
                            Ĳ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ĳ" className="sym_cl" title="ijlig">
                            ĳ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ĵ" className="sym_cl" title="Jcirc">
                            Ĵ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ĵ" className="sym_cl" title="jcirc">
                            ĵ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ķ" className="sym_cl" title="Kcedil">
                            Ķ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ķ" className="sym_cl" title="kcedil">
                            ķ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ĸ" className="sym_cl" title="kgreen">
                            ĸ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ĺ" className="sym_cl" title="Lacute">
                            Ĺ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ĺ" className="sym_cl" title="lacute">
                            ĺ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ļ" className="sym_cl" title="Lcedil">
                            Ļ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ļ" className="sym_cl" title="lcedil">
                            ļ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ľ" className="sym_cl" title="Lcaron">
                            Ľ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ľ" className="sym_cl" title="lcaron">
                            ľ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ŀ" className="sym_cl" title="Lmidot">
                            Ŀ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ŀ" className="sym_cl" title="lmidot">
                            ŀ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ł" className="sym_cl" title="Lstrok">
                            Ł
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ł" className="sym_cl" title="lstrok">
                            ł
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ń" className="sym_cl" title="Nacute">
                            Ń
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ń" className="sym_cl" title="nacute">
                            ń
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ņ" className="sym_cl" title="Ncedil">
                            Ņ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ņ" className="sym_cl" title="ncedil">
                            ņ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ň" className="sym_cl" title="Ncaron">
                            Ň
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ň" className="sym_cl" title="ncaron">
                            ň
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ŉ" className="sym_cl" title="napos">
                            ŉ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ŋ" className="sym_cl" title="ENG">
                            Ŋ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ŋ" className="sym_cl" title="eng">
                            ŋ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ō" className="sym_cl" title="Omacr">
                            Ō
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ō" className="sym_cl" title="omacr">
                            ō
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ŏ" className="sym_cl" title="Obreve">
                            Ŏ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ŏ" className="sym_cl" title="obreve">
                            ŏ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ő" className="sym_cl" title="Odblac">
                            Ő
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ő" className="sym_cl" title="odblac">
                            ő
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Œ" className="sym_cl" title="OElig">
                            Œ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="œ" className="sym_cl" title="oelig">
                            œ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ŕ" className="sym_cl" title="Racute">
                            Ŕ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ŕ" className="sym_cl" title="racute">
                            ŕ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ŗ" className="sym_cl" title="Rcedil">
                            Ŗ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ŗ" className="sym_cl" title="rcedil">
                            ŗ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ř" className="sym_cl" title="Rcaron">
                            Ř
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ř" className="sym_cl" title="rcaron">
                            ř
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ś" className="sym_cl" title="Sacute">
                            Ś
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ś" className="sym_cl" title="sacute">
                            ś
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ŝ" className="sym_cl" title="Scirc">
                            Ŝ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ŝ" className="sym_cl" title="scirc">
                            ŝ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ş" className="sym_cl" title="Scedil">
                            Ş
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ş" className="sym_cl" title="scedil">
                            ş
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Š" className="sym_cl" title="Scaron">
                            Š
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="š" className="sym_cl" title="scaron">
                            š
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ţ" className="sym_cl" title="Tcedil">
                            Ţ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ţ" className="sym_cl" title="tcedil">
                            ţ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ť" className="sym_cl" title="Tcaron">
                            Ť
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ť" className="sym_cl" title="tcaron">
                            ť
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ŧ" className="sym_cl" title="Tstrok">
                            Ŧ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ŧ" className="sym_cl" title="tstrok">
                            ŧ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ũ" className="sym_cl" title="Utilde">
                            Ũ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ũ" className="sym_cl" title="utilde">
                            ũ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ū" className="sym_cl" title="Umacr">
                            Ū
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ū" className="sym_cl" title="umacr">
                            ū
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ŭ" className="sym_cl" title="Ubreve">
                            Ŭ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ŭ" className="sym_cl" title="ubreve">
                            ŭ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ů" className="sym_cl" title="Uring">
                            Ů
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ů" className="sym_cl" title="uring">
                            ů
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ű" className="sym_cl" title="Udblac">
                            Ű
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ű" className="sym_cl" title="udblac">
                            ű
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ų" className="sym_cl" title="Uogon">
                            Ų
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ų" className="sym_cl" title="uogon">
                            ų
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ŵ" className="sym_cl" title="Wcirc">
                            Ŵ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ŵ" className="sym_cl" title="wcirc">
                            ŵ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ŷ" className="sym_cl" title="Ycirc">
                            Ŷ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ŷ" className="sym_cl" title="ycirc">
                            ŷ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ÿ" className="sym_cl" title="Yuml">
                            Ÿ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ź" className="sym_cl" title="Zacute">
                            Ź
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ź" className="sym_cl" title="zacute">
                            ź
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ż" className="sym_cl" title="Zdot">
                            Ż
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ż" className="sym_cl" title="zdot">
                            ż
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ž" className="sym_cl" title="Zcaron">
                            Ž
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ž" className="sym_cl" title="zcaron">
                            ž
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ſ" className="sym_cl" title="slong">
                            ſ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ƀ" className="sym_cl" title="bstrok">
                            ƀ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ƒ" className="sym_cl" title="fnof">
                            ƒ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ƕ" className="sym_cl" title="hwair">
                            ƕ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ƙ" className="sym_cl" title="khook">
                            ƙ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ƚ" className="sym_cl" title="lbar">
                            ƚ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ƞ" className="sym_cl" title="nlrleg">
                            ƞ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ʀ" className="sym_cl" title="YR">
                            Ʀ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ƶ" className="sym_cl" title="Zstrok">
                            Ƶ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ƶ" className="sym_cl" title="zstrok">
                            ƶ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ʒ" className="sym_cl" title="EZH">
                            Ʒ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ƿ" className="sym_cl" title="wynn">
                            ƿ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ǣ" className="sym_cl" title="AEligmacr">
                            Ǣ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ǣ" className="sym_cl" title="aeligmacr">
                            ǣ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ǥ" className="sym_cl" title="Gstrok">
                            Ǥ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ǥ" className="sym_cl" title="gstrok">
                            ǥ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ǧ" className="sym_cl" title="gcaron">
                            ǧ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ǫ" className="sym_cl" title="Oogon">
                            Ǫ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ǫ" className="sym_cl" title="oogon">
                            ǫ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ǭ" className="sym_cl" title="Oogonmacr">
                            Ǭ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ǭ" className="sym_cl" title="oogonmacr">
                            ǭ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ǵ" className="sym_cl" title="Gacute">
                            Ǵ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ǵ" className="sym_cl" title="gacute">
                            ǵ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ƕ" className="sym_cl" title="HWAIR">
                            Ƕ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ƿ" className="sym_cl" title="WYNN">
                            Ƿ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ǽ" className="sym_cl" title="AEligacute">
                            Ǽ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ǽ" className="sym_cl" title="aeligacute">
                            ǽ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ǿ" className="sym_cl" title="Oslashacute">
                            Ǿ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ǿ" className="sym_cl" title="oslashacute">
                            ǿ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ȝ" className="sym_cl" title="YOGH">
                            Ȝ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ȝ" className="sym_cl" title="yogh">
                            ȝ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ȧ" className="sym_cl" title="Adot">
                            Ȧ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ȧ" className="sym_cl" title="adot">
                            ȧ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ȯ" className="sym_cl" title="Odot">
                            Ȯ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ȯ" className="sym_cl" title="odot">
                            ȯ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ȳ" className="sym_cl" title="Ymacr">
                            Ȳ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ȳ" className="sym_cl" title="ymacr">
                            ȳ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ȷ" className="sym_cl" title="jnodot">
                            ȷ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ɉ" className="sym_cl" title="Jbar">
                            Ɉ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɉ" className="sym_cl" title="jbar">
                            ɉ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ɔ" className="sym_cl" title="oopen">
                            ɔ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɖ" className="sym_cl" title="dtail">
                            ɖ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɛ" className="sym_cl" title="epsiv">
                            ɛ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɟ" className="sym_cl" title="jnodotstrok">
                            ɟ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɡ" className="sym_cl" title="gopen">
                            ɡ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɢ" className="sym_cl" title="gscap">
                            ɢ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɦ" className="sym_cl" title="hhook">
                            ɦ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɨ" className="sym_cl" title="istrok">
                            ɨ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ɪ" className="sym_cl" title="iscap">
                            ɪ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɲ" className="sym_cl" title="nlfhook">
                            ɲ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɴ" className="sym_cl" title="nscap">
                            ɴ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɶ" className="sym_cl" title="oeligscap">
                            ɶ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ɼ" className="sym_cl" title="rdes">
                            ɼ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʀ" className="sym_cl" title="rscap">
                            ʀ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʉ" className="sym_cl" title="ubar">
                            ʉ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʏ" className="sym_cl" title="yscap">
                            ʏ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ʒ" className="sym_cl" title="ezh">
                            ʒ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʙ" className="sym_cl" title="bscap">
                            ʙ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʜ" className="sym_cl" title="hscap">
                            ʜ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʟ" className="sym_cl" title="lscap">
                            ʟ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ʼ" className="sym_cl" title="apomod">
                            ʼ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ˆ" className="sym_cl" title="circ">
                            ˆ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ˇ" className="sym_cl" title="caron">
                            ˇ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ˈ" className="sym_cl" title="verbarup">
                            ˈ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="˘" className="sym_cl" title="breve">
                            ˘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="˙" className="sym_cl" title="dot">
                            ˙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="˚" className="sym_cl" title="ring">
                            ˚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="˛" className="sym_cl" title="ogon">
                            ˛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="˜" className="sym_cl" title="tilde">
                            ˜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="˝" className="sym_cl" title="dblac">
                            ˝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ˣ" className="sym_cl" title="xmod">
                            ˣ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̀" className="sym_cl" title="combgrave">
                            ̀
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="́" className="sym_cl" title="combacute">
                            ́
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̂" className="sym_cl" title="combcirc">
                            ̂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̃" className="sym_cl" title="combtilde">
                            ̃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̄" className="sym_cl" title="combmacr">
                            ̄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̅" className="sym_cl" title="bar">
                            ̅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̆" className="sym_cl" title="combbreve">
                            ̆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̇" className="sym_cl" title="combdot">
                            ̇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̈" className="sym_cl" title="combuml">
                            ̈
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="̉" className="sym_cl" title="combhook">
                            ̉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̊" className="sym_cl" title="combring">
                            ̊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̋" className="sym_cl" title="combdblac">
                            ̋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̍" className="sym_cl" title="combsgvertl">
                            ̍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̎" className="sym_cl" title="combdbvertl">
                            ̎
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̑" className="sym_cl" title="DownBreve">
                            ̑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̕" className="sym_cl" title="combcomma">
                            ̕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̣" className="sym_cl" title="combdotbl">
                            ̣
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="̧" className="sym_cl" title="combced">
                            ̧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̨" className="sym_cl" title="combogon">
                            ̨
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̳" className="sym_cl" title="dblbarbl">
                            ̳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̶" className="sym_cl" title="baracr">
                            ̶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̾" className="sym_cl" title="combtildevert">
                            ̾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="̿" className="sym_cl" title="dblovl">
                            ̿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="͙" className="sym_cl" title="combastbl">
                            ͙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="͛" className="sym_cl" title="er">
                            ͛
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="͜" className="sym_cl" title="combdblbrevebl">
                            ͜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ͣ" className="sym_cl" title="asup">
                            ͣ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ͤ" className="sym_cl" title="esup">
                            ͤ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ͥ" className="sym_cl" title="isup">
                            ͥ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ͦ" className="sym_cl" title="osup">
                            ͦ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ͧ" className="sym_cl" title="usup">
                            ͧ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ͨ" className="sym_cl" title="csup">
                            ͨ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ͩ" className="sym_cl" title="dsup">
                            ͩ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ͪ" className="sym_cl" title="hsup">
                            ͪ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ͫ" className="sym_cl" title="msup">
                            ͫ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ͬ" className="sym_cl" title="rsup">
                            ͬ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ͭ" className="sym_cl" title="tsup">
                            ͭ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ͮ" className="sym_cl" title="vsup">
                            ͮ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ͯ" className="sym_cl" title="xsup">
                            ͯ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ά" className="sym_cl" title="Aacgr">
                            Ά
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Έ" className="sym_cl" title="Eacgr">
                            Έ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ή" className="sym_cl" title="EEacgr">
                            Ή
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ί" className="sym_cl" title="Iacgr">
                            Ί
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ό" className="sym_cl" title="Oacgr">
                            Ό
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ύ" className="sym_cl" title="Uacgr">
                            Ύ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ώ" className="sym_cl" title="OHacgr">
                            Ώ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ΐ" className="sym_cl" title="idiagr">
                            ΐ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Α" className="sym_cl" title="Agr">
                            Α
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Β" className="sym_cl" title="Bgr">
                            Β
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Γ" className="sym_cl" title="Gamma">
                            Γ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Δ" className="sym_cl" title="Delta">
                            Δ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ε" className="sym_cl" title="Egr">
                            Ε
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ζ" className="sym_cl" title="Zgr">
                            Ζ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Η" className="sym_cl" title="EEgr">
                            Η
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Θ" className="sym_cl" title="Theta">
                            Θ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ι" className="sym_cl" title="Igr">
                            Ι
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Κ" className="sym_cl" title="Kgr">
                            Κ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Λ" className="sym_cl" title="Lambda">
                            Λ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Μ" className="sym_cl" title="Mgr">
                            Μ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ν" className="sym_cl" title="Ngr">
                            Ν
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ξ" className="sym_cl" title="Xi">
                            Ξ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ο" className="sym_cl" title="Ogr">
                            Ο
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Π" className="sym_cl" title="Pi">
                            Π
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ρ" className="sym_cl" title="Rgr">
                            Ρ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Σ" className="sym_cl" title="Sigma">
                            Σ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Τ" className="sym_cl" title="Tgr">
                            Τ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Υ" className="sym_cl" title="Upsilon">
                            Υ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Φ" className="sym_cl" title="Phi">
                            Φ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Χ" className="sym_cl" title="KHgr">
                            Χ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ψ" className="sym_cl" title="Psi">
                            Ψ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ω" className="sym_cl" title="Omega">
                            Ω
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ϊ" className="sym_cl" title="Idigr">
                            Ϊ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ϋ" className="sym_cl" title="Udigr">
                            Ϋ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ά" className="sym_cl" title="aacgr">
                            ά
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="έ" className="sym_cl" title="eacgr">
                            έ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ή" className="sym_cl" title="eeacgr">
                            ή
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ί" className="sym_cl" title="iacgr">
                            ί
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ΰ" className="sym_cl" title="udiagr">
                            ΰ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="α" className="sym_cl" title="alpha">
                            α
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="β" className="sym_cl" title="beta">
                            β
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="γ" className="sym_cl" title="gamma">
                            γ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="δ" className="sym_cl" title="delta">
                            δ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ε" className="sym_cl" title="epsi">
                            ε
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ζ" className="sym_cl" title="zeta">
                            ζ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="η" className="sym_cl" title="eta">
                            η
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="θ" className="sym_cl" title="theta">
                            θ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ι" className="sym_cl" title="iota">
                            ι
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="κ" className="sym_cl" title="kappa">
                            κ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="λ" className="sym_cl" title="lambda">
                            λ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="μ" className="sym_cl" title="mu">
                            μ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ν" className="sym_cl" title="nu">
                            ν
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ξ" className="sym_cl" title="xi">
                            ξ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ο" className="sym_cl" title="omicron">
                            ο
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="π" className="sym_cl" title="pi">
                            π
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ρ" className="sym_cl" title="rho">
                            ρ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ς" className="sym_cl" title="sigmav">
                            ς
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="σ" className="sym_cl" title="sigma">
                            σ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="τ" className="sym_cl" title="tau">
                            τ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="υ" className="sym_cl" title="upsi">
                            υ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="φ" className="sym_cl" title="phi">
                            φ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="χ" className="sym_cl" title="chi">
                            χ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ψ" className="sym_cl" title="psi">
                            ψ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ω" className="sym_cl" title="omega">
                            ω
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ϊ" className="sym_cl" title="idigr">
                            ϊ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ϋ" className="sym_cl" title="udigr">
                            ϋ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ό" className="sym_cl" title="oacgr">
                            ό
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ύ" className="sym_cl" title="uacgr">
                            ύ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ώ" className="sym_cl" title="ohacgr">
                            ώ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ϑ" className="sym_cl" title="thetav">
                            ϑ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ϒ" className="sym_cl" title="Upsi">
                            ϒ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ϕ" className="sym_cl" title="phi">
                            ϕ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ϖ" className="sym_cl" title="piv">
                            ϖ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ϝ" className="sym_cl" title="Gammad">
                            Ϝ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ϝ" className="sym_cl" title="gammad">
                            ϝ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ϰ" className="sym_cl" title="kappav">
                            ϰ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ϱ" className="sym_cl" title="rhov">
                            ϱ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ϵ" className="sym_cl" title="epsi">
                            ϵ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="϶" className="sym_cl" title="bepsi">
                            ϶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ё" className="sym_cl" title="IOcy">
                            Ё
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ђ" className="sym_cl" title="DJcy">
                            Ђ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ѓ" className="sym_cl" title="GJcy">
                            Ѓ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Є" className="sym_cl" title="Jukcy">
                            Є
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ѕ" className="sym_cl" title="DScy">
                            Ѕ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="І" className="sym_cl" title="Iukcy">
                            І
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ї" className="sym_cl" title="YIcy">
                            Ї
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ј" className="sym_cl" title="Jsercy">
                            Ј
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Љ" className="sym_cl" title="LJcy">
                            Љ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Њ" className="sym_cl" title="NJcy">
                            Њ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ћ" className="sym_cl" title="TSHcy">
                            Ћ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ќ" className="sym_cl" title="KJcy">
                            Ќ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ў" className="sym_cl" title="Ubrcy">
                            Ў
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Џ" className="sym_cl" title="DZcy">
                            Џ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="А" className="sym_cl" title="Acy">
                            А
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Б" className="sym_cl" title="Bcy">
                            Б
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="В" className="sym_cl" title="Vcy">
                            В
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Г" className="sym_cl" title="Gcy">
                            Г
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Д" className="sym_cl" title="Dcy">
                            Д
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Е" className="sym_cl" title="IEcy">
                            Е
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ж" className="sym_cl" title="ZHcy">
                            Ж
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="З" className="sym_cl" title="Zcy">
                            З
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="И" className="sym_cl" title="Icy">
                            И
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Й" className="sym_cl" title="Jcy">
                            Й
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="К" className="sym_cl" title="Kcy">
                            К
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Л" className="sym_cl" title="Lcy">
                            Л
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="М" className="sym_cl" title="Mcy">
                            М
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Н" className="sym_cl" title="Ncy">
                            Н
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="О" className="sym_cl" title="Ocy">
                            О
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="П" className="sym_cl" title="Pcy">
                            П
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Р" className="sym_cl" title="Rcy">
                            Р
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="С" className="sym_cl" title="Scy">
                            С
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Т" className="sym_cl" title="Tcy">
                            Т
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="У" className="sym_cl" title="Ucy">
                            У
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ф" className="sym_cl" title="Fcy">
                            Ф
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Х" className="sym_cl" title="KHcy">
                            Х
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ц" className="sym_cl" title="TScy">
                            Ц
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ч" className="sym_cl" title="CHcy">
                            Ч
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ш" className="sym_cl" title="SHcy">
                            Ш
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Щ" className="sym_cl" title="SHCHcy">
                            Щ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ъ" className="sym_cl" title="HARDcy">
                            Ъ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ы" className="sym_cl" title="Ycy">
                            Ы
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ь" className="sym_cl" title="SOFTcy">
                            Ь
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Э" className="sym_cl" title="Ecy">
                            Э
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ю" className="sym_cl" title="YUcy">
                            Ю
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Я" className="sym_cl" title="YAcy">
                            Я
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="а" className="sym_cl" title="acy">
                            а
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="б" className="sym_cl" title="bcy">
                            б
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="в" className="sym_cl" title="vcy">
                            в
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="г" className="sym_cl" title="gcy">
                            г
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="д" className="sym_cl" title="dcy">
                            д
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="е" className="sym_cl" title="iecy">
                            е
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ж" className="sym_cl" title="zhcy">
                            ж
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="з" className="sym_cl" title="zcy">
                            з
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="и" className="sym_cl" title="icy">
                            и
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="й" className="sym_cl" title="jcy">
                            й
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="к" className="sym_cl" title="kcy">
                            к
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="л" className="sym_cl" title="lcy">
                            л
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="м" className="sym_cl" title="mcy">
                            м
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="н" className="sym_cl" title="ncy">
                            н
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="о" className="sym_cl" title="ocy">
                            о
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="п" className="sym_cl" title="pcy">
                            п
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="р" className="sym_cl" title="rcy">
                            р
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="с" className="sym_cl" title="scy">
                            с
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="т" className="sym_cl" title="tcy">
                            т
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="у" className="sym_cl" title="ucy">
                            у
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ф" className="sym_cl" title="fcy">
                            ф
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="х" className="sym_cl" title="khcy">
                            х
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ц" className="sym_cl" title="tscy">
                            ц
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ч" className="sym_cl" title="chcy">
                            ч
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ш" className="sym_cl" title="shcy">
                            ш
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="щ" className="sym_cl" title="shchcy">
                            щ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ъ" className="sym_cl" title="hardcy">
                            ъ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ы" className="sym_cl" title="ycy">
                            ы
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ь" className="sym_cl" title="softcy">
                            ь
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="э" className="sym_cl" title="ecy">
                            э
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ю" className="sym_cl" title="yucy">
                            ю
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="я" className="sym_cl" title="yacy">
                            я
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ё" className="sym_cl" title="iocy">
                            ё
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ђ" className="sym_cl" title="djcy">
                            ђ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ѓ" className="sym_cl" title="gjcy">
                            ѓ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="є" className="sym_cl" title="jukcy">
                            є
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ѕ" className="sym_cl" title="dscy">
                            ѕ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="і" className="sym_cl" title="iukcy">
                            і
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ї" className="sym_cl" title="yicy">
                            ї
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ј" className="sym_cl" title="jsercy">
                            ј
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="љ" className="sym_cl" title="ljcy">
                            љ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="њ" className="sym_cl" title="njcy">
                            њ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ћ" className="sym_cl" title="tshcy">
                            ћ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ќ" className="sym_cl" title="kjcy">
                            ќ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ў" className="sym_cl" title="ubrcy">
                            ў
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="џ" className="sym_cl" title="dzcy">
                            џ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ḿ" className="sym_cl" title="Macute">
                            Ḿ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ḿ" className="sym_cl" title="macute">
                            ḿ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ẃ" className="sym_cl" title="Wacute">
                            Ẃ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ẃ" className="sym_cl" title="wacute">
                            ẃ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ẅ" className="sym_cl" title="Wuml">
                            Ẅ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ẅ" className="sym_cl" title="wuml">
                            ẅ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ạ" className="sym_cl" title="Adotbl">
                            Ạ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ạ" className="sym_cl" title="adotbl">
                            ạ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ả" className="sym_cl" title="Ahook">
                            Ả
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ả" className="sym_cl" title="ahook">
                            ả
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ắ" className="sym_cl" title="Abreveacute">
                            Ắ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ắ" className="sym_cl" title="abreveacute">
                            ắ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ẹ" className="sym_cl" title="Edotbl">
                            Ẹ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ẹ" className="sym_cl" title="edotbl">
                            ẹ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ỉ" className="sym_cl" title="Ihook">
                            Ỉ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ỉ" className="sym_cl" title="ihook">
                            ỉ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ị" className="sym_cl" title="Idotbl">
                            Ị
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ị" className="sym_cl" title="idotbl">
                            ị
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ọ" className="sym_cl" title="Odotbl">
                            Ọ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ọ" className="sym_cl" title="odotbl">
                            ọ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ỏ" className="sym_cl" title="Ohook">
                            Ỏ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ỏ" className="sym_cl" title="ohook">
                            ỏ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ụ" className="sym_cl" title="Udotbl">
                            Ụ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ụ" className="sym_cl" title="udotbl">
                            ụ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ủ" className="sym_cl" title="Uhook">
                            Ủ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ủ" className="sym_cl" title="uhook">
                            ủ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ỵ" className="sym_cl" title="Ydotbl">
                            Ỵ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ỵ" className="sym_cl" title="ydotbl">
                            ỵ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ỷ" className="sym_cl" title="Yhook">
                            Ỷ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ỷ" className="sym_cl" title="yhook">
                            ỷ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‖" className="sym_cl" title="Vert">
                            ‖
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="†" className="sym_cl" title="dagger">
                            †
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‡" className="sym_cl" title="Dagger">
                            ‡
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="•" className="sym_cl" title="bull">
                            •
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‣" className="sym_cl" title="tribull">
                            ‣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="․" className="sym_cl" title="sgldr">
                            ․
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‥" className="sym_cl" title="nldr">
                            ‥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="…" className="sym_cl" title="hellip">
                            …
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‧" className="sym_cl" title="hyphpoint">
                            ‧
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="‰" className="sym_cl" title="permil">
                            ‰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‱" className="sym_cl" title="pertenk">
                            ‱
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="′" className="sym_cl" title="prime">
                            ′
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="″" className="sym_cl" title="Prime">
                            ″
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‴" className="sym_cl" title="tprime">
                            ‴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‵" className="sym_cl" title="bprime">
                            ‵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="‹" className="sym_cl" title="lsaquo">
                            ‹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="›" className="sym_cl" title="rsaquo">
                            ›
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="※" className="sym_cl" title="refmark">
                            ※
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⁁" className="sym_cl" title="caret">
                            ⁁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⁂" className="sym_cl" title="triast">
                            ⁂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⁃" className="sym_cl" title="hybull">
                            ⁃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⁄" className="sym_cl" title="fracsol">
                            ⁄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⁅" className="sym_cl" title="lsqbqu">
                            ⁅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⁆" className="sym_cl" title="rsqbqu">
                            ⁆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⁰" className="sym_cl" title="sup0">
                            ⁰
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="₣" className="sym_cl" title="franc">
                            ₣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="€" className="sym_cl" title="euro">
                            €
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="₰" className="sym_cl" title="pennygerm">
                            ₰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℂ" className="sym_cl" title="Copf">
                            ℂ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="℅" className="sym_cl" title="incare">
                            ℅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="℈" className="sym_cl" title="scruple">
                            ℈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℊ" className="sym_cl" title="gscr">
                            ℊ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℋ" className="sym_cl" title="hamilt">
                            ℋ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ℌ" className="sym_cl" title="Poincareplane">
                            ℌ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℍ" className="sym_cl" title="quaternions">
                            ℍ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℎ" className="sym_cl" title="planckh">
                            ℎ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℏ" className="sym_cl" title="hbar">
                            ℏ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℐ" className="sym_cl" title="imagline">
                            ℐ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℑ" className="sym_cl" title="image">
                            ℑ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℒ" className="sym_cl" title="lagran">
                            ℒ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℓ" className="sym_cl" title="ell">
                            ℓ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="℔" className="sym_cl" title="lbbar">
                            ℔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℕ" className="sym_cl" title="naturals">
                            ℕ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="№" className="sym_cl" title="numero">
                            №
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="℗" className="sym_cl" title="copysr">
                            ℗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="℘" className="sym_cl" title="weierp">
                            ℘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℙ" className="sym_cl" title="primes">
                            ℙ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℚ" className="sym_cl" title="rationals">
                            ℚ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℛ" className="sym_cl" title="realine">
                            ℛ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ℜ" className="sym_cl" title="real">
                            ℜ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℝ" className="sym_cl" title="reals">
                            ℝ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="℞" className="sym_cl" title="rx">
                            ℞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="℟" className="sym_cl" title="Rslstrok">
                            ℟
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="™" className="sym_cl" title="trade">
                            ™
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="℣" className="sym_cl" title="Vslstrok">
                            ℣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℤ" className="sym_cl" title="integers">
                            ℤ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="℥" className="sym_cl" title="ounce">
                            ℥
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ω" className="sym_cl" title="ohm">
                            Ω
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="℧" className="sym_cl" title="mho">
                            ℧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℨ" className="sym_cl" title="zeetrf">
                            ℨ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="℩" className="sym_cl" title="iiota">
                            ℩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Å" className="sym_cl" title="angst">
                            Å
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℬ" className="sym_cl" title="bernou">
                            ℬ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℭ" className="sym_cl" title="Cayleys">
                            ℭ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℯ" className="sym_cl" title="escr">
                            ℯ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ℰ" className="sym_cl" title="expectation">
                            ℰ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℱ" className="sym_cl" title="Fouriertrf">
                            ℱ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ⅎ" className="sym_cl" title="Fturn">
                            Ⅎ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℳ" className="sym_cl" title="Mellintrf">
                            ℳ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℴ" className="sym_cl" title="order">
                            ℴ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℵ" className="sym_cl" title="aleph">
                            ℵ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℶ" className="sym_cl" title="beth">
                            ℶ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ℷ" className="sym_cl" title="gimel">
                            ℷ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ℸ" className="sym_cl" title="daleth">
                            ℸ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⅓" className="sym_cl" title="frac13">
                            ⅓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⅔" className="sym_cl" title="frac23">
                            ⅔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⅕" className="sym_cl" title="frac15">
                            ⅕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⅖" className="sym_cl" title="frac25">
                            ⅖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⅗" className="sym_cl" title="frac35">
                            ⅗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⅘" className="sym_cl" title="frac45">
                            ⅘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⅙" className="sym_cl" title="frac16">
                            ⅙
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⅚" className="sym_cl" title="frac56">
                            ⅚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⅛" className="sym_cl" title="frac18">
                            ⅛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⅜" className="sym_cl" title="frac38">
                            ⅜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⅝" className="sym_cl" title="frac58">
                            ⅝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⅞" className="sym_cl" title="frac78">
                            ⅞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ↀ" className="sym_cl" title="romnumCDlig">
                            ↀ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ↁ" className="sym_cl" title="romnumDDlig">
                            ↁ
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="ↂ"
                            className="sym_cl"
                            title="romnumDDdbllig"
                          >
                            ↂ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="←" className="sym_cl" title="larr">
                            ←
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↑" className="sym_cl" title="uarr">
                            ↑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="→" className="sym_cl" title="rarr">
                            →
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↓" className="sym_cl" title="darr">
                            ↓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↔" className="sym_cl" title="harr">
                            ↔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↕" className="sym_cl" title="varr">
                            ↕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↖" className="sym_cl" title="nwarr">
                            ↖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↗" className="sym_cl" title="nearr">
                            ↗
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="↘" className="sym_cl" title="searr">
                            ↘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↙" className="sym_cl" title="swarr">
                            ↙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↚" className="sym_cl" title="nlarr">
                            ↚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↛" className="sym_cl" title="nrarr">
                            ↛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↝" className="sym_cl" title="rarrw">
                            ↝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↞" className="sym_cl" title="Larr">
                            ↞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↟" className="sym_cl" title="Uarr">
                            ↟
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↠" className="sym_cl" title="Rarr">
                            ↠
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="↡" className="sym_cl" title="Darr">
                            ↡
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↢" className="sym_cl" title="larrtl">
                            ↢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↣" className="sym_cl" title="rarrtl">
                            ↣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↤" className="sym_cl" title="mapstoleft">
                            ↤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↥" className="sym_cl" title="mapstoup">
                            ↥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↦" className="sym_cl" title="map">
                            ↦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↧" className="sym_cl" title="mapstodown">
                            ↧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↩" className="sym_cl" title="larrhk">
                            ↩
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="↪" className="sym_cl" title="rarrhk">
                            ↪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↫" className="sym_cl" title="larrlp">
                            ↫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↬" className="sym_cl" title="rarrlp">
                            ↬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↭" className="sym_cl" title="harrw">
                            ↭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↮" className="sym_cl" title="nharr">
                            ↮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↰" className="sym_cl" title="lsh">
                            ↰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↱" className="sym_cl" title="rsh">
                            ↱
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↲" className="sym_cl" title="ldsh">
                            ↲
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="↳" className="sym_cl" title="rdsh">
                            ↳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↶" className="sym_cl" title="cularr">
                            ↶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↷" className="sym_cl" title="curarr">
                            ↷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↺" className="sym_cl" title="olarr">
                            ↺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↻" className="sym_cl" title="orarr">
                            ↻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↼" className="sym_cl" title="lharu">
                            ↼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↽" className="sym_cl" title="lhard">
                            ↽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="↾" className="sym_cl" title="uharr">
                            ↾
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="↿" className="sym_cl" title="uharl">
                            ↿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇀" className="sym_cl" title="rharu">
                            ⇀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇁" className="sym_cl" title="rhard">
                            ⇁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇂" className="sym_cl" title="dharr">
                            ⇂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇃" className="sym_cl" title="dharl">
                            ⇃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇄" className="sym_cl" title="rlarr">
                            ⇄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇅" className="sym_cl" title="udarr">
                            ⇅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇆" className="sym_cl" title="lrarr">
                            ⇆
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⇇" className="sym_cl" title="llarr">
                            ⇇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇈" className="sym_cl" title="uuarr">
                            ⇈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇉" className="sym_cl" title="rrarr">
                            ⇉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇊" className="sym_cl" title="ddarr">
                            ⇊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇋" className="sym_cl" title="lrhar">
                            ⇋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇌" className="sym_cl" title="rlhar">
                            ⇌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇍" className="sym_cl" title="nlArr">
                            ⇍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇎" className="sym_cl" title="nhArr">
                            ⇎
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⇏" className="sym_cl" title="nrArr">
                            ⇏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇐" className="sym_cl" title="lArr">
                            ⇐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇑" className="sym_cl" title="uArr">
                            ⇑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇒" className="sym_cl" title="rArr">
                            ⇒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇓" className="sym_cl" title="dArr">
                            ⇓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇔" className="sym_cl" title="hArr">
                            ⇔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇕" className="sym_cl" title="vArr">
                            ⇕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇖" className="sym_cl" title="nwArr">
                            ⇖
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⇗" className="sym_cl" title="neArr">
                            ⇗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇘" className="sym_cl" title="seArr">
                            ⇘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇙" className="sym_cl" title="swArr">
                            ⇙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇚" className="sym_cl" title="lAarr">
                            ⇚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇛" className="sym_cl" title="rAarr">
                            ⇛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇝" className="sym_cl" title="zigrarr">
                            ⇝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇤" className="sym_cl" title="larrb">
                            ⇤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇥" className="sym_cl" title="rarrb">
                            ⇥
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∀" className="sym_cl" title="forall">
                            ∀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∁" className="sym_cl" title="comp">
                            ∁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∂" className="sym_cl" title="part">
                            ∂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∃" className="sym_cl" title="exist">
                            ∃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∄" className="sym_cl" title="nexist">
                            ∄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∅" className="sym_cl" title="empty">
                            ∅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∇" className="sym_cl" title="nabla">
                            ∇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∈" className="sym_cl" title="in">
                            ∈
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∉" className="sym_cl" title="notin">
                            ∉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∊" className="sym_cl" title="epsi">
                            ∊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∋" className="sym_cl" title="ni">
                            ∋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∌" className="sym_cl" title="notni">
                            ∌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∍" className="sym_cl" title="bepsi">
                            ∍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∏" className="sym_cl" title="prod">
                            ∏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∐" className="sym_cl" title="coprod">
                            ∐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∑" className="sym_cl" title="sum">
                            ∑
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="−" className="sym_cl" title="minus">
                            −
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∓" className="sym_cl" title="mp">
                            ∓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∔" className="sym_cl" title="dotplus">
                            ∔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∖" className="sym_cl" title="setminus">
                            ∖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∗" className="sym_cl" title="lowast">
                            ∗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∘" className="sym_cl" title="compfn">
                            ∘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="√" className="sym_cl" title="Sqrt">
                            √
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∝" className="sym_cl" title="prop">
                            ∝
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∞" className="sym_cl" title="infin">
                            ∞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∟" className="sym_cl" title="angrt">
                            ∟
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∠" className="sym_cl" title="ang">
                            ∠
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∡" className="sym_cl" title="angmsd">
                            ∡
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∢" className="sym_cl" title="angsph">
                            ∢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∣" className="sym_cl" title="mid">
                            ∣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∤" className="sym_cl" title="nmid">
                            ∤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∥" className="sym_cl" title="par">
                            ∥
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∦" className="sym_cl" title="npar">
                            ∦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∧" className="sym_cl" title="and">
                            ∧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∨" className="sym_cl" title="or">
                            ∨
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∩" className="sym_cl" title="cap">
                            ∩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∪" className="sym_cl" title="cup">
                            ∪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∫" className="sym_cl" title="int">
                            ∫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∬" className="sym_cl" title="Int">
                            ∬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∭" className="sym_cl" title="tint">
                            ∭
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∮" className="sym_cl" title="oint">
                            ∮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∯" className="sym_cl" title="Conint">
                            ∯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∰" className="sym_cl" title="Cconint">
                            ∰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∱" className="sym_cl" title="cwint">
                            ∱
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∲" className="sym_cl" title="cwconint">
                            ∲
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∳" className="sym_cl" title="awconint">
                            ∳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∴" className="sym_cl" title="there4">
                            ∴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∵" className="sym_cl" title="becaus">
                            ∵
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∶" className="sym_cl" title="ratio">
                            ∶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∷" className="sym_cl" title="quaddot">
                            ∷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∸" className="sym_cl" title="dotminus">
                            ∸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∺" className="sym_cl" title="mDDot">
                            ∺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∻" className="sym_cl" title="est">
                            ∻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∼" className="sym_cl" title="sim">
                            ∼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∽" className="sym_cl" title="bsim">
                            ∽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="∾" className="sym_cl" title="ac">
                            ∾
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="∿" className="sym_cl" title="acd">
                            ∿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≀" className="sym_cl" title="wr">
                            ≀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≁" className="sym_cl" title="nsim">
                            ≁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≂" className="sym_cl" title="esim">
                            ≂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≃" className="sym_cl" title="sime">
                            ≃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≄" className="sym_cl" title="nsime">
                            ≄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≅" className="sym_cl" title="cong">
                            ≅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≆" className="sym_cl" title="simne">
                            ≆
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≇" className="sym_cl" title="ncong">
                            ≇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≈" className="sym_cl" title="ap">
                            ≈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≉" className="sym_cl" title="nap">
                            ≉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≊" className="sym_cl" title="ape">
                            ≊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≋" className="sym_cl" title="apid">
                            ≋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≌" className="sym_cl" title="bcong">
                            ≌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≍" className="sym_cl" title="asymp">
                            ≍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≎" className="sym_cl" title="bump">
                            ≎
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≏" className="sym_cl" title="bumpe">
                            ≏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≐" className="sym_cl" title="doteq">
                            ≐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≑" className="sym_cl" title="eDot">
                            ≑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≒" className="sym_cl" title="efDot">
                            ≒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≓" className="sym_cl" title="erDot">
                            ≓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≔" className="sym_cl" title="colone">
                            ≔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≕" className="sym_cl" title="ecolon">
                            ≕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≖" className="sym_cl" title="ecir">
                            ≖
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≗" className="sym_cl" title="cire">
                            ≗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≙" className="sym_cl" title="wedgeq">
                            ≙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≚" className="sym_cl" title="veeeq">
                            ≚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≛" className="sym_cl" title="easter">
                            ≛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≜" className="sym_cl" title="trie">
                            ≜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≟" className="sym_cl" title="equest">
                            ≟
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≠" className="sym_cl" title="ne">
                            ≠
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≡" className="sym_cl" title="equiv">
                            ≡
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≢" className="sym_cl" title="nequiv">
                            ≢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≤" className="sym_cl" title="le">
                            ≤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≥" className="sym_cl" title="ge">
                            ≥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≦" className="sym_cl" title="leqq">
                            ≦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≧" className="sym_cl" title="geqq">
                            ≧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≨" className="sym_cl" title="lne">
                            ≨
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≩" className="sym_cl" title="gne">
                            ≩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≪" className="sym_cl" title="ll">
                            ≪
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≫" className="sym_cl" title="gg">
                            ≫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≬" className="sym_cl" title="twixt">
                            ≬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≭" className="sym_cl" title="NotCupCap">
                            ≭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≮" className="sym_cl" title="nlt">
                            ≮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≯" className="sym_cl" title="ngt">
                            ≯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≰" className="sym_cl" title="nle">
                            ≰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≱" className="sym_cl" title="nge">
                            ≱
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≲" className="sym_cl" title="lap">
                            ≲
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≳" className="sym_cl" title="gap">
                            ≳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≴" className="sym_cl" title="nlsim">
                            ≴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≵" className="sym_cl" title="ngsim">
                            ≵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≶" className="sym_cl" title="lg">
                            ≶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≷" className="sym_cl" title="gl">
                            ≷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≸" className="sym_cl" title="ntlg">
                            ≸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≹" className="sym_cl" title="ntgl">
                            ≹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≺" className="sym_cl" title="pr">
                            ≺
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="≻" className="sym_cl" title="sc">
                            ≻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≼" className="sym_cl" title="pre">
                            ≼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≽" className="sym_cl" title="sce">
                            ≽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≾" className="sym_cl" title="prap">
                            ≾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≿" className="sym_cl" title="scap">
                            ≿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊀" className="sym_cl" title="npr">
                            ⊀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊁" className="sym_cl" title="nsc">
                            ⊁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊂" className="sym_cl" title="sub">
                            ⊂
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊃" className="sym_cl" title="sup">
                            ⊃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊄" className="sym_cl" title="nsub">
                            ⊄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊅" className="sym_cl" title="nsup">
                            ⊅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊆" className="sym_cl" title="sube">
                            ⊆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊇" className="sym_cl" title="supe">
                            ⊇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊈" className="sym_cl" title="nsube">
                            ⊈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊉" className="sym_cl" title="nsupe">
                            ⊉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊊" className="sym_cl" title="subne">
                            ⊊
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊋" className="sym_cl" title="supne">
                            ⊋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊍" className="sym_cl" title="cupdot">
                            ⊍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊎" className="sym_cl" title="uplus">
                            ⊎
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊏" className="sym_cl" title="sqsub">
                            ⊏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊐" className="sym_cl" title="sqsup">
                            ⊐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊑" className="sym_cl" title="sqsube">
                            ⊑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊒" className="sym_cl" title="sqsupe">
                            ⊒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊓" className="sym_cl" title="sqcap">
                            ⊓
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊔" className="sym_cl" title="sqcup">
                            ⊔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊕" className="sym_cl" title="oplus">
                            ⊕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊖" className="sym_cl" title="ominus">
                            ⊖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊗" className="sym_cl" title="otimes">
                            ⊗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊘" className="sym_cl" title="osol">
                            ⊘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊙" className="sym_cl" title="odot">
                            ⊙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊚" className="sym_cl" title="ocir">
                            ⊚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊛" className="sym_cl" title="oast">
                            ⊛
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊝" className="sym_cl" title="odash">
                            ⊝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊞" className="sym_cl" title="plusb">
                            ⊞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊟" className="sym_cl" title="minusb">
                            ⊟
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊠" className="sym_cl" title="timesb">
                            ⊠
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊡" className="sym_cl" title="sdotb">
                            ⊡
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊢" className="sym_cl" title="vdash">
                            ⊢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊣" className="sym_cl" title="dashv">
                            ⊣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊤" className="sym_cl" title="top">
                            ⊤
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊥" className="sym_cl" title="bot">
                            ⊥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊧" className="sym_cl" title="models">
                            ⊧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊨" className="sym_cl" title="vDash">
                            ⊨
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊩" className="sym_cl" title="Vdash">
                            ⊩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊪" className="sym_cl" title="Vvdash">
                            ⊪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊫" className="sym_cl" title="VDash">
                            ⊫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊬" className="sym_cl" title="nvdash">
                            ⊬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊭" className="sym_cl" title="nvDash">
                            ⊭
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊮" className="sym_cl" title="nVdash">
                            ⊮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊯" className="sym_cl" title="nVDash">
                            ⊯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊰" className="sym_cl" title="prurel">
                            ⊰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊲" className="sym_cl" title="vltri">
                            ⊲
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊳" className="sym_cl" title="vrtri">
                            ⊳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊴" className="sym_cl" title="ltrie">
                            ⊴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊵" className="sym_cl" title="rtrie">
                            ⊵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊶" className="sym_cl" title="origof">
                            ⊶
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊷" className="sym_cl" title="imof">
                            ⊷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊸" className="sym_cl" title="mumap">
                            ⊸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊹" className="sym_cl" title="hercon">
                            ⊹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊺" className="sym_cl" title="intcal">
                            ⊺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊻" className="sym_cl" title="veebar">
                            ⊻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊼" className="sym_cl" title="barwed">
                            ⊼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊽" className="sym_cl" title="barvee">
                            ⊽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⊾" className="sym_cl" title="vangrt">
                            ⊾
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⊿" className="sym_cl" title="lrtri">
                            ⊿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋀" className="sym_cl" title="Wedge">
                            ⋀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋁" className="sym_cl" title="Vee">
                            ⋁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋂" className="sym_cl" title="xcap">
                            ⋂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋃" className="sym_cl" title="xcup">
                            ⋃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋄" className="sym_cl" title="diam">
                            ⋄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋅" className="sym_cl" title="sdot">
                            ⋅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋆" className="sym_cl" title="star">
                            ⋆
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋇" className="sym_cl" title="divonx">
                            ⋇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋈" className="sym_cl" title="bowtie">
                            ⋈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋉" className="sym_cl" title="ltimes">
                            ⋉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋊" className="sym_cl" title="rtimes">
                            ⋊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋋" className="sym_cl" title="lthree">
                            ⋋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋌" className="sym_cl" title="rthree">
                            ⋌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋍" className="sym_cl" title="bsime">
                            ⋍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋎" className="sym_cl" title="cuvee">
                            ⋎
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋏" className="sym_cl" title="cuwed">
                            ⋏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋐" className="sym_cl" title="Sub">
                            ⋐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋑" className="sym_cl" title="Sup">
                            ⋑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋒" className="sym_cl" title="Cap">
                            ⋒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋓" className="sym_cl" title="Cup">
                            ⋓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋔" className="sym_cl" title="fork">
                            ⋔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋕" className="sym_cl" title="epar">
                            ⋕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋖" className="sym_cl" title="ltdot">
                            ⋖
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋗" className="sym_cl" title="gtdot">
                            ⋗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋘" className="sym_cl" title="Ll">
                            ⋘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋙" className="sym_cl" title="Gg">
                            ⋙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋚" className="sym_cl" title="leg">
                            ⋚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋛" className="sym_cl" title="gel">
                            ⋛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋜" className="sym_cl" title="els">
                            ⋜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋝" className="sym_cl" title="egs">
                            ⋝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋞" className="sym_cl" title="cuepr">
                            ⋞
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋟" className="sym_cl" title="cuesc">
                            ⋟
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋠" className="sym_cl" title="npre">
                            ⋠
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋡" className="sym_cl" title="nsce">
                            ⋡
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋢" className="sym_cl" title="nsqsube">
                            ⋢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋣" className="sym_cl" title="nsqsupe">
                            ⋣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋦" className="sym_cl" title="lnsim">
                            ⋦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋧" className="sym_cl" title="gnsim">
                            ⋧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋨" className="sym_cl" title="prnap">
                            ⋨
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋩" className="sym_cl" title="scnap">
                            ⋩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋪" className="sym_cl" title="nltri">
                            ⋪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋫" className="sym_cl" title="nrtri">
                            ⋫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋬" className="sym_cl" title="nltrie">
                            ⋬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋭" className="sym_cl" title="nrtrie">
                            ⋭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋮" className="sym_cl" title="vellip">
                            ⋮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋯" className="sym_cl" title="ctdot">
                            ⋯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋰" className="sym_cl" title="utdot">
                            ⋰
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋱" className="sym_cl" title="dtdot">
                            ⋱
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌅" className="sym_cl" title="barwed">
                            ⌅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌆" className="sym_cl" title="Barwed">
                            ⌆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌐" className="sym_cl" title="bnot">
                            ⌐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌒" className="sym_cl" title="profline">
                            ⌒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="␣" className="sym_cl" title="blank">
                            ␣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ⓢ" className="sym_cl" title="oS">
                            Ⓢ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="─" className="sym_cl" title="boxh">
                            ─
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="│" className="sym_cl" title="boxv">
                            │
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="┌" className="sym_cl" title="boxdr">
                            ┌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="┐" className="sym_cl" title="boxdl">
                            ┐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="└" className="sym_cl" title="boxur">
                            └
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="┘" className="sym_cl" title="boxul">
                            ┘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="├" className="sym_cl" title="boxvr">
                            ├
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="┤" className="sym_cl" title="boxvl">
                            ┤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="┬" className="sym_cl" title="boxhd">
                            ┬
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="┴" className="sym_cl" title="boxhu">
                            ┴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="═" className="sym_cl" title="boxH">
                            ═
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="║" className="sym_cl" title="boxV">
                            ║
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╒" className="sym_cl" title="boxdR">
                            ╒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╓" className="sym_cl" title="boxDr">
                            ╓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╔" className="sym_cl" title="boxdR">
                            ╔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╕" className="sym_cl" title="boxdL">
                            ╕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╖" className="sym_cl" title="boxdL">
                            ╖
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="╗" className="sym_cl" title="boxDl">
                            ╗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╘" className="sym_cl" title="boxuR">
                            ╘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╙" className="sym_cl" title="boxuR">
                            ╙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╚" className="sym_cl" title="boxUr">
                            ╚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╛" className="sym_cl" title="boxuL">
                            ╛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╜" className="sym_cl" title="boxUl">
                            ╜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╝" className="sym_cl" title="boxuL">
                            ╝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╞" className="sym_cl" title="boxvR">
                            ╞
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="╟" className="sym_cl" title="boxVr">
                            ╟
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╠" className="sym_cl" title="boxVr">
                            ╠
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╡" className="sym_cl" title="boxvL">
                            ╡
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╢" className="sym_cl" title="boxVl">
                            ╢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╣" className="sym_cl" title="boxVL">
                            ╣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╤" className="sym_cl" title="boxhD">
                            ╤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╥" className="sym_cl" title="boxHD">
                            ╥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╦" className="sym_cl" title="boxHd">
                            ╦
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="╧" className="sym_cl" title="boxHu">
                            ╧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╨" className="sym_cl" title="boxhU">
                            ╨
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╩" className="sym_cl" title="boxHU">
                            ╩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╪" className="sym_cl" title="boxvH">
                            ╪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╫" className="sym_cl" title="boxVh">
                            ╫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="╬" className="sym_cl" title="boxVH">
                            ╬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="▀" className="sym_cl" title="uhblk">
                            ▀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="▄" className="sym_cl" title="lhblk">
                            ▄
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="█" className="sym_cl" title="block">
                            █
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="░" className="sym_cl" title="blk14">
                            ░
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="▒" className="sym_cl" title="blk12">
                            ▒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="▓" className="sym_cl" title="blk34">
                            ▓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="▪" className="sym_cl" title="squf">
                            ▪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="▫" className="sym_cl" title="squarewhsm">
                            ▫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="▭" className="sym_cl" title="rect">
                            ▭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="▮" className="sym_cl" title="marker">
                            ▮
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="▱" className="sym_cl" title="fltns">
                            ▱
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="△" className="sym_cl" title="xutri">
                            △
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="▴" className="sym_cl" title="utrif">
                            ▴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="▵" className="sym_cl" title="utri">
                            ▵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="▸" className="sym_cl" title="rtrif">
                            ▸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="▹" className="sym_cl" title="rtri">
                            ▹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="▽" className="sym_cl" title="xdtri">
                            ▽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="▾" className="sym_cl" title="dtrif">
                            ▾
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="▿" className="sym_cl" title="dtri">
                            ▿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="◂" className="sym_cl" title="ltrif">
                            ◂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="◃" className="sym_cl" title="ltri">
                            ◃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="◊" className="sym_cl" title="loz">
                            ◊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="○" className="sym_cl" title="cir">
                            ○
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="◌" className="sym_cl" title="circledot">
                            ◌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="◬" className="sym_cl" title="tridot">
                            ◬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="◯" className="sym_cl" title="xcirc">
                            ◯
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="◸" className="sym_cl" title="ultri">
                            ◸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="◹" className="sym_cl" title="urtri">
                            ◹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="◺" className="sym_cl" title="lltri">
                            ◺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="★" className="sym_cl" title="starf">
                            ★
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="☆" className="sym_cl" title="star">
                            ☆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="☎" className="sym_cl" title="phone">
                            ☎
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="♀" className="sym_cl" title="female">
                            ♀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="♂" className="sym_cl" title="male">
                            ♂
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="♠" className="sym_cl" title="spades">
                            ♠
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="♡" className="sym_cl" title="heartsuit">
                            ♡
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="♣" className="sym_cl" title="clubs">
                            ♣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="♥" className="sym_cl" title="hearts">
                            ♥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="♦" className="sym_cl" title="diams">
                            ♦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="♩" className="sym_cl" title="sung">
                            ♩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="♪" className="sym_cl" title="sung">
                            ♪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="♭" className="sym_cl" title="flat">
                            ♭
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="♮" className="sym_cl" title="natur">
                            ♮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="♯" className="sym_cl" title="sharp">
                            ♯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="♾" className="sym_cl" title="circinf">
                            ♾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="✓" className="sym_cl" title="check">
                            ✓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="✗" className="sym_cl" title="cross">
                            ✗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="✝" className="sym_cl" title="cross">
                            ✝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="✠" className="sym_cl" title="malt">
                            ✠
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="✦" className="sym_cl" title="lozf">
                            ✦
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="✶" className="sym_cl" title="sext">
                            ✶
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="❘"
                            className="sym_cl"
                            title="VerticalSeparator"
                          >
                            ❘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="❦" className="sym_cl" title="hedera">
                            ❦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="❧" className="sym_cl" title="hederarot">
                            ❧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦅" className="sym_cl" title="lopar">
                            ⦅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦆" className="sym_cl" title="ropar">
                            ⦆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦿" className="sym_cl" title="ofcir">
                            ⦿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="〈" className="sym_cl" title="lang">
                            〈
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="〉" className="sym_cl" title="rang">
                            〉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="《" className="sym_cl" title="Lang">
                            《
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="》" className="sym_cl" title="Rang">
                            》
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="〔" className="sym_cl" title="lbbrk">
                            〔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="〕" className="sym_cl" title="rbbrk">
                            〕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="〘" className="sym_cl" title="lopar">
                            〘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="〙" className="sym_cl" title="ropar">
                            〙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="〚" className="sym_cl" title="lobrk">
                            〚
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ﬄ" className="sym_cl" title="ffllig">
                            ﬄ
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="︵"
                            className="sym_cl"
                            title="OverParenthesis"
                          >
                            ︵
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="︶"
                            className="sym_cl"
                            title="UnderParenthesis"
                          >
                            ︶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="︷" className="sym_cl" title="OverBrace">
                            ︷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="︸" className="sym_cl" title="UnderBrace">
                            ︸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≗" className="sym_cl" title="cire">
                            ≗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≙" className="sym_cl" title="wedgeq">
                            ≙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≚" className="sym_cl" title="veeeq">
                            ≚
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="ᚠ" className="sym_cl" title="fMedrun">
                            ᚠ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᛘ" className="sym_cl" title="mMedrun">
                            ᛘ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᴀ" className="sym_cl" title="ascap">
                            ᴀ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᴁ" className="sym_cl" title="aeligscap">
                            ᴁ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᴄ" className="sym_cl" title="cscap">
                            ᴄ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᴅ" className="sym_cl" title="dscap">
                            ᴅ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᴆ" className="sym_cl" title="ethscap">
                            ᴆ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᴇ" className="sym_cl" title="escap">
                            ᴇ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ᴊ" className="sym_cl" title="jscap">
                            ᴊ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᴋ" className="sym_cl" title="kscap">
                            ᴋ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᴍ" className="sym_cl" title="mscap">
                            ᴍ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᴏ" className="sym_cl" title="oscap">
                            ᴏ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᴘ" className="sym_cl" title="pscap">
                            ᴘ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᴛ" className="sym_cl" title="tscap">
                            ᴛ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᴜ" className="sym_cl" title="uscap">
                            ᴜ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᴠ" className="sym_cl" title="vscap">
                            ᴠ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ᴡ" className="sym_cl" title="wscap">
                            ᴡ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᴢ" className="sym_cl" title="zscap">
                            ᴢ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᴵ" className="sym_cl" title="Imod">
                            ᴵ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ᵹ" className="sym_cl" title="gins">
                            ᵹ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ḃ" className="sym_cl" title="Bdot">
                            Ḃ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ḃ" className="sym_cl" title="bdot">
                            ḃ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ḅ" className="sym_cl" title="Bdotbl">
                            Ḅ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ḅ" className="sym_cl" title="bdotbl">
                            ḅ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ḋ" className="sym_cl" title="Ddot">
                            Ḋ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ḋ" className="sym_cl" title="ddot">
                            ḋ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ḍ" className="sym_cl" title="Ddotbl">
                            Ḍ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ḍ" className="sym_cl" title="ddotbl">
                            ḍ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ḗ" className="sym_cl" title="Emacracute">
                            Ḗ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ḗ" className="sym_cl" title="emacracute">
                            ḗ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ḟ" className="sym_cl" title="Fdot">
                            Ḟ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ḟ" className="sym_cl" title="fdot">
                            ḟ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ḣ" className="sym_cl" title="Hdot">
                            Ḣ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ḣ" className="sym_cl" title="hdot">
                            ḣ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ḥ" className="sym_cl" title="Hdotbl">
                            Ḥ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ḥ" className="sym_cl" title="hdotbl">
                            ḥ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ḱ" className="sym_cl" title="Kacute">
                            Ḱ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ḱ" className="sym_cl" title="kacute">
                            ḱ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ḳ" className="sym_cl" title="Kdotbl">
                            Ḳ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ḳ" className="sym_cl" title="kdotbl">
                            ḳ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ḷ" className="sym_cl" title="Ldotbl">
                            Ḷ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ḷ" className="sym_cl" title="ldotbl">
                            ḷ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ṁ" className="sym_cl" title="Mdot">
                            Ṁ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ṁ" className="sym_cl" title="mdot">
                            ṁ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ṃ" className="sym_cl" title="Mdotbl">
                            Ṃ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ṃ" className="sym_cl" title="mdotbl">
                            ṃ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ṅ" className="sym_cl" title="Ndot">
                            Ṅ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ṅ" className="sym_cl" title="ndot">
                            ṅ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ṇ" className="sym_cl" title="Ndotbl">
                            Ṇ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ṇ" className="sym_cl" title="ndotbl">
                            ṇ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ṓ" className="sym_cl" title="Omacracute">
                            Ṓ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ṓ" className="sym_cl" title="omacracute">
                            ṓ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ṕ" className="sym_cl" title="Pacute">
                            Ṕ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ṕ" className="sym_cl" title="pacute">
                            ṕ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ṗ" className="sym_cl" title="Pdot">
                            Ṗ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ṗ" className="sym_cl" title="pdot">
                            ṗ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ṙ" className="sym_cl" title="Rdot">
                            Ṙ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ṙ" className="sym_cl" title="rdot">
                            ṙ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ṛ" className="sym_cl" title="Rdotbl">
                            Ṛ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ṛ" className="sym_cl" title="rdotbl">
                            ṛ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ṡ" className="sym_cl" title="Sdot">
                            Ṡ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ṡ" className="sym_cl" title="sdot">
                            ṡ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ṣ" className="sym_cl" title="Sdotbl">
                            Ṣ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ṣ" className="sym_cl" title="sdotbl">
                            ṣ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ṫ" className="sym_cl" title="Tdot">
                            Ṫ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ṫ" className="sym_cl" title="tdot">
                            ṫ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ṭ" className="sym_cl" title="Tdotbl">
                            Ṭ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ṭ" className="sym_cl" title="tdotbl">
                            ṭ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ṿ" className="sym_cl" title="Vdotbl">
                            Ṿ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ṿ" className="sym_cl" title="vdotbl">
                            ṿ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ẇ" className="sym_cl" title="Wdot">
                            Ẇ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ẇ" className="sym_cl" title="wdot">
                            ẇ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="Ẉ" className="sym_cl" title="Wdotbl">
                            Ẉ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ẉ" className="sym_cl" title="wdotbl">
                            ẉ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ẏ" className="sym_cl" title="Ydot">
                            Ẏ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ẏ" className="sym_cl" title="ydot">
                            ẏ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ẓ" className="sym_cl" title="Zdotbl">
                            Ẓ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ẓ" className="sym_cl" title="zdotbl">
                            ẓ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⃛" className="sym_cl" title="tdot">
                            ⃛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⃜" className="sym_cl" title="DotDot">
                            ⃜
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="ⅎ" className="sym_cl" title="fturn">
                            ⅎ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ↄ" className="sym_cl" title="conbase">
                            ↄ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇵" className="sym_cl" title="duarr">
                            ⇵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇽" className="sym_cl" title="loarr">
                            ⇽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⇾" className="sym_cl" title="roarr">
                            ⇾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≗" className="sym_cl" title="cire">
                            ≗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≙" className="sym_cl" title="wedgeq">
                            ≙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="≚" className="sym_cl" title="veeeq">
                            ≚
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⇿" className="sym_cl" title="hoarr">
                            ⇿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋲" className="sym_cl" title="disin">
                            ⋲
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋳" className="sym_cl" title="isinsv">
                            ⋳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋴" className="sym_cl" title="isins">
                            ⋴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋵" className="sym_cl" title="isindot">
                            ⋵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋶" className="sym_cl" title="notinvc">
                            ⋶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋷" className="sym_cl" title="notinvb">
                            ⋷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋹" className="sym_cl" title="isinE">
                            ⋹
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⋺" className="sym_cl" title="nisd">
                            ⋺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋻" className="sym_cl" title="xnis">
                            ⋻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋼" className="sym_cl" title="nis">
                            ⋼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋽" className="sym_cl" title="notnivc">
                            ⋽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⋾" className="sym_cl" title="notnivb">
                            ⋾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌈" className="sym_cl" title="lceil">
                            ⌈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌉" className="sym_cl" title="rceil">
                            ⌉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌊" className="sym_cl" title="lfloor">
                            ⌊
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⌋" className="sym_cl" title="rfloor">
                            ⌋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌌" className="sym_cl" title="drcrop">
                            ⌌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌍" className="sym_cl" title="dlcrop">
                            ⌍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌎" className="sym_cl" title="urcrop">
                            ⌎
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌏" className="sym_cl" title="ulcrop">
                            ⌏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌓" className="sym_cl" title="profsurf">
                            ⌓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌕" className="sym_cl" title="telrec">
                            ⌕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌖" className="sym_cl" title="target">
                            ⌖
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⌜" className="sym_cl" title="ulcorn">
                            ⌜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌝" className="sym_cl" title="urcorn">
                            ⌝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌞" className="sym_cl" title="dlcorn">
                            ⌞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌟" className="sym_cl" title="drcorn">
                            ⌟
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌢" className="sym_cl" title="frown">
                            ⌢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌣" className="sym_cl" title="smile">
                            ⌣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="〈" className="sym_cl" title="lang">
                            〈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="〉" className="sym_cl" title="rang">
                            〉
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⌭" className="sym_cl" title="cylcty">
                            ⌭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌮" className="sym_cl" title="profalar">
                            ⌮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌶" className="sym_cl" title="topbot">
                            ⌶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌽" className="sym_cl" title="ovbar">
                            ⌽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⌿" className="sym_cl" title="solbar">
                            ⌿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⍼" className="sym_cl" title="angzarr">
                            ⍼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⎰" className="sym_cl" title="lmoust">
                            ⎰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⎱" className="sym_cl" title="rmoust">
                            ⎱
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⎴" className="sym_cl" title="tbrk">
                            ⎴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⎵" className="sym_cl" title="bbrk">
                            ⎵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⎶" className="sym_cl" title="bbrktbrk">
                            ⎶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="〛" className="sym_cl" title="robrk">
                            〛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ﬃ" className="sym_cl" title="ffilig">
                            ﬃ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ﬀ" className="sym_cl" title="fflig">
                            ﬀ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ﬁ" className="sym_cl" title="filig">
                            ﬁ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ﬂ" className="sym_cl" title="fllig">
                            ﬂ
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span
                            id="◽"
                            className="sym_cl"
                            title="EmptySmallSquare"
                          >
                            ◽
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="◾"
                            className="sym_cl"
                            title="FilledSmallSquare"
                          >
                            ◾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⟦" className="sym_cl" title="lwhsqb">
                            ⟦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⟧" className="sym_cl" title="rwhsqb">
                            ⟧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⟨" className="sym_cl" title="langb">
                            ⟨
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⟩" className="sym_cl" title="rangb">
                            ⟩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="☎" className="sym_cl" title="phone">
                            ☎
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="♀" className="sym_cl" title="female">
                            ♀
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⟵" className="sym_cl" title="xlarr">
                            ⟵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⟶" className="sym_cl" title="xrarr">
                            ⟶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⟷" className="sym_cl" title="xharr">
                            ⟷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⟸" className="sym_cl" title="xlArr">
                            ⟸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⟹" className="sym_cl" title="xrArr">
                            ⟹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⟺" className="sym_cl" title="xhArr">
                            ⟺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⟼" className="sym_cl" title="xmap">
                            ⟼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⟿" className="sym_cl" title="dzigrarr">
                            ⟿
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⤂" className="sym_cl" title="nvlArr">
                            ⤂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤃" className="sym_cl" title="nvrArr">
                            ⤃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤄" className="sym_cl" title="nvHarr">
                            ⤄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤅" className="sym_cl" title="Map">
                            ⤅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤌" className="sym_cl" title="lbarr">
                            ⤌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤍" className="sym_cl" title="rbarr">
                            ⤍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤎" className="sym_cl" title="lBarr">
                            ⤎
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤏" className="sym_cl" title="rBarr">
                            ⤏
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⤐" className="sym_cl" title="RBarr">
                            ⤐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤑" className="sym_cl" title="DDotrahd">
                            ⤑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤒" className="sym_cl" title="UpArrowBar">
                            ⤒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤓" className="sym_cl" title="DownArrowBar">
                            ⤓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤖" className="sym_cl" title="Rarrtl">
                            ⤖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤙" className="sym_cl" title="latail">
                            ⤙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤚" className="sym_cl" title="ratail">
                            ⤚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤛" className="sym_cl" title="lAtail">
                            ⤛
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⤜" className="sym_cl" title="rAtail">
                            ⤜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤝" className="sym_cl" title="larrfs">
                            ⤝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤞" className="sym_cl" title="rarrfs">
                            ⤞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤟" className="sym_cl" title="larrbfs">
                            ⤟
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤠" className="sym_cl" title="rarrbfs">
                            ⤠
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤣" className="sym_cl" title="nwarhk">
                            ⤣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤤" className="sym_cl" title="nearhk">
                            ⤤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤥" className="sym_cl" title="searhk">
                            ⤥
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⤦" className="sym_cl" title="swarhk">
                            ⤦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤧" className="sym_cl" title="nwnear">
                            ⤧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤨" className="sym_cl" title="toea">
                            ⤨
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤩" className="sym_cl" title="tosa">
                            ⤩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤪" className="sym_cl" title="swnwar">
                            ⤪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤳" className="sym_cl" title="rarrc">
                            ⤳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤵" className="sym_cl" title="cudarrr">
                            ⤵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤶" className="sym_cl" title="ldca">
                            ⤶
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⤷" className="sym_cl" title="rdca">
                            ⤷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤸" className="sym_cl" title="cudarrl">
                            ⤸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤹" className="sym_cl" title="larrpl">
                            ⤹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤼" className="sym_cl" title="curarrm">
                            ⤼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⤽" className="sym_cl" title="cularrp">
                            ⤽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥅" className="sym_cl" title="rarrpl">
                            ⥅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥈" className="sym_cl" title="harrcir">
                            ⥈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥉" className="sym_cl" title="Uarrocir">
                            ⥉
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⥊" className="sym_cl" title="lurdshar">
                            ⥊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥋" className="sym_cl" title="ldrushar">
                            ⥋
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⥎"
                            className="sym_cl"
                            title="LeftRightVector"
                          >
                            ⥎
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⥏"
                            className="sym_cl"
                            title="RightUpDownVector"
                          >
                            ⥏
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⥐"
                            className="sym_cl"
                            title="DownLeftRightVector"
                          >
                            ⥐
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⥑"
                            className="sym_cl"
                            title="LeftUpDownVector"
                          >
                            ⥑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥒" className="sym_cl" title="LeftVectorBar">
                            ⥒
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⥓"
                            className="sym_cl"
                            title="RightVectorBar"
                          >
                            ⥓
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span
                            id="⥔"
                            className="sym_cl"
                            title="RightUpVectorBar"
                          >
                            ⥔
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⥕"
                            className="sym_cl"
                            title="RightDownVectorBar"
                          >
                            ⥕
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⥖"
                            className="sym_cl"
                            title="DownLeftVectorBar"
                          >
                            ⥖
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⥗"
                            className="sym_cl"
                            title="DownRightVectorBar"
                          >
                            ⥗
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⥘"
                            className="sym_cl"
                            title="LeftUpVectorBar"
                          >
                            ⥘
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⥙"
                            className="sym_cl"
                            title="LeftDownVectorBar"
                          >
                            ⥙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥚" className="sym_cl" title="LeftTeeVector">
                            ⥚
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⥛"
                            className="sym_cl"
                            title="RightTeeVector"
                          >
                            ⥛
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span
                            id="⥜"
                            className="sym_cl"
                            title="RightUpTeeVector"
                          >
                            ⥜
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⥝"
                            className="sym_cl"
                            title="RightDownTeeVector"
                          >
                            ⥝
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⥞"
                            className="sym_cl"
                            title="DownLeftTeeVector"
                          >
                            ⥞
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⥟"
                            className="sym_cl"
                            title="DownRightTeeVector"
                          >
                            ⥟
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⥠"
                            className="sym_cl"
                            title="LeftUpTeeVector"
                          >
                            ⥠
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⥡"
                            className="sym_cl"
                            title="LeftDownTeeVector"
                          >
                            ⥡
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥢" className="sym_cl" title="lHar">
                            ⥢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥣" className="sym_cl" title="uHar">
                            ⥣
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⥤" className="sym_cl" title="rHar">
                            ⥤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥥" className="sym_cl" title="dHar">
                            ⥥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥦" className="sym_cl" title="luruhar">
                            ⥦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥧" className="sym_cl" title="ldrdhar">
                            ⥧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥨" className="sym_cl" title="ruluhar">
                            ⥨
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥩" className="sym_cl" title="rdldhar">
                            ⥩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥪" className="sym_cl" title="lharul">
                            ⥪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥫" className="sym_cl" title="llhard">
                            ⥫
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⥬" className="sym_cl" title="rharul">
                            ⥬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥭" className="sym_cl" title="lrhard">
                            ⥭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥮" className="sym_cl" title="udhar">
                            ⥮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥯" className="sym_cl" title="duhar">
                            ⥯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥰" className="sym_cl" title="RoundImplies">
                            ⥰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥱" className="sym_cl" title="erarr">
                            ⥱
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥲" className="sym_cl" title="simrarr">
                            ⥲
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥳" className="sym_cl" title="larrsim">
                            ⥳
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⥴" className="sym_cl" title="rarrsim">
                            ⥴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥵" className="sym_cl" title="rarrap">
                            ⥵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥶" className="sym_cl" title="ltlarr">
                            ⥶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥸" className="sym_cl" title="gtrarr">
                            ⥸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥹" className="sym_cl" title="subrarr">
                            ⥹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥻" className="sym_cl" title="suplarr">
                            ⥻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥼" className="sym_cl" title="lfisht">
                            ⥼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥽" className="sym_cl" title="rfisht">
                            ⥽
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⥾" className="sym_cl" title="ufisht">
                            ⥾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⥿" className="sym_cl" title="dfisht">
                            ⥿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦋" className="sym_cl" title="lbrke">
                            ⦋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦌" className="sym_cl" title="rbrke">
                            ⦌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦍" className="sym_cl" title="lbrkslu">
                            ⦍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦎" className="sym_cl" title="rbrksld">
                            ⦎
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦏" className="sym_cl" title="lbrksld">
                            ⦏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦐" className="sym_cl" title="rbrkslu">
                            ⦐
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⦑" className="sym_cl" title="langd">
                            ⦑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦒" className="sym_cl" title="rangd">
                            ⦒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦓" className="sym_cl" title="lparlt">
                            ⦓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦔" className="sym_cl" title="rpargt">
                            ⦔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦕" className="sym_cl" title="gtlPar">
                            ⦕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦖" className="sym_cl" title="ltrPar">
                            ⦖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦚" className="sym_cl" title="vzigzag">
                            ⦚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦜" className="sym_cl" title="vangrt">
                            ⦜
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⦝" className="sym_cl" title="angrtvbd">
                            ⦝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦠" className="sym_cl" title="lpargt">
                            ⦠
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦤" className="sym_cl" title="ange">
                            ⦤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦥" className="sym_cl" title="range">
                            ⦥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦦" className="sym_cl" title="dwangle">
                            ⦦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦧" className="sym_cl" title="uwangle">
                            ⦧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦨" className="sym_cl" title="angmsdaa">
                            ⦨
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦩" className="sym_cl" title="angmsdab">
                            ⦩
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⦪" className="sym_cl" title="angmsdac">
                            ⦪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦫" className="sym_cl" title="angmsdad">
                            ⦫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦬" className="sym_cl" title="angmsdae">
                            ⦬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦭" className="sym_cl" title="angmsdaf">
                            ⦭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦮" className="sym_cl" title="angmsdag">
                            ⦮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦯" className="sym_cl" title="angmsdah">
                            ⦯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦰" className="sym_cl" title="bemptyv">
                            ⦰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦱" className="sym_cl" title="demptyv">
                            ⦱
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⦲" className="sym_cl" title="cemptyv">
                            ⦲
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦳" className="sym_cl" title="raemptyv">
                            ⦳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦴" className="sym_cl" title="laemptyv">
                            ⦴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦵" className="sym_cl" title="ohbar">
                            ⦵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦶" className="sym_cl" title="omid">
                            ⦶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦷" className="sym_cl" title="opar">
                            ⦷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦹" className="sym_cl" title="operp">
                            ⦹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦻" className="sym_cl" title="olcross">
                            ⦻
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⦼" className="sym_cl" title="odsold">
                            ⦼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⦾" className="sym_cl" title="olcir">
                            ⦾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧀" className="sym_cl" title="olt">
                            ⧀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧁" className="sym_cl" title="ogt">
                            ⧁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧂" className="sym_cl" title="cirscir">
                            ⧂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧃" className="sym_cl" title="cirE">
                            ⧃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧄" className="sym_cl" title="solb">
                            ⧄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧅" className="sym_cl" title="bsolb">
                            ⧅
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⧉" className="sym_cl" title="boxbox">
                            ⧉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧍" className="sym_cl" title="trisb">
                            ⧍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧎" className="sym_cl" title="rtriltri">
                            ⧎
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⧏"
                            className="sym_cl"
                            title="LeftTriangleBar"
                          >
                            ⧏
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⧐"
                            className="sym_cl"
                            title="RightTriangleBar"
                          >
                            ⧐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧚" className="sym_cl" title="race">
                            ⧚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧛" className="sym_cl" title="acE">
                            ⧛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧜" className="sym_cl" title="iinfin">
                            ⧜
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⧝" className="sym_cl" title="infintie">
                            ⧝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧞" className="sym_cl" title="nvinfin">
                            ⧞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧣" className="sym_cl" title="eparsl">
                            ⧣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧤" className="sym_cl" title="smeparsl">
                            ⧤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧥" className="sym_cl" title="eqvparsl">
                            ⧥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧫" className="sym_cl" title="lozf">
                            ⧫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧴" className="sym_cl" title="RuleDelayed">
                            ⧴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⧶" className="sym_cl" title="dsol">
                            ⧶
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⨀" className="sym_cl" title="xodot">
                            ⨀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨁" className="sym_cl" title="xoplus">
                            ⨁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨂" className="sym_cl" title="xotime">
                            ⨂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨄" className="sym_cl" title="xuplus">
                            ⨄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨆" className="sym_cl" title="xsqcup">
                            ⨆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨌" className="sym_cl" title="qint">
                            ⨌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨍" className="sym_cl" title="fpartint">
                            ⨍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨐" className="sym_cl" title="cirfnint">
                            ⨐
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⨑" className="sym_cl" title="awint">
                            ⨑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨒" className="sym_cl" title="rppolint">
                            ⨒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨓" className="sym_cl" title="scpolint">
                            ⨓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨔" className="sym_cl" title="npolint">
                            ⨔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨕" className="sym_cl" title="pointint">
                            ⨕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨖" className="sym_cl" title="quatint">
                            ⨖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨗" className="sym_cl" title="intlarhk">
                            ⨗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨢" className="sym_cl" title="pluscir">
                            ⨢
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⨣" className="sym_cl" title="plusacir">
                            ⨣
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨤" className="sym_cl" title="simplus">
                            ⨤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨥" className="sym_cl" title="plusdu">
                            ⨥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨦" className="sym_cl" title="plussim">
                            ⨦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨧" className="sym_cl" title="plustwo">
                            ⨧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨩" className="sym_cl" title="mcomma">
                            ⨩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨪" className="sym_cl" title="minusdu">
                            ⨪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨭" className="sym_cl" title="loplus">
                            ⨭
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⨮" className="sym_cl" title="roplus">
                            ⨮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨯" className="sym_cl" title="Cross">
                            ⨯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨰" className="sym_cl" title="timesd">
                            ⨰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨱" className="sym_cl" title="timesbar">
                            ⨱
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨳" className="sym_cl" title="smashp">
                            ⨳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨴" className="sym_cl" title="lotimes">
                            ⨴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨵" className="sym_cl" title="rotimes">
                            ⨵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨶" className="sym_cl" title="otimesas">
                            ⨶
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⨷" className="sym_cl" title="Otimes">
                            ⨷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨸" className="sym_cl" title="odiv">
                            ⨸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨹" className="sym_cl" title="triplus">
                            ⨹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨺" className="sym_cl" title="triminus">
                            ⨺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨻" className="sym_cl" title="tritime">
                            ⨻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨼" className="sym_cl" title="iprod">
                            ⨼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⨿" className="sym_cl" title="amalg">
                            ⨿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩀" className="sym_cl" title="capdot">
                            ⩀
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⩂" className="sym_cl" title="ncup">
                            ⩂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩃" className="sym_cl" title="ncap">
                            ⩃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩄" className="sym_cl" title="capand">
                            ⩄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩅" className="sym_cl" title="cupor">
                            ⩅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩆" className="sym_cl" title="cupcap">
                            ⩆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩇" className="sym_cl" title="capcup">
                            ⩇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩈" className="sym_cl" title="cupbrcap">
                            ⩈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩉" className="sym_cl" title="capbrcup">
                            ⩉
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⩊" className="sym_cl" title="cupcup">
                            ⩊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩋" className="sym_cl" title="capcap">
                            ⩋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩌" className="sym_cl" title="ccups">
                            ⩌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩍" className="sym_cl" title="ccaps">
                            ⩍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩐" className="sym_cl" title="ccupssm">
                            ⩐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩓" className="sym_cl" title="And">
                            ⩓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩔" className="sym_cl" title="Or">
                            ⩔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩕" className="sym_cl" title="andand">
                            ⩕
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⩖" className="sym_cl" title="oror">
                            ⩖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩗" className="sym_cl" title="orslope">
                            ⩗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩘" className="sym_cl" title="andslope">
                            ⩘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩚" className="sym_cl" title="andv">
                            ⩚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩛" className="sym_cl" title="orv">
                            ⩛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩜" className="sym_cl" title="andd">
                            ⩜
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩝" className="sym_cl" title="ord">
                            ⩝
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩟" className="sym_cl" title="wedbar">
                            ⩟
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⩦" className="sym_cl" title="sdote">
                            ⩦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩪" className="sym_cl" title="simdot">
                            ⩪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩭" className="sym_cl" title="congdot">
                            ⩭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩮" className="sym_cl" title="easter">
                            ⩮
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩯" className="sym_cl" title="apacir">
                            ⩯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩰" className="sym_cl" title="apE">
                            ⩰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩱" className="sym_cl" title="eplus">
                            ⩱
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩲" className="sym_cl" title="pluse">
                            ⩲
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⩳" className="sym_cl" title="Esim">
                            ⩳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩴" className="sym_cl" title="Colone">
                            ⩴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩵" className="sym_cl" title="Equal">
                            ⩵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩷" className="sym_cl" title="eDDot">
                            ⩷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩸" className="sym_cl" title="equivDD">
                            ⩸
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩹" className="sym_cl" title="ltcir">
                            ⩹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩺" className="sym_cl" title="gtcir">
                            ⩺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩻" className="sym_cl" title="ltquest">
                            ⩻
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⩼" className="sym_cl" title="gtquest">
                            ⩼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩽" className="sym_cl" title="les">
                            ⩽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩾" className="sym_cl" title="ges">
                            ⩾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⩿" className="sym_cl" title="lesdot">
                            ⩿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪀" className="sym_cl" title="gesdot">
                            ⪀
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪁" className="sym_cl" title="lesdoto">
                            ⪁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪂" className="sym_cl" title="gesdoto">
                            ⪂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪃" className="sym_cl" title="lesdotor">
                            ⪃
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⪄" className="sym_cl" title="gesdotol">
                            ⪄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪅" className="sym_cl" title="lap">
                            ⪅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪆" className="sym_cl" title="gap">
                            ⪆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪇" className="sym_cl" title="lne">
                            ⪇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪈" className="sym_cl" title="gne">
                            ⪈
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪉" className="sym_cl" title="lnap">
                            ⪉
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪊" className="sym_cl" title="gnap">
                            ⪊
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪋" className="sym_cl" title="lEg">
                            ⪋
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⪌" className="sym_cl" title="gEl">
                            ⪌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪍" className="sym_cl" title="lsime">
                            ⪍
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪎" className="sym_cl" title="gsime">
                            ⪎
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪏" className="sym_cl" title="lsimg">
                            ⪏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪐" className="sym_cl" title="gsiml">
                            ⪐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪑" className="sym_cl" title="lgE">
                            ⪑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪒" className="sym_cl" title="glE">
                            ⪒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪓" className="sym_cl" title="lesges">
                            ⪓
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⪔" className="sym_cl" title="gesles">
                            ⪔
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪕" className="sym_cl" title="els">
                            ⪕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪖" className="sym_cl" title="egs">
                            ⪖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪗" className="sym_cl" title="elsdot">
                            ⪗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪘" className="sym_cl" title="egsdot">
                            ⪘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪙" className="sym_cl" title="el">
                            ⪙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪚" className="sym_cl" title="eg">
                            ⪚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪝" className="sym_cl" title="siml">
                            ⪝
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⪞" className="sym_cl" title="simg">
                            ⪞
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪟" className="sym_cl" title="simlE">
                            ⪟
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪠" className="sym_cl" title="simgE">
                            ⪠
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪡" className="sym_cl" title="LessLess">
                            ⪡
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="⪢"
                            className="sym_cl"
                            title="GreaterGreater"
                          >
                            ⪢
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪤" className="sym_cl" title="glj">
                            ⪤
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪥" className="sym_cl" title="gla">
                            ⪥
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪦" className="sym_cl" title="ltcc">
                            ⪦
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⪧" className="sym_cl" title="gtcc">
                            ⪧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪨" className="sym_cl" title="lescc">
                            ⪨
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪩" className="sym_cl" title="gescc">
                            ⪩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪪" className="sym_cl" title="smt">
                            ⪪
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪫" className="sym_cl" title="lat">
                            ⪫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪬" className="sym_cl" title="smte">
                            ⪬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪭" className="sym_cl" title="late">
                            ⪭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪮" className="sym_cl" title="bumpE">
                            ⪮
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⪯" className="sym_cl" title="pre">
                            ⪯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪰" className="sym_cl" title="sce">
                            ⪰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪳" className="sym_cl" title="prE">
                            ⪳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪴" className="sym_cl" title="scE">
                            ⪴
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪵" className="sym_cl" title="prnE">
                            ⪵
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪶" className="sym_cl" title="scnE">
                            ⪶
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪷" className="sym_cl" title="prap">
                            ⪷
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪸" className="sym_cl" title="scap">
                            ⪸
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⪹" className="sym_cl" title="prnap">
                            ⪹
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪺" className="sym_cl" title="scnap">
                            ⪺
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪻" className="sym_cl" title="Pr">
                            ⪻
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪼" className="sym_cl" title="Sc">
                            ⪼
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪽" className="sym_cl" title="subdot">
                            ⪽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪾" className="sym_cl" title="supdot">
                            ⪾
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⪿" className="sym_cl" title="subplus">
                            ⪿
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫀" className="sym_cl" title="supplus">
                            ⫀
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⫁" className="sym_cl" title="submult">
                            ⫁
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫂" className="sym_cl" title="supmult">
                            ⫂
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫃" className="sym_cl" title="subedot">
                            ⫃
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫄" className="sym_cl" title="supedot">
                            ⫄
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫅" className="sym_cl" title="subE">
                            ⫅
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫆" className="sym_cl" title="supE">
                            ⫆
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫇" className="sym_cl" title="subsim">
                            ⫇
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫈" className="sym_cl" title="supsim">
                            ⫈
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⫋" className="sym_cl" title="subnE">
                            ⫋
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫌" className="sym_cl" title="supnE">
                            ⫌
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫏" className="sym_cl" title="csub">
                            ⫏
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫐" className="sym_cl" title="csup">
                            ⫐
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫑" className="sym_cl" title="csube">
                            ⫑
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫒" className="sym_cl" title="csupe">
                            ⫒
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫓" className="sym_cl" title="subsup">
                            ⫓
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫔" className="sym_cl" title="supsub">
                            ⫔
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⫕" className="sym_cl" title="subsub">
                            ⫕
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫖" className="sym_cl" title="supsup">
                            ⫖
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫗" className="sym_cl" title="suphsub">
                            ⫗
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫘" className="sym_cl" title="supdsub">
                            ⫘
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫙" className="sym_cl" title="forkv">
                            ⫙
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫚" className="sym_cl" title="topfork">
                            ⫚
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫛" className="sym_cl" title="mlcp">
                            ⫛
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫤" className="sym_cl" title="Dashv">
                            ⫤
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⫦" className="sym_cl" title="Vdashl">
                            ⫦
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫧" className="sym_cl" title="Barv">
                            ⫧
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫨" className="sym_cl" title="vBar">
                            ⫨
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫩" className="sym_cl" title="vBarv">
                            ⫩
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫫" className="sym_cl" title="Vbar">
                            ⫫
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫬" className="sym_cl" title="Not">
                            ⫬
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫭" className="sym_cl" title="bNot">
                            ⫭
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫮" className="sym_cl" title="rnmid">
                            ⫮
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="⫯" className="sym_cl" title="cirmid">
                            ⫯
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫰" className="sym_cl" title="midcir">
                            ⫰
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫱" className="sym_cl" title="topcir">
                            ⫱
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫲" className="sym_cl" title="nhpar">
                            ⫲
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫳" className="sym_cl" title="parsim">
                            ⫳
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="⫽" className="sym_cl" title="parsl">
                            ⫽
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="Ⱶ" className="sym_cl" title="Hhalf">
                            Ⱶ
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="ⱶ" className="sym_cl" title="hhalf">
                            ⱶ
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="documentScore" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="new_book_modal">
                  Document Score
                </h5>
                <span className="piechart_value"></span>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="material-icons">close</i>
                </button>
              </div>
              <div className="modal-body">
                <div id="piechart"></div>
              </div>
            </div>
          </div>
        </div>

        <div id="replyQueryModal" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <div>
                  <span className="close" data-dismiss="modal">
                    <i className="material-icons">close</i>
                  </span>
                  <h5 className="popuptitleHead" id="commentHead">
                    Query Reply
                  </h5>
                </div>
                <div className="model-reply-query">
                  <p>
                    <b>Query:</b> <span id="reply-com"></span>
                  </p>
                </div>
                <input type="hidden" id="reply-commentid" value=""></input>
                <input type="hidden" id="replyfor-commentid" value="0"></input>
                <textarea
                  className="form-control"
                  rows="8"
                  id="replyText"
                  data-text="Click here to reply the query"
                ></textarea>
              </div>
              <div className="my-2">
                <center>
                  <button
                    id="replyQuerySubmit"
                    className="btn cstm-save-btn"
                    onClick={() => window.updatereply()}
                  >
                    Reply
                  </button>
                </center>
              </div>
            </div>
          </div>
        </div>

        <div id="replyUpdateModal" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <div>
                  <span className="close" data-dismiss="modal">
                    <i className="material-icons">close</i>
                  </span>
                  <h5 className="popuptitleHead" id="commentHead">
                    Reply
                  </h5>
                </div>
                <input type="hidden" id="reply-id" value=""></input>
                <textarea
                  className="form-control"
                  rows="8"
                  id="update_replyText"
                  data-text="Click here to reply the query"
                ></textarea>
              </div>
              <div className="my-2">
                <center>
                  <button
                    id="replyQuerySubmit"
                    className="btn cstm-save-btn"
                    onClick={() => window.updatereply_text()}
                  >
                    Update Reply
                  </button>
                </center>
              </div>
            </div>
          </div>
        </div>

        <div id="confirmdeleteModal" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <div>
                  <span className="close" data-dismiss="modal">
                    <i className="material-icons">close</i>
                  </span>
                  <div>
                    Please make sure that once you delete the paragraph then the
                    query/comment present inside the paragraph will be deleted
                    too?
                  </div>
                </div>
                <div className="confirm-btn-main">
                  <button
                    id="confirmcancel"
                    className="btn cstm-delete-btn mr-2 pull-right"
                  >
                    No
                  </button>
                  <button
                    id="confirmdelete"
                    className="btn cstm-save-btn mr-2 pull-right"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="pdfModal" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body"></div>
            </div>
          </div>
        </div>

        <div id="myModalfront" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <div>
                  <span className="close" data-dismiss="modal">
                    <i className="material-icons">close</i>
                  </span>
                  <div className="row p-0">
                    <div className="col col-9">
                      <h5 className="popuptitleHead" id="commentHead">
                        Article Metadata Edit
                      </h5>
                    </div>
                    <div className="col col-3 editor-tools fm-editor-tools">
                      <div className="row-editor">
                        <i
                          className="material-icons fm-editor"
                          data-cmdvalue="bold"
                          title="Bold"
                        >
                          format_bold
                        </i>
                        <i
                          className="material-icons fm-editor"
                          data-cmdvalue="italic"
                          title="Italic"
                        >
                          format_italic
                        </i>
                        <i
                          className="fa fa-superscript fm-editor"
                          data-cmdvalue="superscript"
                          title="Superscript"
                          aria-hidden="true"
                        ></i>
                        <i
                          className="fa fa-subscript fm-editor"
                          data-cmdvalue="subscript"
                          title="Subscript"
                          aria-hidden="true"
                        ></i>
                        <i
                          className="material-icons specialchar"
                          title="Add Symbol"
                          onMouseDown={(e) =>
                            window.specialchar(e, 'form-group')
                          }
                        >
                          emoji_symbols
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="form_fm">
                  {this.state.metadataEle !== '' && (
                    <ArticleMetaPopup
                      metadataEles={this.state.metadataEle}
                      handleCitation={this.handleCitation}
                      deleteAff={this.deleteAff}
                    />
                  )}
                </div>
                <div id="frontmatter_div" contentEditable="true"></div>
              </div>
              <div className="my-2">
                <button
                  className="btn cstm-primary-btn float-right mr-3"
                  id="metaSave"
                  onClick={() => this.saveArticleChanges()}
                >
                  Save
                </button>
                <button
                  className="btn cstm-primary-btn float-right mr-2"
                  id="metaCancel"
                  onClick={() => this.cancelArticleChanges()}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default EditorTools;
