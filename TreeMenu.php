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

/**
* HTML_TreeMenu Class
*
* A simple couple of PHP classes and some not so simple
* Jabbascript which produces a tree menu. In IE this menu
* is dynamic, with branches being collapsable. In IE5+ the
* status of the collapsed/open branches persists across page
* refreshes.In any other browser the tree is static. Code is
* based on work of Harald Radi.
*
* Usage.
*
* After installing the package, copy the example php script to
* your servers document root. Also place the TreeMenu.js and the
* images folder in the same place. Running the script should
* then produce the tree.
*
* Thanks go to Chip Chapin (http://www.chipchapin.com) for many
* excellent ideas and improvements.
*
* @author  Richard Heyes <richard@php.net>
* @author  Harald Radi <harald.radi@nme.at>
* @access  public
* @package HTML_TreeMenu
*/

class HTML_TreeMenu
{
    /**
    * Indexed array of subnodes
    * @var array
    */
    var $items;

    /**
    * Path to the images
    * @var string
    */
    var $images;
    
    /**
    * Target for the links generated
    * @var string
    */
    var $linkTarget;
    
    /**
    * Whether to use clientside persistence or not
    * @var bool
    */
    var $userPersistence;
    
    /**
    * The default CSS class for the nodes
    */
    var $defaultClass;

    /**
    * Constructor
    *
    * @access public
    * @param  array $options An array of the various options you can set for the
    *                        treemenu. These are:
    *                         o images         The path to the images folder. Defaults to "images"
    *                         o linkTarget     The target for the link. Defaults to "_self"
    *                         o usePersistence Whether to use clientside persistence. This persistence
    *                                          is achieved using cookies. Default is true.
    *                         o defaultClass   The default CSS class to apply to a node. Default is none.
    */
    function HTML_TreeMenu($options = array())
    {
        $this->images         = 'images';
        $this->linkTarget     = '_self';
        $this->usePersistence = true;
        $this->defaultClass   = '';

        foreach ($options as $option => $value) {
            $this->$option = $value;
        }
    }

    /**
    * Allows setting of various parameters after the initial
    * constructor call. Possible options you can set are:
    *  o images          -  The path to the images to be used
    *  o linkTarget      -  The default target for links
    *  o usePersistence  -  Whether to use client side persistence or not
    *
    * @param  string $option Option to set
    * @param  string $value  Value to set the option to
    * @access public
    */
    function setOption($option, $value)
    {
        $this->$option = $value;
    }

    /**
    * This function adds an item to the the tree.
    *
    * @access public
    * @param  object $node The node to add. This object should be
    *                      a HTML_TreeNode object.
    * @return object       Returns a reference to the new node inside
    *                      the tree.
    */
    function &addItem(&$node)
    {
        $this->items[] = &$node;
        return $this->items[count($this->items) - 1];
    }
} // HTML_TreeMenu


/**
* HTML_TreeNode class
* 
* This class is supplementary to the above and provides a way to
* add nodes to the tree. A node can have other nodes added to it. 
*
* @author  Richard Heyes <richard@php.net>
* @author  Harald Radi <harald.radi@nme.at>
* @access  public
* @package HTML_TreeMenu
*/
class HTML_TreeNode
{
    /**
    * The text for this node.
    * @var string
    */
    var $text;

    /**
    * The link for this node.
    * @var string
    */
    var $link;

    /**
    * The icon for this node.
    * @var string
    */
    var $icon;
    
    /**
    * The css class for this node
    * @var string
    */
    var $cssClass;

    /**
    * Indexed array of subnodes
    * @var array
    */
    var $items;

    /**
    * Whether this node is expanded or not
    * @var bool
    */
    var $expanded;
    
    /**
    * Whether this node is dynamic or not
    * @var bool
    */
    var $isDynamic;
    
    /**
    * Should this node be made visible?
    * @var bool
    */
    var $ensureVisible;
    
    /**
    * The parent node. Null if top level
    * @var object
    */
    var $parent;

