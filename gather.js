/*
 * 読み込んだURL一覧全てのタイトルを取得して出力するスクリプト
 */

// ログファイルからURLのみを抽出
var fs = require('fs');
//NOTE: Nodeのfsモジュールとは違う同期API
//cf. http://phantomjs.org/api/fs/method/read.html
var lines = fs.read('log/search-result.latest.txt')
    .split('\n');
lines.pop();
urls = lines.splice(3);

var casper = require('casper').create({
  verbose: true,
  logLebel: 'warning',
  viewportSize: {
    width: 2560,
    height: 1600
  }
});
casper.start();

casper.each(urls, function(casper, url, i) {
  return this.thenOpen(url, function() {
    return this.echo(this.getTitle());
  });
});

casper.run();
