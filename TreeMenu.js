// +----------------------------------------------------------------------+
// | PHP Version 4                                                        |
// +----------------------------------------------------------------------+
// | Copyright (c) 1997-2002 The PHP Group                                |
// +----------------------------------------------------------------------+
// | This source file is subject to version 2.02 of the PHP license,      |
// | that is bundled with this package in the file LICENSE, and is        |
// | available at through the world-wide-web at                           |
// | http://www.php.net/license/2_02.txt.                                 |
// | If you did not receive a copy of the PHP license and are unable to   |
// | obtain it through the world-wide-web, please send a note to          |
// | license@php.net so we can mail you a copy immediately.               |
// +----------------------------------------------------------------------+
// | Author: Richard Heyes <richard@phpguru.org>                          |
// |         Harald Radi <harald.radi@nme.at>                             |
// +----------------------------------------------------------------------+
//
// $Id: TreeMenu.js,v 1.1 2002-06-15 18:24:06 richard Exp $

function TreeMenu(layer, iconpath, myname, linkTarget)
{
	// Properties
	this.layer      = layer;
	this.iconpath   = iconpath;
	this.myname     = myname;
	this.linkTarget = linkTarget;
	this.n          = new Array();

	this.branches       = new Array();
	this.branchStatus   = new Array();
	this.layerRelations = new Array();
	
	// Methods
	this.drawMenu           = drawMenu;
	this.toggleBranch       = toggleBranch;
	this.doesMenu           = doesMenu;
	this.saveExpandedStatus = saveExpandedStatus;
	this.loadExpandedStatus = loadExpandedStatus;
	this.resetBranches      = resetBranches;
}

function TreeNode(title, icon, link, expanded)
{
	this.title    = title;
	this.icon     = icon;
	this.link     = link;
	this.expanded = expanded;
	this.n        = new Array();
}

function drawMenu()// OPTIONAL ARGS: nodes = [], level = [], prepend = '', expanded = false, visbility = 'inline', parentLayerID = null
{
	/**
    * Necessary variables
    */
	var output        = '';
	var modifier      = '';
	var layerID       = '';
	var parentLayerID = '';

	/**
    * Parse any optional arguments
    */
	var nodes         = arguments[0] ? arguments[0] : this.n
	var level         = arguments[1] ? arguments[1] : [];
	var prepend       = arguments[2] ? arguments[2] : '';
	var expanded      = arguments[3] ? arguments[3] : false;
	var visibility    = arguments[4] ? arguments[4] : 'inline';
	var parentLayerID = arguments[5] ? arguments[5] : null;

	var currentlevel  = level.length;

	for (var i=0; i<nodes.length; i++) {
	
		level[currentlevel] = i+1;
		layerID = 'node_' + implode('_', level);

		/**
        * Gif modifier
        */
		if (i == 0 && parentLayerID == null) {
			modifier = nodes.length > 1 ? "top" : 'single';
		} else if(i == (nodes.length-1)) {
			modifier = "bottom";
		} else {
			modifier = "";
		}

		/**
        * Single root branch is always expanded
        */
		if (!doesMenu() || (parentLayerID == null && nodes.length == 1)) {
			expanded = true;
		}

		/**
        * Setup branch status and build an indexed array
		* of branch layer ids
        */
		if (nodes[i].n.length > 1) {
			this.branchStatus[layerID] = expanded;
			this.branches[this.branches.length] = layerID;
		}

		/**
        * Setup toggle relationship
        */
		if (!this.layerRelations[parentLayerID]) {
			this.layerRelations[parentLayerID] = new Array();
		}
		this.layerRelations[parentLayerID][this.layerRelations[parentLayerID].length] = layerID;

		/**
        * Branch images
        */
		var gifname = nodes[i].n.length && this.doesMenu() ? (expanded ? 'minus' : 'plus') : 'branch';
		var iconimg = nodes[i].icon ? sprintf('<img src="%s/%s" align="top">', this.iconpath, nodes[i].icon) : '';
		

		/**
        * Build the html to write to the document
        */
		var divTag    = sprintf('<div id="%s" style="display: %s; behavior: url(#default#userdata)">', layerID, visibility);
		var onClick   = doesMenu() && nodes[i].n.length ? sprintf('onclick="%s.toggleBranch(\'%s\', true)" style="cursor: hand"', this.myname, layerID) : '';
		var imgTag    = sprintf('<img src="%s/%s%s.gif" align="top" border="0" name="img_%s" %s />', this.iconpath, gifname, modifier, layerID, onClick);
		var linkStart = nodes[i].link ? sprintf('<a href="%s" target="%s">', nodes[i].link, this.linkTarget) : '';
		var linkEnd   = nodes[i].link ? '</a>' : '';

		output = sprintf('%s<nobr>%s%s%s%s%s%s</nobr><br></div>',
		                  divTag,
						  prepend,
		                  parentLayerID == null && nodes.length == 1 ? '' : imgTag,
						  iconimg,
						  linkStart,
						  nodes[i].title,
						  linkEnd);

		/**
        * Write out the HTML
        */
		if (doesMenu()) {
			document.all(this.layer).innerHTML += output;

		} else if(document.getElementById(this.layer)) {
			document.getElementById(this.layer).innerHTML += output;

		} else {
			document.write(output);
		}

		if (nodes[i].n.length) {
			/**
            * Determine what to prepend. If there is only one root
			* node then the prepend to pass to children is nothing.
			* Otherwise it depends on where we are in the tree.
            */
			if (parentLayerID == null && nodes.length == 1) {
				var newPrepend = '';

			} else if (i < (nodes.length - 1)) {
				var newPrepend = prepend + sprintf('<img src="%s/line.gif" align="top">', this.iconpath);

			} else {
				var newPrepend = prepend + sprintf('<img src="%s/linebottom.gif" align="top">', this.iconpath);
			}

			this.drawMenu(nodes[i].n,
			              explode('_', implode('_', level)), // Seemingly necessary to enforce passing by value
			              newPrepend,
			              nodes[i].expanded,
			              expanded ? 'inline' : 'none',
			              layerID);
		}
	}
}

