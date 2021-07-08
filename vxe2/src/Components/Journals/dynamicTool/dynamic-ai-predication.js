import React from 'react';
import '../css/journals-main.css';
import $ from 'jquery';
//import { setIsLoading } from '../../../utils/reusuableFunctions';
import Loading from '../loading/spinningCircle';

class AIPredication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectStyleEditorOptions: [],
      selectParentOptions: [],
      AIJsondata: [],
      value: '',
      PDFpath: '',
      openEditModal: false,
      loading: false,
    };
  }

  handleChange = (event) => {
    var id = event.target.id;
    var api_url = $('#api_url').val();
    fetch(api_url + '/VXE/FindAiGroupElementJournal/', {
      method: 'POST',
      body: JSON.stringify({
        child_value: event.target.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(id);
        var parentid = '#' + $('#' + id).attr('refid') + '_parent';
        var innerhtml = data.group_name.map(function (wizard) {
          return '<option>' + wizard.ccchild + '</option>';
        });
        $(parentid).html(innerhtml);
        if ($(parentid + ' option:eq(1)').length != 0) {
          $(parentid).val($(parentid + ' option:eq(1)').val());
        } else {
          $(parentid).val($(parentid + ' option:eq(0)').val());
        }
      })
      .catch(function (error) {
        console.log('error---', error);
      });
  };

  componentDidMount() {
    this.buildingAIpredication();
  }

  aisubmit = (e) => {
    let radioVal = $('.radio-ai-input:checked').val();
    let errorEle = document.getElementById('ai-error');
    //there was a few tiny changes to syntax. one below is one i noticed - keep note of.
    if (!!radioVal) {
      //setIsLoading(true, ['body']);
      this.setState({
        loading: true,
      });
      errorEle.classList.add('hide');
      this.setState({ openEditModal: false }, () =>
        this.props.sendAIPredicationModal(this.state.openEditModal)
      );
      e.preventDefault();
      let project_id = $('#projectid').val();
      let chapter_id = $('#chapterid').val();
      let LdxData = [];
      $('tbody#ai_body tr').each(function (index) {
        let cells = $(this).find('td');
        LdxData[index] = {};
        $(cells).each(function (cellIndex) {
          let colume_name = $(this).attr('column-name');
          if (colume_name == 'UserTag') {
            LdxData[index][colume_name] = $(this).find('.sel_ele').val();
          } else if (colume_name == 'Parent') {
            LdxData[index][colume_name] = $(this).find('.sel_ele_parant').val();
          } else {
            LdxData[index][colume_name] = $(this).text();
          }
        });
      });
      var myObj = {};
      myObj.LdxData = LdxData;
      let str = JSON.stringify(myObj);
      let api_url = $('#api_url').val();
      fetch(api_url + '/VXE/journalAiPredicationSubmit/', {
        method: 'POST',
        body: JSON.stringify({
          project_id: project_id,
          chapter_id: chapter_id,
          string: str,
          referencetype: radioVal,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          //setIsLoading(false, ['body']);
          this.setState({
            loading: false,
          });
          document.location.href = document.location.href;
        })
        .catch(function (error) {
          //oldLoader
          //$('#loading-wrapper').hide();
          //setIsLoading(false, ['body']);
          this.setState({
            loading: false,
          });
        });
    } else {
      errorEle.classList.remove('hide');
    }
  };

  buildingAIpredication = () => {
    //$('#loading-wrapper').show();
    //setIsLoading(true, ['body']);
    this.setState({
      loading: true,
    });
    var api_url = $('#api_url').val();
    fetch(api_url + '/VXE/journalAiPredication/', {
      method: 'POST',
      body: JSON.stringify({
        ProjectId: $('#projectid').val(),
        ChapterId: $('#chapterid').val(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        var AI_data = JSON.stringify(data.jsondata);
        AI_data = JSON.parse(AI_data);
        AI_data = JSON.parse(AI_data);
        this.setState({ AIJsondata: AI_data.LdxData });
        this.setState({ selectStyleEditorOptions: data.child_tag });
        this.setState({ selectParentOptions: data.group_name });
        this.setState({ PDFpath: data.pdf_path });
        //oldLoader
        //$('#loading-wrapper').hide();
        //setIsLoading(false, ['body']);
        this.setState({
          loading: false,
        });
      })
      .catch(function (error) {
        //oldLoader
        //$('#loading-wrapper').hide();
        //setIsLoading(false, ['body']);
        this.setState({
          loading: false,
        });
        console.log('error---', error);
      });
  };

  render() {
    const {
      selectStyleEditorOptions,
      AIJsondata,
      selectParentOptions,
      loading,
    } = this.state;
    const apiURL = $('#api_url').val();
    const ProjectId = $('#projectid').val();
    return (
      <form className="h-100">
        {loading && <Loading loadingText={'Loading...'} />}
        <div className="row mt-4 h-100">
          <div className="col-sm-7 ai-contain">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Content</th>
                  <th className="aiElement">AI Element</th>
                  <th>Change Element</th>
                  <th>Parent Element</th>
                </tr>
              </thead>
              <tbody id="ai_body">
                {AIJsondata.map((data, index) => (
                  <tr id={index}>
                    <td
                      className="sel_ele"
                      column-name="ParaID"
                      style={{ display: 'none' }}
                    >
                      {data.ParaID}
                    </td>
                    <td
                      className="sel_ele ParaCleanedContent"
                      column-name="ParaCleanedContent"
                    >
                      {data.ParaCleanedContent}
                    </td>
                    <td
                      className="sel_ele"
                      column-name="IdentifyStyle"
                      style={{ width: '130px' }}
                    >
                      {data.IdentifyStyle}
                    </td>
                    <td column-name="UserTag">
                      <select
                        id={data.ParaID}
                        className="sel_ele childtagAI"
                        column-name="UserTag"
                        onChange={this.handleChange}
                      >
                        <option value="select">Select</option>
                        {selectStyleEditorOptions.map((itemlist) =>
                          (data.UserTag !== null
                            ? data.UserTag
                            : data.IdentifyStyle) === itemlist.tag ? (
                            <option
                              value={itemlist.tag}
                              id={itemlist.id + '_option'}
                              selected
                            >
                              {itemlist.tag}
                            </option>
                          ) : (
                            <option
                              value={itemlist.tag}
                              id={itemlist.id + '_option'}
                            >
                              {itemlist.tag}
                            </option>
                          )
                        )}
                        ;
                      </select>
                    </td>

                    <td column-name="Parent">
                      <select
                        id={data.ParaID + '_parent'}
                        className="parenttagAI"
                        className="sel_ele_parant parenttagAI"
                        column-name="Parent"
                      >
                        {selectParentOptions.map((parentlist) =>
                          data.Parent === parentlist.ccchild ? (
                            <option value={parentlist.ccchild} selected>
                              {parentlist.ccchild}
                            </option>
                          ) : (
                            <option value={parentlist.ccchild}>
                              {parentlist.ccchild}
                            </option>
                          )
                        )}
                        ;
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <input
              type="hidden"
              name="project_id"
              id="aiproject_id"
              value={ProjectId}
            />
            <input
              type="hidden"
              name="chapter_id"
              id="aichapter_id"
              value="0"
            />
            <input
              type="hidden"
              name="chapter_name"
              id="aichapter_name"
              value={this.props.selectedChapterXmlName}
            />
          </div>
          <div className="col-sm-5">
            <div className="embed-container h-100">
              {this.state.PDFpath != '' ? (
                <object
                  id="ai_pdf_path"
                  width="620"
                  height="100%"
                  data={apiURL + '/' + this.state.PDFpath}
                ></object>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        <div className="float-left mt-1">
          <div className="form-group ai-referece-select mb-0">
            <span className="legend_group">Reefrence Type:</span>
            <div className="ai-radio">
              <input
                type="radio"
                className="radio-ai-input"
                value="1"
                id="ai-reference1"
                name="ai-reference"
              />
              <label className="radio-ai-label">[1,2,3,.. n]</label>
            </div>
            <div className="ai-radio">
              <input
                type="radio"
                className="radio-ai-input"
                value="2"
                id="ai-reference2"
                name="ai-reference"
              />
              <label className="radio-ai-label">(1,2,3,.. n)</label>
            </div>
            <div className="ai-radio">
              <input
                type="radio"
                className="radio-ai-input"
                value="3"
                id="ai-reference3"
                name="ai-reference"
              />
              <label className="radio-ai-label">Superscript</label>
            </div>
            <div className="ai-radio">
              <input
                type="radio"
                className="radio-ai-input"
                value="4"
                id="ai-reference4"
                name="ai-reference"
              />
              <label className="radio-ai-label w-100">Name and Year</label>
            </div>
          </div>
          <span className="ai-error hide" id="ai-error">
            Please select Reference Type
          </span>
        </div>
        <div className="float-right mt-2">
          <input
            type="button"
            onClick={(e) => this.aisubmit(e)}
            className="btn cstm-save-btn"
            value="Submit"
          />
        </div>
      </form>
    );
  }
}

export default AIPredication;