    /**
    * Constructor
    *
    * @access public
    * @param  array $options An array of options which you can pass to change
    *                        the way this node looks/acts. This can consist of:
    *                         o text          The title of the node, defaults to blank
    *                         o link          The link for the node, defaults to blank
    *                         o icon          The icon for the node, defaults to blank
    *                         o class         The CSS class for this node, defaults to blank
    *                         o expanded      The default expanded status of this node, defaults to false
    *                                         This doesn't affect non dynamic presentation types
    *                         o isDynamic     If this node is dynamic or not. Only affects
    *                                         certain presentation types.
    *                         o ensureVisible If true this node will be made visible despite the expanded
    *                                         settings, and client side persistence. Will not affect
    *                                         some presentation styles, such as Listbox. Default is false
    */
    function HTML_TreeNode($options = array())
    {
        $this->text          = '';
        $this->link          = '';
        $this->icon          = '';
        $this->cssClass      = '';
        $this->expanded      = false;
        $this->isDynamic     = true;
        $this->ensureVisible = false;

        $this->parent        = null;
        
        foreach ($options as $option => $value) {
            $this->$option = $value;
        }
    }

    /**
    * Allows setting of various parameters after the initial
    * constructor call. Possible options you can set are:
    *  o text
    *  o link
    *  o icon
    *  o cssClass
    *  o expanded
    *  o isDynamic
    *  o ensureVisible
    * ie The same options as in the constructor
    *
    * @access public
    * @param  string $option Option to set
    * @param  string $value  Value to set the option to
    */
    function setOption($option, $value)
    {
        $this->$option = $value;
    }

    /**
    * Adds a new subnode to this node.
    *
    * @access public
    * @param  object $node The new node
    */
    function &addItem(&$node)
    {
        $node->parent  = &$this;
        $this->items[] = &$node;
        
        /**
        * If the subnode has ensureVisible set it needs
        * to be handled, and all parents set accordingly.
        */
        if ($node->ensureVisible) {
            $this->_ensureVisible();
        }

        return $this->items[count($this->items) - 1];
    }
    
    /**
    * Private function to handle ensureVisible stuff
    *
    * @access private
    */
    function _ensureVisible()
    {
        $this->ensureVisible = true;
        $this->expanded      = true;

        if (!is_null($this->parent)) {
            $this->parent->_ensureVisible();
        }
    }
}


/**
* HTML_TreeMenu_DHTML class
*
* This class is a presentation class for the tree structure
* created using the TreeMenu/TreeNode. It presents the 
* traditional tree, static for browsers that can't handle
* the DHTML.
*/
class HTML_TreeMenu_DHTML
{
    /**
    * The TreeMenu structure
    * @var object
    */
    var $menu;

    /**
    * Dynamic status of the treemenu. If true (default) this has no effect. If
    * false it will override all dynamic status vars and set the menu to be
    * fully expanded an non-dynamic.
    */
    var $isDynamic;

    /**
    * Constructor, takes the tree structure as
    * an argument and an array of options which
	* can consist of:
	*  o isDynamic  Defines menu wide dynamic status
	*
	* @param object $structure The menu structure
	* @param array  $options   Array of options
    */
    function HTML_TreeMenu_DHTML($structure, $options = array())
    {
        $this->menu      = $structure;
        $this->isDynamic = true;
        
        foreach ($options as $option => $value) {
            $this->$option = $value;
        }
    }

    /**
    * Prints the HTML generated by the above toHTML()
    *
    * @access public
    */
    function printMenu()
    {
        echo $this->toHTML();
    }

    /**
    * Returns the HTML for the menu. This method can be
    * used instead of printMenu() to use the menu system
    * with a template system.
    *
    * @access public
    * @return string The HTML for the menu
    */    
    function toHTML()
    {
        static $count = 0;
        $menuObj = 'objTreeMenu_' . ++$count;

        $html  = "\n";
         $html .= '<script language="javascript" type="text/javascript">' . "\n\t";
        $html .= sprintf('%s = new TreeMenu("%s", "%s", "%s", "%s", %s);',
                         $menuObj,
                         $this->menu->images,
                         $menuObj,
                         $this->menu->linkTarget,
                         $this->menu->defaultClass,
                         $this->menu->usePersistence ? 'true' : 'false');
 
        $html .= "\n";

        /**
        * Loop through subnodes
        */
        if (isset($this->menu->items)) {
            for ($i=0; $i<count($this->menu->items); $i++) {
                $html .= $this->_nodeToHTML($this->menu->items[$i], $menuObj);
            }
        }

         $html .= sprintf("\n\t%s.drawMenu();", $menuObj);
        if ($this->menu->usePersistence && $this->isDynamic) {
            $html .= sprintf("\n\t%s.resetBranches();", $menuObj);
        }
        $html .= "\n</script>";

        return $html;
    }
    
