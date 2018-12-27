--TEST--
HTML_TreeMenu tests for Bug #4950:  Using "kriesing" tree type the "nodeOptions" paramether is not working.
--CREDITS--
Chuck Burgess <ashnazg@php.net>
# created for v1.2.2 2008-05-06
--SKIPIF--
<?php
if (!file_exists(dirname(__FILE__) . '/config.php')) {
    die('skip No config.php found; cant connect to DB');
}
--FILE--
<?php
require_once dirname(__FILE__) . '/config.php';

echo '=====HTML_TreeMenu tests for Bug #9750:  Using "kriesing" tree type the "nodeOptions" paramether is not working.=====' . PHP_EOL . PHP_EOL;

echo 'TEST:  test case provided in bug report' . PHP_EOL;

require_once 'Tree/Tree.php';
require_once 'Tree/Memory.php';
require_once 'HTML/TreeMenu.php';


$options = array ('order' => 'name', 'table' => 'mytree');

$tree = Tree::setup('Memory_DBnested', $dbDsn, $options);
$tree->setup();

$nodeOptions = array(
    'text'          => '',
    'link'          => 'editCategory.php?id=',
    'icon'          => 'folder.gif',
    'expandedIcon'  => 'folder-expanded.gif',
    'class'         => '',
    'expanded'      => false,
    'linkTarget'    => '_self',
    'isDynamic'     => 'true',
    'ensureVisible' => '',
); 	

$options = array(
    'structure'   => $tree,
    'type'        => 'kriesing', 
    'nodeOptions' => $nodeOptions
);
                    
$menu = HTML_TreeMenu::createFromStructure($options);

// Chose a generator. You can generate DHTML or a Listbox
$dhtml = new HTML_TreeMenu_DHTML(
    $menu, 
    array(
        'images'       => 'images',
        'defaultClass' => 'treeMenuDefault'
    )
);
$listbox = new HTML_TreeMenu_ListBox(
    $menu, 
    array(
        'images'       => 'images',
        'defaultClass' => 'treeMenuDefault'
    )
);


echo 'TEST:  using DHTML' . PHP_EOL;
echo $dhtml->toHTML() . PHP_EOL;

echo 'TEST:  using Listbox' . PHP_EOL;
echo $listbox->toHTML() . PHP_EOL;

?>
--EXPECT--
=====HTML_TreeMenu tests for Bug #9750:  Using "kriesing" tree type the "nodeOptions" paramether is not working.=====

TEST:  test case provided in bug report
TEST:  using DHTML

<script type="text/javascript">
//<![CDATA[
	objTreeMenu_1 = new TreeMenu("images", "objTreeMenu_1", "_self", "treeMenuDefault", true, false);

	objTreeMenu_1.drawMenu();
	objTreeMenu_1.writeOutput();
	objTreeMenu_1.resetBranches();
// ]]>
</script>
TEST:  using Listbox
<form target="_self" action="" onsubmit="var link = this.HTML_TreeMenu_Listbox_1.options[this.HTML_TreeMenu_Listbox_1.selectedIndex].value; if (link) {this.action = link; return true} else return false"><select name="HTML_TreeMenu_Listbox_1"><option value="">Select...</option></select> <input type="submit" value="Go" /></form>
