<?php
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
// $Id$

	require_once('HTML/TreeMenu.php');
	$icon = 'folder.gif';

	$menu  = new HTML_TreeMenu("menuLayer", 'images', '_self');

	$node1 = new HTML_TreeNode("INBOX", "test.php", $icon);
	$foo   = &$node1->addItem(new HTML_TreeNode("deleted-items", "test.php", $icon));
	$bar   = &$foo->addItem(new HTML_TreeNode("deleted-items", "test.php", $icon));
	$blaat = &$bar->addItem(new HTML_TreeNode("deleted-items", "test.php", $icon));
	$blaat->addItem(new HTML_TreeNode("deleted-items", "test.php", $icon));

	$node1->addItem(new HTML_TreeNode("sent-items",    "test.php", $icon));
	$node1->addItem(new HTML_TreeNode("drafts",        "test.php", $icon));
	
	
	$menu->addItem($node1);
	$menu->addItem(new HTML_TreeNode("drafts", "test.php", $icon));
	$menu->addItem(new HTML_TreeNode("drafts", "test.php", $icon));//$node1);

	
?>
<html>
<head>
	<script src="sniffer.js" language="JavaScript" type="text/javascript"></script>
	<script src="TreeMenu.js" language="JavaScript" type="text/javascript"></script>
</head>
<body>

<div id="menuLayer"></div>
<?$menu->printMenu()?>

</body>
</html>