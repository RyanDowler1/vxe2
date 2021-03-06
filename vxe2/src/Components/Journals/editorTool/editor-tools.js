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
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="u" className="sym_cl">
                            u
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="e" className="sym_cl">
                            e
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="t" className="sym_cl">
                            t
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="'" className="sym_cl">
                            '
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="d" className="sym_cl">
                            d
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="|" className="sym_cl">
                            |
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="/" className="sym_cl">
                            /
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="-" className="sym_cl">
                            -
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="~" className="sym_cl">
                            ~
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="$" className="sym_cl">
                            $
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="?" className="sym_cl">
                            ?
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="'" className="sym_cl">
                            '
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="~" className="sym_cl">
                            ~
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="$" className="sym_cl">
                            $
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="?" className="sym_cl">
                            ?
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="G" className="sym_cl">
                            G
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
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
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
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
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
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
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
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
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
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
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>

                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??????" className="sym_cl">
                            ??????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="?????" className="sym_cl">
                            ?????
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="?????" className="sym_cl">
                            ?????
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
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lsquo">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rsquo">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lsquor">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rsquorev">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ldquo">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rdquo">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ldquor">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rdquorev">
                            ???
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
                          <span id="??" className="sym_cl" title="iexcl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="cent">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="pound">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="curren">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="yen">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="brvbar">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="sect">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="uml">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="copy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ordf">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="laquo">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="not">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="shy">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="reg">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="macr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="deg">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="plusmn">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="sup2">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="sup3">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="acute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="micro">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="para">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="middot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="cedil">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="sup1">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ordm">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="raquo">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="frac14">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="frac12">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="frac34">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="iquest">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Agrave">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Aacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Acirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Atilde">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Auml">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Aring">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="AElig">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ccedil">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Egrave">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Eacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ecirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Euml">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Igrave">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Iacute">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Icirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Iuml">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ETH">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ntilde">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ograve">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Oacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ocirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Otilde">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ouml">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="times">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Oslash">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ugrave">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Uacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ucirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Uuml">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Yacute">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="THORN">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="szlig">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="agrave">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="aacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="acirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="atilde">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="auml">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="aring">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="aelig">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ccedil">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="egrave">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="eacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ecirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="euml">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="igrave">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="iacute">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="icirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="iuml">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="eth">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ntilde">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ograve">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="oacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ocirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="otilde">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ouml">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="div">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="oslash">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ugrave">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="uacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ucirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="uuml">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="yacute">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="thorn">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="yuml">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Amacr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="amacr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Abreve">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="abreve">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Aogon">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="aogon">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Cacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="cacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ccirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ccirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Cdot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="cdot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ccaron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ccaron">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Dcaron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="dcaron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Dstrok">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="dstrok">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Emacr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="emacr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ebreve">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ebreve">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Edot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="edot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Eogon">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="eogon">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ecaron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ecaron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Gcirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="gcirc">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Gbreve">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="gbreve">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Gdot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="gdot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Gcedil">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Hcirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="hcirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Hstrok">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="hstrok">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Itilde">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="itilde">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Imacr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="imacr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ibreve">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ibreve">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Iogon">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="iogon">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Idot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="imath">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="IJlig">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ijlig">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Jcirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="jcirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Kcedil">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="kcedil">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="kgreen">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Lacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="lacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Lcedil">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="lcedil">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Lcaron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="lcaron">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Lmidot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="lmidot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Lstrok">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="lstrok">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Nacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="nacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ncedil">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ncedil">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ncaron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ncaron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="napos">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ENG">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="eng">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Omacr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="omacr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Obreve">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="obreve">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Odblac">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="odblac">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="OElig">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="oelig">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Racute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="racute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Rcedil">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="rcedil">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Rcaron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="rcaron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Sacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="sacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Scirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="scirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Scedil">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="scedil">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Scaron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="scaron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Tcedil">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="tcedil">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Tcaron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="tcaron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Tstrok">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="tstrok">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Utilde">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="utilde">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Umacr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="umacr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ubreve">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ubreve">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Uring">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="uring">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Udblac">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="udblac">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Uogon">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="uogon">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Wcirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="wcirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ycirc">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ycirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Yuml">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Zacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="zacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Zdot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="zdot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Zcaron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="zcaron">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="slong">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="bstrok">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="fnof">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="hwair">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="khook">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="lbar">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="nlrleg">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="YR">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Zstrok">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="zstrok">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="EZH">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="wynn">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="AEligmacr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="aeligmacr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Gstrok">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="gstrok">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="gcaron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Oogon">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="oogon">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Oogonmacr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="oogonmacr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Gacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="gacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="HWAIR">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="WYNN">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="AEligacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="aeligacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Oslashacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="oslashacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="YOGH">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="yogh">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Adot">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="adot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Odot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="odot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ymacr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ymacr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="jnodot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Jbar">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="jbar">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="oopen">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="dtail">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="epsiv">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="jnodotstrok">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="gopen">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="gscap">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="hhook">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="istrok">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="iscap">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="nlfhook">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="nscap">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="oeligscap">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="rdes">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="rscap">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ubar">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="yscap">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ezh">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="bscap">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="hscap">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="lscap">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="apomod">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="circ">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="caron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="verbarup">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="breve">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="dot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ring">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ogon">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="tilde">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="dblac">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="xmod">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combgrave">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combacute">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combcirc">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combtilde">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combmacr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="bar">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combbreve">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combdot">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combuml">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combhook">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combring">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combdblac">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combsgvertl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combdbvertl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="DownBreve">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combcomma">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combdotbl">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combced">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combogon">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="dblbarbl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="baracr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combtildevert">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="dblovl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combastbl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="er">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="combdblbrevebl">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="asup">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="esup">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="isup">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="osup">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="usup">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="csup">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="dsup">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="hsup">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="msup">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="rsup">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="tsup">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="vsup">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="xsup">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Aacgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Eacgr">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="EEacgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Iacgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Oacgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Uacgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="OHacgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="idiagr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Agr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Bgr">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Gamma">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Delta">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Egr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Zgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="EEgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Theta">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Igr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Kgr">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Lambda">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Mgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ngr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Xi">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ogr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Pi">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Rgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Sigma">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Tgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Upsilon">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Phi">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="KHgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Psi">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Omega">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Idigr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Udigr">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="aacgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="eacgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="eeacgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="iacgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="udiagr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="alpha">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="beta">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="gamma">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="delta">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="epsi">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="zeta">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="eta">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="theta">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="iota">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="kappa">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="lambda">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="mu">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="nu">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="xi">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="omicron">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="pi">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="rho">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="sigmav">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="sigma">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="tau">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="upsi">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="phi">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="chi">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="psi">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="omega">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="idigr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="udigr">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="oacgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="uacgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ohacgr">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="thetav">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Upsi">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="phi">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="piv">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Gammad">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="gammad">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="kappav">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="rhov">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="epsi">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="bepsi">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="IOcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="DJcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="GJcy">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Jukcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="DScy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Iukcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="YIcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Jsercy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="LJcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="NJcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="TSHcy">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="KJcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ubrcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="DZcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Acy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Bcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Vcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Gcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Dcy">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="IEcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ZHcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Zcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Icy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Jcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Kcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Lcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Mcy">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ncy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ocy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Pcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Rcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Scy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Tcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ucy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Fcy">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="KHcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="TScy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="CHcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="SHcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="SHCHcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="HARDcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ycy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="SOFTcy">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="Ecy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="YUcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="YAcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="acy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="bcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="vcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="gcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="dcy">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="iecy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="zhcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="zcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="icy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="jcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="kcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="lcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="mcy">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ncy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ocy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="pcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="rcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="scy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="tcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ucy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="fcy">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="khcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="tscy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="chcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="shcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="shchcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="hardcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ycy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="softcy">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ecy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="yucy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="yacy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="iocy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="djcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="gjcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="jukcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="dscy">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="iukcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="yicy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="jsercy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ljcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="njcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="tshcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="kjcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="ubrcy">
                            ??
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="??" className="sym_cl" title="dzcy">
                            ??
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Macute">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="macute">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Wacute">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="wacute">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Wuml">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="wuml">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Adotbl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="adotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Ahook">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ahook">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Abreveacute">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="abreveacute">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Edotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="edotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Ihook">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ihook">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Idotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="idotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Odotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="odotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Ohook">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ohook">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Udotbl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="udotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Uhook">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="uhook">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Ydotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ydotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Yhook">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="yhook">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Vert">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dagger">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Dagger">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bull">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="tribull">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sgldr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nldr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="hellip">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="hyphpoint">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="permil">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="pertenk">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="prime">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Prime">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="tprime">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bprime">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lsaquo">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rsaquo">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="refmark">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="caret">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="triast">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="hybull">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="fracsol">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lsqbqu">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rsqbqu">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sup0">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="franc">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="euro">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="pennygerm">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Copf">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="incare">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="scruple">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gscr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="hamilt">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Poincareplane">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="quaternions">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="planckh">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="hbar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="imagline">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="image">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lagran">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ell">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lbbar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="naturals">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="numero">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="copysr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="weierp">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="primes">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rationals">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="realine">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="real">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="reals">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rx">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Rslstrok">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="trade">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Vslstrok">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="integers">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ounce">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ohm">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="mho">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="zeetrf">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="iiota">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="angst">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bernou">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Cayleys">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="escr">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="expectation">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Fouriertrf">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Fturn">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Mellintrf">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="order">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="aleph">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="beth">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gimel">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="daleth">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="frac13">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="frac23">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="frac15">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="frac25">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="frac35">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="frac45">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="frac16">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="frac56">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="frac18">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="frac38">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="frac58">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="frac78">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="romnumCDlig">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="romnumDDlig">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="romnumDDdbllig"
                          >
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="larr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="uarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="darr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="harr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="varr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nwarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nearr">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="searr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="swarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nlarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nrarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rarrw">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Larr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Uarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Rarr">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Darr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="larrtl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rarrtl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="mapstoleft">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="mapstoup">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="map">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="mapstodown">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="larrhk">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rarrhk">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="larrlp">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rarrlp">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="harrw">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nharr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lsh">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rsh">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ldsh">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rdsh">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cularr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="curarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="olarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="orarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lharu">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lhard">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="uharr">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="uharl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rharu">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rhard">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dharr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dharl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rlarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="udarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lrarr">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="llarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="uuarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rrarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ddarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lrhar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rlhar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nlArr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nhArr">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nrArr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lArr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="uArr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rArr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dArr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="hArr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="vArr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nwArr">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="neArr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="seArr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="swArr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lAarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rAarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="zigrarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="larrb">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rarrb">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="forall">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="comp">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="part">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="exist">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nexist">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="empty">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nabla">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="in">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="notin">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="epsi">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ni">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="notni">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bepsi">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="prod">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="coprod">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sum">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="minus">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="mp">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dotplus">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="setminus">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lowast">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="compfn">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Sqrt">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="prop">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="infin">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="angrt">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ang">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="angmsd">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="angsph">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="mid">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nmid">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="par">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="npar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="and">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="or">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cup">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="int">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Int">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="tint">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="oint">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Conint">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Cconint">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cwint">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cwconint">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="awconint">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="there4">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="becaus">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ratio">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="quaddot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dotminus">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="mDDot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="est">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sim">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bsim">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ac">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="acd">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="wr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nsim">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="esim">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sime">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nsime">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cong">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="simne">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ncong">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ape">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="apid">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bcong">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="asymp">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bump">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bumpe">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="doteq">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="eDot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="efDot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="erDot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="colone">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ecolon">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ecir">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cire">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="wedgeq">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="veeeq">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="easter">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="trie">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="equest">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ne">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="equiv">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nequiv">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="le">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ge">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="leqq">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="geqq">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lne">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gne">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ll">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gg">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="twixt">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="NotCupCap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nlt">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ngt">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nle">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nge">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lap">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nlsim">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ngsim">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lg">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ntlg">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ntgl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="pr">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sc">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="pre">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sce">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="prap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="scap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="npr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nsc">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sub">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sup">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nsub">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nsup">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sube">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="supe">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nsube">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nsupe">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="subne">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="supne">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cupdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="uplus">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sqsub">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sqsup">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sqsube">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sqsupe">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sqcap">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sqcup">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="oplus">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ominus">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="otimes">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="osol">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="odot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ocir">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="oast">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="odash">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="plusb">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="minusb">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="timesb">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sdotb">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="vdash">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dashv">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="top">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="models">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="vDash">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Vdash">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Vvdash">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="VDash">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nvdash">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nvDash">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nVdash">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nVDash">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="prurel">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="vltri">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="vrtri">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ltrie">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rtrie">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="origof">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="imof">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="mumap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="hercon">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="intcal">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="veebar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="barwed">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="barvee">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="vangrt">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lrtri">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Wedge">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Vee">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xcap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xcup">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="diam">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="star">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="divonx">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bowtie">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ltimes">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rtimes">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lthree">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rthree">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bsime">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cuvee">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cuwed">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Sub">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Sup">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Cap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Cup">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="fork">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="epar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ltdot">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gtdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Ll">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Gg">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="leg">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gel">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="els">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="egs">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cuepr">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cuesc">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="npre">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nsce">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nsqsube">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nsqsupe">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lnsim">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gnsim">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="prnap">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="scnap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nltri">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nrtri">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nltrie">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nrtrie">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="vellip">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ctdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="utdot">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dtdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="barwed">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Barwed">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bnot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="profline">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="blank">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="oS">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxh">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxv">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxdr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxdl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxur">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxul">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxvr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxvl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxhd">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxhu">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxH">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxV">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxdR">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxDr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxdR">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxdL">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxdL">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxDl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxuR">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxuR">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxUr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxuL">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxUl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxuL">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxvR">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxVr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxVr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxvL">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxVl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxVL">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxhD">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxHD">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxHd">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxHu">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxhU">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxHU">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxvH">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxVh">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxVH">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="uhblk">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lhblk">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="block">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="blk14">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="blk12">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="blk34">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="squf">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="squarewhsm">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rect">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="marker">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="fltns">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xutri">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="utrif">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="utri">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rtrif">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rtri">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xdtri">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dtrif">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dtri">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ltrif">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ltri">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="loz">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cir">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="circledot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="tridot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xcirc">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ultri">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="urtri">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lltri">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="starf">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="star">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="phone">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="female">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="male">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="spades">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="heartsuit">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="clubs">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="hearts">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="diams">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sung">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sung">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="flat">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="natur">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sharp">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="circinf">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="check">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cross">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cross">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="malt">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lozf">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sext">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="VerticalSeparator"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="hedera">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="hederarot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lopar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ropar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ofcir">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lang">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rang">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Lang">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Rang">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lbbrk">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rbbrk">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lopar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ropar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lobrk">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ffllig">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="OverParenthesis"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="UnderParenthesis"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="OverBrace">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="UnderBrace">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cire">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="wedgeq">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="veeeq">
                            ???
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="fMedrun">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="mMedrun">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ascap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="aeligscap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cscap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dscap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ethscap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="escap">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="jscap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="kscap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="mscap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="oscap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="pscap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="tscap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="uscap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="vscap">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="wscap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="zscap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Imod">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gins">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Bdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Bdotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bdotbl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Ddot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ddot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Ddotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ddotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Emacracute">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="emacracute">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Fdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="fdot">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Hdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="hdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Hdotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="hdotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Kacute">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="kacute">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Kdotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="kdotbl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Ldotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ldotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Mdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="mdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Mdotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="mdotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Ndot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ndot">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Ndotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ndotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Omacracute">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="omacracute">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Pacute">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="pacute">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Pdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="pdot">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Rdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Rdotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rdotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Sdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Sdotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sdotbl">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Tdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="tdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Tdotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="tdotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Vdotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="vdotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Wdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="wdot">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Wdotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="wdotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Ydot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ydot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Zdotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="zdotbl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="tdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="DotDot">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="fturn">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="conbase">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="duarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="loarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="roarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cire">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="wedgeq">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="veeeq">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="hoarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="disin">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="isinsv">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="isins">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="isindot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="notinvc">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="notinvb">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="isinE">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nisd">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xnis">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nis">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="notnivc">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="notnivb">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lceil">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rceil">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lfloor">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rfloor">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="drcrop">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dlcrop">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="urcrop">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ulcrop">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="profsurf">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="telrec">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="target">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ulcorn">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="urcorn">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dlcorn">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="drcorn">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="frown">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="smile">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lang">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rang">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cylcty">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="profalar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="topbot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ovbar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="solbar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="angzarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lmoust">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rmoust">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="tbrk">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bbrk">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bbrktbrk">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="robrk">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ffilig">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="fflig">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="filig">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="fllig">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="EmptySmallSquare"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="FilledSmallSquare"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lwhsqb">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rwhsqb">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="langb">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rangb">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="phone">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="female">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xlarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xrarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xharr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xlArr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xrArr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xhArr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xmap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dzigrarr">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nvlArr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nvrArr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nvHarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Map">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lbarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rbarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lBarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rBarr">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="RBarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="DDotrahd">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="UpArrowBar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="DownArrowBar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Rarrtl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="latail">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ratail">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lAtail">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rAtail">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="larrfs">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rarrfs">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="larrbfs">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rarrbfs">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nwarhk">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nearhk">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="searhk">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="swarhk">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nwnear">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="toea">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="tosa">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="swnwar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rarrc">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cudarrr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ldca">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rdca">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cudarrl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="larrpl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="curarrm">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cularrp">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rarrpl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="harrcir">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Uarrocir">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lurdshar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ldrushar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="LeftRightVector"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="RightUpDownVector"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="DownLeftRightVector"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="LeftUpDownVector"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="LeftVectorBar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="RightVectorBar"
                          >
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="RightUpVectorBar"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="RightDownVectorBar"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="DownLeftVectorBar"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="DownRightVectorBar"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="LeftUpVectorBar"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="LeftDownVectorBar"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="LeftTeeVector">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="RightTeeVector"
                          >
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="RightUpTeeVector"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="RightDownTeeVector"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="DownLeftTeeVector"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="DownRightTeeVector"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="LeftUpTeeVector"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="LeftDownTeeVector"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lHar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="uHar">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rHar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dHar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="luruhar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ldrdhar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ruluhar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rdldhar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lharul">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="llhard">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rharul">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lrhard">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="udhar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="duhar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="RoundImplies">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="erarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="simrarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="larrsim">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rarrsim">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rarrap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ltlarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gtrarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="subrarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="suplarr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lfisht">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rfisht">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ufisht">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dfisht">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lbrke">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rbrke">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lbrkslu">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rbrksld">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lbrksld">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rbrkslu">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="langd">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rangd">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lparlt">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rpargt">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gtlPar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ltrPar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="vzigzag">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="vangrt">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="angrtvbd">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lpargt">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ange">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="range">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dwangle">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="uwangle">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="angmsdaa">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="angmsdab">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="angmsdac">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="angmsdad">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="angmsdae">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="angmsdaf">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="angmsdag">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="angmsdah">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bemptyv">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="demptyv">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cemptyv">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="raemptyv">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="laemptyv">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ohbar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="omid">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="opar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="operp">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="olcross">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="odsold">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="olcir">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="olt">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ogt">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cirscir">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cirE">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="solb">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bsolb">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="boxbox">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="trisb">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rtriltri">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="LeftTriangleBar"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="RightTriangleBar"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="race">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="acE">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="iinfin">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="infintie">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nvinfin">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="eparsl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="smeparsl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="eqvparsl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lozf">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="RuleDelayed">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="dsol">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xodot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xoplus">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xotime">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xuplus">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="xsqcup">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="qint">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="fpartint">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cirfnint">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="awint">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rppolint">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="scpolint">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="npolint">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="pointint">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="quatint">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="intlarhk">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="pluscir">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="plusacir">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="simplus">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="plusdu">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="plussim">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="plustwo">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="mcomma">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="minusdu">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="loplus">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="roplus">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Cross">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="timesd">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="timesbar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="smashp">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lotimes">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rotimes">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="otimesas">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Otimes">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="odiv">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="triplus">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="triminus">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="tritime">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="iprod">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="amalg">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="capdot">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ncup">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ncap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="capand">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cupor">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cupcap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="capcup">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cupbrcap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="capbrcup">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cupcup">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="capcap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ccups">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ccaps">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ccupssm">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="And">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Or">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="andand">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="oror">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="orslope">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="andslope">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="andv">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="orv">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="andd">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ord">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="wedbar">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sdote">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="simdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="congdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="easter">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="apacir">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="apE">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="eplus">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="pluse">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Esim">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Colone">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Equal">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="eDDot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="equivDD">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ltcir">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gtcir">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ltquest">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gtquest">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="les">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ges">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lesdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gesdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lesdoto">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gesdoto">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lesdotor">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gesdotol">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lne">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gne">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lnap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gnap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lEg">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gEl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lsime">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gsime">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lsimg">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gsiml">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lgE">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="glE">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lesges">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gesles">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="els">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="egs">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="elsdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="egsdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="el">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="eg">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="siml">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="simg">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="simlE">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="simgE">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="LessLess">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span
                            id="???"
                            className="sym_cl"
                            title="GreaterGreater"
                          >
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="glj">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gla">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="ltcc">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gtcc">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lescc">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="gescc">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="smt">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="lat">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="smte">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="late">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bumpE">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="pre">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="sce">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="prE">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="scE">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="prnE">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="scnE">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="prap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="scap">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="prnap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="scnap">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Pr">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Sc">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="subdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="supdot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="subplus">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="supplus">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="submult">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="supmult">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="subedot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="supedot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="subE">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="supE">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="subsim">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="supsim">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="subnE">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="supnE">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="csub">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="csup">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="csube">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="csupe">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="subsup">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="supsub">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="subsub">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="supsup">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="suphsub">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="supdsub">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="forkv">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="topfork">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="mlcp">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Dashv">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Vdashl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Barv">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="vBar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="vBarv">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Vbar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Not">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="bNot">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="rnmid">
                            ???
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="cirmid">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="midcir">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="topcir">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="nhpar">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="parsim">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="parsl">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="Hhalf">
                            ???
                          </span>
                        </td>
                        <td className="zoom">
                          <span id="???" className="sym_cl" title="hhalf">
                            ???
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