    /**
    * Prints a node of the menu
    *
    * @access private
    */
    function _nodeToHTML($nodeObj, $prefix, $return = 'newNode')
    {
        $expanded  = $this->isDynamic ? ($nodeObj->expanded  ? 'true' : 'false') : 'true';
        $isDynamic = $this->isDynamic ? ($nodeObj->isDynamic ? 'true' : 'false') : 'false';
        $html = sprintf("\t %s = %s.addItem(new TreeNode('%s', %s, %s, %s, %s, '%s'));\n",
                        $return,
                        $prefix,
                        $nodeObj->text,
                        !empty($nodeObj->icon) ? "'" . $nodeObj->icon . "'" : 'null',
                        !empty($nodeObj->link) ? "'" . $nodeObj->link . "'" : 'null',
                        $expanded,
                        $isDynamic,
                        $nodeObj->cssClass);

        /**
        * Loop through subnodes
        */
        if (!empty($nodeObj->items)) {
            for ($i=0; $i<count($nodeObj->items); $i++) {
                $html .= $this->_nodeToHTML($nodeObj->items[$i], $return, $return . '_' . ($i + 1));
            }
        }

        return $html;
    }
}


/**
* HTML_TreeMenu_Listbox class
* 
* This class presents the menu as a listbox
*/
class HTML_TreeMenu_Listbox
{
    /**
    * The menu structure
    * @var object
    */
    var $menu;
    
    /**
    * The text that is displayed in the first option
    * @var string
    */
    var $promoText;
    
    /**
    * The character used for indentation
    * @var string
    */
    var $indentChar;
    
    /**
    * How many of the indent chars to use
    * per indentation level
    * @var integer
    */
    var $indentNum;

    /**
    * Constructor
    *
    * @param object $structure The menu structure
    * @param array  $options   Options whic affect the display of the listbox.
    *                          These can consist of:
    *                           o promoText  The text that appears at the the top of the listbox
    *                                        Defaults to "Select..."
    *                           o indentChar The character to use for indenting the nodes
    *                                        Defaults to "&nbsp;"
    *                           o indentNum  How many of the indentChars to use per indentation level
    *                                        Defaults to 2
    */
    function HTML_TreeMenu_Listbox($structure, $options = array())
    {
        $this->menu       = $structure;
        $this->promoText  = 'Select...';
        $this->indentChar = '&nbsp;';
        $this->indentNum  = 2;
        
        foreach ($options as $option => $value) {
            $this->$option = $value;
        }
    }
    
    /**
    * Prints the listbox
    */
    function printMenu()
    {
        echo $this->toHTML();
    }
    
    /**
    * Returns the HTML generated
    */
    function toHTML()
    {
        static $count = 0;
        $nodeHTML = '';

        /**
        * Loop through subnodes
        */
        if (isset($this->menu->items)) {
            for ($i=0; $i<count($this->menu->items); $i++) {
                $nodeHTML .= $this->_nodeToHTML($this->menu->items[$i]);
            }
        }

        return sprintf('<form onsubmit="var link = this.%s.options[this.%s.selectedIndex].value; if (link) location.href = link; return false"><select name="%s"><option value="">%s</option>%s</select> <input type="submit" value="Go" /></form>',
                       'HTML_TreeMenu_Listbox_' . ++$count,
                       'HTML_TreeMenu_Listbox_' . $count,
                       'HTML_TreeMenu_Listbox_' . $count,
                       $this->promoText,
                       $nodeHTML);
    }
    
    /**
    * Returns HTML for a single node
    * 
    * @access private
    */
    function _nodeToHTML($node, $prefix = '')
    {
        $html = sprintf('<option value="%s">%s%s</option>', $node->link, $prefix, $node->text);
        
        /**
        * Loop through subnodes
        */
        if (isset($node->items)) {
            for ($i=0; $i<count($node->items); $i++) {
                $html .= $this->_nodeToHTML($node->items[$i], $prefix . str_repeat($this->indentChar, $this->indentNum));
            }
        }
        
        return $html;
    }
}
?>
