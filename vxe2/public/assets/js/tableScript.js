"use strict";
var table = {};


table.init = function () {
	var rt = TABLE.table;
	rt.onmousedown('mainTable', true);
	
	rt.color.cell = '#9BB3DA';
};

table.hidetrack = function () {
	$('td').attr('style','background-color:white !important');
	$('.delete').hide();
};
	
table.showtrack = function () {
	$('td').removeAttr('style');
	$('.delete').show();
};
	
table.merge = function () {
	
	TABLE.table.merge('h', false);
	TABLE.table.merge('v');
	
	autosavefunction_vxe();
};


table.split = function (mode) {
	TABLE.table.split(mode);
};


table.row = function (type) {
	
	var localdata_set = $('.localstorevalue').val();
	storedata(localdata_set,"EK");
	
	var main_table = $(".table_attr").text();
	
	//alert(main_table);
	var thead_length = $("#"+main_table).find("thead tr").length;
	
	var tbody_length = $("#content .otherclass").parent().prevAll("tr").length;
	
	var table_length = tbody_length + thead_length;
	if($("#content .otherclass").parent().parent()[0].tagName == "THEAD")
		table_length = 0;
	TABLE.table.row(main_table, type, table_length);
	var msg = "Table row deleted.";
	if(type === "insert"){
		msg = "New Table row Added.";
		$("#"+main_table+" tr").attr("contenteditable","false");
		$("#"+main_table+" td").attr("contenteditable","true");
	}
	if(type === "delete"){

	}
	//TABLE.table.row('mainTable', type, $(".otherclass").parent().prevAll("tr").length);
	$("#"+main_table+" td").removeAttr('style');
	autosavefunction_vxe(msg);
};


table.column = function (type) {
	
	var localdata_set = $('.localstorevalue').val();
	storedata(localdata_set,"EK");
	
	var main_table = $(".table_attr").text();
	TABLE.table.column(main_table, type, $("#content .otherclass").prevAll("td").length);
	var msg = "Table column deleted.";
	if(type === "insert"){
		msg = "New Table column Added.";
		$("#"+main_table+" tr").attr("contenteditable","false");
		$("#"+main_table+" td").attr("contenteditable","true");
	}
	//TABLE.table.column('mainTable', type, $(".otherclass").prevAll("td").length);
	$("#"+main_table+" td").removeAttr('style');
	autosavefunction_vxe(msg);
};


if (window.addEventListener) {
	window.addEventListener('load', table.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', table.init);
}