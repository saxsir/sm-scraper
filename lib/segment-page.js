var SMScraper = (function(w) {

  /**
   * ページタイトルを取得する
   *
   * return String ページタイトル
   */
  function getTitle() {
    return document.title;
  }

  /**
   * bodyのレイアウト情報を取得する
   *
   * return Object bodyのレイアウト情報をまとめたオブジェクト
   */
  function getBodyLayoutData() {
    var body = document.body,
    style = w.getComputedStyle(body),
    bounds = body.getBoundingClientRect(),
    color = style.color.split(',');

    return {
      color: {
        r: color[0].replace(/\D/g, ''),
        g: color[1].replace(/\D/g, ''),
        b: color[2].replace(/\D/g, '')
      },
      width: bounds.width,
      height: bounds.height,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight
    };
  }

  /**
   * 最小ブロックのレイアウト情報を取得
   *
   * NOTE: nodes = 最小ブロックの集合
   *
   * return Array 最小ブロックのレイアウト情報の配列
   */
  function getNodesLayoutData() {
    var nodes = [];

    // 最小ブロックに分割
    var minimumBlocks = divideIntoMinimumBlocks();

    // 各最小ブロックのレイアウト情報を取得
    var i = 0;
    for (i = 0; i < minimumBlocks.length; i++) {
      var data = getLayoutData(minimumBlocks[i]);
      nodes.push(data);
    }

    return nodes;
  }

  /**
   * 最小ブロックに分割したDOM要素の集合を返す
   *
   * return Array 最小ブロックの配列
   */
  function divideIntoMinimumBlocks() {
    // 最小ブロック候補をbodyから再帰的に探す
    var minimumBlocks = findTmpMinimumBlocksWithDFS(document.body);

    // overflow:hiddenで隠れているブロックをbodyから再帰的に探す
    var hiddenBlocks = findHiddenBlocksWithDFS(document.body);

    // minimumBlocksからhiddenBlocksを除いたものを返す
    var i;
    for (i=0; i<hiddenBlocks.length; i++) {
      var node = hiddenBlocks[i];
      removeHiddenBlock(minimumBlocks, node);
      minimumBlocks.push(node.parentNode);
    }
    return minimumBlocks;
  }

  /**
   * rootNodeから再帰的に探索して最小ブロックの配列を返す
   *
   * param
   *   rootNode: Document Node
   *
   * return Array 最小ブロックの配列
   */
  function findTmpMinimumBlocksWithDFS(rootNode) {

    var minimumBlocks = [];

    function findTmpMinimumBlocksWithDFS_r(node) {
      if (isMinimumBlock(node) === true) {
        return minimumBlocks.push(node);
      }

      var i;
      for (i=0; i<node.children.length; i++) {
        findTmpMinimumBlocksWithDFS_r(node.children[i]);
      }
    }

    findTmpMinimumBlocksWithDFS_r(rootNode);
    return minimumBlocks;

    // var stack = [rootNode],
    //     minimumBlocks = [];
    // while(stack.length > 0) {
    //   var node = stack.pop();
    //   if (isMinimumBlock(node) === true) {
    //     minimumBlocks.push(node);
    //   }
    //   var childNodes = Array.prototype.slice.call(node.childNodes);
    //   stack = stack.concat(childNodes);
    // }
    // return minimumBlocks;
  }

  /**
   * 受け取ったnodeが最小ブロックかどうか判定した結果を返す
   *
   * param
   *   node: Document Node
   *
   * return Boolean nodeが最小ブロックならTrue
   */
  function isMinimumBlock(node) {
    if (isEnableNode(node) !== true) {
      return false;
    }

    if (isBlockElement(node) === true) {
      if (node.children.length === 0) {
        return true;
      }

      var i = 0;
      for (i=0; i<node.children.length; i++) {
        if (isBlockElement(node.children[i])) {
          return false;
        }
      }

      return true;
    } else if(hasMinimumBlockSiblings(node)) {
      return true;
    }

    return false;
  }

  /**
   * 受け取ったnodeが有効ノードかどうか判定した結果を返す
   *
   * param
   *   node: Document Node
   *
   * return Boolean nodeが有効ノードならTrue
   */
  function isEnableNode(node) {
    if (node.tagName.toLowerCase() === 'script') {
      return false;
    }

    var style = getComputedStyle(node);
    if (style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.opacity === '0') {
      return false;
    }

    var bounds = node.getBoundingClientRect();
    if (bounds.width <= 1 && bounds.height <= 1) {
      return false;
    }
    if (bounds.right <= 0 && bounds.bottom <= 0) {
      return false;
    }

    return true;
  }

  /**
   * 受け取ったnodeがブロック要素かどうか判定した結果を返す
   *
   * param
   *   node: Document Node
   *
   * return Boolean nodeがブロック要素ならTrue
   */
  function isBlockElement(node) {
    if (isEnableNode(node) !== true) {
      return false;
    }

    var style = getComputedStyle(node);
    if (style.display === 'block') {
      return true;
    }

    var blockElements = [
      'p', 'blockquote', 'pre', 'div', 'noscript', 'hr', 'address', 'fieldset', 'legend',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'table', 'caption', 'thead', 'tbody', 'colgroup', 'col', 'tr', 'th', 'td', 'embed',
      'section', 'article', 'nav', 'aside', 'header', 'footer', 'address'
    ];
    if (blockElements.indexOf(node.tagName.toLowerCase()) !== -1) {
      return true;
    }

    return false;
  }

  /**
   * 受け取ったnodeの兄弟ノードに最小ブロックがあるか判定して返す
   *
   * param
   *   node: Document Node
   *
   * return Boolean nodeが最小ブロックの兄弟ノードを持っていたらTrue
   */
  function hasMinimumBlockSiblings(node) {
    var i, siblings = node.parentNode.children;
    for (i=0; i<siblings.length; i++) {
      var sibling = siblings[i];
      if (node !== sibling && isBlockElement(node)) {
        if (sibling.children.length === 0) {
          return true;
        }

        var minBlockFlg = true;
        var j;
        for (j=0; j<sibling.children.length; j++) {
          var child = sibling.children[j];
          if (isBlockElement(child)) {
            minBlockFlg = false;
          }
          if (minBlockFlg === true) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * rootNodeから再帰的に探索して隠れているブロックの配列を返す
   *
   * param
   *   rootNode: Document Node
   *
   * return Array 隠れているブロックの配列
   */
  function findHiddenBlocksWithDFS(rootNode) {
    var hiddenBlocks = [];

    function findHiddenBlocksWithDFS_r(node) {
      if (isMinimumBlock(node) === true) {
        return null
      }

      var i;
      var style = getComputedStyle(node);
      if (style.overflow === 'hidden') {
        var parentBounds = node.getBoundingClientRect();
        var top = parentBounds.top,
        left = parentBounds.left,
        right = parentBounds.right,
        bottom = parentBounds.bottom;

        for (i=0; i<node.children.length; i++) {
          var child = node.children[i];
          var childBounds = child.getBoundingClientRect();
          if (childBounds.right > right ||
              childBounds.bottom > bottom ||
              childBounds.left < left ||
              childBounds.top < top) {
            hiddenBlocks.push(child);
          }
        }
      }

      for (i=0; i<node.children.length; i++) {
        findHiddenBlocksWithDFS_r(node.children[i]);
      }
    }

    findHiddenBlocksWithDFS_r(rootNode);

    return hiddenBlocks;
  }

  /**
   * minimumBlocksから隠れノードを削除する
   *
   * param
   *   node: Document Node
   *
   * return Array nodeを削除したminimumBlocks
   */
  function removeHiddenBlock(blocks, hNode) {
    if (hNode.children.length === 0) {
      return null;
    }

    blocks = blocks.filter(function(b) {
      return b !== hNode
    });

    var i;
    for (i=0; i<hNode.children.length; i++) {
      removeHiddenBlock(blocks, hNode.children[i]);
    }
  }

  /**
   * 受け取ったノードのレイアウト情報を返す
   *
   * return Object ノード（最小ブロック）のレイアウト情報
   */
  function getLayoutData(node) {
    var style = getComputedStyle(node),
    color = style.color.split(','),
    bounds = node.getBoundingClientRect();

    var tagName = node.tagName.toLowerCase(),
    fontSize = style.fontSize,
    text = node.innerHTML.replace(/<[^>]*?>/g, ''),
    width = bounds.width,
    height = bounds.height;

    return {
      color: {
        r: color[0].replace(/\D/g, ''),
        g: color[1].replace(/\D/g, ''),
        b: color[2].replace(/\D/g, '')
      },
      width: bounds.width,
      height: bounds.height,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      innerHTML: text,
      tagName: tagName,
      top: bounds.top,
      left: bounds.left
    };
  }

  //NOTE: gather.jsに返したい値を変えるときはここをいじる
  var data = {
    title: getTitle(),
    body: getBodyLayoutData(),
    nodes: getNodesLayoutData()
  };

  return {
    run: function() {
      return data;
    },
    debug: function() {
      var head = document.getElementsByTagName('head')[0],
      body = document.getElementsByTagName('body')[0];

      var i;
      for (i=head.children.length-1; i>=0; i--) {
        head.removeChild(head.children[i]);
      }
      for (i=body.children.length-1; i>=0; i--) {
        body.removeChild(body.children[i]);
      }

      // bodyのレイアウトデータを反映
      var style = '';
      style += 'width:' + data.body.width + 'px;';
      style += 'height:' + data.body.height + 'px;';
      style += 'list-style:none;';
      style += 'color:rgb(' + data.body.red + ',' + data.body.green + ',' + data.body.blue + ');';
      style += 'font-size:' + data.body.fontSize + 'px;';
      style += 'font-weight:' + data.body.fontWeight + ';';
      body.setAttribute('style', style);

      // bodyに子要素を追加
      for (i=0; i<data.nodes.length; i++) {
        var n = data.nodes[i];
        var element = document.createElement('div');
        var style = '';
        style += 'position:absolute;';
        style += 'top:' + n.top + 'px;';
        style += 'left:' + n.left + 'px;';
        style += 'width:' + n.width + 'px;';
        style += 'height:' + n.height + 'px;';
        style += 'color:rgb(' + n.color.red + ',' + n.color.green + ',' + n.color.blue + ');';
        style += 'font-size:' + n.fontSize + 'px;';
        style += 'font-weight:' + n.fontWeight + ';';
        style += 'border:1px solid black;';

        element.setAttribute('style', style);
        body.appendChild(element);
      }
    }
  };
})(window);
