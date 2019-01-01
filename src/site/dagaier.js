const { crawlerInstance, downloadInstance } = require('../crawlerInstance');
const { createDir } = require('../../util/createDir');
const { base, type, total, start } = require('../../config/dagaier');

const dagaier = base + type;

function getPageList(page, current) {
  return crawlerInstance({
    url: page,
    rateLimit: 5500,
    proxy:"http://127.0.0.1:1087"
  }, async ($) => {
    const lists = [];
    $('.tr3.t_one.tac .tal h3 a').each(function () {
      const href = $(this).attr('href');
      const title = $(this).text();
      if (href.startsWith('htm_')) {
        lists.push({ url: href, title });
      }
    });
    for (let { url, title } of lists) {
      title = title.replace(/\//g, '-');
      const { dir, isExist } = await createDir({ type: 'dagaier', name: title });
      if (!isExist) {
        await getPageInfo(dir, url, current);
      }  else {
        console.log('目录存在，跳过', title);
      }
    }
  })
}
function getPageInfo(dir, page, current) {
  return crawlerInstance({
    url: base + page,
    rateLimit: 15500,
    proxy:"http://127.0.0.1:1087",
  }, async ($) => {
    const title =$('title').text().split(' - ')[0];
    const lists = [];
    const type1 = $('table .tr3 td input');
    const type2 = $('.tpc_content.do_not_catch input');
    const imgs = type1.length > 0 ? type1 : type2;
    imgs.each(function () {
      const src = $(this).attr('data-src') || $(this).attr('src');
      const fileName = src.split('/').slice(-1)[0];
      lists.push({ url: src, fileName });
    });
    if (lists.length > 0) {
      console.log('爬图中 ====>>>>> 页码：', current);
      console.log('爬图中 ====>>>>> 标题：', title);
      await downloadImages(dir, lists);
    }
  });
}

function downloadImages(dir, lists) {
  return downloadInstance({
    dir,
    type: 'multi',
    urls: lists,
  });
}

(async () => {
  for (let i = start; i < total; i++) {
    console.log('爬取页码.==========',  i);
    await getPageList(dagaier + i, i);
  }
  console.log('爬取结束.');
})();

