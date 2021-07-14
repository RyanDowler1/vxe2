"use strict";
// create TABLE namespace (if is not already defined in another TABLE package)
var TABLE = TABLE || {};

TABLE.table = (function () {
		// methods declaration
	var	onmousedown,			// method attaches onmousedown event listener to table cells
		handler_onmousedown,	// onmousedown handler
		merge,					// method merges marked cells
		merge_cells,			// method merges/deletes table cells (used by merge_h & merge_v)
		max_cols,				// method returns maximum number of columns in a table
		split,					// method splits merged cells (if cell has colspan/rowspan greater then 1)
		get_table,				// method sets reference to the table (it's used in "merge" and "split" public methods) 
		mark,					// method marks table cell
		cell_init,				// method attaches "mousedown" event listener and creates "table" property to the newly created table cell
		row,					// method adds/deletes table row
		column,					// method adds/deletes table column
		cell_list,				// method returns cell list with new coordinates
		relocate,				// relocate element nodes from source cell to the target cell
		remove_selection,		// method removes text selection
		cell_index,				// method displays cellIndex (debug mode)
		cell_ignore,			// method removes onmousedown even listener in case of active TABLE.table.onmousedown mode

		// private properties
		tables = [],			// table collection
		td_event,				// (boolean) if set to true then cell_init will attach event listener to the table cell
		show_index,				// (boolean) show cell index

		// variables in the private scope revealed as public properties
		color = {cell: false,	// color of marked cell
				row: false,		// color of marked row
				column: false},	// color of marked column
		mark_nonempty = true;	// enable / disable marking not empty table cells.


	/**
	 * Method attaches or removes onmousedown event listener on TD elements depending on second parameter value (default is true).
	 * If third parameter is set to "classname" then tables will be selected by class name (named in first parameter).
	 * All found tables will be saved in internal array.
	 * Sending reference in this case will not be needed when calling merge or split method.
	 * Table cells marked with class name "ignore" will not have attached onmousedown event listener (in short, these table cells will be ignored).
	 * @param {String|HTMLElement} el Container Id. TD elements within container will have added onmousewdown event listener.
	 * @param {Boolean} [flag] If set to true then onmousedown event listener will be attached to every table cell.
	 * @param {String} [type] If set to "class name" then all tables with a given class name (first parameter is considered as class name) will be initialized. Default is container/table reference or container/table id.
	 * @example
	 * // activate onmousedown event listener on cells within table with id="mainTable"
	 * TABLE.table.onmousedown('mainTable', true);
	 *  
	 * // activate onmousedown event listener on cells for tables with class="blue"
	 * TABLE.table.onmousedown('blue', true, 'classname');
	 * @public
	 * @function
	 * @name TABLE.table#onmousedown
	 */
	onmousedown = function (el, flag, type) {
		
		var	td,			// collection of table cells within container
			i, t,		// loop variables
			get_tables;	// private method returns array
		// method returns array with table nodes for a DOM node
		get_tables = function (el) {
			var arr = [],	// result array
				nodes,		// node collection
				i;			// loop variable
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
		if (typeof(el) === 'string') {
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
				el = document.getElementById(el);
			}
		}
		// el is object
		if (el && typeof(el) === 'object') {
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
		
		// show cell index (if show_index public property is set to true)
		//cell_index();
	};


	/**
	 * Method attaches "mousedown" event listener to the newly created table cell or removes event listener if needed.
	 * @param {HTMLElement} c Table cell element.
	 * @private
	 * @memberOf TABLE.table#
	 */
	cell_init = function (c) {
		// if cell contains "ignore" class name then ignore this table cell
		if (c.className.indexOf('ignore') > -1) {
			return;
		}
		// if td_event is set to true then onmousedown event listener will be attached to table cells
		if (td_event === true) {
			TABLE.event.add(c, 'mousedown', handler_onmousedown);
		}
		else {
			TABLE.event.remove(c, 'mousedown', handler_onmousedown);
			
		}
	};


	/**
	 * Method removes attached onmousedown event listener.
	 * Sometimes is needed to manually ignore some cells in table after row/column were dynamically added.
	 * @param {HTMLElement|String} c Cell id or cell reference of table that should be ignored (onmousedown event listener will be removed).
	 * @public
	 * @function
	 * @name TABLE.table#cell_ignore
	 */
	cell_ignore = function (c) {
		// if input parameter is string then overwrite it with cell reference
		if (typeof(c) === 'string') {
			c = document.getElementById(c);
		}
		// remove onmousedown event listener
		TABLE.event.remove(c, 'mousedown', handler_onmousedown);
	};


	/**
	 * On mousedown event attached to the table cell. If left mouse button is clicked and table cell is empty then cell will be marked or cleaned.
	 * This event handler is attached to every TD element.
	 * @param {Event} e Event information.
	 * @private
	 * @memberOf TABLE.table#
	 */
	handler_onmousedown = function (e) {
		
		var evt = e || window.event,
			td = evt.target || evt.srcElement,  
			mouseButton,
			empty;
		// set empty flag for clicked TD element
		// http://forums.asp.net/t/1409248.aspx/1
		empty = (/^\s*$/.test(td.innerHTML)) ? true : false;
		// if "mark_nonempty" is set to false and current cell is not empty then do nothing (just return from the event handler)
		if (TABLE.table.mark_nonempty === false && empty === false) {
			return;
		}
		// define which mouse button was pressed
		if (evt.which) {
			mouseButton = evt.which;
		}
		else {
			mouseButton = evt.button;
		}
		// if left mouse button is pressed and target cell is empty
		if (mouseButton === 1 /*&& td.childNodes.length === 0*/) {
			// if custom property "table" doesn't exist then create custom property
			td.table = td.table || {};
			// cell is already marked
			if (td.table.selected === true) {
				// return original background color and reset selected flag
				// mark(false, td);
			}
			// cell is not marked
			else {
				// mark(true, td);
			}
		}
	};


	/**
	 * Method merges marked table cells horizontally or vertically.
	 * @param {String} mode Merge type: h - horizontally, v - vertically. Default is "h".
	 * @param {Boolean} [clear] true - cells will be clean (without mark) after merging, false -  cells will remain marked after merging. Default is "true". 
	 * @param {HTMLElement|String} [table] Table id or table reference.
	 * @public
	 * @function
	 * @name TABLE.table#merge
	 */
	merge = function (mode, clear, table) {
		
		
		var	tbl,		// table array (loaded from tables array or from table input parameter)
			tr,			// row reference in table
			c,			// current cell
			rc1,		// row/column maximum value for first loop
			rc2,		// row/column maximum value for second loop
			marked,		// (boolean) marked flag of current cell
			span,		// (integer) rowspan/colspan value
			id,			// cell id in format "1-2", "1-4" ...
			cl,			// cell list with new coordinates
			t,			// table reference
			i, j,		// loop variables
			first = {index : -1,	// index of first cell in sequence
					span : -1};		// span value (colspan / rowspan) of first cell in sequence
		// remove text selection
		
		remove_selection();
		
		
		// if table input parameter is undefined then use "tables" private property (table array) or set table reference from get_table method
		
		
		tbl = (table === undefined) ? tables : get_table(table);
		
		
		// open loop for each table inside container
		for (t = 0; t < tbl.length; t++) {
			
			// define cell list with new coordinates
			cl = cell_list(tbl[t]);
			// define row number in current table
			tr = tbl[t].rows;
			// define maximum value for first loop (depending on mode)
			rc1 = (mode === 'v') ? max_cols(tbl[t]) : tr.length;
			// define maximum value for second loop (depending on mode)
			rc2 = (mode === 'v') ? tr.length : max_cols(tbl[t]);
			// first loop
			for (i = 0; i < rc1; i++) {
				// reset marked cell index and span value
				first.index = first.span = -1;
				// second loop
				for (j = 0; j <= rc2; j++) {
					// set cell id (depending on horizontal/verical merging)
					id = (mode === 'v') ? (j + '-' + i) : (i + '-' + j);
					// if cell with given coordinates (in form like "1-2") exists, then process this cell
					if (cl[id]) {
						// set current cell
						c = cl[id];
						// if custom property "table" doesn't exist then create custom property
						c.table = c.table || {};
						// set marked flag for current cell
						marked = c ? c.table.selected : false;
						// set opposite span value
						span = (mode === 'v') ? c.colSpan : c.rowSpan;
					}
					else {
						marked = false;
					}
					// if first marked cell in sequence is found then remember index of first marked cell and span value
					if (marked === true && first.index === -1) {
						first.index = j;
						first.span = span;
					}
					// sequence of marked cells is finished (naturally or next cell has different span value)
					else if ((marked !== true && first.index > -1) || (first.span > -1 && first.span !== span)) {
						// merge cells in a sequence (cell list, row/column, sequence start, sequence end, horizontal/vertical mode)
						merge_cells(cl, i, first.index, j, mode, clear);
						// reset marked cell index and span value
						first.index = first.span = -1;
						// if cell is selected then unmark and reset marked flag
						// reseting marked flag is needed in case for last cell in column/row (so merge_cells () outside for loop will not execute)
						if (marked === true) {
							// if clear flag is set to true (or undefined) then clear marked cell after merging
							if (clear === true || clear === undefined) {
								mark(false, c);
							}
							marked = false;
						}
					}
					// increase "j" counter for span value (needed for merging spanned cell and cell after when index is not in sequence)
					if (cl[id]) {
						j += (mode === 'v') ? c.rowSpan - 1: c.colSpan - 1;
					}
				}
				// if loop is finished and last cell is marked (needed in case when TD sequence include last cell in table row)
				if (marked === true) {
					merge_cells(cl, i, first.index, j, mode, clear);
				}
			}
		}
		// show cell index (if show_index public property is set to true)
		//cell_index();
	};


	/**
	 * Method merges and deletes table cells in sequence (horizontally or vertically).
	 * @param {Object} cl Cell list (output from cell_list method)
	 * @param {Integer} idx Row/column index in which cells will be merged.
	 * @param {Integer} pos1 Cell sequence start in row/column.
	 * @param {Integer} pos2 Cell sequence end in row/column.
	 * @param {String} mode Merge type: h - horizontally, v - vertically. Default is "h".
	 * @param {Boolean} [clear] true - cells will be clean (without mark) after merging, false -  cells will remain marked after merging. Default is "true".
	 * @private
	 * @memberOf TABLE.table#
	 */
	merge_cells = function (cl, idx, pos1, pos2, mode, clear) {
		
		
		var span = 0,	// set initial span value to 0
			id,			// cell id in format "1-2", "1-4" ...
			fc,			// reference of first cell in sequence
			c,			// reference of current cell 
			i;			// loop variable
		// set reference of first cell in sequence
		fc = (mode === 'v') ? cl[pos1 + '-' + idx] : cl[idx + '-' + pos1];
		// delete table cells and sum their colspans
		var delCellHTML = "";
		for (i = pos1 + 1; i < pos2; i++) {
			// set cell id (depending on horizontal/verical merging)
			id = (mode === 'v') ? (i + '-' + idx) : (idx + '-' + i);
			// if cell with given coordinates (in form like "1-2") exists, then process this cell
			if (cl[id]) {
				// define next cell in column/row
				c = cl[id];
				// add colSpan/rowSpan value
				span += (mode === 'v') ? c.rowSpan : c.colSpan;
				// relocate content before deleting cell in merging process
				relocate(c, fc);
				// delete cell
				delCellHTML = delCellHTML + c.innerHTML;
				c.parentNode.deleteCell(c.cellIndex);
			}
		}
		// if cell exists
		if (fc !== undefined) {		
		if (delCellHTML != "")
		{
			fc.innerHTML = fc.innerHTML + " " + delCellHTML;
			fc.className = fc.className.toString().replace("merge", "").replace("split", "").replace("  ", " ");
			fc.className += " merge";
		}
			// vertical merging
			if (mode === 'v') {
				fc.rowSpan += span;			// set new rowspan value
			}
			// horizontal merging
			else {
				fc.colSpan += span;			// set new rowspan value
			}
			// if clear flag is set to true (or undefined) then set original background color and reset selected flag
			if (clear === true || clear === undefined) {
				mark(false, fc);
			}
		}
	};


	/**
	 * Method returns number of maximum columns in table (some row may contain merged cells).
	 * @param {HTMLElement|String} table TABLE element.
	 * @private
	 * @memberOf TABLE.table#
	 */
	max_cols = function (table) {
		var	tr = table.rows,	// define number of rows in current table
			span,				// sum of colSpan values
			max = 0,			// maximum number of columns
			i, j;				// loop variable
		// if input parameter is string then overwrite it with table reference
		if (typeof(table) === 'string') {
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
	};


	/**
	 * Method splits marked table cell only if cell has colspan/rowspan greater then 1.
	 * @param {String} mode Split type: h - horizontally, v - vertically. Default is "h".
	 * @param {HTMLElement|String} [table] Table id or table reference.
	 * @public
	 * @function
	 * @name TABLE.table#split
	 */
	split = function (mode, table) {
		var	tbl,	// table array (loaded from tables array or from table input parameter)
			tr,		// row reference in table
			c,		// current table cell
			cl,		// cell list with new coordinates
			rs,		// rowspan cells before
			n,		// reference of inserted table cell
			cols,	// number of columns (used in TD loop)
			max,	// maximum number of columns
			t,		// table reference
			i, j,	// loop variables
			get_rowspan;
		// method returns number of rowspan cells before current cell (in a row)
		get_rowspan = function (c, row, col) {
			var rs,
				last,
				i;
			// set rs
			rs = 0;
			// set row index of bottom row for the current cell with rowspan value
			last = row + c.rowSpan - 1;
			// go through every cell before current cell in a row
			for (i = col - 1; i >= 0; i--) {
				// if cell doesn't exist then rowspan cell exists before
				if (cl[last + '-' + i] === undefined) {
					rs++;
				}
			}
			return rs;
		};
		// remove text selection
		remove_selection();
		// if table input parameter is undefined then use "tables" private property (table array) or set table reference from get_table method
		tbl = (table === undefined) ? tables : get_table(table);
		// loop TABLE
		for (t = 0; t < tbl.length; t++) {
			// define cell list with new coordinates
			cl = cell_list(tbl[t]);
			// define maximum number of columns in table
			max = max_cols(tbl[t]);
			// define row number in current table
			tr = tbl[t].rows;
			// loop TR
			for (i = 0; i < tr.length; i++) {
				// define column number (depending on mode)
				cols = (mode === 'v') ? max : tr[i].cells.length;
				// loop TD
				for (j = 0; j < cols; j++) {
					// split vertically
					if (mode === 'v') {
						// define current table cell
						c = cl[i + '-' + j];
						// if custom property "table" doesn't exist then create custom property
						if (c !== undefined) {
							c.table = c.table || {};
						}
						// if marked cell is found and rowspan property is greater then 1
						if (c !== undefined && c.table.selected === true && c.rowSpan > 1) {
							// get rowspaned cells before current cell (in a row)
							rs = get_rowspan(c, i, j);
							// insert new cell at last position of rowspan (consider rowspan cells before)
							n = tr[i + c.rowSpan - 1].insertCell(j - rs);
							// set the same colspan value as it has current cell
							n.colSpan = c.colSpan;
							n.className = n.className.toString().replace("merge", "").replace("split", "").replace("  ", " ");
							n.className += " split";
							// decrease rowspan of marked cell
							c.rowSpan -= 1;
							c.className = c.className.toString().replace("merge", "").replace("split", "").replace("  ", " ");
							c.className += " split";
							// add "table" property to the table cell and optionally event listener
							cell_init(n);
							// recreate cell list after vertical split (new cell is inserted)
							cl = cell_list(tbl[t]);
						}
					}
					// split horizontally
					else {
						// define current table cell
						c = tr[i].cells[j];
						// if custom property "table" doesn't exist then create custom property
						c.table = c.table || {};
						// if marked cell is found and cell has colspan property greater then 1
						if (c.table.selected === true && c.colSpan > 1) {
							// increase cols (because new cell is inserted)
							cols++;
							// insert cell after current cell
							n = tr[i].insertCell(j + 1);
							// set the same rowspan value as it has current cell
							n.rowSpan = c.rowSpan;
							n.className = n.className.toString().replace("merge", "").replace("split", "").replace("  ", " ");
							n.className += " split";
							// decrease colspan of marked cell
							c.colSpan -= 1;
							c.className = c.className.toString().replace("merge", "").replace("split", "").replace("  ", " ");
							c.className += " split";
							// add "table" property to the table cell and optionally event listener
							cell_init(n);
						}
					}
					// return original background color and reset selected flag (if cell exists)
					if (c !== undefined) {
						mark(false, c);
					}
				}
			}
		}
		// show cell index (if show_index public property is set to true)
		//cell_index();
	};


	/**
	 * Method sets reference to the table. It is used in "merge" and "split" public methods. 
	 * @param {HTMLElement|String} table Table id or table reference.
	 * @return {Array} Returns empty array or array with one member (table node).
	 * @private
	 * @memberOf TABLE.table#
	 */
	get_table = function (table) {
		// define output array
		var tbl = [];
		// input parameter should exits
		if (table !== undefined) {
			// if table parameter is string then set reference and overwrite input parameter
			if (typeof(table) === 'string') {
				table = document.getElementById(table);
			}
			// set table reference if table is not null and table is object and node is TABLE
			if (table && typeof(table) === 'object' && table.nodeName === 'TABLE') {
				tbl[0] = table;
			}
		}
		// return table reference as array
		return tbl;
	};


	/**
	 * Method adds / deletes table row. If index is omitted then index of last row will be set.
	 * @param {HTMLElement|String} table Table id or table reference.
	 * @param {String} mode Insert/delete table row
	 * @param {Integer} [index] Index where row will be inserted or deleted. Last row will be assumed if index is not defined.
	 * @return {HTMLElement} Returns reference of inserted row or NULL (in case of deleting row).
	 * @public
	 * @function
	 * @name TABLE.table#row
	 */
	row = function (table, mode, index) {		
		var	nc,			// new cell
			nr = null,	// new row
			fr,			// reference of first row
			c,			// current cell reference
			cl,			// cell list
			cols = 0,	// number of columns
			i, j, k,	// loop variables			
			idx,	// cell index needed when column is deleted						
			pc,     // previous cell			
			tc,			
			cc; 
		// remove text selection
		remove_selection();
		// if table is not object then input parameter is id and table parameter will be overwritten with table reference
		if (typeof(table) !== 'object') {
			var contentElement = document.getElementById('content');
			table = contentElement.querySelector('table[id="'+table+'"');
		}
		// if index is not defined then index of the last row
		if (index === undefined) {
			index = -1;
		}
		// insert table row
		if (mode === 'insert') {
			// set reference of first row
			fr = table.rows[0];
			// define number of columns (it is colspan sum)
			for (i = 0; i < fr.cells.length; i++) {
				cols += fr.cells[i].colSpan;
			}
			// insert table row (insertRow returns reference to the newly created row)
			nr = table.insertRow(index);
			nr.className += " insert";
			var d = new Date();
  			var dt = Date.parse(d);
			nr.setAttribute("data-time", dt);
			var userName = $("#username").val();
			nr.setAttribute("data-username", userName);
			// insert table cells to the new row
			for (i = 0; i < cols; i++) {
				nc = nr.insertCell(i);
				
				//console.log(fr.cells[i].getAttribute("class"));
				//console.log("nc: "+nc);
				
				// var row_deleteclass = fr.cells[i].getAttribute("class");
				
				// if(row_deleteclass == " delete")
				// {
					// nc.className += " delete";
				// }
				
				// add "table" property to the table cell and optionally event listener
				cell_init(nc);
			}
			// show cell index (if show_index public property is set to true)
			//cell_index();
		}
		// delete table row and update rowspan for cells in upper rows if needed
		else {										
			// last row should not be deleted
			if (table.rows.length === 1) {
				return;
			}
			// delete last row
			//if (track == true)
			//{
				//table.deleteRow(index);
			//}

			//To restrict delete for having Colspan column: Added by MV
			// row loop
			var allowDel = true;
			for (i = 0; i < table.rows.length; i++) {				
				var prevRowCellLen;
				var currRowCellLen = table.rows[i].cells.length;
				if(currRowCellLen>= prevRowCellLen){
					var maxCellRow = currRowCellLen;
				}else {
					var maxCellRow = prevRowCellLen;
				}
				prevRowCellLen = currRowCellLen;
			}
			for (i = 0; i < table.rows.length; i++) {			
				var selRow = document.getElementsByClassName('otherclass')[0].parentElement;
				if(table.rows[i] === selRow){ 
					var selRowCellLen = selRow.cells.length;
					if(selRowCellLen < maxCellRow){
						allowDel = false;					
						$("#tableDelAlert").modal({
							backdrop: 'static', keyboard: false
						});
						break;
					} else {			
						for (j = 0; j < selRowCellLen; j++) {										
							if (table.rows[i].cells[j].rowSpan !== undefined && table.rows[i].cells[j].rowSpan > 1 || table.rows[i].cells[j].colSpan !== undefined && table.rows[i].cells[j].colSpan > 1) {
								allowDel = false;					
								$("#tableDelAlert").modal({
									backdrop: 'static', keyboard: false
								});
								break;
							}
						}
					}	
				}
			}	
			if(allowDel){				
				table.rows[index].className += " delete";
				table.rows[index].setAttribute("contenteditable", "false");
				var d = new Date();
				var dt = Date.parse(d);
				table.rows[index].setAttribute("data-time", dt);
				var userName = $("#username").val();
				table.rows[index].setAttribute("data-username", userName);
				
				for (i = 0; i < table.rows[index].cells.length; i++) {
					mark(false, table.rows[index].cells[i]);
					
					var remove_insertclass = table.rows[index].cells[i];
					console.log(remove_insertclass);
					remove_insertclass.removeAttribute("class");
					
				}
				// prepare cell list
				cl = cell_list(table);
				
				for( var key in cl ) {
					if ((cl[key].rowSpan)!=1)
					{
						//alert(cl[key].cellIndex.toString());
						var result = key.toString().split("-");
						//alert(result[0]);
						//alert(result[1]);
						if (cl[key].rowSpan >= index)
						{
							var insrow = parseInt(result[0])+parseInt(cl[key].rowSpan)-1;
							var inscol = parseInt(result[1]);
							nc = table.rows[insrow].insertCell(inscol);
							nc.className += " delete";
							if (cl[key].colSpan > 1)
							{
								nc.colSpan = cl[key].colSpan;
							}
							cl[key].rowSpan -= 1;
						}
					}
				}
			}
			
			
			// set new index for last row
			//cl.forEach(cl[index + '-' + k].rowSpan -= 1;)
			
			//cl.forEach(function(item){
				//item.rowSpan -=1;
			//});
			
			/*
			index = table.rows.length - 1;
			// set maximum number of columns that table has
			cols = max_cols(table);
			// open loop for each cell in last row
			for (i = 0; i < cols; i++) {
				// try to find cell in last row
				c = cl[index + '-' + i];
				// if cell doesn't exist then update colspan in upper cells
				if (c === undefined) {
					// open loop for cells up in column
					for (j = index, k = 1; j >= 0; j--, k++) {
						// try to find cell upper cell with rowspan value
						c = cl[j + '-' + i];
						// if cell is found then update rowspan value
						if (c !== undefined) {
							c.rowSpan = k;
							break;
						}
					}
				}
				// if cell in last row has rowspan greater then 1
				else if (c.rowSpan > 1) {
					c.rowSpan -= 1;
				}
				// increase loop variable "i" for colspan value
				i += c.colSpan - 1;
			}
			*/
		}
		// in case of inserting new table row method will return TR reference (otherwise it will return NULL)
		return nr;
	};


	/**
	 * Method adds / deletes table column. Last column will be assumed if index is omitted.
	 * @param {HTMLElement|String} table Table id or table reference.
	 * @param {String} mode Insert/delete table column
	 * @param {Integer} [index] Index where column will be inserted or deleted. Last column will be assumed if index is not defined.  
	 * @public
	 * @function
	 * @name TABLE.table#column
	 */
	column = function (table, mode, index) {
		var	c,		// current cell
			idx,	// cell index needed when column is deleted
			nc,		// new cell
			i,		// loop variable
			pc,     // previous cell
			j,      // loop variable
			tc,
			k,
			cc;     // cell count
		// remove text selection
		remove_selection();
		// if table is not object then input parameter is id and table parameter will be overwritten with table reference
		if (typeof(table) !== 'object') {
			var contentElement = document.getElementById('content');
			table = contentElement.querySelector('table[id="'+table+'"');
		}
		// if index is not defined then index will be set to special value -1 (means to remove the very last column of a table or add column to the table end)
		if (index === undefined) {
			index = -1;
		}
		// insert table column
		if (mode === 'insert') {
			// loop iterates through each table row
			for (i = 0; i < table.rows.length; i++) {
				// insert cell
				
				for (j = 0; j < index; j++)
				{
					cc += table.rows[i].cells[j].colSpan;
					tc = table.rows[i].cells.length;

				if (index === -1) {
					idx = table.rows[i].cells.length - 1;
				}
				// if index is defined then use "index" value
				else {
					idx = index;
				}
					
					if (j == tc-1)
					{
						idx = j+1;
						break;
					}		

					if (cc >= tc) 
					{
						idx = tc-1;
						break;
					}
					else if (cc > idx)
					{
						idx = tc - j;
						break;
					}
				}
				
				if (table.rows[i].cells.length == 1)
				{
					if (table.rows[i].cells[0].colSpan > 1) 
					{
						table.rows[i].cells[0].colSpan += 1;
					}
					else
					{
							nc = table.rows[i].insertCell(idx);
					}
				}
				else
				{
					// if (table.rows[i].cells[idx-1].colSpan > 1) 
						// {
							// table.rows[i].cells[idx-1].colSpan += 1;
						// }
						// else
						// {
							var spanCells = 0;
							for (k = 0; k <= idx-1; k++)
							{
								spanCells += parseInt(table.rows[i].cells[k].colSpan) - 1;
							}
							nc = table.rows[i].insertCell(idx - spanCells);
						// }
				}

				console.log(nc.parentElement.getAttribute("class"));
				
				var delete_class = nc.parentElement.getAttribute("class");

				// add "table" property to the table cell and optionally event listener
				if(delete_class != " delete")
				{
					nc.className += " insert";
				}
				cell_init(nc);
			}
			// show cell index (if show_index public property is set to true)
			//cell_index();
		}
		// delete table column
		else {			
			// set reference to the first row
			c = table.rows[0].cells;
			// test column number and prevent deleting last column
			if (c.length === 1 && (c[0].colSpan === 1 || c[0].colSpan === undefined)) {
				return;
			}
			var allowDel = true;
			// for (var m = 0; m < table.rows.length; m++) {
			// 	var selRow = document.getElementsByClassName('otherclass')[0].parentElement;
			// 	var selectedRowCell;
			// 	if(table.rows[m] === selRow){
			// 		var selRowCellLen = selRow.cells.length;												
			// 		var selColIndex;	
			// 		for (j = 0; j < selRowCellLen; j++) {
						
			// 			if(table.rows[m].cells[j] === document.getElementsByClassName('otherclass')[0]){
			// 				selColIndex = j; 
			// 				selectedRowCell=m;
			// 				break;
			// 			}						
			// 		}			
			// 	}
			// }
			// for (i = 0; i < table.rows.length; i++) {
								
			// }	
			for (i = 0; i < table.rows.length; i++) {					
				cc = 0;
				// define cell index for last column
				if (index === -1) {
					idx = table.rows[i].cells.length - 1;
				}
				// if index is defined then use "index" value
				else {
					idx = index;
				}
				
				for (j = 0; j < index; j++)
				{
					cc += table.rows[i].cells[j].colSpan;
					tc = table.rows[i].cells.length;

					var idx = index
					
					if (j == tc-1)
					{
						idx = j+1;
						break;
					}		

					if (cc >= tc) 
					{
						idx = tc-1;
						break;
					}
					else if (cc > idx)
					{
						idx = tc - j;
						break;
					}
				}
				
				c = table.rows[i].cells[idx];
								
				c = table.rows[i].cells[idx];
				if(c !== undefined) {
					var storeId = c.attributes['store'];

					let checkRowSpan = $(c.parentElement.parentElement).children('tr').children('td[rowspan]').length;
					let checkColSpan = $(c.parentElement.parentElement).children('tr').children('td[colspan]').length;

					if(checkRowSpan > 1 || checkColSpan > 1) {
						allowDel = false;	
						$("#tableDelAlert").modal({
							backdrop: 'static', keyboard: false
						});
					}

					if(storeId !== null && storeId !== undefined && (c.colSpan > 1 || c.rowSpan > 1)){
						var colPosCount = c.attributes['store'].value.split('_').pop();
						var prevPosCount;				
						if(prevPosCount !== undefined && colPosCount !== prevPosCount){				
							allowDel = false;					
							$("#tableDelAlert").modal({
								backdrop: 'static', keyboard: false
							});
						}
					}
					
					// if cell has colspan value then decrease colspan value
					else if(c.colSpan > 1 || c.rowSpan > 1){
						allowDel = false;					
						$("#tableDelAlert").modal({
							backdrop: 'static', keyboard: false
						});
					}
					if(storeId !== null && storeId !== undefined){
						prevPosCount = colPosCount;
					}
					// increase loop variable "i" for rowspan value
					i += c.rowSpan - 1;

					mark(false, c);
				}
			}
			if(allowDel){ 
			// end by MV
				for (i = 0; i < table.rows.length; i++) {					
					cc = 0;
					// define cell index for last column
					if (index === -1) {
						idx = table.rows[i].cells.length - 1;
					}
					// if index is defined then use "index" value
					else {
						idx = index;
					}
					
					for (j = 0; j < index; j++)
					{
						cc += table.rows[i].cells[j].colSpan;
						tc = table.rows[i].cells.length;

						var idx = index
						
						if (j == tc-1)
						{
							idx = j+1;
							break;
						}		

						if (cc >= tc) 
						{
							idx = tc-1;
							break;
						}
						else if (cc > idx)
						{
							idx = tc - j;
							break;
						}
					}
					
					c = table.rows[i].cells[idx];
									
					c = table.rows[i].cells[idx];
					
					// if cell has colspan value then decrease colspan value					
					if (c.colSpan > 1) {
						c.colSpan -= 1;
						nc = table.rows[i].insertCell(idx+1);
						nc.className += " delete";
						nc.setAttribute("contenteditable", "false");
					}
					// else delete cell
					else {
						//table.rows[i].deleteCell(index);
						c.className += " delete";
						c.setAttribute("contenteditable", "false");

					}

					// increase loop variable "i" for rowspan value
					i += c.rowSpan - 1;

					//cc += c.colSpan;

					mark(false, c);
				}	
			}		
		}
	};


	/**
	 * Method sets or removes mark from table cell. It can be called on several ways:
	 * with direct cell address (cell reference or cell id) or with cell coordinates (row and column).
	 * @param {Boolean} flag If set to true then TD will be marked, otherwise table cell will be cleaned.
	 * @param {HTMLElement|String} el Cell reference or id of table cell. Or it can be table reference or id of the table.  
	 * @param {Integer} [row] Row of the cell.
	 * @param {Integer} [col] Column of the cell.
	 * @example
	 * // set mark to the cell with "mycell" reference
	 * TABLE.table.mark(true, mycell);
	 *  
	 * // remove mark from the cell with id "a1"
	 * TABLE.table.mark(false, "a1");
	 *  
	 * // set mark to the cell with coordinates (1,2) on table with reference "mytable"   
	 * TABLE.table.mark(true, mytable, 1, 2);
	 *  
	 * // remove mark from the cell with coordinates (4,5) on table with id "t3"
	 * TABLE.table.mark(false, "t3", 4, 5);
	 * @public
	 * @function
	 * @name TABLE.table#mark
	 */
	mark = function (flag, el, row, col) {
		
		// cell list with new coordinates
		var cl;
		// first parameter "flag" should be boolean (if not, then return from method
		if (typeof(flag) !== 'boolean') {
			return;
		}
		// test type of the second parameter (it can be string or object)
		if (typeof(el) === 'string') {
			// set reference to table or table cell (overwrite input el parameter)
			el = document.getElementById(el);
		}
		// if el is not string and is not an object then return from the method
		else if (typeof(el) !== 'object') {
			return;
		}
		// at this point, el should be an object - so test if it's TD or TABLE
		if (el.nodeName === 'TABLE') {
			// prepare cell list
			cl = cell_list(el);
			// set reference to the cell (overwrite input el parameter)
			el = cl[row + '-' + col];
		}
		// if el doesn't exist (el is not set in previous step) or el is not table cell either then return from method
		if (!el || el.nodeName !== 'TD') {
			return;
		}
		// if custom property "table" doesn't exist then create custom property
		el.table = el.table || {};
		// if color property is string, then TD background color will be changed (TABLE.table.color.cell can be set to false)
		if (typeof(TABLE.table.color.cell) === 'string') {
			// mark table cell
			if (flag === true) {				
				// remember old color
				el.table.background_old = el.style.backgroundColor;
				// set background color
				el.style.backgroundColor = TABLE.table.color.cell;
				$(".otherclass").removeClass( "otherclass" );
				el.className += " otherclass";
			}
			// umark table cell
			else {
				// return original background color and reset selected flag
				el.style.backgroundColor = el.table.background_old;
			}
		}
		// table mark remove by click - 26-03-2020
		el.style.backgroundColor = "";
		// set flag (true/false) to the cell "selected" property
		el.table.selected = flag;

	};


	/**
	 * Method removes text selection.
	 * @private
	 * @memberOf TABLE.table#
	 */
	remove_selection = function () {
		
		// remove text selection (Chrome, FF, Opera, Safari)
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		}
		// IE8
		else if (document.selection && document.selection.type === "Text") {
			try {
				document.selection.empty();
			}
			catch (error) {
				alert(error);
				// ignore error to as a workaround for bug in IE8
			}
		}
	};


	/**
	 * Determining a table cell's X and Y position/index.
	 * @see <a href="http://www.javascripttoolbox.com/temp/table_cellindex.html">http://www.javascripttoolbox.com/temp/table_cellindex.html</a>
	 * @see <a href="http://www.barryvan.com.au/2012/03/determining-a-table-cells-x-and-y-positionindex/">http://www.barryvan.com.au/2012/03/determining-a-table-cells-x-and-y-positionindex/</a>
	 * @private
	 * @memberOf TABLE.table#
	 */
	cell_list = function (table) {
		var matrix = [],
			matrixrow,
			lookup = {},
			c,			// current cell
			ri,			// row index
			rowspan,
			colspan,
			firstAvailCol,
			tr,			// TR collection
			i, j, k, l;	// loop variables
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
					if (typeof(matrix[ri][k]) === 'undefined') {
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
	};


	/**
	 * Method relocates element nodes from source cell to the target table cell.
	 * It is used in case of merging table cells.
	 * @param {HTMLElement} from Source table cell.
	 * @param {HTMLElement} to Target table cell.
	 * @private
	 * @memberOf TABLE.table#
	 */
	relocate = function (from, to) {
		var cn,		// number of child nodes
			i, j;	// loop variables
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
	};


	/**
	 * Method displays cellIndex for each cell in tables. It is useful in debuging process.
	 * @param {Boolean} flag If set to true then cell content will be replaced with cell index.
	 * @public
	 * @function
	 * @name TABLE.table#cell_index
	 */
	cell_index = function (flag) {
		// if input parameter isn't set and show_index private property is'nt true, then return
		// input parameter "flag" can be undefined in case of internal calls 
		if (flag === undefined && show_index !== true) {
			return;
		}
		// if input parameter is set, then save parameter to the private property show_index
		if (flag !== undefined) {
			// save flag to the show_index private parameter
			show_index = flag;
		}
		// variable declaration
		var tr,			// number of rows in a table
			c,			// current cell
			cl,			// cell list
			cols,		// maximum number of columns that table contains
			i, j, t;	// loop variables
		// open loop for each table inside container
		for (t = 0; t < tables.length; t++) {
			// define row number in current table
			tr = tables[t].rows;
			// define maximum number of columns (table row may contain merged table cells)
			cols = max_cols(tables[t]);
			// define cell list
			cl = cell_list(tables[t]);
			// open loop for each row
			for (i = 0; i < tr.length; i++) {
				// open loop for every TD element in current row
				for (j = 0; j < cols; j++) {
					// if cell exists then display cell index
					if (cl[i + '-' + j]) {
						// set reference to the current cell
						c = cl[i + '-' + j];
						// set innerHTML with cellIndex property
						c.innerHTML = (show_index) ? i + '-' + j : '';
					}
				}
			}
		}
	};


	return {
		/* public properties */
		/**
		 * color.cell defines background color for marked table cell. If not set then background color will not be changed.
		 * @type Object
		 * @name TABLE.table#color
		 * @default null
		 * @example
		 * // set "#9BB3DA" as color for marked cell
		 * TABLE.table.color.cell = '#9BB3DA';
		 */
		color : color,
		/**
		 * Enable / disable marking not empty table cells.
		 * @type Boolean
		 * @name TABLE.table#mark_nonempty
		 * @default true
		 * @example
		 * // allow marking only empty cells
		 * TABLE.table.mark_nonempty = false;
		 */
		mark_nonempty : mark_nonempty,
		/* public methods are documented in main code */
		onmousedown : onmousedown,
		mark : mark,
		merge : merge,
		split : split,
		row : row,
		column : column,
		cell_index : cell_index,
		cell_ignore : cell_ignore
	};
}());



// if TABLE.event isn't already defined (from other TABLE file) 
if (!TABLE.event) {
	TABLE.event = (function () {
		var add,	// add event listener
			remove;	// remove event listener
		
		// http://msdn.microsoft.com/en-us/scriptjunkie/ff728624
		// http://www.javascriptrules.com/2009/07/22/cross-browser-event-listener-with-design-patterns/
		// http://www.quirksmode.org/js/events_order.html

		// add event listener
		add = function (obj, eventName, handler) {
			if (obj.addEventListener) {
				// (false) register event in bubble phase (event propagates from from target element up to the DOM root)
				obj.addEventListener(eventName, handler, false);
			}
			else if (obj.attachEvent) {
				obj.attachEvent('on' + eventName, handler);
			}
			else {
				obj['on' + eventName] = handler;
			}
		};
	
		// remove event listener
		remove = function (obj, eventName, handler) {
			if (obj.removeEventListener) {
				obj.removeEventListener(eventName, handler, false);
			}
			else if (obj.detachEvent) {
				obj.detachEvent('on' + eventName, handler);
			}
			else {
				obj['on' + eventName] = null;
			}
		};
	
		return {
			add		: add,
			remove	: remove
		}; // end of public (return statement)	
		
	}());
}
