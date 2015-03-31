/*
 * 実行した時点でのGoogle検索結果を出力するスクリプト
 *
 * Usage
 *   $ node search.js '{query}' > search-result.txt
 *
 */
require('date-utils');
var client = require('cheerio-httpcli');
var query = process.argv[2];

var dt = new Date();
console.log('query: ' + query);
console.log('date: ' + dt.toFormat('YYYY/MM/DD HH24:MI:SS'));
console.log('---');

// 1000件の検索結果を取得する
// TODO: 再帰で書いてランキング通りに出力されるようにする
// TODO: 再帰で書いて最後にまとめてJSONで出力できるようにする
for (var i=0; i<1000; i+=10) {
  client.fetch('http://www.google.com/search', { q: query, start: i }, function (err, $, res) {
      $('h3.r > a').each(function (idx) {
        console.log($(this).attr('href'));
      });
  });
}

// var st = new Date();
// var ft = new Date();
// console.log('time: ' + (ft-st) + ' ms');

// var dt = new Date();
// var data = {
//   query: query,
//   date: dt.toFormat('YYYY/MM/DD HH24:MI:SS'),
//   urls: [],
// };