function toggleBranch(layerID, updateStatus) // OPTIONAL ARGS: noSave = false
{
	var currentDisplay = document.all(layerID).style.display;
	var newDisplay     = (this.branchStatus[layerID] && currentDisplay == 'inline') ? 'none' : 'inline'

	for (var i=0; i<this.layerRelations[layerID].length; i++) {
		if (this.branchStatus[this.layerRelations[layerID][i]]) {
			this.toggleBranch(this.layerRelations[layerID][i], false);
		}

		document.all(this.layerRelations[layerID][i]).style.display = newDisplay;
	}

	if (updateStatus) {
		this.branchStatus[layerID] = !this.branchStatus[layerID];

		/**
        * Persistence
        */
		if (!arguments[2]) {
			this.saveExpandedStatus(layerID, this.branchStatus[layerID]);
		}

		// Swap image:
		imgSrc = document.images['img_' + layerID].src;
		re = /^(.*)(plus|minus)(bottom|top|single)?.gif$/
		if (matches = imgSrc.match(re)) {
			
			document.images['img_' + layerID].src = sprintf('%s%s%s%s',
			                                                matches[1],
															matches[2] == 'plus' ? 'minus' : 'plus',
															matches[3],
															'.gif');
		}
	}
}

/**
* Can the browser handle the dynamic menu?
*/
function doesMenu()
{
	var agt      = navigator.userAgent.toLowerCase();
	var is_major = parseInt(navigator.appVersion);
    var is_minor = parseFloat(navigator.appVersion);

	var is_ie    = (agt.indexOf("msie") != -1 && agt.indexOf("opera") == -1);
	var is_ie3   = (is_ie && (is_major < 4));
	var is_ie4   = (is_ie && (is_major == 4) && (agt.indexOf("msie 4")!=-1) );
	var is_ie5up = (is_ie && !is_ie3 && !is_ie4);

	return is_ie5up;
}

/**
* Save the status of the layer
*/
function saveExpandedStatus(layerID, expanded)
{
	document.all(layerID).setAttribute("expandedStatus", expanded);
	document.all(layerID).save(layerID);
}

/**
* Load the status of the layer
*/
function loadExpandedStatus(layerID)
{
	document.all(layerID).load(layerID);
	if (val = document.all(layerID).getAttribute("expandedStatus")) {
		return val;
	} else {
		return null;
	}
}

/**
* Reset branch status
*/
function resetBranches()
{
	for (var i=0; i<this.branches.length; i++) {
		var status = this.loadExpandedStatus(this.branches[i]);
		// Only update if it's supposed to be expanded and it's not already
		if (status == 'true' && this.branchStatus[this.branches[i]] != true) {
			this.toggleBranch(this.branches[i], true, true);
		}
	}
}

/**
* Javascript mini implementation of sprintf()
*/
function sprintf(strInput)
{
	var strOutput  = '';
	var currentArg = 1;

	for (var i=0; i<strInput.length; i++) {
		if (strInput.charAt(i) == '%' && i != (strInput.length - 1) && typeof(arguments[currentArg]) != 'undefined') {
			switch (strInput.charAt(++i)) {
				case 's':
					strOutput += arguments[currentArg];
					break;
				case '%':
					strOutput += '%';
					break;
			}
			currentArg++;
		} else {
			strOutput += strInput.charAt(i);
		}
	}

	return strOutput;
}

function explode(seperator, input)
{
	var output = [];
	var tmp    = '';
	skipEmpty  = arguments[2] ? true : false;
	
	for (var i=0; i<input.length; i++) {
		if (input.charAt(i) == seperator) {
			if (tmp == '' && skipEmpty) {
				continue;
			} else {
				output[output.length] = tmp;
				tmp = '';
			}
		} else {
			tmp += input.charAt(i);
		}
	}
	if (tmp != '' || !skipEmpty) {
		output[output.length] = tmp;
	}
	
	return output;
}

function implode(seperator, input)
{
	var output = '';

	for (var i=0; i<input.length; i++) {
		if (i == 0) {
			output += input[i];
		} else {
			output += seperator + input[i];
		}
	}
	
	return output;
}

function in_array(item, arr)
{
	for (var i=0; i<arr.length; i++) {
		if (arr[i] == item) {
			return true;
		}
	}

	return false;
}