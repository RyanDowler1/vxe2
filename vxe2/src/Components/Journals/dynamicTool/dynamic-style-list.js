import React from 'react';

const StyleList =()=> {
      
    return (
        <div className="row mt-4 style-popup">
            <div className="col-sm-2">   
                <h4 className="cstm-caps">Capitalization</h4>
                <h5 className="customHeader">Headings</h5>                                            
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Title case" disabled data-id="296" data-group="Headings" data-name="Title case" className="style-checkbox"/>
                    <span>Title case</span>                                                                                                
                </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Sentence case" disabled data-id="297" data-group="Headings" data-name="Sentence case" className="style-checkbox"/>
                    <span>Sentence case</span>                                                                                                
                </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="All caps" disabled data-id="298" data-group="Headings" data-name="All caps" className="style-checkbox"/>
                    <span>All caps</span>                                                                                               
                </label> 
                
                <h5 className="customHeader">Figure captions</h5>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Title case" disabled data-id="299" data-group="Figure captions" data-name="Title case" className="style-checkbox"/>
                    <span>Title case</span>                                                                                                
                </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Sentence case" disabled data-group="Figure captions" data-name="Sentence case" className="style-checkbox"/>
                    <span>Sentence case</span>                                                                                                
                </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="With end period" disabled data-id="300" data-group="Figure captions" data-name="With end period" className="style-checkbox"/>
                    <span>With end period</span>                                                                                               
                </label> 
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Without end period" disabled data-id="1367" data-group="Figure captions" data-name="Without end period" className="style-checkbox"/>
                    <span>Without end period</span>                                                                                               
                </label>
                <h5 className="customHeader">Table captions</h5>  
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Title case" data-id="1367" disabled data-group="Figure captions" data-name="Title case" className="style-checkbox"/>
                    <span>Title case</span>                                                                                                
                </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Sentence case" disabled data-id="1367" data-group="Figure captions" data-name="Sentence case" className="style-checkbox"/>
                    <span>Sentence case</span>                                                                                                
                </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="With end period" disabled data-id="1367" data-group="Figure captions" data-name="With end period" className="style-checkbox"/>
                    <span>With end period</span>                                                                                     
                </label> 
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Without end period" disabled data-id="1367" data-group="Figure captions" data-name="Without end period" className="style-checkbox"/>
                    <span>Without end period</span>                                                                                               
                </label>                                                                                                                                                                          
            </div>
            <div className="px-2">
                <h4 className="cstm-caps">List of Units</h4>
                                            
                
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Single quotation marks" data-id="565" data-group="Quotation marks" data-name="space to non-breaking space" className="style-checkbox" disabled />
                    <span>Space to Non-Breaking Space</span>                                                                                                            </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Units" data-id="1367" data-group="List of units" data-name="List of units" className="style-checkbox" defaultChecked="checked"/>
                    <span>Units</span>                                                                                               
                </label>
                
                
                <h5 className="customHeader">Dashes</h5>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Dashes" data-id="760" data-group="Dashes" data-name="Dashes" className="style-checkbox" defaultChecked="checked"/>
                    <span>Hyphen to en dash</span>                                                                                                
                </label>
                
                <h5 className="customHeader"><span>Thousand seperator</span></h5>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Four digit numerals" data-id="763" data-group="Thousand seperator" data-name="Four digit numerals" className="style-checkbox" disabled />
                    <span>Four digit numerals</span>                                                                                                
                </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Five digit numerals" data-id="787" data-group="Thousand seperator" data-name="Five digit numerals" className="style-checkbox" disabled />
                    <span>Five digit numerals</span>                                                                                                
                </label>
                
                <h5 className="customHeader"><span>Percentage</span></h5> 
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Symbol" data-id="764" data-group="Percentage" data-name="Symbol" className="style-checkbox" disabled />
                    <span>Symbol</span>                                                                                                
                </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Spelled out"  data-id="780"  data-group="Percentage" data-name="Spelled out" className="style-checkbox" disabled />
                    <span>Spelled out</span>                                                                                                
                </label>
                
                
                
                <h5 className="customHeader"><span>Abbreviations</span></h5> 
            
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Abbreviated" data-id="848" data-group="Abbreviations" data-name="Abbreviated" className="style-checkbox" defaultChecked="checked"/>
                    <span>Abbreviated</span>                                                                                                
                </label>
                <h5 className="customHeader"><span>Spell out</span></h5> 
                
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Spell out" data-id="780" data-group="Spell out" data-name="Abbreviated" className="style-checkbox" defaultChecked="checked"/>
                    <span>Spell out</span>                                                                                                
                </label>
                
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Spell out" data-id="1453" data-group="Word list" data-name="Word List" className="style-checkbox" defaultChecked="checked"/>
                    <span>Word List</span>                                                                                                
                </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Numbers & Symbols" data-id="5792" disabled data-group="Numbers & Symbols" data-name="Word List" className="style-checkbox" />
                    <span>Numbers &amp; Symbols</span>                                                                                                
                </label>
            </div>
                                                    
            <div className="col-sm-2">
                <h4 className="cstm-caps">Reference styles</h4>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Harvard references" disabled  data-id="1309" data-group="Reference styles" data-name="Harvard references" className="style-checkbox"/>
                    <span  style={{opacity:"1"}} >Harvard references</span>                                                                                                
                </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Vancouver references" disabled data-id="945" data-group="Reference styles" data-name="Vancouver references" className="style-checkbox"/>
                    <span style={{opacity:"1"}}>Vancouver references</span>                                                                                                
                </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Chicago author-date" disabled data-id="946"  data-group="Reference styles" data-name="Chicago author-date" className="style-checkbox"/>
                    <span style={{opacity:"1"}}>Chicago author-date</span>                                                                                                
                </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="APA references" disabled data-id="946" data-group="Reference styles" data-name="APA references" className="style-checkbox"/>
                    <span style={{opacity:"1"}}>APA references</span>                                                                                                
                </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Author Consistency" data-id="947" data-group="Reference styles" data-name="Author Consistency" className="style-checkbox" disabled />
                    <span >Author Consistency</span>                                                                                                
                </label>
            </div>
            <div className="col-sm-2">
                <h4 className="cstm-caps">Citation styles</h4>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Harvard citation style" data-id="946" disabled data-group="Citation styles" data-name="Harvard citation style" className="style-checkbox"/>
                    <span style={{opacity:"1"}}>Harvard citation style</span>                                                                                                
                </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Vancouver citation style" data-id="947" disabled data-group="Citation styles" data-name="Vancouver citation style" className="style-checkbox"/>
                    <span style={{opacity:"1"}}>Vancouver citation style</span>  </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Chicago author-date" data-id="948" disabled data-group="Citation styles" data-name="Chicago author-date" className="style-checkbox"/>
                    <span style={{opacity:"1"}}>Chicago author-date</span>                                                                                                
                </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="APA citation style" data-id="949" disabled data-group="Citation styles" data-name="APA citation style" className="style-checkbox"/>
                    <span style={{opacity:"1"}}>APA citation style</span>                                                                                                
                </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="Author Consistency" disabled data-id="950" data-group="Citation styles" data-name="Author Consistency" className="style-checkbox"/>
                    <span>Author Consistency</span>                                                                                                
                </label>                            
            </div>
            <div className="px-2">
                <h4 className="cstm-caps">Spelling</h4>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="US" data-id="1249" disabled data-group="US spelling" data-name="US-ize"  className="style-checkbox"/>
                    <span>US</span>                                                                                                
                </label>
                <label className="pure-material-checkbox mr-4">
                    <input type="checkbox" value="UK-ize" data-id="1138" data-group="UK spelling" data-name="UK-ize" className="style-checkbox" defaultChecked="checked"/>
                    <span>UK</span>                                                                                                
                </label>
                
            </div>   
        </div>

    );

}

export default StyleList;
