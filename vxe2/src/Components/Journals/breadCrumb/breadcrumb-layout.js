import React from 'react';

const BreadCrumb =(props)=>{

    return (

        <ul className='custom-menu'>
            {props.permissions.figure_link &&(
                <li data-action="first" className="link_figure">Figure Link</li>
            )}
            {props.permissions.table_link &&(
                <li data-action="third" className="link_table">Table Link</li>
            )}
            {props.permissions.reference_link &&(
                <li data-action="second" className="link_reference">Reference Link</li>
            )}
            {props.permissions.accept_changes &&(
                <li data-action="sixth" data-value="accept" className="accept-change hide">Accept Change</li> 
            )}  
            {props.permissions.reject_changes &&( 
                <li data-action="seventh" data-value="reject" className="accept-change hide">Reject Change</li>  
            )} 
            {props.permissions.reference_link &&( 
                <li data-action="eight" id="referenceLink" className="RefRemove RefHide">Remove Reference Link</li>
            )} 
            {props.permissions.figure_link &&( 
                <li data-action="eight" id="figureLink" className="RefRemove RefHide">Remove Figure Link</li>
            )} 
            {props.permissions.table_link &&( 
                <li data-action="eight" id="tableLink" className="RefRemove RefHide">Remove Table Link</li>
            )} 
            {props.basicpermissions.ref_color_edit &&( 
                <>
                    <li data-action="nine" data-menu="1" className="custom-menu-main"><a>Book <i className="fas fa-angle-right"></i></a>
                        <ul id="submenu1" className="custom-menu-sub">
                            <li data-color="#ababab" data-tagname="CHAPTER-TITLE" className="redColorEle">Chapter Title</li>
                            <li data-color="#989898" data-tagname="FIRSTNAME" className="redColorEle">Book title</li>
                            <li data-color="#800000" data-tagname="YEAR" className="redColorEle">Year</li>
                            <li data-color="#4b0082" data-tagname="PUBLISHER-NAME" className="redColorEle">Publisher Name</li>
                            <li data-color="#808080" data-tagname="PUBLISHER-LOC" className="redColorEle">Publisher Place</li>
                            <li data-color="#625c5c" data-tagname="FIRSTNAME" className="redColorEle">Page Number</li>
                            <li data-color="#ff00f7" data-tagname="DELIMITER" className="redColorEle">Delimiter</li>
                        </ul>
                    </li>
                    <li data-action="ten" data-menu="2" className="custom-menu-main"><a>Journals <i className="fas fa-angle-right"></i></a>
                        <ul id="submenu2" className="custom-menu-sub">
                            <li data-color="#0072ff" data-tagname="SURNAME" className="redColorEle">Surname</li>
                            <li data-color="#96208c" data-tagname="GIVEN-NAME" className="redColorEle">Given Name</li>
                            <li data-color="#0fd1d2" data-tagname="ARTICLE-TITLE" className="redColorEle">Article Title</li>
                            <li data-color="#BA1419" data-tagname="YEAR" className="redColorEle">Year</li>
                            <li data-color="#2da9bd" data-tagname="VOLUME" className="redColorEle">Volume Number</li>
                            <li data-color="#f8b1b2" data-tagname="PUBLISHER-NAME" className="redColorEle">Publisher Name</li>
                            <li data-color="#0b9428" data-tagname="ISSUE" className="redColorEle">Issue Number</li>
                            <li data-color="#ff00f7" data-tagname="DELIMITER" className="redColorEle">Delimiter</li>
                        </ul>
                    </li>
                    <li data-action="11" data-menu="3" className="custom-menu-main"><a>Type <i className="fas fa-angle-right"></i></a>
                        <ul id="submenu3" className="custom-menu-sub">
                            <li data-color="book" className="referenceType">Book</li>
                            <li data-color="journal" className="referenceType">Journal</li>
                            <li data-color="proceedings" className="referenceType">Proceedings</li>
                            <li data-color="report" className="referenceType">Report</li>
                            <li data-color="series" className="referenceType">Series</li>
                            <li data-color="newspaper" className="referenceType">Newspaper</li>
                            <li data-color="web" className="referenceType">Web</li>
                        </ul>
                    </li>
                </>
            )}
        </ul>
            
    )

}

export default BreadCrumb;
