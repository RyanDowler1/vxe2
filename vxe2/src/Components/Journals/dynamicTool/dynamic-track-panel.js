import React from 'react';
import "../css/journals-main.css";
import TrackPanelTemplate from './dynamic-track-panel-template';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import $ from 'jquery';

class TrackPanel extends React.Component {
    constructor(props) {        
        super(props);        
        this.state = {
            currentUser: "",
            fromDate: new Date(),
            toDate: new Date(),
            activeDate: "",
            toggleDatePicker: false
        }
        this.prevNextChanges = this.prevNextChanges.bind();
    }

    componentDidMount() {
        let trackPanelProps = this;        
        window.addEventListener('keyup', function(e) {            
            if(e.key === "ArrowDown"){
                trackPanelProps.prevNextChanges('next');
            } else if (e.key === "ArrowUp"){
                trackPanelProps.prevNextChanges('prev');
            }
            e.preventDefault();
        }, true);
    }

    trackFilter() {                               
        let filterInput = document.getElementById("filter");
            filterInput = filterInput.value.toUpperCase();
        let trackLists = document.getElementById("track-list");
        let trackList = trackLists.getElementsByTagName("li");   
        $('.track-list').removeClass('result-data');
        if(document.querySelector('.bottom-row') !== null){ 
            let toDateVal = document.getElementById('date-to').value;
            let fromDateVal = document.getElementById('date-from').value;
            if(toDateVal !== "" && fromDateVal != "") {
                let fromDate = new Date(fromDateVal);                          
                let toDate = new Date(toDateVal);
                
                if(Date.parse(fromDate) > Date.parse(toDate)){
                    document.getElementsByClassName('date-err')[0].style.display = "block";
                } else{                                           
                    document.getElementsByClassName('date-err')[0].style.display = "none";     
                    // To calculate the time difference of two dates 
                    let Difference_In_Time = toDate.getTime() - fromDate.getTime(); 
                    
                    // To calculate the no. of days between two dates 
                    let Difference_In_Days =  Math.round(Difference_In_Time / (1000 * 3600 * 24));
                            
                    for(let i=0; i < Difference_In_Days; i++) {
                        let dateRange;
                        if(i === 0)
                            dateRange = fromDate.setDate(fromDate.getDate());
                        else
                            dateRange = fromDate.setDate(fromDate.getDate() + 1);
                        dateRange = Date.parse(new Date(new Date(dateRange).getFullYear(),new Date(dateRange).getMonth() , new Date(dateRange).getDate()));
                        for (let j = 0; j < trackList.length; j++) {                      
                            let dateValue = parseInt(trackList[j].getAttribute('id'));                        
                                dateValue = Date.parse(new Date(new Date(dateValue).getFullYear(),new Date(dateValue).getMonth() , new Date(dateValue).getDate()));
                            if(!$(trackList[j]).hasClass('result-data')){
                                if(dateRange === dateValue){
                                    trackList[j].style.display = "";                            
                                    this.hideNonSearchTrackRow (trackList, filterInput, j);
                                    $(trackList[j]).addClass('result-data');
                                } else
                                    trackList[j].style.display = "none";                                
                            }
                        } 
                    }
                }
            } else {
                if(fromDateVal === ""){                    
                } else if(fromDateVal === ""){                    
                }
            }
        } else {
            for (let j = 0; j < trackList.length; j++) {  
                this.hideNonSearchTrackRow (trackList, filterInput, j);
            }
        }

        if(document.querySelectorAll('#track-list li[style="display: none;"]') !== null){
            var resultLen = document.querySelectorAll('#track-list li[style="display: none;"]').length;
        }
        if(trackList.length === resultLen){
            document.getElementsByClassName('no-data-txt')[0].style.display = "block";
            $('.accept-reject-all').addClass('hide-accept-all');
        } else {
            document.getElementsByClassName('no-data-txt')[0].style.display = "none";            
            $('.accept-reject-all').removeClass('hide-accept-all');
        }
    }

    hideNonSearchTrackRow (trackList, filterInput, j) {
        let trackDetailCon = trackList[j].querySelector('.modified-txt');
        let userName = trackList[j].querySelector('h6');
        let txtValue1 = userName.textContent || userName.innerText;
        let txtValue2 = trackDetailCon.textContent || trackDetailCon.innerText;
        let txtValue = txtValue1 +' '+' '+ txtValue2;                                                               
                
        if (txtValue.toUpperCase().indexOf(filterInput) > -1) {
            trackList[j].style.display = "";                                
        } else {
            trackList[j].style.display = "none";
        }         
    }

