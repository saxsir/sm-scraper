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
    return [];
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
    var stack = [],
        minimumBlocks = [];
    while(stack.length > 0) {
      var node = stack.pop();
      if (isMinimumBlock(node) === true) {
        minimumBlocks.push(node);
      }
      stack.concat(node.childNodes);
    }
    return [];
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
    return true;
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
    return [];
  }

  /**
   * 受け取ったノードのレイアウト情報を返す
   *
   * return Object ノード（最小ブロック）のレイアウト情報
   */
  function getLayoutData() {
    return {};
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
    }
  };
})(window);
