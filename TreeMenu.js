// +-----------------------------------------------------------------------+
// | Copyright (c) 2002, Richard Heyes, Harald Radi                        |
// | All rights reserved.                                                  |
// |                                                                       |
// | Redistribution and use in source and binary forms, with or without    |
// | modification, are permitted provided that the following conditions    |
// | are met:                                                              |
// |                                                                       |
// | o Redistributions of source code must retain the above copyright      |
// |   notice, this list of conditions and the following disclaimer.       |
// | o Redistributions in binary form must reproduce the above copyright   |
// |   notice, this list of conditions and the following disclaimer in the |
// |   documentation and/or other materials provided with the distribution.| 
// | o The names of the authors may not be used to endorse or promote      |
// |   products derived from this software without specific prior written  |
// |   permission.                                                         |
// |                                                                       |
// | THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS   |
// | "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT     |
// | LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR |
// | A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT  |
// | OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, |
// | SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT      |
// | LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, |
// | DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY |
// | THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT   |
// | (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE |
// | OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.  |
// |                                                                       |
// +-----------------------------------------------------------------------+
// | Author: Richard Heyes <richard@phpguru.org>                           |
// |         Harald Radi <harald.radi@nme.at>                              |
// +-----------------------------------------------------------------------+
//
// $Id: TreeMenu.js,v 1.7 2002-11-02 21:43:31 richard Exp $

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
	this.childParents   = new Array();
	
	// Methods
	this.preloadImages         = preloadImages;
	this.drawMenu              = drawMenu;
	this.toggleBranch          = toggleBranch;
	this.swapImage             = swapImage;
	this.doesMenu              = doesMenu;
	this.doesPersistence       = doesPersistence;
	this.getLayer              = getLayer;
	this.saveExpandedStatus    = saveExpandedStatus;
	this.loadExpandedStatus    = loadExpandedStatus;
	this.resetBranches         = resetBranches;
	this.checkParentVisibility = checkParentVisibility;
	
	this.preloadImages();
}

function TreeNode(title, icon, link, expanded, isDynamic)
{
	this.title     = title;
	this.icon      = icon;
	this.link      = link;
	this.expanded  = expanded;
	this.isDynamic = isDynamic;
	this.n         = new Array();
}

/**
* Preload images hack for CrapZilla
*/
function preloadImages()
{
	var plustop    = new Image; plustop.src    = this.iconpath + '/plustop.gif';
	var plusbottom = new Image; plusbottom.src = this.iconpath + '/plusbottom.gif';
	var plus       = new Image; plus.src       = this.iconpath + '/plus.gif';

	var minustop    = new Image; minustop.src    = this.iconpath + '/minustop.gif';
	var minusbottom = new Image; minusbottom.src = this.iconpath + '/minusbottom.gif';
	var minus       = new Image; minus.src       = this.iconpath + '/minus.gif';

	var branchtop    = new Image; branchtop.src    = this.iconpath + '/branchtop.gif';
	var branchbottom = new Image; branchbottom.src = this.iconpath + '/branchbottom.gif';
	var branch       = new Image; branch.src       = this.iconpath + '/branch.gif';

	var linebottom = new Image; linebottom.src = this.iconpath + '/linebottom.gif';
	var line       = new Image; line.src       = this.iconpath + '/line.gif';
}

