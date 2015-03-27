/*
 * 読み込んだURL一覧全てのタイトルを取得して出力するスクリプト
 */
var casper = require('casper').create({
  verbose: true,
  logLebel: 'warning',
  viewportSize: {
    width: 2560,
    height: 1600
  }
});

casper.start();
urls = require('target.json');

casper.each(urls, function(casper, url, i) {
  return this.thenOpen(url, function() {
    return this.echo(this.getTitle());
  });
});

casper.run();
