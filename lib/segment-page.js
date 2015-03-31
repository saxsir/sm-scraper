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
    return {};
  }

  //NOTE: gather.jsに返したい値を変えるときはここをいじる
  var data = {
    title: getTitle(),
    body: getBodyLayoutData(),
    nodes: []
  };

  return {
    run: function() {
      return data;
    }
  };
})(window);
