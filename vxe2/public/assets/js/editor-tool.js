//import { setIsLoading } from '../../../src/utils/reusuableFunctions';
var commands = [
  {
    cmd: 'backColor',
    val: '#bcbcbe',
    desc: 'Changes the document background color. In styleWithCss mode, it affects the background color of the containing block instead. This requires a color value string to be passed in as a value argument. (Internet Explorer uses this to set text background color.)',
  },
  {
    cmd: 'bold',
    icon: 'bold',
    desc: 'Toggles bold on/off for the selection or at the insertion point. (Internet Explorer uses the STRONG tag instead of B.)',
  },
  {
    cmd: 'contentReadOnly',
    desc: 'Makes the content document either read-only or editable. This requires a boolean true/false to be passed in as a value argument. (Not supported by Internet Explorer.)',
  },
  {
    cmd: 'copy',
    icon: 'clipboard',
    desc: 'Copies the current selection to the clipboard. Clipboard capability must be enabled in the user.js preference file. See',
  },
  {
    cmd: 'createLink',
    val: 'https://twitter.com/netsi1964',
    icon: 'link',
    desc: 'Creates an anchor link from the selection, only if there is a selection. This requires the HREF URI string to be passed in as a value argument. The URI must contain at least a single character, which may be a white space. (Internet Explorer will create a link with a null URI value.)',
  },
  {
    cmd: 'cut',
    icon: 'scissors',
    desc: 'Cuts the current selection and copies it to the clipboard. Clipboard capability must be enabled in the user.js preference file. See',
  },
  {
    cmd: 'decreaseFontSize',
    desc: 'Adds a SMALL tag around the selection or at the insertion point. (Not supported by Internet Explorer.)',
  },
  {
    cmd: 'delete',
    icon: 'scissors',
    desc: 'Deletes the current selection.',
  },
  {
    cmd: 'enableInlineTableEditing',
    desc: 'Enables or disables the table row and column insertion and deletion controls. (Not supported by Internet Explorer.)',
  },
  {
    cmd: 'enableObjectResizing',
    desc: 'Enables or disables the resize handles on images and other resizable objects. (Not supported by Internet Explorer.)',
  },
  {
    cmd: 'fontName',
    val: "'Inconsolata', monospace",
    desc: 'Changes the font name for the selection or at the insertion point. This requires a font name string ("Arial" for example) to be passed in as a value argument.',
  },
  {
    cmd: 'fontSize',
    val: '1-7',
    icon: 'text-height',
    desc: 'Changes the font size for the selection or at the insertion point. This requires an HTML font size (1-7) to be passed in as a value argument.',
  },
  {
    cmd: 'foreColor',
    val: 'rgba(0,0,0,.5)',
    desc: 'Changes a font color for the selection or at the insertion point. This requires a color value string to be passed in as a value argument.',
  },
  {
    cmd: 'formatBlock',
    desc: 'Adds an HTML block-style tag around the line containing the current selection, replacing the block element containing the line if one exists (in Firefox, BLOCKQUOTE is the exception - it will wrap any containing block element). Requires a tag-name string to be passed in as a value argument. Virtually all block style tags can be used (eg. "H1", "P", "DL", "BLOCKQUOTE"). (Internet Explorer supports only heading tags H1 - H6, ADDRESS, and PRE, which must also include the tag delimiters &lt; &gt;, such as "&lt;H1&gt;".)',
  },
  {
    cmd: 'forwardDelete',
    desc: "Deletes the character ahead of the cursor's position.  It is the same as hitting the delete key.",
  },
  {
    cmd: 'heading',
    val: 'h3',
    icon: 'header',
    desc: 'Adds a heading tag around a selection or insertion point line. Requires the tag-name string to be passed in as a value argument (i.e. "H1", "H6"). (Not supported by Internet Explorer and Safari.)',
  },
  {
    cmd: 'hiliteColor',
    val: '#bcbcbe',
    desc: 'Changes the background color for the selection or at the insertion point. Requires a color value string to be passed in as a value argument. UseCSS must be turned on for this to function. (Not supported by Internet Explorer.)',
  },
  {
    cmd: 'increaseFontSize',
    desc: 'Adds a BIG tag around the selection or at the insertion point. (Not supported by Internet Explorer.)',
  },
  {
    cmd: 'indent',
    icon: 'indent',
    desc: 'Indents the line containing the selection or insertion point. In Firefox, if the selection spans multiple lines at different levels of indentation, only the least indented lines in the selection will be indented.',
  },
  {
    cmd: 'insertBrOnReturn',
    desc: 'Controls whether the Enter key inserts a br tag or splits the current block element into two. (Not supported by Internet Explorer.)',
  },
  {
    cmd: 'insertHorizontalRule',
    desc: 'Inserts a horizontal rule at the insertion point (deletes selection).',
  },
  {
    cmd: 'insertHTML',
    val: '&lt;h3&gt;Life is great!&lt;/h3&gt;',
    icon: 'code',
    desc: 'Inserts an HTML string at the insertion point (deletes selection). Requires a valid HTML string to be passed in as a value argument. (Not supported by Internet Explorer.)',
  },
  {
    cmd: 'insertImage',
    val: 'http://dummyimage.com/160x90',
    icon: 'picture-o',
    desc: 'Inserts an image at the insertion point (deletes selection). Requires the image SRC URI string to be passed in as a value argument. The URI must contain at least a single character, which may be a white space. (Internet Explorer will create a link with a null URI value.)',
  },
  {
    cmd: 'insertOrderedList',
    icon: 'list-ol',
    desc: 'Creates a numbered ordered list for the selection or at the insertion point.',
  },
  {
    cmd: 'insertUnorderedList',
    icon: 'list-ul',
    desc: 'Creates a bulleted unordered list for the selection or at the insertion point.',
  },
  {
    cmd: 'insertParagraph',
    icon: 'paragraph',
    desc: 'Inserts a paragraph around the selection or the current line. (Internet Explorer inserts a paragraph at the insertion point and deletes the selection.)',
  },
  {
    cmd: 'insertText',
    val: new Date(),
    icon: 'file-text-o',
    desc: 'Inserts the given plain text at the insertion point (deletes selection).',
  },
  {
    cmd: 'italic',
    icon: 'italic',
    desc: 'Toggles italics on/off for the selection or at the insertion point. (Internet Explorer uses the EM tag instead of I.)',
  },
  {
    cmd: 'justifyCenter',
    icon: 'align-center',
    desc: 'Centers the selection or insertion point.',
  },
  {
    cmd: 'justifyFull',
    icon: 'align-justify',
    desc: 'Justifies the selection or insertion point.',
  },
  {
    cmd: 'justifyLeft',
    icon: 'align-left',
    desc: 'Justifies the selection or insertion point to the left.',
  },
  {
    cmd: 'justifyRight',
    icon: 'align-right',
    desc: 'Right-justifies the selection or the insertion point.',
  },
  {
    cmd: 'outdent',
    icon: 'outdent',
    desc: 'Outdents the line containing the selection or insertion point.',
  },
  {
    cmd: 'paste',
    icon: 'clipboard',
    desc: 'Pastes the clipboard contents at the insertion point (replaces current selection). Clipboard capability must be enabled in the user.js preference file. See',
  },
  {
    cmd: 'redo',
    icon: 'repeat',
    desc: 'Redoes the previous undo command.',
  },
  {
    cmd: 'removeFormat',
    desc: 'Removes all formatting from the current selection.',
  },
  {
    cmd: 'selectAll',
    desc: 'Selects all of the content of the editable region.',
  },
  {
    cmd: 'strikeThrough',
    icon: 'strikethrough',
    desc: 'Toggles strikethrough on/off for the selection or at the insertion point.',
  },
  {
    cmd: 'subscript',
    icon: 'subscript',
    desc: 'Toggles subscript on/off for the selection or at the insertion point.',
  },
  {
    cmd: 'superscript',
    icon: 'superscript',
    desc: 'Toggles superscript on/off for the selection or at the insertion point.',
  },
  {
    cmd: 'underline',
    icon: 'underline',
    desc: 'Toggles underline on/off for the selection or at the insertion point.',
  },
  {
    cmd: 'undo',
    icon: 'undo',
    desc: 'Undoes the last executed command.',
  },
  {
    cmd: 'unlink',
    icon: 'chain-broken',
    desc: 'Removes the anchor tag from a selected anchor link.',
  },
  {
    cmd: 'useCSS ',
    desc: 'Toggles the use of HTML tags or CSS for the generated markup. Requires a boolean true/false as a value argument. NOTE: This argument is logically backwards (i.e. use false to use CSS, true to use HTML). (Not supported by Internet Explorer.) This has been deprecated; use the styleWithCSS command instead.',
  },
  {
    cmd: 'styleWithCSS',
    desc: 'Replaces the useCSS command; argument works as expected, i.e. true modifies/generates style attributes in markup, false generates formatting elements.',
  },
];

var commandRelation = {};
var api_url = $('#api_url').val();
function init() {
  commands.map(function (command, i) {
    commandRelation[command.cmd] = command;
  });
  setup();
  // loader();
}

init();
const imgFilePath = 'https://images.weserv.nl/?url=http://lanstad.com';
var vxePermis = $('#vxePermis').val();
var vxePerObj = JSON.parse(vxePermis);
validateVxePermission = (vxe1, vxe2) => {
  var res = false;
  //var per = vxePerObj[vxe1][vxe2];
  var per = vxePerObj[vxe1];
  if (per !== undefined) {
    per = vxePerObj[vxe1][vxe2];
  }
  if (per !== undefined) {
    res = per;
  }
  return res;
};

function loader() {
  $('body').append(
    '\
          <div id="loading-wrapper" class="ss">\
              <div class="loader">\
                  <div class="brand">\
                  <svg width="30px" height="30px" viewBox="0 0 45 45" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><rect id="path-1" x="0" y="0" width="45" height="45" rx="22.5"></rect></defs><g id="Books" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="brand" transform="translate(22.500000, 22.500000) rotate(180.000000) translate(-22.500000, -22.500000) "><mask id="mask-2" fill="white"><use xlink:href="#path-1"></use></mask><use id="Rectangle-2" fill="#EC662F" xlink:href="#path-1"></use><path d="M22.5,0 L45,0 L45,0 L0,45 L0,22.5 C-1.52179594e-15,10.0735931 10.0735931,2.28269391e-15 22.5,0 Z" id="Rectangle-3" fill="#FCBF00" mask="url(#mask-2)"></path></g></g></svg>\
                  </div>\
                  <p>Loading...</p>\
              </div>\
          </div>\
      '
  );
  $(document).ajaxStart(function () {
    $('#loading-wrapper').show();
  });
  $(document).ajaxStop(function () {
    //$('#loading-wrapper').hide();
  });
  document.addEventListener('fetchStart', function () {
    $('#loading-wrapper').show();
  });
  document.addEventListener('fetchEnd', function () {
    $('#loading-wrapper').show();
  });
}

function small_capstag() {
  doCommand('hiliteColor');
  let affnodeas = getSelectedNode();
  let small_text = affnodeas.innerHTML;
  let userName = $('#username').val();
  let data_time = Date.parse(new Date());

  if ($(affnodeas).hasClass('ins')) {
    $(affnodeas).html(
      "<sc class='small_capstag' data-time='" +
        data_time +
        "' data-username='" +
        userName +
        "'>" +
        small_text +
        '</sc>'
    );
  } else {
    affnodeas.setAttribute('data-time', data_time);
    $("#content [data-time='" + data_time + "']").replaceWith(
      "<sc class='small_capstag' data-time='" +
        data_time +
        "' data-username='" +
        userName +
        "'>" +
        small_text +
        '</sc>'
    );
  }
  autosavefunction_vxe();
}

$(document).on('mousedown', '.ref-drag', function (e) {
  refSort();
});

refSort = () => {
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set, 'EK');
  $('#refId').sortable({
    handle: '.ref-drag',
    axis: 'y',
    cursor: 'move',
    start: function (evt, ui) {},
    stop: function (evt, ui) {
      let refList = document.querySelectorAll('#content ref-list ref');
      let xmlid;
      let refID;
      let idArr = [];

      Array.from(refList).forEach((val, index) => {
        if (val.attributes.id) {
          refID = val.attributes.id.value;
          Array.from(val.children).forEach((va, ind) => {
            if (va.tagName === 'LABEL1') {
              let currLabelNo = va.textContent.split('.')[0];
              if (va.textContent.length > 4)
                currLabelNo = va.textContent.split(' ')[1].split('.')[0];
              let newLabel = index + 1;
              if (currLabelNo !== newLabel.toString()) {
                idArr.push('-' + refID);
              }
            }
          });
        }
      });

      Array.from(refList).forEach((val, index) => {
        if (val.attributes.id) {
          xmlid = val.attributes.id.value;
          Array.from(val.children).forEach((va, ind) => {
            if (va.tagName === 'LABEL1') {
              let currLabelNo = va.textContent.split('.')[0];
              if (va.textContent.length > 4)
                currLabelNo = va.textContent.split(' ')[1].split('.')[0];
              let newLabel = index + 1;
              if (currLabelNo !== newLabel.toString()) {
                let userName = $('#username').val();
                let userId = $('#userid').val();
                let dt = Date.parse(new Date());
                let labelDel =
                  '<span class="del cts-1" data-cid="2" data-userid=' +
                  userId +
                  ' contenteditable="false" data-username="' +
                  userName +
                  '" data-time="' +
                  dt++ +
                  '_refdel' +
                  index +
                  '">' +
                  currLabelNo +
                  '. ' +
                  '</span>';
                let labelIns =
                  '<span class="ins cts-1" data-cid="2" data-userid=' +
                  userId +
                  ' contenteditable="false" data-username="' +
                  userName +
                  '" data-time="' +
                  dt++ +
                  '_refins' +
                  index +
                  '">' +
                  newLabel +
                  '. ' +
                  '</span>';
                va.innerHTML = '';
                va.innerHTML = labelDel + labelIns;

                let refCitDel =
                  '<span class="del cts-1" data-cid="2" data-userid=' +
                  userId +
                  ' contenteditable="false" data-username="' +
                  userName +
                  '" data-time="' +
                  dt++ +
                  '_refCdel' +
                  index +
                  '">' +
                  currLabelNo +
                  '</span>';
                let refCitIns =
                  '<span class="ins cts-1" data-cid="2" data-userid=' +
                  userId +
                  ' contenteditable="false" data-username="' +
                  userName +
                  '" data-time="' +
                  dt++ +
                  '_refCins' +
                  index +
                  '">' +
                  newLabel +
                  '</span>';
                document.querySelectorAll(
                  '#content xref[rid="' + xmlid + '"]'
                )[0].innerHTML = '';
                document.querySelectorAll(
                  '#content xref[rid="' + xmlid + '"]'
                )[0].innerHTML = refCitDel + refCitIns;
                document
                  .getElementById(xmlid)
                  .setAttribute('track-change', currLabelNo + '-' + newLabel);
                let dataTime = Date.parse(new Date()) + ind;
                document
                  .getElementById(xmlid)
                  .setAttribute('data-time', 'ref-' + dataTime + '-' + xmlid);
                document
                  .getElementById(xmlid)
                  .setAttribute('data-username', userName);
                document
                  .getElementById(xmlid)
                  .setAttribute('track-ref-ID', idArr.join(''));
              }
            }
          });
        }
      });
      autosavefunction_vxe();
    },
  });
};

loaderStart = () => {
  loadingDiv();
  $('#loading-wrapper').show();
};

loaderStop = () => {
  loadingDiv();
  $('#loading-wrapper').hide();
};

loadingDiv = () => {
  $('.ss#loading-wrapper').remove();
  $('body').append(
    '\
    <div id="loading-wrapper" class="ss">\
        <div class="loader">\
            <div class="brand">\
            <svg width="30px" height="30px" viewBox="0 0 45 45" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><rect id="path-1" x="0" y="0" width="45" height="45" rx="22.5"></rect></defs><g id="Books" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="brand" transform="translate(22.500000, 22.500000) rotate(180.000000) translate(-22.500000, -22.500000) "><mask id="mask-2" fill="white"><use xlink:href="#path-1"></use></mask><use id="Rectangle-2" fill="#EC662F" xlink:href="#path-1"></use><path d="M22.5,0 L45,0 L45,0 L0,45 L0,22.5 C-1.52179594e-15,10.0735931 10.0735931,2.28269391e-15 22.5,0 Z" id="Rectangle-3" fill="#FCBF00" mask="url(#mask-2)"></path></g></g></svg>\
            </div>\
            <p>Loading...</p>\
        </div>\
    </div>\
  '
  );
};

$('.styleComponent').on('mousedown', function (e) {
  var cmd = $(this).attr('data-cmdvalue');
  e.preventDefault();
  if (cmd !== '') {
    doCommand(cmd);
  }
});

$('.showpara_element').on('mousedown', function (e) {
  e.preventDefault();
  showpara_element();
});
$('.hidepara_element').on('mousedown', function (e) {
  e.preventDefault();
  hidepara_element();
});
$('.addnewelements').on('mousedown', function (e) {
  e.preventDefault();
  addnewelements();
});
$('.Addrole_attribute').on('mousedown', function (e) {
  e.preventDefault();
  Addrole_attribute();
});
$('.changeelement').on('mousedown', function (e) {
  e.preventDefault();
  changeelement();
});
$('.selectattimeElem').on('click', function () {
  var cls = this;
  selectattimeElem(cls);
});
$('.selectattimeList').on('click', function () {
  var cls = this;
  selectattimeList(cls);
});
$('#findBtn').on('click', function () {
  findPanelSearch('pdf-editor');
});

//offline mode test
var auto_refresh = setInterval(function () {
  if (!navigator.onLine) {
    $('#offlinemode').modal({ backdrop: 'static', keyboard: false });
  } else {
    $('#offlinemode').modal('hide');
  }
}, 2000);
//offline mode test

//Scroll to selected track item
$(document).on('click', '#content [data-time]', function () {
  var id = this.attributes['data-time'].value;
  scrollToLastTrack(id);
});

$(document).on('click', '.dropdrownoption', function (e) {
  e.preventDefault();
  var elementText = $(this).attr('data-option');
  var elementlabel = $(this).attr('data-label');
  $('#text_new_element').text(elementlabel);
  $('#new_elements').val(elementText);
  $('#new-element-select-drop').addClass('hide');
  $('#text_new_element').removeClass('hide');
  addnewelements();
});
$('.newelements').on('mousedown', function (e) {
  e.preventDefault();
  $('#new-element-select-drop').removeClass('hide');
  $('#text_new_element').addClass('hide');
  $('#new_elements').val('');
  addnewelements();
});
function imageContent() {
  var html_content = $('#content').html();
  var res = html_content.match(
    /http:\/\/78.137.168.31:8080\/oxygenxml-web-author\/plugins-dispatcher\/webdav-server\//gi
  );
  if (res !== null) {
    if (res.length > 1) {
      var new_html_content = html_content.replaceAll(
        'http://78.137.168.31:8080/oxygenxml-web-author/plugins-dispatcher/webdav-server/',
        imgFilePath + '/webdav-server/'
      );
    } else {
      var new_html_content = html_content.replace(
        'http://78.137.168.31:8080/oxygenxml-web-author/plugins-dispatcher/webdav-server/',
        imgFilePath + '/webdav-server/'
      );
    }
    $('#content').empty();
    $('#content').html(new_html_content);
  }
}
$('.ShowQuery').on('mousedown', function (e) {
  e.preventDefault();
  ShowQuery();
});
$('.show_xmltag').on('mousedown', function (e) {
  e.preventDefault();
  ShowTag();
});
$('.hide_xmltag').on('mousedown', function (e) {
  e.preventDefault();
  hide_xmltag();
});

$(document).on('click', '.table_insertion', function (e) {
  e.preventDefault();
  $('.table_error').addClass('hide');
  var elementText = $(this).attr('data-option');
  var elementlabel = $(this).attr('data-label');
  $('#tableinsert_flag').val('0');
  $('#tableinsert_id').val('');
  $('#tableHeaderText').text(elementlabel);
  $('.inline_table').prop('checked', false);
  $('.paste_table').prop('checked', false);
  $('.inlinePaste').prop('checked', false);
  $('#inlineTable').addClass('hide');
  $('#paste_table').addClass('hide');
  $('#inlinePaste').addClass('hide');
  $('.table_container').removeClass('hide');
  $('#inlineNormal').removeClass('hide');
  $('.tablefootnote').addClass('hide');
  $('.table_footnoteNew').val('');
  $('#tableElements').removeClass('hide');
  $('#tableElementsText').addClass('hide');
  var affnode = getSelectedNode();
  var selectedText = getHTMLOfSelection();
  $('#inlineCheckbox').addClass('hide');
  if (findAncestor(affnode, 'pdf-editor')) {
    if (
      elementText === 'DisplayTable' ||
      elementText === 'PasteFromExcel' ||
      elementText === 'InlineTable' ||
      elementText === 'inlinePaste'
    ) {
      var tagList = [
        'ref-list',
        'table-wrap',
        'fig',
        'disp-formula',
        'jou',
        'article-meta',
      ];
      var selectedTagName = affnode.tagName;
      var tableTag = affnode.closest(
        'fig,table-wrap,ref-list,disp-formula,jou,article-meta,xref'
      );
      if (tableTag !== null) {
        selectedTagName = 'table-wrap';
      }
      if (selectedTagName === undefined) {
        selectedTagName = '';
      }
      if (selectedTagName === 'TITLE1') {
        var parentTagName = affnode.parentElement.tagName;
        if (parentTagName === 'CHAPTER') {
          selectedTagName = 'table-wrap';
        }
      }
      var arrayCheckTag = $.inArray(selectedTagName.toLowerCase(), tagList);
      if (arrayCheckTag === -1) {
        if (elementText === 'DisplayTable') {
          $('#inlineTable').removeClass('hide');
          $('#paste_table').removeClass('hide');
          $('.table_container').addClass('hide');
          if (selectedText !== '') {
            doCommand('hiliteColor', 'table_citation');
          } else {
            $('#insertFootnote').modal('show');
            $('#footnoteWarningtext').text(
              'Please select the table citation for adding Display Table'
            );
          }
        }
        if (elementText === 'InlineTable') {
          $('#inlineCheckbox').removeClass('hide');
          $('.inline_table').prop('checked', true);
          $('#inlineTable').removeClass('hide');
          doCommand('hiliteColor', 'table_citation');
        }
        if (elementText === 'PasteFromExcel') {
          $('.paste_table').prop('checked', true);
          $('#paste_table').removeClass('hide');
          if (selectedText !== '') {
            doCommand('hiliteColor', 'table_citation');
          } else {
            $('#insertFootnote').modal('show');
            $('#footnoteWarningtext').text(
              'Please select the table citation for adding Paste from Word / Excel'
            );
          }
        }
        if (elementText === 'inlinePaste') {
          $('#inlineCheckbox').removeClass('hide');
          $('.inlinePaste').prop('checked', true);
          $('#inlinePaste').removeClass('hide');
          doCommand('hiliteColor', 'table_citation');
        }
      } else {
        $('#tableModal').modal('show');
        $('#tableElements').addClass('hide');
        $('#tableElementsText').removeClass('hide');
        $('#tableElementsText').html(
          '<center><h2>Warning!</h2><span>You have no access to insert a table here</span></center>'
        );
      }
    }
    var main_table = $('.table_attr').text();
    if (!!affnode && main_table === '') {
      var tableEle = affnode.closest('table');
      if (!!tableEle) {
        main_table = tableEle.getAttribute('id');
      }
    }
    var selectTagLength = 0;
    if (main_table !== '') {
      selectTagLength = $(
        '#content #' +
          main_table +
          " [style*='background-color: rgb(155, 179, 218)']"
      ).length;
      if (elementText === 'Footnote') {
        tablefootnoteInsert(main_table);
      }
    } else {
      if (elementText === 'Footnote') {
        $('#insertFootnote').modal('show');
        $('#footnoteWarningtext').text(
          'Please place the cursor inside the table.'
        );
        return false;
      }
    }
    if (
      elementText !== 'DeleteTable' &&
      tableTag !== null &&
      selectTagLength > 0
    ) {
      if (elementText === 'AddRow') {
        table.row('insert');
      }
      if (elementText === 'RemoveRow') {
        table.row('delete');
      }
      if (elementText === 'AddColumn') {
        table.column('insert');
      }
      if (elementText === 'RemoveColumn') {
        table.column('delete');
      }
      if (elementText === 'MergeCell') {
        onmousedowns();
      }
      if (elementText === 'TableHead') {
        tableheadInsert(main_table);
      }
    }
    if (elementText === 'DeleteTable') {
      tabledelete();
    }
  } else {
    if (elementText === 'DeleteTable') {
      tabledelete();
    } else {
      $('#insertFootnote').modal('show');
      $('#footnoteWarningtext').text(
        'Please place the cursor inside the editor.'
      );
    }
  }
});

tableheadInsert = (id) => {
  let contentElement = document.getElementById('content');
  let tableElement = contentElement.querySelector('[id="' + id + '"]');
  let tbody = tableElement.querySelector('tbody');
  let tbodytr = tableElement.querySelectorAll('tbody tr');
  let d = new Date();
  let dte = Date.parse(d);
  let userName = $('#username').val();
  if (tbodytr.length > 0) {
    let firstRow = tbodytr[0];
    let firstRowSelected = firstRow.querySelectorAll(
      "[style*='background-color: rgb(155, 179, 218)']"
    );
    if (firstRowSelected.length > 0) {
      let localdata_set = $('.localstorevalue').val();
      storedata(localdata_set, 'EK');
      Array.from(tbodytr).forEach((element) => {
        let tdEle = element.querySelectorAll(
          "[style*='background-color: rgb(155, 179, 218)']"
        );
        let thead = tableElement.querySelector('thead');
        if (tdEle.length > 0) {
          element.setAttribute('data-time', dte);
          element.setAttribute('data-username', userName);
          element.setAttribute('data-table', 'thchanged');
          let theadStr = element.outerHTML;
          if (thead === null) {
            theadStr =
              '<thead store="thead' +
              dte +
              '">' +
              element.outerHTML +
              '</thead>';
            $(tbody).before(theadStr);
            element.remove();
          } else {
            $(thead).append(theadStr);
            element.remove();
          }
        }
      });
      $('#content #' + id + ' td').removeAttr('style');
      let msg = 'thead inserted.';
      autosavefunction_vxe(msg);
    } else {
      $('#insertFootnote').modal('show');
      document.getElementById('footnoteWarningtext').innerText =
        'Please select the correct row to add the table head.';
    }
  }
};

tablefootnoteInsert = (id) => {
  $('.number_of_columns').val('');
  $('.number_of_rows').val('');
  $('.table_content').html('');
  $('.tablefootnote').removeClass('hide');
  $('#tableModal').modal({ backdrop: 'static' });
  $('#table_submission').attr('onClick', "table_submission('" + id + "');");
};

$('.accept-change').on('click', function (e) {
  var selectedValue = $(this).attr('data-value');
  acceptOrRejectChange(selectedValue);
});
$('.link_figure').on('mousedown', function (e) {
  e.preventDefault();
  $('.new-ref-text').addClass('hide');
  $('#new-ref-div').addClass('hide');
  var selectedText = getHTMLOfSelection();
  if (selectedText !== '') {
    link_figure();
  } else {
    $('#insertFootnote').modal('show');
    $('#footnoteWarningtext').text(
      'Please select the content for adding Figure Link'
    );
  }
});

$(document).on('click', 'span.refIcon', function (e) {
  var linkend = $(this).next().attr('rid');
  var type = $(this).next().attr('ref-type');
  if (linkend !== '') {
    if (type === 'bibr') {
      // curEle = $("#content ref[id='"+linkend+"']")[0];
      scrollToViewContent(linkend);
    } else if (type === 'fig') {
      // curEle = $("#content fig[id='"+linkend+"']")[0];
      scrollToViewContent(linkend);
    } else {
      $($("#content [rid='" + linkend + "']")[0]).attr('id', linkend);
      scrollToViewContent(linkend);
      $($("#content [rid='" + linkend + "']")[0]).removeAttr('id', linkend);
    }
  }
});

$('.link_reference').on('mousedown', function (e) {
  e.preventDefault();
  $('.new-ref-text').addClass('hide');
  $('#new-ref-div').addClass('hide');
  var selectedText = getHTMLOfSelection();
  if (selectedText !== '') {
    link_reference();
  } else {
    $('#insertFootnote').modal('show');
    $('#footnoteWarningtext').text(
      'Please select the content for adding Reference Link'
    );
  }
});
$('.link_table').on('mousedown', function (e) {
  e.preventDefault();
  $('.new-ref-text').addClass('hide');
  $('#new-ref-div').addClass('hide');
  var selectedText = getHTMLOfSelection();
  if (selectedText !== '') {
    link_table();
  } else {
    $('#insertFootnote').modal('show');
    $('#footnoteWarningtext').text(
      'Please select the content for adding Table Link'
    );
  }
});
$('.RefRemove').on('mousedown', function (e) {
  e.preventDefault();
  let selectedNode = getSelectedNode();
  let tagName = selectedNode.tagName;
  if (tagName === 'XREF') {
    let localdata_set = $('.localstorevalue').val();
    storedata(localdata_set, 'EK');
    if ($(selectedNode).prev().hasClass('refIcon'))
      $(selectedNode).prev().remove();
    $(selectedNode).contents().unwrap();
    $('.custom-menu').hide(100);
    let msg = 'Link icon Removed.';
    autosavefunction_vxe(msg);
  }
});
$('.addroleAttributes').on('mousedown', function (e) {
  var affnodeas = getSelectedNode();
  if (findAncestor(affnodeas, 'pdf-editor')) {
    var d = new Date();
    var dt = Date.parse(d);
    affnodeas.setAttribute('roles_sam', dt);
    var selectedValue = $(this).attr('data-value');
    $('#add_roleattribute').val(selectedValue);
    Role_addattr(dt);
    $('.custom-menu').hide(100);
    let msg = 'Link icon Removed.';
    autosavefunction_vxe(msg);
  }
});
$(document).on('click', '.insertimages', function (e) {
  e.preventDefault();
  var elementText = $(this).attr('data-option');
  var elementlabel = $(this).attr('data-label');
  $('#figureinsert_flag').val('0');
  $('#figureinsert_id').val('');
  $('#figureheader').text(elementlabel);
  $('#inline-fig').prop('checked', false);
  $('.display_figure').removeClass('hide');
  var queryNode = getSelectedNode();
  var selectedText = getHTMLOfSelection();
  if (findAncestor(queryNode, 'pdf-editor')) {
    if (elementText === 'DisplayImage' || elementText === 'InlineImage') {
      var affnode = getSelectedNode();
      var tagList = [
        'ref-list',
        'table-wrap',
        'fig',
        'disp-formula',
        'jou',
        'article-meta',
      ];
      var selectedTagName = affnode.tagName;
      var figureTag = affnode.closest(
        'fig,table-wrap,ref-list,disp-formula,jou,article-meta,xref'
      );
      if (figureTag !== null) {
        selectedTagName = 'fig';
      }
      if (selectedTagName === undefined) {
        selectedTagName = '';
      }
      if (selectedTagName === 'TITLE1') {
        var parentTagName = affnode.parentElement.tagName;
        if (parentTagName === 'CHAPTER') {
          selectedTagName = 'fig';
        }
      }
      var arrayCheckTag = $.inArray(selectedTagName.toLowerCase(), tagList);
      var arraySelectTag = $.inArray(selectedTagName.toLowerCase(), tagList);
      if (arrayCheckTag === -1) {
        if (elementText === 'DisplayImage') {
          doCommand('hiliteColor', 'fig_citation');
        }
        if (elementText === 'InlineImage') {
          $('.display_figure').addClass('hide');
          $('#inline-fig').prop('checked', true);
          doCommand('hiliteColor', 'fig_citation');
        }
      } else {
        $('#figureModal').modal({ backdrop: 'static' });
        $('#insertFigure').addClass('hide');
        $('#insertFigureText').removeClass('hide');
        $('#insertFigureText').html(
          '<center><h2>Warning!</h2><span>You have no access to insert a figure here</span></center>'
        );
      }
    }
    if (elementText === 'DeleteImage') {
      figuredelete();
    }
  } else {
    if (elementText === 'DeleteImage') {
      figuredelete();
    } else {
      $('#insertFootnote').modal('show');
      $('#footnoteWarningtext').text(
        'Please place the cursor inside the editor.'
      );
    }
  }
});
$(document).on('click', '.reference_insert', function (e) {
  e.preventDefault();
  reference_insert();
});
$(document).on('click', '.reference_delete', function (e) {
  e.preventDefault();
  var queryNode = getSelectedNode();
  if (findAncestor(queryNode, 'pdf-editor')) {
    reference_delete();
  } else {
    $('#insertFootnote').modal('show');
    $('#footnoteWarningtext').text(
      'Please place the cursor inside the editor.'
    );
  }
});
$(document).on('click', 'ref *', function (e) {
  var editRefPer = window.validateVxePermission(
    'basic_features',
    'ref_color_edit'
  );
  if (editRefPer === false) {
    reference_edit();
  }
});

sampleProjectList = () => {
  var project_id = $('#projectid').val();
  var res = true;
  if (project_id == '5831') {
    res = true;
  }
  return res;
};

$(document).on('click', 'article-meta', function (e) {
  e.preventDefault();
  var selectEle = getSelectedNode();
  var abst = selectEle.closest('abstract1,kwd-group');
  if (abst === null) {
    frontmatterInsert(e);
  }
});

$(document).on('click', '.footnoteno_insert', function (e) {
  e.preventDefault();
  footnoteno_insert();
});
$(document).on('click', '.footnotedelete', function (e) {
  e.preventDefault();
  footnotedelete();
});
$(document).on('click', '.headerchg', function (e) {
  e.preventDefault();
  var elementText = $(this).attr('data-option');
  var elementlabel = $(this).attr('data-label');
  change_headingelement(elementText);
});
specialchar = (e, action) => {
  e.preventDefault();
  var queryNode = getSelectedNode();
  if (findAncestor(queryNode, action)) {
    var localdata_set = $('.localstorevalue').val();
    storedata(localdata_set);
    pasteHtmlAtCaret("<span class='sp'></span>");
    $('#specialChar').modal('show');
  } else {
    $('#insertFootnote').modal('show');
    $('#footnoteWarningtext').text(
      'Please place the cursor inside the editor.'
    );
  }
};
$('.tablinks').on('click', function (e) {
  e.preventDefault();
  var linkid = $(this).attr('data-linkid');
  $('.tabcontent').addClass('hide');
  $('#' + linkid).removeClass('hide');
  $('.tablinks').removeClass('active');
  $(this).addClass('active');
});
$('.zoom').on('click', function (e) {
  var d = new Date();
  var dt = Date.parse(d);
  if (this.childElementCount > 0) {
    var sid = this.firstChild.getAttribute('id');
    const userId = $('#userid').val();
    var userName = $('#username').val();
    $('.sp').html(
      '<span class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '">' +
        sid +
        '</span>'
    );
    var parentLength = $('.sp').parent().length;
    if (parentLength === 1) {
      var parentTagName = $('.sp').parent()[0].tagName;
      var parentClass = $('.sp').parent()[0].getAttribute('class');
      if (
        parentTagName === 'SPAN' &&
        (parentClass === 'ins cts-1' || parentClass === 'ins cts-2')
      ) {
        $('.sp').html(sid);
      }
    }
    let metaForm = $('.sp').closest('.meta-form');
    if (metaForm.length > 0) {
      $('.sp').parents('.form-control').addClass('modified-article');
    }
    let formData = $('.sp').closest('.formData');
    $('.sp').contents().unwrap();
    if (formData.length > 0) {
      $('#form [data-time="' + dt + '"]')
        .contents()
        .unwrap();
      let ele = formData[0];
      var referenceNode = $(ele).attr('targetid');
      if (!!referenceNode) {
        var targetChild = $(ele).children().length;
        var action = 0;
        var change_val = $(ele).text();
        if (targetChild > 0) {
          action = 1;
          change_val = $(ele).html();
        }
        refKeyup(referenceNode, change_val, 1);
      }
    }
    $('#specialChar').modal('hide');
    var insSymbol = document.querySelector('#content [data-time="' + dt + '"]');
    var msg = sid + ' - New symbol inserted. ';
    autosavefunction_vxe(msg);
    updatedRevisions(insSymbol);
  }
});

$('.documentscore').on('click', function (e) {
  $('#documentScore').modal('show');
  var chapter_name = $('#chaptername').val();
  var project_id = $('#projectid').val();
  var chapter_id = $('#chapterid').val();
  chapter_name = chapter_name.replace('_new', '');
  $.ajax({
    type: 'POST',
    url: api_url + '/VXE/grammerlyanalysis',
    data: {
      project_id: project_id,
      chapter_name: chapter_name,
      chapter_id: chapter_id,
    },
    beforeSend: function () {
      // loadajaxsucessmsg();
    },
    success: function (response) {
      $('.grammer_total').text(response.result.total_words);
      $('.grammer_consistancy').text(response.result.consistancy);
      $('.grammer_spelling').text(response.result.spelling_issue);
      $('.grammer_issues').text(response.result.grammer_issue);
      $('.grammer_sentence').text(response.result.sentence_structure);
      $('.punctuations').text(response.result.punctuations);
      google.charts.load('current', { packages: ['corechart'] });
      google.charts.setOnLoadCallback(drawChart);
    },
  });
});
function drawChart() {
  var grammer_total = parseInt($('.grammer_total').text());
  var consistancy = $('.grammer_consistancy').text();
  var grammer_spelling = parseInt($('.grammer_spelling').text());
  var grammer_issues = parseInt($('.grammer_issues').text());
  var grammer_sentence = parseInt($('.grammer_sentence').text());
  var punctuations = parseInt($('.punctuations').text());
  var consistancy = consistancy + '%';
  $('.piechart_value').text(consistancy);
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Pizza');
  data.addColumn('number', 'Grammer');
  data.addRows([
    ['Spelling Issue', grammer_spelling],
    ['Grammar Issue', grammer_issues],
    ['Sentence Structure', grammer_sentence],
    ['Punctuations', punctuations],
    ['Error Free', 95],
  ]);
  var options = {
    title: '',
    pieHole: 0.5,
    tooltip: { trigger: 'none' },
    chartArea: { width: 400, height: 300 },
  };
  var chart = new google.visualization.PieChart(
    document.getElementById('piechart')
  );
  chart.draw(data, options);
}
$('.mergeParaElement').on('mousedown', function (e) {
  e.preventDefault();
  mergeParaElement(getSelectionParentElement());
});
$('.paragraph_delete').on('mousedown', function (e) {
  e.preventDefault();
  paragraph_delete();
});
var autoCitationDt = '';
function doCommand(cmdKey, link, shortCut) {
  if (cmdKey === null) {
    return;
  }
  var userName = $('#username').val();
  var cmd = commandRelation[cmdKey];
  var affnode_1 = getSelectedNode();
  var selectedText = getHTMLOfSelection();
  let currentUser;
  let dataId;
  if (
    selectedText !== '' ||
    (cmd.cmd !== 'bold' &&
      cmd.cmd !== 'italic' &&
      cmd.cmd !== 'subscript' &&
      cmd.cmd !== 'superscript' &&
      cmd.cmd !== 'underline')
  ) {
    var selected_node_1 = affnode_1.tagName;
    if (cmd.cmd !== 'backColor') {
      var localdata_set = $('.localstorevalue').val();
      storedata(localdata_set);
    }
    if (cmd.cmd == 'hiliteColor') {
      cmd.val = '#bcbcbe';
    }
    // if((cmd.cmd === "subscript" && selected_node_1 === "SUB") || (cmd.cmd === "superscript" && selected_node_1 === "SUP")){
    //   var datetime = affnode_1.getAttribute('data-time');
    //   if(datetime !== undefined && datetime !== ""){
    //     $("#content "+selected_node_1+"[data-time='"+datetime+"']").contents().unwrap();
    //   }
    //   $(affnode).contents().unwrap();
    //   $('[data-cmdvalue]').removeClass('active');
    //   autosavefunction_vxe();
    //   return false;
    // } else{
    currentUser = affnode_1.getAttribute('data-username');
    dataId = affnode_1.getAttribute('data-time');
    document.execCommand(cmd.cmd, false, cmd.val || '');
    //Highlighting selected formattor
    if (
      cmdKey != undefined &&
      (cmdKey === 'bold' ||
        cmdKey === 'italic' ||
        cmdKey === 'underline' ||
        cmdKey === 'superscript' ||
        cmdKey === 'subscript')
    ) {
      document
        .querySelector('[data-cmdvalue="' + cmdKey + '"]')
        .classList.add('active');
    }
    // }
    if (cmd.cmd !== 'undo' && cmd.cmd !== 'redo' && cmd.cmd !== 'backColor') {
      var affnode = getSelectedNode();
      var selected_node = affnode.tagName;
      let notrackScript = false;
      if (
        affnode.parentElement &&
        affnode.parentElement.tagName === 'SPAN' &&
        !$(affnode.parentElement).hasClass('ins')
      )
        notrackScript = true;
      var d = new Date();
      var dt = Date.parse(d);
      $('#rightclickactiondt').val(dt);
      var i;
      $('#figure_label').val('');
      $('#figure_caption').val('');
      $('#fileinsert').val('');
      $('.search_link').val('');
      $('.table_content').html('');
      if (selected_node === 'SPAN' || notrackScript) {
        if (
          cmd.cmd === 'bold' ||
          cmd.cmd === 'italic' ||
          cmd.cmd === 'underline' ||
          cmdKey === 'superscript' ||
          cmdKey === 'subscript'
        ) {
          if (userName !== currentUser || !dataId) {
            if (!currentUser) {
              //No track previously
            } else {
              if (notrackScript) {
                affnode.parentElement.setAttribute('prev-user', currentUser);
              } else {
                affnode.setAttribute('prev-user', currentUser);
              }
            }
            if (notrackScript) {
              affnode.parentElement.setAttribute('data-time', dt);
              affnode.parentElement.setAttribute('data-username', userName);
              affnode.parentElement.setAttribute('prev-format', cmd.cmd);
              $(affnode).contents().unwrap();
            } else {
              affnode.setAttribute('data-time', dt);
              affnode.setAttribute('data-username', userName);
              affnode.setAttribute('prev-format', cmd.cmd);
            }
          } else {
            if (notrackScript) {
              $(affnode.parentElement).contents().unwrap();
              $(affnode).contents().unwrap();
            } else $(affnode).contents().unwrap();
          }
          $('[data-cmdvalue]').removeClass('active');
          autosavefunction_vxe();
          return false;
        }
        if (link === 'ref') {
          affnode.setAttribute('role', 'bibr');
        }
      } else {
        if (selected_node !== 'PARA') {
          affnode.setAttribute('data-time', dt);
          affnode.setAttribute('data-username', userName);
          if (affnode.attributes['data-time'] && !shortCut) {
            var textId = affnode.attributes['data-time'].value;
            var tagName = selected_node;
            // document.getElementById("content").removeEventListener("keydown", );
          }
        }
      }
      var storeid = affnode.getAttribute('store');
      var selected_parent = affnode.parentElement.tagName;
      var bibliomixed_check = $("#content [store='" + storeid + "']")
        .parents('bibliomixed')
        .prop('tagName');
      var parent_footnote_element = affnode.parentElement.parentNode.tagName;
      if (
        bibliomixed_check !== 'BIBLIOMIXED' &&
        selected_node !== 'BIBLIOMIXED'
      ) {
        if (selected_node === 'SPAN' || link === 'ref') {
          $('.listOfLinks').html('');
          if (link === 'fig_citation') {
            $('#figure_submission').show();
            $('#inline_fig_error').addClass('hide');
            $('#insertFigure').removeClass('hide');
            $('#insertFigureText').addClass('hide');
            $('#figure_label').val('');
            $('#figure_caption').val('');
            $('#fileinsert').val('');
            var store_id = affnode.parentElement.getAttribute('store');
            if (store_id === null) {
              var store_id =
                affnode.parentElement.parentNode.getAttribute('store');
            }
            if (store_id !== null) {
              var inline_checked = $('#inline-fig').prop('checked');
              if (inline_checked === false) {
                $(affnode).wrapInner(
                  '<xref ref-type="fig" rid="' + dt + '"></xref>'
                );
              }
              $('#figure_submission').attr(
                'onClick',
                'updatefigure(' + dt + ",'" + store_id + "');"
              );
              $('.closefig').attr('onClick', "figure_close('" + dt + "');");
              $('#figureinsert_flag').val('1');
              $('#figureinsert_id').val(dt);
              $('#figureModal').modal({ backdrop: 'static' });
              var figure_labeltxt = 'FIG 1.0';
              var first_obj = '';
              tablefigOrder(dt, 'fig', 'rid', '#figure_label');
            }
          } else if (link === 'fig') {
            $('#addLink').modal({
              backdrop: 'static',
              keyboard: false,
            });
            $(affnode).wrapInner(
              '<xref ref-type="fig" rid="' + dt + '"></xref>'
            );
            var contentElement = document.getElementById('content');
            var figureEle = contentElement.querySelectorAll('fig'),
              i;
            if (figureEle.length > 0) {
              for (i = 0; i < figureEle.length; ++i) {
                var element = figureEle[i];
                var parentTagname = element.parentElement.tagName;
                var deleteClass = '';
                if (parentTagname === 'SPAN') {
                  deleteClass = element.parentElement.getAttribute('class');
                }
                var storeId = element.getAttribute('store');
                var labelElement = element.querySelector('label1');
                var curid = element.getAttribute('id');
                var labelRemoveEle = labelElement.querySelectorAll(
                    'query,span.del,comment,span.sr-only'
                  ),
                  j;
                if (labelRemoveEle.length > 0) {
                  for (j = 0; j < labelRemoveEle.length; ++j) {
                    labelRemoveEle[j].remove();
                  }
                }
                var figName = labelElement.innerText;
                var titleElement = element.querySelector('caption1');
                var titleRemoveEle = titleElement.querySelectorAll(
                    'query,span.del,comment,span.sr-only'
                  ),
                  j;
                if (titleRemoveEle.length > 0) {
                  for (j = 0; j < titleRemoveEle.length; ++j) {
                    titleRemoveEle[j].remove();
                  }
                }
                var titleName = titleElement.innerText;
                if (deleteClass === '' || deleteClass !== 'del cts-1') {
                  $('.listOfLinks').append(
                    '<p onClick="addLinkID(\'' +
                      curid +
                      "','figure','" +
                      dt +
                      '\');">' +
                      figName +
                      ': ' +
                      titleName +
                      '</p>'
                  );
                }
              }
            }
            $('.closelink').attr('onClick', "close_link('" + dt + "');");
            var link_text = $("#content [rid='" + dt + "']").text();
            $('.search_link').val(link_text.toString().trim());
            $('.search_link').keyup();
          } else if (link === 'ref') {
            $('#addLink').modal({
              backdrop: 'static',
              keyboard: false,
            });
            $(affnode).wrapInner(
              '<xref ref-type="bibr" rid="' + dt + '"></xref>'
            );
            autoCitationDt = dt;
            $('#content ref').each(function () {
              var spanTag = 'SPAN';
              var delTag = 'del cts-1';
              var deleteClass = '';
              var refElement = $(this)[0];
              if (refElement !== null) {
                var refChildLength = refElement.children.length;
                if (refChildLength === 1) {
                  var deleteSpan = refElement.children[0].tagName;
                  if (deleteSpan === spanTag) {
                    deleteClass = refElement.children[0].getAttribute('class');
                  }
                }
              }
              if (deleteClass !== delTag) {
                var curid = $(this).closest('ref').attr('id');
                var bibloText = this.innerText;
                bibloText = bibloText.replace('drag_indicator', '');
                $('.listOfLinks').append(
                  '<p onClick="addLinkID(' +
                    String.fromCharCode(39) +
                    '' +
                    curid +
                    '' +
                    String.fromCharCode(39) +
                    ',' +
                    String.fromCharCode(39) +
                    'bibr' +
                    String.fromCharCode(39) +
                    ',' +
                    dt +
                    ',this );refreshLink();">Bibliography ' +
                    curid +
                    ': ' +
                    bibloText +
                    '</p>'
                );
              }
            });
            $('.closelink').attr('onClick', "close_link('" + dt + "');");
            var link_text = $("#content [rid='" + dt + "']").text();
            $('.search_link').val(link_text.toString().trim());
            $('.search_link').keyup();
          } else if (link === 'table') {
            $('#addLink').modal({
              backdrop: 'static',
              keyboard: false,
            });
            $(affnode).wrapInner(
              '<xref ref-type="table" rid="' + dt + '"></xref>'
            );
            var contentElement = document.getElementById('content');
            var tableWarb = contentElement.querySelectorAll(
                "table-wrap[position='float']"
              ),
              i;
            if (tableWarb.length > 0) {
              for (i = 0; i < tableWarb.length; ++i) {
                var element = tableWarb[i];
                var parentTagname = element.parentElement.tagName;
                var deleteClass = '';
                if (parentTagname === 'SPAN') {
                  deleteClass = element.parentElement.getAttribute('class');
                }
                var storeId = element.getAttribute('store');
                var labelElement = element.querySelector('label1');
                var curid = element.getAttribute('id');
                var labelRemoveEle = labelElement.querySelectorAll(
                    'query,span.del,comment,span.sr-only'
                  ),
                  j;
                if (labelRemoveEle.length > 0) {
                  for (j = 0; j < labelRemoveEle.length; ++j) {
                    labelRemoveEle[j].remove();
                  }
                }
                var tableName = labelElement.innerText;
                var titleElement = element.querySelector('caption1');
                if (!!titleElement) {
                  var titleRemoveEle = titleElement.querySelectorAll(
                      'query,span.del,comment,span.sr-only'
                    ),
                    j;
                  if (titleRemoveEle.length > 0) {
                    for (j = 0; j < titleRemoveEle.length; ++j) {
                      titleRemoveEle[j].remove();
                    }
                  }
                  var titleName = titleElement.innerText;
                  if (deleteClass === '' || deleteClass !== 'del cts-1') {
                    $('.listOfLinks').append(
                      '<p onClick="addLinkID(\'' +
                        curid +
                        "','table','" +
                        dt +
                        '\');refreshLink();">' +
                        tableName +
                        ': ' +
                        titleName +
                        '</p>'
                    );
                  }
                }
              }
            }
            $('.closelink').attr('onClick', "close_link('" + dt + "');");
            var link_text = $("#content [rid='" + dt + "']").text();
            $('.search_link').val(link_text.toString().trim());
            $('.search_link').keyup();
          } else if (link === 'table_citation') {
            $('.number_of_rows').val('');
            $('.number_of_columns').val('');
            $('.number_of_thead').val('');
            $('.table_caption').val('');
            $('.table_title').val('');
            $('.table_footnote').val('');
            $('.table_source').val('');
            $('#tableElements').removeClass('hide');
            $('#tableElementsText').addClass('hide');
            if (findAncestor(affnode, 'pdf-editor')) {
              var tag_name = affnode.tagName;
              var store_id = affnode.getAttribute('store');
              if (tag_name === 'SPAN') {
                var inline_checked = $('.inline_table').prop('checked');
                if (inline_checked === false) {
                  $(affnode).wrapInner(
                    '<xref ref-type="table" rid="T' + dt + '"></xref>'
                  );
                }
                var store_id = affnode.parentElement.getAttribute('store');
                $('#tableinsert_flag').val('1');
                $('#tableinsert_id').val('T' + dt);
              }
              if (store_id === null) {
                var store_id =
                  affnode.parentElement.parentNode.getAttribute('store');
              }
              if (store_id !== null) {
                $('#table_submission').attr(
                  'onClick',
                  'table_submission(' + dt + ",'" + store_id + "');"
                );
                $('.closetbl').attr('onClick', "table_close('T" + dt + "');");
                $('#tableModal').modal({ backdrop: 'static' });
                var rid = 'T' + dt;
                tablefigOrder(rid, 'table', 'rid', '.table_caption');
              }
            }
          }
          $("[style='background-color: rgb(188, 188, 190);']").removeAttr(
            'style'
          );
        } else if (selected_node === 'LINK1') {
          affnode.setAttribute('linkend', dt);
          $('.listOfLinks').html('');
          if (link === 'fig_citation') {
            $('#figure_submission').show();
            $('#inline_fig_error').addClass('hide');
            // $("#disp-fig").show();
            $('#figure_label').val('');
            $('#figure_caption').val('');
            $('#fileinsert').val('');
            // $("#inline-fig").prop("checked", false);

            var store_id =
              affnode.parentElement.parentNode.getAttribute('store');

            //alert("link :"+store_id);
            if (store_id !== null) {
              $('#figure_submission').attr(
                'onClick',
                'updatefigure(' + dt + ",'" + store_id + "');"
              );
              myModalfig.style.display = 'block';

              var figure_labeltxt = 'FIG 1.0';

              var object_firstlink = $("#content link1[role='figure']")[0];

              var first_object = $(object_firstlink).text();

              var first_splits = first_object.split('.');

              var first_obj = first_splits[0];

              $("#content link1[role='figure']").each(function () {
                var link_endvalue = $(this).attr('linkend');

                if (link_endvalue === dt) {
                  var data_splits = figure_labeltxt.split('.');

                  console.log('first_val:' + data_splits[0]);
                  console.log('second_val:' + data_splits[1]);

                  var first_val = data_splits[0];
                  var second_val = data_splits[1];

                  var new_fig = +second_val + +1;
                  //$("#figure_label").val();
                  $('#figure_label').val(first_obj + '.' + new_fig);

                  $("#content link1[linkend='" + dt + "']").html(
                    first_obj + '.' + new_fig + '&nbsp;'
                  );
                }
                figure_labeltxt = $(this).text();
              });
            }
          } else if (link === 'fig') {
            $('#addLink').modal({
              backdrop: 'static',
              keyboard: false,
            });
            var contentElement = document.getElementById('content');
            var figureEle = contentElement.querySelectorAll('fig'),
              i;
            if (figureEle.length > 0) {
              for (i = 0; i < figureEle.length; ++i) {
                var element = figureEle[i];
                var parentTagname = element.parentElement.tagName;
                var deleteClass = '';
                if (parentTagname === 'SPAN') {
                  deleteClass = element.parentElement.getAttribute('class');
                }
                var storeId = element.getAttribute('store');
                var labelElement = element.querySelector('label1');
                var curid = element.getAttribute('id');
                var labelRemoveEle = labelElement.querySelectorAll(
                    'query,span.del,comment,span.sr-only'
                  ),
                  j;
                if (labelRemoveEle.length > 0) {
                  for (j = 0; j < labelRemoveEle.length; ++j) {
                    labelRemoveEle[j].remove();
                  }
                }
                var figName = labelElement.innerText;
                var titleElement = element.querySelector('caption1');
                var titleRemoveEle = titleElement.querySelectorAll(
                    'query,span.del,comment,span.sr-only'
                  ),
                  j;
                if (titleRemoveEle.length > 0) {
                  for (j = 0; j < titleRemoveEle.length; ++j) {
                    titleRemoveEle[j].remove();
                  }
                }
                var titleName = titleElement.innerText;
                if (deleteClass === '' || deleteClass !== 'del cts-1') {
                  $('.listOfLinks').append(
                    '<p onClick="addLinkID(\'' +
                      curid +
                      "','figure','" +
                      dt +
                      '\');">' +
                      figName +
                      ': ' +
                      titleName +
                      '</p>'
                  );
                }
              }
            }
            $('.closelink').attr('onClick', "close_link('" + dt + "');");
            var link_text = $("#content [rid='" + dt + "']").text();
            $('.search_link').val(link_text.toString().trim());
            $('.search_link').keyup();
          } else if (link === 'ref') {
            $('#addLink').modal({
              backdrop: 'static',
              keyboard: false,
            });
            autoCitationDt = dt;
            $('#content ref').each(function () {
              var curid = $(this).closest('ref').attr('xmlid');
              var bibloText = this.innerText;
              bibloText = bibloText.replace('drag_indicator', '');
              $('.listOfLinks').append(
                '<p onClick="addLinkID(' +
                  String.fromCharCode(39) +
                  '' +
                  curid +
                  '' +
                  String.fromCharCode(39) +
                  ',' +
                  String.fromCharCode(39) +
                  'bibr' +
                  String.fromCharCode(39) +
                  ',' +
                  dt +
                  ' );refreshLink();">Bibliography ' +
                  curid +
                  ': ' +
                  bibloText +
                  '</p>'
              );
            });
            $('.closelink').attr('onClick', "close_link('" + dt + "');");
            var link_text = $("#content [rid='" + dt + "']").text();
            $('.search_link').val(link_text.toString().trim());
            $('.search_link').keyup();
          } else if (link === 'table') {
            $('#addLink').modal({
              backdrop: 'static',
              keyboard: false,
            });
            var contentElement = document.getElementById('content');
            var tableWarb = contentElement.querySelectorAll(
                "table-wrap[position='float']"
              ),
              i;
            if (tableWarb.length > 0) {
              for (i = 0; i < tableWarb.length; ++i) {
                var element = tableWarb[i];
                var parentTagname = element.parentElement.tagName;
                var deleteClass = '';
                if (parentTagname === 'SPAN') {
                  deleteClass = element.parentElement.getAttribute('class');
                }
                var storeId = element.getAttribute('store');
                var labelElement = element.querySelector('label1');
                var curid = element.getAttribute('id');
                var labelRemoveEle = labelElement.querySelectorAll(
                    'query,span.del,comment,span.sr-only'
                  ),
                  j;
                if (labelRemoveEle.length > 0) {
                  for (j = 0; j < labelRemoveEle.length; ++j) {
                    labelRemoveEle[j].remove();
                  }
                }
                var tableName = labelElement.innerText;
                var titleElement = element.querySelector('caption1');
                if (!!titleElement) {
                  var titleRemoveEle = titleElement.querySelectorAll(
                      'query,span.del,comment,span.sr-only'
                    ),
                    j;
                  if (titleRemoveEle.length > 0) {
                    for (j = 0; j < titleRemoveEle.length; ++j) {
                      titleRemoveEle[j].remove();
                    }
                  }
                  var titleName = titleElement.innerText;
                  if (deleteClass === '' || deleteClass !== 'del cts-1') {
                    $('.listOfLinks').append(
                      '<p onClick="addLinkID(\'' +
                        curid +
                        "','table','" +
                        dt +
                        '\');refreshLink();">' +
                        tableName +
                        ': ' +
                        titleName +
                        '</p>'
                    );
                  }
                }
              }
            }
            $('.closelink').attr('onClick', "close_link('" + dt + "');");
            var link_text = $("#content [rid='" + dt + "']").text();
            $('.search_link').val(link_text.toString().trim());
            $('.search_link').keyup();
          } else if (link === 'table_citation') {
            $('.number_of_rows').val('');
            $('.number_of_columns').val('');
            $('.number_of_thead').val('');
            $('.table_caption').val('');
            $('.table_title').val('');
            $('.table_footnote').val('');
            $('.table_source').val('');
            $('#tableElements').removeClass('hide');
            $('#tableElementsText').addClass('hide');
            affnode.setAttribute('linkend', 'T' + dt);
            affnode.setAttribute('role', 'table');
            if (findAncestor(affnode, 'pdf-editor')) {
              var tag_name = affnode.tagName;
              var store_id =
                affnode.parentElement.parentNode.getAttribute('store');
              if (store_id !== null) {
                $('#table_submission').attr(
                  'onClick',
                  'table_submission(' + dt + ',' + store_id + ');'
                );
                $('.closetbl').attr('onClick', "table_close('T" + dt + "');");
                $('#tableinsert_flag').val('1');
                $('#tableinsert_id').val('T' + dt);
                $('#tableModal').modal({ backdrop: 'static' });
                var figure_labeltxt = 'Table 1.0';
                var object_firstlink = $("#content link1[role='table']")[0];
                var first_object = $(object_firstlink).text();
                var first_splits = first_object.split('.');
                var first_obj = first_splits[0];
                $("#content link1[role='table']").each(function () {
                  var link_endvalue = $(this).attr('linkend');
                  if (link_endvalue === 'T' + dt) {
                    var data_splits = figure_labeltxt.split('.');
                    var first_val = data_splits[0];
                    var second_val = data_splits[1];
                    var new_fig = +second_val + +1;
                    $('.table_caption').val(first_obj + '.' + new_fig);
                    $("#content link1[linkend='T" + dt + "']").html(
                      first_obj + '.' + new_fig + '&nbsp;'
                    );
                  }
                  var fig_text = $(this).find('.ins').text();
                  if (fig_text !== '') {
                    figure_labeltxt = $(this).find('.ins').text();
                  } else {
                    figure_labeltxt = $(this).text();
                  }
                });
              }
            }
          }
          $("[style='background-color: rgb(188, 188, 190);']").removeAttr(
            'style'
          );
        }
        // table citation
        if (
          link === 'table_citation' &&
          selected_node !== 'SPAN' &&
          selected_parent !== 'FOOTNOTE' &&
          parent_footnote_element !== 'FOOTNOTE'
        ) {
          console.log('table_inline');
          $('.number_of_rows').val('');

          $('.number_of_columns').val('');

          $('.number_of_thead').val('');

          $('.table_caption').val('');

          $('.table_title').val('');

          $('.table_footnote').val('');

          $('.table_source').val('');
          $('#tableElements').removeClass('hide');
          $('#tableElementsText').addClass('hide');

          if (findAncestor(affnode, 'pdf-editor')) {
            var tag_name = affnode.tagName;

            var store_id = affnode.getAttribute('store');

            console.log('store_idtable :' + store_id);
            if (store_id !== null) {
              $('#table_submission').attr(
                'onClick',
                'table_submission(' + dt + ',' + store_id + ');'
              );
              $('#tableModal').modal({ backdrop: 'static' });
            }
          }
        } else if (
          link === 'fig_citation' &&
          selected_node !== 'SPAN' &&
          selected_parent !== 'FOOTNOTE' &&
          parent_footnote_element !== 'FOOTNOTE'
        ) {
          if (findAncestor(affnode, 'pdf-editor')) {
            $('#figure_submission').show();
            $('#inline_fig_error').addClass('hide');
            // $("#disp-fig").show();
            $('#figure_label').val('');
            $('#figure_caption').val('');
            $('#fileinsert').val('');
            $('#insertFigure').removeClass('hide');
            $('#insertFigureText').addClass('hide');
            // $("#inline-fig").prop("checked", false);
            var tag_name = affnode.tagName;
            var store_id = affnode.getAttribute('store');
            console.log('store_idtable :' + store_id);
            if (store_id !== null) {
              $('#figure_submission').attr(
                'onClick',
                'updatefigure(' + dt + ",'" + store_id + "');"
              );
              $('#figureModal').modal({ backdrop: 'static' });
            }
          }
        } else {
          if (link === 'fig_citation' && selected_node !== 'SPAN') {
            swal(
              'Warning!',
              'You have no access to add Figure inside the Footnote and Reference element.'
            );
          } else if (link === 'table_citation' && selected_node !== 'SPAN') {
            swal(
              'Warning!',
              'You have no access to add Table inside the Footnote and Reference element.'
            );
          }
        }
      }

      //updateRevisions();

      // updatedrevisions();
      var msg = cmdKey;
      if (
        cmd.cmd === 'bold' ||
        cmd.cmd === 'italic' ||
        cmd.cmd === 'subscript' ||
        cmd.cmd === 'superscript' ||
        cmd.cmd === 'underline'
      ) {
        var cmdTxt = capitalizeFirstLetter(cmd.cmd);
        msg = selectedText + ' - change as ' + cmdTxt;
      }
      // if($(affnode).parent().hasClass('ins')){
      //   var subTagId = $(affnode).attr('data-time');
      //   var subTagName = $(affnode).prop('tagName');
      //   separateSubTag(subTagId, subTagName, affnode);
      // }
      window.Journals.addRefLink();
      autosavefunction_vxe(msg);
      scrollToLastTrack(dt);
    }
  } else {
    if (
      cmd.cmd === 'bold' ||
      cmd.cmd === 'italic' ||
      cmd.cmd === 'subscript' ||
      cmd.cmd === 'superscript' ||
      cmd.cmd === 'underline'
    ) {
      $('#insertFootnote').modal('show');
      var cmdTxt = capitalizeFirstLetter(cmd.cmd);
      $('#footnoteWarningtext').text(
        'Please select the content for adding ' + cmdTxt
      );
    }
  }
}

capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

tablefigOrder = (dt, type, flag, textbox) => {
  var contentElement = document.getElementById('content');
  var element = contentElement.querySelectorAll(
      "xref[ref-type='" + type + "']"
    ),
    i;
  var elemetArray = [];
  if (element.length > 0) {
    for (i = 0; i < element.length; ++i) {
      var deleteClass = '';
      var ele = element[i];
      var parentTagname = ele.parentElement.tagName;
      if (parentTagname === 'SPAN') {
        deleteClass = ele.parentElement.getAttribute('class');
      }
      if (deleteClass === '' || deleteClass !== 'del cts-1') {
        var linkEndvalue = ele.getAttribute(flag);
        if (linkEndvalue == dt) {
          textValue = tablefigIncrementOrder(ele, elemetArray, dt, textbox);
        }
        var a = elemetArray.indexOf(linkEndvalue);
        if (a === -1) {
          elemetArray.push(linkEndvalue);
        }
      }
    }
  }
};

tablefigIncrementOrder = (ele, elemetArray, dt, textbox) => {
  var eleTextVal = ele.innerText;
  var textArray = [];
  if (eleTextVal !== '') {
    eleText = $.trim(eleTextVal);
    eleText = eleText.replace(/\.+$/, '');
    var splitValue = '';
    if (eleText.indexOf('.') !== -1) {
      textArray = eleText.split('.');
      splitValue = '.';
    } else if (/\S/.test(eleText)) {
      splitValue = ' ';
      textArray = eleText.split(/(\s+)/).filter((e) => e.trim().length > 0);
    } else {
    }
    if (elemetArray.length > 0) {
      var first_val = textArray[0];
      var new_fig = elemetArray.length + 1;
      $(textbox).val(first_val + splitValue + new_fig);
      $("#content xref[rid='" + dt + "']").html(
        first_val + splitValue + new_fig + '&nbsp;'
      );
    } else {
      $(textbox).val(eleTextVal);
      $("#content xref[rid='" + dt + "']").html(eleTextVal + '&nbsp;');
    }
  }
};

function showpara_element() {
  $('.showpara_element').addClass('hide');
  $('.hidepara_element').removeClass('hide');
  $('contrib-group').removeClass('hidden_para');
  $('aff').removeClass('hidden_para');
  $('pp1').removeClass('hidden_para');
  $('p1').removeClass('hidden_para');
  $('title1').removeClass('hidden_para');
  $('ref').removeClass('hidden_para');
  $('contrib-group').addClass('show_para');
  $('aff').addClass('show_para');
  $('pp1').addClass('show_para');
  $('p1').addClass('show_para');
  $('title1').addClass('show_para');
  $('ref').addClass('show_para');
  $('kwd-group > title1').removeClass('show_para');
}
function hidepara_element() {
  $('.hidepara_element').addClass('hide');
  $('.showpara_element').removeClass('hide');
  $('contrib-group').addClass('hidden_para');
  $('aff').addClass('hidden_para');
  $('pp1').addClass('hidden_para');
  $('p1').addClass('hidden_para');
  $('title1').addClass('hidden_para');
  $('ref').addClass('hidden_para');
  $('contrib-group').removeClass('show_para');
  $('aff').removeClass('show_para');
  $('pp1').removeClass('show_para');
  $('p1').removeClass('show_para');
  $('title1').removeClass('show_para');
  $('ref').removeClass('show_para');
  $('kwd-group > title1').removeClass('hidden_para');
}
function getSelectedNode() {
  if (document.selection)
    return document.selection.createRange().parentElement();
  else {
    var selection = window.getSelection();
    if (selection.rangeCount > 0)
      return selection.getRangeAt(0).endContainer.parentNode;
  }
}
function addComment(e) {
  e.preventDefault();
  var userName = $('#username').val();
  var userid = $('#userid').val();
  var d = new Date();
  var id = Date.parse(d);
  var commentCount = id + '_cmt';
  var action = 'New';
  addCommentText(id, action);
  var selEle = getSelectedNode();
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set);
  var queryNode = getSelectedNode();
  var ance = findAncestor(queryNode, 'pdf-editor');
  $('#commentHead').show();
  if (findAncestor(queryNode, 'pdf-editor')) {
    $('#comment_close').attr('onClick', 'closecomment(' + id + ');');
    $('.pdf-editor').css('pointer-events', 'none');
    $('.head').css('pointer-events', 'none');
    $('#main').css('pointer-events', 'none');
    $('#commentflag').val(1);
    var tag_Name = queryNode.parentElement.tagName;
    var editable = queryNode.parentElement.getAttribute('contenteditable');
    if (editable === undefined || editable === '') {
      editable = 'true';
    }
    if (tag_Name !== 'SPAN' && tag_Name !== 'COMMENT' && editable === 'true') {
      pasteHtmlAtCaret(
        '<comment data-time="' +
          commentCount +
          '" data-userid= "' +
          userid +
          '" data-username= "' +
          userName +
          '" id="' +
          id +
          '" title="" contentEditable="false" class="material-icons-outlined cstm-primary-color f-18-px insert-comment-pos" onClick="addCommentText(' +
          id +
          ');">mode_comment</comment>'
      );
      $('#commentText').show();
      $('#commentSubmit').show();
      $('#commentdelete').hide();
      $('#commentSubmit').text('Add Comment');
      $('.model-comment').hide();
      $('.clickbox').text('');
      $('#commentText').focus();
      $('#' + id).hide();
    } else {
      $('#' + id).remove();
      $('#commentText').hide();
      $('#commentdelete').hide();
      $('#commentSubmit').hide();
      $('#commentHead').hide();
      // $(".model-comment").html("Please select the content for adding comment");
      $('.model-comment').html(
        '<center><h2>Warning!</h2><span>Please select the content for adding comment.</span></center>'
      );
      $('.model-comment').show();

      $('#' + id).remove();
      $('.pdf-editor').css('pointer-events', 'initial');
      $('.head').css('pointer-events', 'initial');
      $('#main').css('pointer-events', 'initial');
    }
  } else {
    $('#' + id).remove();
    $('#commentText').hide();
    $('#commentdelete').hide();
    $('#commentSubmit').hide();
    $('#commentHead').hide();
    // $(".model-comment").html("Please select the content for adding comment");
    $('.model-comment').html(
      '<center><h2>Warning!</h2><span>Please select the content for adding comment.</span></center>'
    );
    $('.model-comment').show();
    $('#commentflag').val(0);
    $('#' + id).remove();
    $('.pdf-editor').css('pointer-events', 'initial');
    $('.head').css('pointer-events', 'initial');
    $('#main').css('pointer-events', 'initial');
  }
  $('.add_comments').css('display', 'none');
  var msg = 'addComment';
  autosavefunction_vxe(msg);
}

addCommentText = (i, action) => {
  $('.add_comments').css('display', 'none');
  if (action === undefined) {
    action = '';
  }
  var markAsDone = $('#content #' + i).attr('status');
  if (markAsDone !== undefined && markAsDone === 'marks-done') {
    //Mark as done so block the comment edit action
  } else {
    var query_user_name = $('comment#' + i).attr('data-username');
    var userName = $('#username').val();
    $('#commentText').show();
    $('#commentSubmit').show();
    $('#commentdelete').show();
    $('.model-comment').html('');
    $('.model-comment').hide();
    if (query_user_name === userName) {
      var comment_text = $('comment#' + i).attr('title');
      var comment_value = $('<textarea />').html(comment_text).text();
      $('#commentText').val(comment_value);
      $('#commentModal').modal('show');
      $('.clickbox').css('border', '2px #337ab7 solid');
      $('#commentSubmit').attr(
        'onClick',
        "updatecomment('" + i + "','" + action + "');"
      );
      $('#commentdelete').attr('onClick', "deletecomment('" + i + "');");
      $('#commentText').focus();
      $('#commentSubmit').text('Update Comment');
    } else if (query_user_name === undefined) {
      var comment_text = $('comment#' + i).attr('title');
      var comment_value = $('<textarea />').html(comment_text).text();
      $('#commentText').val(comment_value);
      $('#commentModal').modal('show');
      $('.clickbox').css('border', '2px #337ab7 solid');
      $('#commentSubmit').attr(
        'onClick',
        "updatecomment('" + i + "','" + action + "');"
      );
      $('#commentdelete').attr('onClick', "deletecomment('" + i + "');");
      $('#commentText').focus();
      $('#commentSubmit').text('Update Comment');
    } else {
      $('#commentModal').modal('show');
      $('#commentText').hide();
      $('#commentdelete').hide();
      $('#commentSubmit').hide();
      $('.model-comment').html('You have no access to edit the commment.');
      $('.model-comment').show();
    }
    $('#commentflag').val(0);
  }
};

function pasteHtmlAtCaret(html) {
  var sel, range;
  if (window.getSelection) {
    // IE9 and non-IE
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      //range.deleteContents();
      // Range.createContextualFragment() would be useful here but is
      // non-standard and not supported in all browsers (IE9, for one)
      var el = document.createElement('div');
      el.innerHTML = html;
      var frag = document.createDocumentFragment(),
        node,
        lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  } else if (document.selection && document.selection.type !== 'Control') {
    // IE < 9
    document.selection.createRange().pasteHTML(html);
  }
}
function findAncestor(el, cls) {
  if (el) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
  }
}

updatecomment = (i, action) => {
  var id = i;
  var Comment_text = $.trim($('#commentText').val());
  var Comment = $('<div>').text(Comment_text).html();
  var Comment = Comment.replace(/"/g, '&#x0022;');
  if (Comment !== '') {
    $('.pdf-editor').css('pointer-events', 'initial');
    $('.head').css('pointer-events', 'initial');
    $('#main').css('pointer-events', 'initial');
    var d = new Date();
    var dt = Date.parse(d);
    $('#content comment#' + id).attr('title', Comment);
    $('#commentModal').modal('hide');
    $('#commentSubmit').attr('onClick', '');
    $('#commentdelete').attr('onClick', '');
    $('#commentText').val('');
    var parent_element = document.getElementById(id).parentElement;
    var parentName = document.getElementById(id).parentElement.nodeName;
    if (parentName === 'COMMENT' || parentName === 'QUERY') {
      var elecomment = document.getElementById(id);
      parent_element.parentElement.insertBefore(elecomment, parent_element);
    }
    $('#' + id).show();
    $('.add_comments').css('display', 'none');
    var msg = Comment + ' - comment updated.';
    autosavefunction_vxe(msg);
    var trackId = $('#content comment#' + id).attr('data-time');
    scrollToLastTrack(trackId);
  } else {
    $('.add_comments').css('display', '');
    document.getElementById('commentErrorText').innerHTML =
      'Empty Comment panel can’t be updated.';
    if (action === 'New') {
      document.getElementById('commentErrorText').innerHTML =
        'Please Enter the Comment';
    }
  }
};

doneCommentQuery = (id) => {
  $('#content [data-time="' + id + '"]').attr('status', 'marks-done');
  $('#content [data-time="' + id + '"]').removeClass('add-highlights');
  let selQueryTag = document.querySelector('#content [data-time="' + id + '"]');
  if (selQueryTag.childElementCount > 0) {
    let childReplies = selQueryTag.childNodes;
    childReplies.forEach((childReply) => {
      if (childReply.tagName === 'REPLY')
        childReply.setAttribute('status', 'marks-done');
    });
  }
  let msg = 'doneCommentQuery';
  let userName = $('#username').val();
  browser_details(userName + ' ------- mark as done');
  autosavefunction_vxe(msg);
};

unDoneCommentQuery = (id) => {
  $('.track-changes-list #' + id + '.solve-btn').text('Mark as done');
  $('#content [data-time="' + id + '"]').attr('status', '');
  let selQueryTag = document.querySelector('#content [data-time="' + id + '"]');
  if (selQueryTag.childElementCount > 0) {
    let childReplies = selQueryTag.childNodes;
    childReplies.forEach((childReply) => {
      if (childReply.tagName === 'REPLY') childReply.setAttribute('status', '');
    });
  }
  let msg = 'unDoneCommentQuery';
  let userName = $('#username').val();
  browser_details(userName + ' ------- mark as undone');
  autosavefunction_vxe(msg);
};

trackDeleteCommentQuery = (id, tagName, e) => {
  $(tagName + '[data-time="' + id + '"]').remove();
  var msg = 'trackDeleteCommentQuery';
  autosavefunction_vxe(msg);
  if (e != undefined) e.stopPropagation();
};

var replyComment;
replyquery = (id, replyCount) => {
  var comment_text = $('#' + id + ' .modified-txt').text();
  $('#reply-com').html(comment_text);
  // $("#reply-commentid").val(id);
  replyComment = id;
  $('#replyfor-commentid').val(replyCount);
  $('#replyText').val('');
  $('#replyQueryModal').modal('show');
};

updatereply = () => {
  var d = new Date();
  var dt = Date.parse(d);
  var replytext_value = $('#replyText').val();
  var replytext = $('<div>').text(replytext_value).html();
  // var commentid = $('#reply-commentid').val();
  var commentid = replyComment;
  var forwardid = $('#replyfor-commentid').val();
  var replytext = replytext.replace(/"/g, '&#x0022;');
  var userName = $('#username').val();
  var queryCount = replytext.length + commentid + 1;
  if (forwardid == 1) {
    $('#content reply[data-time="' + commentid + '"]').append(
      '<reply data-time="' +
        dt +
        '" comment-reply="' +
        commentid +
        '"  data-username= "' +
        userName +
        '" id="' +
        queryCount +
        '" contentEditable="false"></reply>'
    );
    $('#content reply[data-time="' + dt + '"]').attr('title', replytext);
  } else {
    $('#content query[data-time="' + commentid + '"]').append(
      '<reply data-time="' +
        dt +
        '" comment-reply="' +
        commentid +
        '"  data-username= "' +
        userName +
        '" id="' +
        queryCount +
        '" contentEditable="false"></reply>'
    );
    $('#content reply[data-time="' + dt + '"]').attr('title', replytext);
  }
  $('#replyQueryModal').modal('hide');
  var msg = 'updatereply';
  autosavefunction_vxe(msg);
  scrollToLastTrack(commentid);
};

updatereply_edit = (id) => {
  var reply_text_value = $("reply[data-time='" + id + "']").attr('title');
  var reply_value = $('<textarea />').html(reply_text_value).text();

  $('#reply-id').val(id);
  $('#update_replyText').val(reply_value);
  $('#replyUpdateModal').modal('show');
};

updatereply_text = () => {
  var query_id = $('#reply-id').val();
  var reply_content_text = $('#update_replyText').val();
  var reply_text = $('<div />').text(reply_content_text).html();
  $("reply[data-time='" + query_id + "']").attr('title', reply_text);
  $('#replyUpdateModal').modal('hide');
  var msg = 'updatereplyText';
  autosavefunction_vxe(msg);
};

deletecomment = (id) => {
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set, 'EK');
  $('#content comment#' + id).remove();
  $('#commentModal').modal('hide');
  $('.pdf-editor').css('pointer-events', 'initial');
  $('.head').css('pointer-events', 'initial');
  $('#main').css('pointer-events', 'initial');
  var msg = 'deletecomment';
  autosavefunction_vxe(msg);
  var trackId = $('.track-changes-list #' + id + '_cmt').attr('id');
  scrollToLastTrack(trackId);
};

function addQuery(e) {
  e.preventDefault();
  var userName = $('#username').val();
  var userid = $('#userid').val();
  var select_nodes = getSelectionText();
  var d = new Date();
  var id = Date.parse(d);
  var passQueryTag = 'query';
  var queryCount = id + '_qry';
  var action = 'New';
  addQueryText(id, passQueryTag, action);
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set);
  var queryNode = getSelectedNode();
  if (findAncestor(queryNode, 'pdf-editor')) {
    $('#close_query').attr('onClick', 'closequery(' + id + ');');
    $('.pdf-editor').css('pointer-events', 'none');
    $('.head').css('pointer-events', 'none');
    $('#main').css('pointer-events', 'none');
    $('#queryflag').val(1);
    $('#queryHead').show();
    var tag_Name = queryNode.parentElement.tagName;
    var editable = queryNode.parentElement.getAttribute('contenteditable');
    if (editable === undefined || editable === '') {
      editable = 'true';
    }
    if (tag_Name !== 'SPAN' && tag_Name !== 'QUERY' && editable === 'true') {
      pasteHtmlAtCaret(
        '<query data-time="' +
          queryCount +
          '" data-username= "' +
          userName +
          '" data-userid= "' +
          userid +
          '" id="' +
          id +
          '" title="" contentEditable="false" class="material-icons-outlined cstm-primary-color f-18-px insert-query-pos" onClick="addQueryText(' +
          id +
          ", '" +
          passQueryTag +
          '\');">help_outline</query>'
      );
      $('#queryText').show();
      $('#querySubmit').show();
      $('#querydelete').hide();
      $('#querySubmit').text('Add Query');
      $('.model-query').hide();
      $('#' + id).hide();
      $('.clickboxq').text('');
      $('#queryText').val('AQ: ');
      $('.clickboxq').focus();
    } else {
      $('#' + queryCount).remove();
      $('#queryText').hide();
      $('#querydelete').hide();
      $('#querySubmit').hide();
      $('#queryHead').hide();
      $('.model-query').html(
        '<center><h2>Warning!</h2><span>Please select the content for adding query.</span></center>'
      );
      $('.model-query').show();
      $('.pdf-editor').css('pointer-events', 'initial');
      $('.head').css('pointer-events', 'initial');
      $('#main').css('pointer-events', 'initial');
    }
  } else {
    $('#' + queryCount).remove();
    $('#queryText').hide();
    $('#querydelete').hide();
    $('#querySubmit').hide();
    $('#queryHead').hide();
    $('.model-query').html(
      '<center><h2>Warning!</h2><span>Please select the content for adding query.</span></center>'
    );
    $('.model-query').show();
    $('.pdf-editor').css('pointer-events', 'initial');
    $('.head').css('pointer-events', 'initial');
    $('#main').css('pointer-events', 'initial');
  }
  $('.add_query').css('display', 'none');
}
addQueryText = (i, tagName, action) => {
  if (action === undefined) {
    action = '';
  }
  $('.add_query').css('display', 'none');
  var markAsDone = $('#content #' + i).attr('status');
  if (markAsDone !== undefined && markAsDone === 'marks-done') {
    //Mark as done so block the comment edit action
  } else {
    var query_text_value = $('#content ' + tagName + '#' + i).attr('title');
    if ($('#content ' + tagName + '#' + i).parent()) {
      var deletenode = $('#content ' + tagName + '#' + i)
        .parent()
        .attr('class');
      if (deletenode === 'del cts-1') {
        return false;
      }
    }
    var query_value = $('<textarea />').html(query_text_value).text();
    $('#queryText').val(query_value);
    var query_user_name = $('#content ' + tagName + '#' + i).attr(
      'data-username'
    );
    if (query_user_name !== undefined) {
      query_user_name = $.trim(query_user_name);
    }
    var userName = $.trim($('#username').val());
    $('#queryText').show();
    $('#querydelete').show();
    $('#querySubmit').show();
    $('.model-query').html('');
    $('.model-query').hide();
    if (query_user_name === userName) {
      $('#queryModal').modal('show');
      $('#querySubmit').attr(
        'onClick',
        "updatequery('" + i + "','" + action + "');"
      );
      $('#querydelete').attr('onClick', "deletequery('" + i + "');");
      $('#querySubmit').focus();
      $('#querySubmit').text('Update Query');
    } else if (query_user_name === undefined) {
      $('#queryModal').modal('show');
      $('#querySubmit').attr(
        'onClick',
        "updatequery('" + i + "','" + action + "');"
      );
      $('#querydelete').attr('onClick', "deletequery('" + i + "');");
      $('#querySubmit').focus();
      $('#querySubmit').text('Update Query');
    } else {
      $('#queryModal').modal('show');
      $('#queryText').hide();
      $('#querydelete').hide();
      $('#querySubmit').hide();
      $('.model-query').html('You have no access to edit the query.');
      $('.model-query').show();
    }
    $('#queryflag').val(0);
  }
};

function getSelectionText() {
  var text = '';
  var activeEl = document.activeElement;
  var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
  if (
    activeElTagName === 'textarea' ||
    (activeElTagName === 'input' &&
      /^(?:text|search|password|tel|url)$/i.test(activeEl.type) &&
      typeof activeEl.selectionStart === 'number')
  ) {
    text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
  } else if (window.getSelection) {
    text = window.getSelection().toString();
  }
  return text;
}
updatequery = (i, action) => {
  $('.pdf-editor').css('pointer-events', 'initial');
  $('.head').css('pointer-events', 'initial');
  $('#main').css('pointer-events', 'initial');
  var d = new Date();
  var dt = Date.parse(d);
  var Query_text = $.trim($('#queryText').val());
  $('#queryconverttext').text(Query_text);
  var Query = $('<div>').text(Query_text).html();
  var Query = Query.replace(/"/g, '&#x0022;');
  if (Query !== '' && Query !== 'AQ: ' && Query !== 'AQ:') {
    $('#content query#' + i).attr('title', Query);
    $('#content query#' + i).attr('data-time', dt);
    $('#queryModal').modal('hide');
    $('#querySubmit').attr('onClick', '');
    $('#queryText').val('');
    var parent_element = document.getElementById(i).parentElement;
    var parentName = document.getElementById(i).parentElement.nodeName;
    if (parentName === 'QUERY' || parentName === 'COMMENT') {
      var elecomment = document.getElementById(i);
      parent_element.parentElement.insertBefore(elecomment, parent_element);
    }
    $('#' + i).show();
    $('.add_query').css('display', 'none');
    var msg = 'Query Updated.';
    autosavefunction_vxe(msg);
    var trackId = $('#content query#' + i).attr('data-time');
    scrollToLastTrack(trackId);
  } else {
    $('.add_query').css('display', '');
    document.getElementById('queryErrorText').innerHTML =
      'Empty Query panel can’t be updated.';
    if (action === 'New') {
      document.getElementById('queryErrorText').innerHTML =
        'Please Enter the Query';
    }
  }
};
function deletequery(i) {
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set, 'EK');
  $('#content query#' + i).remove();
  $('#queryModal').modal('hide');
  $('.pdf-editor').css('pointer-events', 'initial');
  $('.head').css('pointer-events', 'initial');
  $('#main').css('pointer-events', 'initial');
  var msg = 'deletequery';
  autosavefunction_vxe(msg);
  var trackId = $('.track-changes-list #' + i + '_cmt').attr('id');
  scrollToLastTrack(trackId);
}
// function addnewelements() {
//   var affnodeas = getSelectedNode();
//   if (affnodeas !== undefined) {
//     if (findAncestor(affnodeas, 'pdf-editor')) {
//       $('.newElementsText').addClass('hide');
//       $('.newElements').removeClass('hide');
//       var localdata_set = $('.localstorevalue').val();
//       storedata(localdata_set, 'EK');
//       var store_id = affnodeas.getAttribute('store');
//       if (store_id === null) {
//         var store_id = affnodeas.parentElement.getAttribute('store');
//       }
//       if (store_id !== null) {
//         // myModalElem.style.display = "block";
//         $('#elementModal').modal('show');
//         $('#heading_element span').removeAttr('style');
//         $('.new_elements').val('');
//         $('#new_elementsubmit').attr(
//           'onClick',
//           "new_elementsubmit('" + store_id + "');"
//         );
//         $('#heading_element').addClass('hide');
//         $('#list_elements').addClass('hide');
//         $('.newElementsText').addClass('hide');
//         $('.newElements').removeClass('hide');
//         $('.newElementsWarningText').addClass('hide');
//         var elementText = $('#new_elements').val();
//         if (elementText === 'Heading') {
//           $('#heading_element').removeClass('hide');
//         } else if (elementText === 'List_Sublist') {
//           $('#list_elements').removeClass('hide');
//         }
//         $('input.selectattimeElem').prop('checked', false);
//         $('input.selectattimeList').prop('checked', false);
//         $('.sublistelement').prop('checked', false);
//       }
//     } else {
//       $('#elementModal').modal('show');
//       $('.newElementsText').removeClass('hide');
//       $('.newElements').addClass('hide');
//       $('.newElementsWarningText').addClass('hide');
//     }
//   } else {
//     $('#elementModal').modal('show');
//     $('.newElementsText').removeClass('hide');
//     $('.newElements').addClass('hide');
//     $('.newElementsWarningText').addClass('hide');
//   }
// }
addnewelements = () => {
  var affnodeas = getSelectedNode();

  if (affnodeas.tagName === 'SEC' || affnodeas.tagName === 'ABSTRACT1') {
    let selection = window.getSelection();
    affnodeas = selection.getRangeAt(0).endContainer;
  }
  if (affnodeas !== undefined) {
    if (findAncestor(affnodeas, 'pdf-editor')) {
      $('.newElementsText').addClass('hide');
      $('.newElements').removeClass('hide');
      var localdata_set = $('.localstorevalue').val();
      storedata(localdata_set, 'EK');
      var store_id = affnodeas.getAttribute('store');
      if (store_id === null) {
        var store_id = affnodeas.parentElement.getAttribute('store');
      }
      affnodeas = affnodeas.closest('[store]');
      store_id = affnodeas.getAttribute('store');
      if (
        affnodeas.tagName === 'PARA' ||
        affnodeas.tagName === 'SUPERSCRIPT' ||
        affnodeas.tagName === 'TITLE1' ||
        affnodeas.tagName === 'ATTRIBUTION'
      ) {
        var parentTagName = affnodeas.parentElement.tagName;
        var tagList = [
          'blockquote',
          'epigraph',
          'source1',
          'example',
          'footnote1',
        ];
        var arrayCheckTag = $.inArray(parentTagName.toLowerCase(), tagList);
        if (arrayCheckTag !== -1) {
          store_id = affnodeas.parentElement.getAttribute('store');
        }
        if (parentTagName.toLowerCase() === 'footnote1') {
          var closePara = affnodeas.closest('para');
          if (closePara !== null) {
            store_id = closePara.getAttribute('store');
          }
        }
      }
      if (affnodeas.tagName === 'SIDEBAR') {
        var affNodeRole = affnodeas.getAttribute('role');
        if (affNodeRole === 'new-element') {
          var closePara = affnodeas.querySelector('para');
          if (closePara !== null) {
            store_id = closePara.getAttribute('store');
          }
        }
      }
      if (store_id !== null) {
        $('#heading_element span').removeAttr('style');
        $('.new_elements').val('');
        var figLength = $(affnodeas).find('table1,figure1').length;
        var action = '';
        if (figLength > 0) {
          var figElement = $(affnodeas).find('table1,figure1')[figLength - 1];
          store_id = figElement.getAttribute('store');
          action = 'before';
        }
        var elementText = $('#new_elements').val();
        var subListEle = affnodeas.closest('li');
        var sublistAction = false;
        if (subListEle !== null) {
          sublistAction = true;
        }
        $('#new_elementsubmit').attr(
          'onClick',
          "new_elementsubmit('" +
            store_id +
            "','" +
            action +
            "','" +
            elementText +
            "'," +
            sublistAction +
            ');'
        );
        $('.new-element-error').addClass('hide');
        $('#heading_element').addClass('hide');
        $('#list_elements').addClass('hide');
        $('.newElementsText').addClass('hide');
        $('.newElements').removeClass('hide');
        $('.newElementsWarningText').addClass('hide');

        if (elementText !== '') {
          if (elementText === 'Heading') {
            $('#heading_element').removeClass('hide');
            $('#elementModal').modal('show');
          } else if (elementText === 'List_Sublist') {
            $('#list_elements').removeClass('hide');
            $('#elementModal').modal('show');
          } else {
            new_elementsubmit(store_id, action, elementText);
          }
        } else {
          $('#elementModal').modal('show');
        }

        $('input.selectattimeElem').prop('checked', false);
        $('input.selectattimeList').prop('checked', false);
        $('.sublistelement').prop('checked', false);
      }
    } else {
      $('#elementModal').modal('show');
      $('.newElementsText').removeClass('hide');
      $('.newElements').addClass('hide');
      $('.newElementsWarningText').addClass('hide');
    }
  } else {
    $('#elementModal').modal('show');
    $('.newElementsText').removeClass('hide');
    $('.newElements').addClass('hide');
    $('.newElementsWarningText').addClass('hide');
  }
};
$('.new_elements').on('change', function () {
  $('.new-element-error').addClass('hide');
  var new_elements = $(this).val();
  $('#heading_element').addClass('hide');
  $('#list_elements').addClass('hide');
  if (new_elements == 'Heading') {
    $('#heading_element').removeClass('hide');
  } else if (new_elements == 'List_Sublist') {
    $('#list_elements').removeClass('hide');
  }
  $('#new_elements').val(new_elements);
});

function setup() {
  var rootEle = 'pdf-editor';
  var x = screen.height - 100;
  var y = x.toString().concat('px');

  $('#idBut').click(function () {
    findPanelSearch(rootEle);
    var d = new Date();
    var dt = Date.parse(d);
    var replaceText = $('#replace').val();
    var foundText = $('.found').first().text();
    var userName = $('#username').val();
    const userId = $('#userid').val();
    var findText =
      '<span class="del cts-1" data-cid="2" data-userid=' +
      userId +
      ' data-username="' +
      userName +
      '" data-time="' +
      dt +
      '">' +
      foundText +
      '</span>';
    replaceText =
      '<span class="ins cts-1" data-cid="2" data-userid=' +
      userId +
      ' data-username="' +
      userName +
      '" data-time="' +
      dt +
      '">' +
      replaceText +
      '</span>';
    $('.found').html(findText + '' + replaceText);
    $('.found').contents().unwrap();
    $('.search-result').html('');
    $('#find').val('');
    $('#findPanelText').val('');
    $('.found').contents().unwrap();
  });

  $('#find').focus(function () {
    $('span.hilight').contents().unwrap();
    $('#findPanelText').val($('#find').val());
  });
  $('#findPanelText').focus(function () {
    $('span.hilight').contents().unwrap();
    $('#find').val($('#findPanelText').val());
  });

  $('#idButF').click(function () {
    findPanelSearch(rootEle);
  });

  $('#replace').on('keyup', function (e) {
    var findVal = $('#find').val();
    if (findVal != '') {
      if (e.keyCode === 13) findPanelSearch(rootEle);
      else {
        $('#findPanelText').val(findVal);
        $('#findPanelTextinside').val($('#find').val());
      }
    }
  });

  $('#findPanelText').on('keyup', function (e) {
    if (e.keyCode === 13) {
      findPanelSearch(rootEle);
    } else {
      $('#find').val($('#findPanelText').val());
      $('#findPanelTextinside').val($('#findPanelText').val());
    }
  });

  $('#findPanelTextinside').on('keyup', function (e) {
    if (e.keyCode === 13) {
      findPanelSearch(rootEle);
    } else {
      $('#find').val($('#findPanelTextinside').val());
      $('#findPanelText').val($('#findPanelTextinside').val());
    }
  });

  $('#replaceinside').on('keyup', function (e) {
    $('#replace').val($('#replaceinside').val());
  });

  $('#replace').on('keyup', function (e) {
    $('#replaceinside').val($('#replace').val());
  });
}

function selectattimeElem(cls) {
  $('input.selectattimeElem').not(cls).prop('checked', false);
}

function selectattimeList(cls) {
  $('input.selectattimeList').not(cls).prop('checked', false);
}

function selectattimeListChange(cls) {
  $('input.selectattimeListChange').not(cls).prop('checked', false);
}

function sentenceCase(str) {
  //alert(str);
  return str
    .replace(/[a-z]/i, function (letter) {
      return letter.toUpperCase();
    })
    .trim();
}

var toTitleCase = function (str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
};

function new_elementsubmit(store_id) {
  $('.confirm').css({ 'margin-left': '0px', 'margin-left': '26px' });
  var tag_name = $(".pdf-editor [store='" + store_id + "']").prop('tagName');
  var parent_tagname = $(".pdf-editor [store='" + store_id + "']")
    .parent()
    .prop('tagName');

  // if (
  //   (tag_name === 'PARA' && parent_tagname === 'CHAPTER') ||
  //   (tag_name === 'PARA' && parent_tagname === 'SECTION1') ||
  //   tag_name === 'PARA' ||
  //   tag_name === 'PP1'
  // ) {
  var new_elements = $('#new_elements').val();
  if (tag_name !== '') {
    var userName = $('#username').val();
    var d = new Date();
    var dt = Date.parse(d);
    $('#elementModal').modal('hide');
    if (new_elements === 'Heading') {
      var header_val = $('.selectattimeElem:checked').val();
      $("#content [store='" + store_id + "']").after(
        '<section1 role="' +
          header_val +
          '" store="' +
          dt +
          '_sec" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '"><title1 store="' +
          dt +
          '_tit" new-elements="Type the Title Here"></title1><para store="' +
          dt +
          'p" new-elements="Type the Para Here"></para></section1>'
      );
    } else if (new_elements === 'List_Sublist') {
      var list_val = $('.selectattimeList:checked').val();
      if (list_val === 'bulletlist') {
        var sub_val = $('.sublistelement:checked').val();
        if (sub_val === 'sublist') {
          $("#content [store='" + store_id + "']").after(
            '<ul mark="disc" store="' +
              dt +
              'item" data-username="' +
              userName +
              '" data-time="' +
              dt +
              '"><li store="' +
              dt +
              'li"><para store="' +
              dt +
              'p" new-elements="Type the Para Here"></para></li></ul>'
          );
        } else {
          $("#content [store='" + store_id + "']").after(
            '<ul mark="disc" store="' +
              dt +
              'item" data-username="' +
              userName +
              '" data-time="' +
              dt +
              '"><li store="' +
              dt +
              'li"><para store="' +
              dt +
              'p" new-elements="Type the Para Here"></para></li></ul>'
          );
        }
      } else if (list_val === 'numberlist') {
        var sub_val = $('.sublistelement:checked').val();
        if (sub_val === 'sublist') {
          $("#content [store='" + store_id + "']").after(
            '<ol store="' +
              dt +
              'ol" data-username="' +
              userName +
              '" data-time="' +
              dt +
              '"><li store="' +
              dt +
              'li"><para store="' +
              dt +
              'p" new-elements="Type the Para Here" contenteditable="true"></para></li></ol>'
          );
        } else {
          $("#content [store='" + store_id + "']").after(
            '<ol store="' +
              dt +
              'ol" data-username="' +
              userName +
              '" data-time="' +
              dt +
              '"><li store="' +
              dt +
              'li"><para store="' +
              dt +
              'p" new-elements="Type the Para Here" contenteditable="true"></para></li></ol>'
          );
        }
      } else if (list_val === 'simplelist') {
        var sub_val = $('.sublistelement:checked').val();
        if (sub_val === 'sublist') {
          $("#content [store='" + store_id + "']").after(
            '<ol store="' +
              dt +
              'ol" data-username="' +
              userName +
              '" data-time="' +
              dt +
              '"><li store="' +
              dt +
              'li"><para store="' +
              dt +
              'p" new-elements="Type the Para Here"></para></li></ol>'
          );
        } else {
          $("#content [store='" + store_id + "']").after(
            '<ol store="' +
              dt +
              'ol" data-username="' +
              userName +
              '" data-time="' +
              dt +
              '"><li store="' +
              dt +
              'li"><para store="' +
              dt +
              'p" new-elements="Type the Para Here"></para></li></ol>'
          );
        }
      }
    } else if (new_elements === 'Sidebar') {
      // $("#content [store='" + store_id + "']").after(
      //   '<boxed-text contenteditable="true" role="new-element" store="' +
      //     dt +
      //     'side" data-username="' +
      //     userName +
      //     '" data-time="' +
      //     dt +
      //     '"><title1 contenteditable="true" store="' +
      //     dt +
      //     't1" new-elements="Type the Title Here"></title1><ul list-type="disc" store="' +
      //     dt +
      //     'ul"><li contenteditable="true" store="' +
      //     dt +
      //     'li"><pp1 contenteditable="true" store="' +
      //     dt +
      //     'p" new-elements="Type the Para Here"></pp1></li><li contenteditable="true" store="' +
      //     dt +
      //     'li"><pp1 contenteditable="true" store="' +
      //     dt +
      //     'p" new-elements="Type the Para Here"></pp1></li></ul></boxed-text>'
      // );
      $("#content [store='" + store_id + "']").after(
        '<boxed-text contenteditable="true" role="new-element" store="' +
          dt +
          'side" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '"><title1 store="' +
          dt +
          't1" new-elements="Type the Title Here"></title1><pp1 store="' +
          dt +
          'p" new-elements="Type the Para Here"></pp1></boxed-text>'
      );
    } else if (new_elements === 'Epigraph') {
      $("#content [store='" + store_id + "']").after(
        '<epigraph store="' +
          dt +
          '_epi" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '"><para store="' +
          dt +
          'p" new-elements="Type the Epigraph Text"></para><attribution store="' +
          dt +
          'attr" new-elements="Type the Epigraph Source"></attribution></epigraph>'
      );
    } else if (new_elements === 'source') {
      $("#content [store='" + store_id + "']").after(
        '<source1 store="' +
          dt +
          '_src" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '" new-elements="Type the Source Here" contenteditable="true"></source1>'
      );
    } else if (new_elements === 'blockquote') {
      $("#content [store='" + store_id + "']").after(
        '<blockquote store="' +
          dt +
          '_bqt" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '" contenteditable="true"><para store="' +
          dt +
          'p" new-elements="Type the Blockquote Text" contenteditable="true"></para></blockquote>'
      );
    } else if (new_elements === 'tblfn') {
      $("#content [store='" + store_id + "']").after(
        '<tblfn store="' +
          dt +
          '_tblfn" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '"  new-elements="Type the Table footnote Text" contenteditable="true"></tblfn>'
      );
    } else if (new_elements === 'tblsource') {
      $("#content [store='" + store_id + "']").after(
        '<tblsource store="' +
          dt +
          '_tblsrc" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '"  new-elements="Type the Table Source Text" contenteditable="true"></tblsource>'
      );
    } else if (new_elements === 'figsource') {
      $("#content [store='" + store_id + "']").after(
        '<figsource store="' +
          dt +
          '_figsrc" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '"  new-elements="Type the Figure Source Text" contenteditable="true"></figsource>'
      );
    } else if (new_elements === 'example') {
      $("#content [store='" + store_id + "']").after(
        '<example store="' +
          dt +
          '_ex" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '" contenteditable="true"><title store="' +
          dt +
          '_figsrc" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '" role="ExampleTitle" new-elements="Type the Example Title Text" contenteditable="true"></title><para store="' +
          dt +
          'p" new-elements="Type the Example Text" role="ExampleText" contenteditable="true"></para></example>'
      );
    }
    autosavefunction_vxe();
    scrollToLastTrack(dt);
  } else {
    // myModalElem.style.display = "none";
    $('#elementModal').modal('show');
    $('.newElementsText').addClass('hide');
    $('.newElements').addClass('hide');
    $('.newElementsWarningText').removeClass('hide');
  }
}

function changeelement() {
  var affnodeas = getSelectedNode();
  var selection_content = getHTMLOfSelection();
  $('#newlist').html('');
  $('#newlist').html(selection_content);
  $('.changeElementsText').addClass('hide');
  $('.changeElements').removeClass('hide');
  $('.changeElementsWarningText').addClass('hide');
  $('#chg-element-select-new').removeClass('hide');
  $('#chg-element-select-new-para').addClass('hide');
  if (findAncestor(affnodeas, 'pdf-editor')) {
    var localdata_set = $('.localstorevalue').val();
    storedata(localdata_set, 'EK');
    var store_id = affnodeas.getAttribute('store');
    if (store_id === null) {
      var store_id = affnodeas.parentElement.getAttribute('store');
    }
    if (store_id !== null) {
      // $("#Change_list_elements").hide();
      // myModalChngEle.style.display = "block";
      $('#changeelementModal').modal('show');
      $('#chg-element-select').val('');
      if (affnodeas.tagName === 'PARA') {
        $('#chg-element-select-new').addClass('hide');
        $('#chg-element-select-new-para').removeClass('hide');
      }
      $('#chg-element-submit').attr(
        'onClick',
        "change_elementsubmit('" + store_id + "');"
      );
      $('input.selectattimeListChange').prop('checked', false);
      $('.sublistelementChange').prop('checked', false);
    }
  } else {
    $('#changeelementModal').modal('show');
    $('.changeElementsText').removeClass('hide');
    $('.changeElements').addClass('hide');
    $('.changeElementsWarningText').addClass('hide');
  }
}
function change_elementsubmit(store_id) {
  $('.confirm').css({ 'margin-left': '0px', 'margin-left': '26px' });
  var tag_name = $(".pdf-editor [store='" + store_id + "']").prop('tagName');
  var parent_tagname = $(".pdf-editor [store='" + store_id + "']")
    .parent()
    .prop('tagName');
  if (
    (tag_name === 'PARA' && parent_tagname === 'CHAPTER') ||
    (tag_name === 'PARA' && parent_tagname === 'SECTION1') ||
    (tag_name === 'PARA' && parent_tagname !== 'CAPTION1')
  ) {
    var userName = $('#username').val();
    var d = new Date();
    var dt = Date.parse(d);
    $('#changeelementModal').modal('hide');
    var change_elements = $('#chg-element-select').val();
    var localdata_set = $('.localstorevalue').val();
    storedata(localdata_set, 'EK');
    var tagName = $("#content [store='" + store_id + "']").prop('tagName');
    if (change_elements === 'blockquote') {
      $("#content [store='" + store_id + "']").replaceWith(
        '<blockquote store="' +
          dt +
          '_chbqt" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '" contenteditable="true" data-tagName="' +
          tagName +
          '" role="change-element">' +
          $("#content [store='" + store_id + "']").html() +
          '</blockquote>'
      );
    } else if (change_elements === 'Epigraph') {
      $("#content [store='" + store_id + "']").replaceWith(
        '<epigraph store="' +
          dt +
          '_chbqt" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '" contenteditable="true" data-tagName="' +
          tagName +
          '" role="change-element">' +
          $("#content [store='" + store_id + "']").html() +
          '</epigraph>'
      );
    } else if (change_elements === 'Para') {
      $("#content [store='" + store_id + "']").replaceWith(
        '<para store="' +
          dt +
          '_chbqt" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '" contenteditable="true" data-tagName="' +
          tagName +
          '" role="change-element">' +
          $("#content [store='" + store_id + "']").html() +
          '</para>'
      );
    } else if (change_elements === 'List_Sublist') {
      var list_val = $('.selectattimeListChange:checked').val();
      if (list_val === 'bulletlist') {
        $('#newlist').wrapInner(
          '<ul mark="disc" store="' +
            dt +
            'item" data-username="' +
            userName +
            '" data-time="' +
            dt +
            '" data-tagName="' +
            tagName +
            '" role="change-element"></ul>'
        );
        $('#newlist')
          .find('para')
          .wrap('<li store="' + dt + 'li"></li>');
        var span = document.getElementById('newlist').innerHTML;
        getSelectionHtml(span);
      } else if (list_val === 'numberlist') {
        $('#newlist').wrapInner(
          '<ol store="' +
            dt +
            'item" data-username="' +
            userName +
            '" data-time="' +
            dt +
            '" data-tagName="' +
            tagName +
            '" role="change-element"></ol>'
        );
        $('#newlist')
          .find('para')
          .wrap('<li store="' + dt + 'li"></li>');
        var span = document.getElementById('newlist').innerHTML;
        getSelectionHtml(span);
      } else if (list_val === 'simplelist') {
        $('#newlist').wrapInner(
          '<ol store="' +
            dt +
            'item" data-username="' +
            userName +
            '" data-time="' +
            dt +
            '" data-tagName="' +
            tagName +
            '" role="change-element"></ol>'
        );
        $('#newlist')
          .find('para')
          .wrap('<li store="' + dt + 'li"></li>');
        var span = document.getElementById('newlist').innerHTML;
        console.log(span);
        getSelectionHtml(span);
      }
    }
    autosavefunction_vxe();
    scrollToLastTrack(dt);
  } else {
    $('.changeElementsText').addClass('hide');
    $('.changeElements').addClass('hide');
    $('.changeElementsWarningText').removeClass('hide');
  }
}
function getSelectionHtml(htmlcontent) {
  var userName = $('#username').val();
  var d = new Date();
  var dt = Date.parse(d);
  var sel, range, node;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      range = window.getSelection().getRangeAt(0);
      var html = htmlcontent;
      range.deleteContents();
      var el = document.createElement('div');
      el.innerHTML = html;
      var frag = document.createDocumentFragment(),
        node,
        lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    range.collapse(false);
    range.pasteHTML(html);
  }
}
retrievedata = (e) => {
  e.preventDefault();
  var changeId = $('.storelocal_data').children().last().attr('role');
  var tag_name = $('#content [store =' + changeId + ']').prop('tagName');
  $('.undoicon').css('pointer-events', '');
  $('.undoicon').css('opacity', '');
  var storelocalLength = $('.storelocal_data').length;
  var searchVal = '';
  var searchEle = '';
  var cursorPos = '';
  if (storelocalLength < 2) {
    searchVal = $('.storelocal_data').children().last().attr('searchVal');
    searchEle = $('.storelocal_data').children().last().attr('searchEle');
    cursorPos = $('.storelocal_data').children().last().attr('cursorPos');
  }
  if (tag_name !== undefined) {
    var sentto_redo = $('#content [store =' + changeId + ']').html();
    $('.storeredo_data').append(
      '<' +
        tag_name +
        ' role=' +
        changeId +
        ' searchVal=' +
        searchVal +
        ' searchEle=' +
        searchEle +
        ' cursorPos=' +
        cursorPos +
        '>' +
        sentto_redo +
        '</' +
        tag_name +
        '>'
    );
    $('#content [store =' + changeId + ']').html(
      $('.storelocal_data').children().last().html()
    );
    $('.storelocal_data').children().last().remove();
  } else {
    if (changeId === 'JOE') {
      $('#content').html($('.storelocal_data').children().last()[0]);
    } else {
      $('.undoicon').css('pointer-events', 'none');
      $('.undoicon').css('opacity', '.3');
    }
  }
  $('.redoicon').css('pointer-events', '');
  $('.redoicon').css('opacity', '');
  var html_count = $('#content').text().length;
  $('#character_count').val(html_count);
  var msg =
    'UNDO functionality (store id:' +
    changeId +
    ', HTML count:' +
    html_count +
    ')';
  autosavefunction_vxe(msg);
  if (storelocalLength > 2) {
    searchVal = $('.storelocal_data').children().last().attr('searchVal');
    searchEle = $('.storelocal_data').children().last().attr('searchEle');
    cursorPos = $('.storelocal_data').children().last().attr('cursorPos');
  }
  if (
    searchVal !== undefined &&
    searchVal !== 'undefined' &&
    searchVal !== '' &&
    searchVal !== 'null' &&
    searchEle !== undefined &&
    searchEle !== 'undefined' &&
    searchEle !== '' &&
    searchEle !== 'null'
  ) {
    cursorPos = parseInt(cursorPos) + 1;
    setPos(searchEle, searchVal, cursorPos);
  }
};
redofunctiondata = (e) => {
  e.preventDefault();
  var changeId = $('.storeredo_data').children().last().attr('role');
  var searchVal = $('.storeredo_data').children().last().attr('searchVal');
  var searchEle = $('.storeredo_data').children().last().attr('searchEle');
  var cursorPos = $('.storeredo_data').children().last().attr('cursorPos');
  var tag_name = $('[store =' + changeId + ']').prop('tagName');
  $('.redoicon').css('pointer-events', '');
  $('.redoicon').css('opacity', '');
  if (tag_name != undefined) {
    var sentto_undo = $('#content [store =' + changeId + ']').html();
    $('.storelocal_data').append(
      '<' +
        tag_name +
        ' role=' +
        changeId +
        ' searchVal=' +
        searchVal +
        ' searchEle=' +
        searchEle +
        ' cursorPos=' +
        cursorPos +
        '>' +
        sentto_undo +
        '</' +
        tag_name +
        '>'
    );
    $('#content [store =' + changeId + ']').html(
      $('.storeredo_data').children().last().html()
    );
    $('.storeredo_data').children().last().remove();
  } else {
    $('.redoicon').css('pointer-events', 'none');
    $('.redoicon').css('opacity', '.3');
  }
  $('.undoicon').css('pointer-events', '');
  $('.undoicon').css('opacity', '');
  var html_count = $('#content').text().length;
  $('#character_count').val(html_count);
  var msg =
    'REDO functionality (store id:' +
    changeId +
    ', HTML count:' +
    html_count +
    ')';
  autosavefunction_vxe(msg);
  if (
    searchVal !== undefined &&
    searchVal !== 'undefined' &&
    searchVal !== '' &&
    searchVal !== 'null' &&
    searchEle !== undefined &&
    searchEle !== 'undefined' &&
    searchEle !== '' &&
    searchEle !== 'null'
  ) {
    cursorPos = parseInt(cursorPos) + 1;
    setPos(searchEle, searchVal, cursorPos);
  }
};
function setPos(searchEle, searchVal, cursorPos) {
  var range = document.createRange();
  var sel = window.getSelection();
  var el = document.querySelector(
    '#content [' + searchEle + "='" + searchVal + "']"
  );
  var cur = parseInt(cursorPos);
  var i;
  var childNo = 0;
  var totalLength = 0;
  if (el === null) {
    return true;
  }
  for (i = 0; i < el.childNodes.length; i++) {
    var length = el.childNodes[i].length;
    if (length === undefined) {
      length = 0;
    }
    totalLength = totalLength + length;
    if (length <= totalLength) {
      childNo = i;
    }
  }
  if (cur >= totalLength) {
    cur = totalLength;
  }
  if (
    el !== null &&
    el.childNodes[childNo] !== undefined &&
    el.childNodes[childNo].length >= cur
  ) {
    range.setStart(el.childNodes[childNo], cur);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
  }
  return true;
}

getCaretCharacterOffsetWithin = (element) => {
  var caretOffset = 0;
  if (element !== null) {
    if (typeof window.getSelection != 'undefined') {
      var range = window.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    } else if (
      typeof document.selection != 'undefined' &&
      document.selection.type != 'Control'
    ) {
      var textRange = document.selection.createRange();
      var preCaretTextRange = document.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint('EndToEnd', textRange);
      caretOffset = preCaretTextRange.text.length;
    }
  }
  return caretOffset;
};
$(document).on('dblclick', '#content td', function () {
  var table_attr = $(this).parent().parent().parent('table').attr('id');
  var td_attr = $(this).attr('class');
  var style_attr = $(this).attr('style');
  $('.table_attr').text('');
  $('.table_attr').text(table_attr);
  if (style_attr === 'background-color: rgb(155, 179, 218);') {
    table_markcell(false, this);
    $(this).removeAttr('style');
  } else {
    table_markcell(true, this);
  }
});
function table_markcell(flag, el) {
  var cl;
  if (typeof flag !== 'boolean') {
    return;
  }
  if (typeof el === 'string') {
    el = document.getElementById(el);
  } else if (typeof el !== 'object') {
    return;
  }
  if (el.nodeName === 'TABLE') {
    cl = cell_list(el);
    el = cl[row + '-' + col];
  }
  if (!el || el.nodeName !== 'TD') {
    return;
  }
  el.table = el.table || {};
  // TABLE.table.color.cell = 'string';
  if (typeof TABLE.table.color.cell === 'string') {
    if (flag === true) {
      // remember old color
      el.table.background_old = el.style.backgroundColor;
      // set background color
      el.style.backgroundColor = TABLE.table.color.cell;
      $('.otherclass').removeClass('otherclass');
      el.className += ' otherclass';
    } else {
      el.style.backgroundColor = el.table.background_old;
    }
  }
  el.table.selected = flag;
}
function cell_list(table) {
  var matrix = [],
    matrixrow,
    lookup = {},
    c, // current cell
    ri, // row index
    rowspan,
    colspan,
    firstAvailCol,
    tr, // TR collection
    i,
    j,
    k,
    l; // loop variables
  // set HTML collection of table rows
  tr = table.rows;
  // open loop for each TR element
  for (i = 0; i < tr.length; i++) {
    // open loop for each cell within current row
    for (j = 0; j < tr[i].cells.length; j++) {
      // define current cell
      c = tr[i].cells[j];
      // set row index
      ri = c.parentNode.rowIndex;
      // define cell rowspan and colspan values
      rowspan = c.rowSpan || 1;
      colspan = c.colSpan || 1;
      // if matrix for row index is not defined then initialize array
      matrix[ri] = matrix[ri] || [];
      // find first available column in the first row
      for (k = 0; k < matrix[ri].length + 1; k++) {
        if (typeof matrix[ri][k] === 'undefined') {
          firstAvailCol = k;
          break;
        }
      }
      // set cell coordinates and reference to the table cell
      lookup[ri + '-' + firstAvailCol] = c;
      for (k = ri; k < ri + rowspan; k++) {
        matrix[k] = matrix[k] || [];
        matrixrow = matrix[k];
        for (l = firstAvailCol; l < firstAvailCol + colspan; l++) {
          matrixrow[l] = 'x';
        }
      }
    }
  }
  return lookup;
}
function mathml_equation() {
  var project_id = '<?php echo $model->project_id; ?>';
  if (project_id === 3209 || project_id === 3674 || project_id === 5144) {
    $('equation').click(function () {
      $('annotation').remove();
      var store_id = $(this).attr('store');
      var math_equn = $(this).find('mathphrase').html();
      var d = new Date();
      var dt = Date.parse(d);
      var userName = $('#username').val();
      fmath_editor.style.display = 'block';
      $('#FMathEd1_ads').css('display', 'none');
      $('#mathml_image').show();
      $('#mathML_newEdit').hide();
      $('#store_mathml').html('');
      $('#store_mathml').html(math_equn);
      changeMathML();
      $('#mathml_image').attr('onClick', 'getPng(' + store_id + ');');
    });
  }
}
function changeMathML() {
  if (e1 !== null) {
    var ta = document.getElementById('store_mathml');
    e1.mathEditor('setMathML', ta.value);
  }
}
function Addrole_attribute() {
  var affnodeas = getSelectedNode();
  if (findAncestor(affnodeas, 'pdf-editor')) {
    var localdata_set = $('.localstorevalue').val();
    storedata(localdata_set, 'EK');
    $('#lock').val('true');
    $('input.selectattime_role').prop('checked', false);
    var storeid = affnodeas.getAttribute('store');
    $('.adding_attribute').val('');
    var tag_name = affnodeas.tagName;
    var tag_parent = affnodeas.parentElement.tagName;
    $('.addroleElements').removeClass('hide');
    $('.addroleElementsText').addClass('hide');
    if (tag_parent !== 'CAPTION1' && tag_parent !== 'LI') {
      // $(".add_belowspacetitle").show();
      $('#addroleModal').modal('show');
      $('#role-select').removeClass('hide');
      $('#role-title-select').addClass('hide');
      if (tag_name === 'TITLE1') {
        $('#role-select').addClass('hide');
        $('#role-title-select').removeClass('hide');
        // myModalrl.style.display = "block";
        // $(".add_belowspacetitle").hide();
        // $('.add_roleattribute').html('<select class="add_roleattribute"><option value="">--Select Attribute--</option><option value="ExtractTitle">Extract Title</option><option value="chaptertitle">Chapter Title</option></select>');
      } else if (tag_name === 'PARA') {
        $('#role-title-select').addClass('hide');
        // myModalrl.style.display = "block";
        // $('.add_roleattribute').html('<select class="add_roleattribute"><option value="">--Select Attribute--</option><option value="symbol_para">Symbolpara</option><option value="bib_text">Bib text</option><option value="noindent">No indent</option><option value="bib_para">Bib para</option><option value="source">Source</option><option value="pararight">Para right</option><option value="pararightabove">Para right above</option><option value="paraleftabove">Para left above</option><option value="paracenterabove">Para center above</option><option value="paracenter">Para center</option><option value="inline_caption">Inline caption</option><option value="ExtractAff">Extract Aff</option><option value="ExtractAuthor">Extract Author</option><option value="ExtractText">Extract Text</option><option value="ExtractOpen">Extract Open</option></select>');
      } else {
        // swal("Warning!", "Please place the cursor inside para/heading  ! \n \n", "warning");
        $('.addroleElementsText').removeClass('hide');
        $('.addroleElements').addClass('hide');
      }
    }
    var d = new Date();
    var dt = Date.parse(d);
    affnodeas.setAttribute('roles_sam', dt);
    var role_val = affnodeas.getAttribute('role');
    var word_val = affnodeas.getAttribute('word-space');
    var abovespace_val = affnodeas.getAttribute('above-space');
    var belowspace_val = affnodeas.getAttribute('below-space');
    var leadingspace_val = affnodeas.getAttribute('leading-space');
    var wrapspace_val = affnodeas.getAttribute('wrap-space');
    $('.add_roleattribute').val(role_val);
    $('.add_wordattribute').val(word_val);
    $('.add_abovespace').val(abovespace_val);
    $('.add_belowspace').val(belowspace_val);
    $('.leading_space').val(leadingspace_val);
    if (wrapspace_val !== null) {
      var data_splits = wrapspace_val.split(',');
      var top_val = data_splits[0];
      var left_val = data_splits[1];
      var bottom_val = data_splits[2];
      var right_val = data_splits[3];
      $('.wrap_spacetop').val(top_val);
      $('.wrap_spaceleft').val(left_val);
      $('.wrap_spacebottom').val(bottom_val);
      $('.wrap_spaceright').val(right_val);
    }
    $('#Role_addattr').attr('onClick', 'Role_addattr(' + dt + ');');
    $('#lock').val('false');
  } else {
    // swal("Warning!", "Please place the cursor inside para/heading !\n \n", "warning");
    $('.addroleElementsText').removeClass('hide');
    $('.addroleElements').addClass('hide');
  }
}
$('#chg-element-select').on('change', function () {
  var new_elements = $(this).val();
  $('#Change_list_elements').hide();
  if (new_elements === 'List_Sublist') {
    $('#Change_list_elements').show();
  }
});

$('.selectattimeListChange').on('click', function () {
  var cls = this;
  selectattimeListChange(cls);
});

function getHTMLOfSelection() {
  var range;
  if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    return range.htmlText;
  } else if (window.getSelection) {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
      var clonedSelection = range.cloneContents();
      var div = document.createElement('div');
      div.appendChild(clonedSelection);
      return div.innerHTML;
    } else {
      return '';
    }
  } else {
    return '';
  }
}
function Role_addattr(dt) {
  $('#lock').val('true');
  var attr_roleval = $('#add_roleattribute').val();
  var word_val = $('.add_wordattribute').val();
  var above_val = $('.add_abovespace').val();
  var below_val = $('.add_belowspace').val();
  var leading_val = $('.leading_space').val();
  $('#content [roles_sam = ' + dt + ']').removeAttr('role');
  $('#content [roles_sam = ' + dt + ']').removeAttr('word-space');
  $('#content [roles_sam = ' + dt + ']').removeAttr('above-space');
  $('#content [roles_sam = ' + dt + ']').removeAttr('below-space');
  $('#content [roles_sam = ' + dt + ']').removeAttr('leading-space');
  $('#content [roles_sam = ' + dt + ']').removeAttr('wrap-space');
  if (attr_roleval !== '') {
    $('#content [roles_sam = ' + dt + ']').attr('role', attr_roleval);
  }
  if (word_val !== '') {
    $('#content [roles_sam = ' + dt + ']').attr('word-space', word_val);
  }
  if (above_val !== '') {
    $('#content [roles_sam = ' + dt + ']').attr('above-space', above_val);
  }
  if (below_val !== '') {
    $('#content [roles_sam = ' + dt + ']').attr('below-space', below_val);
  }
  if (leading_val !== '') {
    $('#content [roles_sam = ' + dt + ']').attr('leading-space', leading_val);
  }
  var userName = $('#username').val();
  $('#content [roles_sam = ' + dt + ']').attr('data-username', userName);
  $('#content [roles_sam = ' + dt + ']').attr('data-time', dt);
  $('#content [roles_sam]').removeAttr('roles_sam');
  $('#addroleModal').modal('hide');
  autosavefunction_vxe();
  scrollToLastTrack(dt);
  $('#lock').val('false');
}
function ShowQuery() {
  $('#author_comment').hide();
  $('.QueryList').show();
  $('.QueryList').html(
    "<h3 class='query_heading'>Queries</h3><div class='queryli'><ol id='queryol'></ol></div>"
  );
  $('#queryol').html('');
  var query_length = $('.pdf-editor query').length;
  if (query_length > 0) {
    $('.pdf-editor query').each(function () {
      var reply_length = $(this).children('reply').length;
      if (reply_length > 0) {
        var query_id = $(this).attr('data-time');
        var query_value = $(this).attr('title');
        if (query_value !== '') {
          $('#queryol').append(
            "<li id='" +
              query_id +
              "'><p>" +
              $(this).attr('title') +
              '</p></li>'
          );
          $('#' + query_id).append(
            "<ul type='disc' id='" + query_id + "_ol'></ul>"
          );
          $(this)
            .find('reply')
            .each(function (x, v) {
              if ($(v).attr('status') != 'marks-done') {
                var replytext = $(v).attr('title');
                $('#' + query_id + '_ol').append('<li>' + replytext + '</li>');
              }
            });
        }
      } else {
        var query_value = $(this).attr('title');
        if (query_value !== '') {
          $('#queryol').append('<li><p>' + $(this).attr('title') + '</li>');
        }
      }
    });
  } else {
    $('.query_heading').hide();
    $('.modal-contentql').css('width', '22%');
    $('#queryol').html(
      "<h3 style='margin-left: -1.5rem;'>No Queries in this Document</h3>"
    );
  }
  // modalql.style.display = "block";
  $('#queryListModal').modal('show');
}
hide_trackchanges = () => {
  $('.hide_trackchanges').addClass('hide');
  $('.show_trackchanges').removeClass('hide');
  $('.del').hide();
  $('table .delete').hide();
};
show_trackchanges = () => {
  $('.show_trackchanges').addClass('hide');
  $('.hide_trackchanges').removeClass('hide');
  $('.del').show();
  $('table .delete').show();
};
function ShowTag() {
  $('#lock').val('true');
  // loadajaxsucessmsg();
  $('.pdf-editor *')
    .not('footnoteno')
    .not('parachange')
    .not('thead')
    .not('table')
    .not('tgroup')
    .not('imageobject')
    .not('mediaobject')
    .not('landscapepageout')
    .not('landscapepage')
    .not('emphasis')
    .not('pageno')
    .not('rh')
    .not('pagenor')
    .not('pagenob')
    .not('strike')
    .not('italic')
    .not('bold')
    .not('tbody')
    .not('tr')
    .not('td')
    .not('sup')
    .not('sub')
    .not('u')
    .not('i')
    .not('b')
    .not('ins')
    .not('span')
    .not('del')
    .not('comment')
    .not('superscript')
    .not('subscript')
    .not('query')
    .not('reply')
    .addClass('tag'),
    $('.pdf-editor *')
      .not('parachange')
      .not('thead')
      .not('table')
      .not('footnoteno')
      .not('tgroup')
      .not('imageobject')
      .not('mediaobject')
      .not('landscapepageout')
      .not('landscapepage')
      .not('emphasis')
      .not('pageno')
      .not('rh')
      .not('pagenor')
      .not('pagenob')
      .not('strike')
      .not('italic')
      .not('bold')
      .not('tbody')
      .not('tr')
      .not('td')
      .not('sup')
      .not('sub')
      .not('u')
      .not('i')
      .not('b')
      .not('ins')
      .not('span')
      .not('comment')
      .not('superscript')
      .not('subscript')
      .not('query')
      .not('reply')
      .not('del')
      .not('font')
      .each(function (t) {
        var e = $(this).prop('tagName');
        (e = e
          .replace('1', '')
          .replace('UL', 'ITAMIZEDLIST')
          .replace('OL', 'ORDEREDLIST')),
          'TITLET' == $(this).prop('tagName').toUpperCase() && (e = 'TITLE'),
          $(this).attr('title', e);
      });
  $('pp1').attr('title', 'Para');
  $('.show_xmltag').addClass('hide');
  $('.hide_xmltag').removeClass('hide');
  // disablePopup();
  $('#lock').val('false');
}
function hide_xmltag() {
  $('#lock').val('true');
  $('pp1').removeAttr('title');
  $('.pdf-editor *')
    .not('footnoteno')
    .not('parachange')
    .not('thead')
    .not('table')
    .not('tgroup')
    .not('imageobject')
    .not('mediaobject')
    .not('landscapepageout')
    .not('landscapepage')
    .not('emphasis')
    .not('pageno')
    .not('rh')
    .not('pagenor')
    .not('pagenob')
    .not('strike')
    .not('italic')
    .not('bold')
    .not('tbody')
    .not('tr')
    .not('td')
    .not('sup')
    .not('sub')
    .not('u')
    .not('i')
    .not('b')
    .not('ins')
    .not('span')
    .not('del')
    .not('comment')
    .not('superscript')
    .not('subscript')
    .not('query')
    .not('reply')
    .addClass('tag'),
    $('.pdf-editor *')
      .not('parachange')
      .not('thead')
      .not('table')
      .not('footnoteno')
      .not('tgroup')
      .not('imageobject')
      .not('mediaobject')
      .not('landscapepageout')
      .not('landscapepage')
      .not('emphasis')
      .not('pageno')
      .not('rh')
      .not('pagenor')
      .not('pagenob')
      .not('strike')
      .not('italic')
      .not('bold')
      .not('tbody')
      .not('tr')
      .not('td')
      .not('sup')
      .not('sub')
      .not('u')
      .not('i')
      .not('b')
      .not('ins')
      .not('span')
      .not('comment')
      .not('superscript')
      .not('subscript')
      .not('query')
      .not('reply')
      .not('del')
      .not('font')
      .each(function (t) {
        var e = $(this).prop('tagName');
        (e = e
          .replace('1', '')
          .replace('UL', 'ITAMIZEDLIST')
          .replace('OL', 'ORDEREDLIST')),
          'TITLET' == $(this).prop('tagName').toUpperCase() && (e = 'TITLE'),
          $(this).removeAttr('title');
      });
  $('.pdf-editor *').removeClass('tag');
  $('.hide_xmltag').addClass('hide');
  $('.show_xmltag').removeClass('hide');
  $('#lock').val('false');
}
function table_submission(tbl_id, store_id) {
  $('.table_attr').text('');
  var inline_checked = $('.inline_table').prop('checked');
  var paste_checked = $('.paste_table').prop('checked');
  var inlinePasteChecked = $('.inlinePaste').prop('checked');
  var linkend = 'T' + tbl_id;
  var userName = $('#username').val();
  let user_id = $('#userid').val();
  var linkend_chk = $("[rid='" + linkend + "']").text();
  var pasteID = '#paste_table .table_content';
  if (inlinePasteChecked === true) {
    pasteID = '#inlinePaste .table_content';
  }
  var table_caption = $('.table_caption').val();
  var column_value = $('.number_of_columns').val();
  var row_value = $('.number_of_rows').val();
  Array.from($(pasteID).find('*')).forEach((data, index) => {
    let currTag = $(data).prop('tagName');
    if (
      currTag !== 'TABLE' &&
      currTag !== 'THEAD' &&
      currTag !== 'TBODY' &&
      currTag !== 'TH' &&
      currTag !== 'TR' &&
      currTag !== 'TD' &&
      currTag !== 'SPAN' &&
      currTag !== 'UL' &&
      currTag !== 'LI' &&
      currTag !== 'B' &&
      currTag !== 'I'
    ) {
      if (currTag === 'P') {
        let childData = $(data).children();
        let newSpan = document.createElement('P');
        newSpan = $(newSpan).html(childData);
        $(data).replaceWith(newSpan);
      } else {
        let childData = $(data).children();
        $(data).replaceWith(childData);
      }
    }
  });
  var table_contents1 = $.trim($(pasteID).html());
  var d = new Date();
  var dt = Date.parse(d);
  if (column_value !== '' || row_value !== '' || table_contents1 !== '') {
    if (
      inline_checked === true ||
      (linkend_chk != '' && paste_checked != true)
    ) {
      $('#tableinsert_flag').val('0');
      $('#tableinsert_id').val('');
      var localdata_set = $('.localstorevalue').val();
      storedata(localdata_set, 'EK');
      if (inline_checked === true) {
        $("#content [store='" + store_id + "']").after(
          '<table-wrap class="ins cts-1" position="inline" data-time="' +
            tbl_id +
            '_tbl" data-username="' +
            userName +
            '" store="' +
            tbl_id +
            '" contenteditable="true"></table-wrap>'
        );
      } else {
        var table_length = $("#content [store='" + store_id + "']").find(
          'table-wrap'
        ).length;
        if (table_length > 0) {
          var table_store = $("#content [store='" + store_id + "']").find(
            'table-wrap'
          )[0];
          var tbl_store = $(table_store).attr('store');
          $("#content [store='" + tbl_store + "']").before(
            '<table-wrap class="ins cts-1" position="float" id ="T' +
              tbl_id +
              '" data-time="' +
              tbl_id +
              '_tbl" data-username="' +
              userName +
              '" store="' +
              tbl_id +
              '" contenteditable="true" linkend_tbl ="' +
              table_caption +
              '"></table-wrap>'
          );
        } else {
          $("#content [store='" + store_id + "']").after(
            '<table-wrap class="ins cts-1" position="float" id ="T' +
              tbl_id +
              '" data-time="' +
              tbl_id +
              '_tbl" data-username="' +
              userName +
              '" store="' +
              tbl_id +
              '" contenteditable="true" linkend_tbl ="' +
              table_caption +
              '"></table-wrap>'
          );
        }
      }
      var tbl = document.createElement('table');
      var tblBody = document.createElement('tbody');
      var row_value = $('.number_of_rows').val();
      var column_value = $('.number_of_columns').val();
      if (row_value === '') {
        row_value = 1;
      }
      if (column_value === '') {
        column_value = 1;
      }
      for (var i = 0; i < row_value; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < column_value; j++) {
          var cell = document.createElement('td');
          var att = document.createAttribute('store');
          att.value = 'td_' + tbl_id + '_i' + i + '_' + j;
          cell.setAttributeNode(att);
          var cellText = document.createTextNode('');
          cell.appendChild(cellText);
          row.appendChild(cell);
        }
        tblBody.appendChild(row);
      }
      var thead_value = $('.number_of_thead').val();
      if (thead_value > 0) {
        var tblhead = document.createElement('thead');
        for (var k = 0; k < thead_value; k++) {
          var rowhd = document.createElement('tr');
          for (var l = 0; l < column_value; l++) {
            var cellhd = document.createElement('td');
            var att = document.createAttribute('store');
            att.value = 'td_' + tbl_id + '_k' + k + '_' + l;
            cellhd.setAttributeNode(att);
            var cellTexthd = document.createTextNode('');
            cellhd.appendChild(cellTexthd);
            rowhd.appendChild(cellhd);
          }
          tblhead.appendChild(rowhd);
        }
        tbl.appendChild(tblhead);
      }
      tbl.appendChild(tblBody);
      var table_title = $('.table_title').val();
      if (inline_checked === false) {
        $("#content [store='" + tbl_id + "']").append(
          '<label1 class="ins cts-1" data-username="' +
            userName +
            '"  data-time="' +
            tbl_id +
            '_lab">' +
            table_caption +
            '</label1>'
        );
        $("#content [store='" + tbl_id + "']").append(
          '&nbsp;<caption1 store="' +
            tbl_id +
            '-caption1" data-username="' +
            userName +
            '"><p1 store="' +
            tbl_id +
            '-para1">' +
            table_title +
            '</p1></caption1>'
        );
      }
      $("#content [store='" + tbl_id + "']").append(tbl);
      if (inline_checked === false) {
        var table_footnote = $('.table_footnote').val();
        if (table_footnote != '') {
          let footnoteTag =
            '<table-wrap-foot store="' +
            dt +
            'foot"><fn id="fn1" store="' +
            dt +
            'footfn"><pp1 store="' +
            dt +
            'fnpp1">' +
            table_footnote +
            '</pp1></fn></table-wrap-foot>';
          $("#content [store='" + tbl_id + "']").append(footnoteTag);
        }
        var table_source = $('.table_source').val();
        if (table_source != '') {
          $("#content [store='" + tbl_id + "']").append(
            '<tblsource store="' +
              tbl_id +
              '_src">' +
              table_source +
              '</tblsource>'
          );
        }
      }
      tbl.setAttribute('class', 'insert_table');
      tbl.setAttribute('id', 'table_' + tbl_id);
      $('#tableModal').modal('hide');
      $("#content [store='" + tbl_id + "'] *").attr('contenteditable', 'true');
      var msg = 'New inline table inserted.';
      if (inline_checked === false) {
        msg = table_caption + ' has been inserted.';
        var rearrangeResult = table_rearrange('T' + tbl_id, 'Add');
        msg = msg + rearrangeResult;
      }
      autosavefunction_vxe(msg);
      scrollToLastTrack(tbl_id + '_tbl');
    } else if (
      paste_checked === true ||
      linkend_chk != '' ||
      inlinePasteChecked === true
    ) {
      var localdata_set = $('.localstorevalue').val();
      $('#tableinsert_flag').val('0');
      $('#tableinsert_id').val('');
      storedata(localdata_set, 'EK');
      var table_caption = $('.table_caption').val();
      var table_title = $('.table_title').val();
      var tableStr =
        '<span class="ins cts-1" contenteditable="true" data-username="' +
        userName +
        '" data-time="' +
        tbl_id +
        '_tbl" ><table-wrap position="float" data-time="' +
        tbl_id +
        '_tbl" data-username="' +
        userName +
        '" store="' +
        dt +
        'span" id ="T' +
        tbl_id +
        '" contenteditable="true" linkend_tbl ="' +
        table_caption +
        '"><label1 store="' +
        dt +
        'label">' +
        table_caption +
        '</label1><caption1 store="' +
        dt +
        'caption"> <p1 store="' +
        dt +
        'p1">' +
        table_title +
        '</p1></caption1></table-wrap></span>';
      if (inlinePasteChecked) {
        tableStr =
          '<table-wrap position="inline" data-time="' +
          tbl_id +
          '_tbl" data-username="' +
          userName +
          '" store="' +
          tbl_id +
          '" id ="T' +
          tbl_id +
          '" contenteditable="true" ></table-wrap>';
      }
      tableStr = tableStr;
      $("#content [store='" + store_id + "']").after(tableStr);
      var table_contents = $.trim($(pasteID).html());
      $(pasteID + ' *').removeAttr('style');
      $(pasteID + ' *').removeAttr('class');
      $(pasteID + ' o:p').remove();
      var st_id = 'tr_' + tbl_id;
      $(pasteID + ' tr').each(function (i, v) {
        var myRow = $(this);
        myRow.removeAttr('valign');
        myRow.attr('store', st_id + '_' + i);
        var tcol_id = 'td_' + tbl_id;
        myRow.find('td').each(function (j) {
          var td_colspan = $(this).attr('colspan');
          if (typeof td_colspan !== typeof undefined && td_colspan !== false) {
            var namest = j + 1;
            $(this).attr('namest', namest);
            var colspan_value = parseInt(td_colspan);
            var nameend = namest + colspan_value - 1;
            $(this).attr('nameend', nameend);
          }
          $(this).attr('store', tcol_id + '_' + j);
          $(this).removeAttr('style');
          $(this).removeAttr('valign');
        });
      });
      var table_content = $.trim($(pasteID).html());
      $('#newlist')
        .html(table_content)
        .find('table')
        .attr('id', 'table_' + tbl_id);
      var table_content = $.trim($('#newlist').html());
      $('#T' + tbl_id).append(       
        table_content         
      );
      $('#T' + tbl_id).unwrap();
      if (inline_checked === false) {
        var table_footnote = $('.table_footnote').val();
        if (table_footnote != '') {
          let footnoteTag =
            '<table-wrap-foot store="' +
            dt +
            'foot"><fn id="fn1" store="' +
            dt +
            'footfn"><pp1 store="' +
            dt +
            'fnpp1">' +
            table_footnote +
            '</pp1></fn></table-wrap-foot>';
            $('#T' + tbl_id).append(footnoteTag);
        }
        var table_source = $('.table_source').val();
        if (table_source != '') {
          $('#T' + tbl_id).append(
            '<tblsource store="' +
              tbl_id +
              '_src">' +
              table_source +
              '</tblsource>'
          );
        }
      }
      $('#tableModal').modal('hide');
      let msg =
        'Table ' + table_caption + ' table_caption from Copy from word.';
      if (paste_checked) {
        let rearrangeResult = table_rearrange('T' + tbl_id, 'Add');
        msg = msg + rearrangeResult;
      }      
      let tableTags = document.getElementById('T'+tbl_id).querySelectorAll('table-wrap, label1, caption1, table, thead, tbody, tr, td, table-wrap-foot, b, i, ol, ul, li, pp1');
      Array.from(tableTags).forEach((data) => {
        Array.from(data.attributes).forEach((dat) => {
          let attrName = dat.name
          if(attrName !== 'store' && attrName !== 'spellcheck' && attrName !== 'contenteditable' && attrName !== 'id' && attrName !== 'colspan' && attrName !== 'rowspan') {              
            data.removeAttribute(attrName);
          }
        })
      })      
      autosavefunction_vxe(msg);
    } else {
      $('#tableModal').modal({
        backdrop: 'static',
      });
      $("#content [store='" + tbl_id + "']").remove();
      $('#tableElements').addClass('hide');
      $('#tableElementsText').removeClass('hide');
      $('#tableElementsText').html(
        '<center><h2>Warning!</h2><span>Please select the table citation! \n Ex: Table 1.1,Table 2.1 etc... \n \n</span></center>'
      );
    }
  } else {
    if (!inline_checked && !paste_checked && !inlinePasteChecked) {
      let footnote = $('.table_footnoteNew').val();
      if (footnote !== '') {
        let table1Ele = $("#content [id='" + tbl_id + "']").closest(
          'table-wrap'
        );
        let fnStr =
          '<fn store="' +
          dt +
          '_fn"><pp1><span data-cid="2" class="ins cts-2" data-userid=' +
          user_id +
          ' data-username="' +
          userName +
          '" data-time="' +
          dt +
          '">' +
          footnote +
          '</span></pp1></fn>';
        if (table1Ele.length > 0) {
          table1Ele = table1Ele[0];
          let fnEle = table1Ele.getElementsByTagName('fn');
          if (fnEle.length > 0) {
            fnEle = fnEle[fnEle.length - 1];
            $(fnEle).after(fnStr);
          } else {
            $(table1Ele).append(
              '<table-wrap-foot store="' +
                dt +
                '_fnwarp" >' +
                fnStr +
                '</table-wrap-foot>'
            );
          }
        }
        $('#tableModal').modal('hide');
        var msg = 'New footnote table inserted.';
        let tableTags = document.getElementById('T'+tbl_id).querySelectorAll('table-wrap, label1, caption1, table, thead, tbody, tr, td, table-wrap-foot, b, i, ol, ul, li, pp1');
        Array.from(tableTags).forEach((data, index) => {
          Array.from(data.attributes).forEach((dat, index1) => {
            let attrName = dat.name
            if(attrName !== 'store' && attrName !== 'spellcheck' && attrName !== 'contenteditable' && attrName !== 'id' && attrName !== 'colspan' && attrName !== 'rowspan') {              
              data.removeAttribute(attrName);
            }
          })
        })
        autosavefunction_vxe(msg);
        return false;
      } else {
      }
    }
    $('.table_error').text('Please Enter the No of Columns/No of Rows');
    if (paste_checked === true || inlinePasteChecked === true) {
      $('.table_error').text('Please Enter Paste here');
    }
    $('.table_error').removeClass('hide');
  }  
}

$(document).bind('contextmenu', function (event) {
  // Avoid the real one

  var rootEle = 'pdf-editor';
  $('#rightclickaction').val('0');
  $('#rightclickactiondt').val('');
  var affnode = getSelectedNode();
  if (findAncestor(affnode, rootEle)) {
    event.preventDefault();
    // Show contextmenu
    $('.custom-menu')
      .finish()
      .toggle(100)
      // In the right position (the mouse)
      .css({
        top: event.pageY + 'px',
        left: event.pageX + 'px',
      });
  }
  var domTime = $(event.toElement).attr('data-time');
  var tag_name = affnode.tagName;
  if (tag_name === 'TITLE1') {
    domTime = affnode.parentElement.getAttribute('data-time');
  }
  $('.addroleAttributes').addClass('hide');
  if (tag_name === 'PARA') {
    $('.addroleAttributes').removeClass('hide');
  }
  $('.RefRemove').addClass('RefHide');
  if (tag_name === 'XREF') {
    var role = affnode.getAttribute('ref-type');
    if (role === 'bibr') {
      $('#referenceLink').removeClass('RefHide');
    } else if (role === 'table') {
      $('#tableLink').removeClass('RefHide');
    } else if (role === 'fig') {
      $('#figureLink').removeClass('RefHide');
    }
  }
  var biblo = affnode.closest('ref');
  $('li.link_figure').removeClass('hide');
  $('li.link_reference').removeClass('hide');
  $('li.link_table').removeClass('hide');
  $('li.custom-menu-main').addClass('hide');
  $('.custom-menu-sub').removeClass('menu-ative');
  if (biblo !== null) {
    $('li.link_figure').addClass('hide');
    $('li.link_reference').addClass('hide');
    $('li.link_table').addClass('hide');
    $('li.custom-menu-main').removeClass('hide');
  }
  $('.custom-menu').attr('id', domTime);
  if (domTime !== undefined && domTime !== null)
    $('.accept-change').removeClass('hide');
  else $('.accept-change').addClass('hide');
});
// If the document is clicked somewhere
$(document).bind('mousedown', function (e) {
  // If the clicked element is not the menu
  if (!$(e.target).parents('.custom-menu').length > 0) {
    // Hide it
    $('.custom-menu').hide(100);
  }
});
$('.custom-menu-main').on('mousedown', function (e) {
  var menu = $(this).attr('data-menu');
  $('.custom-menu-sub').removeClass('menu-ative');
  $('#submenu' + menu).addClass('menu-ative');
});
$('.redColorEle').on('mousedown', function (e) {
  let fontValue = e.target.getAttribute('data-tagName');
  let colour = e.target.getAttribute('data-color');
  e.preventDefault();
  changeColorEle(fontValue, colour);
});

function changeRefEle(dat) {
  let fontValue, colour;
  switch (dat) {
    case 76:
      fontValue = 'SURNAME';
      colour = '#178a39';
      break; //Surname Shortcut Sht + Ctrl + L key
    case 70:
      fontValue = 'FIRSTNAME';
      colour = '#22b14c';
      break; //ForeName Shortcut Sht + Ctrl + F key
    case 89:
      fontValue = 'PUBDATE';
      colour = '#BA1419';
      break; //Year Shortcut Sht + Ctrl + Y key
    case 49:
      fontValue = 'FIRSTPAGE';
      colour = '#b7ca19';
      break; //First Page Shortcut Sht + Ctrl + 1 key
    case 50:
      fontValue = 'LASTPAGE';
      colour = '#fb5302';
      break; //Last Page Shortcut Sht + Ctrl + 2 key
    case 51:
      fontValue = 'CHAPTERTITLE';
      colour = '#d98282';
      break; //Chapter Title Shortcut Sht + Ctrl + 3 key
    case 53:
      fontValue = 'PUBLISHERNAME';
      colour = '#d98282';
      break; //publisher Shortcut Sht + Ctrl + 5 key
    case 54:
      fontValue = 'PUBLISHERLOC';
      colour = '#2198cb';
      break; //LOC Shortcut Sht + Ctrl + 6 key
    case 55:
      fontValue = 'ARTICLETITLE';
      colour = '#0fd1d2';
      break; //ArticleTitle Shortcut Sht + Ctrl + 7 key
    case 56:
      fontValue = 'JOURNALTITLE';
      colour = '#989898';
      break; //JournalTitle Shortcut Sht + Ctrl + 8 key
  }
  changeColorEle(fontValue, colour);
}

function changeColorEle(fontValue, colour) {
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set, 'EK');
  var range, sel;
  var seletNode = getSelectedNode();
  let d = new Date();
  let dte = Date.parse(d);
  if (seletNode !== null && seletNode.tagName === 'SPAN') {
    var authorSpan = seletNode.closest(
      'span[style="background-color: mistyrose;"]'
    );
    if (authorSpan !== null) {
      seletNode.innerHTML =
        '<span style="background-color: mistyrose;" data-title="NAME"><font color="' +
        colour +
        '">' +
        seletNode.innerHTML +
        '</font></span>';
      $(authorSpan).after(seletNode);
    }
  }
  if (window.getSelection) {
    // IE9 and non-IE
    try {
      document.execCommand('foreColor', false, colour);
    } catch (ex) {}
  } else if (document.selection && document.selection.createRange) {
    // IE <= 8 case
    range = document.selection.createRange();
    range.execCommand('foreColor', false, colour);
  }
  var ele = getSelectedNode();
  var parentNode = ele.parentElement;
  if (parentNode !== null && parentNode.tagName === 'SPAN') {
    var gParentNode = parentNode.parentElement;
    if (gParentNode !== null && gParentNode.tagName === 'FONT') {
      $($(gParentNode)[0]).contents().unwrap();
    }
  }
  var tag = ele.tagName;
  if (tag !== 'FONT') {
    ele = ele.closest('font');
  }
  var styleColor = '';
  if (ele !== null) {
    styleColor = ele.getAttribute('color');
    if (colour.toLowerCase() === styleColor.toLowerCase()) {
      ele.removeAttribute('style');
      if (colour.toLowerCase() === '#0072ff') {
        ele.setAttribute('style', 'background-color: moccasin');
      }
    }
    var bibloEle = ele.closest('ref');
    ele.setAttribute('title', fontValue);
    if (bibloEle !== null) {
      var storeid = bibloEle.getAttribute('store');
      var fontELe = $("#content [store='" + storeid + "']").find(
        'font:not([color])'
      );
      if (fontELe.length > 0) {
        for (var i = 0; i < fontELe.length; i++) {
          var fontElement = fontELe[i];
          $(fontElement).contents().unwrap();
        }
      }
    }
  }
  $('.custom-menu').hide(100);
  var msg = 'Reference color - ' + colour;
  autosavefunction_vxe(msg);
}

$('.referenceType').on('mousedown', function (e) {
  e.preventDefault();
  let type = e.target.getAttribute('data-color');
  let seletedNode = getSelectedNode();
  seletedNode = seletedNode.closest('mixed-citation');
  if (!!seletedNode) {
    let bookRefLen = seletedNode.querySelectorAll(
      'font[color="#4b0082"],font[color="#3c352d"]'
    );
    let journalRef = seletedNode.querySelectorAll(
      'font[title="ARTICLE-TITLE"],font[color="#2da9bd"],font[color="#0b9428"]'
    );
    if (bookRefLen.length > 0 && type !== 'book') {
      $('#insertFootnote').modal('show');
      $('#footnoteWarningtext').text('Selected references is book type.');
      return false;
    }
    if (journalRef.length > 0 && type !== 'journal') {
      $('#insertFootnote').modal('show');
      $('#footnoteWarningtext').text('Selected references is journal type.');
      return false;
    }
    let localdata_set = $('.localstorevalue').val();
    storedata(localdata_set, 'EK');
    seletedNode.setAttribute('publication-type', type);
    $('.custom-menu').hide(100);
    let msg = 'Reference color tag - ' + type;
    autosavefunction_vxe(msg);
  }
});

function link_figure() {
  doCommand('hiliteColor', 'fig');
}
function link_reference() {
  doCommand('hiliteColor', 'ref');
}
function link_table() {
  doCommand('hiliteColor', 'table');
}
$('.search_link').on('keyup', function (e) {
  var searchText = $('.search_link').val();
  var splitText = searchText.split(/(\s+)/).filter((e) => e.trim().length > 0);
  searchTextAll = searchText;
  if (splitText.length > 0) {
    var searchTextAll = '';
    $.each(splitText, function (i) {
      var ele = ':contains("' + splitText[i] + '")';
      searchTextAll = ele + searchTextAll;
    });
  }
  $('.listOfLinks p').hide().filter(searchTextAll).show(); // show the filtered elements
});
function addLinkID(id, type, dt, cls) {
  var refType = 'bibr';
  // if(type === refType){
  var findText = $("#content [rid='" + dt + "']").text();
  $("#content [rid='" + dt + "']").attr('role', type);
  var title_attr = $(cls).text();
  $("#content [rid='" + dt + "']").attr('title', title_attr);
  $("#content [rid='" + dt + "']").attr('rid', id);
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set, 'EK');
  var pattern = /([A-Za-z]+)((\,)?\s)(\(?\d{4}\)?)/g;
  var result = matchExact(pattern, findText);
  /*if(result){
        str = findText;
        array=[...str.matchAll(/([A-Za-z]+)((\,)?\s)(\(?\d{4}\)?)/g)];
        var surname = array[0][1];
        var year = array[0][4];
        year = year.replace("(","");
        year = year.replace(")","");
        var patterns = [
                        surname+" "+year,
                        surname+", "+year,
                        surname+" ("+ year+")",
                        surname+", ("+ year+")"
                      ];
        for (i = 0; i < patterns.length; i++) {  
        var listofComment = getAllComments($("#content ref-list")[0]);
        if(listofComment.length !== 0)
          autoCitation(id,patterns[i],dt);
      }
    }else{
      var listofComment = getAllComments($("#content ref-list")[0]); 
      if(listofComment.length !== 0)        
        autoCitation(id,findText,dt);
    }
    if(type === refType){
    }else{
      $("#content [rid='"+dt+"']").attr("rid",id);  
    }*/
  $('#addLink').modal('hide');
  $("[style='background-color: rgb(188, 188, 190);']").removeAttr('style');
  var msg = 'Citation link is added for - ' + findText;
  autosavefunction_vxe(msg);
}

matchExact = (r, str) => {
  var match = str.match(r);
  return match && str === match[0];
};

autoCitation = (id, res) => {
  var rootEle = 'pdf-editor';
  while (window.find(res, false, false, false, false, false, false)) {
    var affnodeas = getSelectedNode();
    if (affnodeas.tagName.toUpperCase() !== 'XREF') {
      if (affnodeas == undefined) break;
      var fun = doCommand('backColor');
      var affnode = getSelectedNode();
      console.log(affnode);
      affnode.classList.add('seacrchAllCitation');
      var affnodeClose = affnode.closest('ref,table-wrap,fig');
      var eleValidation = true;
      if (affnodeClose !== null) {
        eleValidation = false;
      }
      if (findAncestor(affnode, rootEle) && eleValidation) {
        if (
          !findAncestor(affnode, 'rh') &&
          !findAncestor(affnode, 'lh') &&
          !findAncestor(affnode, 'pageno') &&
          !findAncestor(affnode, 'pagenob') &&
          !findAncestor(affnode, 'pagenor') &&
          !findAncestor(affnode, 'xref') &&
          affnode.tagName.toUpperCase() !== 'RH' &&
          affnode.tagName.toUpperCase() !== 'LH' &&
          affnode.tagName.toUpperCase() !== 'PAGENO' &&
          affnode.tagName.toUpperCase() !== 'PAGENOB' &&
          affnode.tagName.toUpperCase() !== 'XREF'
        ) {
          affnode.classList.add('seacrchCitation');
        } else {
          affnode.classList.remove('seacrchAllCitation');
        }
      }
    }
  }
  $('#content .seacrchCitation').each(function () {
    var htmltext = "<xref ref-type='bibr' rid=" + id + '>' + res + '</xref>';
    $(this).html(htmltext);
  });
  $('#content .seacrchCitation').each(function () {
    var insEle = $(this).hasClass('ins');
    if (insEle) {
      $(this).removeAttr('style');
    } else {
      $(this).contents().unwrap();
    }
  });
  $(
    "#content bibliography [style='background-color: rgb(188, 188, 190);']"
  ).each(function () {
    var insEle = $(this).hasClass('ins');
    if (insEle) {
      $(this).removeAttr('style');
    } else {
      $(this).contents().unwrap();
    }
  });
  if (window.getSelection) {
    if (window.getSelection().empty) {
      // Chrome
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {
      // Firefox
      window.getSelection().removeAllRanges();
    }
  } else if (document.selection) {
    // IE?
    document.selection.empty();
  }
};
function close_link(dt) {
  let id = '[rid="' + dt + '"]';
  removeLink(id);
  var msg = 'new link added.';
  autosavefunction_vxe(msg);
}
function enter_newparainsert(store_id) {
  $('#lock').val('true');
  var d = new Date();
  var dt = Date.parse(d);
  var userName = $('#username').val();
  var biblo = $('#content .enter_keypressed').closest('ref');
  if (biblo.length > 0) {
    $('.enter_keypressed').remove();
    return false;
  }
  $('#content .enter_keypressed')
    .parent()
    .attr('store', dt + '_ek');
  $('#content .enter_keypressed').parent().attr('enter_key', 'success');
  $('#content .enter_keypressed').parent().attr('data-time', dt);
  $('#content .enter_keypressed').parent().attr('data-username', userName);
  var parent_tag = $('#content .enter_keypressed').parent().prop('tagName');
  if (parent_tag === 'PAGEBREAK') {
    $('#content .enter_keypressed')
      .parent()
      .parent()
      .attr('store', dt + '_ekp');
  } else if (parent_tag === 'SPAN') {
    $('#content .enter_keypressed')
      .parent()
      .parent()
      .attr('store', dt + '_ekpa');
  }
  $('#content .enter_keypressed').remove();
  var msg = 'New Para';
  $("#content [store='" + dt + "_ek']").focus();
  $('#lock').val('false');
  autosavefunction_vxe(msg);
  scrollToLastTrack(dt);
}
function onmousedowns(type) {
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set, 'EK');
  var el = $('.table_attr').text();
  var flag = true;
  var tables = [];
  var td, // collection of table cells within container
    i,
    t, // loop variables
    get_tables; // private method returns array
  // method returns array with table nodes for a DOM node
  get_tables = function (el) {
    var arr = [], // result array
      nodes, // node collection
      i; // loop variable
    // collect table nodes
    nodes = el.getElementsByTagName('table');
    // open node loop and push to array
    for (i = 0; i < nodes.length; i++) {
      arr.push(nodes[i]);
    }
    // return result array
    return arr;
  };
  // save event parameter to td_event private property
  td_event = flag;
  // if third parameter is set to "classname" then select tables by given class name (first parameter is considered as class name)
  if (typeof el === 'string') {
    if (type === 'classname') {
      // collect all tables on the page
      tables = get_tables(document);
      // open loop
      for (i = 0; i < tables.length; i++) {
        // if class name is not found then cut out table from tables collection
        if (tables[i].className.indexOf(el) === -1) {
          tables.splice(i, 1);
          i--;
        }
      }
    }
    // first parameter is string and that should be id of container or id of a table
    else {
      // set object reference (overwrite el parameter)
      var contentElement = document.getElementById('content');
      el = contentElement.querySelector('table[id="' + el + '"');
    }
  }
  // el is object
  if (el && typeof el === 'object') {
    // if container is already a table
    if (el.nodeName === 'TABLE') {
      tables[0] = el;
    }
    // else collect tables within container
    else {
      tables = get_tables(el);
    }
  }
  // at this point tables should contain one or more tables
  for (t = 0; t < tables.length; t++) {
    // collect table cells from the selected table
    td = tables[t].getElementsByTagName('td');
    // loop goes through every collected TD
    for (i = 0; i < td.length; i++) {
      // add or remove event listener
      cell_init(td[i]);
    }
  }
  var previousCount = tableSpanCount();
  merge('h', false, tables);
  merge('v', undefined, tables);
  var removeSpan = removesingleSpan();
  var afterCount = tableSpanCount();
  var mergeAction = false;
  if (previousCount === afterCount) {
    $('#insertFootnote').modal('show');
    $('#footnoteWarningtext').text("Selected cells can't be merged.");
  } else {
    var msg = 'Merge Cell.';
    autosavefunction_vxe(msg);
  }
}

removesingleSpan = () => {
  var el = $('.table_attr').text();
  var contentElement = document.getElementById('content');
  var tableElement = contentElement.querySelector('table[id="' + el + '"');
  var rowcolSpan = tableElement.querySelectorAll(
      "td[colSpan='1'][rowspan='1']"
    ),
    i;
  if (rowcolSpan.length > 0) {
    for (i = 0; i < rowcolSpan.length; ++i) {
      var element = rowcolSpan[i];
      element.removeAttribute('colspan');
      element.removeAttribute('rowspan');
    }
  }
  return true;
};
tableSpanCount = () => {
  var el = $('.table_attr').text();
  var contentElement = document.getElementById('content');
  var tableElement = contentElement.querySelector('table[id="' + el + '"');
  var rowEle = tableElement.querySelectorAll('[rowspan]'),
    i;
  var colEle = tableElement.querySelectorAll('[colspan]'),
    j;
  var totalrow = 0;
  var totalcol = 0;
  if (rowEle.length > 0) {
    for (i = 0; i < rowEle.length; ++i) {
      var element = rowEle[i];
      var count = element.getAttribute('rowspan');
      totalrow = totalrow + parseInt(count);
    }
  }
  if (colEle.length > 0) {
    for (j = 0; j < colEle.length; ++j) {
      var element = colEle[j];
      var count = element.getAttribute('rowspan');
      totalcol = totalcol + parseInt(count);
    }
  }
  return totalcol + totalrow;
};
function merge(mode, clear, tables) {
  var tbl, // table array (loaded from tables array or from table input parameter)
    tr, // row reference in table
    c, // current cell
    rc1, // row/column maximum value for first loop
    rc2, // row/column maximum value for second loop
    marked, // (boolean) marked flag of current cell
    span, // (integer) rowspan/colspan value
    id, // cell id in format "1-2", "1-4" ...
    cl, // cell list with new coordinates
    t, // table reference
    i,
    j, // loop variables
    first = {
      index: -1, // index of first cell in sequence
      span: -1,
    }; // span value (colspan / rowspan) of first cell in sequence
  // remove text selection
  remove_selection();
  // if table input parameter is undefined then use "tables" private property (table array) or set table reference from get_table method
  tbl = tables;
  // open loop for each table inside container
  for (t = 0; t < tbl.length; t++) {
    // define cell list with new coordinates
    cl = cell_list(tbl[t]);
    // define row number in current table
    tr = tbl[t].rows;
    // define maximum value for first loop (depending on mode)
    rc1 = mode === 'v' ? max_cols(tbl[t]) : tr.length;
    // define maximum value for second loop (depending on mode)
    rc2 = mode === 'v' ? tr.length : max_cols(tbl[t]);
    // first loop
    for (i = 0; i < rc1; i++) {
      // reset marked cell index and span value
      first.index = first.span = -1;
      // second loop
      for (j = 0; j <= rc2; j++) {
        // set cell id (depending on horizontal/verical merging)
        id = mode === 'v' ? j + '-' + i : i + '-' + j;
        // if cell with given coordinates (in form like "1-2") exists, then process this cell
        if (cl[id]) {
          // set current cell
          c = cl[id];
          // if custom property "table" doesn't exist then create custom property
          c.table = c.table || {};
          // set marked flag for current cell
          marked = c ? c.table.selected : false;
          // set opposite span value
          span = mode === 'v' ? c.colSpan : c.rowSpan;
        } else {
          marked = false;
        }
        // if first marked cell in sequence is found then remember index of first marked cell and span value
        if (marked === true && first.index === -1) {
          first.index = j;
          first.span = span;
        }
        // sequence of marked cells is finished (naturally or next cell has different span value)
        else if (
          (marked !== true && first.index > -1) ||
          (first.span > -1 && first.span !== span)
        ) {
          // merge cells in a sequence (cell list, row/column, sequence start, sequence end, horizontal/vertical mode)
          merge_cells(cl, i, first.index, j, mode, clear);
          // reset marked cell index and span value
          first.index = first.span = -1;
          // if cell is selected then unmark and reset marked flag
          // reseting marked flag is needed in case for last cell in column/row (so merge_cells () outside for loop will not execute)
          if (marked === true) {
            // if clear flag is set to true (or undefined) then clear marked cell after merging
            if (clear === true || clear === undefined) {
              table_markcell(false, c);
            }
            marked = false;
          }
        }
        // increase "j" counter for span value (needed for merging spanned cell and cell after when index is not in sequence)
        if (cl[id]) {
          j += mode === 'v' ? c.rowSpan - 1 : c.colSpan - 1;
        }
      }
      // if loop is finished and last cell is marked (needed in case when TD sequence include last cell in table row)
      if (marked === true) {
        merge_cells(cl, i, first.index, j, mode, clear);
      }
    }
  }
}
function remove_selection() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  }
  // IE8
  else if (document.selection && document.selection.type === 'Text') {
    try {
      document.selection.empty();
    } catch (error) {
      // ignore error to as a workaround for bug in IE8
    }
  }
}
function cell_init(c) {
  if (c.className.indexOf('ignore') > -1) {
    return;
  }
  // if td_event is set to true then onmousedown event listener will be attached to table cells
  if (td_event === true) {
    TABLE.event.add(c, 'mousedown', handler_onmousedown);
  } else {
    TABLE.event.remove(c, 'mousedown', handler_onmousedown);
  }
}
function handler_onmousedown(e) {
  var evt = e || window.event,
    td = evt.target || evt.srcElement,
    mouseButton,
    empty;
  // set empty flag for clicked TD element
  // http://forums.asp.net/t/1409248.aspx/1
  empty = /^\s*$/.test(td.innerHTML) ? true : false;
  // if "mark_nonempty" is set to false and current cell is not empty then do nothing (just return from the event handler)
  if (TABLE.table.mark_nonempty === false && empty === false) {
    return;
  }
  // define which mouse button was pressed
  if (evt.which) {
    mouseButton = evt.which;
  } else {
    mouseButton = evt.button;
  }
  // if left mouse button is pressed and target cell is empty
  if (mouseButton === 1 /*&& td.childNodes.length === 0*/) {
    // if custom property "table" doesn't exist then create custom property
    td.table = td.table || {};
    // cell is already marked
    if (td.table.selected === true) {
      // return original background color and reset selected flag
      //table_markcell(false, td);
      //alert("if");
    }
    // cell is not marked
    else {
      // table_markcell(true, td);
      //alert("else");
    }
  }
}
function max_cols(table) {
  var tr = table.rows, // define number of rows in current table
    span, // sum of colSpan values
    max = 0, // maximum number of columns
    i,
    j; // loop variable
  // if input parameter is string then overwrite it with table reference
  if (typeof table === 'string') {
    table = document.getElementById(table);
  }
  // open loop for each TR within table
  for (i = 0; i < tr.length; i++) {
    // reset span value
    span = 0;
    // sum colspan value for each table cell
    for (j = 0; j < tr[i].cells.length; j++) {
      span += tr[i].cells[j].colSpan || 1;
    }
    // set maximum value
    if (span > max) {
      max = span;
    }
  }
  // return maximum value
  return max;
}
function merge_cells(cl, idx, pos1, pos2, mode, clear) {
  var span = 0, // set initial span value to 0
    id, // cell id in format "1-2", "1-4" ...
    fc, // reference of first cell in sequence
    c, // reference of current cell
    i; // loop variable
  // set reference of first cell in sequence
  fc = mode === 'v' ? cl[pos1 + '-' + idx] : cl[idx + '-' + pos1];
  // delete table cells and sum their colspans
  var delCellHTML = '';
  for (i = pos1 + 1; i < pos2; i++) {
    // set cell id (depending on horizontal/verical merging)
    id = mode === 'v' ? i + '-' + idx : idx + '-' + i;
    // if cell with given coordinates (in form like "1-2") exists, then process this cell
    if (cl[id]) {
      // define next cell in column/row
      c = cl[id];
      // add colSpan/rowSpan value
      span += mode === 'v' ? c.rowSpan : c.colSpan;
      // relocate content before deleting cell in merging process
      relocate(c, fc);
      // delete cell
      delCellHTML = delCellHTML + c.innerHTML;
      c.parentNode.deleteCell(c.cellIndex);
    }
  }
  // if cell exists
  if (fc !== undefined) {
    if (delCellHTML != '') {
      fc.innerHTML = fc.innerHTML + ' ' + delCellHTML;
      fc.className = fc.className
        .toString()
        .replace('merge', '')
        .replace('split', '')
        .replace('  ', ' ');
      fc.className += ' merge';
    }
    // vertical merging
    if (mode === 'v') {
      fc.rowSpan += span; // set new rowspan value
    }
    // horizontal merging
    else {
      fc.colSpan += span; // set new rowspan value
    }
    // if clear flag is set to true (or undefined) then set original background color and reset selected flag
    if (clear === true || clear === undefined) {
      table_markcell(false, fc);
    }
  }
}
function relocate(from, to) {
  var cn, // number of child nodes
    i,
    j; // loop variables
  // test if "from" cell is equal to "to" cell then do nothing
  if (from === to) {
    return;
  }
  // define childnodes length before loop
  cn = from.childNodes.length;
  // loop through all child nodes in table cell
  // 'j', not 'i' because NodeList objects in the DOM are live
  for (i = 0, j = 0; i < cn; i++) {
    // relocate only element nodes
    if (from.childNodes[j].nodeType === 1) {
      to.appendChild(from.childNodes[j]);
    }
    // skip text nodes, attribute nodes ...
    else {
      j++;
    }
  }
}
tabledelete = () => {
  var tableList = document.getElementById('tablelist_del');
  tableList.innerHTML = '';
  var contentElement = document.getElementById('content');
  var tableWarb = contentElement.querySelectorAll(
      "table-wrap[position='float']"
    ),
    i;
  if (tableWarb.length > 0) {
    tableList.innerHTML = "<ol class='table-del-list' id='table-del-ol'></ol>";
    var deleteStatus = 0;
    var liElement = '';
    for (i = 0; i < tableWarb.length; ++i) {
      var element = tableWarb[i];
      var parentTagname = element.parentElement.tagName;
      var deleteClass = '';
      if (parentTagname === 'SPAN') {
        deleteClass = element.parentElement.getAttribute('class');
      }
      var storeId = element.getAttribute('store');
      var labelElement = element.querySelector('label1');
      var labelRemoveEle = labelElement.querySelectorAll(
          'query,span.del,comment,span.sr-only'
        ),
        j;
      if (labelRemoveEle.length > 0) {
        for (j = 0; j < labelRemoveEle.length; ++j) {
          labelRemoveEle[j].remove();
        }
      }
      var tableName = labelElement.innerText;
      if (deleteClass === '' || deleteClass !== 'del cts-1') {
        deleteStatus = 1;
        liElement +=
          '<li>' +
          tableName +
          '<a style="float:right;" onclick="deletetable(' +
          storeId +
          ');" ><i class="material-icons deleteIcon">close</i></a></li>';
      }
    }
    var liList = document.getElementById('table-del-ol');
    liList.innerHTML = liElement;
    if (deleteStatus === 0) {
      tableList.innerHTML = 'No tables are present in this Article';
    }
  } else {
    tableList.innerHTML = 'No tables are present in this Article';
  }
  $('#deleteTable').modal('show');
};
//figure insertion
function updatefigure(fig_id, store_id) {
  var figlabel = $('#figure_label').val();
  var figcaption = $('#figure_caption').val();
  var file_input = $('#fileinsert').prop('files')[0];
  var linkend_chk = $("[rid='" + fig_id + "']").text();
  var fileinsert_flag = $('#fileinsert').val();
  var ext = fileinsert_flag.split('.').pop().toLowerCase();
  $('#insertFigure').removeClass('hide');
  $('#insertFigureText').addClass('hide');
  var contentElement = document.getElementById('content');
  if (
    file_input != '' &&
    file_input != undefined &&
    $.inArray(ext, ['jpg', 'jpeg', 'tif', 'png', 'eps']) != -1
  ) {
    if ($('#inline-fig:checked').is(':checked') || linkend_chk != '') {
      $('#figure_submission').hide();
      var localdata_set = $('.localstorevalue').val();
      storedata(localdata_set, 'EK');
      var prefix = $('#chapterprefix').val();
      var figureEle = contentElement.querySelectorAll("fig[position='float']");
      if ($('#inline-fig:checked').is(':checked')) {
        figureEle = contentElement.querySelectorAll('inline-graphic');
        var inline_value = $('#inline-fig:checked').val();
      } else {
        var inline_value = 0;
      }
      var figureEleLen = figureEle.length;
      figureEleLen = figureEleLen + 1;
      var newLen = String(figureEleLen).padStart(3, '0');
      var newFileName = prefix + '_f' + newLen;
      if ($('#inline-fig:checked').is(':checked')) {
        newFileName = 'inline' + figureEleLen;
      }
      var userName = $('#username').val();
      var project_id = $('#projectid').val();
      var chapterid = $('#chapterid').val();
      var milestoneid = '123';
      var task_id = $('#taskid').val();
      var fileid = 'TNFUK_02_ETHL_C002_docbook_new_output.xml';
      var user_id = $('#userid').val();
      var XmlFileName = 'TNFUK_02_ETHL_C002_docbook_new';
      if ($('#fileinsert').attr('value')) {
        var file_data = $('#fileinsert').prop('files')[0];
      } else {
        var file_data = 0;
      }
      var token = window.localStorage.getItem('lanstad-token');
      var form_data_value = new FormData();
      form_data_value.append('filepath', file_data);
      form_data_value.append('project_id', project_id);
      form_data_value.append('chapterid', chapterid);
      form_data_value.append('milestone_id', milestoneid);
      form_data_value.append('taskid', task_id);
      form_data_value.append('folder_name', fileid);
      form_data_value.append('XmlFileName', XmlFileName);
      form_data_value.append('newFileName', newFileName);
      form_data_value.append('token', token);
      form_data_value.append('user_id', user_id);
      $.ajax({
        url: api_url + '/VXE/chapterimagesave',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data_value, // Setting the data attribute of ajax with file_data
        type: 'POST',
        beforeSend: function () {
          //loadajaxsucessmsg();
        },
        success: function (replacestatus) {
          if (replacestatus.status === 'success') {
            $('#figureinsert_flag').val('0');
            $('#figureinsert_id').val('');
            var project_id = $('#projectid').val();
            var figcaption_txt = $('#figure_label').val();
            if (inline_value === 0) {
              var figure_length = $("#content [store='" + store_id + "']").find(
                'figure1'
              ).length;
              if (figure_length > 0) {
                var figure_store = $(
                  "#content [store='" + store_id + "']"
                ).find('figure1')[0];
                var fig_store = $(figure_store).attr('store');
                $("#content [store='" + fig_store + "']").before(
                  '<fig fig-type="figure" id="' +
                    fig_id +
                    '" store="' +
                    fig_id +
                    '_store" class="ins cts-1" data-username="' +
                    userName +
                    '"  data-time="' +
                    fig_id +
                    '_fig" position="float" linkend_fig="' +
                    figcaption_txt +
                    '">><img src="' +
                    imgFilePath +
                    '/webdav-server/xmlfiles/docbook/' +
                    project_id +
                    '/' +
                    chapterid +
                    '/finaloutput/images/' +
                    replacestatus.file_name +
                    '" format="image/jpeg" class="new_figureinsert"/><label1 class="ins cts-1" data-username="' +
                    userName +
                    '"  data-time="' +
                    fig_id +
                    '_lab" store="' +
                    fig_id +
                    '_lbl">' +
                    figlabel +
                    '</label1><caption1 store="' +
                    fig_id +
                    '_c" class="ins cts-1" data-username="' +
                    userName +
                    '"  data-time="' +
                    fig_id +
                    '_cap"><para store="' +
                    fig_id +
                    '_p" contenteditable="true">' +
                    figcaption +
                    '</para></caption1></fig>'
                );
              } else {
                $("#content [store='" + store_id + "']").after(
                  '<fig fig-type="figure" id="' +
                    fig_id +
                    '" class="ins cts-1" store="' +
                    fig_id +
                    '_store" position="float" linkend_fig="' +
                    figcaption_txt +
                    '" data-time="' +
                    fig_id +
                    '_fig" data-username="' +
                    userName +
                    '" ><label1 class="ins cts-1" data-username="' +
                    userName +
                    '"  data-time="' +
                    fig_id +
                    '_lab" store="' +
                    fig_id +
                    '_lbl">' +
                    figlabel +
                    '</label1> <caption1 class="ins cts-1"><p1>' +
                    figcaption +
                    '</p1></caption1><img src="' +
                    imgFilePath +
                    '/webdav-server/xmlfiles/docbook/' +
                    project_id +
                    '/' +
                    chapterid +
                    '/finaloutput/images/' +
                    replacestatus.file_name +
                    '" class="new_figureinsert" format="image/jpeg"></fig>'
                );
              }
            } else {
              $("#content [store='" + store_id + "']").after(
                '<inline-graphic class="ins cts-1"><img src="' +
                  imgFilePath +
                  '/webdav-server/xmlfiles/docbook/' +
                  project_id +
                  '/' +
                  chapterid +
                  '/finaloutput/images/' +
                  replacestatus.file_name +
                  '" format="image/jpeg" class="new_figureinsert"/></inline-graphic>'
              );
            }
            $('#figureModal').modal('hide');
            var user_id = '183';
            var project_id = '5193';
            var inline_checked = $('#inline-fig').prop('checked');
            var msg = 'New inline figure inserted.';
            if (inline_checked === false) {
              msg = figcaption_txt + ' has been inserted.';
              var rearrResult = figure_rearrange(fig_id, 'Add');
              msg = msg + rearrResult;
            }
            autosavefunction_vxe(msg);
            scrollToLastTrack(fig_id + '_fig');
          }
        },
      });
    } else {
      $("#content [store='" + store_id + "']").remove();
      $('#insertFigure').addClass('hide');
      $('#insertFigureText').removeClass('hide');
      $('#insertFigureText').html(
        '<center><h2>Warning!</h2><span>Please select the Figure citation! \n Ex: Figure 1.1,Figure 2.1 etc... \n \n</span></center>'
      );
    }
  } else {
    $('#inline_fig_error').html('');
    $('#inline_fig_error').html('Please upload .jpg, .jpeg, .png, .tif, .eps');
    $('#inline_fig_error').removeClass('hide');
  }
}

function figure_rearrange(fig_id, action) {
  var match_attr = 0;
  var result = '';
  var k = 0;
  $("#content fig[position='float']").each(function () {
    var d = new Date();
    var dt = Date.parse(d);
    var userName = $('#username').val();
    var xmlid = $(this).attr('id');
    var label_ref = $(this).attr('linkend_fig');
    var deleteClass = '';
    if ($(this)[0].parentElement) {
      if ($(this)[0].parentElement.tagName === 'SPAN') {
        deleteClass = $(this)[0].parentElement.getAttribute('class');
      }
    }
    if (deleteClass === '' || deleteClass !== 'del cts-1') {
      k++;
      if (xmlid == fig_id || match_attr === 1) {
        if (match_attr === 1) {
          var delSpanTagMain = $(this)
            .find('label1')[0]
            .querySelector('span.del');
          if (delSpanTagMain !== null) {
            delSpanTagMain.remove();
          }
          var prev_labelVal = $(this).find('label1').text();
          var prev_label = $.trim(prev_labelVal);
          prev_label = prev_label.replace(/\.+$/, '');
          if (action === 'Add') {
            var new_fig = k;
          } else {
            var new_fig = k - 1;
            if (new_fig === 0) {
              new_fig = 1;
            }
          }
          var labelText = '';
          var findValue = '';
          var replaceValue = new_fig;
          if (prev_label.indexOf('.') !== -1) {
            var data_fst = prev_label.split('.');
            labelText = data_fst[0] + '.' + new_fig;
            findValue = data_fst[1];
          } else if (/\S/.test(prev_label)) {
            var data_fst = prev_label
              .split(/(\s+)/)
              .filter((e) => e.trim().length > 0);
            labelText = data_fst[0] + ' ' + new_fig;
            findValue = data_fst[1];
          } else {
            var data_fst = prev_label.split(' ');
            labelText = data_fst[0] + ' ' + new_fig;
            findValue = data_fst[1];
          }
          $(this)
            .find('label1')
            .html(
              '<span class="del cts-1" contenteditable="false" data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_d' +
                findValue +
                '">' +
                prev_labelVal +
                '</span><span class="ins cts-1" data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_i' +
                new_fig +
                '">' +
                labelText +
                '</span>'
            );
          result =
            result + ' and ' + prev_labelVal + ' has changed to ' + labelText;
          $(this).attr('linkend_fig', labelText);
          var contentElement = document.getElementById('content');
          var figureXref = contentElement.querySelectorAll(
              "xref[rid='" + xmlid + "']"
            ),
            j;
          if (figureXref.length > 0) {
            for (j = 0; j < figureXref.length; ++j) {
              var xrefElement = figureXref[j];
              var delEleSpan = xrefElement.querySelector('span.del');
              if (delEleSpan !== null) {
                delEleSpan.remove();
              }
              var prev_labelValXref = xrefElement.innerText;
              var intRegex = /\d+/;
              var regExp = new RegExp(findValue, 'g');
              var regArray = prev_labelValXref.match(regExp);
              replacePoint = 1;
              var reText = '';
              if (regArray !== null) {
                replacePoint = regArray.length;
                reText = replaceXREF(
                  prev_labelValXref,
                  replacePoint,
                  regExp,
                  replaceValue
                );
              }
              if (
                prev_labelValXref != reText &&
                intRegex.test(prev_labelValXref)
              ) {
                xrefElement.innerHTML =
                  '<span class="del cts-1" contenteditable="false" data-username="' +
                  userName +
                  '" data-time="' +
                  dt +
                  '_dlnk' +
                  findValue +
                  '">' +
                  prev_labelValXref +
                  '</span><span class="ins cts-1" data-username="' +
                  userName +
                  '" data-time="' +
                  dt +
                  '_ilnk' +
                  new_fig +
                  '">' +
                  reText +
                  '</span>';
              }
            }
          }
        }
        match_attr = 1;
      }
    } else {
      if (xmlid == fig_id) {
        k++;
        match_attr = 1;
      }
    }
  });
  return result;
}

replaceAll = (string, search, replace) => {
  return string.split(search).join(replace);
};

$('#match_case', '#match_whole', '#wildcard_search').on('click', function () {
  findPanelSearch('pdf-editor');
});

function gotoFound(id, cls) {
  $('.review-item_sel').attr('class', 'review-item');
  if (!!cls) {
    cls.setAttribute('class', 'review-item_sel');
  }
  var element = document.getElementById(id);
  setCaretPos(element, element, 0, 0);
  scrollToViewContent(id);
}

function findPreText(id) {
  var tag_name = $('#' + id).prop('tagName');
  if (tag_name === 'B') {
    var html = $('#content').html();
    var changeSpanTag = new RegExp(
      '<b ([^>]+ id="' + id + ')[^>]+>(.*?)</b>',
      'g'
    );
    html = html.replace(changeSpanTag, '[/b]');
    var cleanTag = new RegExp('<[^>]+>', 'g');
    html = html.replace(cleanTag, '');
    re1 = '(.{0,20})\\[\\/b\\]';
    var re = new RegExp('' + re1 + '', 'g');
    var result = re.exec(html);
    if (result != null && result.length > 0) return result[1];
    else return '';
  } else if (tag_name === 'I') {
    var html = $('#content').html();
    var changeSpanTag = new RegExp(
      '<i ([^>]+ id="' + id + ')[^>]+>(.*?)</i>',
      'g'
    );
    html = html.replace(changeSpanTag, '[/i]');
    var cleanTag = new RegExp('<[^>]+>', 'g');
    html = html.replace(cleanTag, '');
    re1 = '(.{0,20})\\[\\/i\\]';
    var re = new RegExp('' + re1 + '', 'g');
    var result = re.exec(html);
    if (result != null && result.length > 0) return result[1];
    else return '';
  } else if (tag_name === 'U') {
    var html = $('#content').html();
    var changeSpanTag = new RegExp(
      '<u ([^>]+ id="' + id + ')[^>]+>(.*?)</u>',
      'g'
    );
    html = html.replace(changeSpanTag, '[/u]');
    var cleanTag = new RegExp('<[^>]+>', 'g');
    html = html.replace(cleanTag, '');
    re1 = '(.{0,20})\\[\\/u\\]';
    var re = new RegExp('' + re1 + '', 'g');
    var result = re.exec(html);
    if (result != null && result.length > 0) return result[1];
    else return '';
  } else if (tag_name === 'SUP') {
    var html = $('#content').html();
    var changeSpanTag = new RegExp(
      '<sup ([^>]+ id="' + id + ')[^>]+>(.*?)</sup>',
      'g'
    );
    html = html.replace(changeSpanTag, '[/sup]');
    var cleanTag = new RegExp('<[^>]+>', 'g');
    html = html.replace(cleanTag, '');
    re1 = '(.{0,20})\\[\\/sup\\]';
    var re = new RegExp('' + re1 + '', 'g');
    var result = re.exec(html);
    if (result != null && result.length > 0) return result[1];
    else return '';
  } else if (tag_name === 'SUB') {
    var html = $('#content').html();
    var changeSpanTag = new RegExp(
      '<SUB ([^>]+ id="' + id + ')[^>]+>(.*?)</SUB>',
      'g'
    );
    html = html.replace(changeSpanTag, '[/SUB]');
    var cleanTag = new RegExp('<[^>]+>', 'g');
    html = html.replace(cleanTag, '');
    re1 = '(.{0,20})\\[\\/SUB\\]';
    var re = new RegExp('' + re1 + '', 'g');
    var result = re.exec(html);
    if (result != null && result.length > 0) return result[1];
    else return '';
  } else {
    var html = $('#content').html();
    var changeSpanTag = new RegExp(
      '<span ([^>]+ id="' + id + ')[^>]+>(.*?)</span>',
      'g'
    );
    html = html.replace(changeSpanTag, '[/span]');
    var cleanTag = new RegExp('<[^>]+>', 'g');
    html = html.replace(cleanTag, '');
    re1 = '(.{0,25})\\[\\/span\\]';
    var re = new RegExp('' + re1 + '', 'g');
    var result = re.exec(html);
    if (result != null && result.length > 0) return result[1];
    else return '';
  }
}

function findNextText(id) {
  var tag_name = $('#' + id).prop('tagName');
  //console.log("NextText:-"+tag_name);

  if (tag_name === 'B') {
    var html = $('#content').html();
    var changeSpanTag = new RegExp(
      '<b ([^>]+ id="' + id + ')[^>]+>(.*?)</b>',
      'g'
    );
    html = html.replace(changeSpanTag, '[/b]');
    var cleanTag = new RegExp('<[^>]+>', 'g');
    html = html.replace(cleanTag, '');
    re1 = '\\[\\/b\\](.{0,20})';
    var re = new RegExp('' + re1 + '', 'g');
    var result = re.exec(html);
    if (result != null && result.length > 0) return result[1];
    else return '';
  } else if (tag_name === 'I') {
    var html = $('#content').html();
    var changeSpanTag = new RegExp(
      '<i ([^>]+ id="' + id + ')[^>]+>(.*?)</i>',
      'g'
    );
    html = html.replace(changeSpanTag, '[/i]');
    var cleanTag = new RegExp('<[^>]+>', 'g');
    html = html.replace(cleanTag, '');
    re1 = '\\[\\/i\\](.{0,20})';
    var re = new RegExp('' + re1 + '', 'g');
    var result = re.exec(html);
    if (result != null && result.length > 0) return result[1];
    else return '';
  } else if (tag_name === 'U') {
    var html = $('#content').html();
    var changeSpanTag = new RegExp(
      '<u ([^>]+ id="' + id + ')[^>]+>(.*?)</u>',
      'g'
    );
    html = html.replace(changeSpanTag, '[/u]');
    var cleanTag = new RegExp('<[^>]+>', 'g');
    html = html.replace(cleanTag, '');
    re1 = '\\[\\/u\\](.{0,20})';
    var re = new RegExp('' + re1 + '', 'g');
    var result = re.exec(html);
    if (result != null && result.length > 0) return result[1];
    else return '';
  } else if (tag_name === 'SUP') {
    var html = $('#content').html();
    var changeSpanTag = new RegExp(
      '<sup ([^>]+ id="' + id + ')[^>]+>(.*?)</sup>',
      'g'
    );
    html = html.replace(changeSpanTag, '[/sup]');
    var cleanTag = new RegExp('<[^>]+>', 'g');
    html = html.replace(cleanTag, '');
    re1 = '\\[\\/sup\\](.{0,20})';
    var re = new RegExp('' + re1 + '', 'g');
    var result = re.exec(html);
    if (result != null && result.length > 0) return result[1];
    else return '';
  } else if (tag_name === 'SUB') {
    var html = $('#content').html();
    var changeSpanTag = new RegExp(
      '<sub ([^>]+ id="' + id + ')[^>]+>(.*?)</sub>',
      'g'
    );
    html = html.replace(changeSpanTag, '[/sub]');
    var cleanTag = new RegExp('<[^>]+>', 'g');
    html = html.replace(cleanTag, '');
    re1 = '\\[\\/sub\\](.{0,20})';
    var re = new RegExp('' + re1 + '', 'g');
    var result = re.exec(html);
    if (result != null && result.length > 0) return result[1];
    else return '';
  } else {
    var html = $('#content').html();
    var changeSpanTag = new RegExp(
      '<span ([^>]+ id="' + id + ')[^>]+>(.*?)</span>',
      'g'
    );
    html = html.replace(changeSpanTag, '[/span]');
    var cleanTag = new RegExp('<[^>]+>', 'g');
    html = html.replace(cleanTag, '');
    re1 = '\\[\\/span\\](.{0,25})';
    var re = new RegExp('' + re1 + '', 'g');
    var result = re.exec(html);
    if (result != null && result.length > 0) return result[1];
    else return '';
  }
}

function findPanelSearch(rootEle, dum, allowSearch) {
  $('#lock').val('true');
  $('#find').focus();
  $('#loading-wrapper2').show();
  $('#content').focus();

  var MCchecked = $('#match_case:checked').val();
  var MWchecked = $('#match_whole:checked').val();
  var Wildcard = $('#wildcard_search:checked').val();

  var bold_character = $('#bold_character').val();
  var italic_character = $('#italic_character').val();
  var underline_character = $('#underline_character').val();

  var subscript_character = $('#subscript_character').val();
  var superscript_character = $('#superscript_character').val();

  $('.search-result').html('');

  $('#content .del').removeAttr('id');
  $('#content .del').removeAttr('style');
  $('#content .ins').removeAttr('id');
  $('#content .ins').removeAttr('style');
  $("#content [style='background-color: rgb(188, 188, 190);']").removeAttr(
    'style'
  );
  $(
    "#content .found[style='background-color: rgb(188, 188, 190);']"
  ).removeAttr('style');
  $('#content .found').removeAttr('id');
  $('#content span.found').contents().unwrap();
  $('#content *').removeClass('found');

  var aCaseSensitive, aWholeWord;
  if (MCchecked == 1) aCaseSensitive = true;
  else aCaseSensitive = false;
  if (MWchecked == 2) aWholeWord = true;
  else aWholeWord = false;

  /* regex search */
  var i = 0;
  var pro = '';
  var container = document.getElementById('content');
  // selection object
  var sel = window.getSelection();
  sel.collapse(container, 0);
  if (Wildcard == 3) {
    if (MCchecked == 1) pro = pro;
    else pro = pro + 'i';
    pro = pro + 'g';
    var re = new RegExp($('#find').val(), pro);
    browser_details('Wildcard :' + re);
    var data = $('#content').text();
    var founds = data.match(re);
    const found = [...new Set(founds)];
    found.sort(function (a, b) {
      return b - a;
    });
    found.forEach(function (element) {
      var res = $('#find').val();
      if (element != '' && res != '') {
        while (window.find(element, true, false, false, false, false, false)) {
          var affnodeas = getSelectedNode();
          if (affnodeas == undefined) break;
          var prev_found = affnodeas.classList;
          var get_attributeDel = affnodeas.getAttribute('class');
          if (get_attributeDel == 'del cts-1') continue;
          var style_element = affnodeas.tagName;
          var style_elementparent = affnodeas.parentElement.tagName;

          if (
            style_element != 'REF' &&
            style_element != 'ARTICLE-META' &&
            style_element != 'MIXED-CITATION' &&
            style_element != 'DELIMITER' &&
            style_element != 'SURNAME' &&
            style_element != 'GIVEN-NAMES' &&
            style_element != 'EDITORS' &&
            style_element != 'SUFFIX' &&
            style_element != 'PERSON-GROUP' &&
            style_element != 'NAME' &&
            style_element != 'EDITOR' &&
            style_element != 'CHAPTER-TITLE' &&
            style_element != 'SOURCE' &&
            style_element != 'YEAR' &&
            style_element != 'ARTICLE-TITLE' &&
            style_element != 'URI' &&
            style_element != 'PUBLISHER-LOC' &&
            style_element != 'PUB-ID' &&
            style_element != 'PUBLISHER-NAME' &&
            style_element != 'CITY' &&
            style_element != 'STATE' &&
            style_element != 'COUNTRY' &&
            style_element != 'VOLUME' &&
            style_element != 'ISSUE' &&
            style_element != 'PAGENUMS' &&
            style_element != 'FPAGE' &&
            style_element != 'EDITION' &&
            style_element != 'SEASON' &&
            style_element != 'DATE' &&
            style_element != 'YEAR' &&
            style_element != 'MONTH' &&
            style_element != 'PDFONLY1' &&
            style_element != 'PDFONLY2' &&
            style_element != 'PDFONLY3' &&
            style_element != 'PDFONLY4' &&
            style_element != 'XREF' &&
            style_element != 'SUBJECT' &&
            style_element != 'AFF' &&
            style_element != 'CONTRIB' &&
            style_element != 'INSTITUTION' &&
            style_element != 'VOLUME1' &&
            style_element != 'CORRESP' &&
            style_element != 'LABEL1' &&
            style_element != 'TITLE1' &&
            style_element != 'EMAIL' &&
            style_element != 'KWD1' &&
            style_element != 'DOI' &&
            style_element != 'COPYRIGHT' &&
            style_element != 'SUBJECTEDITOR' &&
            style_elementparent != 'XREF' &&
            style_elementparent != 'MIXED-CITATION' &&
            style_elementparent != 'LABEL1' &&
            style_elementparent != 'SOURCE1' &&
            style_elementparent != 'ARTICLE-TITLE' &&
            style_elementparent != 'AFF'
          ) {
            var font_style = $(style_element).css('font-style');
            var font_weight = $(style_element).css('font-weight');
            if (
              (style_element == 'I' || font_style == 'italic') &&
              (italic_character == 'italictrue' ||
                italic_character == 'italicnull')
            ) {
              if (italic_character == 'italictrue') {
                if (prev_found != 'found') {
                  doCommand('backColor');
                  var affnode = getSelectedNode();
                  if (findAncestor(affnode, rootEle)) {
                    if (
                      !findAncestor(affnode, 'rh') &&
                      !findAncestor(affnode, 'lh') &&
                      !findAncestor(affnode, 'pageno') &&
                      !findAncestor(affnode, 'pagenob') &&
                      !findAncestor(affnode, 'pagenor') &&
                      affnode.tagName.toUpperCase() != 'RH' &&
                      affnode.tagName.toUpperCase() != 'LH' &&
                      affnode.tagName.toUpperCase() != 'PAGENO' &&
                      affnode.tagName.toUpperCase() != 'PAGENOB' &&
                      affnode.tagName.toUpperCase() != 'PAGENOR' &&
                      affnode.tagName.toUpperCase() != 'PP1'
                    ) {
                      affnode.setAttribute('id', 'found' + i);
                      affnode.classList.add('found');
                      var char_found = affnode.classList;
                    }
                  }
                  i = i + 1;
                }
              }
            } else if (
              font_weight == '700' &&
              (bold_character == 'boldtrue' || bold_character == 'boldnull')
            ) {
              if (bold_character == 'boldtrue') {
                if (prev_found != 'found') {
                  doCommand('backColor');

                  var affnode = getSelectedNode();
                  //alert(affnode);

                  if (findAncestor(affnode, rootEle)) {
                    if (
                      !findAncestor(affnode, 'rh') &&
                      !findAncestor(affnode, 'lh') &&
                      !findAncestor(affnode, 'pageno') &&
                      !findAncestor(affnode, 'pagenob') &&
                      !findAncestor(affnode, 'pagenor') &&
                      affnode.tagName.toUpperCase() != 'RH' &&
                      affnode.tagName.toUpperCase() != 'LH' &&
                      affnode.tagName.toUpperCase() != 'PAGENO' &&
                      affnode.tagName.toUpperCase() != 'PAGENOB' &&
                      affnode.tagName.toUpperCase() != 'PAGENOR' &&
                      affnode.tagName.toUpperCase() != 'PP1'
                    ) {
                      affnode.setAttribute('id', 'found' + i);
                      affnode.classList.add('found');

                      var char_found = affnode.classList;
                      //console.log("next_found:-"+char_found);
                    }
                  }
                  i = i + 1;
                }
              }
            } else if (
              (underline_character == 'underlinetrue' ||
                underline_character == 'underlinenull') &&
              style_element == 'U'
            ) {
              if (underline_character == 'underlinetrue') {
                if (prev_found != 'found') {
                  doCommand('backColor');

                  var affnode = getSelectedNode();
                  //alert(affnode);

                  if (findAncestor(affnode, rootEle)) {
                    if (
                      !findAncestor(affnode, 'rh') &&
                      !findAncestor(affnode, 'lh') &&
                      !findAncestor(affnode, 'pageno') &&
                      !findAncestor(affnode, 'pagenob') &&
                      !findAncestor(affnode, 'pagenor') &&
                      affnode.tagName.toUpperCase() != 'RH' &&
                      affnode.tagName.toUpperCase() != 'LH' &&
                      affnode.tagName.toUpperCase() != 'PAGENO' &&
                      affnode.tagName.toUpperCase() != 'PAGENOB' &&
                      affnode.tagName.toUpperCase() != 'PAGENOR' &&
                      affnode.tagName.toUpperCase() != 'PP1'
                    ) {
                      affnode.setAttribute('id', 'found' + i);
                      affnode.classList.add('found');

                      var char_found = affnode.classList;
                      //console.log("next_found:-"+char_found);
                    }
                  }
                  i = i + 1;
                }
              }
            } else if (
              (superscript_character == 'superscripttrue' ||
                superscript_character == 'superscriptnull') &&
              (style_element == 'SUP' || style_element == 'SUPERSCRIPT')
            ) {
              //console.log("superscript_character:"+superscript_character);
              if (superscript_character == 'superscripttrue') {
                if (prev_found != 'found') {
                  doCommand('backColor');

                  var affnode = getSelectedNode();

                  if (findAncestor(affnode, rootEle)) {
                    if (
                      !findAncestor(affnode, 'rh') &&
                      !findAncestor(affnode, 'lh') &&
                      !findAncestor(affnode, 'superscript') &&
                      !findAncestor(affnode, 'pageno') &&
                      !findAncestor(affnode, 'pagenob') &&
                      !findAncestor(affnode, 'pagenor') &&
                      affnode.tagName.toUpperCase() != 'RH' &&
                      affnode.tagName.toUpperCase() != 'LH' &&
                      affnode.tagName.toUpperCase() != 'PAGENO' &&
                      affnode.tagName.toUpperCase() != 'PAGENOB' &&
                      affnode.tagName.toUpperCase() != 'SUPERSCRIPT' &&
                      affnode.tagName.toUpperCase() != 'PAGENOR' &&
                      affnode.tagName.toUpperCase() != 'PP1'
                    ) {
                      affnode.setAttribute('id', 'found' + i);
                      affnode.classList.add('found');

                      var char_found = affnode.classList;
                      //console.log("next_found:-"+char_found);
                    }
                  }
                  i = i + 1;
                }
              }
            } else if (
              (subscript_character == 'subscripttrue' ||
                subscript_character == 'subscriptnull') &&
              (style_element == 'SUB' || style_element == 'SUBSCRIPT')
            ) {
              if (subscript_character == 'subscripttrue') {
                if (prev_found != 'found') {
                  doCommand('backColor');

                  var affnode = getSelectedNode();
                  //alert(affnode);

                  if (findAncestor(affnode, rootEle)) {
                    if (
                      !findAncestor(affnode, 'rh') &&
                      !findAncestor(affnode, 'lh') &&
                      !findAncestor(affnode, 'pageno') &&
                      !findAncestor(affnode, 'pagenob') &&
                      !findAncestor(affnode, 'pagenor') &&
                      affnode.tagName.toUpperCase() != 'RH' &&
                      affnode.tagName.toUpperCase() != 'LH' &&
                      affnode.tagName.toUpperCase() != 'PAGENO' &&
                      affnode.tagName.toUpperCase() != 'PAGENOB' &&
                      affnode.tagName.toUpperCase() != 'PAGENOR' &&
                      affnode.tagName.toUpperCase() != 'PP1'
                    ) {
                      affnode.setAttribute('id', 'found' + i);
                      affnode.classList.add('found');

                      var char_found = affnode.classList;
                      //console.log("next_found:-"+char_found);
                    }
                  }
                  i = i + 1;
                }
              }
            } else if (
              italic_character != 'italictrue' &&
              bold_character != 'boldtrue' &&
              underline_character != 'underlinetrue' &&
              superscript_character != 'superscripttrue' &&
              subscript_character != 'subscripttrue'
            ) {
              if (prev_found != 'found') {
                doCommand('backColor');

                var affnode = getSelectedNode();
                //alert(affnode);
                if (findAncestor(affnode, rootEle)) {
                  if (
                    !findAncestor(affnode, 'rh') &&
                    !findAncestor(affnode, 'lh') &&
                    !findAncestor(affnode, 'pageno') &&
                    !findAncestor(affnode, 'pagenob') &&
                    !findAncestor(affnode, 'pagenor') &&
                    affnode.tagName.toUpperCase() != 'RH' &&
                    affnode.tagName.toUpperCase() != 'LH' &&
                    affnode.tagName.toUpperCase() != 'PAGENO' &&
                    affnode.tagName.toUpperCase() != 'PAGENOB' &&
                    affnode.tagName.toUpperCase() != 'PAGENOR' &&
                    affnode.tagName.toUpperCase() != 'PP1'
                  ) {
                    affnode.setAttribute('id', 'found' + i);
                    affnode.classList.add('found');

                    var char_found = affnode.classList;
                    //console.log("next_found:-"+char_found);
                  }
                }
                i = i + 1;
              }
            }
          }
          //executive your code here [A-Z][a-z]* \([A-Z]*\)
        }
        $('#find').focus();
      }
    });
  } else {
    var res = $('#find').val();
    while (
      window.find(res, aCaseSensitive, false, false, aWholeWord, false, false)
    ) {
      var affnodeas = getSelectedNode();
      if (affnodeas == undefined) break;
      var style_element = affnodeas.tagName;
      var font_style = $(style_element).css('font-style');
      var font_weight = $(style_element).css('font-weight');
      if (
        (style_element == 'I' || font_style == 'italic') &&
        (italic_character == 'italictrue' || italic_character == 'italicnull')
      ) {
        if (italic_character == 'italictrue') {
          doCommand('backColor');
          var affnode = getSelectedNode();
          if (findAncestor(affnode, rootEle)) {
            if (
              !findAncestor(affnode, 'rh') &&
              !findAncestor(affnode, 'lh') &&
              !findAncestor(affnode, 'pageno') &&
              !findAncestor(affnode, 'pagenob') &&
              !findAncestor(affnode, 'pagenor') &&
              affnode.tagName.toUpperCase() != 'RH' &&
              affnode.tagName.toUpperCase() != 'LH' &&
              affnode.tagName.toUpperCase() != 'PAGENO' &&
              affnode.tagName.toUpperCase() != 'PAGENOB' &&
              affnode.tagName.toUpperCase() != 'PAGENOR'
            ) {
              affnode.setAttribute('id', 'found' + i);
              affnode.classList.add('found');
              //.className += " found";
              //affnode.setAttribute("class", "found");
            }
          }
          i = i + 1;
        }
      } else if (
        font_weight == '700' &&
        (bold_character == 'boldtrue' || bold_character == 'boldnull')
      ) {
        if (bold_character == 'boldtrue') {
          doCommand('backColor');
          var affnode = getSelectedNode();
          if (findAncestor(affnode, rootEle)) {
            if (
              !findAncestor(affnode, 'rh') &&
              !findAncestor(affnode, 'lh') &&
              !findAncestor(affnode, 'pageno') &&
              !findAncestor(affnode, 'pagenob') &&
              !findAncestor(affnode, 'pagenor') &&
              affnode.tagName.toUpperCase() != 'RH' &&
              affnode.tagName.toUpperCase() != 'LH' &&
              affnode.tagName.toUpperCase() != 'PAGENO' &&
              affnode.tagName.toUpperCase() != 'PAGENOB' &&
              affnode.tagName.toUpperCase() != 'PAGENOR'
            ) {
              affnode.setAttribute('id', 'found' + i);
              affnode.classList.add('found');
            }
          }
          i = i + 1;
        }
      } else if (
        (underline_character == 'underlinetrue' ||
          underline_character == 'underlinenull') &&
        style_element == 'U'
      ) {
        if (underline_character == 'underlinetrue') {
          doCommand('backColor');
          var affnode = getSelectedNode();
          if (findAncestor(affnode, rootEle)) {
            if (
              !findAncestor(affnode, 'rh') &&
              !findAncestor(affnode, 'lh') &&
              !findAncestor(affnode, 'pageno') &&
              !findAncestor(affnode, 'pagenob') &&
              !findAncestor(affnode, 'pagenor') &&
              affnode.tagName.toUpperCase() != 'RH' &&
              affnode.tagName.toUpperCase() != 'LH' &&
              affnode.tagName.toUpperCase() != 'PAGENO' &&
              affnode.tagName.toUpperCase() != 'PAGENOB' &&
              affnode.tagName.toUpperCase() != 'PAGENOR'
            ) {
              affnode.setAttribute('id', 'found' + i);
              affnode.classList.add('found');
            }
          }
          i = i + 1;
        }
      } else if (
        (superscript_character == 'superscripttrue' ||
          superscript_character == 'superscriptnull') &&
        (style_element == 'SUP' || style_element == 'SUPERSCRIPT')
      ) {
        if (superscript_character == 'superscripttrue') {
          doCommand('backColor');
          var affnode = getSelectedNode();
          if (findAncestor(affnode, rootEle)) {
            if (
              !findAncestor(affnode, 'rh') &&
              !findAncestor(affnode, 'lh') &&
              !findAncestor(affnode, 'pageno') &&
              !findAncestor(affnode, 'pagenob') &&
              !findAncestor(affnode, 'pagenor') &&
              affnode.tagName.toUpperCase() != 'RH' &&
              affnode.tagName.toUpperCase() != 'LH' &&
              affnode.tagName.toUpperCase() != 'PAGENO' &&
              affnode.tagName.toUpperCase() != 'PAGENOB' &&
              affnode.tagName.toUpperCase() != 'PAGENOR'
            ) {
              affnode.setAttribute('id', 'found' + i);
              affnode.classList.add('found');
            }
          }
          i = i + 1;
        }
      } else if (
        (subscript_character == 'subscripttrue' ||
          subscript_character == 'subscriptnull') &&
        (style_element == 'SUB' || style_element == 'SUBSCRIPT')
      ) {
        if (subscript_character == 'subscripttrue') {
          doCommand('backColor');
          var affnode = getSelectedNode();
          if (findAncestor(affnode, rootEle)) {
            if (
              !findAncestor(affnode, 'rh') &&
              !findAncestor(affnode, 'lh') &&
              !findAncestor(affnode, 'pageno') &&
              !findAncestor(affnode, 'pagenob') &&
              !findAncestor(affnode, 'pagenor') &&
              affnode.tagName.toUpperCase() != 'RH' &&
              affnode.tagName.toUpperCase() != 'LH' &&
              affnode.tagName.toUpperCase() != 'PAGENO' &&
              affnode.tagName.toUpperCase() != 'PAGENOB' &&
              affnode.tagName.toUpperCase() != 'PAGENOR'
            ) {
              affnode.setAttribute('id', 'found' + i);
              affnode.classList.add('found');
            }
          }
          i = i + 1;
        }
      } else if (
        italic_character != 'italictrue' &&
        bold_character != 'boldtrue' &&
        underline_character != 'underlinetrue' &&
        superscript_character != 'superscripttrue' &&
        subscript_character != 'subscripttrue' &&
        style_element != 'REF' &&
        style_element != 'ARTICLE-META' &&
        style_element != 'MIXED-CITATION' &&
        style_element != 'DELIMITER' &&
        style_element != 'SURNAME' &&
        style_element != 'GIVEN-NAMES' &&
        style_element != 'EDITORS' &&
        style_element != 'SUFFIX' &&
        style_element != 'PERSON-GROUP' &&
        style_element != 'NAME' &&
        style_element != 'EDITOR' &&
        style_element != 'CHAPTER-TITLE' &&
        style_element != 'SOURCE' &&
        style_element != 'YEAR' &&
        style_element != 'ARTICLE-TITLE' &&
        style_element != 'URI' &&
        style_element != 'PUBLISHER-LOC' &&
        style_element != 'PUB-ID' &&
        style_element != 'PUBLISHER-NAME' &&
        style_element != 'CITY' &&
        style_element != 'STATE' &&
        style_element != 'COUNTRY' &&
        style_element != 'VOLUME' &&
        style_element != 'ISSUE' &&
        style_element != 'PAGENUMS' &&
        style_element != 'FPAGE' &&
        style_element != 'EDITION' &&
        style_element != 'SEASON' &&
        style_element != 'DATE' &&
        style_element != 'YEAR' &&
        style_element != 'MONTH' &&
        style_element != 'PDFONLY1' &&
        style_element != 'PDFONLY2' &&
        style_element != 'PDFONLY3' &&
        style_element != 'PDFONLY4' &&
        style_element != 'XREF' &&
        style_element != 'SUBJECT' &&
        style_element != 'AFF' &&
        style_element != 'CONTRIB' &&
        style_element != 'INSTITUTION' &&
        style_element != 'VOLUME1' &&
        style_element != 'CORRESP' &&
        style_element != 'LABEL1' &&
        style_element != 'TITLE1' &&
        style_element != 'EMAIL' &&
        style_element != 'KWD1' &&
        style_element != 'DOI' &&
        style_element != 'COPYRIGHT' &&
        style_element != 'SUBJECTEDITOR'
      ) {
        var restrictRef = true;
      }
      if (restrictRef || allowSearch) {
        doCommand('backColor');
        var affnode = getSelectedNode();
        if (findAncestor(affnode, rootEle)) {
          if (
            !findAncestor(affnode, 'rh') &&
            !findAncestor(affnode, 'lh') &&
            !findAncestor(affnode, 'pageno') &&
            !findAncestor(affnode, 'pagenob') &&
            !findAncestor(affnode, 'pagenor') &&
            affnode.tagName.toUpperCase() != 'RH' &&
            affnode.tagName.toUpperCase() != 'LH' &&
            affnode.tagName.toUpperCase() != 'PAGENO' &&
            affnode.tagName.toUpperCase() != 'PAGENOB' &&
            affnode.tagName.toUpperCase() != 'PAGENOR'
          ) {
            affnode.setAttribute('id', 'found' + i);
            affnode.classList.add('found');
          }
        }
        i = i + 1;
      }
    }
  }

  $("[background-color='orange']").not('.found').contents().unwrap();
  $('#content')
    .find('.found')
    .each(function () {
      var Id = $(this).attr('id');
      var appHTML = '';
      if ($('.search-result').html() == '') {
        $('.search-result').css('padding', '15px');
        $('.btn-clear').removeClass('hide');
        loaderStop();
        $('.search-result').append(
          '<div class="searchCount">' + $('.found').length + ' matches </div>'
        );
      }

      var preText = findPreText(Id);
      var nextText = findNextText(Id);

      appHTML =
        '<p onClick="gotoFound(' +
        String.fromCharCode(39) +
        '' +
        Id +
        '' +
        String.fromCharCode(39) +
        ',this);"><span class="searched-txt">' +
        preText.substring(preText.length - 20, preText.length) +
        '<span class="search-keyword">' +
        $(this).text() +
        '</span>' +
        nextText.substring(0, 20) +
        '</span><span onclick="replace_foundonly(' +
        String.fromCharCode(39) +
        '' +
        Id +
        '' +
        String.fromCharCode(39) +
        ');" class="replaceText_only"><i class="fa fa-random find-replace-btn pl-2" title="Replace" aria-hidden="true"></i></span></p>';

      $('.search-result').append(appHTML);
      var spelSearch = $('#spellcheckSearch').val();
      if (spelSearch === 1) {
        $('#spellcheckSearch').val(0);
        $('.search-result').append('');
        $('.search-result-spell').append(appHTML);
      }
      //Hide replace button for find action
      if ($('#replace').val() === '') $('.find-replace-btn').hide();
      else $('.find-replace-btn').show();
    });
  $('.findnreplace_waitingmsg').hide();
  $('#lock').val('false');
  setTimeout(function () {
    $('#loading-wrapper2').hide();
  }, 1000);
}

function setCaretPos(startNode, endNode, start, end) {
  startNode.blur();
  startNode.focus();
  //alert('start: '+start+' end: '+ end+' text: '+selectedText +' startnode: '+startNodeIndex+' endnode: '+endNodeIndex);
  range = document.createRange();
  var editableContainer = document.getElementById('content');
  range.setStart(startNode, start);
  range.setEnd(endNode, end);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function replace_allcontent(regex_style, group, styleEdit) {
  var group = group;
  if (regex_style == undefined) {
    var localdata_set = $('.localstorevalue').val();
    storedata(localdata_set, 'EK');
    var group = 'nostyle';
  }

  var rootEle = 'pdf-editor';
  findPanelSearch(rootEle, regex_style);

  $('#lock').val('true');

  var bold_characterrep = $('#bold_characterrep').val();
  var italic_characterrep = $('#italic_characterrep').val();
  var underline_characterrep = $('#underline_characterrep').val();
  var superscript_characterrep = $('#superscript_characterrep').val();
  var subscript_characterrep = $('#subscript_characterrep').val();

  var sentence_case = $('#sentence_case:checked').val();
  var to_uppercase = $('#to_uppercase:checked').val();
  var to_lowercase = $('#to_lowercase:checked').val();
  var capitalize_eachword = $('#capitalize_eachword:checked').val();

  var replaceText = $('#replace').val();

  var userName = $('#username').val();
  const userId = $('#userid').val();
  var r = 0;

  $('.found').each(function () {
    var d = new Date();
    var dt = Date.parse(d);
    var prop_tagname = $(this).prop('tagName');
    var font_style = $(prop_tagname).css('font-style');
    var founded_texts = $(this).text();
    var founded_text = $(this).text();
    var found_ids = $(this).attr('id');
    var replaceText = $('#replace').val();
    var wildcard_rep = $('#wildcard_rep:checked').val();
    if (wildcard_rep == 'wildcard') {
      var pro = '';
      pro = pro + 'i';
      pro = pro + 'g';
      var find_val = new RegExp($('#find').val(), pro);
      var replaceTextas = $('#replace').val();
      var spellreplaceText = $('#replaceVal').val();
      if (spellreplaceText !== '') {
        replaceTextas = spellreplaceText;
      }
      var replaceText = founded_text.replace(find_val, replaceTextas);
      var us_ukdash = $('#style_editing').text();
      //UK convention
      if (us_ukdash == 'Bloomsbury UK')
        var replaceText = replaceText.replace('', '&#x2013;');
      //US convention
      if (us_ukdash == 'Bloomsbury US')
        var replaceText = replaceText.replace('', '&#x2014;');
      var replaceText = replaceText.replace('(u00a0)', '&nbsp;');
      var replace_hyphen = $('.replace_hyphen').val();
      if (replace_hyphen == 'ITALIC HYPHEN')
        var replaceText = replaceText.replace('-', ' ');
      if (replace_hyphen == 'ITALICFIRST')
        var replaceText = founded_texts.replace('p', '<i>P</i>');
      if (replace_hyphen == 'SMALLCAPS') {
        var replaceword = $('.other_replaceword').val();
        var replaceText = founded_texts.replace(
          founded_texts,
          '<sc>' + replaceword + '</sc>'
        );
      }
      if (replace_hyphen == 'OPERATORITALIC') {
        var replaceword = $('.other_replaceword').val();
        var find_val_OI = new RegExp(replaceword, pro);
        var replaceText1 = founded_texts.replace(
          find_val_OI,
          '<i>' + replaceword + '</i>&#x2009;'
        );
        var replaceText = replaceText1.replace('0.', '0');
      }
      if (
        replaceText == ' Mann-Whitney' ||
        replaceText == ' Tris-HCl' ||
        replaceText == ' Sprague-Dawley'
      )
        var replaceText = replaceText.replace('-', '&#x2013;');
      if (
        replaceText == ' Mr. ' ||
        replaceText == ' Mrs. ' ||
        replaceText == ' Dr. ' ||
        replaceText == ' Prof. ' ||
        replaceText == ' et al. ' ||
        replaceText == ' vs. '
      )
        var replaceText = replaceText.replace('.', '');
      console.log('replace_wilds: ' + replaceText);
    }
    if (to_lowercase == 'lowercase') {
      var founded_text = founded_text.toLowerCase();
      var replaceText = replaceText.toLowerCase();
    }
    if (to_uppercase == 'uppercase') {
      var replaceText = founded_text.toUpperCase();
      var replaceText = replaceText.toUpperCase();
    }
    if (sentence_case == 'sentenceCase') {
      var founded_text = sentenceCase(founded_text.toLowerCase());
      var replaceText = sentenceCase(replaceText.toLowerCase());
    }
    if (capitalize_eachword == 'capitalize') {
      var founded_text = toTitleCase(founded_text);
      var replaceText = toTitleCase(replaceText);
    }
    var findText =
      '<span class="del cts-1" data-cid="2" group_tag="' +
      group +
      '" data-userid="11" data-username="' +
      userName +
      '" data-time="' +
      dt +
      '_d' +
      found_ids +
      '_' +
      regex_style +
      '" common_tag="' +
      dt +
      '_i' +
      found_ids +
      '_' +
      regex_style +
      '">' +
      founded_texts +
      '</span>';
    if (prop_tagname == 'B' && bold_characterrep != 'boldnull') {
      if (replaceText != '')
        var replaceTextas =
          '<b store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</b>';
      else
        var replaceTextas =
          '<b store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</b>';
    } else if (
      (prop_tagname == 'I' || font_style == 'italic') &&
      italic_characterrep != 'italicnull'
    ) {
      if (replaceText != '')
        var replaceTextas =
          '<i store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</i>';
      else
        var replaceTextas =
          '<i store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</i>';
    } else if (
      prop_tagname == 'U' &&
      underline_characterrep != 'underlinenull'
    ) {
      if (replaceText != '')
        var replaceTextas =
          '<u store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</u>';
      else
        var replaceTextas =
          '<u store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</u>';
    }
    //SUPERSCRIPT SUBSCRIPT
    else if (
      (prop_tagname == 'SUP' || prop_tagname == 'SUPERSCRIPT') &&
      superscript_characterrep != 'superscriptnull'
    ) {
      if (replaceText != '')
        var replaceTextas =
          '<sup store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</sup>';
      else
        var replaceTextas =
          '<sup store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</sup>';
    } else if (
      (prop_tagname == 'SUB' || prop_tagname == 'SUBSCRIPT') &&
      subscript_characterrep != 'subscriptnull'
    ) {
      if (replaceText != '')
        var replaceTextas =
          '<sub store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</sub>';
      else
        var replaceTextas =
          '<sub store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</sub>';
    } else if (
      bold_characterrep != 'boldtrue' &&
      italic_characterrep != 'italictrue' &&
      underline_characterrep != 'underlinetrue' &&
      superscript_characterrep != 'superscripttrue' &&
      subscript_characterrep != 'subscripttrue'
    ) {
      if (replaceText != '')
        var replaceTextas =
          '<span store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</span>';
      else
        var replaceTextas =
          '<span store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</span>';
    }

    // check box checked conditions
    if (bold_characterrep == 'boldtrue') {
      if (replaceText != '')
        var replaceTextas =
          '<b store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</b>';
      else
        var replaceTextas =
          '<b store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</b>';
    }
    if (italic_characterrep == 'italictrue') {
      if (replaceText != '')
        var replaceTextas =
          '<i store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</b>';
      else
        var replaceTextas =
          '<i store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</b>';
    }
    if (underline_characterrep == 'underlinetrue') {
      if (replaceText != '')
        var replaceTextas =
          '<u store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</u>';
      else
        var replaceTextas =
          '<u store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</u>';
    }
    if (superscript_characterrep == 'superscripttrue') {
      if (replaceText != '')
        var replaceTextas =
          '<sup store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</sup>';
      else
        var replaceTextas =
          '<sup store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</sup>';
    }
    if (subscript_characterrep == 'subscripttrue') {
      if (replaceText != '')
        var replaceTextas =
          '<sub store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</sub>';
      else
        var replaceTextas =
          '<sub store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</sub>';
    }
    $(this).html(findText + '' + replaceTextas);
    r = r + 1;
  });

  $('.found').contents().unwrap();
  $('.search-result').html('');
  $('#find').val('');
  $('#findPanelText').val('');
  $('#findPanelTextinside').val('');
  $('#replace').val('');
  $('#replaceinside').val('');
  if (!styleEdit) autosavefunction_vxe();
  $('#lock').val('false');
}

function replace_foundonly(found_id) {
  setTimeout(function () {
    loaderStart();
  }, 500);
  var element = document.getElementById(found_id);
  setCaretPos(element, element, 0, 0);
  element.scrollIntoView({
    behavior: 'instant',
    block: 'center',
    inline: 'nearest',
  });

  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set);

  var founded_texts = $('#' + found_id).text();
  var founded_text = $('#' + found_id).text();
  var prop_tagname = $('#' + found_id).prop('tagName');

  var font_style = $(prop_tagname).css('font-style');

  var bold_characterrep = $('#bold_characterrep').val();
  var italic_characterrep = $('#italic_characterrep').val();
  var underline_characterrep = $('#underline_characterrep').val();
  var superscript_characterrep = $('#superscript_characterrep').val();
  var subscript_characterrep = $('#subscript_characterrep').val();

  var sentence_case = $('#sentence_case:checked').val();
  var to_uppercase = $('#to_uppercase:checked').val();
  var to_lowercase = $('#to_lowercase:checked').val();
  var capitalize_eachword = $('#capitalize_eachword:checked').val();
  var replaceText = $('#replace').val();
  var spellreplaceText = $('#replaceVal').val();
  if (spellreplaceText !== '') {
    replaceText = spellreplaceText;
  }
  var msg = 'Replace :' + replaceText;
  if (to_lowercase == 'lowercase') {
    var founded_text = founded_text.toLowerCase();
    var replaceText = replaceText.toLowerCase();
  }
  if (to_uppercase == 'uppercase') {
    var replaceText = founded_text.toUpperCase();
    var replaceText = replaceText.toUpperCase();
  }
  if (sentence_case == 'sentenceCase') {
    var founded_text = sentenceCase(founded_text.toLowerCase());
    var replaceText = sentenceCase(replaceText.toLowerCase());
  }
  if (capitalize_eachword == 'capitalize') {
    var founded_text = toTitleCase(founded_text);
    var replaceText = toTitleCase(replaceText);
  }
  var d = new Date();
  var dt = Date.parse(d);
  var userName = $('#username').val();
  const userId = $('#userid').val();
  var findText =
    '<span class="del cts-1" data-cid="2" data-userid=' +
    userId +
    ' data-username="' +
    userName +
    '" data-time="' +
    dt +
    '_d">' +
    founded_texts +
    '</span>';
  if (prop_tagname == 'B' && bold_characterrep != 'boldnull') {
    if (replaceText != '')
      var replaceTextas =
        '<b store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        replaceText +
        '</b>';
    else
      var replaceTextas =
        '<b store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        founded_text +
        '</b>';
  } else if (
    (prop_tagname == 'I' || font_style == 'italic') &&
    italic_characterrep != 'italicnull'
  ) {
    if (replaceText != '')
      var replaceTextas =
        '<i store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        replaceText +
        '</i>';
    else
      var replaceTextas =
        '<i store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        founded_text +
        '</i>';
  } else if (prop_tagname == 'U' && underline_characterrep != 'underlinenull') {
    if (replaceText != '')
      var replaceTextas =
        '<u store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        replaceText +
        '</u>';
    else
      var replaceTextas =
        '<u store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        founded_text +
        '</u>';
  } else if (
    (prop_tagname == 'SUP' || prop_tagname == 'SUPERSCRIPT') &&
    superscript_characterrep != 'superscriptnull'
  ) {
    if (replaceText != '')
      var replaceTextas =
        '<sup store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        replaceText +
        '</sup>';
    else
      var replaceTextas =
        '<sup store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        founded_text +
        '</sup>';
  } else if (
    (prop_tagname == 'SUB' || prop_tagname == 'SUBSCRIPT') &&
    subscript_characterrep != 'subscriptnull'
  ) {
    if (replaceText != '')
      var replaceTextas =
        '<sub store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        replaceText +
        '</sub>';
    else
      var replaceTextas =
        '<sub store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        founded_text +
        '</sub>';
  } else if (
    bold_characterrep != 'boldtrue' &&
    italic_characterrep != 'italictrue' &&
    underline_characterrep != 'underlinetrue' &&
    superscript_characterrep != 'superscripttrue' &&
    subscript_characterrep != 'subscripttrue'
  ) {
    if (replaceText != '')
      var replaceTextas =
        '<span store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        replaceText +
        '</span>';
    else
      var replaceTextas =
        '<span store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        founded_text +
        '</span>';
  }
  // check box checked conditions
  if (bold_characterrep == 'boldtrue') {
    if (replaceText != '')
      var replaceTextas =
        '<b store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        replaceText +
        '</b>';
    else
      var replaceTextas =
        '<b store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        founded_text +
        '</b>';
  }
  if (italic_characterrep == 'italictrue') {
    if (replaceText != '')
      var replaceTextas =
        '<i store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        replaceText +
        '</b>';
    else
      var replaceTextas =
        '<i store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        founded_text +
        '</b>';
  }
  if (underline_characterrep == 'underlinetrue') {
    if (replaceText != '')
      var replaceTextas =
        '<u store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        replaceText +
        '</u>';
    else
      var replaceTextas =
        '<u store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        founded_text +
        '</u>';
  }
  if (superscript_characterrep == 'superscripttrue') {
    if (replaceText != '')
      var replaceTextas =
        '<sup store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        replaceText +
        '</sup>';
    else
      var replaceTextas =
        '<sup store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        founded_text +
        '</sup>';
  }
  if (subscript_characterrep == 'subscripttrue') {
    if (replaceText != '')
      var replaceTextas =
        '<sub store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        replaceText +
        '</sub>';
    else
      var replaceTextas =
        '<sub store="' +
        dt +
        '_i" class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i">' +
        founded_text +
        '</sub>';
  }
  $('#content #' + found_id).html(findText + '' + replaceTextas);
  $('#content #' + found_id)
    .contents()
    .unwrap();
  loaderStop();
  autosavefunction_vxe(msg);
  //$("#replaceVal").val("");
}

function updateRevisions() {
  $('.panel-body').text('');
  if ($('.slider-arrow').hasClass('hide1')) {
    var trackchanges_count = $('#content [data-time]').length;
    $('.trackchanges_count').text('');
    $('.trackchanges_count').text(trackchanges_count + ' Changes');
    console.log('slide-arrow ' + $('.slider-arrow').attr('class'));

    var asSame = 0;

    var affnodeas = getSelectedNode();

    if (findAncestor(affnodeas, 'editor')) {
      if (affnodeas.tagName === 'CHAPTER') {
        var search_tags =
          '#content .ins,#content .del,#content [data-time], #content .merge, #content .merge, #content .insert, #content .delete';
      } else {
        var currParents = $(affnodeas).parents();
        var currParentsLen = currParents.length;

        if ($(affnodeas).attr('store') != undefined) {
          var activeParent = $(affnodeas).parent();
        } else {
          for (var i = 0; i < currParentsLen; i++) {
            if ($(currParents[i]).attr('store') != undefined) {
              var activeParent = $(currParents[i]);
              currParentsLen = i;
            }
          }
        }

        if (
          activeParent.next().length != 0 &&
          activeParent.prev().length != 0
        ) {
          var next_store_id = activeParent.next().attr('store');
          var prev_store_id = activeParent.prev().attr('store');
          var span_store_id = activeParent.attr('store');

          var search_tags =
            '#content [store=' +
            span_store_id +
            '] .ins,#content [store=' +
            span_store_id +
            '] .del,#content [store=' +
            span_store_id +
            '] [data-time], #content [store=' +
            span_store_id +
            '] .merge, #content [store=' +
            span_store_id +
            '] .insert, #content [store=' +
            span_store_id +
            '] .delete, #content [store=' +
            next_store_id +
            '] .ins,#content [store=' +
            next_store_id +
            '] .del,#content [store=' +
            next_store_id +
            '] [data-time], #content [store=' +
            next_store_id +
            '] .merge, #content [store=' +
            next_store_id +
            '] .insert, #content [store=' +
            next_store_id +
            '] .delete, #content [store=' +
            prev_store_id +
            '] .ins,#content [store=' +
            prev_store_id +
            '] .del,#content [store=' +
            prev_store_id +
            '] [data-time], #content [store=' +
            prev_store_id +
            '] .merge, #content [store=' +
            prev_store_id +
            '] .insert, #content [store=' +
            prev_store_id +
            '] .delete';
        } else if (
          activeParent.next().length != 0 &&
          activeParent.prev().length === 0
        ) {
          var next_store_id = activeParent.next().attr('store');
          var store_id = activeParent.attr('store');

          var search_tags =
            '#content [store=' +
            store_id +
            '] .ins,#content [store=' +
            store_id +
            '] .del,#content [store=' +
            store_id +
            '] [data-time], #content [store=' +
            store_id +
            '] .merge, #content [store=' +
            store_id +
            '] .insert, #content [store=' +
            store_id +
            '] .delete, #content [store=' +
            next_store_id +
            '] .ins,#content [store=' +
            next_store_id +
            '] .del,#content [store=' +
            next_store_id +
            '] [data-time], #content [store=' +
            next_store_id +
            '] .merge, #content [store=' +
            next_store_id +
            '] .insert, #content [store=' +
            next_store_id +
            '] .delete';
        } else if (
          activeParent.next().length === 0 &&
          activeParent.prev().length != 0
        ) {
          var prev_store_id = activeParent.prev().attr('store');
          var store_id = activeParent.attr('store');

          var search_tags =
            '#content [store=' +
            store_id +
            '] .ins,#content [store=' +
            store_id +
            '] .del,#content [store=' +
            store_id +
            '] [data-time], #content [store=' +
            store_id +
            '] .merge, #content [store=' +
            store_id +
            '] .insert, #content [store=' +
            store_id +
            '] .delete';
        } else if (
          activeParent.next().length === 0 &&
          activeParent.prev().length === 0
        ) {
          var store_id = activeParent.attr('store');

          var search_tags =
            '#content [store=' +
            store_id +
            '] .ins,#content [store=' +
            store_id +
            '] .del,#content [store=' +
            store_id +
            '] [data-time], #content [store=' +
            store_id +
            '] .merge, #content [store=' +
            store_id +
            '] .insert, #content [store=' +
            store_id +
            '] .delete';
        } else {
          var search_tags =
            '#content .ins,#content .del,#content [data-time], #content .merge, #content .merge, #content .insert, #content .delete';
        }
      }
    } else {
      var search_tags =
        '#content .ins,#content .del,#content [data-time], #content .merge, #content .merge, #content .insert, #content .delete';
    }

    $(search_tags).each(function () {
      var d = $(this).attr('data-time');
      var dn = new Date(parseInt(d));
      var query_username = $('#username').val();
      var userrole = '<?php echo $userRoles[0]->itemname; ?>';

      if (d != asSame) {
        //var dn = dnd.replace("India Standard Time","IST");
        var user = $(this).attr('data-username');
        var icon = '';
        if (
          userrole != 'RLAuthor' &&
          userrole != 'Production Editor' &&
          userrole != 'NPAuthor' &&
          userrole != 'Editor' &&
          userrole != 'BBProduction Editor'
        ) {
          if (
            this.tagName.toUpperCase() === 'COMMENT' ||
            this.tagName.toUpperCase() === 'QUERY' ||
            this.tagName.toUpperCase() === 'REPLY'
          ) {
            if (this.tagName.toUpperCase() === 'REPLY') {
              if (this.tagName.toUpperCase() === 'COMMENT') {
                icon = 'comment-user-comment trackchange_icon';
              }
              if (this.tagName.toUpperCase() === 'QUERY') {
                icon = 'comment-user-query trackchange_icon';
              }
              if (this.tagName.toUpperCase() === 'REPLY') {
                icon = 'comment-user-reply trackchange_icon';
              }
              var titleData = $(this).attr('title');

              var previous_commentid = $(this).attr('comment-reply');
              if (query_username.toUpperCase() === user.toUpperCase()) {
                //console.log("Comment Text"+query_username.toUpperCase()+"\n Comment user "+ user.toUpperCase()+"\n Reply Case matches");

                $('#' + previous_commentid).append(
                  '<div class="review-reply" reply-name="' +
                    user +
                    '" id="' +
                    d.toString().trim() +
                    '" onClick="gotoChangeCQ(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ',this);"><header class="text-left"><div class="review-item-c"><div class="' +
                    icon +
                    '"><span class="fa fa-reply" style="padding-right:5px;"></span> ' +
                    user +
                    '</div><div class="acceptreject"><span class="review-comment_update" onClick="updatereply_edit(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" title="Edit Reply"></span><span class="review-cancel_query" onClick="deleteCommentQuery(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" title="Delete Comment"></span><span class="fa fa-clock-o" title="' +
                    dn +
                    '"></span></div></header><div class="comment-post"><span class="trackchange_text"> ' +
                    titleData +
                    '</span></div></div>'
                );
              } else {
                //console.log("Comment Text"+query_username.toUpperCase()+"\n Comment user "+ user.toUpperCase()+"\n Reply Case");
                $('#' + previous_commentid).append(
                  '<div class="review-reply" reply-name="' +
                    user +
                    '" id="' +
                    d.toString().trim() +
                    '" onClick="gotoChangeCQ(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ',this);"><header class="text-left"><div class="review-item-c"><div class="' +
                    icon +
                    '"><span class="fa fa-reply" style="padding-right:5px;"></span> ' +
                    user +
                    '</div><div class="acceptreject"><span class="reply-query" onClick="replyquery_for(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" aria-hidden="true"></span><span class="fa fa-clock-o" title="' +
                    dn +
                    '"></span></div></header><div class="comment-post"><span class="trackchange_text"> ' +
                    titleData +
                    '</span></div></div>'
                );
              }
            } else if (this.tagName.toUpperCase() === 'QUERY') {
              if (this.tagName.toUpperCase() === 'COMMENT') {
                icon = 'comment-user-comment trackchange_icon';
              }
              if (this.tagName.toUpperCase() === 'QUERY') {
                icon = 'comment-user-query trackchange_icon';
              }
              var titleData = $(this).attr('title');
              var markas_doneopacity = '';
              var markas_on = $(this).attr('marksdone');
              //alert("123");
              if (markas_on === 'true') {
                var markas_done =
                  '<span class="markas_doneon" title="Mark as Done" onclick="markas_doneon(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ');"></span>';
                var markas_doneopacity = 'markas_doneopacity';
              } else {
                var markas_done =
                  '<span class="markas_doneoff" title="Mark as Done" onclick="markas_doneoff(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ');"></span>';
              }

              if (query_username.toUpperCase() === user.toUpperCase()) {
                //console.log("Comment Text"+query_username.toUpperCase()+"\n Comment user "+ user.toUpperCase()+"\n Query Case matches");

                console.log('queryif');

                $('.panel-body').append(
                  '<div class="review-item ' +
                    markas_doneopacity +
                    '" query-name="' +
                    user +
                    '" id="' +
                    d.toString().trim() +
                    '" onClick="gotoChangeCQ(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ',this);"><header class="text-left"><div class="review-item-c"><div class="' +
                    icon +
                    '"> ' +
                    user +
                    '</div><div class="acceptreject">' +
                    markas_done +
                    '<span class="review-comment_update" onClick="updatequery_edit(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" title="Edit Query"></span><span class="review-cancel_query" onClick="deleteCommentQuery(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" title="Delete Query"></span><span class="fa fa-clock-o" title="' +
                    dn +
                    '"></span></div></header><div class="comment-post"><span class="trackchange_text"> ' +
                    titleData +
                    '</span></div></div>'
                );
              } else if (
                user.toUpperCase() === 'EDITOR' ||
                userrole === 'Project Manager'
              ) {
                console.log('queryelseif');
                //console.log("Comment Text"+query_username.toUpperCase()+"\n Comment user "+ user.toUpperCase()+"\n Query Case matches");
                $('.panel-body').append(
                  '<div class="review-item ' +
                    markas_doneopacity +
                    '" query-name="' +
                    user +
                    '" id="' +
                    d.toString().trim() +
                    '" onClick="gotoChangeCQ(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ',this);"><header class="text-left"><div class="review-item-c"><div class="' +
                    icon +
                    '"> ' +
                    user +
                    '</div><div class="acceptreject">' +
                    markas_done +
                    '<span class="reply-query" onClick="replyquery(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" aria-hidden="true"></span><span class="review-comment_update" onClick="updatequery_edit(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" title="Edit Query"></span><span class="review-cancel_query" onClick="deleteCommentQuery(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" title="Delete Query"></span><span class="fa fa-clock-o" title="' +
                    dn +
                    '"></span></div></header><div class="comment-post"><span class="trackchange_text"> ' +
                    titleData +
                    '</span></div></div>'
                );
              } else {
                console.log('queryelse');
                //console.log("Comment Text"+query_username.toUpperCase()+"\n Comment user "+ user.toUpperCase()+"\n Query Case");
                $('.panel-body').append(
                  '<div class="review-item ' +
                    markas_doneopacity +
                    '"  query-name="' +
                    user +
                    '" id="' +
                    d.toString().trim() +
                    '" onClick="gotoChangeCQ(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ',this);"><header class="text-left"><div class="review-item-c"><div class="' +
                    icon +
                    '"> ' +
                    user +
                    '</div><div class="acceptreject">' +
                    markas_done +
                    '<span class="reply-query" onClick="replyquery(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" aria-hidden="true"></span><span class="fa fa-clock-o" title="' +
                    dn +
                    '"></span></div></header><div class="comment-post"><span class="trackchange_text"> ' +
                    titleData +
                    '</span></div></div>'
                );
              }
            } else {
              if (this.tagName.toUpperCase() === 'COMMENT') {
                icon = 'comment-user-comment trackchange_icon';
              }
              if (this.tagName.toUpperCase() === 'QUERY') {
                icon = 'comment-user-query trackchange_icon';
              }
              var titleData = $(this).attr('title');

              var markas_on = $(this).attr('marksdone');
              var markas_doneopacity = '';

              if (markas_on === 'true') {
                var markas_done =
                  '<span class="markas_doneon" title="Mark as Done" onclick="markas_doneon(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ');"></span>';

                var markas_doneopacity = 'markas_doneopacity';
              } else {
                var markas_done =
                  '<span class="markas_doneoff" title="Mark as Done" onclick="markas_doneoff(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ');"></span>';
              }

              if (query_username.toUpperCase() === user.toUpperCase()) {
                //console.log("Comment Text"+query_username.toUpperCase()+"\n Comment user "+ user.toUpperCase()+"\n comment Case true");
                $('.panel-body').append(
                  '<div class="review-item ' +
                    markas_doneopacity +
                    '" id="' +
                    d.toString().trim() +
                    '" onClick="gotoChangeCQ(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ',this);"><header class="text-left"><div class="review-item-c"><div class="' +
                    icon +
                    '"> ' +
                    user +
                    '</div><div class="acceptreject">' +
                    markas_done +
                    '<span class="review-comment_update" onClick="updateComment_edit(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" title="Edit Comment"></span><span class="review-cancel_query" onClick="deleteCommentQuery(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" title="Delete Comment"></span><span class="review-accept"  title="Accept Change" onClick="changeaccept(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');"></span><span class="fa fa-clock-o" title="' +
                    dn +
                    '"></span></div></header><div class="comment-post"><span class="trackchange_text"> ' +
                    titleData +
                    '</span></div></div>'
                );
              } else {
                //console.log("Comment Text"+query_username.toUpperCase()+"\n Comment user "+ user.toUpperCase()+"\n comment Case else");
                $('.panel-body').append(
                  '<div class="review-item ' +
                    markas_doneopacity +
                    '" id="' +
                    d.toString().trim() +
                    '" onClick="gotoChangeCQ(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ',this);"><header class="text-left"><div class="review-item-c"><div class="' +
                    icon +
                    '"> ' +
                    user +
                    '</div><div class="acceptreject">' +
                    markas_done +
                    '<span class="review-accept"  title="Accept Change" onClick="changeaccept(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');"></span><span class="review-cancel_query" onClick="deleteCommentQuery(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" title="Delete Comment"></span><span class="fa fa-clock-o" title="' +
                    dn +
                    '"></span></div></header><div class="comment-post"><span class="trackchange_text"> ' +
                    titleData +
                    '</span></div></div>'
                );
              }
            }
          } else if (this.tagName.toUpperCase() === 'SPAN') {
            if (this.hasAttribute('style')) {
              var formatType = '';
              if (
                this.getAttribute('style').toString().includes('font-weight:')
              ) {
                icon = 'comment-user-b trackchange_icon';
                formatType = 'B';
              } else if (
                this.getAttribute('style').toString().includes('font-style:')
              ) {
                icon = 'comment-user-i trackchange_icon';
                formatType = 'I';
              } else {
                icon = 'comment-user-r trackchange_icon';
              }
              //else {formatType="R";}
              $('.panel-body').append(
                '<div class="review-item" id="' +
                  d.toString().trim() +
                  '" onClick="gotoChange(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ',this);"><header class="text-left"><div class="' +
                  icon +
                  '"> ' +
                  user +
                  '</div><div class="acceptreject"><span class="review-cancel" title="Reject Change" onClick="changereject(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ');"></span><span class="review-accept" title="Accept Change" onClick="changeaccept(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ');"></span><span class="fa fa-clock-o" title="' +
                  dn +
                  '"></span></div></header><div class="comment-post"><span class="trackchange_text"> ' +
                  formatType +
                  ' ' +
                  $(this).text() +
                  '</span></div></div>'
              );
            } else {
              var formatType = '';
              if (this.classList.contains('ins')) {
                icon = 'comment-user-ins trackchange_icon';
              } else if (this.classList.contains('del')) {
                icon = 'comment-user-del trackchange_icon';
              } else {
                icon = 'comment-user-r trackchange_icon';
              }
              //else {formatType="R";}

              //remove :
              $('.panel-body').append(
                '<div class="review-item" id="' +
                  d.toString().trim() +
                  '" onClick="gotoChange(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ',this);"><header class="text-left"><div class="' +
                  icon +
                  '"> ' +
                  user +
                  '</div><div class="acceptreject"><span class="review-cancel" title="Reject Change" onClick="changereject(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ');"></span><span class="review-accept" title="Accept Change" onClick="changeaccept(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ');"></span><span class="fa fa-clock-o" title="' +
                  dn +
                  '"></span></div></header><div class="comment-post"><span class="trackchange_text"> ' +
                  formatType +
                  ' ' +
                  $(this).text() +
                  '</span></div></div>'
              );
            }
          } else if (this.tagName.toUpperCase() === 'PARA') {
            console.log('Tag Name: ' + this.tagName.toUpperCase());
            if (this.getAttribute('enter_key') === 'success') {
              console.log('Enter : ' + this.getAttribute('enter_key'));

              var chaType = $(this).attr('role');
              $('.panel-body').append(
                '<div class="review-item" id="' +
                  d.toString().trim() +
                  '" onClick="gotoChange(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ',this);"><header class="text-left"><div class="trackchange_icon"> ' +
                  user +
                  '</div><div class="acceptreject"><span class="review-cancel" title="Reject Change" onClick="changereject_para(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ');"></span><span class="review-accept" title="Accept Change" onClick="changeaccept_para(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ');"></span><span class="fa fa-clock-o" title="' +
                  dn +
                  '"></span></div></header><div class="comment-post"><span class="fa fa-code" style="color:grey;"></span><span class="trackchange_text"> Structure Change: ' +
                  this.tagName +
                  '  Splitted</span></div></div>'
              );
            } else if (this.getAttribute('role') === 'merge_para') {
              console.log('role_Merge: ' + this.getAttribute('role'));
              var chaType = $(this).attr('role');
              $('.panel-body').append(
                '<div class="review-item" id="' +
                  d.toString().trim() +
                  '" onClick="gotoChange(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ',this);"><header class="text-left"><div  class="trackchange_icon"> ' +
                  user +
                  '</div><div class="acceptreject"><span class="review-cancel" title="Reject Change" onClick="changereject_mergepara(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ');"></span><span class="review-accept" title="Accept Change" onClick="changeaccept_para(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ');"></span><span class="fa fa-clock-o" title="' +
                  dn +
                  '"></span></div></header><div class="comment-post"><span class="fa fa-code" style="color:grey;"></span><span class="trackchange_text">Structure Change: Merge ' +
                  this.tagName +
                  '</span></div></div>'
              );
            }
          } else if (this.tagName.toUpperCase() === 'SECTION1') {
            var chaType = $(this).attr('role');

            $('.panel-body').append(
              '<div class="review-item" id="' +
                d.toString().trim() +
                '" onClick="gotoChange_section(' +
                String.fromCharCode(39) +
                '' +
                d.toString().trim() +
                '' +
                String.fromCharCode(39) +
                ',this);"><header class="text-left"><div> ' +
                user +
                '</div><div class="acceptreject"><span class="review-cancel" title="Reject Change" onClick="changereject_section(' +
                String.fromCharCode(39) +
                '' +
                d.toString().trim() +
                '' +
                String.fromCharCode(39) +
                ');"></span><span class="review-accept" title="Accept Change" onClick="changeaccept_section(' +
                String.fromCharCode(39) +
                '' +
                d.toString().trim() +
                '' +
                String.fromCharCode(39) +
                ');"></span><span class="fa fa-clock-o" title="' +
                dn +
                '"></span></div></header><div class="comment-post"><span class="fa fa-code" style="color:grey;"></span> Section: ' +
                chaType +
                '</p></div></div>'
            );
          } else if (
            this.tagName.toUpperCase() === 'TABLE1' ||
            this.tagName.toUpperCase() === 'FIGURE1'
          ) {
            //var chaType = $(this).attr("role");
            if (this.tagName.toUpperCase() === 'TABLE1') {
              var figtbl_name = 'TABLE';
            } else {
              var figtbl_name = 'FIGURE';
            }

            $('.panel-body').append(
              '<div class="review-item" id="' +
                d.toString().trim() +
                '" onClick="gotoChange_table(' +
                String.fromCharCode(39) +
                '' +
                d.toString().trim() +
                '' +
                String.fromCharCode(39) +
                ',this);"><header class="text-left"><div> ' +
                user +
                '</div><div class="acceptreject"><span class="review-cancel" title="Reject Change" onClick="changereject(' +
                String.fromCharCode(39) +
                '' +
                d.toString().trim() +
                '' +
                String.fromCharCode(39) +
                ');"></span><span class="review-accept" title="Accept Change" onClick="changeaccept(' +
                String.fromCharCode(39) +
                '' +
                d.toString().trim() +
                '' +
                String.fromCharCode(39) +
                ');"></span><span class="fa fa-clock-o" title="' +
                dn +
                '"></span></div></header><div class="comment-post"><span class="fa fa-code" style="color:grey;"></span> Structure Change: ' +
                figtbl_name +
                ' </p></div></div>'
            );
          } else if (
            this.tagName.toUpperCase() === 'LABEL1' ||
            this.tagName.toUpperCase() === 'TITLE1' ||
            this.tagName.toUpperCase() === 'CAPTION1'
          ) {
            //var chaType = $(this).attr("role");
            $('.panel-body').append(
              '<div class="review-item" id="' +
                d.toString().trim() +
                '" onClick="gotoChange(' +
                String.fromCharCode(39) +
                '' +
                d.toString().trim() +
                '' +
                String.fromCharCode(39) +
                ',this);"><header class="text-left"><div> ' +
                user +
                '</div><div class="acceptreject"><span class="review-cancel" title="Reject Change" onClick="changereject(' +
                String.fromCharCode(39) +
                '' +
                d.toString().trim() +
                '' +
                String.fromCharCode(39) +
                ');"></span><span class="review-accept" title="Accept Change" onClick="changeaccept(' +
                String.fromCharCode(39) +
                '' +
                d.toString().trim() +
                '' +
                String.fromCharCode(39) +
                ');"></span><span class="fa fa-clock-o" title="' +
                dn +
                '"></span></div></header><div class="comment-post"><span class="fa fa-code" style="color:grey;"></span> Structure Change: ' +
                this.tagName +
                ' </p></div></div>'
            );
          } else if (
            this.tagName.toUpperCase() === 'TR' ||
            this.tagName.toUpperCase() === 'TD'
          ) {
            //var chaType = $(this).attr("class");
            //$(".panel-body").append('<div class="review-item" id="' + d.toString().trim() + '" onClick="gotoChange_section('+String.fromCharCode(39)+''+ d.toString().trim() +''+String.fromCharCode(39)+',this);"><header class="text-left"><div> '+ user +'</div><div class="acceptreject"><span class="review-cancel" title="Reject Change" onClick="changereject_section('+String.fromCharCode(39)+''+ d.toString().trim() +''+String.fromCharCode(39)+');"></span><span class="review-accept" title="Accept Change" onClick="changeaccept_section('+String.fromCharCode(39)+''+ d.toString().trim() +''+String.fromCharCode(39)+');"></span><span class="fa fa-clock-o" title="'+ dn +'"></span></div></header><div class="comment-post"><span class="fa fa-code" style="color:grey;"></span> Structure Change: '+chaType+' </p></div></div>');
          } else if ($(this).attr('role') == 'change-element') {
            $('.panel-body').append(
              '<div class="review-item" id="' +
                d.toString().trim() +
                '" onClick="gotoChange(' +
                String.fromCharCode(39) +
                '' +
                d.toString().trim() +
                '' +
                String.fromCharCode(39) +
                ',this);"><header class="text-left"><div class="trackchange_icon"> ' +
                user +
                '</div><div class="acceptreject"><span class="review-cancel" title="Reject Change" onClick="changereject_changeelement(' +
                String.fromCharCode(39) +
                '' +
                d.toString().trim() +
                '' +
                String.fromCharCode(39) +
                ');"></span><span class="review-accept" title="Accept Change" onClick="changeaccept_changeelement(' +
                String.fromCharCode(39) +
                '' +
                d.toString().trim() +
                '' +
                String.fromCharCode(39) +
                ');"></span><span class="fa fa-clock-o" title="' +
                dn +
                '"></span></div></header><div class="comment-post"><span class="fa fa-code" style="color:grey;"></span><span class="trackchange_text"> Change Element: ' +
                this.tagName +
                '</span></div></div>'
            );
          } else {
            if (this.tagName.toUpperCase() === 'B') {
              icon = 'comment-user-b trackchange_icon';
            }
            if (this.tagName.toUpperCase() === 'I') {
              icon = 'comment-user-i trackchange_icon';
            }
            if (this.tagName.toUpperCase() === 'U') {
              icon = 'comment-user-u trackchange_icon';
            }
            if (this.tagName.toUpperCase() === 'SUB') {
              icon = 'comment-user-sub trackchange_icon';
            }
            if (this.tagName.toUpperCase() === 'SUP') {
              icon = 'comment-user-sup trackchange_icon';
            }

            if (icon != '') {
              $('.panel-body').append(
                '<div class="review-item" id="' +
                  d.toString().trim() +
                  '" onClick="gotoChange(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ',this);"><header class="text-left"><div class="' +
                  icon +
                  '"> ' +
                  user +
                  '</div><div class="acceptreject"><span class="review-cancel" title="Reject Change" onClick="changereject(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ');"></span><span class="review-accept" title="Accept Change" onClick="changeaccept(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ');"></span><span class="fa fa-clock-o" title="' +
                  dn +
                  '"></span></div></header><div class="comment-post"><span class="fa fa-paint-brush" style="color:grey;"></span><span class="trackchange_text"> <' +
                  $(this)[0].tagName +
                  '>' +
                  $(this).text() +
                  '</' +
                  $(this)[0].tagName +
                  '></span></p></div></div>'
              );
            }
          }
        } else {
          //Author
          if (
            this.tagName.toUpperCase() === 'COMMENT' ||
            this.tagName.toUpperCase() === 'QUERY' ||
            this.tagName.toUpperCase() === 'REPLY'
          ) {
            if (this.tagName.toUpperCase() === 'REPLY') {
              if (this.tagName.toUpperCase() === 'COMMENT') {
                icon = 'comment-user-comment';
              }
              if (this.tagName.toUpperCase() === 'QUERY') {
                icon = 'comment-user-query';
              }
              if (this.tagName.toUpperCase() === 'REPLY') {
                icon = 'comment-user-reply';
              }
              var titleData = $(this).attr('title');

              var previous_commentid = $(this).attr('comment-reply');
              if (query_username.toUpperCase() === user.toUpperCase()) {
                //console.log("Comment Text"+query_username.toUpperCase()+"\n Comment user "+ user.toUpperCase()+"\n Reply Case matches");

                $('#' + previous_commentid).append(
                  '<div class="review-reply" reply-name="' +
                    user +
                    '" id="' +
                    d.toString().trim() +
                    '" onClick="gotoChangeCQ(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ',this);"><header class="text-left"><div class="review-item-c"><div class="' +
                    icon +
                    '"><i class="fa fa-reply" style="padding-right:5px;"></i><i class="fa fa-user"></i> ' +
                    user +
                    '</div><div class="acceptreject"><i class="review-comment_update" onClick="updatereply_edit(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" title="Edit Reply"></i><i class="review-cancel_query" onClick="deleteCommentQuery(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" title="Delete Comment"></i></div></header><div class="comment-post"><' +
                    $(this)[0].tagName +
                    '>' +
                    $(this).text() +
                    ' ' +
                    titleData +
                    '</' +
                    $(this)[0].tagName +
                    '></p><time class="comment-date" datetime="' +
                    d +
                    '"><i class="fa fa-clock-o"></i> ' +
                    dn +
                    '</time></div></div>'
                );
              } else {
                //console.log("Comment Text"+query_username.toUpperCase()+"\n Comment user "+ user.toUpperCase()+"\n Reply Case");
                $('#' + previous_commentid).append(
                  '<div class="review-reply" reply-name="' +
                    user +
                    '" id="' +
                    d.toString().trim() +
                    '" onClick="gotoChangeCQ(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ',this);"><header class="text-left"><div class="review-item-c"><div class="' +
                    icon +
                    '"><i class="fa fa-reply" style="padding-right:5px;"></i><i class="fa fa-user"></i> ' +
                    user +
                    '</div></header><div class="comment-post"><' +
                    $(this)[0].tagName +
                    '>' +
                    $(this).text() +
                    ' ' +
                    titleData +
                    '</' +
                    $(this)[0].tagName +
                    '></p><time class="comment-date" datetime="' +
                    d +
                    '"><i class="fa fa-clock-o"></i> ' +
                    dn +
                    '</time></div></div>'
                );
              }
            } else if (this.tagName.toUpperCase() === 'QUERY') {
              if (this.tagName.toUpperCase() === 'COMMENT') {
                icon = 'comment-user-comment';
              }
              if (this.tagName.toUpperCase() === 'QUERY') {
                icon = 'comment-user-query';
              }
              var titleData = $(this).attr('title');
              if (query_username.toUpperCase() === user.toUpperCase()) {
                //console.log("Comment Text"+query_username.toUpperCase()+"\n Comment user "+ user.toUpperCase()+"\n Query Case matches");
                $('.panel-body').append(
                  '<div class="review-item" query-name="' +
                    user +
                    '" id="' +
                    d.toString().trim() +
                    '" onClick="gotoChangeCQ(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ',this);"><header class="text-left"><div class="review-item-c"><div class="' +
                    icon +
                    '"><i class="fa fa-user"></i> ' +
                    user +
                    '</div><div class="acceptreject"><i class="review-comment_update" onClick="updatequery_edit(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" title="Edit Query"></i><i class="review-cancel_query" onClick="deleteCommentQuery(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" title="Delete Query"></i></div></header><div class="comment-post"><' +
                    $(this)[0].tagName +
                    '>' +
                    $(this).text() +
                    ' ' +
                    titleData +
                    '</' +
                    $(this)[0].tagName +
                    '></p><time class="comment-date" datetime="' +
                    d +
                    '"><i class="fa fa-clock-o"></i> ' +
                    dn +
                    '</time></div></div>'
                );
              } else {
                //console.log("Comment Text"+query_username.toUpperCase()+"\n Comment user "+ user.toUpperCase()+"\n Query Case");
                $('.panel-body').append(
                  '<div class="review-item"  query-name="' +
                    user +
                    '" id="' +
                    d.toString().trim() +
                    '" onClick="gotoChangeCQ(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ',this);"><header class="text-left"><div class="review-item-c"><div class="' +
                    icon +
                    '"><i class="fa fa-user"></i> ' +
                    user +
                    '</div><div class="acceptreject"><i class="reply-query" onClick="replyquery(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" aria-hidden="true"></i></div></header><div class="comment-post"><' +
                    $(this)[0].tagName +
                    '>' +
                    $(this).text() +
                    ' ' +
                    titleData +
                    '</' +
                    $(this)[0].tagName +
                    '></p><time class="comment-date" datetime="' +
                    d +
                    '"><i class="fa fa-clock-o"></i> ' +
                    dn +
                    '</time></div></div>'
                );
              }
            } else {
              if (this.tagName.toUpperCase() === 'COMMENT') {
                icon = 'comment-user-comment';
              }
              if (this.tagName.toUpperCase() === 'QUERY') {
                icon = 'comment-user-query';
              }
              var titleData = $(this).attr('title');
              if (query_username.toUpperCase() === user.toUpperCase()) {
                $('.panel-body').append(
                  '<div class="review-item" id="' +
                    d.toString().trim() +
                    '" onClick="gotoChangeCQ(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ',this);"><header class="text-left"><div class="review-item-c"><div class="' +
                    icon +
                    '"><i class="fa fa-user"></i> ' +
                    user +
                    '</div><div class="acceptreject"><i class="review-comment_update" onClick="updateComment_edit(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" title="Edit Comment"></i><i class="review-cancel_query" onClick="deleteCommentQuery(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');" title="Delete Query"></i></div></header><div class="comment-post"><' +
                    $(this)[0].tagName +
                    '>' +
                    $(this).text() +
                    ' ' +
                    titleData +
                    '</' +
                    $(this)[0].tagName +
                    '></p><time class="comment-date" datetime="' +
                    d +
                    '"><i class="fa fa-clock-o"></i> ' +
                    dn +
                    '</time></div></div>'
                );
              } else {
                $('.panel-body').append(
                  '<div class="review-item" id="' +
                    d.toString().trim() +
                    '" onClick="gotoChangeCQ(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ',this);"><header class="text-left"><div class="review-item-c"><div class="' +
                    icon +
                    '"><i class="fa fa-user"></i> ' +
                    user +
                    '</div></header><div class="comment-post"><' +
                    $(this)[0].tagName +
                    '>' +
                    $(this).text() +
                    ' ' +
                    titleData +
                    '</' +
                    $(this)[0].tagName +
                    '></p><time class="comment-date" datetime="' +
                    d +
                    '"><i class="fa fa-clock-o"></i> ' +
                    dn +
                    '</time></div></div>'
                );
              }
            }
          } else if (this.tagName.toUpperCase() === 'SPAN') {
            if (this.hasAttribute('style')) {
              var formatType = '';
              if (
                this.getAttribute('style').toString().includes('font-weight:')
              ) {
                icon = 'comment-user-b';
                formatType = 'B';
              } else if (
                this.getAttribute('style').toString().includes('font-style:')
              ) {
                icon = 'comment-user-i';
                formatType = 'I';
              } else {
                icon = 'comment-user-r trackchange_icon';
              }

              $('.panel-body').append(
                '<div class="review-item" id="' +
                  d.toString().trim() +
                  '" onClick="gotoChange(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ',this);"><header class="text-left"><div class="' +
                  icon +
                  '"><i class="fa fa-user"></i> ' +
                  user +
                  '</div></header><div class="comment-post">' +
                  formatType +
                  ': <' +
                  $(this)[0].tagName +
                  '>' +
                  $(this).text() +
                  '</' +
                  $(this)[0].tagName +
                  '></p><time class="comment-date" datetime="' +
                  d +
                  '"><i class="fa fa-clock-o"></i> ' +
                  dn +
                  '</time></div></div>'
              );
            } else {
              var formatType = '';
              if (this.classList.contains('ins')) {
                icon = 'comment-user-ins';
              } else if (this.classList.contains('del')) {
                icon = 'comment-user-del';
              } else {
                icon = 'comment-user-r trackchange_icon';
              }

              /*
							$(".panel-body").append('<div class="review-item" id="' + d.toString().trim() + '" onClick="gotoChange('+String.fromCharCode(39)+''+ d.toString().trim() +''+String.fromCharCode(39)+',this);"><header class="text-left"><div class="review-item-c"><div class="'+icon+'"><i class="fa fa-user"></i> '+ user +'</div></header><div class="comment-post">' + formatType + ': <' + $(this)[0].tagName + '>'+ $(this).text() + '</' + $(this)[0].tagName + '></p><time class="comment-date" datetime="' + d + '"><i class="fa fa-clock-o"></i> ' + dn + '</time></div></div>');
							*/

              if (query_username.toUpperCase() === user.toUpperCase()) {
                $('.panel-body').append(
                  '<div class="review-item" id="' +
                    d.toString().trim() +
                    '" onClick="gotoChange(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ',this);"><header class="text-left"><div class="review-item-c"><div class="' +
                    icon +
                    '"><i class="fa fa-user"></i> ' +
                    user +
                    '</div><div class="acceptreject"><span class="review-cancel" title="Reject Change" onClick="changereject(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ');"></span><span class="fa fa-clock-o" title="' +
                    dn +
                    '"></span></div></header><div class="comment-post">' +
                    formatType +
                    ': <' +
                    $(this)[0].tagName +
                    '>' +
                    $(this).text() +
                    '</' +
                    $(this)[0].tagName +
                    '></p><time class="comment-date" datetime="' +
                    d +
                    '"><i class="fa fa-clock-o"></i> ' +
                    dn +
                    '</time></div></div>'
                );
              } else {
                $('.panel-body').append(
                  '<div class="review-item" id="' +
                    d.toString().trim() +
                    '" onClick="gotoChange(' +
                    String.fromCharCode(39) +
                    '' +
                    d.toString().trim() +
                    '' +
                    String.fromCharCode(39) +
                    ',this);"><header class="text-left"><div class="review-item-c"><div class="' +
                    icon +
                    '"><i class="fa fa-user"></i> ' +
                    user +
                    '</div></header><div class="comment-post">' +
                    formatType +
                    ': <' +
                    $(this)[0].tagName +
                    '>' +
                    $(this).text() +
                    '</' +
                    $(this)[0].tagName +
                    '></p><time class="comment-date" datetime="' +
                    d +
                    '"><i class="fa fa-clock-o"></i> ' +
                    dn +
                    '</time></div></div>'
                );
              }
            }
          } else if (
            this.tagName.toUpperCase() === 'PARA' ||
            this.tagName.toUpperCase() === 'SECTION1'
          ) {
            /*
							var chaType = $(this).attr("role");
							$(".panel-body").append('<div class="review-item" id="' + d.toString().trim() + '" onClick="gotoChange('+String.fromCharCode(39)+''+ d.toString().trim() +''+String.fromCharCode(39)+',this);"><header class="text-left"><div><i class="fa fa-user"></i> '+ user +'</div></header><div class="comment-post"><i class="fa fa-code" style="color:grey;"></i> Structure Change: ' + chaType + '</p><time class="comment-date" datetime="' + d + '"><i class="fa fa-clock-o"></i> ' + dn + '</time></div></div>');
							*/
          } else {
            //alert("2");
            if (this.tagName.toUpperCase() === 'B') {
              icon = 'comment-user-b';
            }
            if (this.tagName.toUpperCase() === 'I') {
              icon = 'comment-user-i';
            }
            if (this.tagName.toUpperCase() === 'U') {
              icon = 'comment-user-u';
            }
            if (this.tagName.toUpperCase() === 'SUB') {
              icon = 'comment-user-sub';
            }
            if (this.tagName.toUpperCase() === 'SUP') {
              icon = 'comment-user-sup';
            }

            if (icon != '') {
              $('.panel-body').append(
                '<div class="review-item" id="' +
                  d.toString().trim() +
                  '" onClick="gotoChange(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ',this);"><header class="text-left"><div class="' +
                  icon +
                  '"><i class="fa fa-user"></i> ' +
                  user +
                  '</div></header><div class="comment-post"><i class="fa fa-paint-brush" style="color:grey;"></i> ' +
                  $(this)[0].tagName +
                  ': <' +
                  $(this)[0].tagName +
                  '>' +
                  $(this).text() +
                  '</' +
                  $(this)[0].tagName +
                  '></p><time class="comment-date" datetime="' +
                  d +
                  '"><i class="fa fa-clock-o"></i> ' +
                  dn +
                  '</time></div></div>'
              );
            }
          }
        }
      }
      asSame = d;
    });

    $('.panel .found').contents().unwrap();
  }
}

function updatedRevisionsId(id) {
  var ele = document.getElementById('id');
  updatedRevisions(ele);
}

updatedRevisions = (lastContent) => {
  var newUpdatedData = lastContent;
  if (!!newUpdatedData) {
    $('#content [data-time]').removeClass('add-highlights');
    if (newUpdatedData.childNodes.length > 1) {
      if (newUpdatedData.childNodes[1].nodeName != '#text')
        newUpdatedData = newUpdatedData.childNodes[1];
    }
    var trackId = $(newUpdatedData).attr('data-time');
    scrollToLastTrack(trackId);
  }
};

function rejectLangCorrection(rejId, accId) {
  var text = $("#content .del[data-time='" + rejId + "']").text();
  $("#content .del[data-time='" + rejId + "']").text(text);
  $("#content .del[data-time='" + rejId + "']")
    .contents()
    .unwrap();
  $("#content .ins[data-time='" + accId + "']").remove();
  $('[lang-id="' + rejId + '"]').remove();
  $('#' + rejId).remove();
  $('#' + accId).remove();
}

function acceptLangCorrection(rejId, accId) {
  $("#content .del[data-time='" + rejId + "']").remove();
  $("#content .ins[data-time='" + accId + "']")
    .contents()
    .unwrap();
  $('[lang-id="' + rejId + '"]').remove();
  $('#' + rejId).remove();
  $('#' + accId).remove();
}

scrollToLastTrack = (id) => {
  $('.track-changes-list .track-list').removeClass('add-highlights');
  $('.track-changes-list').scrollTop(0);
  var trackedLen = $('.track-changes-list #' + id).length;
  if (trackedLen == 1) {
    var trackedTopPos = $('.track-changes-list #' + id).offset().top;
    $('.track-changes-list #' + id).addClass('add-highlights');
    if (trackedTopPos > 202)
      $('.track-changes-list').scrollTop(trackedTopPos - 202);
  }
};

scrollToViewContent = (id, dataTimeId) => {
  $('#content [data-time]').removeClass('add-highlights');
  $('.track-changes-list .track-list').removeClass('add-highlights');
  $('#' + id).addClass('add-highlights');
  var xmlContentScrollTop = $('#textbody').scrollTop();
  var extraHeight = 127.5;
  if (id != '' && dataTimeId) {
    var selectContentPosTop = $('#content [data-time="' + id + '"]').offset();
    if (selectContentPosTop !== undefined) {
      selectContentPosTop = $('#content [data-time="' + id + '"]').offset().top;
      $('#textbody').scrollTop(
        selectContentPosTop + xmlContentScrollTop - extraHeight
      );
      if (
        $('#content [data-time="' + id + '"]').attr('status') !== 'marks-done'
      )
        $('#content [data-time="' + id + '"]').addClass('add-highlights');
    }
  } else if (id != '') {
    var selectContentPosTop = $('#content #' + id).offset();
    if (selectContentPosTop !== undefined) {
      selectContentPosTop = $('#content #' + id).offset().top;
      $('#textbody').scrollTop(
        selectContentPosTop + xmlContentScrollTop - extraHeight
      );
      $('#' + id).addClass('add-highlights');
    }
  } else return;
};

scrollToGrammer2 = (id) => {
  $('#content [data-time]').removeClass('add-highlights');
  $("#content [store='" + id + "']").removeClass('add-highlights');
  var xmlContentScrollTop = $('#textbody').scrollTop();
  var extraHeight = 127.5;
  var selectContentPosTop = $("#content [store='" + id + "']").offset();
  if (selectContentPosTop !== undefined) {
    selectContentPosTop = $("#content [store='" + id + "']").offset().top;
    $('#textbody').scrollTop(
      selectContentPosTop + xmlContentScrollTop - extraHeight
    );
    $("#content [store='" + id + "']").addClass('add-highlights');
  } else return;
};

function changeReject(id, yesAll) {
  trackAcceptRejectAct('Reject', id);
  var localdata_set = $('.localstorevalue').val();
  let currentSelector = $('#content [data-time="' + id + '"]');
  if (!!currentSelector) {
    storedata(localdata_set, 'EK');
    // const wrapper = mount(<VxePdfEditor />);
    // expect(wrapper.find("[data-time='"+id+"']").hasClass('del')).to.equal(true);

    if ($("#content [data-time='" + id + "']").hasClass('del'))
      $("#content .del[data-time='" + id + "']")
        .contents()
        .unwrap();
    else if ($("#content [data-time='" + id + "']").hasClass('ins'))
      $("#content .ins[data-time='" + id + "']").remove();
    else if (
      $("#content [data-time='" + id + "']").attr('prev_role') !== undefined &&
      $("#content [data-time='" + id + "']").attr('prev_role') !== ''
    )
      rejectHeader(id);
    else if (
      currentSelector !== undefined &&
      currentSelector !== null &&
      currentSelector.tagName === 'IMAGEOBJECT'
    ) {
      // Reject Equation Change
      currentSelector.remove();
      currentSelector.removeAttribute('data-time');
    } else {
      var selEle = $("#content [data-time='" + id + "']");
      if ($("#content [data-time='" + id + "']").prop('tagName') === 'TABLE1')
        $("#content table1[data-time='" + id + "']").remove();
      else if (
        selEle.prop('tagName') === 'BOLD' &&
        selEle.prop('tagName') === 'ITALIC' &&
        selEle.prop('tagName') === 'UNDERLINE' &&
        selEle.prop('tagName') === 'SUB' &&
        selEle.prop('tagName') === 'SUP'
      )
        $("#content [data-time='" + id + "']")
          .contents()
          .unwrap();
      else if (
        $("#content [data-time='" + id + "']").length > 0 &&
        $("#content [data-time='" + id + "']").prop('tagName') === 'FIGURE1'
      )
        $("#content figure1[data-time='" + id + "']").remove();
      else if ($("#content [data-time='" + id + "']").length > 0) {
        var trackTagName = $("#content [data-time='" + id + "']")
          .prop('tagName')
          .toLowerCase();

        var tagNameTxt = $("#content [data-time='" + id + "']").prop('tagName');
        var elementChildren = $("#content [data-time='" + id + "']").children();
        var elementChildrenLen = elementChildren.length;

        if (
          ((tagNameTxt === 'SECTION1' ||
            tagNameTxt === 'UL' ||
            tagNameTxt === 'OL' ||
            tagNameTxt === 'SIDEBAR' ||
            tagNameTxt === 'BOXED-TEXT' ||
            tagNameTxt === 'EPIGRAPH' ||
            tagNameTxt === 'BLOCKQUOTE' ||
            tagNameTxt === 'EXAMPLE') &&
            elementChildrenLen > 0) ||
          (tagNameTxt === 'SOURCE1' && role === 'new-element')
        ) {
          $('#content ' + trackTagName + "[data-time='" + id + "']").remove();
        }

        if (trackTagName !== 'comment' && trackTagName !== 'query') {
          $('#content ' + trackTagName + "[data-time='" + id + "']")
            .contents()
            .unwrap();
        }
      }
    }

    var html_count = $('#content').text().length;
    $('#character_count').val(html_count);
    var msg = 'changeReject';
    var msg = 'change element reject';
    if (yesAll) {
      //Skip auto save
    } else {
      autosavefunction_vxe(msg);
    }
  }
}

function rejectHeader(id) {
  var rejElement = $("#content [data-time='" + id + "']").length;
  if (rejElement > 0) {
    var affnodeas = $("#content [data-time='" + id + "']")[0];
    var selected_tagName = affnodeas.tagName;
    if (selected_tagName == 'SEC') {
      var previous_val = affnodeas.getAttribute('prev_role');
      affnodeas.setAttribute('sec-type', previous_val);
      affnodeas.setAttribute('title', previous_val);
      $("#content [data-time='" + id + "']").removeAttr('data-date');
      $("#content [data-time='" + id + "']").removeAttr('prev_role');
      $("#content [data-time='" + id + "']").removeAttr('data-time');
    }
  }
}

trackAcceptRejectAct = (actionType, id) => {
  let userName = document.getElementById('username').value;
  let contentOwner = $('#content [data-time="' + id + '"]').attr(
    'data-username'
  );
  if (userName !== contentOwner) {
    let trackContent = $('.track-list#' + id + ' .modified-txt').text();
    if (trackContent.length > 30) {
      trackContent = trackContent.slice(0, 30);
      trackContent = trackContent + '...';
    }
    let actionVal =
      actionType +
      '---Current User: ' +
      userName +
      '---Owner of content: ' +
      contentOwner +
      '---Track changes data: ' +
      trackContent;
    window.browser_details(actionVal);
  }
};

function changeAccept(id, yesAll) {
  trackAcceptRejectAct('Accept', id);
  let currentSelector = document.querySelector(
    '#content [data-time="' + id + '"]'
  );
  if ($("#content [data-time='" + id + "']").hasClass('del')) {
    $("#content .del[data-time='" + id + "']").remove();
  } else if ($("#content [data-time='" + id + "']").hasClass('ins')) {
    $("#content .ins[data-time='" + id + "']")
      .contents()
      .unwrap();
  } else if (
    $("#content [data-time='" + id + "']").attr('prev_role') !== undefined &&
    $("#content [data-time='" + id + "']").attr('prev_role') !== ''
  ) {
    $("#content [data-time='" + id + "']").removeAttr('data-username');
    $("#content [data-time='" + id + "']").removeAttr('data-date');
    $("#content [data-time='" + id + "']").removeAttr('prev_role');
    $("#content [data-time='" + id + "']").removeAttr('data-time');
  } else if (currentSelector.tagName === 'IMAGEOBJECT') {
    // Accept Equation Change
    if (currentSelector.className === 'math_figold') {
      if (currentSelector.nextElementSibling != null)
        currentSelector.nextElementSibling.remove();
      currentSelector.removeAttribute('data-time');
    } else if (currentSelector.className === 'math_fignew') {
      if (currentSelector.previousElementSibling != null)
        currentSelector.previousElementSibling.remove();
      currentSelector.removeAttribute('data-time');
    }
  } else if (
    $("#content [data-time='" + id + "']").prop('tagName') != undefined
  ) {
    var trackTagName = $("#content [data-time='" + id + "']")
      .prop('tagName')
      .toLowerCase();
    if (trackTagName !== 'comment' && trackTagName !== 'query') {
      $('#content ' + trackTagName + "[data-time='" + id + "']").removeAttr(
        'data-username'
      );
      $('#content ' + trackTagName + "[data-time='" + id + "']").removeAttr(
        'data-time'
      );
    }
  }
  var msg = 'changeAccept';
  if (yesAll) {
    // autosavefunction_vxe(msg);
  } else {
    autosavefunction_vxe(msg);
  }
}

undoFmChanges = (e) => {
  window.EditorTools.state.undoTriggered = true;
  e.preventDefault();
  let undoBackup = document.getElementById('store-fm-undo');
  if (undoBackup.children.length > 0) {
    let getLastChildHtml = undoBackup.lastElementChild.innerHTML;
    let getLastChild = undoBackup.lastElementChild;
    let getFocusField = $(window.getSelection().focusNode).closest(
      '.form-control'
    );
    getFocusField = $(getFocusField).attr('data-storeid');
    beforeRedoFm(document.getElementById('form_fm').innerHTML);
    document.getElementById('form_fm').innerHTML = getLastChildHtml;
    getLastChild.remove();
    fmSetCur(getFocusField);
  }
};

redoFmChanges = (e) => {
  e.preventDefault();
  let redoBackup = document.getElementById('store-fm-redo');
  if (redoBackup.children.length > 0) {
    let getLastChildHtml = redoBackup.lastElementChild.innerHTML;
    let getLastChild = redoBackup.lastElementChild;
    let getFocusField = $(window.getSelection().focusNode).closest(
      '.form-control'
    );
    // beforeRedoFm(getLastChildHtml);
    getFocusField = $(getFocusField).attr('data-storeid');
    document.getElementById('form_fm').innerHTML = getLastChildHtml;
    getLastChild.remove();
    fmSetCur(getFocusField);
  }
};

fmSetCur = (getFocusField) => {
  var el = document.querySelector(
    '.form-control[data-storeid="' + getFocusField + '"]'
  );
  var range = document.createRange();
  var sel = window.getSelection();
  range.setStart(el, 0);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  el.focus();
  $(getFocusField).removeClass('tempClass');
  return true;
};

storeFmData = () => {
  let fmChangesCount = document.getElementById('fmChangesCount').value;
  var increment_local = 1;
  var totalvalue = +increment_local + +fmChangesCount;
  document.getElementById('fmChangesCount').value = totalvalue;
  let fmPopupHtml = document.getElementById('form_fm').innerHTML;
  $('#store-fm-undo').append(
    "<div id='fm-store-" + totalvalue + "'>" + fmPopupHtml + '</div>'
  );
};

beforeRedoFm = (undoData) => {
  let redoCount = document.getElementById('fmUndoChangesCount').value;
  let increment_local = 1;
  let totalvalue = +increment_local + +redoCount;
  document.getElementById('fmUndoChangesCount').value = totalvalue;
  $('#store-fm-redo').append(
    "<div id='fm-redo-" + totalvalue + "'>" + undoData + '</div>'
  );
};

function storeData(localdata_set, enter_key) {
  var offset_values = $('.localstorevalue').val();
  var increment_local = 1;
  var totalvalue = +increment_local + +localdata_set;
  $('.localstorevalue').val(totalvalue);
  $('.localstoregetvalue').val(totalvalue);

  $('.limitforredovalue').val(totalvalue);
  // $('.fa-undo').css("pointer-events","");
  // $('.fa-undo').css("opacity","");

  var parentEl = null,
    sel;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      parentEl = sel.getRangeAt(0).commonAncestorContainer;
      if (parentEl.nodeType != 1) parentEl = parentEl.parentNode;
    }
  } else if ((sel = document.selection) && sel.type != 'Control')
    parentEl = sel.createRange().parentElement();

  if (enter_key === 'EK') {
    var parent_id = $('chapter').attr('store');
    if (parent_id != null) {
      var getdata = $('#content [store =' + parent_id + ']').html();
      var tag_name = 'chapter';
      $('.storelocal_data').append(
        '<' +
          tag_name +
          ' role=' +
          parent_id +
          '>' +
          getdata +
          '</' +
          tag_name +
          '>'
      );
    }
  } else if (parentEl != null) {
    var span_tag = parentEl.tagName;
    var tag_name, parent_id, getdata;
    if (
      span_tag === 'SPAN' ||
      span_tag === 'I' ||
      span_tag === 'B' ||
      span_tag === 'U' ||
      span_tag === 'DIV'
    ) {
      tag_name = parentEl.parentNode.tagName;
      parent_id = parentEl.parentNode.getAttribute('store');
      getdata = parentEl.parentElement.innerHTML;
    } else {
      tag_name = parentEl.tagName;
      parent_id = parentEl.getAttribute('store');
      getdata = parentEl.innerHTML;
    }
    if (parent_id != null)
      $('.storelocal_data').append(
        '<' +
          tag_name +
          ' role=' +
          parent_id +
          '>' +
          getdata +
          '</' +
          tag_name +
          '>'
      );

    return parentEl;
  }
}

figuredelete = () => {
  var figureList = document.getElementById('figurelist_del');
  figureList.innerHTML = '';
  var contentElement = document.getElementById('content');
  var figureEle = contentElement.querySelectorAll("fig[position='float']"),
    i;
  if (figureEle.length > 0) {
    figureList.innerHTML = "<ol class='fig-del-list' id='fig-del-ol'></ol>";
    var deleteStatus = 0;
    var liElement = '';
    for (i = 0; i < figureEle.length; ++i) {
      var element = figureEle[i];
      var parentTagname = element.parentElement.tagName;
      var deleteClass = '';
      if (parentTagname === 'SPAN') {
        deleteClass = element.parentElement.getAttribute('class');
      }
      var storeId = element.getAttribute('store');
      var labelElement = element.querySelector('label1');
      var labelRemoveEle = labelElement.querySelectorAll(
          'query,span.del,comment,span.sr-only'
        ),
        j;
      if (labelRemoveEle.length > 0) {
        for (j = 0; j < labelRemoveEle.length; ++j) {
          labelRemoveEle[j].remove();
        }
      }
      var figName = labelElement.innerText;
      if (deleteClass === '' || deleteClass !== 'del cts-1') {
        deleteStatus = 1;
        liElement +=
          '<li>' +
          figName +
          '<a style="float:right;" onclick="deletefig(\'' +
          storeId +
          '\');" ><i class="material-icons deleteIcon">close</i></a></li>';
      }
    }
    var liList = document.getElementById('fig-del-ol');
    liList.innerHTML = liElement;
    if (deleteStatus === 0) {
      figureList.innerHTML = 'No figures are present in this Article';
    }
  } else {
    figureList.innerHTML = 'No figures are present in this Article';
  }
  $('#deleteFigure').modal('show');
};

function deletefig(figure_id) {
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set, 'EK');
  var d = new Date();
  var dt_first = Date.parse(d);
  var userName_first = $('#username').val();
  var fig_id = $("#content [store='" + figure_id + "']").attr('id');
  $("#content xref[rid='" + fig_id + "']").wrap(
    '<span class="del cts-1" contenteditable="false" data-username="' +
      userName_first +
      '" data-time="' +
      dt_first +
      '_delcit" del-role="fig"></span>'
  );
  $("#content [store='" + figure_id + "']").wrap(
    '<span class="del cts-1" contenteditable="false" data-username="' +
      userName_first +
      '" data-time="' +
      dt_first +
      '_del" del-role="fig"></span>'
  );
  figure_rearrange(fig_id, '');
  $('#deleteFigure').modal('hide');
  var msg = 'deleteFigure';
  autosavefunction_vxe(msg);
}

function separateSubTag(id, tagName, affnode) {
  tagName = tagName.toLowerCase();
  var parentTag = $(
    '#content ' + tagName + '[data-time="' + id + '"]'
  ).parent();
  var parentUserName = parentTag.attr('data-username');
  var subTagContentLen = $(
    '#content ' + tagName + '[data-time="' + id + '"]'
  ).text().length;
  var newId = id - 1;
  var newId2 = newId - 2;
  var closeTag = '</span>';
  var openTag =
    "<span class='ins cts-1' data-user='current-user' data-username='" +
    parentUserName +
    "' data-time='" +
    newId +
    "' contenteditable='true' title=''>";
  var openTag2 =
    "<span class='ins cts-1' data-user='current-user' data-username='" +
    parentUserName +
    "' data-time='" +
    newId2 +
    "' contenteditable='true' title=''>";
  var parentHtml = parentTag.html();
  var firstCharacters = parentHtml.split('<')[0];
  var lastCharLen = parentHtml.split('>').length;
  var lastCharacters = parentHtml.split('>')[lastCharLen - 1];
  var subTagHtml = affnode.outerHTML;
  if (firstCharacters === '' && lastCharacters === '') {
    parentTag.remove();
    parentTag.after(openTag + subTagHtml + closeTag);
  } else if (lastCharacters === '') {
    parentTag.html(firstCharacters);
    parentTag.after(openTag + subTagHtml + closeTag);
  } else if (firstCharacters === '') {
    parentTag.remove();
    parentTag.after(
      openTag + subTagHtml + closeTag + openTag2 + lastCharacters + closeTag
    );
  } else {
    parentTag.html(firstCharacters);
    parentTag.after(
      openTag + subTagHtml + closeTag + openTag2 + lastCharacters + closeTag
    );
  }
  setCursorPointer(id, tagName, subTagContentLen);
}

function setCursorPointer(id, tagName, subTagContentLen) {
  var range = document.createRange();
  var sel = window.getSelection();
  var el = document.querySelector(
    '#content ' + tagName + '[data-time="' + id + '"]'
  );
  range.setStart(el.childNodes[0], subTagContentLen);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  el.focus();
  return true;
}
$('#tableModal').on('hidden.bs.modal', function () {
  var tableinsert_flag = $('#tableinsert_flag').val();
  if (tableinsert_flag === '1') {
    var tableID = $('#tableinsert_id').val();
    if (tableID !== '') {
      table_close(tableID);
    }
  }
});
$('#figureModal').on('hidden.bs.modal', function () {
  var figureinsert_flag = $('#figureinsert_flag').val();
  if (figureinsert_flag === '1') {
    var figureID = $('#figureinsert_id').val();
    if (figureID !== '') {
      figure_close(figureID);
    }
  }
});
function table_close(close_id) {
  let id = '[rid="' + close_id + '"]';
  removeLink(id);
}

removeLink = (id) => {
  let contentelement = document.getElementById('content');
  let linkEle = contentelement.querySelector(id);
  if (!!linkEle) {
    let parentEle = linkEle.parentElement;
    let linkIcon = parentEle.querySelector('span.refIcon');
    if (!!linkIcon) {
      linkIcon.remove();
      $(linkEle).contents().unwrap();
    }
  }
};

function figure_close(close_id) {
  let id = '[rid="' + close_id + '"]';
  removeLink(id);
}
function reference_insert() {
  $('#reference_submission').show();
  $('#add_reference').addClass('hide');
  var d = new Date();
  var dt = Date.parse(d);
  var userName = $('#username').val();
  $('.confirm').css({ 'margin-left': '0px', 'margin-left': '26px' });
  var affnodeas = getSelectedNode();
  $('#referenceContent').removeClass('hide');
  $('#referenceText').addClass('hide');
  if (findAncestor(affnodeas, 'pdf-editor')) {
    var parentEl = null,
      sel;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.rangeCount) {
        parentEl = sel.getRangeAt(0).commonAncestorContainer;
        if (parentEl.nodeType != 1) {
          parentEl = parentEl.parentNode;
        }
      }
    } else if ((sel = document.selection) && sel.type != 'Control') {
      parentEl = sel.createRange().parentElement();
    }
    var tag_name = parentEl.tagName;
    var storeid = parentEl.getAttribute('store');
    if (storeid == null) {
      var storeid = parentEl.parentNode.getAttribute('store');
    }
    var store_id = $("#content [store='" + storeid + "']")
      .parents('ref')
      .attr('store');
    var refElement = affnodeas.closest('ref');
    if (refElement !== null) {
      store_id = affnodeas.closest('ref').getAttribute('store');
    }
    var affnodeasTag = parentEl.tagName;
    var parentTagName = parentEl.parentElement.tagName;
    if (affnodeasTag === 'TITLE1' && parentTagName === 'REF-LIST') {
      store_id = parentEl.getAttribute('store');
    }
    $('#refTypeSection').addClass('hide');
    $('#reference_div').html('');
    if (store_id !== null && store_id !== undefined) {
      $('#reference_submission').attr(
        'onClick',
        "reference_submission('" + store_id + "');"
      );
      $('#referenceModal').modal('show');
      $('#reference_div').focus();
    } else {
      var newref = $('#content ref-list').length;
      if (newref === 0) {
        $('#referenceModal').modal('show');
        $('#refTypeSection').removeClass('hide');
        $('#referenceContent').removeClass('hide');
        $('input.refType').prop('checked', false);
        $('#reference_submission').attr(
          'onClick',
          "reference_submission('New')"
        );
      }
    }
  } else {
    $('#referenceModal').modal('show');
    $('#referenceContent').addClass('hide');
    $('#referenceText').removeClass('hide');
    $('#referenceText').html(
      '<center><h2>Warning!</h2><span>Please place the cursor inside the editor.</span></center>'
    );
  }
}

function reference_submission(store_id) {
  var reference_text = $('#reference_div').text();
  let dragIcon =
    '<i class="material-icons-outlined ref-drag ui-sortable-handle" title="Reorder" spellcheck="false">drag_indicator</i>';
  if (reference_text !== '') {
    $('#reference_submission').hide();
    var localdata_set = $('.localstorevalue').val();
    storedata(localdata_set, 'EK');
    $('#lock').val('true');
    var d = new Date();
    var dt = Date.parse(d);
    var userName = $('#username').val();
    const userId = $('#userid').val();
    var spanTag = 'SPAN';
    var delTag = 'del cts-1';
    if (store_id !== 'New') {
      var preRef = $("#content [store='" + store_id + "']").prevAll(
        'ref:not(.reference_deleted)'
      )[0];
      var curRef = $("#content [store='" + store_id + "']")[0];
      var first_val = 0;
      var curdeleteClass = '';
      if (curRef !== null) {
        var refChildLength = curRef.children.length;
        if (refChildLength === 1) {
          var deleteSpan = curRef.children[0].tagName;
          if (deleteSpan === spanTag) {
            curdeleteClass = curRef.children[0].getAttribute('class');
          }
        }
      }
      var label_ref = $(curRef).find('label1').attr('label_ref');
      if (
        curdeleteClass !== '' &&
        curdeleteClass === delTag &&
        preRef !== null &&
        preRef !== undefined
      ) {
        label_ref = $(preRef).find('label1').attr('label_ref');
        curRef = preRef;
      }
      if (label_ref != undefined) {
        first_val = label_ref;
      } else {
        var label_value = $(curRef).find('label1').text();
        var data_split = label_value.split('.');
        first_val = data_split[0];
      }
      if (
        curdeleteClass !== '' &&
        curdeleteClass === delTag &&
        preRef === undefined
      ) {
        first_val = 0;
      }
      var label_val = +first_val + +1;
      $('#reference_div *').removeAttr('style');
      $('#reference_div *').removeAttr('spellcheck');
      var bib_length = $('#content ref').length;
      var bibliomixed_length = bib_length + 1;
      let referenceDigit = referenceId(bibliomixed_length);
      let refDynamicId = 'CIT' + referenceDigit;
      $("#content [store='" + store_id + "']").after(
        '<ref id="' +
          refDynamicId +
          '" store="' +
          dt +
          '_ref" contenteditable="true" class="new_referenceadded">' +
          dragIcon +
          '<label1 contenteditable="true" label_ref="' +
          label_val +
          '"><span class="ins cts-1" data-cid="2" contenteditable="true" data-userid=' +
          userId +
          ' data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_ref' +
          label_val +
          '">' +
          label_val +
          '.</span>&nbsp;</label1><span class="ins cts-1" data-cid="2" contenteditable="true" data-userid=' +
          userId +
          ' data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_text' +
          label_val +
          '"><mixed-citation publication-type="journal" contenteditable="true" store="' +
          dt +
          '_cit">' +
          reference_text +
          '</mixed-citation></span></ref>'
      );
      reference_text = reference_text.replace(/(\r\n|\n|\r)/gm, ' ');
      var xmlid_val = refDynamicId;
      var match_attr = 0;
      $('#content ref').each(function () {
        var xmlid = $(this).attr('id');
        var label_ref = $(this).find('label1').attr('label_ref');
        if (label_ref !== undefined && label_ref !== null) {
          var old_refno = label_ref;
        } else {
          var label_text = $(this).find('label1').text();
          var data_splits = label_text.split('.');
          var old_refno = data_splits[0];
        }
        var new_ref = +old_refno + +1;
        if (xmlid == xmlid_val || match_attr == 1) {
          if (match_attr == 1) {
            $(this).find('label1').attr('label_ref', new_ref);
            $(this)
              .find('label1')
              .html(
                '<span class="del cts-1" data-cid="2" data-userid=' +
                  userId +
                  ' contenteditable="false" data-username="' +
                  userName +
                  '" data-time="' +
                  dt +
                  '_d' +
                  old_refno +
                  '">' +
                  old_refno +
                  '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
                  userId +
                  ' data-username="' +
                  userName +
                  '" data-time="' +
                  dt +
                  '_i' +
                  new_ref +
                  '">' +
                  new_ref +
                  '.</span> '
              );
            var rid_link = xmlid.replace(/\CIT[0]*/g, '');
            $("#content [rid*='" + xmlid + "']").each(function () {
              reference_num_add(this, dt, label_val, old_refno, new_ref);
            });
          }
          match_attr = 1;
        }
      });
      loaderStart();
      $.ajax({
        type: 'POST',
        url: api_url + '/VXE/referenceoxytech',
        data: { reference_text: reference_text },
        beforeSend: function () {
          // loadajaxsucessmsg();
        },
        success: function (response) {
          $('#reference_request').html('');
          $('#reference_xslt').html('');
          $('#reference_request').html(response.result);
          var reference_request = $('#reference_request')
            .find('structured')
            .html();
          if (reference_request !== undefined) {
            var reference_type = $('#reference_request')
              .find('structured')
              .attr('type');
            $('#reference_xslt').html(
              '<structured id="1">' + reference_request + '</structured>'
            );
            var push_xslt = $('#reference_xslt').html();
            $.ajax({
              type: 'POST',
              url: api_url + '/VXE/referencexsltjournals',
              data: { push_xslt: push_xslt },
              //async: false,
              success: function (data) {
                data = data.result;
                var str = $.trim(data);
                var returnedData = str.replace(
                  '<?xml version="1.0" encoding="UTF-8"?>',
                  ''
                );
                $('#reference_xsltget').html('');
                $('#reference_xsltget').html(returnedData);
                if (reference_type !== undefined) {
                  $('#reference_xsltget').removeAttr('style');
                  reference_type = reference_type.replace(/\\"/g, '');
                  $('#reference_xsltget')
                    .find('mixed-citation')
                    .attr('publication-type', reference_type);
                  var idt = 1;
                  $('#reference_xsltget *').each(function () {
                    $(this).attr('store', dt + '_' + idt);
                    idt = idt + 1;
                  });
                  var reference_xsltget = $('#reference_xsltget')
                    .find('mixed-citation')
                    .html();
                  reference_xsltget = reference_xsltget.replace(/\\n/g, ' ');
                  var hideClass = '';
                  var listofComment = getAllComments($('#content ref-list')[0]);
                  if (listofComment.length === 0) {
                    $("#content [store='" + dt + "_ref']").html(
                      '<ref id="' +
                        refDynamicId +
                        '" store="' +
                        dt +
                        '_refget" contenteditable="true" class="new_referenceadded">' +
                        dragIcon +
                        '<label1 contenteditable="true" label_ref="' +
                        label_val +
                        '"><span class="ins cts-1 ' +
                        hideClass +
                        '" data-cid="2" contenteditable="true" data-userid=' +
                        userId +
                        ' data-username="' +
                        userName +
                        '" data-time="' +
                        dt +
                        '_ref' +
                        label_val +
                        '">' +
                        label_val +
                        '.</span>&nbsp;</label1><span class="ins cts-1" data-cid="2" contenteditable="true" data-ref="newref" data-username="' +
                        userName +
                        '" store="' +
                        dt +
                        '_refins" data-time="' +
                        dt +
                        '_text' +
                        label_val +
                        '"><mixed-citation publication-type="' +
                        reference_type +
                        '" store="' +
                        dt +
                        '_citation">' +
                        reference_xsltget +
                        '</mixed-citation></span></ref>'
                    );
                  } else {
                    $("#content [store='" + dt + "_ref']").html(
                      '<ref id="' +
                        refDynamicId +
                        '" store="' +
                        dt +
                        '_refget" contenteditable="true" class="new_referenceadded">' +
                        dragIcon +
                        '<!--<label1 contenteditable="true" label_ref="' +
                        label_val +
                        '">' +
                        label_val +
                        '.&nbsp;</label1>--><span class="ins cts-1" data-cid="2" contenteditable="true" data-ref="newref" data-username="' +
                        userName +
                        '" store="' +
                        dt +
                        '_refins" data-time="' +
                        dt +
                        '_text' +
                        label_val +
                        '"><mixed-citation publication-type="' +
                        reference_type +
                        '" store="' +
                        dt +
                        '_citation">' +
                        reference_xsltget +
                        '</mixed-citation></span></ref>'
                    );
                  }
                  $("#content [store='" + dt + "_refget']").unwrap();
                }
                var msg = reference_text + ' - reference inserted.';
                let element = document.querySelector(
                  "#content [store='" + dt + "_refget']"
                );
                let editRefPer = validateVxePermission(
                  'basic_features',
                  'ref_color_edit'
                );
                if (!!element && editRefPer) {
                  $('#colorRef').removeClass('hide');
                  $("#content [store='" + dt + "_refget'] .ref-drag").remove();
                  $("#content [data-time='" + dt + '_text' + label_val + "']")
                    .contents()
                    .unwrap();
                  window.Journals.colorSingleRef(element, dt);
                  $("#content [store='" + dt + "_refget']").prepend(dragIcon);
                  $('#colorRef').addClass('hide');
                }
                $('#referenceText').removeClass('hide');
                $('#referenceContent').addClass('hide');
                $('#referenceText').html(
                  '<center><h2>Note!</h2><span>Please give citation text for newly inserted reference &  link using right click "reference link" option.</span></center>'
                );
                loaderStop();
                var autoSave = autosavefunction_vxe(msg);
              },
            });
          } else {
            loaderStop();
            $("#content [store='" + dt + "_ref']").remove();
            $('#referenceText').removeClass('hide');
            $('#referenceContent').addClass('hide');
            $('#referenceText').html(
              '<center><h2>Warning!</h2><span>Error has been thrown from Oxytech.</span></center>'
            );
          }
        },
      });
    } else {
      var checkValue = $('.refType:checked').val();
      $('#content article').append(
        '<ref-list store="' +
          dt +
          '-list" contenteditable="true" class="" title="BIBLIOGRAPHY"><title1 store="' +
          dt +
          '_reftitlte" contenteditable="true" class="hidden_para" title="TITLE">References</title1><ref id="CIT00001" store="' +
          dt +
          '_ref" contenteditable="true" class="new_referenceadded">' +
          dragIcon +
          '<label1 contenteditable="true" label_ref="1"><span class="ins cts-1" data-cid="2" contenteditable="true" data-userid=' +
          userId +
          ' data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_ref1">1.</span>&nbsp;</label1><mixed-citation publication-type="journal" contenteditable="true" store="' +
          dt +
          '_cit"><span class="ins cts-1" data-cid="2" contenteditable="true" data-userid=' +
          userId +
          ' data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_text1">' +
          reference_text +
          '</span></mixed-citation></ref></ref-list>'
      );
      reference_text = reference_text.replace(/(\r\n|\n|\r)/gm, ' ');
      $.ajax({
        type: 'POST',
        url: api_url + '/VXE/referenceoxytech',
        data: { reference_text: reference_text },
        beforeSend: function () {
          // loadajaxsucessmsg();
        },
        success: function (response) {
          $('#reference_request').html('');
          $('#reference_xslt').html('');
          $('#reference_request').html(response.result);
          var reference_request = $('#reference_request')
            .find('structured')
            .html();
          if (reference_request !== undefined) {
            var reference_type = $('#reference_request')
              .find('structured')
              .attr('type');
            $('#reference_xslt').html(
              '<structured id="1">' + reference_request + '</structured>'
            );
            var push_xslt = $('#reference_xslt').html();
            $.ajax({
              type: 'POST',
              url: api_url + '/VXE/referencexsltjournals',
              data: { push_xslt: push_xslt },
              //async: false,
              success: function (data) {
                data = data.result;
                var str = $.trim(data);
                var returnedData = str.replace(
                  '<?xml version="1.0" encoding="UTF-8"?>',
                  ''
                );
                $('#reference_xsltget').html('');
                $('#reference_xsltget').html(returnedData);
                if (reference_type !== undefined) {
                  $('#reference_xsltget').removeAttr('style');
                  reference_type = reference_type.replace(/\\"/g, '');
                  $('#reference_xsltget')
                    .find('mixed-citation')
                    .attr('publication-type', reference_type);
                  var idt = 1;
                  $('#reference_xsltget *').each(function () {
                    $(this).attr('store', dt + '_' + idt);
                    idt = idt + 1;
                  });
                  var reference_xsltget = $('#reference_xsltget')
                    .find('mixed-citation')
                    .html();
                  reference_xsltget = reference_xsltget.replace(/\\n/g, ' ');
                  var hideClass = '';
                  if (checkValue !== 'Type1') {
                    hideClass = 'hide';
                  }
                  $("#content [store='" + dt + "_ref']").html(
                    '<ref id="CIT00001" store="' +
                      dt +
                      '_refget" contenteditable="true" class="new_referenceadded">' +
                      dragIcon +
                      '<label1 contenteditable="true" label_ref="1"><span class="ins cts-1 ' +
                      hideClass +
                      '" data-cid="2" contenteditable="true" data-userid=' +
                      userId +
                      ' data-username="' +
                      userName +
                      '" data-time="' +
                      dt +
                      '_ref1">1.</span>&nbsp;</label1><mixed-citation publication-type="' +
                      reference_type +
                      '" store="' +
                      dt +
                      '_citation"><span class="ins cts-1" data-cid="2" contenteditable="true" data-ref="newref" data-username="' +
                      userName +
                      '" store="' +
                      dt +
                      '_refins" data-time="' +
                      dt +
                      '_text1">' +
                      reference_xsltget +
                      '</span></mixed-citation></ref>'
                  );
                  $("#content [store='" + dt + "_refget']").unwrap();
                }
                let element = document.querySelector(
                  "#content [store='" + dt + "_refget']"
                );
                let editRefPer = validateVxePermission(
                  'basic_features',
                  'ref_color_edit'
                );
                if (!!element && editRefPer) {
                  $('#colorRef').removeClass('hide');
                  $("#content [store='" + dt + "_refget'] .ref-drag").remove();
                  window.Journals.colorSingleRef(element, dt);
                  $("#content [store='" + dt + "_refget']").prepend(dragIcon);
                  $('#colorRef').addClass('hide');
                }
                var msg = reference_text + ' - reference inserted.';
                autosavefunction_vxe(msg);
              },
            });
          } else {
            loaderStop();
            $("#content [store='" + dt + "_ref']").remove();
            $('#referenceText').removeClass('hide');
            $('#referenceContent').addClass('hide');
            $('#referenceText').html(
              '<center><h2>Warning!</h2><span>Error has been thrown from Oxytech.</span></center>'
            );
          }
        },
      });
    }
    $('#lock').val('false');
  } else {
    $('#add_reference').removeClass('hide');
  }
}
function filterNone() {
  return NodeFilter.FILTER_ACCEPT;
}

referenceId = (len) => {
  return String(len).padStart(5, '0');
};

function getAllComments(rootElem) {
  var comments = [];
  // Fourth argument, which is actually obsolete according to the DOM4 standard, is required in IE 11
  var iterator = document.createNodeIterator(
    rootElem,
    NodeFilter.SHOW_COMMENT,
    filterNone,
    false
  );
  var curNode;
  while ((curNode = iterator.nextNode())) {
    var value = curNode.nodeValue;
    var labelCheck = value.includes('label1');
    if (labelCheck) {
      comments.push(curNode.nodeValue);
    }
  }
  return comments;
}
reference_num_add = (refElement, dt, insertedLabel, old_refno, new_ref) => {
  var userName = $('#username').val();
  const userId = $('#userid').val();
  var rid_text = $(refElement).html();
  $('#newlist').html(rid_text);
  var spanLength = $('#newlist').children().length;
  if (spanLength > 0) {
    $('#newlist')
      .children()
      .each(function () {
        $(this).removeAttr('data-date');
      });
    rid_text = $('#newlist').html();
  }
  var rid = $(refElement).text();
  var numberValidation = $.isNumeric(rid);
  var oldRefNum = parseInt(old_refno);
  var userRefNum = parseInt(insertedLabel);
  var output = '';
  if (numberValidation) {
    var curRefNum = parseInt(rid);
    output = rid_text;
    var spanLength = $('#newlist').children().length;
    var insspanLength = $('#newlist').find('span.ins').length;
    if (spanLength === 2 && insspanLength === 1) {
      var spanText = $('#newlist').find('span.ins').text();
      var numberValidation = $.isNumeric(spanText);
      if (numberValidation) {
        var curRefNum = parseInt(spanText);
        if (curRefNum === oldRefNum) {
          output =
            '<span class="del cts-1" data-cid="2" data-userid=' +
            userId +
            ' contenteditable="false" data-username="' +
            userName +
            '" data-time="' +
            dt +
            '_refdel">' +
            old_refno +
            '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
            userId +
            ' data-username="' +
            userName +
            '" data-time="' +
            dt +
            '_i' +
            new_ref +
            '" last-insert-ref="' +
            userRefNum +
            '">' +
            new_ref +
            '</span>';
        }
      }
    } else {
      if (curRefNum === oldRefNum) {
        output =
          '<span class="del cts-1" data-cid="2" data-userid=' +
          userId +
          ' contenteditable="false" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_refdel">' +
          old_refno +
          '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
          userId +
          ' data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          new_ref +
          '" last-insert-ref="' +
          userRefNum +
          '">' +
          new_ref +
          '</span>';
      }
    }
  } else {
    var rid_split = rid_text.split(','),
      i;
    for (i = 0; i < rid_split.length; i++) {
      var rid_linksplit = rid_split[i];
      var numberValidation = $.isNumeric(rid_linksplit);
      output = rid_linksplit;
      if (numberValidation) {
        var curRefNum = parseInt(rid_linksplit);
        var spanLength = $('#newlist').children().length;
        var insspanLength = $('#newlist').find('span.ins').length;
        if (spanLength === 2 && insspanLength === 1) {
          var spanText = $('#newlist').find('span.ins').text();
          var numberValidation = $.isNumeric(spanText);
          if (numberValidation) {
            var curRefNum = parseInt(spanText);
            if (curRefNum === oldRefNum) {
              output =
                '<span class="del cts-1" data-cid="2" data-userid=' +
                userId +
                ' contenteditable="false" data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_refdel">' +
                old_refno +
                '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
                userId +
                ' data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_i' +
                new_ref +
                '" last-insert-ref="' +
                userRefNum +
                '">' +
                new_ref +
                '</span>';
            }
          }
        } else {
          if (curRefNum === oldRefNum) {
            output =
              '<span class="del cts-1" data-cid="2" data-userid=' +
              userId +
              ' contenteditable="false" data-username="' +
              userName +
              '" data-time="' +
              dt +
              '_refdel">' +
              old_refno +
              '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
              userId +
              ' data-username="' +
              userName +
              '" data-time="' +
              dt +
              '_i' +
              new_ref +
              '" last-insert-ref="' +
              userRefNum +
              '">' +
              new_ref +
              '</span>';
          }
        }
      } else {
        var spanTag = $('#newlist').html(rid_linksplit);
        var spanLength = spanTag.children().length;
        var insspanLength = $(spanTag).find('span.ins').length;
        if (spanLength === 2 && insspanLength === 1) {
          var spanText = $(spanTag).find('span.ins').text();
          var numberValidation = $.isNumeric(spanText);
          if (numberValidation) {
            var curRefNum = parseInt(spanText);
            if (curRefNum === oldRefNum) {
              if (
                curRefNum === delRefNum &&
                delRefNum === oldRefNum &&
                curRefNum === oldRefNum
              ) {
                rid_linksplit =
                  '<span class="del cts-1" data-cid="2" data-userid=' +
                  userId +
                  ' contenteditable="false" data-username="' +
                  userName +
                  '" data-time="' +
                  dt +
                  '_refdel">' +
                  rid_linksplit +
                  '</span>';
              } else {
                if (curRefNum === oldRefNum) {
                  rid_linksplit =
                    '<span class="del cts-1" data-cid="2" data-userid=' +
                    userId +
                    ' contenteditable="false" data-username="' +
                    userName +
                    '" data-time="' +
                    dt +
                    '_refdel">' +
                    old_refno +
                    '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
                    userId +
                    ' data-username="' +
                    userName +
                    '" data-time="' +
                    dt +
                    '_i' +
                    new_ref +
                    '">' +
                    new_ref +
                    '</span>';
                }
              }
            }
          }
        }
      }
      if (i > 0) {
        rid_linksplit = ',' + rid_linksplit;
      }
      output = output + rid_linksplit;
    }
    output = rid_text;
  }
  if (output !== '') {
    $(refElement).html(output);
  }
};
function reference_delete() {
  var d = new Date();
  var dt = Date.parse(d);
  var userName = $('#username').val();
  const userId = $('#userid').val();
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set, 'EK');
  var parentEl = null,
    sel;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      parentEl = sel.getRangeAt(0).commonAncestorContainer;
      if (parentEl.nodeType != 1) {
        parentEl = parentEl.parentNode;
      }
    }
  } else if ((sel = document.selection) && sel.type != 'Control') {
    parentEl = sel.createRange().parentElement();
  }
  var tag_name = parentEl.tagName;
  var storeid = parentEl.getAttribute('store');
  if (storeid == null) {
    var storeid = parentEl.parentNode.getAttribute('store');
  }
  var store_id = $("#content [store='" + storeid + "']")
    .parents('ref')
    .attr('store');
  var affnodeas = getSelectedNode();
  var referenceElement = affnodeas.closest('ref');
  if (referenceElement !== '') {
    store_id = referenceElement.getAttribute('store');
    var deleteRefLength = $("#content [store='" + store_id + "']")[0].children
      .length;
    if (deleteRefLength === 1) {
      var deleteRefTag = $("#content [store='" + store_id + "']")[0].children[0]
        .tagName;
      var delClass = $(
        "#content [store='" + store_id + "']"
      )[0].children[0].getAttribute('class');
      var spanTag = 'SPAN';
      if (spanTag === deleteRefTag && delClass === 'del cts-1') {
        $('#referenceModal').modal('show');
        $('#referenceContent').addClass('hide');
        $('#referenceText').removeClass('hide');
        $('#referenceModal').modal('show');
        $('#referenceText').html(
          '<center><h2>Warning!</h2><span>This reference has been already deleted.</span></center>'
        );
        return false;
      }
    }
  }
  if (store_id != null) {
    var getData = $("#content [store='" + store_id + "']").html();
    var curDeletedRef = $("#content [store='" + store_id + "']")[0];
    var deletedLabel = '';
    var label_ref = $(curDeletedRef).find('label1').attr('label_ref');
    if (label_ref != undefined) {
      deletedLabel = label_ref;
    } else {
      var label_value = $(curDeletedRef).find('label1').text();
      var data_split = label_value.split('.');
      deletedLabel = data_split[0];
    }
    $("#content [store='" + store_id + "']").html(
      '<span class="del cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_refdel">' +
        getData +
        '</span>'
    );
    $("#content [store='" + store_id + "']").addClass('reference_deleted');
    var xmlid_val = $("#content [store='" + store_id + "']").attr('id');
    var match_attr = 0;
    $('#content ref').each(function () {
      var xmlid = $(this).attr('id');
      var label_ref = $(this).find('label1').attr('label_ref');
      if (label_ref != undefined) {
        var old_refno = label_ref;
      } else {
        var label_text = $(this).find('label1').text();
        var data_splits = label_text.split('.');
        var old_refno = data_splits[0];
      }
      var new_ref = +old_refno - +1;
      var spanTag = 'SPAN';
      var delTag = 'del cts-1';
      var deleteClass = '';
      var refElement = $(this)[0];
      if (refElement !== null) {
        var refChildLength = refElement.children.length;
        if (refChildLength === 1) {
          var deleteSpan = refElement.children[0].tagName;
          if (deleteSpan === spanTag) {
            deleteClass = refElement.children[0].getAttribute('class');
          }
        }
      }
      if (deleteClass === '' && deleteClass !== delTag) {
        if (xmlid == xmlid_val || match_attr == 1) {
          if (match_attr == 1) {
            $(this).find('label1').attr('label_ref', new_ref);
            $(this)
              .find('label1')
              .html(
                '<span class="del cts-1" data-cid="2" data-userid=' +
                  userId +
                  ' contenteditable="false" data-username="' +
                  userName +
                  '" data-time="' +
                  dt +
                  '_d' +
                  old_refno +
                  '">' +
                  old_refno +
                  '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
                  userId +
                  ' data-username="' +
                  userName +
                  '" data-time="' +
                  dt +
                  '_i' +
                  new_ref +
                  '">' +
                  new_ref +
                  '.</span> '
              );
            var rid_link = xmlid.replace(/\CIT[0]*/g, '');
            $("#content [rid*='" + xmlid + "']").each(function () {
              reference_num_delete(this, dt, deletedLabel, old_refno, new_ref);
            });
          }
          if (xmlid === xmlid_val) {
            $("#content [rid*='" + xmlid + "']").each(function () {
              reference_num_delete(this, dt, deletedLabel, old_refno, new_ref);
            });
          }
          match_attr = 1;
        }
      } else {
        if (xmlid === xmlid_val) {
          match_attr = 1;
          $("#content [rid*='" + xmlid + "']").each(function () {
            reference_num_delete(this, dt, deletedLabel, old_refno, new_ref);
          });
        }
      }
    });
  }
  var msg = 'Reference Deleted.';
  autosavefunction_vxe(msg);
}
reference_num_delete = (refElement, dt, deletedLabel, old_refno, new_ref) => {
  var userName = $('#username').val();
  const userId = $('#userid').val();
  var rid_text = $(refElement).html();
  $('#newlist').html(rid_text);
  var spanLength = $('#newlist').children().length;
  if (spanLength > 0) {
    $('#newlist')
      .children()
      .each(function () {
        $(this).removeAttr('data-date');
      });
    rid_text = $('#newlist').html();
  }
  var rid = $(refElement).text();
  var numberValidation = $.isNumeric(rid);
  var oldRefNum = parseInt(old_refno);
  var delRefNum = parseInt(deletedLabel);
  var output = '';
  if (numberValidation) {
    var curRefNum = parseInt(rid);
    output = rid_text;
    if (
      curRefNum === delRefNum &&
      delRefNum === oldRefNum &&
      curRefNum === oldRefNum
    ) {
      output =
        '<span class="del cts-1" data-cid="2" data-userid=' +
        userId +
        ' contenteditable="false" data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_refdel">' +
        rid_text +
        '</span>';
    } else {
      if (curRefNum === oldRefNum) {
        output =
          '<span class="del cts-1" data-cid="2" data-userid=' +
          userId +
          ' contenteditable="false" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_refdel">' +
          old_refno +
          '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
          userId +
          ' data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          new_ref +
          '">' +
          new_ref +
          '</span>';
      } else {
        var spanTag = $('#newlist').html();
        var spanLength = $('#newlist').children().length;
        var insspanLength = $('#newlist').find('span.ins').length;
        if (spanLength === 2 && insspanLength === 1) {
          var spanText = $('#newlist').find('span.ins').text();
          var numberValidation = $.isNumeric(spanText);
          if (numberValidation) {
            var curRefNum = parseInt(spanText);
            if (curRefNum === oldRefNum) {
              if (
                curRefNum === delRefNum &&
                delRefNum === oldRefNum &&
                curRefNum === oldRefNum
              ) {
                output =
                  '<span class="del cts-1" data-cid="2" data-userid=' +
                  userId +
                  ' contenteditable="false" data-username="' +
                  userName +
                  '" data-time="' +
                  dt +
                  '_refdel">' +
                  spanTag +
                  '</span>';
              } else {
                if (curRefNum === oldRefNum) {
                  output =
                    '<span class="del cts-1" data-cid="2" data-userid=' +
                    userId +
                    ' contenteditable="false" data-username="' +
                    userName +
                    '" data-time="' +
                    dt +
                    '_refdel">' +
                    old_refno +
                    '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
                    userId +
                    ' data-username="' +
                    userName +
                    '" data-time="' +
                    dt +
                    '_i' +
                    new_ref +
                    '">' +
                    new_ref +
                    '</span>';
                }
              }
            }
          }
        }
      }
    }
  } else {
    var rid_split = rid_text.split(','),
      i;
    for (i = 0; i < rid_split.length; i++) {
      var rid_linksplit = rid_split[i];
      var numberValidation = $.isNumeric(rid_linksplit);
      if (numberValidation) {
        var curRefNum = parseInt(rid_linksplit);
        if (curRefNum === oldRefNum) {
          if (
            curRefNum === delRefNum &&
            delRefNum === oldRefNum &&
            curRefNum === oldRefNum
          ) {
            rid_linksplit =
              '<span class="del cts-1" data-cid="2" data-userid=' +
              userId +
              ' contenteditable="false" data-username="' +
              userName +
              '" data-time="' +
              dt +
              '_refdel">' +
              rid_linksplit +
              '</span>';
          } else {
            if (curRefNum === oldRefNum) {
              rid_linksplit =
                '<span class="del cts-1" data-cid="2" data-userid=' +
                userId +
                ' contenteditable="false" data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_refdel">' +
                old_refno +
                '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
                userId +
                ' data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_i' +
                new_ref +
                '">' +
                new_ref +
                '</span>';
            }
          }
        }
      } else {
        var spanTag = $('#newlist').html(rid_linksplit);
        var spanLength = spanTag.children().length;
        var insspanLength = $(spanTag).find('span.ins').length;
        if (spanLength === 2 && insspanLength === 1) {
          var spanText = $(spanTag).find('span.ins').text();
          var numberValidation = $.isNumeric(spanText);
          if (numberValidation) {
            var curRefNum = parseInt(spanText);
            if (curRefNum === oldRefNum) {
              if (
                curRefNum === delRefNum &&
                delRefNum === oldRefNum &&
                curRefNum === oldRefNum
              ) {
                rid_linksplit =
                  '<span class="del cts-1" data-cid="2" data-userid=' +
                  userId +
                  ' contenteditable="false" data-username="' +
                  userName +
                  '" data-time="' +
                  dt +
                  '_refdel">' +
                  rid_linksplit +
                  '</span>';
              } else {
                if (curRefNum === oldRefNum) {
                  rid_linksplit =
                    '<span class="del cts-1" data-cid="2" data-userid=' +
                    userId +
                    ' contenteditable="false" data-username="' +
                    userName +
                    '" data-time="' +
                    dt +
                    '_refdel">' +
                    old_refno +
                    '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
                    userId +
                    ' data-username="' +
                    userName +
                    '" data-time="' +
                    dt +
                    '_i' +
                    new_ref +
                    '">' +
                    new_ref +
                    '</span>';
                }
              }
            }
          }
        }
      }
      if (i > 0) {
        rid_linksplit = ',' + rid_linksplit;
      }
      output = output + rid_linksplit;
    }
    output = rid_text;
  }
  if (output !== '') {
    $(refElement).html(output);
  }
};
function reference_edit() {
  $('#refEmptyError').addClass('hide');
  $('#lock').val('true');
  var d = new Date();
  var dt = Date.parse(d);
  var userName = $('#username').val();
  var parentEl = null,
    sel;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      parentEl = sel.getRangeAt(0).commonAncestorContainer;
      if (parentEl.nodeType != 1) {
        parentEl = parentEl.parentNode;
      }
    }
  } else if ((sel = document.selection) && sel.type != 'Control') {
    parentEl = sel.createRange().parentElement();
  }
  //New added
  var tag_name_click = parentEl.parentNode.tagName;
  if (
    tag_name_click === 'MIXED-CITATION' ||
    tag_name_click === 'NAME' ||
    tag_name_click === 'SOURCE1' ||
    tag_name_click === 'BIBLIOMSET' ||
    tag_name_click === 'TITLE1'
  ) {
    var parentnode = parentEl.closest('REF');
    var store_id = parentnode.getAttribute('store');
  }
  var tag_name = parentEl.tagName;
  if (tag_name === 'REF') {
    var store_id = parentEl.getAttribute('store');
  } else {
    var parentnode = parentEl.closest('REF');
    var store_id = parentnode.getAttribute('store');
  }
  var tag_names = parentEl.parentNode.tagName;
  if (tag_names === 'REF' || tag_names === 'SPAN') {
    var store_id = parentEl.parentNode.getAttribute('store');
    if (tag_names === 'SPAN') {
      var store_id = parentEl.parentNode.parentNode.getAttribute('store');
    }
  }
  var refElement = parentEl.closest('ref');
  var spanTag = 'SPAN';
  var delTag = 'del cts-1';
  if (refElement !== null) {
    var refChildLength = refElement.children.length;
    if (refChildLength === 1) {
      var deleteSpan = refElement.children[0].tagName;
      var deleteClass = refElement.children[0].getAttribute('class');
      if (deleteSpan === spanTag && deleteClass === delTag) {
        store_id = null;
      }
    }
  }
  if (store_id != null) {
    var publication_type = $("#content [store='" + store_id + "']").attr(
      'role'
    );
    publication_type = 'journal';
    if (publication_type === 'journal') {
      $('#publication_select').val('journal');
    } else if (publication_type === 'book') {
      $('#publication_select').val('book');
    } else {
      $('#publication_select').val('other');
    }
    var getData = $("#content [store='" + store_id + "']")
      .find('mixed-citation')
      .html();
    var updatedRefLength = $("#content [store='" + store_id + "']").find(
      'span[refupdated]'
    ).length;
    var prevRefLength = $("#content [store='" + store_id + "']").find(
      'span[refold]'
    ).length;
    if (updatedRefLength === 1) {
      getData = $("#content [store='" + store_id + "']")
        .find('span[refupdated]')
        .find('mixed-citation')
        .html();
    }

    var refeditId = $('#edit-ref-id').val();
    $('#ref').html('');
    $('#ref').html(getData);
    if (prevRefLength === 1) {
      var oldgetData = $("#content [store='" + store_id + "']")
        .find('span[refold]')
        .find('mixed-citation')
        .html();
      $('#ref-element-prev').html(oldgetData);
      var oldRefTrack = $("#content [store='" + store_id + "']")
        .find('span[data-role="ref-duplicate"]')
        .find('mixed-citation')
        .html();
      $('#finalSpanReference').html(
        '<span data-role="ref-duplicate"><mixed-citation>' +
          oldRefTrack +
          '</mixed-citation></span>'
      );
      $('#finalSpanReference *').removeAttr('id');
    } else {
      $('#ref-element-prev').html(getData);
      $('#finalSpanReference').html(
        '<span data-role="ref-duplicate"><mixed-citation>' +
          getData +
          '</mixed-citation></span>'
      );
      $('#finalSpanReference *').removeAttr('id');
    }
    if (refeditId !== store_id) {
      $('#edit-ref-id').val(store_id);
      $('#ref-element-prev').html(getData);
      if (prevRefLength === 1) {
        var oldgetData = $("#content [store='" + store_id + "']")
          .find('span[refold]')
          .find('mixed-citation')
          .html();
        $('#ref-element-prev').html(oldgetData);
      }
      $('#ref-element-prev')
        .children('*')
        .each(function (index) {
          var store_ref = $(this).attr('store');
          $(this).removeAttr('store');
          $(this).attr('store_id', store_ref);
        });
    }
    $('#ref').find('label1').remove();
    $('#reference_editpreview').html('');
    $('#reference_editpreview').html(getData);
    $('#reference_editpreview *').attr('contenteditable', 'false');
    $('#refEditModal').modal({
      backdrop: 'static',
      keyboard: false,
    });
    $('#reference_editsub').attr(
      'onClick',
      "updateReference('" + store_id + "');"
    );
    $('#form').empty();
    updateForm();
  }
  $('#lock').val('false');
}
function updateForm() {
  var TempIDVal = 0;
  var TempIDVal2 = 0;
  var EleID = 0;
  var elementID = '';
  $('#ref .ref-drag').remove();
  $('#ref')
    .children('*')
    .each(function () {
      var elementData = this.innerHTML;
      if (this.children.length === 0) {
        var tag_name = $(this)[0].tagName;
        var deleteOption = false;
        if (tag_name === 'TITLE1') {
          var role_attr = $(this).attr('role');
          if (role_attr != undefined) {
            var tag_title = role_attr;
          }
          EleID = EleID + 1;
          $(this).attr('id', 'ELE' + EleID);
          $('#form').append(
            '<div class="form-group mr-2" id="DEL' +
              EleID +
              '"><div class="legend_group">' +
              $(this)[0].tagName +
              ':</div><div class="author-form formData title_data" contenteditable="true" targetid="ELE' +
              EleID +
              '">' +
              this.innerHTML +
              '</div></div>'
          );
        } else if (tag_name === 'PUBDATE') {
          EleID = EleID + 1;
          $(this).attr('id', 'ELE' + EleID);
          $('#form').append(
            '<div class="form-group box_reference mr-2" id="DEL' +
              EleID +
              '"><div class="legend_group">' +
              $(this)[0].tagName +
              ':</div><div class="author-form formData" contenteditable="true" targetid="ELE' +
              EleID +
              '" data-text="' +
              $(this)[0].tagName +
              '">' +
              this.innerHTML +
              '</div></div>'
          );
        } else if (tag_name === 'ISSUENUM' || tag_name === 'PAGENUMS') {
          EleID = EleID + 1;
          $(this).attr('id', 'ELE' + EleID);
          $('#form').append(
            '<div class="form-group box_reference mr-2" id="DEL' +
              EleID +
              '"><div class="legend_group">' +
              $(this)[0].tagName +
              ':</div><div class="author-form formData" contenteditable="true" targetid="ELE' +
              EleID +
              '" data-text="' +
              $(this)[0].tagName +
              '">' +
              this.innerHTML +
              '</div></div>'
          );
        } else if (tag_name === 'I') {
          EleID = EleID + 1;
          $(this).attr('id', 'ELE' + EleID);
          $('#form').append(
            '<div class="form-group box_reference mr-2" id="DEL' +
              EleID +
              '"><div class="legend_group"></div><div class="author-form formData" contenteditable="true" targetid="ELE' +
              EleID +
              '" data-text="' +
              $(this)[0].tagName +
              '">' +
              this.innerHTML +
              '</div></div>'
          );
        } else {
          deleteOption = true;
          EleID = EleID + 1;
          $(this).attr('id', 'ELE' + EleID);
          if (
            $(this).prev()[0] !== undefined &&
            ($(this).prev()[0].tagName.toLowerCase() === 'person-group' ||
              $(this).prev()[0].tagName.toLowerCase() === 'editor') &&
            $(this)[0].tagName.toLowerCase() === 'delimiter'
          ) {
            if (elementID !== '') {
              $('#' + elementID).append(
                '<div class="box_reference mr-2"><div class="form-control formData mr-2" contenteditable="true" targetid="ELE' +
                  EleID +
                  '">' +
                  this.innerHTML +
                  '</div></div>'
              );
            } else {
              $('#form').append(
                '<div class="box_reference mr-2"><div class="form-control formData mr-2" contenteditable="true" targetid="ELE' +
                  EleID +
                  '">' +
                  this.innerHTML +
                  '</div></div>'
              );
            }
          } else {
            deleteIcon =
              '<span class="delEle" onClick="delParElementNew(this.parentNode)"><i class="material-icons cstm-error-color f-18-px">remove</i></span>';
            if (
              $(this)[0].tagName.toLowerCase() === 'delimiter' &&
              $('#form').children().last().attr('id') !== undefined
            ) {
              if (
                $(this).next()[0] !== undefined &&
                $(this).next()[0].tagName.toLowerCase() === 'delimiter'
              ) {
                deleteIcon = '';
              }
              if (
                $(this).prev()[0] !== undefined &&
                $(this).prev()[0].tagName.toLowerCase() === 'name'
              ) {
                deleteIcon =
                  '<span><span class="addEle" onclick="cloneCurElementAr(this.parentNode.parentNode)" aria-hidden="true"><i class="material-icons cstm-success-color f-18-px">add</i></span><span class="delEle inside_box" onclick="delAuthorElement(this.parentNode.parentNode)" aria-hidden="true"><i class="material-icons cstm-error-color f-18-px">remove</i></span></span>';
              }
              $('#' + $('#form').children().last().attr('id')).append(
                '<div class="box_reference mr-2" id="DEL' +
                  EleID +
                  '"><div class="form-control formData mr-2" contenteditable="true" targetid="ELE' +
                  EleID +
                  '">' +
                  this.innerHTML +
                  '</div></div>' +
                  deleteIcon
              );
            } else {
              var styleClass = '';
              if ($(this)[0].tagName === 'I') {
                styleClass = 'italicClass';
              }
              if ($(this)[0].tagName === 'B') {
                styleClass = 'boldClass';
              }
              if ($(this)[0].tagName === 'SUB') {
                styleClass = 'subscript';
              }
              if ($(this)[0].tagName === 'SUP') {
                styleClass = 'superscript';
              }
              var tag_title = $(this)[0].tagName;
              tag_title = tag_title.replace('1', '');
              var lastelement = $(this).next()[0];
              if (
                $(this).next()[0] !== undefined &&
                $(this).next()[0].tagName.toLowerCase() === 'delimiter'
              ) {
                deleteIcon = '';
              }
              if (
                lastelement === undefined ||
                ($(this).next()[0] !== undefined &&
                  $(this).next()[0].tagName.toLowerCase() !== 'delimiter')
              ) {
                deleteIcon =
                  '<span class="delEle" onClick="delParElementNew(this.parentNode)"><i class="material-icons cstm-error-color f-18-px">remove</i></span>';
              }
              $('#form').append(
                '<div class="form-group box_reference ' +
                  styleClass +
                  '" id="DEL' +
                  EleID +
                  '"><div class="legend_group">' +
                  tag_title +
                  ':</div><div class="author-form formData" contenteditable="true" targetid="ELE' +
                  EleID +
                  '" data-text="' +
                  $(this)[0].tagName +
                  '">' +
                  this.innerHTML +
                  '</div>' +
                  deleteIcon +
                  '</div>'
              );
            }
          }
        }
        if (!deleteOption && $(this).next()[0] === undefined) {
          $('#' + $('#form').children().last().attr('id')).append(
            '<span class="delEle" onClick="delParElementNew(this.parentNode)"><i class="material-icons cstm-error-color f-18-px">remove</i></span>'
          );
        }
      } else {
        TempIDVal = TempIDVal + 1;
        if ($(this)[0].tagName.toLowerCase() === 'name') {
          EleID = EleID + 1;
          $(this).attr('id', 'PAI' + EleID);
          $('#form').append(
            '<div class="form-group box_reference" id="DID' +
              TempIDVal +
              '" targetid="PAI' +
              EleID +
              '"><span class="legend_group">' +
              $(this)[0].tagName +
              ':</span></div>'
          );
        } else {
          EleID = EleID + 1;
          $(this).attr('id', 'PAI' + EleID);
          if ($(this)[0].tagName === 'VOLUMENUM') {
            $('#form').append(
              '<div class="volume_num" id="DID' +
                TempIDVal +
                '" targetid="PAI' +
                EleID +
                '"><span class="delEle author_name volume_span" onClick="delParElement(this.parentNode)"><i class="material-icons cstm-error-color f-18-px">remove</i></span><span class="legend_group">' +
                $(this)[0].tagName +
                ':</span></div>'
            );
          } else if ($(this)[0].tagName === 'PERSON-GROUP') {
            $('#form').append(
              '<div id="DID' +
                TempIDVal +
                '" targetid="PAI' +
                EleID +
                '"></div>'
            );
          } else if ($(this)[0].tagName === 'SPAN') {
            $('#form').append(
              '<div id="DID' +
                TempIDVal +
                '" targetid="PAI' +
                EleID +
                '"></div>'
            );
          } else if ($(this)[0].tagName === 'AUTHOR') {
            $('#form').append(
              '<div class="form-group author_group" id="DID' +
                TempIDVal +
                '" targetid="PAI' +
                EleID +
                '"><span class="legend_group">' +
                $(this)[0].tagName +
                ':</span></div>'
            );
          } else if ($(this)[0].tagName === 'BIBLIOMSET') {
            $('#form').append(
              '<div class="form-group bibli_group" id="DID' +
                TempIDVal +
                '" targetid="PAI' +
                EleID +
                '"><span class="legend_group">' +
                $(this)[0].tagName +
                ':</span></div>'
            );
          } else if ($(this)[0].tagName === 'EDITOR') {
            $('#form').append(
              '<div class="form-group bibli_group" id="DID' +
                TempIDVal +
                '" targetid="PAI' +
                EleID +
                '"><span class="legend_group">' +
                $(this)[0].tagName +
                ':</span></div>'
            );
          } else if ($(this)[0].tagName === 'TITLE1') {
            $('#form').append(
              '<div class="form-group bibli_group" id="DID' +
                TempIDVal +
                '" targetid="PAI' +
                EleID +
                '"><span class="legend_group">TITLE:</span></div>'
            );
          } else if ($(this)[0].tagName.toLowerCase() === 'delimiter') {
            var deleteIcon =
              '<span class="delEle" onClick="delParElementNew(this.parentNode)"><i class="material-icons cstm-error-color f-18-px">remove</i></span>';
            $('#' + $('#form').children().last().attr('id')).append(
              '<div class="box_reference mr-2" id="DEL' +
                EleID +
                '"><div class="form-control formData mr-2" contenteditable="true" targetid="ELE' +
                EleID +
                '">' +
                this.innerHTML +
                '</div></div>' +
                deleteIcon
            );
          } else {
            var tag_title = $(this)[0].tagName;
            tag_title = tag_title.replace('1', '');
            $('#form').append(
              '<div class="form-group bibli_group" id="DID' +
                TempIDVal +
                '" targetid="PAI' +
                EleID +
                '"><span class="legend_group">' +
                tag_title +
                ':</span></div>'
            );
          }
        }
        let parentStoreId = '';
        $(this)
          .children('*')
          .each(function () {
            if (this.children.length === 0) {
              EleID = EleID + 1;
              $(this).attr('id', 'ELE' + EleID);
              var elementData = this.innerHTML;
              if ($(this)[0].tagName === 'PUBLISHER') {
                $('#DID' + TempIDVal).append(
                  '<br><div class="box_reference mr-2"><div class="form-control formData" contenteditable="true" targetid="ELE' +
                    EleID +
                    '" data-text="' +
                    $(this)[0].tagName +
                    '">' +
                    this.innerHTML +
                    '</div></div>'
                );
              } else {
                var styleClass = '';
                if ($(this)[0].tagName === 'I') {
                  elementData = this.parentElement.innerHTML;
                  styleClass = 'italicClass';
                }
                if ($(this)[0].tagName === 'B') {
                  elementData = this.parentElement.innerHTML;
                  styleClass = 'boldClass';
                }
                if ($(this)[0].tagName === 'SUB') {
                  elementData = this.parentElement.innerHTML;
                  styleClass = 'subscript';
                }
                if ($(this)[0].tagName === 'SUP') {
                  elementData = this.parentElement.innerHTML;
                  styleClass = 'superscript';
                }
                let curParentId = this.parentElement.getAttribute('store');
                var nameClass = '';
                if (
                  $(this)[0].tagName.toLowerCase() === 'surname' ||
                  $(this)[0].tagName.toLowerCase() === 'given-names'
                ) {
                  nameClass = 'author-form';
                }
                if (parentStoreId === '' || curParentId != parentStoreId) {
                  parentStoreId = curParentId;
                  $('#DID' + TempIDVal).append(
                    '<div class="box_reference mr-2 ' +
                      styleClass +
                      '"><div  class="form-control formData ' +
                      nameClass +
                      '" contenteditable="true" targetid="ELE' +
                      EleID +
                      '" data-text="' +
                      $(this)[0].tagName +
                      '">' +
                      elementData +
                      '</div></div>'
                  );
                }
              }
            } else {
              TempIDVal2 = TempIDVal2 + 1;
              elementID = 'DID2' + TempIDVal2;
              if ($(this)[0].tagName.toLowerCase() === 'personname') {
                EleID = EleID + 1;
                $(this).attr('id', 'PAI' + EleID);
                $('#DID' + TempIDVal).append(
                  '<div class="personname_group mr-2" id="DID2' +
                    TempIDVal2 +
                    '" targetid="PAI' +
                    EleID +
                    '"></div><span><span class="addEle" onclick="cloneCurElementAr(this.parentNode.parentNode)" aria-hidden="true"><i class="material-icons cstm-success-color f-18-px">add</i></span><span class="delEle inside_box" onclick="delAuthorElement(this.parentNode.parentNode)" aria-hidden="true"><i class="material-icons cstm-error-color f-18-px">remove</i></span></span>'
                );
                elementID = 'DID2' + TempIDVal2;
              } else if ($(this)[0].tagName.toLowerCase() === 'person-group') {
                EleID = EleID + 1;
                $(this).attr('id', 'PAI' + EleID);
                $('#DID' + TempIDVal).append(
                  '<div class="personname_group mr-2" id="DID2' +
                    TempIDVal2 +
                    '" targetid="PAI' +
                    EleID +
                    '"></div>'
                );
                elementID = 'DID2' + TempIDVal2;
              } else {
                var tag_title = 'TITLE';
                var role_attr = $(this).attr('role');
                if (role_attr != undefined) {
                  var tag_title = role_attr;
                }
                EleID = EleID + 1;
                $(this).attr('id', 'PAI' + EleID);
                var tag_title = $(this)[0].tagName;
                tag_title = tag_title.replace('1', '');
                $('#DID' + TempIDVal).append(
                  '<div class="form-group border_box" id="DID2' +
                    TempIDVal2 +
                    '" targetid="PAI' +
                    EleID +
                    '"><span class="legend_group">' +
                    tag_title +
                    ':</span></div>'
                );
              }
              var j = 1;
              var totalchild = $(this).children('*').length;
              $(this)
                .children('*')
                .each(function () {
                  EleID = EleID + 1;
                  $(this).attr('id', 'ELE' + EleID);
                  var elementData = this.innerHTML;
                  if ($(this)[0].tagName === 'I') {
                    $('#DID2' + TempIDVal2).append(
                      '<div class="box_italic mr-2"><div  class="form-control formData" contenteditable="true" targetid="ELE' +
                        EleID +
                        '" data-text="' +
                        $(this)[0].tagName +
                        '">' +
                        this.innerHTML +
                        '</div></div>'
                    );
                  } else {
                    if ($(this)[0].tagName.toLowerCase() === 'delimiter') {
                      $('#DID2' + TempIDVal2).append(
                        '<div class="box_reference mr-2"><div  class="form-control formData mr-2" contenteditable="true" targetid="ELE' +
                          EleID +
                          '">' +
                          this.innerHTML +
                          '</div></div>'
                      );
                    } else {
                      $('#DID2' + TempIDVal2).append(
                        '<div class="box_reference mr-2"><div  class="form-control author-form formData" contenteditable="true" targetid="ELE' +
                          EleID +
                          '" data-text="' +
                          $(this)[0].tagName +
                          '">' +
                          this.innerHTML +
                          '</div></div>'
                      );
                    }
                  }
                  if (
                    $(this)[0].parentElement.tagName.toLowerCase() === 'name' &&
                    j == totalchild
                  ) {
                    $('#DID2' + TempIDVal2).append(
                      '<span><span class="addEle" onclick="cloneCurElementAr(this.parentNode.parentNode)" aria-hidden="true"><i class="material-icons cstm-success-color f-18-px">add</i></span><span class="delEle inside_box" onclick="delAuthorElement(this.parentNode.parentNode)" aria-hidden="true"><i class="material-icons cstm-error-color f-18-px">remove</i></span></span>'
                    );
                  }
                  j++;
                });
            }
          });
      }
    });
  var getData = $('#ref').html();
  $('#reference_editpreview').html('');
  $('#reference_editpreview').html(getData);
  $('#reference_editpreview *').attr('contenteditable', 'false');
  onkeyup_formupdate();
}
function onkeyup_formupdate() {
  $('.formData').on('keyup', function (e) {
    $('#reference_editpreview').html('');
    var referenceNode = $(this).attr('targetid');
    if (!!referenceNode) {
      var targetChild = $(this).children().length;
      var action = 0;
      var change_val = $(this).text();
      if (targetChild > 0) {
        action = 1;
        change_val = $(this).html();
      }
      refKeyup(referenceNode, change_val, action);
    }
  });

  refKeyup = (referenceNode, change_val, action) => {
    var storeId = $('#ref')
      .find("[id='" + referenceNode + "']")
      .attr('store');
    $('#ref')
      .find("[store='" + storeId + "']")
      .html(change_val);
    $('#finalSpanReference')
      .find("[store='" + storeId + "']")
      .html(change_val);
    var spanText = refTrack(referenceNode, change_val, storeId, action);
    $('#finalSpanReference')
      .find("[store='" + storeId + "']")
      .html(spanText);
    $('#ref').find('label1').remove();
    $('#finalSpanReference').find('label1').remove();
    var getData = $('#ref').html();
    $('#reference_editpreview').html('');
    $('#reference_editpreview').html(getData);
    $('#reference_editpreview *').attr('contenteditable', 'false');
  };

  refTrack = (referenceNode, change_val, storeId, action) => {
    var preValue = $('#ref-element-prev')
      .find("[store='" + storeId + "']")
      .text();
    var d = new Date();
    var dt = Date.parse(d);
    var uniid = Date.parse(d);
    var userName = $('#username').val();
    const userId = $('#userid').val();
    var targetChild = $('#ref-element-prev')
      .find("[store='" + storeId + "']")
      .children().length;
    if (targetChild > 0) {
      preValue = $('#ref-element-prev')
        .find("[store='" + storeId + "']")
        .html();
    }
    if (action === 1) {
      var srt =
        '<span class="del cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_d' +
        '">' +
        preValue +
        '</span><span class="ins cts-1" data-cid="2" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_i' +
        '">' +
        change_val +
        '</span>';
      return srt;
    }
    $('.left').html('');
    $('.right').html('');
    $('.picadiff').picadiff({
      leftContent: preValue,
      rightContent: change_val,
    });
    $('.right').find('span.equal').contents().unwrap();
    var InsId = '1';
    var DelId = '1';
    $('.right')
      .find('.del, .ins')
      .each(function () {
        if ($(this).hasClass('del')) {
          var rejtext = $(this).text();
          $(this).attr('data-accept', '');
          $(this).attr('data-reject', rejtext);
        }
        if ($(this).hasClass('ins')) {
          var instext = $(this).text();
          $(this).attr('data-accept', instext);
          $(this).attr('data-reject', '');
        }
        $(this).attr('data-insid', InsId);
        $(this).attr('data-delid', DelId);
        $(this).attr('data-username', userName);
        $(this).attr('data-role', 'ref-dul');
        $(this).attr('data-time', dt);
        $(this).attr('data-id', uniid);
        $(this).attr('data-storeId', storeId);
        dt++;
      });
    return $('.right').html();
    // return '<span data-role="ref-duplicate">'+text+'</span>';
  };

  $('.formData').click(function () {
    $('#reference_editpreview').html('');
    var targetid = $(this).attr('targetid');
    var tag_Names = $('#' + targetid).prop('tagName');
    var tagname_parent = $('#' + targetid)
      .parent()
      .prop('tagName');
    var tag_parent = $('#' + targetid).parent();
    var publication_select = $('#publication_select').val();
    $('#reference_element').html('');
    $('#reference_changeElement').html('');
    $('.reference_rightmovement').attr(
      'onClick',
      "reference_rightmovement('" + targetid + "')"
    );
    $('.reference_leftmovement').attr(
      'onClick',
      "reference_leftmovement('" + targetid + "')"
    );
    var getData = $('#ref').html();
    $('#reference_editpreview').html('');
    $('#reference_editpreview').html(getData);
    $('#reference_editpreview *').attr('contenteditable', 'false');
    if (tag_Names == 'SURNAME' || tag_Names == 'FIRSTNAME') {
      $('#reference_element').html(
        '<option value="">Add Elements</option><option value="surname">Surname</option><option value="delimiter">Delimiter</option><option value="given-names">Given Name</option>'
      );
    } else if (tagname_parent == 'VOLUMENUM' || tag_Names == 'VOLUMENUM') {
      $('#reference_element').html(
        '<option value="">Add Elements</option><option value="issue">Issue</option><option value="delimiter">Delimiter</option>'
      );
    } else if (
      tag_Names == 'PUBDATE' ||
      tag_Names == 'ISSUE' ||
      tag_Names == 'PUBLISHER' ||
      tag_Names == 'ADDRESS' ||
      tag_Names == 'CITY'
    ) {
      $('#reference_element').html(
        '<option value="">Add Elements</option><option value="delimiter">Delimiter</option><option value="pubdate">Pubdate</option><option value="publisher">Publisher</option><option value="volumenum">Volume</option><option value="publisher-loc">Publisher-Location</option><option value="issue">Issue</option><option value="pub-id">Pub-ID</option><option value="fpage">Fpage</option><option value="lpage">Lpage</option>'
      );
    } else {
      $('#reference_element').html(
        '<option value="">Add Elements</option><option value="surname">Surname</option><option value="delimiter">Delimiter</option><option value="given-names">Given Name</option><option value="chaptertitle">Chaptertitle</option><option value="booktitle">Booktitle</option><option value="articletitle">Articletitle</option><option value="journaltitle">Journaltitle</option><option value="publisher-loc">Publisher-Location</option><option value="pubdate">Pubdate</option><option value="publisher">Publisher</option><option value="volumenum">Volume</option><option value="issue">Issue</option><option value="pub-id">Pub-ID</option><option value="fpage">Fpage</option><option value="lpage">Lpage</option>'
      );
    }
    $('#reference_changeElement').html(
      '<option value="">Change Elements</option><option value="surname">Surname</option><option value="delimiter">Delimiter</option><option value="given-names">Given Name</option><option value="chaptertitle">Chaptertitle</option><option value="booktitle">Booktitle</option><option value="articletitle">Articletitle</option><option value="journaltitle">Journaltitle</option><option value="publisher-loc">Publisher-Location</option><option value="pubdate">Pubdate</option><option value="publisher">Publisher</option><option value="volumenum">Volume</option><option value="issue">Issue</option><option value="pub-id">Pub-ID</option><option value="fpage">Fpage</option><option value="lpage">Lpage</option>'
    );
    var getData = $('#ref').html();
    $('#reference_editpreview').html('');
    $('#reference_editpreview').html(getData);
    $('#reference_editpreview *').attr('contenteditable', 'false');
  });
}
$('#reference_element').on('change', function () {
  var d = new Date();
  var dt = Date.parse(d);
  $('#reference_editpreview').html('');
  var element_name = $(this).val();
  element_name = element_name.toLowerCase();
  if (element_name != '') {
    var affnode = getSelectedNode();
    var referenceNode = affnode.getAttribute('targetid');
    if (referenceNode === null) {
      var childCount = $(affnode).find('[targetid]').length;
      if (childCount > 0) {
        referenceNode = $(affnode)
          .find('[targetid]')[0]
          .getAttribute('targetid');
      }
    }
    var storeId = $('#ref')
      .find("[id='" + referenceNode + "']")
      .attr('store');
    var insertEle = '';
    if (element_name == 'delimiter') {
      insertEle = " <delimiter store='delimiter_" + dt + "'></delimiter> ";
    } else if (element_name == 'chaptertitle') {
      insertEle =
        " <chapter-title store='chapter_title_" + dt + "'></chapter-title> ";
    } else if (element_name == 'booktitle') {
      insertEle = " <source1 store='source1_" + dt + "'></source1> ";
    } else if (element_name == 'articletitle') {
      insertEle =
        " <article-title store='article_title_" + dt + "'></article-title> ";
    } else if (element_name == 'journaltitle') {
      insertEle = " <source1 store='source1_" + dt + "'></source1> ";
    } else if (element_name == 'publisher-loc') {
      insertEle =
        " <publisher-loc store='publisher_" + dt + "'></publisher-loc> ";
    } else if (element_name == 'pubdate') {
      insertEle = " <year store='year_" + dt + "'></year> ";
    } else if (element_name == 'publisher') {
      insertEle =
        " <publisher-name store='publisher_" + dt + "'></publisher-name> ";
    } else if (element_name == 'volumenum') {
      insertEle = " <volume1 store='volume1_" + dt + "'></volume1> ";
    } else if (element_name == 'issue') {
      insertEle = " <issue1 store='issue1_" + dt + "'></issue1> ";
    } else if (element_name == 'surname') {
      insertEle = " <surname store='surname_" + dt + "'></surname> ";
    } else if (element_name == 'given-names') {
      insertEle = " <given-names store='given_" + dt + "'></given-names> ";
    } else if (element_name == 'collab') {
      insertEle = " <collab store='collab_" + dt + "'></collab> ";
    } else if (element_name == 'uri') {
      insertEle = " <uri store='uri_" + dt + "'></uri> ";
    } else if (element_name == 'pub-id') {
      insertEle = " <pub-id store='pub_" + dt + "'></pub-id> ";
    } else if (element_name == 'fpage') {
      insertEle = " <fpage1 store='fpage1_" + dt + "'></fpage1> ";
    } else if (element_name == 'lpage') {
      insertEle = " <lpage1 store='lpage1_" + dt + "'></lpage1> ";
    } else if (element_name == 'issuenum') {
      insertEle = " <issuenum store='issuenum_" + dt + "'></issuenum> ";
    } else if (element_name == 'name') {
      insertEle =
        " <name><surname store='surname_" +
        dt +
        "'></surname><given-names store='given_" +
        dt +
        "'></given-names></name><delimiter store='delimiter2_" +
        dt +
        "'></delimiter> ";
    }
    $(insertEle).insertAfter($('#' + referenceNode));
    var refEle = $('#finalSpanReference').find("[store='" + storeId + "']");
    $(insertEle).insertAfter(refEle);
    $('#ref')
      .find('*')
      .each(function () {
        $(this).removeAttr('id');
      });
    $('#form').empty();
    updateForm();
  }
});
function delCurElement(ele) {
  $('#reference_editpreview').html('');
  var referenceNode = $(ele).children('[targetid]').attr('targetid');
  var parentRefNode = $('#' + referenceNode);
  $(parentRefNode).remove(); // Remove the delete parent
  $('#ref')
    .find('*')
    .each(function () {
      $(this).removeAttr('id');
    });
  $('#form').empty();
  updateForm();
}
function delAuthorElement(ele) {
  $('#reference_editpreview').html('');
  var referenceNode = $(ele).attr('targetid');
  if (referenceNode !== '' && referenceNode !== null) {
    var nextLength = $('#' + referenceNode).next().length;
    var nextNode = '';
    if (nextLength > 0) {
      // $('#'+referenceNode).next().next().length();
      nextNode = $('#' + referenceNode).next()[0].tagName;
      var nextNodeid = $('#' + referenceNode).next()[0].id;
    }
    var authorELe = ele.querySelectorAll('.formData'),
      i;
    if (authorELe.length > 0) {
      for (i = 0; i < authorELe.length; ++i) {
        var element = authorELe[i];
        var refN = element.getAttribute('targetid');
        var storeId = $('#ref')
          .find("[id='" + refN + "']")
          .attr('store');
        var spanText = refTrack(refN, '', storeId);
        $('#finalSpanReference')
          .find("[store='" + storeId + "']")
          .html(spanText);
      }
    }
    if (nextNode.toLowerCase() === 'delimiter') {
      var parentRefNode = $('#' + referenceNode);
      $(parentRefNode).remove(); // Remove the delete parent
      $('#' + nextNodeid).remove();
    } else {
      var parentRefNode = $('#' + referenceNode);
      $(parentRefNode).remove(); // Remove the delete parent
    }
    $('#ref')
      .find('*')
      .each(function () {
        $(this).removeAttr('id');
      });
    $('#form').empty();
    updateForm();
  }
}
function cloneCurElement(ele) {
  $('#reference_editpreview').html('');
  var referenceNode = $(ele).attr('targetid');
  // var parentRefNode  = $('#'+referenceNode).parent();
  // var nextNode = $('#'+referenceNode).next()[0].tagName;
  // var nextNodeid = $('#'+referenceNode).next()[0].id;
  // var nextnextNode = $('#'+referenceNode).next().next()[0].tagName;
  // if(nextNode.toLowerCase() === "delimiter" && (nextnextNode.toLowerCase() === "author" || nextnextNode.toLowerCase() === "editor")){
  // $("<author><personname><surname></surname><delimiter></delimiter><firstname></firstname></personname></author><delimiter></delimiter>").insertAfter($('#'+nextNodeid));
  // }else{
  $(
    '<name><surname></surname><delimiter></delimiter><given-names></given-names></name>'
  ).insertAfter($('#' + referenceNode));
  // }
  $('#ref')
    .find('*')
    .each(function () {
      $(this).removeAttr('id');
    });
  $('#form').empty();
  updateForm();
}
function cloneCurElementAr(ele) {
  $('#reference_editpreview').html('');
  var d = new Date();
  var dt = Date.parse(d);
  var referenceNode = $(ele).attr('targetid');
  var parentRefNode = $('#' + referenceNode);
  let nextNode = '';
  let nextnextNode = '';
  var nextNodeELe = $('#' + referenceNode).next();
  var nextnextNodeEle = $('#' + referenceNode)
    .next()
    .next();
  if (nextNodeELe.length > 0) {
    nextNode = $('#' + referenceNode).next()[0].tagName;
  }
  if (nextnextNodeEle.length > 0) {
    nextnextNode = $('#' + referenceNode)
      .next()
      .next()[0].tagName;
  }
  if (
    nextNode.toLowerCase() === 'delimiter' &&
    (nextnextNode.toLowerCase() === 'name' ||
      nextnextNode.toLowerCase() === 'editor')
  ) {
    var insertEle =
      "<name store='" +
      dt +
      "name'><surname store='" +
      dt +
      "surname'></surname><given-names store='" +
      dt +
      "given'></given-names></name><!--punc-->, <!--punc-->";
  } else {
    var insertEle =
      "<!--punc-->, <!--punc--><name store='" +
      dt +
      "name'><surname store='" +
      dt +
      "surname'></surname><given-names store='" +
      dt +
      "given'></given-names></personname>";
  }
  $(insertEle).insertAfter($('#' + referenceNode));
  var storeId = $('#ref')
    .find("[id='" + referenceNode + "']")
    .attr('store');
  var refEle = $('#finalSpanReference').find("[store='" + storeId + "']");
  $(insertEle).insertAfter(refEle);
  $('#ref')
    .find('*')
    .each(function () {
      $(this).removeAttr('id');
    });
  $('#form').empty();
  updateForm();
}
function updateReference(store_id) {
  $('#refEmptyError').addClass('hide');
  var deleteIconLength = $('#form').find('span.delEle').length;
  if (deleteIconLength > 0) {
    var localdata_set = $('.localstorevalue').val();
    storedata(localdata_set, 'EK');
    $('#lock').val('true');
    $('[targetid]').each(function () {
      var idVal = $(this).attr('targetid');
      if (idVal.includes('ELE')) {
        //$('#' + idVal).html($(this).html());
      }
    });
    var refeditId = $('#edit-ref-id').val();
    $('#ref *').removeAttr('id');
    var reference = $('#ref').html();
    var reference_previous = $('#ref-element-prev').html();
    var userName = $('#username').val();
    var d = new Date();
    var dt = Date.parse(d);
    var labelRef = '';
    var label_val = '';
    var InsId = dt + '_ins';
    var DelId = dt + '_del';
    var newRefInsert = $("#content [store='" + store_id + "']").hasClass(
      'new_referenceadded'
    );
    $('.picadiff').picadiff({
      leftContent: $('#ref-element-prev').text(),
      rightContent: $('#ref').text(),
    });
    ChangeToVxetrack(userName, InsId, DelId);
    var final_ref = $('.finalreference').html();
    var final_ref = $('#finalSpanReference').html();
    var listofComment = getAllComments($('#content ref-list')[0]);
    label_val = $("#content [store='" + store_id + "']")
      .find('label1')
      .html();
    var labelLength = $("#content [store='" + store_id + "']").find(
      'label1'
    ).length;
    if (listofComment.length === 0) {
      var labelRef = $("#content [store='" + store_id + "']")
        .find('label1')[0]
        .getAttribute('label_ref');
    }
    $("#content [store='" + store_id + "']").html('');
    let dragIcon =
      '<i class="material-icons-outlined ref-drag ui-sortable-handle" title="Reorder" spellcheck="false">drag_indicator</i>';
    if (listofComment.length === 0) {
      if (labelRef !== '' && labelRef !== null) {
        $("#content [store='" + store_id + "']").html(
          '<label1 label_ref="' + labelRef + '">' + label_val + '</label1>'
        );
      } else {
        $("#content [store='" + store_id + "']").html(
          '<label1>' + label_val + '</label1>'
        );
      }
    } else {
      $("#content [store='" + store_id + "']").html('<!--<label1></label1>-->');
    }
    if (newRefInsert) {
      $("#content [store='" + store_id + "']").append(
        dragIcon +
          '<span class="ins cts-1" data-cid="2" contenteditable="true" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_text"><mixed-citation>' +
          reference +
          '</mixed-citation></span>'
      );
    } else {
      $("#content [store='" + store_id + "']").append(
        '<span store="' +
          dt +
          '_sec" data-username="' +
          userName +
          '" data-DelId="' +
          DelId +
          '" data-role="ref-org" refold="1" class="del cts-1"><mixed-citation>' +
          reference_previous +
          '</mixed-citation></span><span store="' +
          dt +
          '_sec" data-username="' +
          userName +
          '" data-InsId="' +
          InsId +
          '" data-role="ref-org" refupdated="1" class="ins cts-1"><mixed-citation>' +
          reference +
          '</mixed-citation></span>'
      );
      $("#content [store='" + store_id + "']").append(final_ref);
      $("#content [store='" + store_id + "']").prepend(dragIcon);
    }
    var publication_select = $('#publication_select').val();
    $("#content [store='" + store_id + "']").attr('role', publication_select);
    $('#refEditModal').modal('hide');
    var html_count = $('#content').text().length;
    $('#character_count').val(html_count);
    var msg = 'Reference Edit(HTML Count:' + html_count + ')';
    autosavefunction_vxe(msg);
    $('#lock').val('false');
  } else {
    $('#refEmptyError').removeClass('hide');
  }
}
function ChangeToVxetrack(userName, InsId, DelId) {
  var d = new Date();
  var dt = Date.parse(d);
  var uniid = Date.parse(d);
  $('.right').find('span.equal').contents().unwrap();
  $('.right')
    .find('.del, .ins')
    .each(function () {
      $(this).attr('data-insid', InsId);
      $(this).attr('data-delid', DelId);
      $(this).attr('data-username', userName);
      $(this).attr('data-user', 'current-user');
      $(this).attr('data-role', 'ref-dul');
      $(this).attr('data-time', dt);
      $(this).attr('data-id', uniid);
      dt++;
    });
  var text = $('.right').html();
  $('.finalreference').html(
    '<span data-role="ref-duplicate"><mixed-citation>' +
      text +
      '</mixed-citation></span>'
  );
}
function cloneCurEditorElement(ele) {
  $('#reference_editpreview').html('');
  var referenceNode = $(ele).attr('targetid');
  var parentRefNode = $('#' + referenceNode).parent();
  var nextNode = $('#' + referenceNode).next()[0].tagName;
  var nextNodeid = $('#' + referenceNode).next()[0].id;
  var nextnextNode = $('#' + referenceNode)
    .next()
    .next()[0].tagName;
  if (
    nextNode.toLowerCase() === 'delimiter' &&
    (nextnextNode.toLowerCase() === 'author' ||
      nextnextNode.toLowerCase() === 'editor')
  ) {
    $(
      '<editor><personname><firstname></firstname><surname></surname></personname></editor><delimiter></delimiter>'
    ).insertAfter($('#' + nextNodeid));
  } else {
    $(
      '<delimiter></delimiter><editor><personname><firstname></firstname><surname></surname></personname></editor>'
    ).insertAfter($('#' + referenceNode));
  }

  $('#ref')
    .find('*')
    .each(function () {
      $(this).removeAttr('id');
    });
  $('#form').empty();
  updateForm();
}
function delParElement(ele) {
  $('#reference_editpreview').html('');
  var referenceNode = $(ele).attr('targetid');
  var parentRefNode = $('#' + referenceNode);
  $(parentRefNode).remove();
  $('#ref')
    .find('*')
    .each(function () {
      $(this).removeAttr('id');
    });
  $('#form').empty();
  updateForm();
}
function delParElementNew(ele) {
  $('#reference_editpreview').html('');
  $(ele)
    .find('[targetid]')
    .each(function () {
      var referenceNode = $(this).attr('targetid');
      var parentRefNode = $('#' + referenceNode);
      var storeId = $('#ref')
        .find("[id='" + referenceNode + "']")
        .attr('store');
      var spanText = refTrack(referenceNode, '', storeId);
      $('#finalSpanReference')
        .find("[store='" + storeId + "']")
        .html(spanText);
    });
  $(ele)
    .find('[targetid]')
    .each(function () {
      var referenceNode = $(this).attr('targetid');
      var parentRefNode = $('#' + referenceNode);
      if (parentRefNode.length > 0) {
        var tagName = $('#' + referenceNode)[0].tagName;
        if (tagName === 'I' || tagName === 'B' || tagName === 'U') {
          var parentTagName = $(parentRefNode).parent()[0].tagName;
          if (parentTagName !== 'DIV') {
            $(parentRefNode).parent().remove();
          } else {
            $(parentRefNode).remove();
          }
        } else {
          $(parentRefNode).remove();
        }
      }
    });
  var mainId = $(ele).attr('targetid');
  if (mainId !== '' && mainId !== null && mainId !== undefined) {
    var parentRefNode = $('#' + mainId);
    $(parentRefNode).remove();
  }
  $('#ref')
    .find('*')
    .each(function () {
      $(this).removeAttr('id');
    });
  $('#form').empty();
  updateForm();
}
$('#reference_changeElement').on('change', function () {
  $('#reference_editpreview').html('');
  var element_name = $(this).val();
  if (element_name != '') {
    var affnode = getSelectedNode();
    var referenceNode = affnode.getAttribute('targetid');
    if (referenceNode === null) {
      var childCount = $(affnode).find('[targetid]').length;
      if (childCount > 0) {
        referenceNode = $(affnode)
          .find('[targetid]')[0]
          .getAttribute('targetid');
      } else {
        affnode = affnode.closest('[targetid]');
        if (affnode !== null) {
          referenceNode = affnode.getAttribute('targetid');
        }
      }
    }
    let refNode = $('#ref').find("[id='" + referenceNode + "']");
    if (refNode.length > 0) {
      refNode = refNode[0];
      if (refNode.tagName === 'I') {
        referenceNode = refNode.parentElement.getAttribute('id');
      }
    }
    var d = new Date();
    var dt = Date.parse(d);
    var change_val = $('#' + referenceNode).html();
    var storeId = $('#ref')
      .find("[id='" + referenceNode + "']")
      .attr('store');
    if (element_name == 'delimiter') {
      insertEle =
        " <delimiter store='delimiter_" +
        dt +
        "'>" +
        change_val +
        '</delimiter> ';
    } else if (element_name == 'chaptertitle') {
      insertEle =
        " <chapter-title store='chapter_title_" +
        dt +
        "'>" +
        change_val +
        '</chapter-title> ';
    } else if (element_name == 'booktitle') {
      insertEle =
        " <source1 store='source1_" + dt + "'>" + change_val + '</source1> ';
    } else if (element_name == 'articletitle') {
      insertEle =
        " <article-title store='article_title_" +
        dt +
        "'>" +
        change_val +
        '</article-title> ';
    } else if (element_name == 'journaltitle') {
      insertEle =
        " <source1 store='source1_" + dt + "'>" + change_val + '</source1> ';
    } else if (element_name == 'publisher-loc') {
      insertEle =
        " <publisher-loc store='publisher_" +
        dt +
        "'>" +
        change_val +
        '</publisher-loc> ';
    } else if (element_name == 'pubdate') {
      insertEle = " <year store='year_" + dt + "'>" + change_val + '</year> ';
    } else if (element_name == 'publisher') {
      insertEle =
        " <publisher-name store='publisher_" +
        dt +
        "'>" +
        change_val +
        '</publisher-name> ';
    } else if (element_name == 'volumenum') {
      insertEle =
        " <volume1 store='volume1_" + dt + "'>" + change_val + '</volume1> ';
    } else if (element_name == 'issue') {
      insertEle =
        " <issue1 store='issue1_" + dt + "'>" + change_val + '</issue1> ';
    } else if (element_name == 'surname') {
      insertEle =
        " <surname store='surname_" + dt + "'>" + change_val + '</surname> ';
    } else if (element_name == 'given-names') {
      insertEle =
        " <given-names store='given_" +
        dt +
        "'>" +
        change_val +
        '</given-names> ';
    } else if (element_name == 'collab') {
      insertEle =
        " <collab store='collab_" + dt + "'>" + change_val + '</collab> ';
    } else if (element_name == 'uri') {
      insertEle = " <uri store='uri_" + dt + "'>" + change_val + '</uri> ';
    } else if (element_name == 'pub-id') {
      insertEle =
        " <pub-id store='pub_" + dt + "'>" + change_val + '</pub-id> ';
    } else if (element_name == 'fpage') {
      insertEle =
        " <fpage1 store='fpage1_" + dt + "'>" + change_val + '</fpage1> ';
    } else if (element_name == 'lpage') {
      insertEle =
        " <lpage1 store='lpage1_" + dt + "'>" + change_val + '</lpage1> ';
    } else if (element_name == 'issuenum') {
      insertEle =
        " <issuenum store='issuenum_" + dt + "'>" + change_val + '</issuenum> ';
    }
    if (insertEle !== '') {
      $('#' + referenceNode).replaceWith(insertEle);
      var refEle = $('#finalSpanReference').find("[store='" + storeId + "']");
      if (refEle.length > 0) {
        $('#finalSpanReference [store="' + storeId + '"]').replaceWith(
          insertEle
        );
      }
      $('#ref')
        .find('*')
        .each(function () {
          $(this).removeAttr('id');
        });
      $('#form').empty();
      updateForm();
    }
  }
});

function changeaccept_group(id, cls) {
  $('#lock').val('true');
  $(".del[group_tag='" + id + "']").remove();
  $(".ins[group_tag='" + id + "']")
    .contents()
    .unwrap();

  $('#' + id).remove();
  $(cls).parent().remove();
  updateRevisions();
  // savexml_changes(1);
  //autosavefunction_vxe();
  browser_details('changeaccept_group');
  $('#lock').val('fasle');
}

function changereject_group(id, cls) {
  $('#lock').val('true');
  $(".del[group_tag='" + id + "']")
    .contents()
    .unwrap();
  $(".ins[group_tag='" + id + "']").remove();

  $('#' + id).remove();
  $(cls).parent().remove();
  updateRevisions();
  // savexml_changes(1);
  //autosavefunction_vxe();
  browser_details('changereject_group');
  $('#lock').val('fasle');
}

function acceptOrRejectChange(action) {
  var affnode = getSelectedNode();
  var domTime = $('.custom-menu').attr('id');
  if (domTime != undefined) {
    if (action === 'reject') changeReject(domTime);
    else changeAccept(domTime);
  }
  $('.custom-menu').hide(100);
}
function changeacceptAction(id) {
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set, 'EK');
  $("#content table1[data-time='" + id + "']").removeAttr('data-username');
  $("#content table1[data-time='" + id + "']").removeAttr('data-time');
  $("#content title1[data-time='" + id + "']").removeAttr('data-username');
  $("#content title1[data-time='" + id + "']").removeAttr('data-time');
  $("#content label1[data-time='" + id + "']").removeAttr('data-username');
  $("#content label1[data-time='" + id + "']").removeAttr('data-time');
  $("#content figure1[data-time='" + id + "']").removeAttr('data-username');
  $("#content figure1[data-time='" + id + "']").removeAttr('data-time');
  $("#content caption1[data-time='" + id + "']").removeAttr('data-username');
  $("#content caption1[data-time='" + id + "']").removeAttr('data-time');
  $("#content .del[data-time='" + id + "']").remove();
  $("#content .ins[data-time='" + id + "']")
    .contents()
    .unwrap();
  $("#content b[data-time='" + id + "']").removeAttr('data-username');
  $("#content b[data-time='" + id + "']").removeAttr('data-time');
  $("#content i[data-time='" + id + "']").removeAttr('data-username');
  $("#content i[data-time='" + id + "']").removeAttr('data-time');
  $("#content u[data-time='" + id + "']").removeAttr('data-username');
  $("#content u[data-time='" + id + "']").removeAttr('data-time');
  $("#content span[data-time='" + id + "']").removeAttr('data-username');
  $("#content span[data-time='" + id + "']").removeAttr('data-time');
  $("#content sup[data-time='" + id + "']").removeAttr('data-time');
  $("#content sup[data-time='" + id + "']").removeAttr('data-username');
  $("#content sub[data-time='" + id + "']").removeAttr('data-time');
  $("#content sub[data-time='" + id + "']").removeAttr('data-username');
  $("#content mathquery[data-time='" + id + "']").removeAttr('data-time');
  $("#content mathquery[data-time='" + id + "']").removeAttr('data-username');
  var msg = 'changeaccept';
  autosavefunction_vxe(msg);
}
function reference_rightmovement(referenceNode) {
  let tagNameEle = $('#' + referenceNode).prop('tagName');
  if (tagNameEle === 'I') {
    let curEle = $('#' + referenceNode);
    if (curEle.length > 0) {
      let parEle = curEle[0].parentElement;
      if (!!parEle) {
        referenceNode = parEle.getAttribute('id');
      }
    }
  }
  var move_right = $('#' + referenceNode)
    .next()
    .attr('id');
  var removeStore = $('#' + referenceNode).attr('store');
  var store = $('#' + referenceNode)
    .next()
    .attr('store');
  if (move_right != undefined) {
    $('#reference_editpreview').html('');
    var reference_val = $('#' + referenceNode).html();
    var tag_Names = $('#' + referenceNode).prop('tagName');
    $('#' + move_right).after(
      ' <' +
        tag_Names +
        " store='" +
        removeStore +
        "'>" +
        reference_val +
        '</' +
        tag_Names +
        '>'
    );
    $("#finalSpanReference [store='" + removeStore + "']").remove();
    $("#finalSpanReference [store='" + store + "']").after(
      ' <' +
        tag_Names +
        " store='" +
        removeStore +
        "'>" +
        reference_val +
        '</' +
        tag_Names +
        '>'
    );
    $('#' + referenceNode).remove();
    $('#ref')
      .find('*')
      .each(function () {
        $(this).removeAttr('id');
      });
    $('#form').empty();
    updateForm();
  }
}
function reference_leftmovement(referenceNode) {
  let tagNameEle = $('#' + referenceNode).prop('tagName');
  if (tagNameEle === 'I') {
    let curEle = $('#' + referenceNode);
    if (curEle.length > 0) {
      let parEle = curEle[0].parentElement;
      if (!!parEle) {
        referenceNode = parEle.getAttribute('id');
      }
    }
  }
  var move_left = $('#' + referenceNode)
    .prev()
    .attr('id');
  var removeStore = $('#' + referenceNode).attr('store');
  var store = $('#' + referenceNode)
    .prev()
    .attr('store');
  if (move_left != undefined) {
    $('#reference_editpreview').html('');
    var reference_val = $('#' + referenceNode).html();
    var tag_Names = $('#' + referenceNode).prop('tagName');
    $('#' + move_left).before(
      ' <' +
        tag_Names +
        " store='" +
        removeStore +
        "'>" +
        reference_val +
        '</' +
        tag_Names +
        '>'
    );
    $("#finalSpanReference [store='" + removeStore + "']").remove();
    $("#finalSpanReference [store='" + store + "']").before(
      ' <' +
        tag_Names +
        " store='" +
        removeStore +
        "'>" +
        reference_val +
        '</' +
        tag_Names +
        '>'
    );
    $('#' + referenceNode).remove();
    $('#ref')
      .find('*')
      .each(function () {
        $(this).removeAttr('id');
      });
    $('#form').empty();
    updateForm();
  }
}
$('.numbervalidate').keypress(function (e) {
  //if the letter is not digit then display error and don't type anything
  if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
    //display error message
    return false;
  }
});
function footnoteno_insert() {
  const userId = $('#userid').val();
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set, 'EK');
  var affnode = getSelectedNode();
  var selected_parent = affnode.parentElement.tagName;
  var grand_parent = affnode.parentElement.parentNode.tagName;
  var selected_node = affnode.tagName;
  if (
    selected_parent != 'FOOTNOTE' &&
    selected_node != 'FOOTNOTE' &&
    grand_parent != 'FOOTNOTE' &&
    selected_node != 'FOOTNOTENO' &&
    selected_parent != 'FOOTNOTENO' &&
    selected_parent != 'BIBLIOMIXED' &&
    selected_node != 'BIBLIOMIXED' &&
    grand_parent != 'BIBLIOMIXED'
  ) {
    var d = new Date();
    var dt = Date.parse(d);
    var userName = $('#username').val();
    pasteHtmlAtCaret(
      '<footnote1 role="end-ch-note" linkend="RL-' +
        dt +
        '" data-time="' +
        dt +
        '" store="' +
        dt +
        '" contenteditable="false"></footnote1>'
    );
    var prev_footnotelabel = footnoteno_value(dt);
    if (prev_footnotelabel === undefined) {
      var prev_footnotelabel = 0;
    }
    var labelno = +prev_footnotelabel + +1;
    $("#content [data-time='" + dt + "']").attr('label', labelno);
    $("#content [data-time='" + dt + "']").html(
      '<superscript store="' +
        dt +
        '_s" contenteditable="false"><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_sup' +
        labelno +
        '">' +
        labelno +
        '</span></superscript>'
    );
    footnote_insertion(dt, prev_footnotelabel);
  } else {
    swal(
      'Warning!',
      'You have no access to add Footnote inside the Footnote and Reference Element.'
    );
    $('.confirm').css({
      float: 'inherit',
      'margin-top': '50px',
      'margin-left': '130px',
    });
    $('.sweet-alert').css({ width: '428px', left: '50%' });
  }
}
function footnoteno_value(dt) {
  var toReturn;
  $(
    "#content FOOTNOTE1[role='end-bk-note'],FOOTNOTE1[role='end-ch-note']"
  ).each(function () {
    var data_time = $(this).attr('data-time');
    if (data_time == dt) {
      return false;
    }
    if ($(this).attr('label') != undefined) {
      toReturn = $(this).attr('label');
    }
  });
  return toReturn;
}
function footnote_insertion(dt, label_no) {
  $('#lock').val('true');
  var userName = $('#username').val();
  const userId = $('#userid').val();
  var footnote_val = $('.footnote_insert').val();
  var label_nos = +label_no + +1;
  var i = 0;
  var j = 0;
  $('#content FOOTNOTE').each(function () {
    var role = $(this).attr('role');
    if (role == 'end-ch-note') {
      i++;
    } else {
      j++;
    }
  });
  var footnote_role = 'end-ch-note';
  if (i < j) {
    footnote_role = 'end-bk-note';
  }
  if (label_no === 0) {
    $("#content FOOTNOTE[label='1']").before(
      '<footnote role="' +
        footnote_role +
        '" label="' +
        label_nos +
        '" xmlid="RL-' +
        dt +
        '" store="' +
        dt +
        '" contenteditable="true" class="new_footnoteadded"><footnoteno store="' +
        dt +
        '_st" contenteditable="true"><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_if">' +
        label_nos +
        '</span></footnoteno><para store="' +
        dt +
        '_p" contenteditable="true">&nbsp;</para></footnote>'
    );
  } else {
    $("#content FOOTNOTE[label='" + label_no + "']").after(
      '<footnote role="' +
        footnote_role +
        '" label="' +
        label_nos +
        '" xmlid="RL-' +
        dt +
        '" store="' +
        dt +
        '" contenteditable="true" class="new_footnoteadded"><footnoteno store="' +
        dt +
        '_st" contenteditable="true"><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
        userId +
        ' data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_if">' +
        label_nos +
        '</span></footnoteno><para store="' +
        dt +
        '_p" contenteditable="true">&nbsp;</para></footnote>'
    );
  }
  var element = $("para[store='" + dt + "_p']")[0];
  setCaretPos(element, element, 0, 0);
  $('.position_rechange').css('position', 'fixed');
  element.scrollIntoView({
    behavior: 'instant',
    block: 'center',
    inline: 'nearest',
  });
  $('.position_rechange').css('position', '');
  footnote_increment(dt);
  var msg = 'New footnote inserted.';
  autosavefunction_vxe(msg);
  scrollToLastTrack(newDt);
  $('#lock').val('false');
}
function footnote_increment(dt) {
  var userName = $('#username').val();
  const userId = $('#userid').val();
  var match_attr = 0;
  $('#content FOOTNOTE').each(function () {
    var old_notes = $(this).attr('label');
    var match_data = $(this).attr('store');
    if (old_notes != undefined) {
      if (match_data == dt || match_attr == 1) {
        if (match_attr == 1) {
          var old_note = $(this).attr('label');
          var new_note = +old_notes + +1;
          $(this).attr('label', new_note);
          var linkend_id = $(
            "#content FOOTNOTE[label='" + new_note + "']"
          ).attr('xmlid');
          $("#content FOOTNOTE1[linkend='" + linkend_id + "']").removeAttr(
            'label'
          );
          $("#content FOOTNOTE1[linkend='" + linkend_id + "']").attr(
            'label',
            new_note
          );
          $("#content FOOTNOTE1[linkend='" + linkend_id + "']")
            .find('superscript')
            .html(
              '<span class="del cts-1" data-cid="2" data-userid=' +
                userId +
                ' contenteditable="false" data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_d' +
                old_note +
                '">' +
                old_note +
                '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
                userId +
                ' data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_i' +
                new_note +
                '">' +
                new_note +
                '</span>'
            );
          $("#content FOOTNOTE[xmlid='" + linkend_id + "']")
            .find('footnoteno')
            .html(
              '<span class="del cts-1" data-cid="2" data-userid=' +
                userId +
                ' contenteditable="false" data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_df' +
                old_note +
                '">' +
                old_note +
                '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
                userId +
                ' data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_if' +
                new_note +
                '">' +
                new_note +
                '</span>'
            );
        }
        match_attr = 1;
      }
    }
  });
}
// footnote deletion

function findNext_Text(id) {
  var html = $('#content').html();
  var changeSpanTag = new RegExp(
    '<span ([^>]+ data-time="' + id + ')[^>]+>(.*?)</span>',
    'g'
  );
  html = html.replace(changeSpanTag, '[/span]');
  var cleanTag = new RegExp('<[^>]+>', 'g');
  html = html.replace(cleanTag, '');
  re1 = '\\[\\/span\\](.{0,25})';
  var re = new RegExp('' + re1 + '', 'g');
  var result = re.exec(html);
  if (result != null && result.length > 0) {
    return result[1];
  } else {
    return '';
  }
}

function footnotedelete() {
  $('.footnotelist_del').empty();
  $('.footnotelist_del').append(
    "<ol class='footnote-del-list' id='footnote-del-ol'></ol>"
  );
  $('#content footnote[role=end-ch-note],footnote[role=end-bk-note]').each(
    function () {
      if ($(this).find('footnoteno').find('.ins').text() != '') {
        var footnote_name = $(this).find('footnoteno').find('.ins').text();
      } else {
        var footnote_name = $(this).find('footnoteno').text();
      }
      var store_id = $(this).attr('store');
      var xml_id = $(this).attr('xmlid');
      $('#footnote-del-ol').append(
        '<li>footnote ' +
          footnote_name +
          '<a style="float:right;" onclick="deletefootnote(' +
          store_id +
          ');" ><i class="material-icons deleteIcon">close</i></a></li>'
      );
    }
  );
  $('#deleteFootnote').modal('show');
}
function deletefootnote(store_id) {
  $('#lock').val('true');
  var parent_id = $('chapter').attr('store');
  var html_content = $('#content chapter').html();
  $('.storelocal_data').append(
    '<chapter role=' + parent_id + '>' + html_content + '</chapter>'
  );
  var userName = $('#username').val();
  var userId = $('#userid').val();
  var d = new Date();
  var dt = Date.parse(d);
  var check_attr = 0;
  var footnote_text = $("#content [store='" + store_id + "']").html();
  var tag_name = $("#content [store='" + store_id + "']").prop('tagName');
  var footnote_label = $("#content [store='" + store_id + "']").attr('label');
  $("#content FOOTNOTE1[label='" + footnote_label + "']")
    .find('superscript')
    .html(
      '<span class="del cts-1" data-cid="2" data-userid=' +
        userId +
        ' contenteditable="false" data-username="' +
        userName +
        '" data-time="' +
        dt +
        '_d' +
        footnote_label +
        '">' +
        footnote_label +
        '</span>'
    );
  $("#content FOOTNOTE1[label='" + footnote_label + "']").removeAttr('label');
  $("#content [store='" + store_id + "']").html(
    '<span class="del cts-9" data-cid="4" data-userid=' +
      userId +
      ' data-username="' +
      userName +
      '" data-time="' +
      dt +
      '_s" title="Deleted by ' +
      userName +
      '">' +
      footnote_text +
      '</span>'
  );
  $('#content footnote').each(function () {
    var old_note = $(this).attr('label');
    var d = new Date();
    var dt = Date.parse(d);
    var cls_attr = $(this).find('span').attr('class');
    if (
      (cls_attr === 'del cts-9' && old_note != undefined) ||
      check_attr === 1
    ) {
      var new_note = old_note - 1;
      $(this).removeAttr('label');
      if (check_attr === 1) {
        if (old_note != undefined) {
          $(this).attr('label', new_note);
          var linkend_id = $("FOOTNOTE[label='" + new_note + "']").attr(
            'xmlid'
          );
          $("#content FOOTNOTE1[label='" + old_note + "']")
            .find('superscript')
            .html(
              '<span class="del cts-1" data-cid="2" data-userid=' +
                userId +
                ' contenteditable="false" data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_d' +
                old_note +
                '">' +
                old_note +
                '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
                userId +
                ' data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_i' +
                new_note +
                '">' +
                new_note +
                '</span>'
            );
          $("#content FOOTNOTE[xmlid='" + linkend_id + "']")
            .find('footnoteno')
            .html(
              '<span class="del cts-1" data-cid="2" data-userid=' +
                userId +
                ' contenteditable="false" data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_df' +
                old_note +
                '">' +
                old_note +
                '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
                userId +
                ' data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_if' +
                new_note +
                '">' +
                new_note +
                '</span>'
            );
          $("#content FOOTNOTE1[label='" + old_note + "']").attr(
            'label',
            new_note
          );
          $("#content FOOTNOTE1[label='" + old_note + "']").attr(
            'linkend',
            linkend_id
          );
        }
      }
      check_attr = 1;
    }
  });
  var msg = 'deletefootnote';
  autosavefunction_vxe(msg);
  scrollToLastTrack(dt);
  $('#lock').val('false');
  $('#deleteFootnote').modal('hide');
}

function changeaccept_style(id, cls) {
  $('#lock').val('true');
  $(".del[data-time='" + id + "']").remove();
  $(".ins[data-time='" + id + "']")
    .contents()
    .unwrap();
  $("b[data-time='" + id + "']").removeAttr('data-time');
  $("b[data-time='" + id + "']").removeAttr('data-username');
  $("i[data-time='" + id + "']").removeAttr('data-time');
  $("i[data-time='" + id + "']").removeAttr('data-username');
  $("u[data-time='" + id + "']").removeAttr('data-time');
  $("u[data-time='" + id + "']").removeAttr('data-username');
  $("span[data-time='" + id + "']").removeAttr('data-time');
  $("span[data-time='" + id + "']").removeAttr('data-username');
  $("sup[data-time='" + id + "']").removeAttr('data-time');
  $("sup[data-time='" + id + "']").removeAttr('data-username');
  $("sub[data-time='" + id + "']").removeAttr('data-time');
  $("sub[data-time='" + id + "']").removeAttr('data-username');
  $(cls).parent().remove();
  updateRevisions();
  var msg = 'changeacceptStyle';
  autosavefunction_vxe(msg);
  $('#lock').val('fasle');
}

function changereject_style(id, cls) {
  $('#lock').val('true');
  $(".del[data-time='" + id + "']")
    .contents()
    .unwrap();
  $(".ins[data-time='" + id + "']").remove();
  $("b[data-time='" + id + "']")
    .contents()
    .unwrap();
  $("i[data-time='" + id + "']")
    .contents()
    .unwrap();
  $("u[data-time='" + id + "']")
    .contents()
    .unwrap();
  $("span[data-time='" + id + "']")
    .contents()
    .unwrap();
  $("sup[data-time='" + id + "']")
    .contents()
    .unwrap();
  $("sub[data-time='" + id + "']")
    .contents()
    .unwrap();
  $('#content para label1').removeAttr('para_label');
  $('#content label1').removeAttr('label_attr');
  $(cls).parent().remove();
  updateRevisions();
  var msg = 'changerejectStyle';
  autosavefunction_vxe(msg);
  $('#lock').val('false');
}

function gotoChange_style(id, cur) {
  $('#lock').val('true');
  //$(".review-item_sel").attr("class","review-item");
  //cur.setAttribute("class", "review-item_sel");
  var element = $(
    ".del[data-time='" +
      id +
      "'], .ins[data-time='" +
      id +
      "'], b[data-time='" +
      id +
      "'], i[data-time='" +
      id +
      "'], span[data-time='" +
      id +
      "'], u[data-time='" +
      id +
      "'], sup[data-time='" +
      id +
      "'], sub[data-time='" +
      id +
      "'], para[data-time='" +
      id +
      "'], li[data-time='" +
      id +
      "'], sub[data-time='" +
      id +
      "'], dialogue[data-time='" +
      id +
      "'], section1[data-time='" +
      id +
      "'], para[data-time='" +
      id +
      "']"
  )[0];
  setCaretPos(element, element, 0, 0);
  $('.position_rechange').css('position', 'fixed');
  element.scrollIntoView({
    behavior: 'instant',
    block: 'center',
    inline: 'nearest',
  });
  $('.position_rechange').css('position', '');

  $("[style='background-color: yellow;']").removeAttr('style');
  $("[style='background-color: rgb(255, 255, 0);']").removeAttr('style');
  $('comment').css('background-color', '');
  $('query').css('background-color', '');

  $('.editor').click(function () {
    $('#lock').val('true');
    $("[style='background-color: yellow;']").removeAttr('style');
    $("[style='background-color: rgb(255, 255, 0);']").removeAttr('style');
    $('comment').css('background-color', '');
    $('query').css('background-color', '');
    $('#lock').val('false');
  });

  $("#content [data-time='" + id + "']").css('background-color', 'yellow');

  $('#lock').val('false');
}

function style_editing(selectedStyle) {
  $('#loading-wrapper').show();
  var api_url = $('#api_url').val();
  var chapter_id = $('#chapterid').val();
  var project_id = $('#projectid').val();

  fetch(api_url + '/VXE/StyleEditingListByGroupname/', {
    method: 'POST',
    body: JSON.stringify({
      ProjectId: project_id,
      ChapterId: chapter_id,
      Groupname: selectedStyle,
    }),
  })
    .then((res) => res.json())
    .then((response) => {
      $('#lock').val('true');
      $('#content *').removeAttr('group_tag');
      $('#style_regex').html('');
      $('#style_regex').html(response.style_string);
      $('#description_value').css('display', 'block');
      $('#description_value').html('');
      $('.style-edit-heading').text('Style Editing (' + selectedStyle + ')');
      var localdata_set = $('.localstorevalue').val();
      storedata(localdata_set, 'EK');
      var num = 1;
      var reg = 1;

      $('description_reg,find_reg,replace_reg').each(function () {
        var find_replace = $(this).text();
        if (num == 1)
          $('#description_value').append(
            '<p class="description_title" title="' +
              find_replace +
              '">' +
              find_replace +
              '</p>'
          );
        else if (num == 2) {
          $('#find').val('');
          $('#find').val(find_replace);
          $('#wildcard_search').prop('checked', true);
          $('#superscript_character').prop('indeterminate', true);
          $('#superscript_character').val('superscriptnull');
        } else if (num == 3) {
          $('#replace').val('');
          $('.replace_hyphen').val('');
          if (find_replace == 'ITALIC HYPHEN' || find_replace == 'ITALIC') {
            $('#replace_hyphen').val(find_replace);
            $('#italic_characterrep').val('italicfalse');
            italic_characterrep();
          } else if (find_replace == 'ITALICFIRST') {
            $('.replace_hyphen').val(find_replace);
          } else if (find_replace.indexOf('SMALLCAPS') != -1) {
            var find_replaceword = find_replace.split('|');
            $('.other_replaceword').val(find_replaceword[1]);
            $('.replace_hyphen').val(find_replaceword[0]);
            $('#match_case').prop('checked', true);
          } else if (find_replace.indexOf('OPERATORITALIC') != -1) {
            var find_replaceword = find_replace.split('|');
            $('.other_replaceword').val(find_replaceword[1]);
            $('.replace_hyphen').val(find_replaceword[0]);
          } else {
            $('#replace').val(find_replace);
          }
          $('#wildcard_rep').prop('checked', true);
          var styleEditReplace = true;
          replace_allcontent(
            'regex_style' + reg,
            'group' + reg,
            styleEditReplace
          );
          var group_length = $(
            "#content [group_tag='group" + reg + "']"
          ).length;
          if (group_length > 0) {
            var group_tag = 'group' + reg;
            var changes = group_length + ' Changes';
            if (group_length == 1) var changes = group_length + ' Change';
            $('#description_value').append(
              '<i class="material-icons-outlined group" aria-hidden="true" onClick="styleEdit_view(this);">add_box <span class="robot-font"> ' +
                changes +
                '</span><i class="material-icons cstm-success-color float-right review-accept mr-2" title="Accept Change" onclick="changeaccept_group(' +
                String.fromCharCode(39) +
                '' +
                group_tag.toString().trim() +
                '' +
                String.fromCharCode(39) +
                ',this);" >done</i><i class="review-cancel material-icons cstm-danger-color float-right" title="Reject Change" onclick="changereject_group(' +
                String.fromCharCode(39) +
                '' +
                group_tag.toString().trim() +
                '' +
                String.fromCharCode(39) +
                ',this);" >close</i></i>'
            );
            $('#description_value').append(
              '<div class="group_value" id="group' +
                reg +
                '" style="display:none;"><span class="regex_style' +
                reg +
                '"></span></div>'
            );
            $("#content [group_tag='group" + reg + "']").each(function () {
              var style_text = $(this).text();
              var d = $(this).attr('data-time');
              // var preText = findPre_Text(d);
              var nextText = findNext_Text(d);
              $('#group' + reg).append(
                '<p onClick="gotoChange_style(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ',this)"><span class="style-edit-result">' +
                  style_text +
                  '</span> ' +
                  nextText.substring(0, 10) +
                  '<i class="review-cancel material-icons cstm-danger-color float-right" title="Reject Change" onclick="changereject_style(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ',this);">close</i><i class="review-accept material-icons cstm-success-color float-right mr-2" title="Accept Change" onclick="changeaccept_style(' +
                  String.fromCharCode(39) +
                  '' +
                  d.toString().trim() +
                  '' +
                  String.fromCharCode(39) +
                  ',this);">done</i></p>'
              );
            });
          }
          num = 0;
        }
        num = num + 1;
        reg = reg + 1;
      });
      $('.description_title').each(function () {
        var tag_names = $(this).next().prop('tagName');
        if (tag_names != 'I') $(this).hide();
      });
      if ($('#description_value i.group').length == 0)
        $('#description_value').html(
          "<span class='no-result-txt'>No Result found</span>"
        );
      var msg = 'styleEditing';
      autosavefunction_vxe(msg);
      $('#lock').val('false');
      $('#loading-wrapper').hide();
      $('.btn-clear').addClass('hide');
      $('.search-result').css('padding', '0px');
    })
    .catch(function (error) {
      let Styletitles = $('.description_title');
      Array.from(Styletitles).forEach((dat) => {
        if ($(dat).next().prop('tagName') !== 'I') $(dat).remove();
      });
      $('#loading-wrapper').hide();
      var msg = 'styleEditing';
      autosavefunction_vxe(msg);
      $('#loading-wrapper').hide();
    });
}

function italic_characterrep() {
  var italic_val = $('#italic_characterrep').val();
  if (italic_val == 'italicfalse') {
    $('#italic_characterrep').prop('checked', true);
    $('#italic_characterrep').val('italictrue');
  } else if (italic_val == 'italictrue') {
    $('#italic_characterrep').prop('indeterminate', true);
    $('#italic_characterrep').val('italicnull');
  } else {
    $('#italic_characterrep').prop('checked', false);
    $('#italic_characterrep').val('italicfalse');
  }
}

var editor;
editor = com.wiris.jsEditor.JsEditor.newInstance({ language: 'en' });

$(document).on('click', 'disp-formula img', function (e) {
  $('annotation').remove();
  var store_id = $(this).closest('disp-formula').attr('store');
  var math_equn = $(this).closest('disp-formula').find('mathphrase').html();
  var d = new Date();
  var dt = Date.parse(d);
  var userName = $('#username').val();
  $('#mathEditor').modal('show');
  $('#editorContentError').addClass('hide');
  $('#editorContent').removeClass('hide');
  if (typeof math_equn !== 'undefined' && math_equn !== '') {
    $('#FMathEd1_ads').css('display', 'none');
    $('#mathml_image').show();
    $('#mathML_newEdit').hide();
    document.getElementById('store_mathml').value = '';
    document.getElementById('store_mathml').value = math_equn;
    changeMathML();
    $('#mathml_image').attr('onClick', 'getPng(' + store_id + ');');
  } else {
    $('#editorContentError').removeClass('hide');
    $('#editorContent').addClass('hide');
  }
});

function styleEdit_view(cls) {
  $(cls).next('div').toggle();
}

function changeMathML() {
  if (editor != null) {
    var ta = document.getElementById('store_mathml').value;
    editor.insertInto(document.getElementById('editorContainer'));
    if (ta != '') {
      editor.setMathML(ta);
      document.getElementById('store_mathml').style.color = null;
    } else {
      console.log('empty equation');
    }
    // let dataLocalStorageStringify = JSON.stringify(ta);
    // localStorage.setItem('oldEq', dataLocalStorageStringify);
  }
}
function change_headingelement(ele) {
  var affnodeas = getSelectedNode();
  var msgText = affnodeas.innerText;
  $('#heading-warning').text('Please select the content for add heading!');
  if (findAncestor(affnodeas, 'pdf-editor')) {
    var userName = $('#username').val();
    var d = new Date();
    var dt = Date.parse(d);
    var selected_tagName = affnodeas.tagName;
    if (selected_tagName !== 'TITLE1') {
      affnodeas = affnodeas.closest('title1');
    }
    var tag_Name = affnodeas.parentElement.tagName;
    if (tag_Name == 'SEC') {
      var localdata_set = $('.localstorevalue').val();
      storedata(localdata_set, 'EK');
      var previous_val = affnodeas.parentElement.getAttribute('sec-type');
      if (previous_val !== ele) {
        affnodeas.parentElement.setAttribute('prev_role', previous_val);
        affnodeas.parentElement.setAttribute('sec-type', ele);
        affnodeas.setAttribute('title', ele);
        affnodeas.parentElement.setAttribute('data-time', dt);
        affnodeas.parentElement.setAttribute('data-username', userName);
        var msg =
          msgText + ' - Changed from the ' + previous_val + ' to ' + ele;
        autosavefunction_vxe(msg);
        scrollToLastTrack(dt);
      } else {
        $('#heading-warning').text('Already Selected element in ' + ele);
        $('#headingModal').modal('show');
      }
    } else {
      $('#headingModal').modal('show');
    }
  } else {
    $('#headingModal').modal('show');
  }
  $('#change-element').val(1);
}
changeHeaderReject = (id, prevEleName) => {
  rejectHeader(id);
};
rejectHeader = (id) => {
  var rejElement = $("#content [data-time='" + id + "']").length;
  if (rejElement > 0) {
    var affnodeas = $("#content [data-time='" + id + "']")[0];
    var selected_tagName = affnodeas.tagName;
    if (selected_tagName == 'SEC') {
      var previous_val = affnodeas.getAttribute('prev_role');
      affnodeas.setAttribute('sec-type', previous_val);
      var firstchild = affnodeas.querySelector('title1');
      if (firstchild !== '') {
        firstchild.setAttribute('title', previous_val);
      }
      $("#content [data-time='" + id + "']").removeAttr('data-date');
      $("#content [data-time='" + id + "']").removeAttr('prev_role');
      $("#content [data-time='" + id + "']").removeAttr('data-time');
      $('.track-panel #' + id).remove();
      var msg = 'rejectHeader';
      autosavefunction_vxe(msg);
    }
  }
};
function getPng(store_id) {
  if (editor != null) {
    var localdata_set = $('.localstorevalue').val();
    storedata(localdata_set, 'EK');
    // GET the mathml image from the mathml editor
    // var mathml_img = e1.mathEditor("getImage","png");
    // console.log(mathml_img);
    // GET the mathml equation from the mathml editor
    // var mathml_chartag = e1.mathEditor("getMathML", "UNICODE", "true");
    var mathml_chartag = editor.getMathML();
    var mathml_chartag_format = encodeURIComponent(mathml_chartag);
    mathml_img =
      'http://www.wiris.net/demo/editor/render.png?mml=' +
      mathml_chartag_format;
    if (
      $("#content [store='" + store_id + "']").find('imageobject').length > 1
    ) {
      $("#content [store='" + store_id + "'] .math_fignew").remove();
    } else if (
      $("#content [store='" + store_id + "'] .math_fignew").length > 0
    ) {
      $("#content [store='" + store_id + "'] .math_fignew").removeClass(
        'math_fignew'
      );
    }
    $("#content [store='" + store_id + "']")
      .find('img')
      .attr('class', 'math_figold');
    // let oldEqu = localStorage.getItem('oldEq');
    // $("#content [store='"+store_id+"'] .math_figold").attr('old-eq',oldEqu);
    var d = new Date();
    var dt = Date.parse(d);
    var userName = $('#username').val();
    $("#content [store='" + store_id + "']")
      .find('img')
      .attr('data-time', dt + '_d');
    $("#content [store='" + store_id + "']")
      .find('img')
      .attr('data-username', userName);
    $("#content [store='" + store_id + "']")
      .find('img')
      .after(
        '<img src="' +
          mathml_img +
          '" class="math_fignew" data-time="' +
          dt +
          '_i" data-username= "' +
          userName +
          '">'
      );
    $("#content [store='" + store_id + "']")
      .find('mathphrase')
      .html(mathml_chartag);
    $("#content [store='" + store_id + "']")
      .find('mathphrase')
      .attr('class', 'new_equation');
    $('#mathEditor').modal('hide');
    var msg = 'equation updated.';
    autosavefunction_vxe(msg);
  }
  // localStorage.removeItem('oldEq');
}
function tocforjournals() {
  var project_id = $('#projectid').val();
  var chapter_id = $('#chapterid').val();
  var filename = $('#chapterxmlname').val();
  $.ajax({
    type: 'GET',
    url:
      api_url +
      '/VXE/JournalToc/' +
      project_id +
      '/' +
      chapter_id +
      '/' +
      filename,
    beforeSend: function () {
      $('#toc_container').empty();
    },
    success: function (data) {
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
              if (i !== 'value') {
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
              }
            });
          }
        }
      });
      $('#change-element').val(0);
    },
  });
}
var saveRequest = null;

// function trackUserKeys(
//   md5,
//   project_id,
//   task_id,
//   chapter_id,
//   user_id,
//   filename,
//   filename_path,
//   html_content
// ) {
//   //saves to localstorage for each key press
//   let dataToSaveOnLocalStorage = {
//     md5,
//     project_id,
//     task_id,
//     chapter_id,
//     user_id,
//     filename,
//     filename_path,
//     html_content,
//   };

//   let dataLocalStorageStringify = JSON.stringify(dataToSaveOnLocalStorage);
//   localStorage.setItem('proEditorData', dataLocalStorageStringify);
//   $('#savingStatus').val('No');
// }

function autosavefunction_vxe(msg) {
  if (
    $('.del').attr('contenteditable') === undefined ||
    $('.del').attr('contenteditable') !== 'true'
  )
    $('.del').attr('contenteditable', 'false');
  let parentEle = $('#content article').attr('modified-xml');
  if (!parentEle && $('#track-list').children().length > 0) {
    $('#content article').attr('modified-xml', 'v2');
  }

  var project_id = $('#projectid').val();
  var task_id = $('#taskid').val();
  var chapter_id = $('#chapterid').val();
  var user_id = $('#userid').val();
  var filename = $('#chapterxmlname').val();
  var filename_path = 'test';
  var html_content = $('#content').html();
  if ($('ref .ref-drag').length > 0) {
    $('#xmlCopy').html(html_content);
    $('#xmlCopy ref .ref-drag').remove();
    html_content = $('#xmlCopy').html();
    $('#xmlCopy').html('');
  }
  var md5 = $.md5(html_content);
  window.Journals.getTrackedData();
  window.EditorTools.trackUserKeys(
    md5,
    project_id,
    task_id,
    chapter_id,
    user_id,
    filename,
    filename_path,
    html_content
  );
}

function changereject(id) {
  var localdata_set = $('.localstorevalue').val();
  let currentSelector = document.querySelector(
    '#content [data-time="' + id + '"]'
  );
  storedata(localdata_set, 'EK');
  $("#content .del[data-time='" + id + "']")
    .contents()
    .unwrap();
  $("#content .ins[data-time='" + id + "']").remove();
  $("#content table1[data-time='" + id + "']").remove();
  $("#content figure1[data-time='" + id + "']").remove();
  $("#content b[data-time='" + id + "']")
    .contents()
    .unwrap();
  $("#content i[data-time='" + id + "']")
    .contents()
    .unwrap();
  $("#content u[data-time='" + id + "']")
    .contents()
    .unwrap();
  $("#content span[data-time='" + id + "']")
    .contents()
    .unwrap();
  $("#content sup[data-time='" + id + "']")
    .contents()
    .unwrap();
  $("#content sub[data-time='" + id + "']")
    .contents()
    .unwrap();
  $("#content sub[data-time='" + id + "']")
    .contents()
    .unwrap();
  $("#content mathquery[data-time='" + id + "']")
    .contents()
    .unwrap();
  var html_count = $('#content').text().length;
  $('#character_count').val(html_count);
  var msg = 'changereject';
  autosavefunction_vxe(msg);
}

function refreshLink() {
  $('link1').click(function () {
    var curid = $(this).attr('linkend');
    var curEle = $("[xmlid='" + curid + "']")[0];
    curEle.scrollIntoView();
  });
}

$(document).on('click', '#multiSugg', function () {
  const userId = $('#userid').val();
  var id = $(this).attr('link-id');
  var text = $(this).text();
  var currentText = $('link1[store="' + id + '"]').text();
  var currentCategory = $('link1[store="' + id + '"]').attr('category');
  var d = new Date();
  var dt_del = Date.parse(d);
  var dt_ins = dt_del++;
  var addSpanDel =
    '<span class="del cts-1" data-cid="4" data-userid=' +
    userId +
    ' data-username="Editor" data-time="' +
    dt_del +
    '" data-role="del-grammer"><link1 role="grammer2" class="grammer" category="' +
    currentCategory +
    '" store-id="' +
    id +
    '">' +
    currentText +
    '</link1></span>';
  var addSpanIns =
    '<span class="ins cts-1" data-cid="4" data-userid=' +
    userId +
    ' data-username="Editor" data-time="' +
    dt_ins +
    '" data-role="ins-grammer">' +
    text +
    '</span>';
  $('link1[store="' + id + '"]').after(addSpanDel + addSpanIns);
  $('link1[store="' + id + '"]').remove();
  var acceptRejectBtn =
    '<i class="fa fa-times cstm-danger-color float-right accept-lang-reject ml-2" onClick="rejectLangCorrection(' +
    dt_del +
    ',' +
    dt_ins +
    '); event.stopPropagation();" aria-hidden="true"></i><i class="fa fa-check cstm-success-color float-right accept-lang-accept" onClick="acceptLangCorrection(' +
    dt_del +
    ',' +
    dt_ins +
    '); event.stopPropagation(); " aria-hidden="true"></i>';
  var changeAcceptRejectRow =
    "<li class='language-replace-content' id='multiSugg' link-id='" +
    id +
    "'>" +
    text +
    acceptRejectBtn +
    '<i></li>';
  $(this).parent().parent().parent().attr('lang-id', dt_del);
  $(this).parent().html(changeAcceptRejectRow);
  scrollToViewContent(dt_ins);

  var range = new Range();
  range.setStart(
    document.querySelector('#content [data-time="' + dt_ins + '"]'),
    0
  );
  window.getSelection().addRange(range);
  updatedRevisions(range.endContainer);

  // range = new Range();
  range.setStart(
    document.querySelector('#content [data-time="' + dt_del + '"]'),
    1
  );
  window.getSelection().addRange(range);
  updatedRevisions(range.startContainer);
});

function deletetable(table_id) {
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set, 'EK');
  var d = new Date();
  var dt_first = Date.parse(d);
  var userName_first = $('#username').val();
  var tbl_id = $("#content [store='" + table_id + "']").attr('id');
  $("#content xref[rid='" + tbl_id + "']").wrap(
    '<span class="del cts-1" contenteditable="false" data-username="' +
      userName_first +
      '" data-time="' +
      dt_first +
      '_delcit" del-role="tab"></span>'
  );
  $("#content [store='" + table_id + "']").wrap(
    '<span class="del cts-1" contenteditable="false" data-username="' +
      userName_first +
      '" data-time="' +
      dt_first +
      '_del" del-role="tab"></span>'
  );
  table_rearrange(tbl_id, '');
  $('.confirm').css('margin-left', '114px');
  $('.confirm').css('margin-top', '36px');
  $('#deleteTable').modal('hide');
  var msg = 'table deleted.';
  autosavefunction_vxe(msg);
  scrollToLastTrack(dt_first);
}
//latest update
function table_rearrange(tbl_id, action) {
  var match_attr = 0;
  var k = 0;
  var contentElement = document.getElementById('content');
  var tableWarb = contentElement.querySelectorAll(
      "table-wrap[position='float']"
    ),
    i;
  var result = '';
  if (tableWarb.length > 0) {
    for (i = 0; i < tableWarb.length; ++i) {
      var element = tableWarb[i];
      var d = new Date();
      var dt = Date.parse(d);
      var userName = $('#username').val();
      var element = tableWarb[i];
      var parentTagname = element.parentElement.tagName;
      var deleteClass = '';
      if (parentTagname === 'SPAN') {
        deleteClass = element.parentElement.getAttribute('class');
      }
      var xmlid = element.getAttribute('id');
      var label_ref = element.getAttribute('linkend_tbl');
      if (deleteClass === '' || deleteClass !== 'del cts-1') {
        k++;
        if (xmlid == tbl_id || match_attr == 1) {
          if (match_attr == 1) {
            var storeId = element.getAttribute('store');
            var labelElement = element.querySelector('label1');
            var labelDelEleSpan = labelElement.querySelector('span.del');
            if (labelDelEleSpan !== null) {
              labelDelEleSpan.remove();
            }
            var prev_labelVal = labelElement.innerText;
            prev_label = $.trim(prev_labelVal);
            prev_label = prev_label.replace(/\.+$/, '');
            if (action === 'Add') {
              var new_fig = k;
            } else {
              var new_fig = k - 1;
              if (new_fig === 0) {
                new_fig = 1;
              }
            }
            var labelText = '';
            var findValue = '';
            var replaceValue = new_fig;
            if (prev_label.indexOf('.') !== -1) {
              var data_fst = prev_label.split('.');
              labelText = data_fst[0] + '.' + new_fig;
              findValue = data_fst[1];
            } else if (/\S/.test(prev_label)) {
              var data_fst = prev_label
                .split(/(\s+)/)
                .filter((e) => e.trim().length > 0);
              labelText = data_fst[0] + ' ' + new_fig;
              findValue = data_fst[1];
            } else {
              var data_fst = prev_label.split(' ');
              labelText = data_fst[0] + ' ' + new_fig;
              findValue = data_fst[1];
            }
            labelElement.innerHTML =
              '<span class="del cts-1" contenteditable="false" data-username="' +
              userName +
              '" data-time="' +
              dt +
              '_d' +
              findValue +
              '">' +
              prev_labelVal +
              '</span><span class="ins cts-1" data-username="' +
              userName +
              '" data-time="' +
              dt +
              '_i' +
              new_fig +
              '">' +
              labelText +
              '</span>';
            result =
              result + ' and ' + prev_labelVal + ' changed to ' + labelText;
            labelElement.setAttribute('linkend_tbl', labelText);
            var contentElement = document.getElementById('content');
            var tableWarbXref = contentElement.querySelectorAll(
                "xref[rid='" + xmlid + "']"
              ),
              j;
            if (tableWarbXref.length > 0) {
              for (j = 0; j < tableWarbXref.length; ++j) {
                var xrefElement = tableWarbXref[j];
                var delEleSpan = xrefElement.querySelector('span.del');
                if (delEleSpan !== null) {
                  delEleSpan.remove();
                }
                var prev_labelValXref = xrefElement.innerText;
                var regExp = new RegExp(findValue, 'g');
                var regArray = prev_labelValXref.match(regExp);
                replacePoint = 1;
                var reText = '';
                if (regArray !== null) {
                  replacePoint = regArray.length;
                  reText = replaceXREF(
                    prev_labelValXref,
                    replacePoint,
                    regExp,
                    replaceValue
                  );
                }
                if (prev_labelValXref != reText) {
                  xrefElement.innerHTML =
                    '<span class="del cts-1" contenteditable="false" data-username="' +
                    userName +
                    '" data-time="' +
                    dt +
                    '_dlnk' +
                    findValue +
                    '">' +
                    prev_labelValXref +
                    '</span><span class="ins cts-1" data-username="' +
                    userName +
                    '" data-time="' +
                    dt +
                    '_ilnk' +
                    new_fig +
                    '">' +
                    reText +
                    '</span>';
                }
              }
            }
          }
          match_attr = 1;
        }
      } else {
        if (xmlid == tbl_id) {
          k++;
          match_attr = 1;
        }
      }
    }
  }
  return result;
}

replaceXREF = (string, count, re, replace) => {
  var nth = 0;
  return string.replace(re, function (match, i, original) {
    nth++;
    return nth === count ? replace : match;
  });
};

function getSelectionParentElement() {
  var parentEl = null,
    sel;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      parentEl = sel.getRangeAt(0).commonAncestorContainer;
      if (parentEl.nodeType != 1) {
        parentEl = parentEl.parentNode;
      }
    }
  } else if ((sel = document.selection) && sel.type != 'Control') {
    parentEl = sel.createRange().parentElement();
  }
  return parentEl;
}
function mergeParaElement(cur) {
  var d = new Date();
  var dt = Date.parse(d);
  var userName = $('#username').val();
  if (cur.tagName.toUpperCase() == 'PARA') {
    var localdata_set = $('.localstorevalue').val();
    storedata(localdata_set, 'EK');
    var para_html = $(cur).next('para').html();
    if (para_html != undefined) {
      $(cur).append('&nbsp;' + para_html);
      $(cur).next('para').remove();
      $(cur).attr('role', 'merge_para');
      $(cur).attr('data-time', dt);
      $(cur).attr('data-username', userName);
      browser_details('mergePara');
    } else {
    }
  } else {
    if (cur.parentNode != null) {
      mergeParaElement(cur.parentNode);
    }
  }
  var msg = 'mergeParaElement';
  autosavefunction_vxe(msg);
  scrollToLastTrack(dt);
}

function paragraph_delete() {
  $('#lock').val('true');
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set, 'EK');
  var parentEl = null,
    sel;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      parentEl = sel.getRangeAt(0).commonAncestorContainer;
      if (parentEl.nodeType != 1) {
        parentEl = parentEl.parentNode;
      }
    }
  } else if ((sel = document.selection) && sel.type != 'Control') {
    parentEl = sel.createRange().parentElement();
  }
  var userName = $('#username').val();
  const userId = $('#userid').val();
  var d = new Date();
  var dt = Date.parse(d);
  var para_tag = parentEl.tagName;
  if (para_tag != 'PARA') {
    return false;
  }
  var store_id = parentEl.getAttribute('store');
  var para_text = parentEl.innerHTML;
  var footnote_length = $("#content [store='" + store_id + "']").find(
    'footnote1'
  ).length;
  parentEl.innerHTML =
    '<span class="del cts-1" data-cid="4" data-userid=' +
    userId +
    ' data-username="' +
    userName +
    '" data-time="' +
    dt +
    '_s" title="Deleted by ' +
    userName +
    '">' +
    para_text +
    '</span>';
  if (footnote_length > 0) {
    footnotedeletion_para(store_id);
  }
  var msg = 'paragraphDelete';
  autosavefunction_vxe(msg);
  scrollToLastTrack(dt + '_s');
  $('#lock').val('false');
}
function footnotedeletion_para(store_id) {
  var i = 0;
  $("#content [store='" + store_id + "']")
    .find('footnote1')
    .each(function () {
      var userName = $('#username').val();
      const userId = $('#userid').val();
      var d = new Date();
      var dt = Date.parse(d);
      var linkend = $(this).attr('linkend');
      var footnote_content = $("#content [xmlid='" + linkend + "']").html();
      $("#content [xmlid='" + linkend + "']").html(
        '<span class="del cts-9" data-cid="4" data-userid=' +
          userId +
          ' data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_' +
          linkend +
          '" title="Deleted by ' +
          userName +
          '">' +
          footnote_content +
          '</span>'
      );
      $("#content [xmlid='" + linkend + "']").removeAttr('label');
      footnote_rearrangefinal(linkend);
    });
}
function footnote_rearrangefinal(linkend) {
  var check_attr = 0;
  $('#content footnote').each(function () {
    var userName = $('#username').val();
    const userId = $('#userid').val();
    var d = new Date();
    var dt = Date.parse(d);
    var old_note = $(this).attr('label');
    var xmlids = $(this).attr('xmlid');
    var cls_attr = $(this).find('span').attr('class');
    if (linkend == xmlids || check_attr == 1) {
      if (check_attr == 1) {
        var class_attr = $("#content FOOTNOTE1[linkend='" + xmlids + "']")
          .find('superscript')
          .find('span')
          .attr('class');
        if (class_attr != 'del cts-7') {
          var new_note = old_note - 1;
          $(this).attr('label', new_note);
          $(this)
            .find('footnoteno')
            .html(
              '<span class="del cts-1" data-cid="2" data-userid=' +
                userId +
                ' contenteditable="false" data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_ds' +
                old_note +
                '">' +
                old_note +
                '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
                userId +
                ' data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_is' +
                new_note +
                '">' +
                new_note +
                '</span>'
            );
          $("#content FOOTNOTE1[linkend='" + xmlids + "']")
            .find('superscript')
            .html(
              '<span class="del cts-1" data-cid="2" data-userid=' +
                userId +
                ' contenteditable="false" data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_d' +
                old_note +
                '">' +
                old_note +
                '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
                userId +
                ' data-username="' +
                userName +
                '" data-time="' +
                dt +
                '_i' +
                new_note +
                '">' +
                new_note +
                '</span>'
            );
          $("#content FOOTNOTE1[linkend='" + xmlids + "']").attr(
            'label',
            new_note
          );
        }
      }
      check_attr = 1;
    }
  });
}

function gotoChange_styleediting() {
  if ($('.search-result p').length > 0) {
    var str = $('.search-result p').attr('onclick');
    var params = str.split("gotoFound('");
    var res = params[1].split("',");
    var Id = res[0];
    $('.review-item_sel').attr('class', 'review-item');
    $('.search-result p').first().attr('class', 'review-item_sel');
    var editor_element = document.getElementById('content');
    var element = document.getElementById(Id);
    //setCaretPos(element,element,0,0);
    $('.editor-tools').css('position', 'fixed');
    element.scrollIntoView(editor_element);
    $('.editor-tools').css('position', '');
    $('.btn-clear').removeClass('hide');
  }
}

function style_editing_search(value, key) {
  $("[style='background-color: orange;']").removeAttr('style');
  if (key == 1) {
    $('#match_whole').prop('checked', true);
    $('#italic_character').prop('checked', true);
    $('#italic_character').val('italicfalse');
    $('#find').val(value);
    italic_characterfind();
    //slider_leftarrow();
    gotoChange_styleediting();
    $('#find').val('');
  } else if (key == 2) {
    $('#match_whole').prop('checked', true);
    $('#find').val(value);
    findPanelSearch('editor');
    gotoChange_styleediting();
    $('#find').val('');
    $('#match_whole').prop('checked', false);
  } else if (key == 3) {
    $('#match_whole').prop('checked', false);
    $('#italic_character').prop('checked', false);
    $('#italic_character').val('italicnull');
    $('#find').val(value);
    italic_characterfind();
    //slider_leftarrow();
    gotoChange_styleediting();
    $('#find').val('');
  } else {
    $('#match_whole').prop('checked', false);
    $('#italic_character').prop('checked', false);
    $('#italic_character').val('italicnull');
    $('#find').val(value);
    italic_characterfind();
    gotoChange_styleediting();
    $('#find').val('');
  }
}

function italic_characterfind() {
  var italic_val = $('#italic_character').val();
  if (italic_val == 'italicfalse') {
    $('#italic_character').prop('checked', true);
    $('#italic_character').val('italictrue');
  } else if (italic_val == 'italictrue') {
    $('#italic_character').prop('indeterminate', true);
    $('#italic_character').val('italicnull');
  } else {
    $('#italic_character').prop('checked', false);
    $('#italic_character').val('italicfalse');
  }
  findPanelSearch('pdf-editor', '', 'allowSearch');
}

function toc_validation_search(value, key) {
  if (key == 1) {
    $('#match_whole').prop('checked', false);
    $('#italic_character').prop('checked', false);
    $('#italic_character').val('italicnull');
    $('#find').val(value);
    italic_characterfind();
    gotoChange_styleediting();
    $('#find').val('');
  } else {
    $('#content [store=' + value + ']').attr('id', value);
    $('#content .add-highlights').removeClass('add-highlights');
    scrollToViewContent(value);
    $('[store=' + value + ']').removeAttr('id');
  }
}

function trackcheck() {
  if (!$('.show_trackchanges').hasClass('hide')) {
    hide_trackchanges();
  } else {
    show_trackchanges();
  }
  if (!$('.show_xmltag').hasClass('hide')) {
    hide_xmltag();
  } else {
    ShowTag();
  }
  if (!$('.hidepara_element').hasClass('hide')) {
    showpara_element();
  } else {
    hidepara_element();
  }
}
changeBQEleToElement = (e, cur) => {
  e.preventDefault();
  var d = new Date();
  var dt = Date.parse(d);
  var userName = $('#username').val();
  var parent_node = cur.parentNode.tagName.toUpperCase();
  if (cur.tagName.toUpperCase() == 'PP1' && parent_node != 'FOOTNOTE') {
    var localdata_set = $('.localstorevalue').val();
    storedata(localdata_set, 'EK');
    if (cur.parentNode.tagName.toUpperCase() === 'DISP-QUOTE') {
      $(cur).unwrap();
      $(cur).attr('role', 'para');
    } else {
      $(cur).wrap('<disp-quote contenteditable="true"></disp-quote>');
      $(cur).attr('role', 'blockquote');
    }
    $(cur).attr('data-time', dt);
    $(cur).attr('data-username', userName);
    // browser_details("Extract");
    // updateRevisions();
    autosavefunction_vxe();
  } else {
    if (cur.parentNode != null) {
      //changeBQEleToElement(cur.parentNode);
    }
  }
};

browser_details = (functionality) => {
  var nVer = navigator.appVersion;
  var nAgt = navigator.userAgent;
  var browserName = navigator.appName;
  var fullVersion = '' + parseFloat(navigator.appVersion);
  var majorVersion = parseInt(navigator.appVersion, 10);
  var nameOffset, verOffset, ix;
  // In Opera, the true version is after "Opera" or after "Version"
  if ((verOffset = nAgt.indexOf('Opera')) != -1) {
    browserName = 'Opera';
    fullVersion = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf('Version')) != -1)
      fullVersion = nAgt.substring(verOffset + 8);
  }
  // In MSIE, the true version is after "MSIE" in userAgent
  else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
    browserName = 'Microsoft Internet Explorer';
    fullVersion = nAgt.substring(verOffset + 5);
  }
  // In Chrome, the true version is after "Chrome"
  else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
    browserName = 'Chrome';
    fullVersion = nAgt.substring(verOffset + 7);
  }
  // In Safari, the true version is after "Safari" or after "Version"
  else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
    browserName = 'Safari';
    fullVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf('Version')) != -1)
      fullVersion = nAgt.substring(verOffset + 8);
  }
  // In Firefox, the true version is after "Firefox"
  else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
    browserName = 'Firefox';
    fullVersion = nAgt.substring(verOffset + 8);
  }
  // In most other browsers, "name/version" is at the end of userAgent
  else if (
    (nameOffset = nAgt.lastIndexOf(' ') + 1) <
    (verOffset = nAgt.lastIndexOf('/'))
  ) {
    browserName = nAgt.substring(nameOffset, verOffset);
    fullVersion = nAgt.substring(verOffset + 1);
    if (browserName.toLowerCase() == browserName.toUpperCase()) {
      browserName = navigator.appName;
    }
  }
  // trim the fullVersion string at semicolon/space if present
  if ((ix = fullVersion.indexOf(';')) != -1)
    fullVersion = fullVersion.substring(0, ix);
  if ((ix = fullVersion.indexOf(' ')) != -1)
    fullVersion = fullVersion.substring(0, ix);

  majorVersion = parseInt('' + fullVersion, 10);
  if (isNaN(majorVersion)) {
    fullVersion = '' + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
  }
  var browser_version = browserName + '-' + fullVersion;
  if (browserName == 'Opera') {
    if ('50' > fullVersion) {
      $('#browser_message').dialog({
        maxWidth: 600,
        resizable: false,
        width: 560,
        title: 'Browser Version',
      });
      $('.ui-dialog-titlebar-close').html('X');
      $('.ui-icon-closethick').css('display', 'none');
    }
  } else if (browserName == 'Chrome') {
    if ('68' > fullVersion) {
      $('#browser_message').dialog({
        maxWidth: 600,
        resizable: false,
        width: 560,
        title: 'Browser Version',
      });
      $('.ui-dialog-titlebar-close').html('X');
      $('.ui-icon-closethick').css('display', 'none');
    }
  } else if (browserName == 'Safari') {
    if ('10' > fullVersion) {
      $('#browser_message').dialog({
        maxWidth: 600,
        resizable: false,
        width: 560,
        title: 'Browser Version',
      });
      $('.ui-dialog-titlebar-close').html('X');
      $('.ui-icon-closethick').css('display', 'none');
    }
  } else if (browserName == 'Firefox') {
    if ('59' > fullVersion) {
      $('#browser_message').dialog({
        maxWidth: 600,
        resizable: false,
        width: 560,
        title: 'Browser Version',
      });
      $('.ui-dialog-titlebar-close').html('X');
      $('.ui-icon-closethick').css('display', 'none');
    }
  }
  var OSName = 'Unknown OS';
  if (navigator.appVersion.indexOf('Win') != -1) OSName = 'Windows';
  if (navigator.appVersion.indexOf('Mac') != -1) OSName = 'MacOS';
  if (navigator.appVersion.indexOf('X11') != -1) OSName = 'UNIX';
  if (navigator.appVersion.indexOf('Linux') != -1) OSName = 'Linux';
  var date = new Date();
  var time_zone = date.toTimeString();
  var project_id = $('#projectid').val();
  var chapterid = $('#chapterid').val();
  var chapter_name = $('#chapterxmlname').val();
  var page = 'VXE Lite';
  var user_ipaddress = $('#ipaddress').text();
  var user_id = $('#userid').val();
  /* $(".user_ipaddress").val(); */
  var user_track = $('.user_tracksession').text();
  if (user_track != '') {
    functionality = user_track;
  }
  var api_url = $('#api_url').val();
  if (functionality == ' ') {
    functionality = 'Whitespace';
  }

  // TODO: This is needed somewhere im sure dont forget!
  $.ajax({
    url: api_url + '/VXE/usersessionDetails',
    type: 'POST',
    data: {
      project_id: project_id,
      chapterid: chapterid,
      chapter_name: chapter_name,
      OSName: OSName,
      browser_version: browser_version,
      time_zone: time_zone,
      functionality: functionality,
      page: page,
      user_ipaddress: user_ipaddress,
      user_id: user_id,
    },
    beforeSend: function () {
      $('#loading-wrapper').hide();
    },
    success: function (res) {
      $('#loading-wrapper').hide();
      $('.user_tracksession').text('');
    },
    error: function (x, e) {
      $('.user_tracksession').text('');
      functionality = 'offline ' + functionality;
      $('.user_tracksession').text(functionality);
    },
  });
};
validateFootNote = (element, flag) => {
  $('#newlist').html(element);
  console.log(element);
  var confirmValue = true;
  var foonoteLength = $('#newlist').find('footnote1,query,comment').length;
  var paraLength = $('#newlist').find('para').length;
  if (paraLength > 0) {
    $('#newlist')
      .children('*')
      .each(function (index) {
        var paraText = $(this).text();
        if (paraText === '') {
          $(this).remove();
        }
      });
  }
  var titleLength = $('#newlist').find('title1').length;
  var pp1Length = $('#newlist').find('pp1').length;
  if (pp1Length > 0 && titleLength > 0) {
    confirmValue = false;
    $('#heading-warning').text(
      'Please note that title and para cannot be deleted together.'
    );
    $('#headingModal').modal('show');
    return false;
  }

  var boxedTextLen = $('#newlist').children('boxed-text').length;
  var boxedTextParaLen = $('#newlist').children('boxed-text').length;
  if (boxedTextLen > 0 && boxedTextParaLen > 0) {
    confirmValue = false;
    $('#heading-warning').text(
      'Please note that para and boxed-text cannot be deleted together.'
    );
    $('#headingModal').modal('show');
    return false;
  }
  if (foonoteLength > 0) {
    var showConfirm = false;
    $('#newlist')
      .find('footnote1')
      .each(function (index) {
        var deleteLength = $(this).find('superscript').children().length;
        if (deleteLength === 0 || deleteLength > 1) {
          showConfirm = true;
        }
        if (deleteLength === 1) {
          var element = $(this).find('superscript').children()[0];
          var elememntClass = element.getAttribute('class');
          if (elememntClass === 'ins cts-1') {
            showConfirm = true;
          }
        }
      });
    var commentLength = $('#newlist').find('query,comment').length;
    if (commentLength > 0) {
      showConfirm = true;
    }
    if (showConfirm) {
      confirmValue = false;
      var click = true;
      $('#confirmdeleteModal')
        .modal({
          backdrop: 'static',
          keyboard: false,
        })
        .on('click', '#confirmdelete', function (e) {
          e.preventDefault();
          $('#deleteConfirm').val('1');
          if (flag === 1) {
            // paraDelete();
          } else {
            if (click) {
              click = false;
              // Create a new jQuery.Event object with specified event properties.
              var triggerevent = jQuery.Event('keydown', { keyCode: 46 });
              // trigger an artificial keydown event with keyCode 64
              jQuery('#content article').trigger(triggerevent);
            }
          }
          $('#confirmdeleteModal').modal('hide');
        })
        .on('click', '#confirmcancel', function (e) {
          e.preventDefault();
          $('#confirmdeleteModal').modal('hide');
        });
    }
  }
  return confirmValue;
};
$('.new-ref-text').on('click', function (e) {
  $('#new-ref-div').removeClass('hide');
  $('#reference_div_new').html('');
  $('#ref_submission').attr('onClick', 'ref_submission()');
  $('#ref_cancel').attr('onClick', 'ref_cancel()');
});
function ref_cancel() {
  $('#add_reference_error').addClass('hide');
  $('#new-ref-div').addClass('hide');
}
function ref_submission() {
  var reference_text = $('#reference_div_new').text();
  $('#add_reference_error').addClass('hide');
  var spanTag = 'SPAN';
  var delTag = 'del cts-1';
  let dragIcon =
    '<i class="material-icons-outlined ref-drag ui-sortable-handle" title="Reorder" spellcheck="false">drag_indicator</i>';
  if (reference_text !== '') {
    var d = new Date();
    var dt = Date.parse(d);
    var userName = $('#username').val();
    var userId = $('#userid').val();
    var checkValue = $('.refType:checked').val();
    reference_text = reference_text.replace(/(\r\n|\n|\r)/gm, ' ');
    var newref = $('#content ref-list').length;
    if (newref === 0) {
      var xmlidNew = 'CIT00001';
      $('#content article').append(
        '<ref-list store="' +
          dt +
          '-list" contenteditable="true" class="" title="BIBLIOGRAPHY"><title1 store="' +
          dt +
          '_reftitlte" contenteditable="true" class="hidden_para" title="TITLE">References</title1><ref id="' +
          xmlidNew +
          '" store="' +
          dt +
          '_ref" contenteditable="true" class="new_referenceadded">' +
          dragIcon +
          '<label1 contenteditable="true" label_ref="1"><span class="ins cts-1" data-cid="2" contenteditable="true" data-userid=' +
          userId +
          ' data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_ref1">1.</span>&nbsp;</label1><mixed-citation publication-type="journal" contenteditable="true" store="' +
          dt +
          '_cit"><span class="ins cts-1" data-cid="2" contenteditable="true" data-userid=' +
          userId +
          ' data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_text1">' +
          reference_text +
          '</span></mixed-citation></ref></ref-list>'
      );
    } else {
      var biblo = $('#content ref')[0];
      var storeId = biblo.getAttribute('store');
      var bib_length = $('#content ref').length;
      var bibliomixed_length = bib_length + 1;
      var label_val = 1;
      var xmlidNew = 'bib' + bibliomixed_length;
      $("#content [store='" + storeId + "']").before(
        '<ref id="' +
          xmlidNew +
          '" store="' +
          dt +
          '_ref" contenteditable="true" class="new_referenceadded">' +
          dragIcon +
          '<label1 contenteditable="true" label_ref="' +
          label_val +
          '"><span class="ins cts-1" data-cid="2" contenteditable="true" data-userid=' +
          userId +
          ' data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_ref' +
          label_val +
          '">' +
          label_val +
          '.</span>&nbsp;</label1><mixed-citation publication-type="journal" contenteditable="true" store="' +
          dt +
          '_cit"><span class="ins cts-1" data-cid="2" contenteditable="true" data-userid=' +
          userId +
          ' data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_text' +
          label_val +
          '">' +
          reference_text +
          '</span></mixed-citation></ref>'
      );
      reference_text = reference_text.replace(/(\r\n|\n|\r)/gm, ' ');
      var xmlid_val = 'TNF-CIT' + bibliomixed_length;
      var match_attr = 0;
      $('#content ref').each(function () {
        var xmlid = $(this).attr('id');
        var label_ref = $(this).find('label1').attr('label_ref');
        if (label_ref !== undefined && label_ref !== null) {
          var old_refno = label_ref;
        } else {
          var label_text = $(this).find('label1').text();
          var data_splits = label_text.split('.');
          var old_refno = data_splits[0];
        }
        var new_ref = +old_refno + +1;
        if (xmlid == xmlid_val || match_attr == 1) {
          if (match_attr == 1) {
            $(this).find('label1').attr('label_ref', new_ref);
            $(this)
              .find('label1')
              .html(
                '<span class="del cts-1" data-cid="2" data-userid=' +
                  userId +
                  ' contenteditable="false" data-username="' +
                  userName +
                  '" data-time="' +
                  dt +
                  '_d' +
                  old_refno +
                  '">' +
                  old_refno +
                  '</span><span class="ins cts-1" data-cid="2" contenteditable="false" data-userid=' +
                  userId +
                  ' data-username="' +
                  userName +
                  '" data-time="' +
                  dt +
                  '_i' +
                  new_ref +
                  '">' +
                  new_ref +
                  '.</span> '
              );
            var rid_link = xmlid.replace(/\CIT[0]*/g, '');
            $("#content [rid*='" + xmlid + "']").each(function () {
              reference_num_add(this, dt, label_val, old_refno, new_ref);
            });
          }
          match_attr = 1;
        }
      });
    }
    loaderStart();
    $.ajax({
      type: 'POST',
      url: api_url + '/VXE/referenceoxytech',
      data: { reference_text: reference_text },
      beforeSend: function () {
        // loadajaxsucessmsg();
      },
      success: function (response) {
        $('#reference_request').html('');
        $('#reference_xslt').html('');
        $('#reference_request').html(response.result);
        var reference_request = $('#reference_request')
          .find('structured')
          .html();
        if (reference_request !== undefined) {
          var reference_type = $('#reference_request')
            .find('structured')
            .attr('type');
          $('#reference_xslt').html(
            '<structured id="1">' + reference_request + '</structured>'
          );
          var push_xslt = $('#reference_xslt').html();
          $.ajax({
            type: 'POST',
            url: api_url + '/VXE/referencexsltjournals',
            data: { push_xslt: push_xslt },
            //async: false,
            success: function (data) {
              data = data.result;
              var str = $.trim(data);
              var returnedData = str.replace(
                '<?xml version="1.0" encoding="UTF-8"?>',
                ''
              );
              $('#reference_xsltget').html('');
              $('#reference_xsltget').html(returnedData);
              if (reference_type !== undefined) {
                $('#reference_xsltget').removeAttr('style');
                reference_type = reference_type.replace(/\\"/g, '');
                $('#reference_xsltget')
                  .find('mixed-citation')
                  .attr('publication-type', reference_type);
                var idt = 1;
                $('#reference_xsltget *').each(function () {
                  $(this).attr('store', dt + '_' + idt);
                  idt = idt + 1;
                });
                var reference_xsltget = $('#reference_xsltget')
                  .find('mixed-citation')
                  .html();
                reference_xsltget = reference_xsltget.replace(/\\n/g, ' ');
                var hideClass = '';
                var listofComment = getAllComments($('#content ref-list')[0]);
                if (listofComment.length === 0) {
                  $("#content [store='" + dt + "_ref']").html(
                    '<ref id="' +
                      xmlidNew +
                      '" store="' +
                      dt +
                      '_refget" contenteditable="true" class="new_referenceadded">' +
                      dragIcon +
                      '<label1 contenteditable="true" label_ref="' +
                      label_val +
                      '"><span class="ins cts-1 ' +
                      hideClass +
                      '" data-cid="2" contenteditable="true" data-userid=' +
                      userId +
                      ' data-username="' +
                      userName +
                      '" data-time="' +
                      dt +
                      '_ref' +
                      label_val +
                      '">' +
                      label_val +
                      '.</span>&nbsp;</label1><mixed-citation publication-type="' +
                      reference_type +
                      '" store="' +
                      dt +
                      '_citation"><span class="ins cts-1" data-cid="2" contenteditable="true" data-ref="newref" data-username="' +
                      userName +
                      '" store="' +
                      dt +
                      '_refins" data-time="' +
                      dt +
                      '_text' +
                      label_val +
                      '">' +
                      reference_xsltget +
                      '</span></mixed-citation></ref>'
                  );
                } else {
                  $("#content [store='" + dt + "_ref']").html(
                    '<ref id="' +
                      xmlidNew +
                      '" store="' +
                      dt +
                      '_refget" contenteditable="true" class="new_referenceadded">' +
                      dragIcon +
                      '<!--<label1 contenteditable="true" label_ref="' +
                      label_val +
                      '">' +
                      label_val +
                      '.&nbsp;</label1>--><mixed-citation publication-type="' +
                      reference_type +
                      '" store="' +
                      dt +
                      '_citation"><span class="ins cts-1" data-cid="2" contenteditable="true" data-ref="newref" data-username="' +
                      userName +
                      '" store="' +
                      dt +
                      '_refins" data-time="' +
                      dt +
                      '_text' +
                      label_val +
                      '">' +
                      reference_xsltget +
                      '</span></mixed-citation></ref>'
                  );
                }
                $("#content [store='" + dt + "_refget']").unwrap();
              }
              var msg = 'New reference inserted.';
              autosavefunction_vxe(msg);
              $('#new-ref-div').addClass('hide');
              $('.listOfLinks').html('');
              $('#content ref').each(function () {
                var spanTag = 'SPAN';
                var delTag = 'del cts-1';
                var deleteClass = '';
                var refElement = $(this)[0];
                if (refElement !== null) {
                  var refChildLength = refElement.children.length;
                  if (refChildLength === 1) {
                    var deleteSpan = refElement.children[0].tagName;
                    if (deleteSpan === spanTag) {
                      deleteClass =
                        refElement.children[0].getAttribute('class');
                    }
                  }
                }
                if (deleteClass !== delTag) {
                  var curid = $(this).closest('ref').attr('id');
                  var bibloText = this.innerText;
                  bibloText = bibloText.replace('drag_indicator', '');
                  $('.listOfLinks').append(
                    '<p onClick="addLinkID(' +
                      String.fromCharCode(39) +
                      '' +
                      curid +
                      '' +
                      String.fromCharCode(39) +
                      ',' +
                      String.fromCharCode(39) +
                      'bibr' +
                      String.fromCharCode(39) +
                      ',' +
                      autoCitationDt +
                      ',this );refreshLink();">Bibliography ' +
                      curid +
                      ': ' +
                      bibloText +
                      '</p>'
                  );
                  autoCitationDt = '';
                }
              });
              loaderStop();
            },
          });
        } else {
          loaderStop();
          $("#content [store='" + dt + "_ref']").remove();
          $('#referenceText').removeClass('hide');
          $('#referenceContent').addClass('hide');
          $('#referenceText').html(
            '<center><h2>Warning!</h2><span>Error has been thrown from Oxytech.</span></center>'
          );
        }
      },
    });
  } else {
    $('#add_reference_error').removeClass('hide');
  }
}
$(document).on('keypress', '.table_content', function (e) {
  e.preventDefault();
});

function correctSpelling() {
  var api_url = $('#api_url').val();
  var chapter_id = $('#chapterid').val();
  var project_id = $('#projectid').val();
  var filename = $('#chapterxmlname').val();
  loaderStart();
  fetch(api_url + '/VXE/SpellCheckSuggestion', {
    method: 'POST',
    body: JSON.stringify({
      ProjectId: project_id,
      ChapterId: chapter_id,
      filename: filename,
    }),
  })
    .then((res) => res.json())
    .then((response) => {
      loaderStop();
      let xml_data = response.chapter_xml_data;
      if (xml_data !== '' && xml_data !== undefined) {
        document.getElementById('content').innerHTML = xml_data;
        spellcheck_hideshow();
      }
    })
    .catch(function (error) {});
}
function spellcheck_hideshow(value, backward) {
  $('#match_whole').prop('checked', true);
  $('.panel-spellcheck').fadeIn('slow');
  $('.slider-arrow-spellcheck').fadeIn('slow');
  var spellcheck_value = parseInt($('.spellcheck_value').val());
  $('.np-trackchange').removeClass('hide');
  $('.cstm-adv-srch-spell').removeClass('hide');
  $('#ignore_sug').removeClass('hide');
  $('.validation-spellcheck').html('');
  var check_usuk = $('#us_uk_spellcheck').val();
  if (check_usuk == 'INSERT') {
    var length_word = $('[language=IN]').find('word').length;
  } else {
    var length_word = $(
      '#content spellingerror[language=' + check_usuk + '] word'
    ).length;
  }
  if (backward == 'backward') {
    if (spellcheck_value !== 0) {
      var spell_check = spellcheck_value - 1;
    } else {
      var spell_check = 1;
    }
  } else if (backward == 'current') {
    if (spellcheck_value < length_word) {
      var spell_check = spellcheck_value;
    } else if (length_word != 0) {
      var spell_check = 1;
    }
  } else {
    if (spellcheck_value < length_word) {
      var spell_check = spellcheck_value + 1;
    } else if (length_word != 0) {
      var spell_check = 1;
    }
  }
  if (spell_check === 0) {
    spell_check = 1;
  }
  $('.spellcheck_value').val(spell_check);
  var d = new Date();
  var dt = Date.parse(d);
  if (spell_check >= 0 && spell_check <= length_word) {
    $('.spellerror_tc').html('');
    $('.spellerror_cp').html('');
    $('.spellerror_tc').html('Total Suggestions: ' + length_word);
    $('.spellerror_cp').html(spell_check + '/' + length_word);
    var check_usuk = $('#us_uk_spellcheck').val();
    if (check_usuk == 'US') {
      var spell_element_word = getElementByXpath(
        "//spellingerrors/spellingerror[@language='US']/word[" +
          spell_check +
          ']'
      );
      if (
        typeof spell_element_word != 'undefined' &&
        spell_element_word != '' &&
        spell_element_word != null
      ) {
        var spell_element = getElementByXpath(
          "//spellingerrors/spellingerror[@language='US']/word[" +
            spell_check +
            ']/text'
        );
        if (spell_element === null) {
          spell_element = getElementByXpath(
            "//spellingerrors/spellingerror[@language='" +
              check_usuk +
              "']/word[" +
              spell_check +
              "]/span[contains(@class,'ins')]"
          );
        }
      }
    } else if (check_usuk == 'UK') {
      var spell_element_word = getElementByXpath(
        "//spellingerrors/spellingerror[@language='UK']/word[" +
          spell_check +
          ']'
      );
      if (
        typeof spell_element_word != 'undefined' &&
        spell_element_word != '' &&
        spell_element_word != null
      ) {
        var spell_element = getElementByXpath(
          "//spellingerrors/spellingerror[@language='UK']/word[" +
            spell_check +
            ']/text'
        );
        if (spell_element === null) {
          spell_element = getElementByXpath(
            "//spellingerrors/spellingerror[@language='" +
              check_usuk +
              "']/word[" +
              spell_check +
              "]/span[contains(@class,'ins')]"
          );
        }
      }
    } else if (check_usuk == 'INSERT') {
      var spell_insert = spell_check + 1;
      var spell_element = getElementByXpath(
        "//spellingerrors/spellingerror[@language='IN']/word[" +
          spell_insert +
          ']/text'
      );
      var spell_text = $(spell_element).text();
      var store_id = $(spell_element).attr('store');
    }
    if (check_usuk == 'INSERT') {
      var spell_text_withoutspace = $.trim(spell_text);
      var spell_error = getElementByXpath(
        "//spellingerrors/spellingerror[@language='IN']/word[text='" +
          spell_text_withoutspace +
          "']"
      );
      $('.validation-spellcheck').append(
        '<span class="spellcheck_find" onclick="spellcheck_find(' +
          String.fromCharCode(39) +
          '' +
          store_id +
          '' +
          String.fromCharCode(39) +
          ');">Change "' +
          spell_text_withoutspace +
          '" to:</span><ul class="spell_' +
          dt +
          '"></ul>'
      );
      var suggestion_length = $(spell_error).find('suggestion').length;
      var k = 1;
      $(spell_error)
        .find('suggestion')
        .each(function () {
          var spell_val = $(this).text();
          $('.spell_' + dt).append(
            '<li class="spellcheck_error" data-optionid="' +
              k +
              '" onClick="spellcheck_error(' +
              String.fromCharCode(39) +
              '' +
              spell_text_withoutspace +
              '' +
              String.fromCharCode(39) +
              ',' +
              String.fromCharCode(39) +
              '' +
              spell_val +
              '' +
              String.fromCharCode(39) +
              ',' +
              String.fromCharCode(39) +
              '' +
              store_id +
              '' +
              String.fromCharCode(39) +
              ',this);"><div><input type="radio" class="radio-vxe-input" value="4" id="checkOption' +
              k +
              '" name="checkOption' +
              k +
              '"><label class="radio-vxe-label">' +
              spell_val +
              '</label></div></li>'
          );
          k++;
        });
      if (suggestion_length == 0) {
        $('.validation-spellcheck').append('<ul>(No Suggestion)</ul>');
      }
      $('#ignore_sug').attr('onClick', 'ignore_all();');
      // $('#ignore_all_sug').attr("onClick", "ignore_all();");
      $('#replace_sug').attr('onClick', 'spellcheck_replaceall();');
      $('#find').val(spell_text_withoutspace);
    } else {
      var spell_text = $(spell_element).text();
      $('#ignore_sug').text('Ignore "' + spell_text + '"');
      var store_id = $(spell_element).attr('store');
      $('#spellcheck_innertext').val(spell_text);
      $('#spellcheck_xhref_storeid').val(store_id);
      var spell_error = getElementByXpath(
        "//spellingerrors/spellingerror[@language='" +
          check_usuk +
          "']/word[text='" +
          spell_text +
          "']"
      );
      if (spell_error === null) {
        spell_error = getElementByXpath(
          "//spellingerrors/spellingerror[@language='" +
            check_usuk +
            "']/word[" +
            spell_check +
            "]/span[contains(@class,'ins')]"
        );
      }
      var spellWordEle = getElementByXpath(
        "//spellingerrors/spellingerror[@language='" +
          check_usuk +
          "']/word[" +
          spell_check +
          ']'
      );
      var word_store_id = $(spellWordEle).attr('store');
      $('#spellcheck_innerstoreid').val(word_store_id);
      $('.validation-spellcheck').append(
        '<span class="spellcheck_find">Change "' +
          spell_text +
          '" to:</span><ul class="spellSugg"></ul>'
      );
      var suggEle = getElementByXpath(
        "//spellingerrors/spellingerror[@language='" +
          check_usuk +
          "']/word[" +
          spell_check +
          ']/suggestions'
      );
      var suggestion_length = $(suggEle).find('suggestion').length;
      var k = 1;
      $(suggEle)
        .find('suggestion')
        .each(function () {
          var spell_val = $(this).text();
          $('.spellSugg').append(
            '<li class="spellcheck_error" data-optionid="' +
              k +
              '" onClick="spellcheck_error(' +
              String.fromCharCode(39) +
              '' +
              spell_text +
              '' +
              String.fromCharCode(39) +
              ',' +
              String.fromCharCode(39) +
              '' +
              spell_val +
              '' +
              String.fromCharCode(39) +
              ',' +
              String.fromCharCode(39) +
              '' +
              store_id +
              '' +
              String.fromCharCode(39) +
              ',this,\'\');"><div><input type="radio" class="radio-vxe-input" value="4" id="checkOption' +
              k +
              '" name="checkOption' +
              k +
              '"><label class="radio-vxe-label">' +
              spell_val +
              '</label></div></li>'
          );
          k++;
        });
      $('.spellSugg').append(
        '<li class="spellcheck_error custom-word" data-optionid="' +
          k +
          '" onClick="spellcheck_error(' +
          String.fromCharCode(39) +
          '' +
          spell_text +
          '' +
          String.fromCharCode(39) +
          ',' +
          String.fromCharCode(39) +
          '' +
          String.fromCharCode(39) +
          ',' +
          String.fromCharCode(39) +
          '' +
          store_id +
          '' +
          String.fromCharCode(39) +
          ',this,\'custom\');"><div><input type="radio" class="radio-vxe-input" value="4" id="checkOption' +
          k +
          '" name="checkOption' +
          k +
          '"><label class="radio-vxe-label">a custom word</label></div></li><div class="col-11 p-0"><input type="text" class="form-control" id="replaceSpell" name="Replace" placeholder="Replace"></div>'
      );
      $('#replaceSpell').addClass('hide');
      $('#ignore_sug').attr('onClick', 'ignore_all();');
      // $('#ignore_all_sug').attr("onClick", "ignore_all();");
      $('#replace_sug').attr('onClick', 'spellcheck_replaceall();');
      clearSearch();
      var rootEle = 'pdf-editor';
      $('#root .w-250-p').addClass('spellRe');
      spellSerch(rootEle, spell_text);
    }
    if (suggestion_length == 0) {
      //$(".search-result").find("p")[0].click();
    }
    if (suggestion_length !== 0) {
      if ($('.search-result-spell').find('p').length > 0) {
        $('.search-result-spell').find('p')[0].click();
      }
    }
    if (window.getSelection) {
      if (window.getSelection().empty) {
        // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {
      // IE?
      document.selection.empty();
    }
    //disablePopup();
  } else {
    //disablePopup();
    $('.spellerror_tc').html('');
    $('.spellerror_cp').html('');
    // $(".spellerror_tc").html('Total Suggestion: 0');
    // $(".spellerror_cp").html('current-position: 0');
    $('.validation-spellcheck').html('');
    $('.np-trackchange').addClass('hide');
    $('.cstm-adv-srch-spell').addClass('hide');
    $('#ignore_sug').addClass('hide');
    $('.validation-spellcheck').append('<ul>(Spell Check Completed)</ul><br>');
  }
}
function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}
function clearSearch() {}
function search_occurance(spell_text) {
  var check_usuk = $('#us_uk_spellcheck').val();
  $('#lock').val('true');
  $('#find').focus();
  $('#content').focus();
  //loadajaxsucessmsg();
  //console.log(rootEle);
  console.log('regex_search');
  $('.search-result').html('');
  $('.del').removeAttr('id');
  $('.del').removeAttr('style');
  $('.ins').removeAttr('id');
  $('.ins').removeAttr('style');
  $('.found').removeAttr('id');
  $('.found').removeClass('found');
  $('.spellcheckfound').contents().unwrap();
  $("span[style='background-color: orange;']").contents().unwrap();
  $("[style='background-color: orange;']").attr('style', '');
  console.log(
    $('xref[language=' + check_usuk + "]:contains('" + spell_text + "')")
  );
  var spell_word = $(
    'xref[language=' + check_usuk + "]:contains('" + spell_text + "')"
  );
  var f = 0;
  $(spell_word).each(function () {
    var spell_val = $(this).text();
    $(this).wrapAll('<span id="found' + f + '"></span>');
    $('#found' + f).addClass('found');
    $('#found' + f).addClass('spellcheckfound');
    $('#found' + f).css('background-color', 'orange');
    f++;
  });

  $('#content')
    .find('.found')
    .each(function () {
      var Id = $(this).attr('id');
      var appHTML = '';
      if ($('.search-result').html() == '') {
        $('.search-result').append(
          '<div class="searchCount">' + $('.found').length + ' matches </div>'
        );
      }
      var preText = findPreText(Id);
      var nextText = findNextText(Id);
      appHTML =
        '<p onClick="gotoFound_spellcheck(' +
        String.fromCharCode(39) +
        '' +
        Id +
        '' +
        String.fromCharCode(39) +
        ',this);" class="found_result">' +
        preText.substring(preText.length - 20, preText.length) +
        '<span style="color:green;">' +
        $(this).text() +
        '</span>' +
        nextText.substring(0, 20) +
        '<span onclick="replace_foundonly(' +
        String.fromCharCode(39) +
        '' +
        Id +
        '' +
        String.fromCharCode(39) +
        ');" class="replaceText_only"><i class="fa fa-random" title="Replace" aria-hidden="true" style="font-size:20px;"></i></span></p>';
      $('.search-result').append(appHTML);
    });

  if ($('.found').length >= 10) {
    $('.search-result').append(
      '<div class="pg-prev"  onclick="pgprevious()">Prev</div><div id="pg-divPages"></div><div class="pg-next" onclick="pgnext()">Next</div>'
    );
    var totalrows = $('.found_result').length;
    var pageSize = 20;
    var noOfPage = totalrows / pageSize;
    noOfPage = Math.ceil(noOfPage);
    $('#pg-pagesize').val(pageSize);
    for (var p = 1; p <= noOfPage; p++) {
      $('#pg-divPages').append(
        '<div class="pg-page" onclick="pgpageno(this)">' + p + '</div>'
      );
    }
    var totalPagenum = $('div.pg-page').length;
    if (totalPagenum > 4) {
      $('div.pg-page').hide();
      for (var n = 1; n <= 4; n++) {
        $('div.pg-page:nth-child(' + n + ')').show();
      }
      $('div.pg-page:nth-child(1)').addClass('pg-active');
    } else {
      $('div.pg-next').hide();
      $('div.pg-prev').hide();
    }
    $('p.found_result').hide();
    for (var j = 1; j <= pageSize; j++) {
      $('p.found_result:nth-child(' + j + ')').show();
    }
    displayevent();
    $('div.pg-prev').hide();
  }
  $('.findnreplace_waitingmsg').hide();
  // disablePopup();
  $('#lock').val('false');
  // slider_leftarrow();
}
$(document).on('click', '.np-pervious', function () {
  spellcheck_hideshow('show', 'backward');
});
$(document).on('click', '.np-next', function () {
  $('#replace').val('');
  $('#replaceVal').val('');
  spellcheck_hideshow('show');
});

$(document).on('keyup', '#replaceSpell', function (e) {
  var replace = $('#replaceSpell').val();
  $('#replaceVal').val(replace);
});

removeHighliteSelect = () => {
  $('.found').contents().unwrap();
  $('.add-highlights').contents().unwrap();
};

function ignore_once() {
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set, 'EK');
  var object_found = $('#content .found')[0];
  var word_store_id = $('#spellcheck_innerstoreid').val();
  var check_usuk = $('#us_uk_spellcheck').val();
  var spell_ignore = getElementByXpath(
    "//spellingerrors/spellingerror[@language='" +
      check_usuk +
      "']/word[@store='" +
      word_store_id +
      "']"
  );
  $(spell_ignore).remove();
  $(object_found).contents().unwrap();
  var spellcheck_ignore = parseInt($('.spellcheck_ignore').val());
  var replace_length = $('.replaceText_only').length;
  if (spellcheck_ignore < replace_length) {
    var spell_check = spellcheck_ignore + 1;
    $('.spellcheck_ignore').val(spell_check);
    $('.search-result p')[spell_check].click();
  }
  autosavefunction_vxe();
  spellcheck_hideshow('show', 'current');
}

function ignore_all() {
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set, 'EK');
  var spellcheck_innertext = $('#spellcheck_innertext').val();
  var check_usuk = $('#us_uk_spellcheck').val();
  var spell_element = $(
    'spellingerror[language=' +
      check_usuk +
      '] > word > text:contains(' +
      spellcheck_innertext +
      ')'
  );
  $(spell_element).each(function (index) {
    $(this).parent().remove();
  });
  $('#content .found').contents().unwrap();
  autosavefunction_vxe();
  spellcheck_hideshow('show', 'current');
}

function spellcheck_replaceall() {
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set, 'EK');
  var spellcheck_innertext = $('#spellcheck_innertext').val();
  var check_usuk = $('#us_uk_spellcheck').val();
  var spell_element = $(
    'spellingerror[language=' +
      check_usuk +
      '] > word > text:contains(' +
      spellcheck_innertext +
      ')'
  );
  $(spell_element).each(function (index) {
    $(this).parent().remove();
  });
  replaceAllSpell();
  autosavefunction_vxe();
  spellcheck_hideshow('show');
}

function replaceAllSpell(regex_style, group, styleEdit) {
  var group = group;
  if (regex_style == undefined) {
    var localdata_set = $('.localstorevalue').val();
    storedata(localdata_set, 'EK');
    var group = 'nostyle';
  }
  var bold_characterrep = $('#bold_characterrep').val();
  var italic_characterrep = $('#italic_characterrep').val();
  var underline_characterrep = $('#underline_characterrep').val();
  var superscript_characterrep = $('#superscript_characterrep').val();
  var subscript_characterrep = $('#subscript_characterrep').val();

  var sentence_case = $('#sentence_case:checked').val();
  var to_uppercase = $('#to_uppercase:checked').val();
  var to_lowercase = $('#to_lowercase:checked').val();
  var capitalize_eachword = $('#capitalize_eachword:checked').val();

  var replaceText = $('#replace').val();

  var userName = $('#username').val();
  const userId = $('#userid').val();
  var r = 0;

  $('.found').each(function () {
    var d = new Date();
    var dt = Date.parse(d);
    var prop_tagname = $(this).prop('tagName');
    var font_style = $(prop_tagname).css('font-style');
    var founded_texts = $(this).text();
    var founded_text = $(this).text();
    var found_ids = $(this).attr('id');
    var replaceText = $('#replaceVal').val();
    var wildcard_rep = $('#wildcard_rep:checked').val();
    if (wildcard_rep == 'wildcard') {
      var pro = '';
      pro = pro + 'i';
      pro = pro + 'g';
      var find_val = new RegExp($('#find').val(), pro);
      var replaceTextas = $('#replaceVal').val();
      var spellreplaceText = $('#replaceVal').val();
      if (spellreplaceText !== '') {
        replaceTextas = spellreplaceText;
      }
      var replaceText = founded_text.replace(find_val, replaceTextas);
      var us_ukdash = $('#style_editing').text();
      //UK convention
      if (us_ukdash == 'Bloomsbury UK')
        var replaceText = replaceText.replace('', '&#x2013;');
      //US convention
      if (us_ukdash == 'Bloomsbury US')
        var replaceText = replaceText.replace('', '&#x2014;');
      var replaceText = replaceText.replace('(u00a0)', '&nbsp;');
      var replace_hyphen = $('.replace_hyphen').val();
      if (replace_hyphen == 'ITALIC HYPHEN')
        var replaceText = replaceText.replace('-', ' ');
      if (replace_hyphen == 'ITALICFIRST')
        var replaceText = founded_texts.replace('p', '<i>P</i>');
      if (replace_hyphen == 'SMALLCAPS') {
        var replaceword = $('.other_replaceword').val();
        var replaceText = founded_texts.replace(
          founded_texts,
          '<sc>' + replaceword + '</sc>'
        );
      }
      if (
        replaceText == ' Mann-Whitney' ||
        replaceText == ' Tris-HCl' ||
        replaceText == ' Sprague-Dawley'
      )
        var replaceText = replaceText.replace('-', '&#x2013;');
      if (
        replaceText == ' Mr. ' ||
        replaceText == ' Mrs. ' ||
        replaceText == ' Dr. ' ||
        replaceText == ' Prof. ' ||
        replaceText == ' et al. ' ||
        replaceText == ' vs. '
      )
        var replaceText = replaceText.replace('.', '');
    }
    if (to_lowercase == 'lowercase') {
      var founded_text = founded_text.toLowerCase();
      var replaceText = replaceText.toLowerCase();
    }
    if (to_uppercase == 'uppercase') {
      var replaceText = founded_text.toUpperCase();
      var replaceText = replaceText.toUpperCase();
    }
    if (sentence_case == 'sentenceCase') {
      var founded_text = sentenceCase(founded_text.toLowerCase());
      var replaceText = sentenceCase(replaceText.toLowerCase());
    }
    if (capitalize_eachword == 'capitalize') {
      var founded_text = toTitleCase(founded_text);
      var replaceText = toTitleCase(replaceText);
    }
    var findText =
      '<span class="del cts-1" data-cid="2" group_tag="' +
      group +
      '" data-userid="11" data-username="' +
      userName +
      '" data-time="' +
      dt +
      '_d' +
      found_ids +
      '_' +
      regex_style +
      '" common_tag="' +
      dt +
      '_i' +
      found_ids +
      '_' +
      regex_style +
      '">' +
      founded_texts +
      '</span>';
    if (prop_tagname == 'B' && bold_characterrep != 'boldnull') {
      if (replaceText != '')
        var replaceTextas =
          '<b store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</b>';
      else
        var replaceTextas =
          '<b store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</b>';
    } else if (
      (prop_tagname == 'I' || font_style == 'italic') &&
      italic_characterrep != 'italicnull'
    ) {
      if (replaceText != '')
        var replaceTextas =
          '<i store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</i>';
      else
        var replaceTextas =
          '<i store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</i>';
    } else if (
      prop_tagname == 'U' &&
      underline_characterrep != 'underlinenull'
    ) {
      if (replaceText != '')
        var replaceTextas =
          '<u store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</u>';
      else
        var replaceTextas =
          '<u store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</u>';
    }
    //SUPERSCRIPT SUBSCRIPT
    else if (
      (prop_tagname == 'SUP' || prop_tagname == 'SUPERSCRIPT') &&
      superscript_characterrep != 'superscriptnull'
    ) {
      if (replaceText != '')
        var replaceTextas =
          '<sup store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</sup>';
      else
        var replaceTextas =
          '<sup store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</sup>';
    } else if (
      (prop_tagname == 'SUB' || prop_tagname == 'SUBSCRIPT') &&
      subscript_characterrep != 'subscriptnull'
    ) {
      if (replaceText != '')
        var replaceTextas =
          '<sub store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</sub>';
      else
        var replaceTextas =
          '<sub store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</sub>';
    } else if (
      bold_characterrep != 'boldtrue' &&
      italic_characterrep != 'italictrue' &&
      underline_characterrep != 'underlinetrue' &&
      superscript_characterrep != 'superscripttrue' &&
      subscript_characterrep != 'subscripttrue'
    ) {
      if (replaceText != '')
        var replaceTextas =
          '<span store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</span>';
      else
        var replaceTextas =
          '<span store="' +
          dt +
          '_i' +
          r +
          '" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</span>';
    }

    // check box checked conditions
    if (bold_characterrep == 'boldtrue') {
      if (replaceText != '')
        var replaceTextas =
          '<b store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</b>';
      else
        var replaceTextas =
          '<b store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</b>';
    }
    if (italic_characterrep == 'italictrue') {
      if (replaceText != '')
        var replaceTextas =
          '<i store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</b>';
      else
        var replaceTextas =
          '<i store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</b>';
    }
    if (underline_characterrep == 'underlinetrue') {
      if (replaceText != '')
        var replaceTextas =
          '<u store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</u>';
      else
        var replaceTextas =
          '<u store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</u>';
    }
    if (superscript_characterrep == 'superscripttrue') {
      if (replaceText != '')
        var replaceTextas =
          '<sup store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</sup>';
      else
        var replaceTextas =
          '<sup store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</sup>';
    }
    if (subscript_characterrep == 'subscripttrue') {
      if (replaceText != '')
        var replaceTextas =
          '<sub store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          replaceText +
          '</sub>';
      else
        var replaceTextas =
          '<sub store="' +
          dt +
          '_i" class="ins cts-1" group_tag="' +
          group +
          '" data-cid="2" data-userid="11" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '" common_tag="' +
          dt +
          '_i' +
          found_ids +
          '_' +
          regex_style +
          '">' +
          founded_text +
          '</sub>';
    }
    $(this).html(findText + '' + replaceTextas);
    r = r + 1;
  });

  $('.found').contents().unwrap();
  $('.search-result').html('');
  $('#find').val('');
  $('#findPanelText').val('');
  $('#findPanelTextinside').val('');
  $('#replace').val('');
  $('#replaceinside').val('');
  if (!styleEdit) autosavefunction_vxe();
  $('#lock').val('false');
}

function spellcheck_error(old_val, new_val, store_id, right_side, action) {
  var optionid = $(right_side).attr('data-optionid');
  $('.radio-vxe-input').prop('checked', false);
  $('#checkOption' + optionid).prop('checked', true);
  var userName = $('#username').val();
  $('#replaceSpell').addClass('hide');
  if (action === 'custom') {
    $('#replaceSpell').removeClass('hide');
  }
  var d = new Date();
  var dt = Date.parse(d);
  var localdata_set = $('.localstorevalue').val();
  storedata(localdata_set, 'EK');
  //$("#content [store='"+store_id+"']").after('<span class="del cts-1" contenteditable="false" data-username="'+ userName +'" data-time="'+ dt +'_del">'+old_val+'</span><span class="ins cts-1" data-cid="2" contenteditable="true" data-username="'+ userName +'" data-time="'+ dt +'_ins">'+new_val+'</span>');
  //$("#content [store='"+store_id+"']").remove();
  //$(".custom-menu").hide(100);
  if (right_side != undefined) {
    var spell_change = $(right_side).text();
    $('.corrected_spellcheck').html('');
    if (action === 'custom') {
      spell_change = $('#replaceSpell').val();
      var xmlContentScrollTop = $('.spellSugg').scrollTop();
      var extraHeight = 127.5;
      var id = 'replaceSpell';
      var selectContentPosTop = $('#' + id).offset();
      if (selectContentPosTop !== undefined) {
        selectContentPosTop = $('#' + id).offset().top;
        $('.spellSugg').scrollTop(
          selectContentPosTop + xmlContentScrollTop - extraHeight
        );
      }
    }
    $('#replaceVal').val(spell_change);
    $('.find-replace-btn').show();
  }
  autosavefunction_vxe();
}

spellcheck_find = () => {
  var spell_text = $('#spellcheck_innertext').val();
  $('#find').val(spell_text);
  // $( "#findBtn" ).trigger( "click" );
};

function spellSerch(rootEle, res) {
  $('#lock').val('true');
  $('#find').focus();
  $('#content').focus();
  $('#root .w-250-p').removeClass('spellRe').addClass('spellAb');
  var MCchecked = $('#match_case:checked').val();
  var MWchecked = $('#match_whole:checked').val();
  var Wildcard = $('#wildcard_search:checked').val();
  var bold_character = $('#bold_character').val();
  var italic_character = $('#italic_character').val();
  var underline_character = $('#underline_character').val();
  var subscript_character = $('#subscript_character').val();
  var superscript_character = $('#superscript_character').val();
  $('.search-result-spell').html('');
  $('#content .del').removeAttr('id');
  $('#content .del').removeAttr('style');
  $('#content .ins').removeAttr('id');
  $('#content .ins').removeAttr('style');
  $("#content [style='background-color: rgb(188, 188, 190);']").removeAttr(
    'style'
  );
  $(
    "#content .found[style='background-color: rgb(188, 188, 190);']"
  ).removeAttr('style');
  $('#content .found').removeAttr('id');
  $('#content span.found').contents().unwrap();
  $('#content *').removeClass('found');
  var aCaseSensitive, aWholeWord;
  if (MCchecked == 1) aCaseSensitive = true;
  else aCaseSensitive = false;
  if (MWchecked == 2) aWholeWord = true;
  else aWholeWord = false;

  /* regex search */
  var i = 0;
  var pro = '';
  if (Wildcard == 3) {
    if (MCchecked == 1) pro = pro;
    else pro = pro + 'i';
    pro = pro + 'g';
    var re = new RegExp($('#find').val(), pro);
    browser_details('Wildcard :' + re);
    var data = $('#content').text();
    var founds = data.match(re);
    const found = [...new Set(founds)];
    found.sort(function (a, b) {
      return b - a;
    });
    found.forEach(function (element) {
      var res = $('#find').val();
      if (element != '' && res != '') {
        while (window.find(element, true, false, false, false, false, false)) {
          var affnodeas = getSelectedNode();
          if (affnodeas == undefined) break;
          var prev_found = affnodeas.classList;
          var get_attributeDel = affnodeas.getAttribute('class');
          if (get_attributeDel == 'del cts-1') continue;
          var style_element = affnodeas.tagName;
          var style_elementparent = affnodeas.parentElement.tagName;

          if (
            style_element != 'REF' &&
            style_element != 'ARTICLE-META' &&
            style_element != 'MIXED-CITATION' &&
            style_element != 'DELIMITER' &&
            style_element != 'SURNAME' &&
            style_element != 'GIVEN-NAMES' &&
            style_element != 'EDITORS' &&
            style_element != 'SUFFIX' &&
            style_element != 'PERSON-GROUP' &&
            style_element != 'NAME' &&
            style_element != 'EDITOR' &&
            style_element != 'CHAPTER-TITLE' &&
            style_element != 'SOURCE' &&
            style_element != 'YEAR' &&
            style_element != 'ARTICLE-TITLE' &&
            style_element != 'URI' &&
            style_element != 'PUBLISHER-LOC' &&
            style_element != 'PUB-ID' &&
            style_element != 'PUBLISHER-NAME' &&
            style_element != 'CITY' &&
            style_element != 'STATE' &&
            style_element != 'COUNTRY' &&
            style_element != 'VOLUME' &&
            style_element != 'ISSUE' &&
            style_element != 'PAGENUMS' &&
            style_element != 'FPAGE' &&
            style_element != 'EDITION' &&
            style_element != 'SEASON' &&
            style_element != 'DATE' &&
            style_element != 'YEAR' &&
            style_element != 'MONTH' &&
            style_element != 'PDFONLY1' &&
            style_element != 'PDFONLY2' &&
            style_element != 'PDFONLY3' &&
            style_element != 'PDFONLY4' &&
            style_element != 'XREF' &&
            style_element != 'SUBJECT' &&
            style_element != 'AFF' &&
            style_element != 'CONTRIB' &&
            style_element != 'INSTITUTION' &&
            style_element != 'VOLUME1' &&
            style_element != 'CORRESP' &&
            style_element != 'LABEL1' &&
            style_element != 'TITLE1' &&
            style_element != 'EMAIL' &&
            style_element != 'KWD1' &&
            style_element != 'DOI' &&
            style_element != 'COPYRIGHT' &&
            style_element != 'SUBJECTEDITOR' &&
            style_elementparent != 'XREF' &&
            style_elementparent != 'MIXED-CITATION' &&
            style_elementparent != 'LABEL1' &&
            style_elementparent != 'CAPTION1' &&
            style_elementparent != 'SOURCE1' &&
            style_elementparent != 'ARTICLE-TITLE' &&
            style_elementparent != 'AFF'
          ) {
            var font_style = $(style_element).css('font-style');
            var font_weight = $(style_element).css('font-weight');
            if (
              (style_element == 'I' || font_style == 'italic') &&
              (italic_character == 'italictrue' ||
                italic_character == 'italicnull')
            ) {
              if (italic_character == 'italictrue') {
                if (prev_found != 'found') {
                  doCommand('backColor');
                  var affnode = getSelectedNode();
                  if (findAncestor(affnode, rootEle)) {
                    if (
                      !findAncestor(affnode, 'rh') &&
                      !findAncestor(affnode, 'lh') &&
                      !findAncestor(affnode, 'pageno') &&
                      !findAncestor(affnode, 'pagenob') &&
                      !findAncestor(affnode, 'pagenor') &&
                      affnode.tagName.toUpperCase() != 'RH' &&
                      affnode.tagName.toUpperCase() != 'LH' &&
                      affnode.tagName.toUpperCase() != 'PAGENO' &&
                      affnode.tagName.toUpperCase() != 'PAGENOB' &&
                      affnode.tagName.toUpperCase() != 'PAGENOR' &&
                      affnode.tagName.toUpperCase() != 'PP1'
                    ) {
                      affnode.setAttribute('id', 'found' + i);
                      affnode.classList.add('found');
                      var char_found = affnode.classList;
                    }
                  }
                  i = i + 1;
                }
              }
            } else if (
              font_weight == '700' &&
              (bold_character == 'boldtrue' || bold_character == 'boldnull')
            ) {
              if (bold_character == 'boldtrue') {
                if (prev_found != 'found') {
                  doCommand('backColor');

                  var affnode = getSelectedNode();
                  //alert(affnode);

                  if (findAncestor(affnode, rootEle)) {
                    if (
                      !findAncestor(affnode, 'rh') &&
                      !findAncestor(affnode, 'lh') &&
                      !findAncestor(affnode, 'pageno') &&
                      !findAncestor(affnode, 'pagenob') &&
                      !findAncestor(affnode, 'pagenor') &&
                      affnode.tagName.toUpperCase() != 'RH' &&
                      affnode.tagName.toUpperCase() != 'LH' &&
                      affnode.tagName.toUpperCase() != 'PAGENO' &&
                      affnode.tagName.toUpperCase() != 'PAGENOB' &&
                      affnode.tagName.toUpperCase() != 'PAGENOR' &&
                      affnode.tagName.toUpperCase() != 'PP1'
                    ) {
                      affnode.setAttribute('id', 'found' + i);
                      affnode.classList.add('found');

                      var char_found = affnode.classList;
                      //console.log("next_found:-"+char_found);
                    }
                  }
                  i = i + 1;
                }
              }
            } else if (
              (underline_character == 'underlinetrue' ||
                underline_character == 'underlinenull') &&
              style_element == 'U'
            ) {
              if (underline_character == 'underlinetrue') {
                if (prev_found != 'found') {
                  doCommand('backColor');

                  var affnode = getSelectedNode();
                  //alert(affnode);

                  if (findAncestor(affnode, rootEle)) {
                    if (
                      !findAncestor(affnode, 'rh') &&
                      !findAncestor(affnode, 'lh') &&
                      !findAncestor(affnode, 'pageno') &&
                      !findAncestor(affnode, 'pagenob') &&
                      !findAncestor(affnode, 'pagenor') &&
                      affnode.tagName.toUpperCase() != 'RH' &&
                      affnode.tagName.toUpperCase() != 'LH' &&
                      affnode.tagName.toUpperCase() != 'PAGENO' &&
                      affnode.tagName.toUpperCase() != 'PAGENOB' &&
                      affnode.tagName.toUpperCase() != 'PAGENOR' &&
                      affnode.tagName.toUpperCase() != 'PP1'
                    ) {
                      affnode.setAttribute('id', 'found' + i);
                      affnode.classList.add('found');

                      var char_found = affnode.classList;
                      //console.log("next_found:-"+char_found);
                    }
                  }
                  i = i + 1;
                }
              }
            } else if (
              (superscript_character == 'superscripttrue' ||
                superscript_character == 'superscriptnull') &&
              (style_element == 'SUP' || style_element == 'SUPERSCRIPT')
            ) {
              //console.log("superscript_character:"+superscript_character);
              if (superscript_character == 'superscripttrue') {
                if (prev_found != 'found') {
                  doCommand('backColor');

                  var affnode = getSelectedNode();

                  if (findAncestor(affnode, rootEle)) {
                    if (
                      !findAncestor(affnode, 'rh') &&
                      !findAncestor(affnode, 'lh') &&
                      !findAncestor(affnode, 'superscript') &&
                      !findAncestor(affnode, 'pageno') &&
                      !findAncestor(affnode, 'pagenob') &&
                      !findAncestor(affnode, 'pagenor') &&
                      affnode.tagName.toUpperCase() != 'RH' &&
                      affnode.tagName.toUpperCase() != 'LH' &&
                      affnode.tagName.toUpperCase() != 'PAGENO' &&
                      affnode.tagName.toUpperCase() != 'PAGENOB' &&
                      affnode.tagName.toUpperCase() != 'SUPERSCRIPT' &&
                      affnode.tagName.toUpperCase() != 'PAGENOR' &&
                      affnode.tagName.toUpperCase() != 'PP1'
                    ) {
                      affnode.setAttribute('id', 'found' + i);
                      affnode.classList.add('found');

                      var char_found = affnode.classList;
                      //console.log("next_found:-"+char_found);
                    }
                  }
                  i = i + 1;
                }
              }
            } else if (
              (subscript_character == 'subscripttrue' ||
                subscript_character == 'subscriptnull') &&
              (style_element == 'SUB' || style_element == 'SUBSCRIPT')
            ) {
              if (subscript_character == 'subscripttrue') {
                if (prev_found != 'found') {
                  doCommand('backColor');

                  var affnode = getSelectedNode();
                  //alert(affnode);

                  if (findAncestor(affnode, rootEle)) {
                    if (
                      !findAncestor(affnode, 'rh') &&
                      !findAncestor(affnode, 'lh') &&
                      !findAncestor(affnode, 'pageno') &&
                      !findAncestor(affnode, 'pagenob') &&
                      !findAncestor(affnode, 'pagenor') &&
                      affnode.tagName.toUpperCase() != 'RH' &&
                      affnode.tagName.toUpperCase() != 'LH' &&
                      affnode.tagName.toUpperCase() != 'PAGENO' &&
                      affnode.tagName.toUpperCase() != 'PAGENOB' &&
                      affnode.tagName.toUpperCase() != 'PAGENOR' &&
                      affnode.tagName.toUpperCase() != 'PP1'
                    ) {
                      affnode.setAttribute('id', 'found' + i);
                      affnode.classList.add('found');
                    }
                  }
                  i = i + 1;
                }
              }
            } else if (
              italic_character != 'italictrue' &&
              bold_character != 'boldtrue' &&
              underline_character != 'underlinetrue' &&
              superscript_character != 'superscripttrue' &&
              subscript_character != 'subscripttrue'
            ) {
              if (prev_found != 'found') {
                doCommand('backColor');

                var affnode = getSelectedNode();
                //alert(affnode);
                if (findAncestor(affnode, rootEle)) {
                  if (
                    !findAncestor(affnode, 'rh') &&
                    !findAncestor(affnode, 'lh') &&
                    !findAncestor(affnode, 'pageno') &&
                    !findAncestor(affnode, 'pagenob') &&
                    !findAncestor(affnode, 'pagenor') &&
                    affnode.tagName.toUpperCase() != 'RH' &&
                    affnode.tagName.toUpperCase() != 'LH' &&
                    affnode.tagName.toUpperCase() != 'PAGENO' &&
                    affnode.tagName.toUpperCase() != 'PAGENOB' &&
                    affnode.tagName.toUpperCase() != 'PAGENOR' &&
                    affnode.tagName.toUpperCase() != 'PP1'
                  ) {
                    affnode.setAttribute('id', 'found' + i);
                    affnode.classList.add('found');
                  }
                }
                i = i + 1;
              }
            }
          }
          //executive your code here [A-Z][a-z]* \([A-Z]*\)
        }
        $('#find').focus();
      }
    });
  } else {
    //var res = $("#find").val();
    while (
      window.find(res, aCaseSensitive, false, false, aWholeWord, false, false)
    ) {
      var affnodeas = getSelectedNode();
      if (affnodeas == undefined) break;
      var style_element = affnodeas.tagName;
      var font_style = $(style_element).css('font-style');
      var font_weight = $(style_element).css('font-weight');
      if (
        (style_element == 'I' || font_style == 'italic') &&
        (italic_character == 'italictrue' || italic_character == 'italicnull')
      ) {
        if (italic_character == 'italictrue') {
          doCommand('backColor');
          var affnode = getSelectedNode();
          if (findAncestor(affnode, rootEle)) {
            if (
              !findAncestor(affnode, 'rh') &&
              !findAncestor(affnode, 'lh') &&
              !findAncestor(affnode, 'pageno') &&
              !findAncestor(affnode, 'pagenob') &&
              !findAncestor(affnode, 'pagenor') &&
              affnode.tagName.toUpperCase() != 'RH' &&
              affnode.tagName.toUpperCase() != 'LH' &&
              affnode.tagName.toUpperCase() != 'PAGENO' &&
              affnode.tagName.toUpperCase() != 'PAGENOB' &&
              affnode.tagName.toUpperCase() != 'PAGENOR'
            ) {
              affnode.setAttribute('id', 'found' + i);
              affnode.classList.add('found');
              //.className += " found";
              //affnode.setAttribute("class", "found");
            }
          }
          i = i + 1;
        }
      } else if (
        font_weight == '700' &&
        (bold_character == 'boldtrue' || bold_character == 'boldnull')
      ) {
        if (bold_character == 'boldtrue') {
          doCommand('backColor');
          var affnode = getSelectedNode();
          if (findAncestor(affnode, rootEle)) {
            if (
              !findAncestor(affnode, 'rh') &&
              !findAncestor(affnode, 'lh') &&
              !findAncestor(affnode, 'pageno') &&
              !findAncestor(affnode, 'pagenob') &&
              !findAncestor(affnode, 'pagenor') &&
              affnode.tagName.toUpperCase() != 'RH' &&
              affnode.tagName.toUpperCase() != 'LH' &&
              affnode.tagName.toUpperCase() != 'PAGENO' &&
              affnode.tagName.toUpperCase() != 'PAGENOB' &&
              affnode.tagName.toUpperCase() != 'PAGENOR'
            ) {
              affnode.setAttribute('id', 'found' + i);
              affnode.classList.add('found');
            }
          }
          i = i + 1;
        }
      } else if (
        (underline_character == 'underlinetrue' ||
          underline_character == 'underlinenull') &&
        style_element == 'U'
      ) {
        if (underline_character == 'underlinetrue') {
          doCommand('backColor');
          var affnode = getSelectedNode();
          if (findAncestor(affnode, rootEle)) {
            if (
              !findAncestor(affnode, 'rh') &&
              !findAncestor(affnode, 'lh') &&
              !findAncestor(affnode, 'pageno') &&
              !findAncestor(affnode, 'pagenob') &&
              !findAncestor(affnode, 'pagenor') &&
              affnode.tagName.toUpperCase() != 'RH' &&
              affnode.tagName.toUpperCase() != 'LH' &&
              affnode.tagName.toUpperCase() != 'PAGENO' &&
              affnode.tagName.toUpperCase() != 'PAGENOB' &&
              affnode.tagName.toUpperCase() != 'PAGENOR'
            ) {
              affnode.setAttribute('id', 'found' + i);
              affnode.classList.add('found');
            }
          }
          i = i + 1;
        }
      } else if (
        (superscript_character == 'superscripttrue' ||
          superscript_character == 'superscriptnull') &&
        (style_element == 'SUP' || style_element == 'SUPERSCRIPT')
      ) {
        if (superscript_character == 'superscripttrue') {
          doCommand('backColor');
          var affnode = getSelectedNode();
          if (findAncestor(affnode, rootEle)) {
            if (
              !findAncestor(affnode, 'rh') &&
              !findAncestor(affnode, 'lh') &&
              !findAncestor(affnode, 'pageno') &&
              !findAncestor(affnode, 'pagenob') &&
              !findAncestor(affnode, 'pagenor') &&
              affnode.tagName.toUpperCase() != 'RH' &&
              affnode.tagName.toUpperCase() != 'LH' &&
              affnode.tagName.toUpperCase() != 'PAGENO' &&
              affnode.tagName.toUpperCase() != 'PAGENOB' &&
              affnode.tagName.toUpperCase() != 'PAGENOR'
            ) {
              affnode.setAttribute('id', 'found' + i);
              affnode.classList.add('found');
            }
          }
          i = i + 1;
        }
      } else if (
        (subscript_character == 'subscripttrue' ||
          subscript_character == 'subscriptnull') &&
        (style_element == 'SUB' || style_element == 'SUBSCRIPT')
      ) {
        if (subscript_character == 'subscripttrue') {
          doCommand('backColor');
          var affnode = getSelectedNode();
          if (findAncestor(affnode, rootEle)) {
            if (
              !findAncestor(affnode, 'rh') &&
              !findAncestor(affnode, 'lh') &&
              !findAncestor(affnode, 'pageno') &&
              !findAncestor(affnode, 'pagenob') &&
              !findAncestor(affnode, 'pagenor') &&
              affnode.tagName.toUpperCase() != 'RH' &&
              affnode.tagName.toUpperCase() != 'LH' &&
              affnode.tagName.toUpperCase() != 'PAGENO' &&
              affnode.tagName.toUpperCase() != 'PAGENOB' &&
              affnode.tagName.toUpperCase() != 'PAGENOR'
            ) {
              affnode.setAttribute('id', 'found' + i);
              affnode.classList.add('found');
            }
          }
          i = i + 1;
        }
      } else if (
        italic_character != 'italictrue' &&
        bold_character != 'boldtrue' &&
        underline_character != 'underlinetrue' &&
        superscript_character != 'superscripttrue' &&
        subscript_character != 'subscripttrue'
      ) {
        doCommand('backColor');
        var affnode = getSelectedNode();
        if (findAncestor(affnode, rootEle)) {
          if (
            !findAncestor(affnode, 'rh') &&
            !findAncestor(affnode, 'lh') &&
            !findAncestor(affnode, 'pageno') &&
            !findAncestor(affnode, 'pagenob') &&
            !findAncestor(affnode, 'pagenor') &&
            affnode.tagName.toUpperCase() != 'RH' &&
            affnode.tagName.toUpperCase() != 'LH' &&
            affnode.tagName.toUpperCase() != 'PAGENO' &&
            affnode.tagName.toUpperCase() != 'PAGENOB' &&
            affnode.tagName.toUpperCase() != 'PAGENOR'
          ) {
            affnode.setAttribute('id', 'found' + i);
            affnode.classList.add('found');
          }
        }
        i = i + 1;
      }
    }
  }

  $("[background-color='orange']").not('.found').contents().unwrap();
  $('#content')
    .find('.found')
    .each(function () {
      var Id = $(this).attr('id');
      var appHTML = '';
      if ($('.search-result-spell').html() == '') {
        $('.btn-clear').removeClass('hide');
        $('.search-result-spell').append(
          '<div class="searchCount">' + $('.found').length + ' matches </div>'
        );
      }
      var preText = findPreText(Id);
      var nextText = findNextText(Id);
      appHTML =
        '<p onClick="gotoFound(' +
        String.fromCharCode(39) +
        '' +
        Id +
        '' +
        String.fromCharCode(39) +
        ',this);"><span class="searched-txt">' +
        preText.substring(preText.length - 20, preText.length) +
        '<span class="search-keyword">' +
        $(this).text() +
        '</span>' +
        nextText.substring(0, 20) +
        '</span><span onclick="replace_foundonly(' +
        String.fromCharCode(39) +
        '' +
        Id +
        '' +
        String.fromCharCode(39) +
        ');" class="replaceText_only"><i class="fa fa-random find-replace-btn pl-2" title="Replace" aria-hidden="true"></i></span></p>';
      $('.search-result-spell').append(appHTML);
    });
  var spellLen = $('.search-result-spell p').length;
  if (spellLen > 0) {
    $('.searchCount').text(spellLen + ' matches');
  }
  $('#root .w-250-p').removeClass('spellAb').addClass('spellRe');
  $('.find-replace-btn').hide();
  $('.findnreplace_waitingmsg').hide();
  $('#lock').val('false');
  $('.btn-clear').addClass('hide');
}

let count = 0;
let countHis = 0;

function frontmatterInsert() {
  $('#myModalfront').modal({
    backdrop: 'static',
    keyboard: false,
  });
  window.EditorTools.openArticalModal();
}

function dragArticle() {
  $('#authorDrag').sortable({
    handle: '.author-drag',
    axis: 'y',
    cursor: 'move',
    start: function (evt, ui) {},
    stop: function (evt, ui) {
      var itemLeng = ui.item.length;
      if (itemLeng > 0) {
        var uiEle = ui.item[0];
        $(uiEle).addClass('drag-change');
        $(uiEle).addClass('drag-count-' + count++);
      }
    },
  });
}

function dragHistory() {
  $('#hisDrag').sortable({
    handle: '.his-drag',
    axis: 'y',
    cursor: 'move',
    start: function (evt, ui) {},
    stop: function (evt, ui) {
      var itemLeng = ui.item.length;
      if (itemLeng > 0) {
        var uiEle = ui.item[0];
        $(uiEle).addClass('drag-his-change');
        $(uiEle).addClass('drag-his-count-' + countHis++);
      }
    },
  });
}

function updateForm_fm() {
  $('#form_fm').empty();
  var TempIDVal = 0;
  var TempIDVal2 = 0;
  var EleID = 0;
  var contentElement = document.getElementById('ref');
  var metadataEle = contentElement.querySelector('article-meta').children,
    i;
  var titleAction = false;
  var catAction = false;
  citationArray = [];
  if (metadataEle.length > 0) {
    for (i = 0; i < metadataEle.length; ++i) {
      var element = metadataEle[i];
      var eleTagName = element.tagName;
      var appendHtml = '';
      if (eleTagName === 'ARTICLE-CATEGORIES') {
        element = element.querySelector('subject');
        var formVal = getInsertEle(element, 'i');
        var store = element.getAttribute('store');
        appendHtml =
          '<div class="form-group"><label class="popuplabel">Article Category:</label><div class="form-control meta-form" contenteditable="true" data-storeid="' +
          store +
          '" data-tagname="subject" id="fm-subject">' +
          formVal +
          '</div><span class="fmErrorClass hide" id="fm-subject-error">Article Category cannot be blank.</span>';
        $('#form_fm').append(appendHtml);
        // metaEditTrack('formEdit1');
        appendHtml = newArtTitle();
        if (appendHtml !== '') {
          titleAction = true;
        }
        $('#form_fm').append(appendHtml);
      }
      if (eleTagName === 'TITLE-GROUP') {
        appendHtml = newArtCat();
        if (appendHtml !== '') {
          catAction = true;
        }
        $('#form_fm').append(appendHtml);
        element = element.querySelector('article-title');
        var store = element.getAttribute('store');
        var formVal = getInsertEle(element, 'i');
        appendHtml =
          '<div class="form-group"><label class="popuplabel">Article Title:</label><div class="form-control meta-form" contenteditable="true" data-storeid="' +
          store +
          '" data-tagname="article-title" id="fm-article-title">' +
          formVal +
          '</div><span class="fmErrorClass hide" id="fm-article-title-error">Article Title cannot be blank.</span>';
        $('#form_fm').append(appendHtml);
        // metaEditTrack('formEdit2');
        appendHtml = newAuthor('author');
        $('#form_fm').append(appendHtml);
      }
      if (eleTagName === 'CONTRIB-GROUP') {
        appendHtml = newArtTitleCat(catAction, titleAction);
        $('#form_fm').append(appendHtml);
        appendHtml = metaAuthor(element);
        $('#form_fm').append(appendHtml);
        appendHtml = newAuthor('authoronly');
        $('#form_fm').append(appendHtml);
        appendHtml = metaAff(element);
        $('#form_fm').append(appendHtml);
        appendHtml = newAuthor('affonly');
        $('#form_fm').append(appendHtml);
        appendHtml = newCores();
        $('#form_fm').append(appendHtml);
      }
      if (eleTagName === 'AUTHOR-NOTES') {
        appendHtml = metaAuthorNote(element);
        $('#form_fm').append(appendHtml);
        appendHtml = newFn();
        $('#form_fm').append(appendHtml);
      }
      if (
        eleTagName === 'VOLUME1' ||
        eleTagName === 'ISSUE' ||
        eleTagName === 'FPAGE' ||
        eleTagName === 'LPAGE'
      ) {
        var tag =
          eleTagName.charAt(0).toUpperCase() +
          eleTagName.substr(1).toLowerCase();
        var store = element.getAttribute('store');
        var formVal = getInsertEle(element, 'i');
        appendHtml =
          '<div class="form-group"><label class="popuplabel">' +
          tag +
          ':</label><div class="form-control meta-form" contenteditable="true" data-storeid="' +
          store +
          '" data-tagname="' +
          eleTagName +
          '">' +
          formVal +
          '</div></div>';
        $('#form_fm').append(appendHtml);
      }
      if (eleTagName === 'PERMISSIONS') {
        appendHtml = metaPermission(element);
        //$('#form_fm').append(appendHtml);
        appendHtml = newHis();
        $('#form_fm').append(appendHtml);
      }
      if (eleTagName === 'HISTORY') {
        appendHtml = metaHistory(element);
        $('#form_fm').append(appendHtml);
      }
    }
  }
  $('#affDrag').sortable({
    handle: '.aff-drag',
    axis: 'y',
    cursor: 'move',
    start: function (evt, ui) {},
    stop: function (evt, ui) {
      var itemLeng = ui.item.length;
      if (itemLeng > 0) {
        var searchId = 'aff-storeid';
        var uiEle = ui.item[0];
        metaReorder(searchId, uiEle, 'aff');
      }
    },
  });
  $('#authorDrag').sortable({
    handle: '.author-drag',
    axis: 'y',
    cursor: 'move',
    start: function (evt, ui) {},
    stop: function (evt, ui) {
      var itemLeng = ui.item.length;
      if (itemLeng > 0) {
        var searchId = 'contrib-storeid';
        var uiEle = ui.item[0];
        metaReorder(searchId, uiEle, 'author');
      }
    },
  });
  $('#hisDrag').sortable({
    handle: '.his-drag',
    axis: 'y',
    cursor: 'move',
    start: function (evt, ui) {},
    stop: function (evt, ui) {
      var itemLeng = ui.item.length;
      if (itemLeng > 0) {
        var searchId = 'date-cont-storeid';
        var uiEle = ui.item[0];
        metaReorder(searchId, uiEle, 'his');
      }
    },
  });

  $('#form_fm').scrollTop(0);
  return false;
}

// Call from React component
metaReorder = (searchId, uiEle, action) => {
  var storeId = uiEle.getAttribute(searchId);
  var nextEle = uiEle.nextElementSibling;
  var prevEle = uiEle.previousElementSibling;
  var metaDataElement = document.getElementById('content');
  var curEle = metaDataElement.querySelector("[store='" + storeId + "']");
  if (nextEle !== null) {
    var nextStoreId = nextEle.getAttribute(searchId);
    var nextEle = metaDataElement.querySelector(
      "[store='" + nextStoreId + "']"
    );
    var curHtml = curEle.outerHTML;
    var nextHtml = nextEle.outerHTML;
    if (action === 'author') {
      var prevSibEle = curEle.previousElementSibling;
      var nextSibEle = curEle.nextElementSibling;
      if (prevSibEle !== null) {
        var commentLine = getCommetsEle(curEle, 'prev');
        if (
          nextSibEle === null ||
          (nextSibEle !== null && nextSibEle.tagName !== 'CONTRIB')
        ) {
          curHtml = curHtml + commentLine;
        } else {
          if (nextSibEle !== null && nextSibEle.tagName === 'CONTRIB') {
            curHtml = curHtml + commentLine;
          } else {
            curHtml = commentLine + curHtml;
          }
        }
      } else {
        var commentLine = getCommetsEle(curEle, 'next');
        curHtml = curHtml + commentLine;
      }
    }
    nextEle.outerHTML = curHtml + nextHtml;
    curEle.remove();
  } else {
    var nextStoreId = prevEle.getAttribute(searchId);
    var nextEle = metaDataElement.querySelector(
      "[store='" + nextStoreId + "']"
    );
    var curHtml = curEle.outerHTML;
    var nextHtml = nextEle.outerHTML;
    if (action === 'author') {
      var prevSibEle = curEle.previousElementSibling;
      if (prevSibEle !== null) {
        var commentLine = getCommetsEle(curEle, 'prev');
        curHtml = commentLine + curHtml;
      } else {
        var commentLine = getCommetsEle(curEle, 'next');
        curHtml = curHtml + commentLine;
      }
    }
    nextEle.outerHTML = nextHtml + curHtml;
    curEle.remove();
  }
};

getCommetsEle = (curEle, action) => {
  var result = '';
  if (action === 'prev') {
    var firstNodeType = curEle.previousSibling.nodeType;
    if (firstNodeType === 8) {
      var secNodeType = curEle.previousSibling.previousSibling.nodeType;
      if (secNodeType === 3) {
        var secNode = curEle.previousSibling.previousSibling;
        var NodeType3 =
          curEle.previousSibling.previousSibling.previousSibling.nodeType;
        if (NodeType3 === 8) {
          result = '<!--punc-->' + secNode.nodeValue + '<!--punc-->';
          curEle.previousSibling.remove();
          curEle.previousSibling.remove();
          curEle.previousSibling.remove();
        }
      }
    }
  }
  if (action === 'next') {
    var firstNodeType = curEle.nextSibling.nodeType;
    if (firstNodeType === 8) {
      var secNodeType = curEle.nextSibling.nextSibling.nodeType;
      if (secNodeType === 3) {
        var secNode = curEle.nextSibling.nextSibling;
        var NodeType3 = curEle.nextSibling.nextSibling.nextSibling.nodeType;
        if (NodeType3 === 8) {
          result = '<!--punc-->' + secNode.nodeValue + '<!--punc-->';
          curEle.nextSibling.remove();
          curEle.nextSibling.remove();
          curEle.nextSibling.remove();
        }
      }
    }
  }
  return result;
};

metaAuthor = (contribElement) => {
  var contribEle = contribElement.querySelectorAll('contrib'),
    i,
    j;
  var deleteAuthorPer = validateVxePermission(
    'article_meta_edit',
    'delete_author'
  );
  var editAuthorPer = validateVxePermission('article_meta_edit', 'edit_author');
  var reorderAuthorPer = validateVxePermission(
    'article_meta_edit',
    'reorder_author'
  );
  var orcidAuthorPer = validateVxePermission(
    'article_meta_edit',
    'orcid_author'
  );
  var fnAuthorPer = validateVxePermission(
    'article_meta_edit',
    'footnote_author'
  );
  var citationAuthorPer = validateVxePermission(
    'article_meta_edit',
    'citation_author'
  );
  var contentEdit = 'false';
  if (editAuthorPer) {
    contentEdit = true;
  }
  var authorHtml = '';
  var authorInc = 1;
  if (contribEle.length > 0) {
    for (i = 0; i < contribEle.length; ++i) {
      var element = contribEle[i];
      var childElement = getAllChildEle(element);
      var storeId = element.getAttribute('store');
      var childLen = childElement.length;
      if (childLen === 0) {
        continue;
      }
      var chHtml = '';
      var affRid = '';
      var childElementLength = childElement.length;
      if (childElementLength === 1) {
        chEletagName = childElement[0].tagName;
        var delSpan = childElement[0].classList.contains('del');
        if (chEletagName === 'SPAN' && delSpan) {
          continue;
        } else {
          if (chEletagName !== 'NAME') {
            childElement = getAllChildEle(childElement[0]);
          }
        }
      }
      for (j = 0; j < childElement.length; ++j) {
        var singleHtml = '';
        var chEle = childElement[j];
        var chtagName = chEle.tagName;
        if (chtagName === 'NAME') {
          var surname = chEle.querySelector('surname');
          var surStore = surname.getAttribute('store');
          var given = chEle.querySelector('given-names');
          var givenStore = given.getAttribute('store');
          var formVal1 = getInsertEle(surname, 'i');
          var formVal2 = getInsertEle(given, 'i');
          singleHtml =
            '<div class="fm-author-form"><label class="popuplabel">Surname:</label><div class="form-control meta-form" contenteditable="' +
            contentEdit +
            '" data-storeid="' +
            surStore +
            '" data-tagname="surname" data-label="Surname">' +
            formVal1 +
            '</div></div><div class="fm-author-form"><label class="popuplabel">Given Name:</label><div class="form-control meta-form" contenteditable="' +
            contentEdit +
            '" data-storeid="' +
            givenStore +
            '" data-tagname="given-names" data-label="Given Name">' +
            formVal2 +
            '</div></div>';
        }
        if (chtagName === 'XREF') {
          var refType = chEle.getAttribute('ref-type');
          var rid = '';
          var citationlink = '';
          var citationText = 'Footnote';
          if (refType === 'aff') {
            citationlink = ' citationlink';
            citationText = 'Affiliation';
            rid = chEle.getAttribute('rid');
            if (affRid === '') {
              affRid = affRid + rid;
            } else {
              affRid = affRid + ',' + rid;
            }
            chEle = chEle.querySelector('sup');
          }
          var formVal = getInsertEle(chEle, 'i');
          var store = chEle.getAttribute('store');
          singleHtml =
            '<div class="fm-xref-form"><label class="popuplabel">' +
            citationText +
            ' Citation:</label><div class="form-control meta-form ' +
            citationlink +
            '" contenteditable="' +
            contentEdit +
            '" data-storeid="' +
            store +
            '" data-tagname="XREF" data-label="' +
            citationText +
            ' Citation">' +
            formVal +
            '</div></div>';
        }
        if (chtagName === 'SUP') {
          var formVal = getInsertEle(chEle, 'i');
          var store = chEle.getAttribute('store');
          singleHtml =
            '<div class="fm-separtor-form"><label class="popuplabel">Separaror:</label><div class="form-control meta-form" contenteditable="' +
            contentEdit +
            '" data-storeid="' +
            store +
            '" data-tagname="XREF" data-label="Separaror">' +
            formVal +
            '</div></div>';
        }
        chHtml = chHtml + singleHtml;
      }
      var reorderStr = '';
      var deleteStr = '';
      var orcidStr = '';
      var fnStr = '';
      var citationStr = '';
      var contentElement = document.getElementById('ref');
      var authorEle = contentElement.querySelector('author-notes');
      if (authorEle !== null) {
        if (fnAuthorPer === true) {
          fnStr =
            '<i class="material-icons-outlined new-footnote" title="Footnote" author-id="fm-author-' +
            i +
            '" author-storeid="' +
            storeId +
            '">insert_link</i>';
        }
      }
      if (reorderAuthorPer) {
        reorderStr =
          '<i class="material-icons-outlined author-drag" title="Reorder">drag_indicator</i>';
      }
      if (deleteAuthorPer) {
        deleteStr =
          '<i class="material-icons-outlined" title="Delete" onClick="deleteMetaAuthor(\'' +
          storeId +
          "','fm-author-" +
          i +
          "','author','" +
          affRid +
          '\')">delete</i>';
      }
      if (orcidAuthorPer) {
        orcidStr =
          '<span class="info-orcid" title="ORCID" onClick="orcidNew(\'' +
          storeId +
          '\')">ORCID</span>';
      }
      if (citationAuthorPer) {
        citationStr =
          '<i class="material-icons-outlined new-auth-citation" title="New Citation" author-id="fm-author-' +
          i +
          '" author-storeid="' +
          storeId +
          '">add</i>';
      }
      chHtml =
        '<div class="form-group fm-author-group" id="fm-author-' +
        i +
        '" contrib-storeid="' +
        storeId +
        '" data-errorid="author' +
        i +
        '-error">' +
        chHtml +
        '<div class="fm-delete-form">' +
        orcidStr +
        fnStr +
        citationStr +
        deleteStr +
        reorderStr +
        '</div></div><span class="fmErrorClass hide" id="author' +
        i +
        '-error">Author cannot be blank.</span>';
      authorInc++;
      authorHtml = authorHtml + chHtml;
    }
    authorHtml =
      '<div class="fm-author-label">Author(s):</div><div id="authorDrag">' +
      authorHtml +
      '</div><div class="mb-2"><span class="material-icons">add</span><span class="fm-new-label fm-new-author">New Author</span></div>';
  }
  return authorHtml;
};
var citationArray = [];
metaAff = (contribElement) => {
  var affEle = contribElement.querySelectorAll('aff'),
    i,
    j;
  var deleteAffPer = validateVxePermission('article_meta_edit', 'delete_aff');
  var editAffPer = validateVxePermission('article_meta_edit', 'edit_aff');
  var reorderAffPer = validateVxePermission('article_meta_edit', 'reorder_aff');
  var contentEdit = 'false';
  if (editAffPer) {
    contentEdit = true;
  }
  var affHtml = '';
  var affInc = 1;
  if (affEle.length > 0) {
    for (i = 0; i < affEle.length; ++i) {
      var element = affEle[i];
      var childElement = getAllChildEle(element);
      var childElementLength = childElement.length;
      var rid = element.getAttribute('id');
      if (childElementLength === 1) {
        chEletagName = childElement[0].tagName;
        var delSpan = childElement[0].classList.contains('del');
        if (chEletagName === 'SPAN' && delSpan) {
          continue;
        } else {
          childElement = getAllChildEle(childElement[0]);
        }
      }
      var elementNew = element.cloneNode(true);
      var newListEle = false;
      if (childElementLength === 2) {
        var chEletagName1 = childElement[0].tagName;
        var chEletagName2 = childElement[1].tagName;
        if (chEletagName1 === 'SPAN' && chEletagName2 === 'SPAN') {
          var elementNew1 = element.cloneNode(true);
          childElement = getAllChildEle(elementNew1);
          childElement[0].remove();
          $(childElement[0]).contents().unwrap();
          newListEle = true;
        }
      }
      if (newListEle) {
        var supEle = elementNew1.querySelector('sup');
      } else {
        var supEle = elementNew.querySelector('sup');
      }
      var newStr = '';
      if (supEle !== null) {
        var store = supEle.getAttribute('store');
        var formVal1 = getInsertEle(supEle, 'i');
        newStr =
          '<div class="fm-xref-form fm-xref-aff-form"><label class="popuplabel">Affiliation Citation:</label><div class="form-control meta-form" contenteditable="false" data-storeid="' +
          store +
          '" data-tagname="XREF">' +
          formVal1 +
          '</div></div>';
        supEle.remove();
        var citationNum = supEle.innerText;
        if (citationArray.indexOf(citationNum) === -1) {
          citationArray.push({ citation: citationNum, rid: rid });
        }
      }

      var storeId = element.getAttribute('store');
      var formVal2 = getInsertEle(elementNew, 'i');
      if (newListEle) {
        formVal2 = getInsertEle(elementNew1, 'i');
      }
      var reorderStr = '';
      var deleteStr = '';
      if (reorderAffPer) {
        reorderStr =
          '<i class="material-icons-outlined aff-drag hide" title="Reorder">drag_indicator</i>';
      }
      if (deleteAffPer) {
        deleteStr =
          '<i class="material-icons-outlined" title="Delete" onClick="deleteMetaAuthor(\'' +
          storeId +
          "','fm-aff-" +
          i +
          "','affliation','" +
          rid +
          '\',false)">delete</i>';
      }
      if (editAffPer === false) {
        formVal2 = formVal2.replaceAll(
          'contenteditable="true"',
          'contenteditable="false"'
        );
      }
      affHtml =
        affHtml +
        '<div class="form-group" id="fm-aff-' +
        i +
        '" aff-storeid="' +
        storeId +
        '">' +
        newStr +
        '<div class="fm-aff-form"><label class="popuplabel">Affiliation ' +
        affInc +
        ':</label><div class="form-control meta-form" contenteditable="' +
        contentEdit +
        '" data-storeid="' +
        storeId +
        '" data-tagname="aff">' +
        formVal2 +
        '</div></div><div class="fm-delete-form">' +
        deleteStr +
        reorderStr +
        '</div></div>';
      affInc++;
    }
    affHtml =
      '<div class="fm-author-label mb-3">Affiliation(s):</div><div id="affDrag">' +
      affHtml +
      '</div><div class="mb-2"><span class="material-icons">add</span><span class="fm-new-label fm-new-aff">New Affiliation</span></div>';
  }
  return affHtml;
};

metaEditTrack = function (id) {
  var textEle = document.getElementById(id);
  const userId = $('#userid').val();
  var userName = $('#username').val();
  window.tracker = new window.ice.InlineChangeEditor({
    element: textEle,
    handleEvents: true,
    currentUser: { id: userId, name: userName },
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
};

newAuthor = (action) => {
  var contentElement = document.getElementById('ref');
  var element = contentElement.querySelector('contrib-group');
  var str = '';
  if (element === null) {
    if (action === 'author') {
      str =
        '<div class="mb-2 new-author"><span class="material-icons">add</span><span class="fm-new-label">New Author</span></div><div class="mb-2 new-aff"><span class="material-icons">add</span><span class="fm-new-label">New Affiliation</span></div>';
    }
  } else {
    if (action === 'authoronly') {
      var contribEle = element.querySelector('contrib');
      if (contribEle === null) {
        str =
          '<div class="mb-2 new-author"><span class="material-icons">add</span><span class="fm-new-label">New Author</span></div>';
      }
    }
    if (action === 'affonly') {
      var contribEle = element.querySelector('aff');
      if (contribEle === null) {
        str =
          '<div class="mb-2 new-aff"><span class="material-icons">add</span><span class="fm-new-label">New Affiliation</span></div>';
      }
    }
  }
  return str;
};

metaAuthorNote = (element) => {
  var j;
  var chHtml = '';
  var childElement = getAllChildEle(element);
  for (j = 0; j < childElement.length; ++j) {
    var chEle = childElement[j];
    var chtagName = chEle.tagName;
    if (chtagName === 'CORRESP') {
      var store = chEle.getAttribute('store');
      var formVal = getInsertEle(chEle, 'i');
      chHtml =
        chHtml +
        '<div class="form-group" id="notes"><label class="popuplabel">Correspondence:</label><div class="form-control meta-form" contenteditable="true" data-storeid="' +
        store +
        '" data-tagname="CORRESP">' +
        formVal +
        '</div></div>';
    }
    if (chtagName === 'FN') {
      var ppEle = chEle.querySelector('pp1');
      var store = ppEle.getAttribute('store');
      var formVal = getInsertEle(ppEle, 'i');
      chHtml =
        chHtml +
        '<div class="form-group" id="fmfootnote"><label class="popuplabel">Footnote:</label><div class="form-control meta-form" contenteditable="true" data-storeid="' +
        store +
        '" data-tagname="pp1" id="fm-fn">' +
        formVal +
        '</div></div>';
    }
  }
  return chHtml;
};

metaPermission = (element) => {
  var j;
  var chHtml = '';
  var childElement = getAllChildEle(element);
  for (j = 0; j < childElement.length; ++j) {
    var chEle = childElement[j];
    var chtagName = chEle.tagName;
    var store = chEle.getAttribute('store');
    var formVal = getInsertEle(chEle, 'i');
    if (chtagName === 'COPYRIGHT-STATEMENT') {
      formVal = getInsertEle(chEle, 'i');
      chHtml =
        chHtml +
        '<div class="form-group"><label class="popuplabel">Copyright Statement:</label><div class="form-control meta-form" contenteditable="true" data-storeid="' +
        store +
        '" data-tagname="COPYRIGHT-STATEMENT">' +
        formVal +
        '</div></div>';
    }
    if (chtagName === 'COPYRIGHT-YEAR') {
      chHtml =
        chHtml +
        '<div class="form-group"><label class="popuplabel">Copyright Year:</label><div class="form-control meta-form" contenteditable="true" data-storeid="' +
        store +
        '" data-tagname="COPYRIGHT-YEAR">' +
        formVal +
        '</div></div>';
    }
    if (chtagName === 'VOL') {
      chHtml =
        chHtml +
        '<div class="form-group"><label class="popuplabel">Volume:</label><div class="form-control meta-form" contenteditable="true" data-storeid="' +
        store +
        '" data-tagname="Volume">' +
        formVal +
        '</div></div>';
    }
    if (chtagName === 'ISS') {
      chHtml =
        chHtml +
        '<div class="form-group"><label class="popuplabel">Issue:</label><div class="form-control meta-form" contenteditable="true" data-storeid="' +
        store +
        '" data-tagname="Issue">' +
        formVal +
        '</div></div>';
    }
    if (chtagName === 'COPYRIGHT-HOLDER') {
      // chHtml = chHtml + '<div class="form-group"><label class="popuplabel">Copyright Holder:</label><div class="form-control meta-form" >'+formVal+'</div></div>';
    }
  }
  return (
    '<div class="fm-author-label mb-3">Copyright Information:</div>' + chHtml
  );
};

metaHistory = (element) => {
  var j, k;
  var chHtml = '';
  var childElement = getAllChildEle(element);
  for (j = 0; j < childElement.length; ++j) {
    var chEle = childElement[j];
    var storeId = chEle.getAttribute('store');
    var chEleNew = chEle.cloneNode(true);
    var dateChildElement = getAllChildEle(chEleNew);
    var childElementLength = dateChildElement.length;
    if (childElementLength === 0) {
      continue;
    }
    if (childElementLength === 1) {
      chEletagName = dateChildElement[0].tagName;
      var delSpan = dateChildElement[0].classList.contains('del');
      if (chEletagName === 'SPAN' && delSpan) {
        continue;
      }
    }
    var dateEle = chEleNew.querySelector('date');
    var dateChildElement = getAllChildEle(dateEle);
    var singleHtml = '';
    for (k = 0; k < dateChildElement.length; ++k) {
      var dateChild = dateChildElement[k];
      var dateChildTag = dateChild.tagName;
      if (dateChildTag === 'DAY') {
        var store = dateChild.getAttribute('store');
        var formVal = getInsertEle(dateChild, 'i');
        singleHtml =
          singleHtml +
          '<div class="fm-author-form"><label class="popuplabel">Day:</label><div class="form-control meta-form" contenteditable="true" data-storeid="' +
          store +
          '" data-tagname="DAY" data-label="Day">' +
          formVal +
          '</div></div>';
      }
      if (dateChildTag === 'MONTH') {
        var store = dateChild.getAttribute('store');
        var formVal = getInsertEle(dateChild, 'i');
        singleHtml =
          singleHtml +
          '<div class="fm-author-form"><label class="popuplabel">Month:</label><div class="form-control meta-form" contenteditable="true" data-storeid="' +
          store +
          '" data-tagname="MONTH" data-label="Month">' +
          formVal +
          '</div></div>';
      }
      if (dateChildTag === 'YEAR') {
        var store = dateChild.getAttribute('store');
        var formVal = getInsertEle(dateChild, 'i');
        singleHtml =
          singleHtml +
          '<div class="fm-author-form"><label class="popuplabel">Year:</label><div class="form-control meta-form" contenteditable="true" data-storeid="' +
          store +
          '" data-tagname="YEAR" data-label="Year">' +
          formVal +
          '</div></div>';
      }
    }
    dateEle.remove();
    var id = 'his' + j;
    var formVal = getInsertEle(chEleNew, 'i');
    var store = chEleNew.getAttribute('store');
    singleHtml =
      '<div class="fm-author-form fm-his-form"><label class="popuplabel">Date:</label><div class="form-control meta-form" contenteditable="true" data-storeid="' +
      store +
      '" data-tagname="history" data-label="Date">' +
      formVal +
      '</div></div>' +
      singleHtml;
    chHtml =
      chHtml +
      '<div class="form-group fm-author-group" id="' +
      id +
      '" date-cont-storeid="' +
      storeId +
      '" data-errorid="' +
      id +
      '-error">' +
      singleHtml +
      '<div class="fm-delete-form"><i class="material-icons-outlined" title="Delete" onclick="deleteMetaAuthor(\'' +
      storeId +
      "','" +
      id +
      '\')">delete</i><i class="material-icons-outlined his-drag" title="Reorder">drag_indicator</i></div></div><span class="fmErrorClass hide" id="' +
      id +
      '-error">History Information cannot be blank.</span>';
  }
  return (
    '<div class="fm-author-label mb-3">History Information:</div><div id="hisDrag">' +
    chHtml +
    '</div><div class="mb-2" id="author-history"><span class="material-icons">add</span><span class="fm-new-label fm-new-his">New History</span></div>'
  );
};

newHis = () => {
  var contentElement = document.getElementById('ref');
  var element = contentElement.querySelector('history');
  var str = '';
  if (element === null) {
    str =
      '<div class="mb-2" id="author-history"><span class="material-icons">add</span><span class="fm-new-label new-his">New History</span></div>';
  }
  return str;
};

newCores = () => {
  var contentElement = document.getElementById('ref');
  var element = contentElement.querySelector('author-notes');
  var str = '';
  if (element === null) {
    str =
      '<div class="mb-2" id="author-notes"><span class="material-icons">add</span><span class="fm-new-label new-notes">New Correspondence</span></div>';
  }
  return str;
};

newFn = () => {
  var contentElement = document.getElementById('ref');
  var element = contentElement.querySelector('fn');
  var str = '';
  if (element === null) {
    str =
      '<div class="mb-2" id="author-fn"><span class="material-icons">add</span><span class="fm-new-label new-fn">New Footnote</span></div>';
  }
  return str;
};

newArtTitle = () => {
  var contentElement = document.getElementById('ref');
  var element = contentElement.querySelector('title-group');
  var str = '';
  if (element === null) {
    str =
      '<div class="mb-2" id="title-group"><span class="material-icons">add</span><span class="fm-new-label new-title">New Article Title</span></div><span class="fmTitleError hide" id="fm-article-title-error-new">Article Title is missing.</span>';
  }
  return str;
};

newArtCat = () => {
  var contentElement = document.getElementById('ref');
  var element = contentElement.querySelector('article-categories');
  var str = '';
  if (element === null) {
    str =
      '<div class="mb-2" id="article-categories"><span class="material-icons">add</span><span class="fm-new-label new-categories">New Article Category</span></div><span class="fmTitleError hide" id="fm-subject-error-new">Article Category is missing.</span>';
  }
  return str;
};

newArtTitleCat = (action1, action2) => {
  var cat = '';
  var title = '';
  if (!action1) {
    cat = newArtCat();
  }
  if (!action2) {
    title = newArtTitle();
  }
  return cat + title;
};

var fmFieldEdit = false;
var pasteEve = false;

removeTags = (ele) => {
  $(ele)
    .children()
    .each(function () {
      var childEle = $(this)[0];
      var tagName = childEle.tagName;
      if (
        tagName === 'B' ||
        tagName === 'INSTITUTION' ||
        tagName === 'COUNTRY' ||
        tagName === 'I' ||
        tagName === 'SUP' ||
        tagName === 'SUB'
      ) {
      } else {
        var text = childEle.innerText;
        if (text === '') {
          childEle.remove();
        } else {
          $(this).contents().unwrap();
        }
      }
    });
};

metaFormUpdateNew = (e) => {
  if (e.keyCode === 13) {
    return false;
  }
  var str = '';
  var selectedNode = window.getSelectedNode();
  var storeId = selectedNode.getAttribute('data-storeid');
  var contentElement = document.getElementById('metaData');
  if (storeId === null) {
    var closeNode = selectedNode.closest('[data-storeid]');
    if (closeNode === null) {
      closeNode = selectedNode.querySelector('[data-storeid]');
    }
    if (closeNode === null) {
      return false;
    }
    storeId = closeNode.getAttribute('data-storeid');
    selectedNode = closeNode;
  }
  if (storeId !== null && storeId !== '') {
    citresult = false;
    var oldEle = contentElement.querySelector("[store='" + storeId + "']");
    var citationTag = selectedNode.closest('.citationlink');
    if (citationTag !== null) {
      citresult = citationValidation(selectedNode);
      if (citresult === false) {
        var preLength = selectedNode.innerText.length;
        if (preLength !== 1) {
          var oldStrText = getOldEle(oldEle, 'text');
          selectedNode.innerText = oldStrText;
        } else {
          selectedNode.innerText = '';
        }
        var selLen = selectedNode.innerText.length;
        setCurPosPopup('data-storeid', storeId, selLen);
        $('#fmEditorError').text(
          'This Article has only ' + citationArray.length + ' Affiliation.'
        );
        $('#editorErrorEle').removeClass('hide');
        $('#orcidEle').addClass('hide');
        $('#affDeleteConfm').addClass('hide');
        $('#fmSecondModal').modal({
          backdrop: 'static',
          keyboard: false,
        });
        return false;
      }
    }
    var newNodeLen = selectedNode.childElementCount;
    if (newNodeLen > 0) {
      var removedTags = removeTags(selectedNode);
    }
    var newStr = selectedNode.innerHTML;
    var tagName = selectedNode.getAttribute('data-tagname');
    var userName = $('#username').val();
    var d = new Date();
    var dt = Date.parse(d);
    const userId = $('#userid').val();
    if (tagName === 'aff') {
      var refEl = $('#metaData').find("[store='" + storeId + "'] sup").length;
      var oldEleNew1 = oldEle.cloneNode(true);
      var oldEleNew2 = oldEle.cloneNode(true);
      var oldSubLen = $(oldEleNew1).find('sup').length;
      var supELe = '';
      if (oldSubLen > 0) {
        $(oldEleNew2).find('sup').remove();
        supELe = $(oldEleNew1).find('sup')[0].outerHTML;
        supELe = supELe + ' ';
      }
      var oldStr = getOldEle(oldEleNew2);
      var delStr = '';
      var affStr = '';
      if (oldStrText !== '') {
        delStr =
          '<span class="del cts-1" data-cid="66" data-userid="' +
          userId +
          '" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '">' +
          oldStr +
          '</span>';
      }
      if (newStr !== '') {
        affStr =
          '<span class="ins cts-1" data-cid="66" data-userid="' +
          userId +
          '" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_ins">' +
          newStr +
          '</span>';
      }
      if (oldStr !== newStr) {
        str = supELe + delStr + affStr;
      }
    } else if (tagName === 'history') {
      var oldStr = getOldEle(oldEle);
      var oldStrText = getOldEle(oldEle, 'text');
      oldEle = contentElement.querySelector("[store='" + storeId + "']");
      var oldEleNew = oldEle.cloneNode(true);
      var dateEle = oldEleNew.querySelector('date');
      var dateOldEle = oldEle.querySelector('date');
      if (dateEle !== null) {
        dateEle.remove();
      }
      oldStr = getOldEle(oldEleNew);
      var delStr = '';
      if (oldStr !== '') {
        delStr =
          '<span class="del cts-1" data-cid="66" data-userid="' +
          userId +
          '" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '">' +
          oldStr +
          '</span>';
      }
      if (newStr !== '') {
        delStr =
          delStr +
          '<span class="ins cts-1" data-cid="66" data-userid="' +
          userId +
          '" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_ins">' +
          newStr +
          '</span>' +
          dateOldEle.outerHTML;
      }
      if (oldStr !== newStr) {
        str = delStr;
      }
    } else {
      var oldStr = getOldEle(oldEle);
      var oldStrText = getOldEle(oldEle, 'text');
      var delStr = '';
      if (oldStrText !== '') {
        delStr =
          '<span class="del cts-1" data-cid="66" data-userid="' +
          userId +
          '" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '">' +
          oldStr +
          '</span>';
      }
      if (newStr !== '') {
        delStr =
          delStr +
          '<span class="ins cts-1" data-cid="66" data-userid="' +
          userId +
          '" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '_ins">' +
          newStr +
          '</span>';
      }
      if (oldStr !== newStr) {
        str = delStr;
      }
    }
    var metaDataElement = document.getElementById('metaData');
    var element = metaDataElement.querySelector("[store='" + storeId + "']");
    var refDataElement = document.getElementById('ref');
    var refelement = refDataElement.querySelector("[store='" + storeId + "']");

    var parTag = element.parentElement.tagName;
    if (parTag === 'XREF' && citresult !== false) {
      $(element.parentElement).attr('rid', citresult);
      $(refelement.parentElement).attr('rid', citresult);
    }
    if (str !== '') {
      element.innerHTML = str;
      refelement.innerHTML = str;
    }
    validateFields();
    validateMetaElement('authorDrag', 'author');
    validateMetaElement('hisDrag', 'history');
  }
};

validateFields = () => {
  var result = true;
  var metaDataElement = document.getElementById('metaData');
  var subjectELe = metaDataElement.querySelector('article-categories');
  var titleELe = metaDataElement.querySelector('article-title');
  var fnEle = metaDataElement.querySelector('fn');
  if (subjectELe !== null) {
    var result1 = validateSingleFields('fm-subject', 'fm-subject-error');
    if (result1 === false) {
      result = false;
    }
  } else {
    result = false;
    $('#fm-subject-error-new').removeClass('hide');
  }
  if (titleELe !== null) {
    var result2 = validateSingleFields(
      'fm-article-title',
      'fm-article-title-error'
    );
    if (result2 === false) {
      result = false;
    }
  } else {
    result = false;
    $('#fm-article-title-error-new').removeClass('hide');
  }
  if (fnEle !== null) {
    var result3 = validateSingleFields('fm-fn', 'fm-fn-error');
    if (result3 === false) {
      result = false;
    }
  }
  return result;
};

validateSingleFields = (id, errorId) => {
  var result = true;
  $('#' + errorId).addClass('hide');
  var subject = $('#' + id).text();
  if (subject === '') {
    result = false;
    $('#' + errorId).removeClass('hide');
  }
  return result;
};

citationValidation = (ele) => {
  var text = ele.innerText;
  var i;
  var result = true;
  if (text !== '') {
    result = false;
    for (i = 0; i < citationArray.length; i++) {
      var citationList = citationArray[i];
      var citationText = citationList.citation;
      var rid = citationList.rid;
      if (citationText == text) {
        result = rid;
      }
    }
  }
  return result;
};

setCurPosPopup = (searchEle, searchVal, cursorPos) => {
  var range = document.createRange();
  var sel = window.getSelection();
  var el = document.querySelector(
    '#form_fm [' + searchEle + "='" + searchVal + "']"
  );
  var cur = parseInt(cursorPos);
  var i;
  var childNo = 0;
  var totalLength = 0;
  for (i = 0; i < el.childNodes.length; i++) {
    var length = el.childNodes[i].length;
    if (length === undefined) {
      length = 0;
    }
    totalLength = totalLength + length;
    if (length <= totalLength) {
      childNo = i;
    }
  }
  if (cur >= totalLength) {
    cur = totalLength;
  }
  if (
    el !== null &&
    el.childNodes[childNo] !== undefined &&
    el.childNodes[childNo].length >= cur
  ) {
    range.setStart(el.childNodes[childNo], cur);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
  }
};

closePopup = (idName) => {
  $('#' + idName).modal('hide');
};

updateMetadata = () => {
  var authorValidation = validateMetaElement('authorDrag', 'author');
  var hisVal = validateMetaElement('hisDrag', 'history');
  var emptyVal = validateFields();
  if (authorValidation === true && emptyVal === true && hisVal === true) {
    var localdata_set = $('.localstorevalue').val();
    storedata(localdata_set, 'EK');
    var metaUpdate = document.getElementById('metaData');
    var element_Data = metaUpdate.querySelector('article-meta');
    $('#content article-meta').html(element_Data.innerHTML);
    var msg = 'Article meta data updated.';
    autosavefunction_vxe(msg);
    $('#myModalfront').modal('hide');
  }
};

validateMetaElement = (id, action) => {
  var result = true;
  $('#' + id)
    .children()
    .each(function () {
      var ele = $(this)[0];
      var metaForm = ele.querySelectorAll('.meta-form'),
        i;
      if (metaForm.length > 0) {
        var j = 0;
        var deleteId = ele.getAttribute('data-errorid');
        var deleteTagName = '';
        for (i = 0; i < metaForm.length; ++i) {
          var element = metaForm[i];
          var text = element.innerText;
          deleteTagName = element.getAttribute('data-label');
          if (text !== '') {
            continue;
          } else {
            ++j;
          }
          if (j > 0) {
            break;
          }
        }
        $('#' + deleteId).addClass('hide');
        if (j > 0) {
          $('#' + deleteId).removeClass('hide');
          var message = deleteTagName + ' cannot be blank.';
          $('#' + deleteId).text(message);
          result = false;
        }
      }
    });
  return result;
};

getInsertEle = (ele, action) => {
  if (ele !== null) {
    var labelRemoveEle = ele.querySelectorAll(
        'query,span.del,comment,span.sr-only'
      ),
      j;
    if (labelRemoveEle.length > 0) {
      for (j = 0; j < labelRemoveEle.length; ++j) {
        labelRemoveEle[j].remove();
      }
    }
    var insEle = ele.querySelectorAll('span.ins'),
      k;
    if (insEle.length > 0) {
      for (k = 0; k < insEle.length; ++k) {
        var selectedNode = insEle[k];
        $(selectedNode).contents().unwrap();
      }
    }
    if (action === 'i') {
      return ele.innerHTML;
    }
    if (action === 'o') {
      return ele.outerHTML;
    }
  }
};

getOldEle = (ele, action) => {
  var insEle = ele.querySelectorAll('span.ins'),
    j;
  if (insEle.length > 0) {
    for (j = 0; j < insEle.length; ++j) {
      insEle[j].remove();
    }
  }
  var delEle = ele.querySelectorAll('span.del'),
    k;
  if (delEle.length > 0) {
    for (k = 0; k < delEle.length; ++k) {
      var selectedNode = delEle[k];
      $(selectedNode).contents().unwrap();
    }
  }
  if (action === 'text') {
    return ele.innerText;
  }
  return ele.innerHTML;
};

modelHide = (id) => {
  $('#' + id).modal('hide');
};
deleteMetaAuthor = (storeId, id, action, rid, deleteConfirm) => {
  if (action === 'affliation' && deleteConfirm === false) {
    $('#editorErrorEle').addClass('hide');
    $('#orcidEle').addClass('hide');
    $('#affDeleteConfm').removeClass('hide');
    $('#deleteAff').attr(
      'onClick',
      "deleteMetaAuthor('" +
        storeId +
        "','" +
        id +
        "','" +
        action +
        "','" +
        rid +
        "');"
    );
    $('#deleteAffCancel').attr('onClick', "hideSecModal('fmSecondModal');");
    $('#fmSecondModal').modal({
      backdrop: 'static',
      keyboard: false,
    });
    return false;
  }
  var contentElement = document.getElementById('metaData');
  var selectedNode = contentElement.querySelector("[store='" + storeId + "']");
  var preEle = $('#' + id).prev();
  if (preEle.length > 0) {
    var preEleId = $(preEle[0]).attr('id');
  }
  var newStr = selectedNode.innerHTML;
  var userName = $('#username').val();
  var d = new Date();
  var dt = Date.parse(d);
  const userId = $('#userid').val();
  var str =
    '<span class="del cts-1" data-cid="66" data-userid="' +
    userId +
    '" data-username="' +
    userName +
    '" data-time="' +
    dt +
    '">' +
    newStr +
    '</span>';
  var metaDataElement = document.getElementById('metaData');
  var element = metaDataElement.querySelector("[store='" + storeId + "']");
  element.innerHTML = str;
  var refDataElement = document.getElementById('ref');
  var refelement = refDataElement.querySelector("[store='" + storeId + "']");
  refelement.innerHTML = str;
  var removeEle = document.getElementById(id);
  removeEle.remove();
  if (action === 'affliation') {
    hideSecModal('fmSecondModal');
    var contribEle = contentElement.querySelector('contrib-group');
    if (contribEle !== null) {
      var affCitaEle = contribEle.querySelectorAll("[rid='" + rid + "']"),
        i;
      if (affCitaEle.length > 0) {
        for (i = 0; i < affCitaEle.length; ++i) {
          var affElement = affCitaEle[i];
          var prevEle = affElement.previousElementSibling;
          if (prevEle !== null && prevEle.tagName !== 'SUP') {
            prevEle = affElement.nextElementSibling;
          }
          var supElement = affElement.querySelector('sup');
          if (supElement !== null) {
            var supStoreId = supElement.getAttribute('store');
            deleteAuthorCitation(
              supElement,
              metaDataElement,
              refDataElement,
              supStoreId
            );
          }
          if (prevEle !== null && prevEle.tagName === 'SUP') {
            var supStoreId = prevEle.getAttribute('store');
            deleteAuthorCitation(
              prevEle,
              metaDataElement,
              refDataElement,
              supStoreId
            );
          }
        }
      }
    }
  }
  if (action === 'author') {
    var removeAff = removeAffli(rid, storeId);
    if (removeAff === false) {
      var xrefEle1 = refDataElement.querySelector('[id="' + rid + '"]');
      var xrefEle2 = metaDataElement.querySelector('[id="' + rid + '"]');
      if (xrefEle1 !== null) {
        newStr = xrefEle1.innerHTML;
        str =
          '<span class="del cts-1" data-cid="66" data-userid="' +
          userId +
          '" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '">' +
          newStr +
          '</span>';
        //xrefEle1.innerHTML = str;
      }
      if (xrefEle2 !== null) {
        newStr = xrefEle2.innerHTML;
        str =
          '<span class="del cts-1" data-cid="66" data-userid="' +
          userId +
          '" data-username="' +
          userName +
          '" data-time="' +
          dt +
          '">' +
          newStr +
          '</span>';
        //xrefEle2.innerHTML = str;
      }
      if (xrefEle2 === null && xrefEle2 === null) {
        var metaText = selectedNode.innerText;
        var commetNode = getCommetsEle(selectedNode, 'prev');
        selectedNode.remove();
      }
    }
  }
  var fn = updateForm_fm();
  if (preEleId !== null) {
    fmeditScroll(preEleId);
  }
};

deleteAuthorCitation = (ele, metaDataElement, refDataElement, supStoreId) => {
  ele = getOldEle(ele, 'text');
  var userName = $('#username').val();
  var d = new Date();
  var dt = Date.parse(d);
  const userId = $('#userid').val();
  var str =
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
    var element = metaDataElement.querySelector("[store='" + supStoreId + "']");
    element.innerHTML = str;
    var refelement = refDataElement.querySelector(
      "[store='" + supStoreId + "']"
    );
    refelement.innerHTML = str;
  }
};

removeAffli = (id, storeId) => {
  var result = false;
  if (id !== '') {
    var ids = id.split(',');
    for (let index = 0; index < ids.length; index++) {
      var rid = ids[index];
      var metaDataElement = document.getElementById('metaData');
      var xrefEle = metaDataElement.querySelectorAll('[rid="' + rid + '"]'),
        i;
      if (xrefEle.length > 0) {
        for (i = 0; i < xrefEle.length; ++i) {
          var element = xrefEle[i];
          var parEleTag = element.parentElement.tagName;
          var parEleStore = element.parentElement.getAttribute('store');
          if (parEleTag !== 'SPAN' && parEleStore !== storeId) {
            result = true;
          }
        }
      }
    }
  }
  return result;
};

$(document).on('click', '.fm-new-author', function () {
  var d = new Date();
  var dt = Date.parse(d);
  const userId = $('#userid').val();
  var userName = $('#username').val();
  var str =
    '<!--punc-->, <!--punc--><contrib contrib-type="author" corresp="no" store="contrib' +
    dt +
    '" contenteditable="true"> <name store="name' +
    dt +
    '" contenteditable="true"><surname store="surname' +
    dt +
    '" contenteditable="true"></surname> <given-names store="given' +
    dt +
    '" contenteditable="true"></given-names></name><xref ref-type="aff" store="xref' +
    dt +
    '" contenteditable="true"><sup store="sup' +
    dt +
    '" contenteditable="true"></sup></xref></contrib>';
  var metaDataElement = document.getElementById('metaData');
  var affEle = metaDataElement.querySelectorAll('contrib'),
    i;
  if (affEle.length > 0) {
    var affLen = affEle.length - 1;
    var storeId = affEle[affLen].getAttribute('store');
    $("#metaData [store='" + storeId + "']").after(str);
    $("#ref [store='" + storeId + "']").after(str);
    var fn = updateForm_fm();
    var newAffId = $('.fm-new-author').prev().length;
    if (newAffId > 0) {
      var affId = $('#authorDrag').children().last().attr('id');
      if (affId !== null) {
        fmeditScroll(affId);
      }
    }
  }
});

$(document).on('click', '.fm-new-aff', function () {
  var d = new Date();
  var dt = Date.parse(d);
  const userId = $('#userid').val();
  var userName = $('#username').val();
  var metaDataElement = document.getElementById('metaData');
  var affEle = metaDataElement.querySelectorAll('aff'),
    i;
  if (affEle.length > 0) {
    var affLen = affEle.length;
    var j = 1;
    for (i = 0; i < affEle.length; ++i) {
      var element = affEle[i];
      var childElement = getAllChildEle(element);
      var childElementLength = childElement.length;
      if (childElementLength === 1) {
        chEletagName = childElement[0].tagName;
        var delSpan = childElement[0].classList.contains('del');
        if (chEletagName === 'SPAN' && delSpan) {
          continue;
        } else {
          j++;
        }
      } else {
        j++;
      }
    }
    var str =
      '<aff store="affli' +
      dt +
      '" contenteditable="true" class="hidden_para" id="aff' +
      dt +
      '"><span class="ins cts-1" data-cid="66" data-userid="' +
      userId +
      '" data-username="' +
      userName +
      '" data-time="' +
      dt +
      '_ins1"> <sup store="sup' +
      dt +
      '" contenteditable="true" >' +
      j +
      '</sup></span></aff>';
    affLen = affLen - 1;
    var storeId = affEle[affLen].getAttribute('store');
    $("#metaData [store='" + storeId + "']").after(str);
    $("#ref [store='" + storeId + "']").after(str);
    var fn = updateForm_fm();
    var newAffId = $('.fm-new-aff').prev().length;
    if (newAffId > 0) {
      var affId = $('#affDrag').children().last().attr('id');
      fmeditScroll(affId);
    }
  }
});

$(document).on('click', '.fm-new-his', function () {
  var d = new Date();
  var dt = Date.parse(d);
  const userId = $('#userid').val();
  var userName = $('#username').val();
  var str =
    '<date-cont store="datecont' +
    dt +
    '" contenteditable="true"><span class="ins cts-1" data-cid="66" data-userid="' +
    userId +
    '" data-username="' +
    userName +
    '" data-time="' +
    dt +
    '_ins1"></span><date store="date' +
    dt +
    '" contenteditable="true"><day store="day' +
    dt +
    '" contenteditable="true"></day> <month store="month' +
    dt +
    '" contenteditable="true"></month> <year store="year' +
    dt +
    '" contenteditable="true"></year></date></date-cont>';
  var metaDataElement = document.getElementById('metaData');
  var affEle = metaDataElement.querySelectorAll('date-cont'),
    i;
  if (affEle.length > 0) {
    var affLen = affEle.length;
    affLen = affLen - 1;
    var storeId = affEle[affLen].getAttribute('store');
    $("#metaData [store='" + storeId + "']").after(str);
    $("#ref [store='" + storeId + "']").after(str);
    var fn = updateForm_fm();
    fmeditScroll('author-history');
  }
});

$(document).on('click', '.new-author', function () {
  var d = new Date();
  var dt = Date.parse(d);
  const userId = $('#userid').val();
  var userName = $('#username').val();
  var metaDataElement = document.getElementById('metaData');
  var element = metaDataElement.querySelector('contrib-group');
  if (element !== null) {
    var str =
      '<contrib contrib-type="author" corresp="no" store="contrib' +
      dt +
      '" contenteditable="true"><surname store="surname' +
      dt +
      '" contenteditable="true"></surname> <given-names store="given' +
      dt +
      '" contenteditable="true"></given-names></name><xref ref-type="aff" store="xref' +
      dt +
      '" contenteditable="true"><sup store="sup' +
      dt +
      '" contenteditable="true"></sup></xref></contrib>';
    var affEle = metaDataElement.querySelectorAll('contrib'),
      i;
    if (affEle.length > 0) {
      var affLen = affEle.length - 1;
      var storeId = affEle[affLen].getAttribute('store');
      $("#metaData [store='" + storeId + "']").after(str);
      $("#ref [store='" + storeId + "']").after(str);
      var fn = updateForm_fm();
      fmeditScroll('fm-author-0');
    } else {
      var affEle = metaDataElement.querySelectorAll('aff'),
        i;
      if (affEle.length > 0) {
        var affLen = affEle.length;
        affLen = affLen - 1;
        var storeId = affEle[affLen].getAttribute('store');
        $("#metaData [store='" + storeId + "']").before(str);
        $("#ref [store='" + storeId + "']").before(str);
        var fn = updateForm_fm();
        fmeditScroll('fm-author-0');
      }
    }
  } else {
    var str =
      '<contrib-group title="CONTRIB-GROUP" store="contribg' +
      dt +
      '"><contrib contrib-type="author" corresp="no" store="contrib' +
      dt +
      '" contenteditable="true"><name store="name' +
      dt +
      '" contenteditable="true"><surname store="surname' +
      dt +
      '" contenteditable="true"></surname> <given-names store="given' +
      dt +
      '" contenteditable="true"></given-names></name><xref ref-type="aff" store="xref' +
      dt +
      '" contenteditable="true"><sup store="sup' +
      dt +
      '" contenteditable="true"></sup></xref></contrib></contrib-group>';
    var affEle = metaDataElement.querySelector('title-group'),
      i;
    if (affEle !== null) {
      var storeId = affEle.getAttribute('store');
      $("#metaData [store='" + storeId + "']").after(str);
      $("#ref [store='" + storeId + "']").after(str);
      var fn = updateForm_fm();
      fmeditScroll('fm-author-0');
    }
  }
});

$(document).on('click', '.new-aff', function () {
  var d = new Date();
  var dt = Date.parse(d);
  const userId = $('#userid').val();
  var userName = $('#username').val();
  var metaDataElement = document.getElementById('metaData');
  var element = metaDataElement.querySelector('contrib-group');
  if (element !== null) {
    var str =
      '<aff store="aff' +
      dt +
      '" contenteditable="true"><sup store="sup' +
      dt +
      '" contenteditable="true" ></sup></aff>';
    var affEle = metaDataElement.querySelectorAll('aff'),
      i;
    if (affEle.length > 0) {
      var affLen = affEle.length;
      affLen = affLen - 1;
      var storeId = affEle[affLen].getAttribute('store');
      $("#metaData [store='" + storeId + "']").after(str);
      $("#ref [store='" + storeId + "']").after(str);
      var fn = updateForm_fm();
      fmeditScroll('fm-aff-0');
    } else {
      (affEle = metaDataElement.querySelectorAll('contrib')), i;
      if (affEle.length > 0) {
        var affLen = affEle.length;
        affLen = affLen - 1;
        var storeId = affEle[affLen].getAttribute('store');
        $("#metaData [store='" + storeId + "']").after(str);
        $("#ref [store='" + storeId + "']").after(str);
        var fn = updateForm_fm();
        fmeditScroll('fm-aff-0');
      }
    }
  } else {
    var str =
      '<contrib-group title="CONTRIB-GROUP" store="contribg' +
      dt +
      '"><aff store="aff' +
      dt +
      '" contenteditable="true" class="hidden_para"> <sup store="sup' +
      dt +
      '" contenteditable="true" ></sup></aff></contrib-group>';
    var affEle = metaDataElement.querySelector('title-group'),
      i;
    if (affEle !== null) {
      var storeId = affEle.getAttribute('store');
      $("#metaData [store='" + storeId + "']").after(str);
      $("#ref [store='" + storeId + "']").after(str);
      var fn = updateForm_fm();
      fmeditScroll('fm-aff-0');
    }
  }
});

$(document).on('click', '.new-his', function () {
  var d = new Date();
  var dt = Date.parse(d);
  const userId = $('#userid').val();
  var userName = $('#username').val();
  var str =
    '<history store="his' +
    dt +
    '"><date-cont store="datecont' +
    dt +
    '" contenteditable="true"> <date store="date' +
    dt +
    '" contenteditable="true"> <day store="day' +
    dt +
    '" contenteditable="true"></day> <month store="month' +
    dt +
    '" contenteditable="true"></month> <year store="year' +
    dt +
    '" contenteditable="true"></year></date></date-cont></history>';
  var metaDataElement = document.getElementById('metaData');
  var affEle = metaDataElement.querySelector('history'),
    i;
  if (affEle === null) {
    var affElee = metaDataElement.querySelector('permissions');
    if (affElee !== null) {
      var storeId = affElee.getAttribute('store');
      $("#metaData [store='" + storeId + "']").after(str);
      $("#ref [store='" + storeId + "']").after(str);
      var fn = updateForm_fm();
      fmeditScroll('his0');
    }
  }
});

$(document).on('click', '.new-fn', function () {
  var d = new Date();
  var dt = Date.parse(d);
  const userId = $('#userid').val();
  var userName = $('#username').val();
  var str =
    '<fn store="fn' + dt + '" id="fn1"><pp1 store="pp1' + dt + '"></pp1></fn>';
  var metaDataElement = document.getElementById('metaData');
  var affEle = metaDataElement.querySelector('fn'),
    i;
  if (affEle === null) {
    var affElee = metaDataElement.querySelector('corresp');
    if (affElee !== null) {
      var storeId = affElee.getAttribute('store');
      $("#metaData [store='" + storeId + "']").after(str);
      $("#ref [store='" + storeId + "']").after(str);
      var fn = updateForm_fm();
      fmeditScroll('fmfootnote');
    }
  }
});

$(document).on('click', '.new-notes', function () {
  var d = new Date();
  var dt = Date.parse(d);
  const userId = $('#userid').val();
  var userName = $('#username').val();
  var str =
    '<author-notes store="notes' +
    dt +
    '"><corresp store="corresp' +
    dt +
    '" id="c1"><span class="ins cts-1" data-cid="66" data-userid="' +
    userId +
    '" data-username="' +
    userName +
    '" data-time="' +
    dt +
    '_ins1">&nbsp;</span></corresp></author-notes>';
  var metaDataElement = document.getElementById('metaData');
  var affEle = metaDataElement.querySelector('author-notes'),
    i;
  if (affEle === null) {
    var affElee = metaDataElement.querySelector('contrib-group');
    if (affElee !== null) {
      var storeId = affElee.getAttribute('store');
      $("#metaData [store='" + storeId + "']").after(str);
      $("#ref [store='" + storeId + "']").after(str);
      var fn = updateForm_fm();
      fmeditScroll('notes');
    }
  }
});

$(document).on('click', '.new-title', function () {
  var d = new Date();
  var dt = Date.parse(d);
  const userId = $('#userid').val();
  var userName = $('#username').val();
  var str =
    '<title-group store="tigroup' +
    dt +
    '"><article-title store="title' +
    dt +
    '"></article-title></title-group>';
  var metaDataElement = document.getElementById('metaData');
  var affEle = metaDataElement.querySelector('title-group'),
    i;
  if (affEle === null) {
    var affElee = metaDataElement.querySelector('contrib-group');
    if (affElee !== null) {
      var storeId = affElee.getAttribute('store');
      $("#metaData [store='" + storeId + "']").before(str);
      $("#ref [store='" + storeId + "']").before(str);
      var fn = updateForm_fm();
      fmeditScroll('title-group');
    }
  }
});

$(document).on('click', '.new-categories', function () {
  var d = new Date();
  var dt = Date.parse(d);
  const userId = $('#userid').val();
  var userName = $('#username').val();
  var str =
    '<article-categories store="categories' +
    dt +
    '"><subj-group store="subjectgp' +
    dt +
    '"><subject store="subject' +
    dt +
    '"></subject></subj-group></article-categories>';
  var metaDataElement = document.getElementById('metaData');
  var affEle = metaDataElement.querySelector('article-categories'),
    i;
  if (affEle === null) {
    var affElee = metaDataElement.querySelector('title-group');
    if (affElee === null) {
      affElee = metaDataElement.querySelector('contrib-group');
    }
    if (affElee !== null) {
      var storeId = affElee.getAttribute('store');
      $("#metaData [store='" + storeId + "']").before(str);
      $("#ref [store='" + storeId + "']").before(str);
      var fn = updateForm_fm();
      fmeditScroll('title-group');
    }
  }
});

// $(document).on("click",".new-footnote",function() {
//   let store = $(this).attr("author-storeid");
//   let id = $(this).attr("author-id");
//   let d = new Date();
//   let dt = Date.parse(d);
//   let str = '<!--punc--><sup store="sup'+dt+'">,</sup><!--punc--><xref ref-type="fn" rid="fn1" store="fn'+dt+'"></xref>';
//   let metaDataElement = document.getElementById('metaData');
//   let contribEle = metaDataElement.querySelector('[store="'+store+'"]'),i;
//   if(contribEle !== null){
//     let contribChildLen = contribEle.childElementCount;
//     let str1 = '<fn store="fn'+dt+'" id="fn1"><pp1 store="pp1'+dt+'"></pp1></fn>';
//     let affEle = metaDataElement.querySelector('fn'),i;
//     if(affEle === null){
//       var affElee = metaDataElement.querySelector('corresp');
//       if(affElee !== null){
//         var storeId = affElee.getAttribute('store');
//         $("#metaData [store='"+storeId+"']").after(str1);
//         $("#ref [store='"+storeId+"']").after(str1);
//       }
//     }
//     if(contribChildLen > 0){
//       let ele = contribEle.children[contribChildLen - 1];
//       let storeId = ele.getAttribute('store');
//       $("#metaData [store='"+storeId+"']").after(str);
//       $("#ref [store='"+storeId+"']").after(str);
//       var fn = updateForm_fm();
//       fmeditScroll(id);
//     }
//   }
// });

$(document).on('click', '.new-auth-citation', function () {
  var store = $(this).attr('author-storeid');
  var id = $(this).attr('author-id');
  var d = new Date();
  var dt = Date.parse(d);
  const userId = $('#userid').val();
  var userName = $('#username').val();
  var str =
    '<!--punc--><sup store="sup' +
    dt +
    '">,</sup><!--punc--><xref ref-type="aff" rid="" store="newcitation' +
    dt +
    '"><sup store="supnew' +
    dt +
    '"></sup></xref>';
  var metaDataElement = document.getElementById('metaData');
  var contribEle = metaDataElement.querySelector('[store="' + store + '"]'),
    i;
  if (contribEle !== null) {
    var contribChildLen = contribEle.childElementCount;
    if (contribChildLen > 0) {
      var ele = contribEle.children[contribChildLen - 1];
      var storeId = ele.getAttribute('store');
      $("#metaData [store='" + storeId + "']").after(str);
      $("#ref [store='" + storeId + "']").after(str);
      var fn = updateForm_fm();
      fmeditScroll(id);
    }
  }
});

fmeditScroll = (id) => {
  var xmlContentScrollTop = $('#form_fm').scrollTop();
  var extraHeight = 127.5;
  //var id = 'author-history';
  var selectContentPosTop = $('#' + id).offset();
  if (selectContentPosTop !== undefined) {
    selectContentPosTop = $('#' + id).offset().top;
    $('#form_fm').scrollTop(
      selectContentPosTop + xmlContentScrollTop - extraHeight
    );
  }
};

validateText = (ele) => {
  if (ele !== null) {
    var str = ele.innerText;
    if (str === '') {
      //ele.innerHTML = "&nbsp;";
    }
  }

  return ele;
};

removeSpace = (ele) => {
  var str = ele.innerText;
  if (str !== '') {
    var first = str.charAt(0);
    var code = first.charCodeAt(0);
    if (code === 32 || code === 160) {
      str = str.substring(1);
      ele.innerText = str;
    }
  } else {
    ele = validateText(ele);
  }
  return ele;
};

getAllChildEle = (ele) => {
  return ele.children;
};

orcidPopup = (storeId) => {
  var metaDataElement = document.getElementById('metaData');
  var contribEle = metaDataElement.querySelector("[store='" + storeId + "']");
  var orcidVal = contribEle.getAttribute('orcid');
  if (orcidVal !== null || orcidVal !== '') {
    $('#orcID').val(orcidVal);
  }
  $('#orcidEle').removeClass('hide');
  $('#editorErrorEle').addClass('hide');
  $('#affDeleteConfm').addClass('hide');
  $('#fmSecondModal').modal({
    backdrop: 'static',
    keyboard: false,
  });
  document.getElementById('orchidSave').setAttribute('storeId', storeId);
  $('#orcID').attr('onkeypress', 'return isNumberKey(event);');
};

isNumberKey = (evt) => {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode != 45 && charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
};

orchidSave = () => {
  $('.orcidError').addClass('hide');
  let storeId = document.getElementById('orchidSave').getAttribute('storeId');
  let orcid = $('#orcID').val();
  let orcidLen = orcid.length;
  if (orcid !== '' && orcidLen > 15 && orcidLen < 20) {
    let contentElement = document.getElementById('content');
    let contentcontribEle = contentElement.querySelector(
      "[store='" + storeId + "']"
    );
    $(contentcontribEle).attr('orcid', orcid);
    let nameEle = contentcontribEle.querySelector('name');
    let imgELe = contentcontribEle.querySelector('img');
    if (imgELe === null) {
      let date = new Date();
      let imgID = Date.parse(date);
      let str =
        '<img src="' +
        imgFilePath +
        '/webdav-server/xmlfiles/docbook/5912/12290/finaloutput/images/orcid.jpg" store="img' +
        imgID +
        '" contenteditable="false">'; // Image Path was hardcoded, since while run the PDF generation it path only can have
      $(contentcontribEle).append(str);
    }
    modelHide('fmSecondModal');
    $('#fmnewElement').val('');
  } else {
    $('.orcidError').removeClass('hide');
    if (orcid === '') {
      $('.orcidError').text('ORCID cannot be blank.');
    } else {
      $('.orcidError').text('Invalid ORCID.');
    }
  }
};

hideSecModal = (id) => {
  $('fmnewElement').val('');
  modelHide(id);
};

$(document).on('mousedown', '.fm-editor', function (e) {
  var cmd = $(this).attr('data-cmdvalue');
  e.preventDefault();
  fmEditor(cmd);
});

fmEditor = (cmd) => {
  var selectedText = getHTMLOfSelection();
  var d = new Date();
  var dt = Date.parse(d);
  var userName = $('#username').val();
  var selectedNode = window.getSelectedNode();
  var storeId = selectedNode.getAttribute('data-storeid');
  let affnode_1 = getSelectedNode();
  let selected_node_1 = affnode_1.tagName;
  if (storeId === null) {
    var closeNode = selectedNode.closest('[data-storeid]');
    if (closeNode === null) {
      closeNode = selectedNode.querySelector('[data-storeid]');
    }
    if (closeNode === null) {
      return false;
    }
    storeId = closeNode.getAttribute('data-storeid');
    selectedNode = closeNode;
  }
  var tagName = selectedNode.getAttribute('data-tagname');
  if (
    selectedText !== '' &&
    cmd !== '' &&
    tagName !== 'surname' &&
    tagName !== 'given-names' &&
    tagName !== 'XREF'
  ) {
    var cmd = commandRelation[cmd];
    if (
      (cmd.cmd === 'subscript' && selected_node_1 === 'SUB') ||
      (cmd.cmd === 'superscript' && selected_node_1 === 'SUP')
    ) {
      let datetime = affnode_1.getAttribute('data-time');
      let selected_node_1 = affnode_1.tagName;
      if (datetime !== undefined && datetime !== '') {
        $(selected_node_1 + "[data-time='" + datetime + "']")
          .contents()
          .unwrap();
      }
    } else {
      document.execCommand(cmd.cmd, false, cmd.val || '');
    }
    var affnode = getSelectedNode();
    affnode.setAttribute('data-time', dt);
    affnode.setAttribute('data-username', userName);
    $(affnode).parents('.form-control').addClass('modified-article');
  } else {
    var cmdTxt = capitalizeFirstLetter(cmd);
    if (selectedText === '') {
      $('#fmEditorError').text(
        'Please select the content for adding ' + cmdTxt
      );
      $('#editorErrorEle').removeClass('hide');
      $('#orcidEle').addClass('hide');
      $('#affDeleteConfm').addClass('hide');
      $('#fmSecondModal').modal({
        backdrop: 'static',
        keyboard: false,
      });
    } else {
      var formatNode = selectedNode.querySelector('b,i');
      if (
        formatNode !== null &&
        (tagName === 'surname' || tagName === 'given-names')
      ) {
        $(formatNode).contents().unwrap();
      }
      if (tagName === 'surname' || tagName === 'given-names') {
        $('#fmEditorError').text(
          'Formatting changes are not applicable to Author names.'
        );
        $('#editorErrorEle').removeClass('hide');
        $('#orcidEle').addClass('hide');
        $('#affDeleteConfm').addClass('hide');
        $('#fmSecondModal').modal({
          backdrop: 'static',
          keyboard: false,
        });
      }
    }
  }
};

showValidationModal = (e, affEle) => {
  $('#fmEditorError').text(
    'This Article has only ' + affEle.length + ' Affiliation.'
  );
  $('#editorErrorEle').removeClass('hide');
  $('#orcidEle').addClass('hide');
  $('#affDeleteConfm').addClass('hide');
  $('#fmSecondModal').modal({
    backdrop: 'static',
    keyboard: false,
  });
  return false;
};

deleteAffConfirm = () => {
  $('#editorErrorEle').addClass('hide');
  $('#orcidEle').addClass('hide');
  $('#affDeleteConfm').removeClass('hide');
  $('#fmSecondModal').modal({
    backdrop: 'static',
    keyboard: false,
  });
  return false;
};

$('.inlinePaste').on('change', function () {
  var inlinePasteChecked = $('.inlinePaste').prop('checked');
  $('#inlinePaste').addClass('hide');
  $('#inlineNormal').addClass('hide');
  if (inlinePasteChecked === true) {
    $('#inlinePaste').removeClass('hide');
    $('.inline_table').prop('checked', false);
  } else {
    $('#inlineNormal').removeClass('hide');
    $('.inline_table').prop('checked', true);
  }
});

$(document).on('mousedown', '.ref-editor', function (e) {
  var cmd = $(this).attr('data-cmdvalue');
  e.preventDefault();
  refEditor(cmd);
});

$(document).on('keyup', '.newcitationlink', function (e) {
  let data = e.currentTarget;
  authorCitationValidate(data);
});

authorCitationValidate = (data, action) => {
  let brEle = data.getElementsByTagName('br');
  if (brEle.length > 0) {
    Array.from(brEle).forEach((brtag, index) => {
      brtag.remove();
    });
  }
  let contentEle = document.getElementById('content');
  let affEle = contentEle.getElementsByTagName('aff'),
    i;
  let dataNew = data.cloneNode(true);
  let citationtext = window.getInsertEle(dataNew, 'i');
  if (affEle.length > 0 && citationtext !== '') {
    let res = false;
    for (i = 0; i < affEle.length; ++i) {
      let element = affEle[i];
      let elementNew = element.cloneNode(true);
      let supEle = elementNew.querySelector('sup');
      if (!!supEle) {
        let affText = window.getInsertEle(supEle, 'i');
        if (citationtext == affText && !res) {
          res = true;
        }
      }
    }
    if (action === 'action') {
      return res;
    }
    if (!res) {
      showValidationModal(res, affEle);
    }
  }
};

refEditor = (cmd) => {
  var selectedText = getHTMLOfSelection();
  var d = new Date();
  var dt = Date.parse(d);
  var userName = $('#username').val();
  var selectedNode = window.getSelectedNode();
  let affnode_1 = getSelectedNode();
  let selected_node_1 = affnode_1.tagName;
  if (selectedText !== '' && cmd !== '') {
    var cmd = commandRelation[cmd];
    if (
      (cmd.cmd === 'subscript' && selected_node_1 === 'SUB') ||
      (cmd.cmd === 'superscript' && selected_node_1 === 'SUP')
    ) {
      let datetime = affnode_1.getAttribute('data-time');
      let selected_node_1 = affnode_1.tagName;
      if (datetime !== undefined && datetime !== '') {
        $(selected_node_1 + "[data-time='" + datetime + "']")
          .contents()
          .unwrap();
      }
    } else {
      document.execCommand(cmd.cmd, false, cmd.val || '');
    }
    var affnode = getSelectedNode();
    affnode.setAttribute('data-time', dt);
    affnode.setAttribute('data-username', userName);
    var targetEle = affnode.closest('[targetid]');
    if (!!targetEle) {
      var referenceNode = targetEle.getAttribute('targetid');
      if (!!referenceNode) {
        var targetChild = targetEle.childElementCount;
        var action = 0;
        var change_val = targetEle.innerText;
        if (targetChild > 0) {
          action = 1;
          change_val = targetEle.innerHTML;
        }
        refKeyup(referenceNode, change_val, action);
      }
    }
  }
};

collapseFun = () => {
  $('.collapse.show').collapse('hide');
};

document.addEventListener(
  'drop',
  function (event) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    // move dragged elem to the selected drop target
    return false;
  },
  false
);
