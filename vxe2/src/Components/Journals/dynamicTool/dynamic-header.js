import React from 'react';
import '../css/journals-main.css';
import Dropdown from 'react-bootstrap/Dropdown';
import $ from 'jquery';
import { getToken } from '../../../utils/authMethods';
import AIPredication from './dynamic-ai-predication';
import DynamicModal from '../modals/dynamic-modal';
import SubmitAttachmentData from '../submitAttachment/submitAttachment';//
import StyleList from './dynamic-style-list';
//import { setIsLoading } from '../../../utils/reusuableFunctions';
import { downloadBase64File } from '../../../utils/download';
import Loading from '../loading/spinningCircle';
const fileSizeLimit = 30720; // 300 MB upload file size limit

class DynamicHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openEditModal: false,
      PDFStatusModal: false,
      openStyleModal: false,
      openPdfModal: false,
      showXmlSuccess: false,
      showXmlFailed: false,
      ProjectId: props.ProjectId,
      ChapterId: props.ChapterId,
      UPLOADPDFModal: false,
      xml_filevalue: '',
      xml_file_err: '',
      xmluploadcontent: true,
      ARModal: false,
      prooftext: '',
      attachmentFile: [],
      prooftexterror: '',
      authorcontent: true,
      submitStatus: '',
      APIURL: props.APIURL,
      editorSubmittingText: 'Submit',
      statusText: '',
      diffFileStatus: '',
      showAttachmentError: false,
      token: '',
      loading: false,
    };
    this.fileDialog = React.createRef();
    this.AIPredicationModalClose = this.AIPredicationModalClose.bind(this);
    this.AIPredicationModal = this.AIPredicationModal.bind(this);
    this.StyleModalClose = this.StyleModalClose.bind(this);
    this.PDFModelClose = this.PDFModelClose.bind(this);
    this.openPdfModelClose = this.openPdfModelClose.bind(this);
    this.XMLUPModelClose = this.XMLUPModelClose.bind(this);
    this.ARModalClose = this.ARModalClose.bind(this);
  }

  componentDidMount() {
    const token = getToken();
    this.setState({ token: token });
    this.intervalId = setInterval(this.timer.bind(this), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  timer() {
    //Close modal when pdf is done
    if (this.props.pdfIsCreated) {
      this.openPdfModelClose();
    }
  }

  AIPredicationModal = (childData) => {
    this.setState({ openEditModal: childData });
  };

  AIPredicationModalClose() {
    this.setState({ openEditModal: false });
  }

  StyleModalClose() {
    this.setState({ openStyleModal: false });
  }

  PDFModelClose() {
    this.setState({ PDFStatusModal: false });
  }

  openPdfModelClose() {
    this.setState({ openPdfModal: false });
  }

  XMLUPModelClose() {
    this.setState({ UPLOADPDFModal: false });
    this.setState({ xml_file_err: '' });
    this.setState({ xmluploadcontent: false });
    window.location.reload(false);
  }

  downloadOriginalManuscript = () => {
    let api_url = $('#api_url').val();
    let project_id = $('#projectid').val();
    fetch(api_url + '/VXE/originalManuscript/' + project_id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'lanstad-token': this.state.token,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        downloadBase64File(
          response.mimetype,
          response.content,
          response.file_name
        );
      });
  };

  onxmlfileHandler = (event) => {
    var xml_err = '';
    var file = event.target.files[0];
    var filename = file.name;
    var coming_file = filename.toLowerCase();
    var filename1 = this.props.selectedChapterXmlName;
    var org_file = filename1.toLowerCase();
    if (coming_file == org_file) {
      this.setState({ xml_filevalue: file });
      xml_err = '';
      this.setState({ xml_file_err: '' });
    } else {
      xml_err = "Filename doesn't match";
      this.setState({ xml_file_err: xml_err });
    }
  };

  UploadXMLSubmit = (event) => {
    event.preventDefault();
    var filename = event.target.xml_file.value;
    var xml_err = '';
    if (filename == '') {
      xml_err = 'file is empty';
      this.setState({ xml_file_err: xml_err });
    } else {
      var ext = filename.split('.').pop();
      if (ext != 'xml') {
        xml_err = 'XML file only accepted';
        this.setState({ xml_file_err: xml_err });
      } else {
        xml_err = '';
        this.setState({ xml_file_err: xml_err });
      }
    }
    if (xml_err == '') {
      const method = 'POST';
      const body = new FormData();
      body.append('bk_file', this.state.xml_filevalue);
      body.append('project_id', event.target.xml_project_id.value);
      body.append('filename', event.target.xml_filename.value);
      body.append('chapter_id', event.target.xml_chapter_id.value);
      body.append('user_id', event.target.xml_user_id.value);
      body.append('task_id', event.target.xml_task_id.value);

      var api_url = $('#api_url').val();
      fetch(api_url + '/VXE/UploadXmlVXE', { method, body })
        .then((res) => res.json())
        .then((data) => {
          if (data.status == 'success') {
            this.setState({ xmluploadcontent: false });
            this.setState({ showXmlSuccess: true });
          } else {
            this.setState({ showXmlFailed: true });
            this.setState({ xmluploadcontent: false });
          }
        });
    }
  };

  StyleConfig = () => {
    //setIsLoading(true, ['body']);
    this.setState({
      loading: true,
    });
    var checkboxes = document.getElementsByClassName('style-checkbox');
    var checkboxesChecked = [];
    var api_url = $('#api_url').val();
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        var groupname = checkboxes[i].getAttribute('data-group');
        var id = checkboxes[i].getAttribute('data-id');

        console.log('Group Name: ' + groupname);
        checkboxesChecked.push({
          id: id,
          name: checkboxes[i].value,
          groupname: groupname,
        });
      }
    }
    var project_id = $('#projectid').val();
    var chapter_id = $('#chapterid').val();
    fetch(api_url + '/VXE/StyleEditingConfig/', {
      method: 'POST',
      body: JSON.stringify({
        ProjectId: project_id,
        ChapterId: chapter_id,
        checkItem: checkboxesChecked,
        user_id: 183,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //setIsLoading(false, ['body']);
        this.setState({ openStyleModal: false, loading: false });
        window.location.reload(false);
      })
      .catch(console.log);
  };

  InDesignPDF(projectId) {
    let dataLocalStorage = JSON.parse(localStorage.getItem('proEditorData'));
    if (dataLocalStorage) {
      window.EditorTools.callAPI(dataLocalStorage);
      console.log(JSON.parse(localStorage.getItem('proEditorData')));
    }
    this.setState({ openPdfModal: true });
    var project_id = $('#projectid').val();
    var task_id = $('#taskid').val();
    var chapter_id = $('#chapterid').val();
    var user_id = $('#userid').val();
    var lxe_flag = 1;
    var filename1 = this.props.selectedChapterXmlName;
    var filename_path = 'test';
    var api_url = $('#api_url').val();
    this.setState({
      loading: true,
    });
    $.ajax({
      type: 'POST',
      url: api_url + '/VXE/ChapterPDF',
      data: {
        project_id: project_id,
        chapter_id: chapter_id,
        task_id: task_id,
        filename: filename1,
        filename_path: filename_path,
        user_id: user_id,
        lxe_flag: lxe_flag,
      },
      // beforeSend: function () {
      //   setIsLoading(true, ['body']);

      // },
      success: function (res) {
        console.log(res);
      },
    });
    this.setState({
      loading: false,
    });

    //setIsLoading(false, ['body']); //Question.   added this in as it looks like loader was set but not unset . correct if wrong??
  }

  AIstartup() {
    let data = {
      name: 'John',
      age: 30,
    };
    this.setState({
      openEditModal: true,
    });
  }

  onAuthoreHandler = (event) => {
    event.preventDefault();
    var proof_err = '';
    var prooftext = event.target.value;
    if (prooftext !== '' && prooftext !== null) {
      this.setState({ prooftext: prooftext });
      proof_err = '';
      this.setState({ prooftexterror: '' });
    } else {
      proof_err = 'Please give me any comments';
      this.setState({ prooftexterror: proof_err });
    }
  };

  removeAttachment = (e, removedIndex) => {
    e.preventDefault();
    let arr = [];
    this.state.attachmentFile.forEach((item, index) => {
      if (index !== removedIndex) {
        arr.push(item);
      }
    });
    this.setState({ attachmentFile: arr });
  };

  triggerChooseFile = (e) => {
    e.preventDefault();
    this.fileDialog.current.click();
  };

  onAuthorfileHandler = (e) => {
    let allowAttachment = true;
    const filesSelected = [...e.target.files];
    const filesToUpload = filesSelected.filter((file) => {
      if (file.size / 1024 > fileSizeLimit) {
        this.setState({
          statusText:
            'The file selected is too large. The maximum supported file size is 300MB.',
        });
        this.setState({ showAttachmentError: true });
        allowAttachment = false;
        return false;
      } else {
        this.setState({ showAttachmentError: false });
      }
    });
    if (allowAttachment) {
      let addAttachVal = this.state.attachmentFile.concat(filesSelected);
      this.setState({ attachmentFile: addAttachVal });
    }
  };

  AuthorSubmit = (event) => {
    event.preventDefault();
    var proof_err = '';
    var authorComments = this.state.prooftext;
    var magicCode = localStorage.getItem('magic-code');
    var lanstadToken = localStorage.getItem('lanstad-token');
    var user_id = $('#userid').val();
    var task_id = $('#taskid').val();

    if (authorComments !== '' && authorComments !== null) {
      this.setState({ editorSubmittingText: 'Submitting' });
      setInterval(() => {
        if (!this.state.editorSubmittingText.includes(`.`)) {
          this.setState({ editorSubmittingText: `Submitting.` });
        } else if (this.state.editorSubmittingText.includes(`...`)) {
          this.setState({ editorSubmittingText: `Submitting` });
        } else if (this.state.editorSubmittingText.includes(`..`)) {
          this.setState({ editorSubmittingText: `Submitting...` });
        } else if (this.state.editorSubmittingText.includes(`.`)) {
          this.setState({ editorSubmittingText: `Submitting..` });
        }
      }, 300);

      const method = 'POST';
      const body = new FormData();
      this.state.attachmentFile.forEach((image_file) => {
        body.append('author_file[]', image_file);
      });
      body.append('author_text', authorComments);
      body.append('project_id', event.target.project_id.value);
      body.append('filename', event.target.filename.value);
      body.append('chapter_id', event.target.chapter_id.value);
      body.append('user_id', user_id);
      body.append('task_id', task_id);
      body.append('magic_code', magicCode);
      body.append('lanstad_token', lanstadToken);

      var api_url = $('#api_url').val();
      fetch(api_url + '/VXE/AuthorSubmit', { method, body })
        .then((res) => res.json())
        .then((data) => {
          if (data.status == 'success') {
            this.setState({ authorcontent: false });
            this.setState({ submitStatus: 1 });
          } else {
            alert(JSON.stringify(data, null, '\t'));
          }
        });
    } else {
      proof_err = 'Please give me any comments';
      this.setState({ prooftexterror: proof_err });
    }
  };

  ARModalClose() {
    this.setState({ ARModal: false });
    this.setState({ prooftexterror: '' });
    this.setState({ authorcontent: false });
    if (this.state.submitStatus == 1) {
      // For Author Submit process
      window.parent.postMessage('submitReload', '*');
    } else {
      window.location.reload(false);
    }
  }
  //Question. there is a question below. if the answer to that is that we need to have a loader here then would it not make more sense to add it above the fetch and remove it after ??
  ChapterDownload = () => {
    var api_url = $('#api_url').val();
    var chapter_id = $('#chapterid').val();
    var project_id = $('#projectid').val();
    var user_id = $('#userid').val();
    fetch(api_url + '/VXE/ChapterPdfInProgress/', {
      method: 'POST',
      body: JSON.stringify({
        ProjectId: project_id,
        ChapterId: chapter_id,
        filename: this.props.selectedChapterXmlName,
        user_id: user_id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        $('.message-status').empty();
        $('#chapter_download').show();
        if (data.status_id == 1) {
          let a = document.createElement('a');
          a.target = '_blank';
          a.href =
            api_url +
            '/VXE/ChapterPdfDownloadJournals/' +
            project_id +
            '/' +
            chapter_id +
            '/' +
            this.props.selectedChapterXmlName;
          a.click();
        } else if (data.status_id == -1) {
          this.setState({ PDFStatusModal: true });
          $('.message-status').html(
            '<p class="pdf-msg">' +
              data.message +
              '</p><p class="pdf-error">' +
              data.remarks +
              '</p>'
          );
        } else {
          $('#chapter_download').hide();
          //Question - do we even need one here too? all this block of code does is add a loader and thats it?
          //todo bad code
          // var loaderlength = $(".loading-wrapper").length;
          // if (loaderlength === 0) {
          //   $(".thumb-pdf").append(
          //     '\
          //                   <div class="loading-wrapper">\
          //                       <div class="loader">\
          //                           <div class="brand">\
          //                           <svg width="30px" height="30px" viewBox="0 0 45 45" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><rect id="path-1" x="0" y="0" width="45" height="45" rx="22.5"></rect></defs><g id="Books" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="brand" transform="translate(22.500000, 22.500000) rotate(180.000000) translate(-22.500000, -22.500000) "><mask id="mask-2" fill="white"><use xlink:href="#path-1"></use></mask><use id="Rectangle-2" fill="#EC662F" xlink:href="#path-1"></use><path d="M22.5,0 L45,0 L45,0 L0,45 L0,22.5 C-1.52179594e-15,10.0735931 10.0735931,2.28269391e-15 22.5,0 Z" id="Rectangle-3" fill="#FCBF00" mask="url(#mask-2)"></path></g></g></svg>\
          //                           </div>\
          //                           <p>Creating PDF</p>\
          //                       </div>\
          //                   </div>\
          //               '
          //   );
          // }
          // $(".thumb-pdf .loading-wrapper").show();
        }

        if (data.generatedPDFstatus == 1) {
          $('#generate-pdf').show();
        } else {
          $('#generate-pdf').hide();
        }
        $('#taskid').val(data.taskId);
      })
      .catch(console.log);
  };

  fullScreenAction = () => {
    window.parent.postMessage('fullScreen', '*');
    $('#root').toggleClass('focus-mode-on');
  };

  Popup(data) {
    let cssVal =
      'footnote{text-indent:11pt;display:block;font-size:10.5pt}title-group>article-title{margin-top:35px;font-size:25px;margin-bottom:-19px;font-weight:700}minitoc{max-width:40em;padding:0;overflow-x:hidden;list-style:none}minitoc>para{overflow:hidden}minitoc>para1{overflow:hidden;font-size:11pt;display:block;text-indent:11pt}minitoc>para1:before{float:left;width:0;white-space:nowrap;content:". . . . . . . . . . . . . . . . . . . . " ". . . . . . . . . . . . . . . . . . . . " ". . . . . . . . . . . . . . . . . . . . " ". . . . . . . . . . . . . . . . . . . . "}minitoc>para:before{float:left;width:0;white-space:nowrap;content:". . . . . . . . . . . . . . . . . . . . " ". . . . . . . . . . . . . . . . . . . . " ". . . . . . . . . . . . . . . . . . . . " ". . . . . . . . . . . . . . . . . . . . "}minitoc span1{padding-right:.33em;background:#fff;overflow:hidden}minitoc span1+span2{float:right;padding-left:.33em;background:#fff}chapter ol{font-size:11pt}chapter ul{font-size:11pt}footnote para{display:inline!important}footnote footnoteno{display:inline!important;font-size:9pt}footnote footnoteno:after{content:".A";display:inline!important;font-size:9pt}#rotate{width:571pt;margin-top:125pt;margin-bottom:0;margin-left:-90pt;margin-right:0;-moz-transform:rotate(-90deg);-o-transform:rotate(-90deg);-webkit-transform:rotate(-90deg)}landscapePageOut::before{margin-top:51pt;margin-bottom:13pt;content:" ";white-space:pre;display:block;background-color:silver;margin-right:-83px;margin-left:-82px}landscapePage pageno::before{margin-top:0!important;margin-bottom:0!important;content:""!important;display:none!important;background-color:#000!important;margin-right:0!important;margin-left:0!important}landscapePage pagenor::before{margin-top:0!important;margin-bottom:0!important;content:""!important;display:none!important;background-color:#000!important;margin-right:0!important;margin-left:0!important}landscapePage table{background-color:#fff;background-size:379pt;margin-bottom:272pt}landscapePage lh,landscapePage rh{margin-top:-14pt;text-align:right;margin-right:47pt;font-style:italic}landscapePage pageno{margin-right:30pt;margin-top:40pt}landscapePage pagenor{margin-right:45pt;margin-top:40pt}landscapePage paraChange{font-size:10.5pt;display:block;text-indent:11pt}landscapePage{margin-bottom:-202pt;display:table-caption;transform:rotate(90deg);background:#fff;background-color:#fff;margin-top:-157pt;margin-top:-151pt;width:400pt;margin-left:-42px;height:674pt}pageno{display:inline;text-align:right;font-size:11pt;margin-top:15pt;font-style:italic}pagenor{display:block;text-align:right;font-size:11pt;margin-top:15pt;font-style:italic}pagenob{display:block;text-align:right;font-size:11pt;margin-top:15pt;margin-bottom:-20pt;font-style:italic}lh{display:block;text-align:right;font-size:11pt;margin-top:-12pt;font-style:italic;margin-bottom:17pt}rh{display:block;text-align:left;font-size:11pt;margin-top:-12pt;font-style:italic;margin-bottom:17pt}rh:before{content:"     •  ";white-space:pre}lh:after{content:"  •     ";white-space:pre}pageno::before{margin-top:62pt;margin-bottom:51pt;content:" ";white-space:pre;display:block;background-color:silver;margin-right:-83px;margin-left:-82px}pagenor::before{margin-top:64pt;margin-bottom:51pt;content:" ";white-space:pre;display:block;background-color:silver;margin-right:-83px;margin-left:-82px}equation{font-size:10pt!important;display:block;margin-bottom:12pt;margin-top:12pt;text-align:center;word-spacing:-1.1pt!important}equation>caption1{font-size:22px;float:right}mtr mi{font-style:italic!important}msub mi:last-child{vertical-align:sub}msup mn:last-child{vertical-align:super}annotation{display:none}chapter>label1{font-size:23pt;text-align:left;display:block;margin-bottom:10pt;font-weight:700;-webkit-text-stroke-width:.05pt;text-align:center}article>title1{font-size:20pt;text-align:left;display:block;margin-bottom:5pt;font-weight:400;margin-top:0;font-weight:700;text-align:center}minitoc title1{font-size:12pt;text-align:left;display:block;font-weight:700;text-transform:uppercase;margin-top:18pt;margin-bottom:11pt}minitoc para{font-size:11pt;text-align:left;display:block;margin-bottom:2pt;text-indent:0!important;font-weight:400}info::before{width:90pt;margin-top:0;margin-bottom:3pt;white-space:pre;border-top:solid;display:block;border-width:1pt}abstract,keywordset{display:none}info{display:block;margin-top:0;margin-bottom:22pt}book info address{display:inline;font-size:9pt;text-align:left;font-style:italic}blockquote{display:block;-webkit-margin-before:1em;-webkit-margin-after:1em;-webkit-margin-start:16px;-webkit-margin-end:40px;font-size:10pt}blockquote+para,ol+para,ul+para{text-indent:0!important}info author:after{font-size:13pt;text-align:left;display:inline;margin-bottom:63pt;margin-top:-5pt;font-style:italic;content:", "}info author:last-of-type:after{content:none!important;white-space:pre}info author{font-size:13pt;text-align:left;display:inline;margin-bottom:63pt;margin-top:-5pt;font-style:italic}bibliography>title1{font-size:12pt;margin-top:36pt;margin-bottom:13pt;display:block;font-weight:700;text-transform:uppercase}bibliography bibliomixed{font-size:10pt;display:block;text-indent:11pt;font-size:9pt;font-weight:400}bibliomixed,bibliomixed address,bibliomixed link1,bibliomixed pubdate,bibliomixed publishername,bibliomixed title1{font-size:10pt;display:initial;text-indent:11pt;font-size:9pt;font-weight:400}bibliomixed{font-size:10pt;display:initial;text-indent:11pt;font-size:9pt;font-weight:400}article span{font-size:inherit}italic span{font-size:13px}aff{display:block;margin-top:12pt;font-size:10pt}abstract1{display:block;margin-top:15pt}kwd-group{display:block;margin-top:6pt;margin-bottom:8pt;font-size:10pt}pp1 span{font-size:11pt!important}article>pp1>span{font-size:11pt!important}article pp1{font-size:12pt;display:block;text-indent:0;margin-top:4pt;line-height:2.3}article para[role~=break]{text-align-last:justify}article para[role~=cont]{text-indent:0!important}section1 para:first-of-type{text-indent:0}chapter>para:first-of-type{text-indent:0;margin-bottom:4pt}li para{text-indent:0;display:inline;font-size:11pt;display:block}chapter li ol{margin:0 0!important;margin-left:-22pt!important}chapter li ul{margin:0 0!important}[role~=italic]{font-style:italic}[role~=bold]{font-weight:700}[role~=sub]{vertical-align:sub;font-size:smaller}[role~=super]{vertical-align:super;font-size:smaller}book,chapter{width:346pt!important;padding:71pt 61pt 71pt 61pt;-webkit-text-stroke-width:.0053pt;word-spacing:.09pt;text-align:justify}sec>title1{font-size:12pt;margin-top:1pt;margin-bottom:15pt;display:block;font-weight:700;font-style:normal;text-align:left!important}sec>sec>title1{margin-top:25pt}sec>sec>sec>title1{font-size:11pt;font-weight:400;text-align:left;display:block;padding:0!important;margin-bottom:15pt;margin-top:18px;font-style:normal;text-transform:none;text-indent:-31pt;margin-left:33pt!important;margin-right:0!important;font-style:italic}sec[sec-type=H1]>title1{font-size:12pt;margin-top:12pt;margin-bottom:15pt;display:block;font-weight:700;font-style:normal;text-align:left!important}sec[sec-type=H2]>title1{font-size:11pt}sec[sec-type=H3]>title1{font-size:10pt;font-weight:700;text-align:left;display:block;padding:0!important;margin-bottom:15pt;margin-top:18px;font-style:normal;text-transform:none;text-indent:-31pt;margin-left:33pt;margin-right:0!important;font-style:italic}sec[sec-type=H4]>title1{font-size:9pt;font-weight:700;text-align:left;display:block;padding:0!important;margin-bottom:15pt;margin-top:18px;font-style:normal;text-transform:none;text-indent:-31pt;margin-left:33pt;margin-right:0!important}ack title1{font-size:9pt;font-weight:700;text-align:left;display:block;padding:0!important;margin-bottom:15pt;margin-top:18px;font-style:normal;text-transform:none;text-indent:-31pt;margin-left:33pt!important;margin-right:0!important}article[role=JME] sec[sec-type=H1]>title1{font-size:12pt;margin-top:12pt;margin-bottom:15pt;display:block;font-weight:700;font-style:normal;text-align:left!important;color:#6f2f6e}article[role=JME] sec[sec-type=H2]>title1{font-size:11pt;display:block;text-align:left;padding:0!important;margin-bottom:15pt;margin-top:15pt;font-weight:700;text-transform:none;text-indent:-20pt;margin-left:20pt;margin-right:0;color:#6f2f6e}article[role=JME] sec[sec-type=H3]>title1{font-size:10pt;font-weight:700;text-align:left;display:block;padding:0!important;margin-bottom:15pt;margin-top:18px;font-style:normal;text-transform:none;text-indent:-31pt;margin-left:33pt!important;margin-right:0!important;font-style:italic;color:#6f2f6e}article[role=ECC] sec[sec-type=H1]>title1{font-size:12pt;margin-top:12pt;margin-bottom:15pt;display:block;font-weight:700;font-style:normal;text-align:left!important;color:#196574}article[role=ECC] sec[sec-type=H2]>title1{font-size:11pt;display:block;text-align:left;padding:0!important;margin-bottom:15pt;margin-top:15pt;font-weight:700;text-transform:none;text-indent:-20pt;margin-left:20pt;margin-right:0;color:#196574}article[role=ECC] sec[sec-type=H3]>title1{font-size:10pt;font-weight:700;text-align:left;display:block;padding:0!important;margin-bottom:15pt;margin-top:18px;font-style:normal;text-transform:none;text-indent:-31pt;margin-left:33pt!important;margin-right:0!important;font-style:italic;color:#196574}article[role=ECC] sec[sec-type=H4]>title1{font-size:9pt;font-weight:700;text-align:left;display:block;padding:0!important;margin-bottom:15pt;margin-top:18px;font-style:normal;text-transform:none;text-indent:-31pt;margin-left:33pt!important;margin-right:0!important}article[role=VB] sec[sec-type=H1]>title1{font-size:12pt;margin-top:12pt;margin-bottom:15pt;display:block;font-weight:700;font-style:normal;text-align:left!important;color:#196574}article[role=VB] sec[sec-type=H2]>title1{font-size:11pt;display:block;text-align:left;padding:0!important;margin-bottom:15pt;margin-top:15pt;font-weight:700;text-transform:none;text-indent:-20pt;margin-left:20pt;margin-right:0;color:#196574}article[role=VB] sec[sec-type=H3]>title1{font-size:10pt;font-weight:700;text-align:left;display:block;padding:0!important;margin-bottom:15pt;margin-top:18px;font-style:normal;text-transform:none;text-indent:-31pt;margin-left:33pt!important;margin-right:0!important;font-style:italic;color:#196574}article[role=VB] sec[sec-type=H4]>title1{font-size:9pt;font-weight:700;text-align:left;display:block;padding:0!important;margin-bottom:15pt;margin-top:18px;font-style:normal;text-transform:none;text-indent:-31pt;margin-left:33pt!important;margin-right:0!important}article[role=JOE] sec[sec-type=H1]>title1{font-size:17pt;margin-top:12pt;margin-bottom:15pt;display:block;font-weight:700;font-style:normal;text-align:left!important;color:rgba(0,5,117,.8)}article[role=JOE] sec[sec-type=H2]>title1{font-size:13pt;display:block;text-align:left;padding:0!important;margin-bottom:15pt;margin-top:15pt;font-weight:700;text-transform:none;text-indent:-20pt;margin-left:20pt;margin-right:0;color:rgba(0,5,117,.8)}article[role=JOE] sec[sec-type=H3]>title1{font-size:10pt;font-weight:700;text-align:left;display:block;padding:0!important;margin-bottom:15pt;margin-top:18px;font-style:normal;text-transform:none;text-indent:-31pt;margin-left:33pt;margin-right:0!important;font-style:italic;color:rgba(0,5,117,.8)}article[role=JOE] sec[sec-type=H4]>title1{font-size:9pt;font-weight:700;text-align:left;display:block;padding:0!important;margin-bottom:15pt;margin-top:18px;font-style:normal;text-transform:none;text-indent:-31pt;margin-left:33pt;margin-right:0!important;font-style:italic;color:rgba(0,5,117,.8)}article[role=ERC] sec[sec-type=H1]>title1{font-size:12pt;margin-top:12pt;margin-bottom:15pt;display:block;font-weight:700;font-style:normal;text-align:left!important;color:rgba(0,5,117,.8)}article[role=ERC] sec[sec-type=H2]>title1{font-size:11pt;display:block;text-align:left;padding:0!important;margin-bottom:15pt;margin-top:15pt;font-weight:700;text-transform:none;text-indent:-20pt;margin-left:20pt;margin-right:0;color:rgba(0,5,117,.8)}article[role=ERC] sec[sec-type=H3]>title1{font-size:10pt;font-weight:700;text-align:left;display:block;padding:0!important;margin-bottom:15pt;margin-top:18px;font-style:normal;text-transform:none;text-indent:-31pt;margin-left:33pt;margin-right:0!important;font-style:italic;color:rgba(0,5,117,.8)}article[role=ERC] sec[sec-type=H4]>title1{font-size:9pt;font-weight:700;text-align:left;display:block;padding:0!important;margin-bottom:15pt;margin-top:18px;font-style:normal;text-transform:none;text-indent:-31pt;margin-left:33pt;margin-right:0!important;font-style:italic;color:rgba(0,5,117,.8)}article[role=JOE] sec>h1{font-size:12pt;margin-top:12pt;margin-bottom:15pt;display:block;font-weight:700;font-style:normal;text-align:left!important;color:rgba(0,5,117,.8)}article[role=JOE] sec>h2{font-size:11pt;display:block;text-align:left;padding:0!important;margin-bottom:15pt;margin-top:15pt;font-weight:700;text-transform:none;text-indent:-20pt;margin-left:20pt;margin-right:0;color:rgba(0,5,117,.8)}article[role=JOE] sec>h3{font-size:10pt;font-weight:700;text-align:left;display:block;padding:0!important;margin-bottom:15pt;margin-top:18px;font-style:normal;text-transform:none;text-indent:-31pt;margin-left:33pt!important;margin-right:0!important;font-style:italic;color:rgba(0,5,117,.8)}article[role=JOE] sec>h4{font-size:9pt;font-weight:700;text-align:left;display:block;padding:0!important;margin-bottom:15pt;margin-top:18px;font-style:normal;text-transform:none;text-indent:-31pt;margin-left:33pt!important;margin-right:0!important;font-style:italic;color:rgba(0,5,117,.8)}jou[role=VB]{display:block;background-color:#196574;margin-left:-58px;margin-right:auto}jou[role=ERP]{display:block;background-color:#34686b;margin-left:-57px;margin-right:auto}jou[role=JME]{display:block;background-color:#6f2f6e;margin-left:-57px;margin-right:auto}jou[role=EJE]{display:block;background-color:#0c6bc5;margin-left:-58px;margin-right:auto}jou[role=REP]{display:block;background-color:#0c6bc5;margin-left:-58px;margin-right:auto}jou[role=ECC]{display:block;background-color:#196574;margin-left:-58px;margin-right:auto}jou[role=JOE]{display:block;background-color:rgba(0,5,117,.8);margin-left:-58px;margin-right:auto}jou[role=ERC]{display:block;background-color:rgba(0,5,117,.8);margin-left:-58px;margin-right:auto}jou[role=EDM]{display:block;background-color:rgba(117,0,64,.8);margin-left:-58px;margin-right:auto}article-type{display:block;font-style:italic;font-size:19pt;font-weight:700;margin-top:6pt}article[role=ERP]>front>jou>name1 *{display:inline;margin-left:0;border:1px solid #fdfdfd;width:20px;font-size:37px;text-align:left!important;padding:31px 51px 58px 62px;color:#fff}article[role=REP]>front>jou>name1 *{display:inline;margin-left:0;border:1px solid #fdfdfd;width:20px;font-size:37px;text-align:left!important;padding:31px 51px 58px 62px;color:#fff}article[role=EJE]>front>jou>name1 *{display:inline;margin-left:0;border:1px solid #fdfdfd;width:20px;font-size:37px;text-align:left!important;padding:31px 51px 58px 62px;color:#fff}article[role=ECC]>front>jou>name1 *{display:inline;margin-left:0;border:1px solid #fdfdfd;width:20px;font-size:37px;text-align:left!important;padding:31px 173px 36px 62px;color:#fff}article[role=VB]>front>jou>name1 *{display:inline;margin-left:0;border:1px solid #fdfdfd;width:20px;font-size:37px;text-align:left!important;padding:31px 173px 36px 62px;color:#fff}article[role=JOE]>front>jou>name1 *{display:inline;margin-left:0;width:20px;font-size:37px;text-align:left!important;padding:31px 140px 58px 62px;color:#fff}article[role=ERC]>front>jou>name1 *{display:inline;margin-left:0;border:1px solid #fdfdfd;width:20px;font-size:37px;text-align:left!important;padding:31px 140px 58px 62px;color:#fff}jou[role=ERP]>name1{font-size:50pt;font-weight:400;text-align:center;display:block;color:#fff;margin-top:-10px;height:191px;padding-top:28pt}jou[role=REP]>name1{font-size:50pt;font-weight:400;text-align:center;display:block;color:#fff;margin-top:-10px;height:191px;padding-top:28pt}jou[role=ECC]>name1{font-size:50pt;font-weight:400;text-align:center;display:block;color:#fff;margin-top:-10px;height:191px;padding-top:30pt}jou[role=VB]>name1{font-size:50pt;font-weight:400;text-align:center;display:block;color:#fff;margin-top:-10px;height:191px;padding-top:30pt}jou[role=EDM]>name1{font-size:50pt;font-weight:400;text-align:center;display:block;color:#fff;margin-top:-10px;height:191px}jou[role=JOE]>name1{font-size:50pt;font-weight:400;text-align:center;display:block;color:#fff;margin-top:-10px;height:191px;padding-top:30pt}jou[role=ERC]>name1{font-size:50pt;font-weight:400;text-align:center;display:block;color:#fff;margin-top:-10px;height:191px;padding-top:30pt}jou[role=EJE]>name1{font-size:50pt;font-weight:400;text-align:center;display:block;color:#fff;margin-top:-10px;height:191px;padding-top:30pt}jou[role=JME]>name1{font-size:50pt;font-weight:400;text-align:center;display:block;color:#fff;margin-top:-10px;height:191px;padding-top:27pt}ref-list>title1{font-size:12pt;display:block;text-align:left;padding:0!important;margin-bottom:5pt;margin-top:0;font-weight:700;text-transform:none;text-indent:-20pt;margin-left:20pt;margin-right:0}article[role=ECC] ref-list>title1{font-size:12pt;display:block;text-align:left;padding:0!important;margin-bottom:5pt;margin-top:0;font-weight:700;text-transform:none;text-indent:-20pt;margin-left:20pt;margin-right:0;color:#196574}article[role=VB] ref-list>title1{font-size:12pt;display:block;text-align:left;padding:0!important;margin-bottom:5pt;margin-top:0;font-weight:700;text-transform:none;text-indent:-20pt;margin-left:20pt;margin-right:0;color:#196574}article[role=JME] ref-list>title1{font-size:12pt;display:block;text-align:left;padding:0!important;margin-bottom:5pt;margin-top:0;font-weight:700;text-transform:none;text-indent:-20pt;margin-left:20pt;margin-right:0;color:#6f2f6e}article[role=JOE] ref-list>title1{font-size:12pt;display:block;text-align:left;padding:0!important;margin-bottom:5pt;margin-top:0;font-weight:700;text-transform:none;text-indent:-20pt;margin-left:20pt;margin-right:0;color:rgba(0,5,117,.8)}article[role=ERC] ref-list>title1{font-size:12pt;display:block;text-align:left;padding:0!important;margin-bottom:5pt;margin-top:0;font-weight:700;text-transform:none;text-indent:-20pt;margin-left:20pt;margin-right:0;color:rgba(0,5,117,.8)}article[role=REP] ref label1{display:none}article[role=JME] ref label1{display:none}article[role=JOE] ref label1{display:none}article[role=ERC] ref label1{display:none}fig>label1{font-size:11pt;display:inline}fig{display:block;margin-top:15pt}p fig{padding:0 0}fig>img{width:75%;display:block;margin:10px auto}figsource{font-size:8pt;font-weight:700}figure1>para{font-size:9pt;display:block;text-align:left;padding:0!important;margin-bottom:5pt;margin-top:2pt;font-style:normal;word-spacing:-.91pt;text-transform:none}';

    let cssVal2 =
      'paraChange title1{font-size:9pt;display:inline;text-align:left;padding:0!important;margin-bottom:5pt;margin-top:12pt;font-weight:700;font-style:normal;text-transform:none;margin-left:13pt}superscript{vertical-align:super;font-size:smaller}subscript{vertical-align:sub;font-size:smaller}para>title1{font-size:9pt;display:inline;text-align:left;padding:0!important;margin-top:12pt;font-weight:700;font-style:normal;text-transform:none;margin-bottom:1pt!important;margin-left:0!important;text-indent:0!important}fig>label1:after{content:"  ";white-space:pre}fig>caption1>p1{font-size:11pt;display:inline;text-align:left;padding:0!important;margin-bottom:5pt;margin-top:12pt;font-style:normal;text-transform:none;margin-left:2pt;line-height:2.3}figure1>mediaobject{text-align:center;margin-left:-12pt;margin-top:15px;margin-bottom:5pt;display:block}figure1{display:block;margin-bottom:15pt;text-indent:0}para label1::after{content:"   ";white-space:pre}section1>para>title1{font-size:9pt;display:block;text-align:left;padding:0!important;margin-bottom:15pt;margin-top:3pt;font-weight:400;font-style:normal;text-transform:none}para>link1{margin-bottom:15pt}table>thead>tr>td{padding-left:2pt;text-align:left;font-size:9pt;border:0;border-collapse:collapse;border-bottom:1.5px solid #000!important}table>thead>tr>td>tp{font-weight:700;padding-left:2pt;text-align:left;font-size:9pt;border:0;border-collapse:collapse;font-weight:700}article table>tbody>tr>td{font-size:9pt;font-style:normal;border:0;border-collapse:collapse;padding-left:5pt;text-align:left}chapter imageobject>img{display:block;margin-left:auto;margin-right:auto;width:70%}article[role=EJE] table>thead:first-child tr{border-collapse:collapse;border-bottom:2.5px solid #0c6bc5;border-top:5.5px solid #0c6bc5}article[role=EDM] table>thead:first-child tr{border-collapse:collapse;border-bottom:2.5px solid rgba(117,0,64,.8);border-top:5.5px solid rgba(117,0,64,.8)}article[role=ERP] table>thead:first-child tr{border-collapse:collapse;border-bottom:2.5px solid #34686b;border-top:5.5px solid #34686b}article[role=JME] table>thead:first-child tr{border-collapse:collapse;border-bottom:2.5px solid #6f2f6e;border-top:5.5px solid #6f2f6e}article[role=ECC] table>thead:first-child tr{border-collapse:collapse;border-bottom:2.5px solid #196574;border-top:5.5px solid #196574}article[role=VB] table>thead:first-child tr{border-collapse:collapse;border-bottom:2.5px solid #196574;border-top:5.5px solid #196574}article[role=JOE] table>thead:first-child tr{border-collapse:collapse;border-bottom:2.5px solid rgba(0,5,117,.8);border-top:5.5px solid rgba(0,5,117,.8)}article[role=ERC] table>thead:first-child tr{border-collapse:collapse;border-bottom:2.5px solid rgba(0,5,117,.8);border-top:5.5px solid rgba(0,5,117,.8)}article[role=EJE] table>tbody tr:first-child{border-collapse:collapse;border-top:5.5px solid #0c6bc5}article[role=JME] table>tbody tr:first-child{border-collapse:collapse;border-top:5.5px #6f2f6e}article[role=ECC] table>tbody tr:first-child{border-collapse:collapse;border-top:5.5px solid #196574}article[role=VB] table>tbody tr:first-child{border-collapse:collapse;border-top:5.5px solid #196574}article[role=JOE] table>tbody tr:first-child{border-collapse:collapse;border-top:5.5px solid rgba(0,5,117,.8)}article[role=ERC] table>tbody tr:first-child{border-collapse:collapse;border-top:5.5px solid rgba(0,5,117,.8)}article table>thead:first-child tr{border-collapse:collapse;border-bottom:1.5px solid #000}article table>thead>tr{border-bottom:1.5px solid #000;border-top:1.5px solid #000;border-collapse:collapse;font-size:8.5pt}tr>td:first-of-type{text-align:left!important}article>table{width:100%;display:table;text-indent:0;border:0;border-bottom:1.5px solid #000;border-top:1.5px solid #000;text-align:initial;margin-top:15pt}td[colspan="2"]{text-align:center!important;font-size:8.5pt}para[role=bib_text]{display:-webkit-box;margin-left:11pt;text-indent:-11pt!important;font-size:9pt}para[role=bib_text]::first-line{text-indent:-11pt!important}bibliomixed{margin-left:4pt;text-indent:-1pt!important;font-size:9pt;margin-top:3pt}bibliomixed::first-line{text-indent:-11pt!important}chapter ul{-webkit-padding-start:33px!important}chapter ol{-webkit-padding-start:57px!important}chapter li para figure1{margin-left:-10pt}article para[role~=cont].show_para:after{content:"¶"}.show_para:after{cursor:text;content:"¶"}article para[role~=break]:after{content:none!important}fig label1::after{content:none!important}table1 label1::after{content:none!important}bibliomixed title1:after{content:none!important}article para[role~=cont].hidden_para:after{content:none!important}.hidden_para:after{cursor:text;content:none!important}poem>line{display:block;margin-top:10pt;font-size:10pt}poem>line:after{content:"¶"}poem>poemsource:after{content:"¶"}poem>poemsource{display:block;text-align:right;margin-top:6pt;margin-bottom:6pt;margin-right:120pt!important}poem{margin-top:21pt;margin-bottom:15pt;display:block;margin-left:22pt}poem>title1{margin-top:9pt;margin-bottom:9pt}table-wrap>label1{display:inline-block;margin-top:6pt!important;font-size:11pt}table-wrap{display:block;margin-top:10pt;margin-bottom:5pt}table-wrap>caption1>p1{display:inline!important;margin-left:2pt!important;font-size:11pt;line-height:2.3}table-wrap>table,table-wrap>tgroup>table{margin-top:6pt;width:100%}article[role=REP] table-wrap>table{margin-top:6pt;border-bottom:1.5px solid #000;border-top:1.5px solid #000}table1{display:block!important}tblfn{margin-bottom:10pt!important;display:block;font-weight:700}tblsource{margin-bottom:10pt!important;display:block;font-weight:700}article>para>table1{text-indent:0!important}section1>para>table1{text-indent:0!important}line:after{content:"A";white-space:pre}speaker{display:inline-block;margin-top:4pt;margin-left:-11pt}dialogue>line{text-indent:0!important;margin-left:1pt;display:inline;margin-top:0;font-size:10.5pt}dialogue{display:block;margin-left:10pt}ref>source1{display:inline-block;text-align:right}info1>title1{font-weight:700;font-style:normal;font-size:23pt;text-decoration:none;font-variant:normal;line-height:1.14;text-align:center;text-indent:0;display:block;margin-bottom:30pt;margin-top:50pt}info1>title2{font-weight:700;font-style:normal;font-size:27pt;text-decoration:none;font-variant:normal;line-height:1.14;text-align:center;color:#000;text-indent:0;margin:2em 0 0 0;display:block}info1>subtitle1{font-weight:700;font-style:normal;font-size:20pt;text-decoration:none;font-variant:normal;line-height:1.25;text-align:center;color:#000;text-indent:0;margin:1em 0 0 0;display:block;margin-bottom:10pt}subtitle1{font-weight:700;font-style:normal;font-size:20pt;text-decoration:none;font-variant:normal;line-height:1.25;text-align:center;color:#000;text-indent:0;margin:1em 0 0 0;display:block;margin-bottom:15pt}chapter[role=chapter]>info1>author{font-style:normal;font-size:16pt;text-decoration:none;font-variant:normal;line-height:1.29;text-align:center;color:#000;text-indent:0;margin:2em 0 10em 0;margin-bottom:10pt}chapter[role=prelims]>info1>author{font-style:normal;font-size:16pt;text-decoration:none;font-variant:normal;line-height:1.29;text-align:center;color:#000;text-indent:0;margin:2em 0 10em 0;margin-bottom:10pt}info1{text-align:center;display:block}contrib-group>contrib:first-of-type:before{content:"";white-space:pre}contrib-group>contrib:before{white-space:pre}contrib-group>contrib{font-weight:700;font-size:12pt}contrib-group{margin-top:30pt!important}kwd-group>kwd1:first-of-type:before{content:"";white-space:pre}biblioset phrase:first-of-type:before{content:" ";background-color:#000;white-space:pre;margin-bottom:2pt;height:.5pt;display:block;border-bottom:1.5px solid #000!important}bibliomisc{font-weight:400;font-style:normal;font-size:9pt;text-decoration:none;font-variant:normal;line-height:1.11;text-align:center;color:#000;text-indent:0;margin:0;padding:10px 0 0 0;display:block}bibliomisc:after{content:"¶"}cover>bibliolist>bibliomixed>bibliomisc{display:block!important;font-size:12pt}phrase{font-weight:400;font-style:normal;font-size:9pt;text-decoration:none;font-variant:normal;line-height:1.11;text-align:left;color:#000;text-indent:0;margin:0;padding:0;display:block}phrase:after{content:"¶"}biblioset phrase:first-of-type{margin-top:21pt!important}biblioset phrase:last-of-type{margin-top:13pt!important}legalnotice>para{font-size:9pt;margin-top:7pt;display:block;text-align:left;text-indent:0}legalnotice>para:after{content:"¶"}address{font-size:9pt;text-decoration:none;font-variant:normal;line-height:1.11;text-align:left;color:#000;text-indent:-1px;display:block}copyright{text-align:right;display:block}notes>pp1{text-align:right;display:block;font-size:9pt;margin-top:55pt;font-weight:700;margin-block-end:0!important}notes>doi{text-align:right;display:block}notes>copyright{text-align:right;display:block}notes>subjecteditor{text-align:right;display:block}acknowledgements>title1{font-size:25pt;display:block;text-align:center}acknowledgements>para{font-size:11pt;margin-top:3pt;display:block}acknowledgements>para:after{content:"¶"}subtitle{font-weight:700;font-style:normal;font-size:16pt;text-decoration:none;font-variant:normal;line-height:1.25;text-align:center;color:#000;text-indent:0;margin:1em 0 0 0;display:block}bibliomixed title1:after{content:none}address city:after{content:none!important}preface{display:block;margin-top:27pt;margin-bottom:46pt}preface>title1{display:block;font-size:30pt;text-align:center;font-weight:700}preface>para{display:block;text-indent:1pt;margin-top:4pt}toc>title1{display:block;text-align:center;font-size:29pt}toc>para{display:block;text-indent:3pt;margin-top:4pt}chapter li.nostyle{list-style-type:none}chapter td>ul{-webkit-padding-start:0!important}inline-formula>inline-graphic{width:20pt!important;display:inline!important;margin-top:0!important}equation>mediaobject>imageobject>img{width:125pt!important}footnote1 superscript{color:#00f}epigraph>para{margin-left:85pt;margin-top:30pt;margin-bottom:14pt;margin-right:136pt}attribution{text-align:right;display:block;margin-right:135pt}para[role=symbol_para]{text-align:center;margin-top:10pt;margin-bottom:10pt}para[role=specialpara]{text-indent:1pt;margin-top:5pt}dedication{text-align:center;font-size:12pt;margin-top:10pt;margin-bottom:10pt;font-style:italic}info1>author>personname>surname:before{white-space:pre;content:" "}tp{display:block}query .fa-question-circle-o{color:red!important}informalfigure>mediaobject>imageobject>img{width:16%;margin-top:-7px}glossterm{display:inline}glossentry{display:block}glossentry{padding:0;overflow-x:hidden;list-style:none;margin-left:35pt}glossentry>glossterm{overflow:hidden}glossentry>glossdef{overflow:hidden;font-size:11pt;display:block;text-indent:11pt}glossentry>glossdef:before{float:left;width:0;white-space:nowrap;content:"  "}glossentry>glossterm:before{float:left;width:0;white-space:nowrap;content:"  "}glossentry glossterm{width:113pt;float:left;padding-right:.33em;background:#fff;overflow:hidden;font-size:10.5pt}glossentry glossterm+glossdef{width:480pt;text-indent:1pt;margin-left:30pt;float:left;padding-left:.33em;background:#fff;font-size:10.5pt}ref-list{display:block;font-size:11pt;padding-bottom:30px;text-align:justify}glossdef>para{display:inline}abbreviation>title1{display:block;font-size:30pt;text-align:center;font-weight:700}p{font-size:10.5pt;text-align:justify}sidebar{display:block;margin-top:10pt;margin-bottom:14pt;border-style:solid}abstract1>title1{display:block;font-size:14pt;font-weight:700}article[role=ECC] abstract1>title1{display:block;font-size:14pt;font-weight:700;color:#196574}article[role=VB] abstract1>title1{display:block;font-size:14pt;font-weight:700;color:#196574}article[role=JME] abstract1>title1{display:block;font-size:14pt;font-weight:700;color:#6f2f6e}article[role=JOE] abstract1>title1{display:block;font-size:14pt;font-weight:700;color:rgba(0,5,117,.8)}article[role=EJE] ref>label1:after{content:" ";display:inline-block}article[role=ECC] ref>label1:after{content:" ";display:inline-block}article[role=VB] ref>label1:after{content:" ";display:inline-block}fpage1{display:inline-block}lpage1{display:inline-block}lpage{display:none}ol[list-type=disc],ul[list-type=disc]{list-style-type:disc}issue1{display:inline-block}volume1{display:inline-block}pp1{display:block;margin-block-start:1em;margin-block-end:1em;margin-inline-start:0;margin-inline-end:0;font-size:10.5pt;text-align:justify}article[role=EJE] table{border-bottom:5.5px solid #0c6bc5}article[role=EDM] table{border-bottom:5.5px solid rgba(117,0,64,.8)}article[role=ERP] table{border-bottom:5.5px solid #34686b}article[role=ECC] table{border-bottom:5.5px solid #196574;width:100%}article[role=VB] table{border-bottom:5.5px solid #196574}article[role=JOE] table{border-bottom:5.5px solid rgba(0,5,117,.8)}article[role=ERC] table{border-bottom:5.5px solid rgba(0,5,117,.8)}article[role=JME] table{border-bottom:5.5px solid #6f2f6e}article-meta fpage{display:none}kwd1{display:inline}disp-formula>img{width:auto;display:block;vertical-align:middle;margin:10px auto}disp-formula{display:block}inline-formula>img{width:auto!important;display:inline!important;margin-top:0!important}article-meta>volume1{display:none}ol[list-type=bullet]{list-style-type:disc}ol[list-type=numeric]{list-style-type:decimal}ol[list-type=upperroman]{list-style-type:upper-roman}ol[list-type=lowerroman]{list-style-type:lower-roman}ol[list-type=loweralpha]{list-style-type:lower-alpha}ol[list-type=upperalpha]{list-style-type:upper-alpha}disp-formula>label1{margin-top:13px;font-size:15pt}copyright-year{display:block;text-align:right}copyright-holder{display:none}copyright-statement{display:block;text-align:right;margin-top:12pt}history{display:block;text-align:right;margin-bottom:50pt}subject{display:block;font-size:17pt;font-weight:700}date-cont{display:block}corresp{display:inline-block;margin-bottom:14pt;font-weight:700}article[role=JME] hr{margin:0;padding:0;border:0;border-top:7px solid #6f2f6e!important;height:1px!important;margin-bottom:9px!important}article[role=ERP] hr{margin:0;padding:0;border:0;border-top:7px solid #34686b!important;height:1px!important;margin-bottom:9px!important}article[role=REP] hr{margin:0;padding:0;border:0;border-top:1px solid #0f1212!important;height:1px!important;margin-bottom:9px!important}article[role=EJE] hr{margin:0;padding:0;border:0;border-top:7px solid #0c6bc5!important;height:1px!important;margin-bottom:9px!important}article[role=EDM] hr{margin:0;padding:0;border:0;border-top:7px solid rgba(117,0,64,.8)!important;height:1px!important;margin-bottom:9px!important}article[role=ECC] hr{margin:0;padding:0;border:0;border-top:7px solid #196574!important;height:1px!important;margin-bottom:9px!important}article[role=JOE] hr{margin:0;padding:0;border:0;border-top:7px solid rgba(0,5,117,.8)!important;height:1px!important;margin-bottom:9px!important}article[role=ERC] hr{margin:0;padding:0;border:0;border-top:7px solid rgba(0,5,117,.8)!important;height:1px!important;margin-bottom:9px!important}table-wrap-foot fn pp1{display:block;font-size:9pt}kwd-group>title1{font-weight:700}jou[role=JME]{display:block;background-color:#6f2f6e;margin-left:-57px;margin-right:auto}vol{display:block;text-align:right}iss{display:block;text-align:right}td[colspan]>tp{text-align:center}spellingerrors{display:none}oa{font-size:16px}related-object{display:block;font-size:12px}article table>tbody>tr>td{font-size:9pt;font-style:normal;border:1px solid #d3d3d3;border-collapse:collapse;padding-left:5pt;text-align:left;border-style:dashed}abstract,ack,aff,article-meta title-group article-title,ref-list{display:block}author-notes,contrib-group,history,ref{display:block;margin-top:10px}img.new_figureinsert{width:70%}sc{font-variant:small-caps!important}td span{font-size:9pt!important}underline{text-decoration:underline}sec[sec-type=box]>title1{font-size:12pt;margin-top:1pt;margin-bottom:15pt;display:block;font-weight:700;font-style:normal;text-align:left!important}sec>sec>sec[sec-type=box]>title1{font-size:12pt;margin-top:1pt;margin-bottom:15pt;display:block;font-weight:700;font-style:normal;text-align:left!important}td[colspan]>tp{text-align:center}spellingerrors{display:none}oa{font-size:16px}related-object{display:block;font-size:12px} table,td,th{border-collapse:collapse;border:solid 1px #ccc;padding:10px 20px;text-align:center}article table>tbody>tr>td{font-size:9pt;font-style:normal;border:1px solid #d3d3d3;border-collapse:collapse;padding-left:5pt;text-align:left;border-style:dashed}abstract,ack,aff,article-meta title-group article-title,ref-list{display:block}author-notes,contrib-group,history,ref{display:block;margin-top:10px}pub-date>month>year{display:none}issue{display:none}';
    let newCssXml =
      'body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-size:1rem;font-weight:400;line-height:1.5;color:#212529;text-align:left;background-color:#fff}.ins{color:#06b506!important}.ins{border-top:1px solid;border-bottom:1px solid;color:#17c671!important}.ins,.ins tblfn,.ins tblsource,.ins xref,.ins>link1,.ins>p1{color:#17c671!important}[data-user=current-user]{color:#17c671!important;border-color:#fff!important}.del{color:#c4183c!important;text-decoration:line-through;border-top:1px solid;border-bottom:1px solid;border-color:#fff!important}book,chapter{display:flex;flex-direction:column;word-spacing:1.5pt;text-align:justify}i.ref-drag{display:none !important}.show-comment{background:red;color:#fff}.show-query{background:purple;color:#fff;}';
    let divContents = document.getElementById('content').innerHTML;
    let a = window.open('', '', 'height=800, width=1200');
    a.document.write(
      '<html><style>' + cssVal + cssVal2 + newCssXml + '</style>'
    );
    a.document.write('<body >');
    a.document.write(divContents);
    a.document.write('</body></html>');
    Array.from($(a.document.body).find('comment')).forEach((data) => {
      let commentTxt = $(data).attr('title');
      $(data).after(
        '<span class="show-comment">(Comment: ' + commentTxt + ')</span>'
      );
      $(data).remove();
    });
    Array.from($(a.document.body).find('query')).forEach((data) => {
      let queryTxt = $(data).attr('title');
      $(data).after(
        '<span class="show-query">(Author Query: ' +
          queryTxt.split('AQ:')[1] +
          ')</span>'
      );
      $(data).remove();
    });
    a.document.close();
    a.print();
  }

  pdfConvertion() {
    this.Popup($('#content').html());
  }

  submitAction() {
    this.setState({ ARModal: true });
    let dataLocalStorage = JSON.parse(localStorage.getItem('proEditorData'));
    if (dataLocalStorage) {
      window.EditorTools.callAPI(dataLocalStorage);
    }
  }

  render() {
    const {
      openEditModal,
      PDFStatusModal,
      openStyleModal,
      UPLOADPDFModal,
      ARModal,
      openPdfModal,
      showXmlSuccess,
      showXmlFailed,
      loading,
    } = this.state;
    return (
      <div className="heading-bar h-r-1 w-100 ">
        {loading && <Loading loadingText={'Loading...'} />}
        <div className="col-12 px-1 my-auto">
          <div className="main-actions-align">
            <div className="focus-mode-container focus-on">
              <label className="switch" onClick={this.fullScreenAction}>
                <span className="slider round"></span>
              </label>
              <p>Focus mode</p>
            </div>

            <div className="main-actions-align">
              <Dropdown
                className="my-0 ml-2 cstm-dropdown more-btn dropdown"
                alignRight
              >
                <Dropdown.Toggle id="dropdown-basic">More</Dropdown.Toggle>
                <Dropdown.Menu>
                  {this.props.permissions.download_chapter_pdf && (
                    <Dropdown.Item
                      id="chapter_download"
                      target="_blank"
                      onClick={this.ChapterDownload}
                    >
                      Article Download
                    </Dropdown.Item>
                  )}
                  {this.props.permissions.ai_prediction && (
                    <Dropdown.Item
                      onClick={(e) => {
                        this.AIstartup();
                      }}
                    >
                      AI Prediction
                    </Dropdown.Item>
                  )}
                  {this.props.permissions.ai_prediction && (
                    <Dropdown.Item
                      href={
                        this.state.APIURL +
                        '/VXE/journalRevertXML/' +
                        this.state.ProjectId +
                        '/' +
                        this.state.ChapterId
                      }
                      target="_blank"
                    >
                      Revert XML Download
                    </Dropdown.Item>
                  )}
                  {this.props.permissions.house_style &&
                    this.state.ProjectId !== '245695' && (
                      <Dropdown.Item
                        onClick={(e) => {
                          this.setState({ openStyleModal: true });
                        }}
                      >
                        House Style
                      </Dropdown.Item>
                    )}
                  {this.props.permissions.generate_pdf && (
                    <Dropdown.Item
                      id="generate-pdf"
                      onClick={() => this.InDesignPDF(this.state.projectId)}
                    >
                      Generate PDF
                    </Dropdown.Item>
                  )}
                  {this.props.permissions.download_xml &&
                    this.state.ProjectId !== '245695' && (
                      <Dropdown.Item
                        href={
                          this.state.APIURL +
                          '/VXE/DownloadVXExml/' +
                          this.state.ProjectId +
                          '/' +
                          this.state.ChapterId +
                          '/' +
                          this.props.selectedChapterXmlName
                        }
                      >
                        Download XML
                      </Dropdown.Item>
                    )}
                  {this.props.permissions.download_original_manuscript && (
                    <Dropdown.Item
                      onClick={(e) => {
                        this.downloadOriginalManuscript();
                      }}
                    >
                      Download Original Manuscript
                    </Dropdown.Item>
                  )}
                  {this.props.permissions.upload_xml &&
                    this.state.ProjectId !== '245695' && (
                      <Dropdown.Item
                        onClick={(e) => {
                          this.setState({ UPLOADPDFModal: true });
                        }}
                      >
                        Upload XML
                      </Dropdown.Item>
                    )}
                  <Dropdown.Item
                    onClick={(e) => {
                      this.pdfConvertion();
                    }}
                  >
                    Track changes PDF
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {this.props.permissions.submit_button &&
                !this.props.permissions.oup && (
                  <button
                    type="button"
                    className="btn cstm-save-btn ml-2"
                    onClick={(e) => {
                      this.submitAction();
                    }}
                  >
                    Submit
                  </button>
                )}

              {/* {this.props.permissions.submit_button && !this.props.permissions.oup &&(
                                <button type="button" className="btn cstm-save-btn ml-2">Submit</button>
                            )}  */}
              <span className="hide saving_file mt-2 mr-2 float-right">
                {' '}
                Saving...{' '}
              </span>
              <span className="hide saved_file mt-2 mr-2 float-right">
                {' '}
                Saved{' '}
              </span>
            </div>

            {openEditModal && (
              <DynamicModal
                modalName="ai-predication-modal"
                modalId="modal-2"
                modalSize="lg"
                modalIsClose={this.AIPredicationModalClose}
              >
                <AIPredication
                  selectedChapterXmlName={this.props.selectedChapterXmlName}
                  sendAIPredicationModal={this.AIPredicationModal}
                />
              </DynamicModal>
            )}
            {PDFStatusModal && (
              <DynamicModal
                modalName="pdf-modal"
                modalId="modal-pdf"
                modalSize="sm"
                modalIsClose={this.PDFModelClose}
              >
                <div className="message-status"></div>
              </DynamicModal>
            )}
            {openPdfModal && (
              <DynamicModal
                modalName="pdf-modal"
                modalId="modal-pdf"
                modalSize="sm"
                modalIsClose={this.openPdfModelClose}
              >
                <div>
                  <h3>Your PDF is generating</h3>
                  <p>
                    Your journal PDF is currently being generated and this
                    process can take up to 10 minutes depending on the file
                    size. You will not be able to review/edit this chapter on
                    the PRO editor while the PDF is being processed but you can
                    review/edit other chapters in the meantime.
                  </p>
                  <p>
                    You can also leave the PRO editor while this is ongoing.
                    Rest assured, the PDF generation will continue and be ready
                    here when you come back.
                  </p>
                </div>
              </DynamicModal>
            )}
            {ARModal && (
              <DynamicModal
                modalName="track-chg-modal"
                modalId="tc-modal"
                modalSize="md"
                modalIsClose={this.ARModalClose}
              >
                <div className="tc-container">
                  <h5 className="tc-title">Editor Comments</h5>
                  {this.state.authorcontent ? (
                    <form onSubmit={this.AuthorSubmit}>
                      <div>
                        <p className="pull-left mb-4 mt-2">
                          Write feedback for your team to review
                        </p>
                      </div>
                      <div className="input-group mb-3 mt-4">
                        <div className="row form-group display_figure ml-1">
                          <label className="popuplabel">Message:</label>
                          <textarea
                            className="form-control inline_figure"
                            name="prooftextname"
                            id="proof_text"
                            onChange={this.onAuthoreHandler}
                          ></textarea>
                          <p className="text-danger">
                            {this.state.prooftexterror}
                          </p>
                        </div>
                        <div className="row form-group ml-1 mb-3 cstm-b1">
                          <label className="popuplabel">Upload Assets:</label>
                          <input
                            ref={this.fileDialog}
                            type="file"
                            className="form-control inline_figure"
                            id="proof_assetfile"
                            multiple
                            hidden
                            onChange={(e) => this.onAuthorfileHandler(e)}
                          />
                          <button
                            onClick={(e) => {
                              this.triggerChooseFile(e);
                            }}
                            className="ml-1 deanta-button attachments-button"
                          >
                            <span className="material-icons">add_link</span>{' '}
                            <span className="pl-2"> Choose Your Files</span>
                          </button>

                          {this.state.attachmentFile.length > 0 && (
                            <>
                              <SubmitAttachmentData
                                removeAttachment={this.removeAttachment}
                                attachedFileData={this.state.attachmentFile}
                              />
                            </>
                          )}
                          {this.state.showAttachmentError && (
                            <span className="file-size-error">
                              {this.state.statusText}
                            </span>
                          )}
                        </div>

                        <div className="custom-file">
                          <input
                            type="hidden"
                            name="project_id"
                            value={this.props.ProjectId}
                          />
                          <input
                            type="hidden"
                            name="filename"
                            value={this.props.selectedChapterXmlName}
                          />
                          <input
                            type="hidden"
                            name="chapter_id"
                            value={this.props.ChapterId}
                          />
                          <input type="hidden" name="user_id" />
                          <input type="hidden" name="task_id" value="565656" />
                        </div>
                      </div>
                      <div className="mb-3">
                        <input
                          type="submit"
                          className="btn cstm-save-btn proof-button tc-button"
                          value={this.state.editorSubmittingText}
                        />
                      </div>
                    </form>
                  ) : (
                    <div className="sucess-msg">
                      The Proof has been Submitted
                    </div>
                  )}
                </div>
              </DynamicModal>
            )}

            {UPLOADPDFModal && (
              <DynamicModal
                modalName="xml-chg-modal"
                modalId="xml-modal"
                modalSize="md"
                modalIsClose={this.XMLUPModelClose}
              >
                <div className="tc-container">
                  <h5 className="tc-title">Upload XML</h5>

                  {this.state.xmluploadcontent && (
                    <form onSubmit={this.UploadXMLSubmit}>
                      <div className="input-group mb-3 mt-4">
                        <div className="input-group-prepend pr-4 hide">
                          <span className="input-group-text">Upload</span>
                        </div>
                        <div className="custom-file">
                          <input
                            type="file"
                            name="xml_file"
                            id="xmlfile"
                            accept="text/xml"
                            onChange={this.onxmlfileHandler}
                          />
                          <p className="text-danger">
                            {this.state.xml_file_err}
                          </p>
                          <input
                            type="hidden"
                            name="xml_project_id"
                            value={this.props.ProjectId}
                          />
                          <input
                            type="hidden"
                            name="xml_filename"
                            value={this.props.selectedChapterXmlName}
                          />
                          <input
                            type="hidden"
                            name="xml_chapter_id"
                            value={this.props.ChapterId}
                          />
                          <input
                            type="hidden"
                            name="xml_user_id"
                            value="2206"
                          />
                          <input
                            type="hidden"
                            name="xml_task_id"
                            value="575757"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <input
                          type="submit"
                          className="btn cstm-success-bg tc-button"
                          value="Upload"
                        />
                      </div>
                    </form>
                  )}
                  {showXmlSuccess && (
                    <div className="sucess-msg">XML Uploaded Successfully</div>
                  )}
                  {showXmlFailed && (
                    <div className="danger-msg">XML Upload failed</div>
                  )}
                </div>
              </DynamicModal>
            )}

            {openStyleModal && (
              <DynamicModal
                modalName="style-modal"
                modalId="modal-2"
                modalSize="lg"
                modalIsClose={this.StyleModalClose}
              >
                <StyleList />
                <button
                  type="button"
                  onClick={this.StyleConfig}
                  className="btn cstm-success-bg float-right"
                >
                  Submit
                </button>
              </DynamicModal>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DynamicHeader;
