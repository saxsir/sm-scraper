var SMScraper = (function(dom) {

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
    title: getTitle()
  };

  return {
    run: function() {
      return data;
    }
  };
})(document);
