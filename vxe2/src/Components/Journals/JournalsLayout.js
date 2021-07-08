import React from 'react';
import '@trendmicro/react-paginations/dist/react-paginations.css';
import 'react-table/react-table.css';
import './css/journals-thumb-tab.css';
import './css/BIO-common_ST.css';
import './css/journals-custom.css';
import Row from 'react-bootstrap/Row';
import EditorTool from './dynamicTool/dynamic-layout';
import DynamicTool from './dynamicTool/dynamic-layout';
import OverviewTool from './overviewTool/overview-layout';
import BreadCrumb from './breadCrumb/breadcrumb-layout';
import JournalsHeader from './journals-header';
import $ from 'jquery';
import DynamicModal from './modals/dynamic-modal';
import { setIsLoading } from '../../utils/reusuableFunctions';
import Loading from '../Journals/loading/spinningCircle';//

class Journals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: this.props.userData,
      vxePermissions: this.props.permissions,
      role: this.props.userData.permissions.rol,
      selectedChapter: 1,
      trackData: [],
      chapterList: [],
      selectedChapterXml: '',
      selectedChapterXmlName: '',
      selectedChapterName: '',
      selectedChapterPrefix: '',
      trackCount: 0,
      showOrHideStyleEdit: 'hideClass',
      showOrHideContentValidation: 'hideClass',
      showOrHideConsistency: 'hideClass',
      showOrHideGrammerChecker: 'hideClass',
      showOrHideSpellCheck: 'hideClass',
      trackSpellData: [],
      trackSpellSuggestions: [],
      close: false,
      consistencyRespData: [],
      finalitalic_duplication: [],
      finalbold_duplication: [],
      captilization_list: [],
      contentValidationProp: [],
      contentValidationValue: [],
      contentValidationVal: [],
      ProjectId: props.match.params.ProjectId,
      ChapterId: props.match.params.ChapterId,
      openLogModal: false,
      contentElementPopup: '',
      APIURL: 'https://api.stg-lanstad.com',
      //APIURL : "http://127.0.0.1:8080",
      // APIURL : "http://192.168.0.48:8000",
      pdfIsCreated: false,
      firstTime: true,
      loading: true,
    };
    this.getTrackedData = this.getTrackedData.bind(this);
    this.VXELogModalClose = this.VXELogModalClose.bind(this);
    this.VXELogModal = this.VXELogModal.bind(this);
    this.referenceColor = this.referenceColor.bind(this);
    this.referenceColorMap = this.referenceColorMap.bind(this);
  }

  VXELogModal = () => {
    this.setState({ openLogModal: true });
  };
  VXELogModalClose() {
    this.setState({ openLogModal: false });
  }

  setRightSiderHeight() {
    var doc = document;
    var windowHeight = window.innerHeight;
    var header1Height = doc.querySelector('.h-r-1').offsetHeight;
    var mainContainer = windowHeight;
    var searchHeight = doc.querySelector('.cstm-adv-srch-bdy')
      ? doc.querySelector('.cstm-adv-srch-bdy').offsetHeight
      : 0;
    var editorToolsHeight = doc.querySelector('.editor-tools').offsetHeight;
    doc.querySelector('.main-container').style.height = mainContainer + 'px';
    doc.querySelector('.thumb-pdf').style.height =
      mainContainer - (searchHeight + 55) + 'px';
    doc.getElementById('textbody').style.height =
      mainContainer - (editorToolsHeight + 55) + 'px';
    doc.querySelector('.track-panel').style.height =
      mainContainer - (header1Height + 55) + 'px';
    doc.querySelector('.track-changes-list').style.height =
      mainContainer - (header1Height + 202) + 'px';
    //Disabled default spell checker
    document
      .querySelectorAll('#content *')
      .forEach((x) => x.setAttribute('spellcheck', 'false'));
  }

  trackListCount() {
    let trackListLen = document.getElementById('track-list').children.length;
    if (!trackListLen) trackListLen = 0;
    this.setState({ trackCount: trackListLen });
  }

  articleFieldUpdate(e, keyPress) {
    let beforeArticleUpdate;
    let afterArticleUpdate;

    if (keyPress === 'keyup') {
      beforeArticleUpdate = e.target.innerHTML;
    } else if (keyPress === 'keydown') {
      afterArticleUpdate = e.target.innerHTML;
    }
    if (beforeArticleUpdate !== afterArticleUpdate) {
      e.target.classList.add('modified-article');
    } else {
      e.target.classList.remove('modified-article');
    }
  }

  componentDidMount() {
    this.setRightSiderHeight();
    window.Journals = this;
    window.addEventListener('resize', this.setRightSiderHeight.bind(this));
    this.trackInit();
    this.trackArtMeta();
    this.getChapterList();
    setInterval(() => {
      this.oxygenLog();
    }, 20 * 1000);
  }

  appendDragDropRef() {
    $('ref-list').attr('id', 'refId');
    var dragEle =
      '<span class="material-icons-outlined ref-drag ui-sortable-handle" title="Reorder">drag_indicator</span>';
    $('ref').prepend(dragEle);
  }

  getChapterList = () => {
    //setIsLoading(true, ['body']); //Call function that sets and removes loading state
    this.setState({
      loading: true,
    });
    this.chagePermisionValue();
    this.getIpAddress();
    fetch(this.state.APIURL + '/VXE/journalsxmlcontent', {
      method: 'POST',
      body: JSON.stringify({
        ProjectId: this.state.ProjectId,
        ChapterId: this.state.ChapterId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          let xml_data = data.xml_data;
          if (xml_data !== '') {
            document.getElementById('content').innerHTML = xml_data;
            this.setState({
              selectedChapterXmlName: data.file_name,
              selectedChapterName: data.chapter_name,
              selectedChapterPrefix: data.prefix,
            });
            setTimeout(() => {
              this.getTrackedData();
            }, 100);
            this.addRefLink();
            $('.pdf-editor').attr('contenteditable', 'true');
            $('.refIcon').attr('contenteditable', 'false');
            $('.pdf-editor *')
              .not('pageno')
              .not('table')
              .not('img')
              .not('front')
              .not('article-type')
              .not('notes')
              .not('doi')
              .not('copyright')
              .not('subjecteditor')
              .not('article')
              .not('jou')
              .not('name1')
              .not('jou')
              .not('rh')
              .not('pagenor')
              .not('pagenob')
              .not('pageno')
              .not('comment')
              .not('query')
              .attr('contenteditable', 'true');
            $(
              'pageno, table, img, rh, lh, pagenor, pageno, pagenob, comment, query, footnote1, article, front, jou, name1, article-meta, article, article-type, copyright, subjecteditor, notes, doi'
            ).attr('contenteditable', 'false');
            $('.del').attr('contenteditable', 'false');
            $('#content .del').attr('contenteditable', 'false');
            $('footnote1 *').attr('contenteditable', 'false');
            $('tp, td').attr('contenteditable', 'true');
            $('.pdf-editor').focus();
            this.oxygenLog();
            var editRefPer = window.validateVxePermission(
              'basic_features',
              'ref_color_edit'
            );
            if (editRefPer === true) {
              this.referenceColor();
            } else {
              var contentElement = document.getElementById('content');
              var bibloEle = contentElement.querySelector('ref-list');
              if (bibloEle !== null) {
                var fontEle = bibloEle.querySelectorAll('font'),
                  i;
                if (fontEle.length > 0) {
                  $('#content ref-list ref font').contents().unwrap();
                }
              }
            }
            $('#savingStatus').val('Yes');
            $('.undoicon').css('pointer-events', 'none');
            $('.undoicon').css('opacity', '0.3');
            $('.redoicon').css('pointer-events', 'none');
            $('.redoicon').css('opacity', '0.3');
            $('.refIcon').attr('contenteditable', 'false');
            this.journaltoc();
            this.appendDragDropRef();
            window.refSort();

            this.intervalId = setInterval(this.timer.bind(this), 5000);

            window.trackcheck();
            window.imageContent();
          }
        }
        this.setState({
          loading: false,
        });
        //newLoader
        //setIsLoading(false, ['body']);
      })
      .catch(console.log);
  };

  timer() {
    var api_url = $('#api_url').val();
    var chapter_id = $('#chapterid').val();
    var project_id = $('#projectid').val();
    var chapter_name = $('#chapterxmlname').val();
    var user_id = $('#userid').val();

    fetch(api_url + '/VXE/ChapterPdfInProgress/', {
      method: 'POST',
      body: JSON.stringify({
        ProjectId: project_id,
        ChapterId: chapter_id,
        filename: chapter_name,
        user_id: user_id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //newLoader
        setIsLoading(true, ['body']);
        if (data.status_id === '0') {
          $('#chapter_download').hide();
          if (!this.state.firstTime) {
            this.setState({ pdfIsCreated: false });
          }
          this.setState({ firstTime: false });
        } else {
          //newLoader
          setIsLoading(false, ['body']); //Call function that sets and removes loading state
          $('#chapter_download').show();
          if (!this.state.firstTime) {
            this.setState({ pdfIsCreated: true });
          }
          this.setState({ firstTime: false });
        }
        if (data.generatedPDFstatus == 1) {
          $('#generate-pdf').show();
        } else {
          $('#generate-pdf').hide();
        }
        $('#taskid').val(data.taskId);
      })
      .catch(console.log);
  }

  chagePermisionValue = () => {
    var permission = this.state.vxePermissions;
    var myJSON = JSON.stringify(permission);
    var result = myJSON.replaceAll('"0"', false);
    result = result.replaceAll('"1"', true);
    var JSONobj = JSON.parse(result);
    this.setState({ vxePermissions: JSONobj });
  };

  getIpAddress = () => {
    fetch('https://ipapi.co/json/')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        $('#ipaddress').html(data.ip);
      });
  };

  oxygenLog = () => {
    var project_id = $('#projectid').val();
    var chapter_id = $('#chapterid').val();
    var chapter_name = $('#chapterxmlname').val();
    var user_id = $('#userid').val();
    //setIsLoading(true);
    var logcheck = $.ajax({
      type: 'POST',
      url: this.state.APIURL + '/VXE/VxeChapterLog',
      data: {
        project_id: project_id,
        chapter_id: chapter_id,
        chapter_name: chapter_name,
        user_id: user_id,
      },
      async: false,
    });
    var logobj = logcheck.responseText;
    var logvalue = $.parseJSON(logobj);
    if (logvalue.status === 'success') {
      // $('.pdf-editor').css({ 'pointer-events': '', opacity: '' });
      // $('#editor-tools-main').css({ 'pointer-events': '', opacity: '' });
      // $('.track-panel').css({ 'pointer-events': '', opacity: '' });

      setIsLoading(false, ['.main-container']);

      $('.pdf-editor').attr('contenteditable', 'true');
      $('.refIcon').attr('contenteditable', 'false');
      $('.pdf-editor *')
        .not('pageno')
        .not('table')
        .not('img')
        .not('front')
        .not('article-type')
        .not('notes')
        .not('doi')
        .not('copyright')
        .not('subjecteditor')
        .not('article')
        .not('jou')
        .not('name1')
        .not('jou')
        .not('rh')
        .not('pagenor')
        .not('pagenob')
        .not('pageno')
        .not('comment')
        .not('query')
        .attr('contenteditable', 'true');
      $(
        'pageno, table, img, rh, lh, pagenor, pageno, pagenob, comment, query, footnote1, article, front, jou, name1, article-meta, article, article-type, copyright, subjecteditor, notes, doi'
      ).attr('contenteditable', 'false');
      $('.del').attr('contenteditable', 'false');
      $('#content .del').attr('contenteditable', 'false');
      $('footnote1 *').attr('contenteditable', 'false');
      $('tp, td').attr('contenteditable', 'true');
      var task_id = $('#taskid').val();
      if (task_id === '') {
        task_id = 0;
      }
      var milestone_id = '123';
      var user_ipaddress = $('#ipaddress').text();
      var status_id = logvalue.status_logid;
      $.ajax({
        type: 'POST',
        url: this.state.APIURL + '/VXE/OxygenlogInsert',
        data: {
          project_id: project_id,
          chapter_id: chapter_id,
          task_id: task_id,
          milestone_id: milestone_id,
          chapter_name: chapter_name,
          user_id: user_id,
          user_ipaddress: user_ipaddress,
          status_id: status_id,
        },
        beforeSend: function () {},
        success: function (res) {},
        error: function (x, e) {},
      });
    } else {
      this.setState({ openLogModal: true });
      $('#vxe-log-warning').text(
        'Lanstad XML Editor is used by ' + logvalue.user_name
      );
      $('.pdf-editor *').attr('contenteditable', 'false');
      // $('.pdf-editor').css({ 'pointer-events': 'none', opacity: '0.2' });
      // $('#editor-tools-main').css({ 'pointer-events': 'none', opacity: '0.2' });
      // $('.track-panel').css({ 'pointer-events': 'none', opacity: '0.2' });

      setIsLoading(true, ['.main-container']);
    }
    //setIsLoading(false);
  };

  journaltoc = () => {
    fetch(
      this.state.APIURL +
        '/VXE/JournalToc/' +
        this.state.ProjectId +
        '/' +
        this.state.ChapterId +
        '/' +
        this.state.selectedChapterXmlName
    )
      .then((res) => res.json())
      .then((data) => {
        $.each(data.response, function (index, item) {
          if (index !== 'chapter_title') {
            $('#toc_container').append(
              '<h3 class="toc-tag" onclick="toc_validation_search(' +
                String.fromCharCode(39) +
                '' +
                index +
                '' +
                String.fromCharCode(39) +
                ');">' +
                item.value +
                '</h3>'
            );
            var itemlen = Object.keys(item).length;
            if (itemlen > 0) {
              $.each(item, function (i, k) {
                if (i !== 'value')
                  $('#toc_container').append(
                    '<h4 class="toc-heading"><a class="validation-value" onclick="toc_validation_search(' +
                      String.fromCharCode(39) +
                      '' +
                      i +
                      '' +
                      String.fromCharCode(39) +
                      ');">' +
                      k +
                      '</a></h4>'
                  );
              });
            }
          }
        });
      })
      .catch(console.log);
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.setRightSiderHeight.bind(this));
    clearInterval(this.intervalId);
  }

  componentDidUpdate() {
    this.setRightSiderHeight();
  }

  trackInit() {
    var text = document.getElementById('content');
    window.tracker = new window.ice.InlineChangeEditor({
      element: text,
      handleEvents: true,
      currentUser: {
        id: this.state.userData.id,
        name: this.state.userData.name,
      },
      plugins: [
        'IceAddTitlePlugin',
        'IceSmartQuotesPlugin',
        'IceEmdashPlugin',
        {
          name: 'IceCopyPastePlugin',
          settings: {
            pasteType: 'formattedClean',
            preserve:
              'i,em,b,para,sub,sup,s,u,sc,uc,table,tbody,thead,tr,td,pp1',
          },
        },
      ],
    }).startTracking();
  }

  trackArtMeta() {
    var text = document.getElementById('myModalfront');
    window.tracker = new window.ice.InlineChangeEditor({
      element: text,
      handleEvents: true,
      currentUser: {
        id: this.state.userData.id,
        name: this.state.userData.name,
      },
      plugins: [
        'IceAddTitlePlugin',
        'IceSmartQuotesPlugin',
        'IceEmdashPlugin',
        {
          name: 'IceCopyPastePlugin',
          settings: {
            pasteType: 'formattedClean',
            preserve: 'i,em,b,para,sub,sup,s,u,sc,uc,table,tbody,thead,tr,td',
          },
        },
      ],
    }).startTracking();
  }

  showStyleEditor = (show) => {
    let showClass = 'showClass';
    let hideClass = 'hideClass';
    if (show)
      this.setState({
        showOrHideStyleEdit: showClass,
        showOrHideContentValidation: hideClass,
        showOrHideGrammerChecker: hideClass,
        showOrHideSpellCheck: hideClass,
      });
    else this.setState({ showOrHideStyleEdit: hideClass });
  };

  showContentValidation = (show) => {
    let showClass = 'showClass';
    let hideClass = 'hideClass';
    if (show)
      this.setState({
        showOrHideContentValidation: showClass,
        showOrHideStyleEdit: hideClass,
        showOrHideGrammerChecker: hideClass,
        showOrHideSpellCheck: hideClass,
      });
    else this.setState({ showOrHideContentValidation: hideClass });
    this.renderContentValidation();
  };

  showConsistency = (show) => {
    let showClass = 'showClass';
    let hideClass = 'hideClass';

    if (show) {
      this.setState({
        showOrHideConsistency: showClass,
        showOrHideContentValidation: hideClass,
        showOrHideStyleEdit: hideClass,
        showOrHideGrammerChecker: hideClass,
        showOrHideSpellCheck: hideClass,
      });
      fetch(
        this.state.APIURL +
          '/VXE/ConsistencyValidationJournals/' +
          this.state.ProjectId +
          '/' +
          this.state.ChapterId +
          '/' +
          this.state.selectedChapterXmlName
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          $('.consistency-response').empty();
          $.each(data.response, function (index, value) {
            if (index !== 'Hyphenated Words') {
              var id = index.replace(' ', '-');
              var str = '';

              $('.consistency-response').append(
                "<div class='content-row'><h2 class='validation-title' >" +
                  index +
                  ' (' +
                  value.length +
                  ")</h2><ol id='" +
                  id +
                  "'>"
              );
              if (value.length > 0) {
                if (index === 'Abbreviations') {
                  $.each(value, function (i, k) {
                    $('#' + id).append(
                      '<li class="consist-li"><a class="validation-value" onclick="style_editing_search(' +
                        String.fromCharCode(39) +
                        '' +
                        k.id.toString().trim() +
                        '' +
                        String.fromCharCode(39) +
                        ');">' +
                        k.value +
                        '</span></li>'
                    );
                  });
                  $('#' + id).append('</ol></div>');
                } else if (index === 'Formatting') {
                  $.each(value, function (i, k) {
                    $('#' + id).append(
                      '<li class="consist-li"><a class="validation-value" onclick="style_editing_search(' +
                        String.fromCharCode(39) +
                        '' +
                        k.value +
                        '' +
                        String.fromCharCode(39) +
                        ',' +
                        String.fromCharCode(39) +
                        '1' +
                        String.fromCharCode(39) +
                        ');">' +
                        k.value +
                        ' (' +
                        k.count +
                        ')</span></li>'
                    );
                  });
                  $('#' + id).append('</ol></div>');
                } else if (index === 'Hyphenated Words') {
                  $.each(value, function (i, k) {
                    var hyp_value = Object.keys(k);
                    $('#' + id).append(
                      "<li><h4 class='validation-ref'>" +
                        hyp_value +
                        "</h4><ul class='ref-ul' id='ref_" +
                        i +
                        "'>"
                    );
                    $.each(k, function (x, kvalue) {
                      $.each(kvalue, function (x, strvalue) {
                        console.log(kvalue);
                        $('#ref_' + i).append(
                          '<li><a class="validation-value" onclick="style_editing_search(' +
                            String.fromCharCode(39) +
                            '' +
                            strvalue.toString().trim() +
                            '' +
                            String.fromCharCode(39) +
                            ');">' +
                            strvalue +
                            '</span></li>'
                        );
                      });
                    });

                    $('#' + id).append('</ol></li>');
                  });
                  $('#' + id).append('</ol></div>');
                } else {
                  $.each(value, function (i, k) {
                    var key_value = Object.keys(k);
                    $('#' + id).append(
                      "<li><h4 class='validation-ref'>" +
                        key_value +
                        "</h4><ul class='ref-ul' id='ref_" +
                        i +
                        "'>"
                    );
                    $.each(k, function (x, kvalue) {
                      $.each(kvalue, function (x, strvalue) {
                        console.log(kvalue);
                        $('#ref_' + i).append(
                          '<li><a class="validation-value" onclick="style_editing_search(' +
                            String.fromCharCode(39) +
                            '' +
                            strvalue.toString().trim() +
                            '' +
                            String.fromCharCode(39) +
                            ');">' +
                            strvalue +
                            '</span></li>'
                        );
                      });
                    });

                    $('#' + id).append('</ol></li>');
                  });
                  $('#' + id).append('</ol></div>');
                }
              } else {
                $('#' + id).append('</ol></div>');
              }
            } else {
              var id = index.replace(' ', '-');

              $('.consistency-response').append(
                "<div class='content-row'><h2 class='validation-title' >" +
                  index +
                  "</h2><ol id='" +
                  id +
                  "'>"
              );

              $.map(value, function (i, k) {
                console.log(k);
                $('#' + id).append(
                  "<li><h4 class='validation-ref'>" +
                    k +
                    "</h4><ul class='ref-ul' id='hyp_" +
                    k +
                    "'>"
                );
                $.each(i, function (x, kvalue) {
                  console.log(kvalue);
                  $('#hyp_' + k).append(
                    '<li><a class="validation-value" onclick="style_editing_search(' +
                      String.fromCharCode(39) +
                      '' +
                      kvalue.toString().trim() +
                      '' +
                      String.fromCharCode(39) +
                      ');">' +
                      kvalue +
                      '</span></li>'
                  );
                });

                $('#' + id).append('</ol></li>');
              });
              $('#' + id).append('</ol></div>');
            }
          });
        })
        .catch(console.log);
    } else {
      this.setState({ showOrHideConsistency: hideClass });
    }
  };

  showGrammerChecker = (show) => {
    let showClass = 'showClass';
    let hideClass = 'hideClass';
    if (show)
      this.setState({
        showOrHideGrammerChecker: showClass,
        showOrHideStyleEdit: hideClass,
        showOrHideContentValidation: hideClass,
        showOrHideConsistency: hideClass,
        showOrHideSpellCheck: hideClass,
      });
    else this.setState({ showOrHideGrammerChecker: hideClass });
    $('.language-content-row').html('');
    this.getGrammerChangeContent();
  };

  showSpellChecker = (show) => {
    $('#replaceVal').val('');
    let showClass = 'showClass';
    let hideClass = 'hideClass';
    if (show) {
      this.setState({
        showOrHideSpellCheck: showClass,
        showOrHideStyleEdit: hideClass,
        showOrHideContentValidation: hideClass,
        showOrHideConsistency: hideClass,
        showOrHideGrammerChecker: hideClass,
      });
      $('.spellcheck_value').val(0);
      window.correctSpelling();
      $('.btn-clear').addClass('hide');
    } else {
      this.setState({ showOrHideSpellCheck: hideClass });
      $("#content [style='background-color: rgb(188, 188, 190);']").removeAttr(
        'style'
      );
      $(".found[style='background-color: rgb(188, 188, 190);']").removeAttr(
        'style'
      );
      $('.found').removeAttr('id');
      $('span.found').contents().unwrap();
      $('#content *').removeClass('found');
      $('.cstm-adv-srch input[type="checkbox"]').prop('checked', false);
      $('.cstm-adv-srch-bdy input').val('');
      $('.collapse').removeClass('show');
      $('#search-result-id').html('');
      $('.btn-clear').addClass('hide');
      $('.search-result').css('padding', '0px');
    }
  };

  getGrammerChangeContent = () => {
    let incorrectContent = document.querySelectorAll('#content .grammer');
    incorrectContent = Array.from(incorrectContent);

    incorrectContent.forEach((incorrectContentItem) => {
      var rejId = $(incorrectContentItem).parent().attr('data-time');
      var accId = $(incorrectContentItem).parent().next().attr('data-time');
      var multiSugStorId = $(incorrectContentItem).attr('store');
      var suggestionLists = $(
        'word[text="' + incorrectContentItem.innerText + '"]'
      )
        .find('suggestions')
        .children();
      suggestionLists = Array.from(suggestionLists);
      var acceptRejectBtn =
        this.state.vxePermissions.track_changes.accept_changes &&
        this.state.vxePermissions.track_changes.reject_changes
          ? '<i class="material-icons cstm-danger-color float-right accept-lang-reject ml-2" onClick="rejectLangCorrection(' +
            rejId +
            ',' +
            accId +
            '); event.stopPropagation();"  aria-hidden="true">close</i><i class="material-icons cstm-success-color float-right accept-lang-accept" onClick="acceptLangCorrection(' +
            rejId +
            ',' +
            accId +
            '); event.stopPropagation(); " aria-hidden="true">done</i>'
          : '';

      if (incorrectContentItem.attributes.role.value == 'grammer2') {
        var categoryVal = incorrectContentItem.attributes.category.value;
        var storeId = incorrectContentItem.attributes.store.value;
        var categoryValue = categoryVal;
        var newCategoryVal = categoryVal.split(' ');

        if (newCategoryVal.length > 0) categoryVal = newCategoryVal[0];
        var a =
          '<div class="languague-content-row content-row" lang-id="' +
          rejId +
          '"  onClick="scrollToGrammer2(' +
          storeId +
          ')"><h2 class="language-header">' +
          categoryValue +
          '</h2>';
        var b =
          '<ul class="language-actual-content"><li><a class="toggle-icon" data-toggle="collapse" href="#' +
          categoryVal +
          '" aria-expanded="false" aria-controls="collapseExample">' +
          incorrectContentItem.innerText +
          ' <i class="material-icons">keyboard_arrow_down</i></a><ul class="language-replace-' +
          categoryVal +
          ' collapse collapse-box" id="' +
          categoryVal +
          '"></ul></li></ul></div>';
        $('.language-content').append(a + b);
        suggestionLists.forEach((suggestionList) => {
          var d = suggestionList.innerText;
          var c =
            "<li class='language-replace-content' id='multiSugg' link-id='" +
            multiSugStorId +
            "'>" +
            suggestionList.innerText +
            '</li>';
          $('.language-replace-' + categoryVal).append(c);
        });
      } else {
        var a =
          '<div class="languague-content-row content-row" lang-id="' +
          rejId +
          '" onClick="scrollToViewContent(' +
          rejId +
          ', true)"><h2 class="language-header">' +
          incorrectContentItem.attributes['category'].value +
          '</h2>';
        var b =
          '<ul class="language-actual-content"><li class="language-replace-content">' +
          suggestionLists[0].innerText +
          acceptRejectBtn +
          '</li></ul></div>';
        $('.language-content').append(a + b);
      }
    });
  };

  addRefLink = () => {
    let refLinkTags = document.querySelectorAll(
      '#content xref[ref-type=bibr], #content xref[ref-type=fig], #content xref[ref-type=table]'
    );
    let refLinkTagsArr = Array.from(refLinkTags);
    let refLinkSpan = '<span class="refIcon"></span>';
    refLinkTagsArr.forEach((link) => {
      if (!$(link).prev().hasClass('refIcon')) $(link).before(refLinkSpan);
    });
  };

  getTrackedData = () => {
    let delItems = document.querySelectorAll('#content [data-time]');
    let delItemsArr = Array.from(delItems);
    let allTrackingTagAttr = [];
    delItemsArr.forEach((item) => {
      let trackTime;
      if (item.tagName === 'REF') {
        trackTime = new Date(
          parseInt(item.attributes['data-time'].value.split('-')[1])
        );
      } else {
        trackTime = new Date(parseInt(item.attributes['data-time'].value));
      }
      item.setAttribute('data-date', trackTime.toLocaleString());
      if (item.tagName == 'COMMENT') {
        if (item.getAttribute('status') == null)
          item.setAttribute('status', '');
      }
      allTrackingTagAttr.push(item);
    });
    this.setState({ trackData: allTrackingTagAttr });
    var highlightLength = $('#content .add-highlights').length;
    if (highlightLength > 0) {
      $('#content .add-highlights').removeClass('add-highlights');
    }
    this.trackListCount();
  };

  renderContentValidation() {
    fetch(
      this.state.APIURL +
        '/VXE/ContentValidationJournals/' +
        this.state.ProjectId +
        '/' +
        this.state.ChapterId +
        '/' +
        this.state.selectedChapterXmlName
    )
      .then((res) => res.json())
      .then((data) => {
        var sta = data.status;
        if (sta === 'success') {
          this.setState({ contentValidationVal: data.newResponse });
        }
      })
      .catch(console.log);
  }

  referenceColor() {
    var contentElement = document.getElementById('content');
    var element = contentElement.querySelectorAll("ref:not([role='color'])"),
      i,
      j,
      k,
      sel,
      range;
    $("#content ref[role='color']").remove();
    $('#colorRef').removeClass('hide');
    if (element.length > 0) {
      var fontLen = 1;
      for (i = 0; i < element.length; ++i) {
        var ele = element[i];
        this.colorSingleRef(ele, fontLen);
      }
    }
    $('#colorRef').addClass('hide');
  }

  referenceColorMap(node, includeWhitespaceNodes) {
    var textNodes = [],
      whitespace = /^\s*$/;
    var authorText = '';
    var authorNum = '';
    var j = 1;
    function getTextNodes(node, authorNum) {
      if (node.nodeType == 3) {
        // if (includeWhitespaceNodes || !whitespace.test(node.nodeValue)) {
        var parentTagName = node.parentElement.parentElement.tagName;
        var nodeTagName = node.parentElement.tagName;
        textNodes.push({
          nodeVal: node,
          parentNodeVal: parentTagName,
          nodeTagName: nodeTagName,
          authorNum: authorNum,
        });
        // }
      } else {
        for (var i = 0, len = node.childNodes.length; i < len; ++i) {
          var authorNum = validateAuthor(node);
          getTextNodes(node.childNodes[i], authorNum);
        }
      }
    }
    function validateAuthor(node) {
      var nodeTag = node.tagName;
      var res = '';
      if (node !== null) {
      }
      if (nodeTag !== 'NAME' || nodeTag !== 'EDITOR') {
        node = node.closest('name,editor');
        if (node !== null) {
          nodeTag = node.tagName;
        }
      }
      if (nodeTag === 'NAME' || nodeTag === 'EDITOR') {
        var authorT = node.innerText;
        if (authorText === '' || authorText != authorT) {
          authorText = authorT;
          res = 'author' + j;
          authorNum = res;
          j++;
        } else {
          res = authorNum;
        }
      } else {
        authorNum = '';
      }
      return res;
    }
    getTextNodes(node);
    return textNodes;
  }

  colorSingleRef(ele, fontLen) {
    let j, k;
    var groupEleArray = {};
    function setSelectionRange(el, start, end) {
      if (document.createRange && window.getSelection) {
        var range = document.createRange();
        range.selectNodeContents(el);
        var textNodes = getTextNodesIn(el);
        var foundStart = false;
        var charCount = 0,
          endCharCount;

        for (var i = 0, textNode; (textNode = textNodes[i++]); ) {
          endCharCount = charCount + textNode.length;
          if (
            !foundStart &&
            start >= charCount &&
            (start < endCharCount ||
              (start == endCharCount && i <= textNodes.length))
          ) {
            range.setStart(textNode, start - charCount);
            foundStart = true;
          }
          if (foundStart && end <= endCharCount) {
            range.setEnd(textNode, end - charCount);
            break;
          }
          charCount = endCharCount;
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else if (document.selection && document.body.createTextRange) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(true);
        textRange.moveEnd('character', end);
        textRange.moveStart('character', start);
        textRange.select();
      }
    }
    function getTextNodesIn(node) {
      var textNodes = [];
      if (node.nodeType == 3) {
        textNodes.push(node);
      } else {
        var children = node.childNodes;
        for (var i = 0, len = children.length; i < len; ++i) {
          textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
        }
      }
      return textNodes;
    }
    function setAction(action, val) {
      var range, sel;
      if (window.getSelection) {
        // IE9 and non-IE
        try {
          document.execCommand(action, false, val);
        } catch (ex) {
          document.execCommand(action, false, val);
        }
      } else if (document.selection && document.selection.createRange) {
        // IE <= 8 case
        range = document.selection.createRange();
        range.execCommand(action, false, val);
      }
    }
    var colorList = {
      SURNAME: '#0072ff',
      GIVENNAMES: '#96208c',
      YEAR: '#BA1419',
      DELIMITER: '#ff00f7',
      PUBLISHERNAME: '#f8b1b2',
      PUBLISHERLOC: '#2198cb',
      CHAPTERTITLE: '#d98282',
      VOLUME1: '#2da9bd',
      URI: '#914c4c',
      EDITION: '#1489ef',
      COLLAB: '#cc69de',
      SOURCE1: '#dc983a',
      ARTICLETITLE: '#0fd1d2',
      FPAGE1: '#b7ca19',
      LPAGE1: '#fb5302',
      PUBID: '#a1e009',
      ISSUE1: '#0b9428',
      NameBgColor: 'mistyrose',
      PERSONBgColor: 'khaki',
    };
    var storeId = ele.getAttribute('store');
    var editRef = ele.querySelector('span[data-role="ref-duplicate"]');
    if (editRef !== null) {
      ele = editRef.querySelector('mixed-citation');
    } else {
      ele = ele.querySelector('mixed-citation');
    }
    if (!!ele) {
      var groupEle = ele.querySelectorAll('person-group');
      for (k = 0; k < groupEle.length; ++k) {
        var groupElement = groupEle[k];
        var nameEle = groupElement.querySelectorAll('name');
        groupEleArray[k] = nameEle.length;
      }
      var groupI = 0;
      var eleList = this.referenceColorMap(ele);
      document.getElementById('colorRef').innerHTML = ele.innerText;
      var queryEle = ele.querySelectorAll('query,comment'),
        l;
      var queryArray = [];
      var commentArray = [];
      if (queryEle.length > 0) {
        for (l = 0; l < queryEle.length; ++l) {
          var queryTag = queryEle[l].tagName;
          var queryHtml = queryEle[l].outerHTML;
          if (queryTag === 'COMMENT') {
            commentArray.push(queryHtml);
          }
          if (queryTag === 'QUERY') {
            queryArray.push(queryHtml);
          }
        }
      }
      var start = 0;
      var textLength = 0;
      var queryLength = 0;
      var commentLength = 0;
      var highlightStart,
        namehighlightStart = 0;
      var highlightEnable,
        namehighlightEnable = false;
      var highlightAction,
        namehighlightAction = '';
      for (j = 0; j < eleList.length; ++j) {
        var nodeEle = eleList[j];
        var node = nodeEle.nodeVal;
        var parentval = nodeEle.parentNodeVal;
        var nextParentVal = '';
        var nextAuthorNum = '';
        var authorNum = nodeEle.authorNum;
        if (j + 1 < eleList.length) {
          var nextNode = eleList[j + 1];
          nextParentVal = nextNode.parentNodeVal;
          nextAuthorNum = nextNode.authorNum;
        }
        var tagName = node.parentElement.tagName;
        if (
          tagName === 'SURNAME' ||
          tagName === 'GIVEN-NAMES' ||
          tagName === 'NAME' ||
          tagName === 'PERSON-GROUP'
        ) {
          if (tagName !== 'NAME') {
            var nameStoreId =
              node.parentElement.parentElement.getAttribute('store');
            var grouptagName = node.parentElement.parentElement.tagName;
          } else {
            var nameStoreId = node.parentElement.getAttribute('store');
            var grouptagName =
              node.parentElement.parentElement.parentElement.tagName;
          }
          var nextNode = eleList[j + 1];
          nextNode = nextNode.nodeVal;
          var nextTagName = nextNode.parentElement.tagName;
          var nameNextStoreId = '';
          if (
            nextTagName === 'SURNAME' ||
            nextTagName === 'GIVEN-NAMES' ||
            nextTagName === 'NAME' ||
            tagName === 'PERSON-GROUP'
          ) {
            if (nextTagName !== 'NAME') {
              nameNextStoreId =
                nextNode.parentElement.parentElement.getAttribute('store');
            } else {
              nameNextStoreId = nextNode.parentElement.getAttribute('store');
            }
          }
          if (namehighlightEnable) {
            if (nameStoreId != nameNextStoreId) {
              namehighlightAction = 'end';
            }
          } else {
            namehighlightEnable = true;
            namehighlightStart = start;
            namehighlightAction = 'Start';
            if (nameStoreId != nameNextStoreId) {
              namehighlightAction = 'end';
            }
          }
          if (
            nextTagName !== 'SURNAME' &&
            nextTagName !== 'GIVEN-NAMES' &&
            nextTagName !== 'NAME' &&
            nextTagName !== 'PERSON-GROUP'
          ) {
            highlightAction = 'end';
          }
          if (!highlightEnable) {
            highlightEnable = true;
            highlightStart = start;
            highlightAction = 'Start';
          }
        }
        if (authorNum !== '') {
          if (namehighlightEnable) {
            if (authorNum != nextAuthorNum) {
              namehighlightAction = 'end';
            }
          } else {
            namehighlightEnable = true;
            namehighlightStart = start;
            namehighlightAction = 'Start';
            if (authorNum != nextAuthorNum) {
              namehighlightAction = 'end';
            }
          }
        }
        var nodeLength = node.length;
        var parentTagName = node.parentElement.parentElement.tagName;
        textLength = textLength + nodeLength;
        var end = textLength;
        var color = colorList[tagName];
        if (color === undefined) {
          color = '';
        }
        if (tagName === 'ARTICLE-TITLE') {
          color = colorList['ARTICLETITLE'];
        }
        if (tagName === 'PUBLISHER-NAME') {
          color = colorList['PUBLISHERNAME'];
        }
        if (tagName === 'PUBLISHER-LOC') {
          color = colorList['PUBLISHERLOC'];
        }
        if (tagName === 'CHAPTER-TITLE') {
          color = colorList['CHAPTERTITLE'];
        }
        if (tagName === 'GIVEN-NAMES') {
          color = colorList['GIVENNAMES'];
        }
        if (tagName === 'PUB-ID') {
          color = colorList['PUBID'];
        }
        var titleBg = colorList['titleBgColor'];
        if (tagName === 'I') {
          if (parentTagName === 'TITLE1') {
            color = colorList['TITLE1'];
            var titleRole =
              node.parentElement.parentElement.getAttribute('role');
            var titleParentRole =
              node.parentElement.parentElement.parentElement.tagName;
            if (titleRole === 'booktitle') {
              color = colorList['booktitle'];
              titleBg = colorList['booktitleBgColor'];
            }
            if (titleRole === 'chapter-title') {
              color = colorList['chaptertitle'];
              titleBg = colorList['chaptertitleBgColor'];
            }
            if (titleParentRole === 'BIBLIOMSET') {
              color = colorList['BIBLIOMSET'];
              titleBg = colorList['BIBLIOMSETBgColor'];
            }
          }
        }
        if (tagName === 'TITLE1') {
          color = colorList['TITLE1'];
          var titleRole = node.parentElement.getAttribute('role');
          var titleParentRole = node.parentElement.parentElement.tagName;
          if (titleRole === 'booktitle') {
            color = colorList['booktitle'];
            titleBg = colorList['booktitleBgColor'];
          }
          if (titleRole === 'chapter-title') {
            color = colorList['chaptertitle'];
            titleBg = colorList['chaptertitleBgColor'];
          }
          if (titleParentRole === 'BIBLIOMSET') {
            color = colorList['BIBLIOMSET'];
            titleBg = colorList['BIBLIOMSETBgColor'];
          }
        }
        if (tagName === 'I' || tagName === 'B') {
          color = colorList[parentTagName];
        }
        var titleAtr = nodeEle.nodeTagName;
        if (color !== '') {
          setSelectionRange(document.getElementById('colorRef'), start, end);
          setAction('foreColor', color);
          var selectedEle = window.getSelectedNode();
          if (titleAtr === 'I' && parentval !== 'MIXED-CITATION') {
            titleAtr = parentval;
          }
          titleAtr = titleAtr.replace('1', '');
          selectedEle.setAttribute('title', titleAtr);
          selectedEle.setAttribute('store', 'font' + fontLen);
          fontLen++;
        } else {
          setSelectionRange(document.getElementById('colorRef'), start, end);
          if (titleAtr === 'COMMENT') {
            var commentStr = commentArray[commentLength];
            commentLength++;
            document.execCommand('insertHTML', false, commentStr);
          }
          if (titleAtr === 'QUERY') {
            var queryStr = queryArray[queryLength];
            queryLength++;
            document.execCommand('insertHTML', false, queryStr);
          }
        }
        if (namehighlightEnable && namehighlightAction == 'end') {
          namehighlightAction = '';
          namehighlightEnable = false;
          setSelectionRange(
            document.getElementById('colorRef'),
            namehighlightStart,
            end
          );
          var bgColor = '';
          if (parentval === 'NAME') {
            bgColor = colorList['NameBgColor'];
            setAction('hiliteColor', bgColor);
            var txtele = window.getSelectedNode();
            if (txtele !== null && txtele.tagName !== 'SPAN') {
              txtele = txtele.closest('span');
              if (txtele !== null) {
                txtele.setAttribute('id', authorNum);
                txtele.setAttribute('store', 'font' + fontLen);
                txtele.setAttribute('data-title', 'NAME');
                fontLen++;
              }
            }
          }
        }
        if (highlightEnable && highlightAction == 'end') {
          highlightAction = '';
          highlightEnable = false;
          setSelectionRange(
            document.getElementById('colorRef'),
            highlightStart,
            end
          );
          bgColor = colorList['PERSONBgColor'];
          var htmlNode = window.getHTMLOfSelection();
          var nameLength = groupEleArray[groupI];
          groupI++;
          $('#newlist').html(htmlNode);
          var spanLength = $('#newlist').find('span').length;
          var txtele = window.getSelectedNode();
          if (txtele !== null && txtele.tagName !== 'SPAN') {
            txtele = txtele.closest('span');
            if (txtele !== null) {
              txtele.setAttribute('id', authorNum);
            }
          }
          if (nameLength === 1 && spanLength === 0) {
            document.execCommand(
              'insertHTML',
              false,
              "<person style='background-color: " +
                bgColor +
                ";'><span style='background-color: mistyrose;' id='" +
                authorNum +
                "' store='font" +
                fontLen +
                "'>" +
                htmlNode +
                '</span></person>'
            );
            fontLen++;
          } else {
            document.execCommand(
              'insertHTML',
              false,
              "<person style='background-color: " +
                bgColor +
                ";' store='font" +
                fontLen +
                "'>" +
                htmlNode +
                '</person>'
            );
            fontLen++;
          }
          // setAction('insertHTML',bgColor);
        }
        if (parentTagName === 'TITLE1' || tagName === 'TITLE1') {
          setAction('hiliteColor', titleBg);
          var selectedEle = window.getSelectedNode();
          selectedEle.setAttribute('store', 'font' + fontLen);
          fontLen++;
        }
        if (tagName === 'I') {
          setAction('italic', '');
          var selectedEle = window.getSelectedNode();
          selectedEle.setAttribute('store', 'font' + fontLen);
          fontLen++;
        }
        if (tagName === 'B') {
          setAction('bold', '');
          var selectedEle = window.getSelectedNode();
          selectedEle.setAttribute('store', 'font' + fontLen);
          fontLen++;
        }
        start = end;
      }
      var colorRef = document.getElementById('colorRef').innerHTML;
      $("#content ref[store='" + storeId + "']")
        .find('mixed-citation')
        .html(colorRef);
    }
  }

  render() {
    var fullname = this.state.userData.name;
    var sectname = this.state.userData.lastname;
    if (sectname !== '') {
      fullname = this.state.userData.name + ' ' + this.state.userData.lastname;
    }
    const {
      openLogModal,
      selectedChapter,
      trackData,
      selectedChapterXml,
      showOrHideStyleEdit,
      consistencyRespData,
      trackCount,
      showOrHideContentValidation,
      showOrHideConsistency,
      contentValidationVal,
      showOrHideGrammerChecker,
      showOrHideSpellCheck,
      trackSpellData,
      contentValidationProp,
      vxePermissions,
      loading,
    } = this.state;
    return (
      <div>
        {loading && <Loading loadingText={'Loading...'} />}
        <JournalsHeader />
        <Row className="m-0 ml-15-px main-container">
          {openLogModal && (
            <DynamicModal
              modalName=""
              modalId="modal-vxe-log"
              modalSize="md"
              modalIsClose={this.VXELogModalClose}
            >
              <div id="vxe-log-warning"></div>
            </DynamicModal>
          )}
          <OverviewTool
            permissions={
              vxePermissions
                ? {
                    ...vxePermissions.find_and_replace,
                    ...vxePermissions.basic_features,
                  }
                : {}
            }
            ProjectId={this.state.ProjectId}
            showSpellChecker={this.showSpellChecker}
            trackSpellData={trackSpellData}
            showOrHideSpellCheck={showOrHideSpellCheck}
          />
          <EditorTool
            permissions={vxePermissions ? vxePermissions.basic_features : {}}
            selectedChapter={selectedChapter}
            getTrackedData={this.getTrackedData}
            selectedChapterXml={selectedChapterXml}
            showStyleEditor={this.showStyleEditor}
            showContentValidation={this.showContentValidation}
            showFindPanel={this.showFindPanel}
            showGrammerChecker={this.showGrammerChecker}
            showConsistency={this.showConsistency}
            ProjectId={this.state.ProjectId}
            showSpellChecker={this.showSpellChecker}
          />
          <DynamicTool
            permissions={vxePermissions}
            APIURL={this.state.APIURL}
            contentValidationProp={contentValidationProp}
            selectedChapterXmlName={this.state.selectedChapterXmlName}
            showContentValidation={this.showContentValidation}
            showOrHideContentValidation={showOrHideContentValidation}
            contentValidationVal={contentValidationVal}
            showStyleEditor={this.showStyleEditor}
            showOrHideStyleEdit={showOrHideStyleEdit}
            showOrHideConsistency={showOrHideConsistency}
            ProjectId={this.state.ProjectId}
            ChapterId={this.state.ChapterId}
            consistencyRespData={consistencyRespData}
            finalitalic_duplication={this.state.finalitalic_duplication}
            finalbold_duplication={this.state.finalbold_duplication}
            captilization_list={this.state.captilization_list}
            showConsistency={this.showConsistency}
            showOrHideGrammerChecker={showOrHideGrammerChecker}
            showGrammerChecker={this.showGrammerChecker}
            trackData={trackData}
            trackCount={trackCount}
            pdfIsCreated={this.state.pdfIsCreated}
          />
        </Row>
        <BreadCrumb
          permissions={vxePermissions ? vxePermissions.right_click : {}}
          basicpermissions={vxePermissions ? vxePermissions.basic_features : {}}
        />
        <input type="hidden" className="localstorevalue" value="0" />
        <input type="hidden" className="localstoregetvalue" value="" />
        <input type="hidden" className="localstoreredovalue" value="" />
        <input type="hidden" className="limitforredovalue" value="" />
        <input type="hidden" id="fmChangesCount" value="0" />
        <input type="hidden" id="fmUndoChangesCount" value="0" />
        <input type="hidden" id="lock" value="false" />
        <input type="hidden" id="storedata" value="Storedata" />
        <input type="hidden" className="savexml_changes" value="0" />
        <input
          type="hidden"
          id="chaptername"
          value={this.state.selectedChapterName}
        />
        <input
          type="hidden"
          id="chapterxmlname"
          value={this.state.selectedChapterXmlName}
        />
        <input
          type="hidden"
          id="chapterprefix"
          value={this.state.selectedChapterPrefix}
        />
        <input type="hidden" id="projectid" value={this.state.ProjectId} />
        <input type="hidden" id="chapterid" value={this.state.ChapterId} />
        <input type="hidden" id="api_url" value={this.state.APIURL} />
        <input type="hidden" id="username" value={fullname} />
        <input type="hidden" id="userid" value={this.state.userData.id} />
        <input type="hidden" id="taskid" />
        <input
          type="hidden"
          id="vxePermis"
          value={JSON.stringify(this.state.vxePermissions)}
        />
        <div id="ipaddress" className="hide"></div>
        <input type="hidden" id="change-element" />
        <textarea id="store_mathml" className="hide"></textarea>
        <input type="hidden" name="savingStatus" id="savingStatus" />
        <div className="bread-crumbs"></div>
        <div id="newlist" className="hide"></div>
        <div className="storelocal_data hide"></div>
        <div className="storeredo_data hide"></div>
        <div className="reference_org hide"></div>
        <textarea id="refprevious" className="hide"></textarea>
        <textarea id="refcurrent" className="hide"></textarea>
        <div className="picadiff hide">
          <div className="picadiff-content">
            <div className="left"></div>
            <div className="right"></div>
          </div>
        </div>
        <div className="finalreference hide"></div>
        <div id="colorRef" contentEditable="true"></div>
        <div id="finalSpanReference" className="hide"></div>
        <div id="xmlCopy" className="hide"></div>
        <input
          type="hidden"
          name="rightclickaction"
          id="rightclickaction"
          value="0"
        />
        <input
          type="hidden"
          name="rightclickactiondt"
          id="rightclickactiondt"
          value=""
        />
        <input type="hidden" name="character_count" id="character_count" />
        <input type="hidden" className="other_replaceword" />
        <input type="hidden" className="replace_hyphen" />
        <div type="text" className="table_attr hide"></div>
        <div type="text" className="hide" id="style_regex"></div>
        <div id="wildcharacter"></div>
        <>
          <div id="loading-wrapper2" className="loader-hide">
            <div className="loader">
              <div className="brand">
                <svg
                  width="30px"
                  height="30px"
                  viewBox="0 0 45 45"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <defs>
                    <rect
                      id="path-1"
                      x="0"
                      y="0"
                      width="45"
                      height="45"
                      rx="22.5"
                    ></rect>
                  </defs>
                  <g
                    id="Books"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="brand"
                      transform="translate(22.500000, 22.500000) rotate(180.000000) translate(-22.500000, -22.500000) "
                    >
                      <mask id="mask-2" fill="white">
                        <use xlinkHref="#path-1"></use>
                      </mask>
                      <use
                        id="Rectangle-2"
                        fill="#EC662F"
                        xlinkHref="#path-1"
                      ></use>
                      <path
                        d="M22.5,0 L45,0 L45,0 L0,45 L0,22.5 C-1.52179594e-15,10.0735931 10.0735931,2.28269391e-15 22.5,0 Z"
                        id="Rectangle-3"
                        fill="#FCBF00"
                        mask="url(#mask-2)"
                      ></path>
                    </g>
                  </g>
                </svg>
              </div>
              <p>Loading...</p>
            </div>
          </div>
        </>
        <div id="store-fm-undo" className="hide"></div>
        <div id="store-fm-redo" className="hide"></div>
      </div>
    );
  }
}

export default Journals;











// import React from 'react';
// import EditorLayout from '../Journals/editorTool/editorLayout';

// export default function JournalsLayout() {
//     return (
//         <div>
//             <EditorLayout />
//         </div>
//     )
// }
