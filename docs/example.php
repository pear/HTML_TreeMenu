<?php
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
// $Id$

	require_once('TreeMenu.php');
	$icon = 'folder.gif';

	$menu  = new HTML_TreeMenu("menuLayer", 'images', '_self');

	$node1 = new HTML_TreeNode("INBOX", "test.php", $icon);
	$node1->addItem(new HTML_TreeNode("deleted-items", "test.php", $icon));
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