/**
* Main function that draws the menu and assigns it
* to the layer (or document.write()s it)
*/
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
		layerID = this.layer + '_' + 'node_' + implode('_', level);

		/**
        * Store the child/parent relationship
        */
		this.childParents[layerID] = parentLayerID;

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

		} else if (nodes[i].expanded) {
			expanded = true;

		} else {
			expanded = false;
		}
		/**
        * Setup branch status and build an indexed array
		* of branch layer ids
        */
		if (nodes[i].n.length > 0) {
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
		var gifname = nodes[i].n.length && this.doesMenu() && nodes[i].isDynamic ? (expanded ? 'minus' : 'plus') : 'branch';
		var iconimg = nodes[i].icon ? stringFormat('<img src="{0}/{1}" width="20" height="20" align="top">', this.iconpath, nodes[i].icon) : '';
		

		/**
        * Build the html to write to the document
        */
		var divTag    = stringFormat('<div id="{0}" style="display: {1}; behavior: url(#default#userdata)">', layerID, visibility);
		var onMDown   = doesMenu() && nodes[i].n.length  && nodes[i].isDynamic ? stringFormat('onmousedown="{0}.toggleBranch(\'{1}\', true)" style="cursor: pointer; cursor: hand"', this.myname, layerID) : '';
		var imgTag    = stringFormat('<img src="{0}/{1}{2}.gif" width="20" height="20" align="top" border="0" name="img_{3}" {4} />', this.iconpath, gifname, modifier, layerID, onMDown);
		var linkStart = nodes[i].link ? stringFormat('<a href="{0}" target="{1}">', nodes[i].link, this.linkTarget) : '';
		var linkEnd   = nodes[i].link ? '</a>' : '';

		output = stringFormat('{0}<nobr>{1}{2}{3}{4}{5}{6}</nobr><br></div>',
		                  divTag,
						  prepend,
		                  parentLayerID == null && nodes.length == 1 ? '' : imgTag,
						  iconimg,
						  linkStart,
						  nodes[i].title,
						  linkEnd);

		/**
        * Write out the HTML. Uses document.write for speed over layers and
		* innerHTML. This however means no dynamic adding/removing nodes on
		* the client side. This could be conditional I guess if dynamic
		* adding/removing is required.
        */
		if (this.doesMenu()) {
			//this.getLayer(this.layer).innerHTML += output
			document.write(output);

		} else {
			document.write(output);
		}

		/**
        * Traverse sub nodes ?
        */
		if (nodes[i].n.length) {
			/**
            * Determine what to prepend. If there is only one root
			* node then the prepend to pass to children is nothing.
			* Otherwise it depends on where we are in the tree.
            */
			if (parentLayerID == null && nodes.length == 1) {
				var newPrepend = '';

			} else if (i < (nodes.length - 1)) {
				var newPrepend = prepend + stringFormat('<img src="{0}/line.gif" width="20" height="20" align="top">', this.iconpath);

			} else {
				var newPrepend = prepend + stringFormat('<img src="{0}/linebottom.gif" width="20" height="20" align="top">', this.iconpath);
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
	var currentDisplay = this.getLayer(layerID).style.display;
	var newDisplay     = (this.branchStatus[layerID] && currentDisplay == 'inline') ? 'none' : 'inline'

	for (var i=0; i<this.layerRelations[layerID].length; i++) {
		if (this.branchStatus[this.layerRelations[layerID][i]]) {
			this.toggleBranch(this.layerRelations[layerID][i], false);
		}

		this.getLayer(this.layerRelations[layerID][i]).style.display = newDisplay;
	}

	if (updateStatus) {
		this.branchStatus[layerID] = !this.branchStatus[layerID];

		/**
        * Persistence
        */
		if (this.doesPersistence() && !arguments[2]) {
			this.saveExpandedStatus(layerID, this.branchStatus[layerID]);
		}

		// Swap image
		this.swapImage(layerID);
	}
}

/**
* Swaps the plus/minus branch images
*/
function swapImage(layerID)
{
	imgSrc = document.images['img_' + layerID].src;

	re = /^(.*)(plus|minus)(bottom|top|single)?.gif$/
	if (matches = imgSrc.match(re)) {

		document.images['img_' + layerID].src = stringFormat('{0}{1}{2}{3}',
		                                                matches[1],
														matches[2] == 'plus' ? 'minus' : 'plus',
														matches[3] ? matches[3] : '',
														'.gif');
	}
}

/**
* Can the browser handle the dynamic menu?
*/
function doesMenu()
{
	return (is_ie5up || is_nav6up || is_gecko);
}

/**
* Can the browser handle save the branch status
*/
function doesPersistence()
{
	return is_ie5up;
}

/**
* Returns the appropriate layer accessor
*/
function getLayer(layerID)
{
	if (document.getElementById(layerID)) {
		return document.getElementById(layerID);
	} else if (document.all(layerID)) {
		return document.all(layerID);
	}
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
	if (!this.doesPersistence()) {
		return false;
	}

	for (var i=0; i<this.branches.length; i++) {
		var status = this.loadExpandedStatus(this.branches[i]);
		// Only update if it's supposed to be expanded and it's not already
		if (status == 'true' && this.branchStatus[this.branches[i]] != true) {
			if (this.checkParentVisibility(this.branches[i])) {
				this.toggleBranch(this.branches[i], true, true);
			} else {
				this.branchStatus[this.branches[i]] = true;
				this.swapImage(this.branches[i]);
			}
		}
	}
}

/**
* Checks whether a branch should be open 
* or not based on its parents' status
*/
function checkParentVisibility(layerID)
{
	if (in_array(this.childParents[layerID], this.branches)
	    && this.branchStatus[this.childParents[layerID]]
		&& this.checkParentVisibility(this.childParents[layerID]) ) {
		
		return true;

	} else if (this.childParents[layerID] == null) {
		return true;
	}
	
	return false;

/*
	if (this.childParents[layerID] == null) {
		return this.branchStatus[layerID];
	} else {
		return this.branchStatus && this.checkVisibility(this.childParents[layerID]);
	}
*/
}

/**
* New C# style string formatter
*/
function stringFormat(strInput)
{
	var idx = 0;

	for (var i=1; i<arguments.length; i++) {
		while ((idx = strInput.indexOf('{' + (i - 1) + '}', idx)) != -1) {
			strInput = strInput.substring(0, idx) + arguments[i] + strInput.substr(idx + 3);
		}
	}
	
	return strInput;
}

/**
* The much adored PHP explode() function
*/
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

/**
* Also much adored, the PHP implode() function
*/
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

/**
* Aah, all the old favourites are coming out...
*/
function in_array(item, arr)
{
	for (var i=0; i<arr.length; i++) {
		if (arr[i] == item) {
			return true;
		}
	}

	return false;
}