    removeZero(dateVal) {
        if(dateVal.split('0').length > 0 && dateVal.split('0')[0] == "")
             dateVal = dateVal.split('0')[1];
        else
            dateVal = dateVal;
        return dateVal;
    }

    toggleTrackFilter(toggleDatePicker) {
        if(toggleDatePicker === false)
            this.setState({toggleDatePicker: true});
        else
            this.setState({toggleDatePicker: false});
    }

    changeFromDate = date => {
        this.setState({
          fromDate: date
        });
        setTimeout(() => {     
            this.trackFilter();
        },500)
    };
    
    changeToDate = date => {
        this.setState({
          toDate: date
        });
        setTimeout(() => {     
            this.trackFilter();
        },500)
    };

    prevNextChanges(value) {                
        let selectedList;
        let init = false;
        let prevList;
        if($("#track-list .track-list.add-highlights").length > 0){
            selectedList = $("#track-list").find(".track-list.add-highlights").attr('id');
        } else {
            selectedList = $($("#track-list").find(".track-list")[0]).attr('id');
            init = true;
        }        
        if(value == "prev") {
            prevList = $('.track-changes-list #'+selectedList).prev().attr('id');
            if(!(!prevList)){
                let trackedTopPos = $('.track-changes-list #'+prevList).offset().top;
                let initTopPos = $('#track-list').offset().top;                
                $('.track-changes-list').scrollTop(trackedTopPos - initTopPos);                
                $('.track-changes-list #'+prevList).click();
            }
        }
        else {
            if(init)
                prevList = $('.track-changes-list #'+selectedList).attr('id');
            else
                prevList = $('.track-changes-list #'+selectedList).next().attr('id');
            if(!(!prevList)){
                let trackedTopPos = $('.track-changes-list #'+prevList).offset().top;
                let initTopPos = $('#track-list').offset().top;                
                $('.track-changes-list').scrollTop(trackedTopPos - initTopPos);                
                $('.track-changes-list #'+prevList).click();
            }
        }        
    }

    render() {            
        const {toggleDatePicker, fromDate, toDate} = this.state;    
        return (                
            <div className="track-panel mt-2">
                <div className="col-6 pt-3 float-left">
                    <h2>Track Changes</h2>                    
                </div>
                <div className="col-6 pt-3 float-right track-count">
                    <span>{this.props.trackCounts} Changes</span>
                </div>
                <div className="clearfix"></div>
                <hr/>
                <>
                        <div className="filter-area">                            
                            <div className="top-row">
                                <div className="input-wrapper">
                                <label className="label-form">Filter Changes</label>                                    
                                <input type="text" className="form-control" id="filter" name="Find" placeholder="Filter Query" onKeyUp={() => this.trackFilter()}/>
                                    <i className="material-icons">search</i>                                    
                                </div>
                                <button id="advanced-options">
                                    <i className="material-icons" onClick={() => this.toggleTrackFilter(toggleDatePicker)}>more_vert</i>
                                </button>
                            </div>
                            {toggleDatePicker &&
                            <div className="bottom-row">
                                <div className="input-wrapper pos-rel">
                                    <label className="label-form">Date From</label>                                                                            
                                    <DatePicker selected={this.state.fromDate} onChange={this.changeFromDate} className="form-control" id="date-from"/>
                                    <i className="material-icons  pos-abs" id="cal-icon">calendar_today</i>
                                    
                                </div>

                                <div className="input-wrapper pos-rel">
                                    <label className="label-form">Date To</label>                                                                            
                                    <DatePicker selected={this.state.toDate} onChange={this.changeToDate} className="form-control" id="date-to"/>
                                    <i className="material-icons  pos-abs" id="cal-icon">calendar_today</i>
                                    
                                </div>                                
                            </div>
                            }
                            <span className="date-err">Please ensure that the End Date is greater than or equal to the Start Date.</span>
                        </div>
                    </>  
                    {this.props.trackingContent.length > 0 &&
                    <div className="trackNextPrevBtn px-3 py-1">
                            <button className="btn cstm-primary-btn cstm-spell-btn mr-2" onClick ={()=> this.prevNextChanges('prev')} title="Pre. Word">Prev. Change</button>
                            <button className="btn cstm-primary-btn float-right cstm-spell-btn" onClick ={()=> this.prevNextChanges('next')} title="Next">Next Change</button>
                    </div>             
                    }
                    <div className="track-changes-list">                        
                        <TrackPanelTemplate trackCount = {this.props.trackCounts} trackingCont = {this.props.trackingContent} permissions={this.props.permissions}/>   
                         <h4 className="no-data-txt" style={{display: "none"}}>No results found.</h4>                    
                    </div>                
                    <div className="clearfix"></div>                                          
            </div>
        );
    }  
}

export default TrackPanel;

