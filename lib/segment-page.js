var SMScraper = (function(w) {

  /**
   * ページタイトルを取得する
   *
   * return String ページタイトル
   */
  function getTitle() {
    return document.title;
  }

  //NOTE: gather.jsに返したい値を変えるときはここをいじる
  var data = {
    title: getTitle(),
    body: {},
    nodes: []
  };

  return {
    run: function() {
      return data;
    }
  };
})(window);
