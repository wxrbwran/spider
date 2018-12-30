const { crawlerInstance, downloadInstance } = require('../crawlerInstance');
const { createDir } = require('../../util/createDir');
const { base, type, total, start } = require('../../config/dagaier');

const dagaier = base + type;

function getPageList(page) {
  return crawlerInstance({
    url: page,
  }, async ($) => {
    const lists = [];
    $('.tr3.t_one.tac .tal h3 a').each(function () {
      const href = $(this).attr('href');
      if (href.startsWith('htm_')) {
        lists.push({ url: href });
      }
    });
    for (const { url } of lists) {
      await getPageInfo(url);
    }
  })
}
function getPageInfo(page) {
  return crawlerInstance({
    url: base + page,
  }, async ($) => {
    const title =$('title').text().split(' - ')[0];
    const { dir } = await createDir({ type: 'dagaier', name: title });
    const lists = [];
    const type1 = $('table .tr3 td input');
    const type2 = $('.tpc_content.do_not_catch input');
    const imgs = type1.length > 0 ? type1 : type2;
    imgs.each(function () {
      const src = $(this).attr('data-src');
      const fileName = src.split('/').slice(-1)[0];
      lists.push({ url: src, fileName });
    });
    if (lists.length > 0) {
      console.log('爬图中 ====>>>>>', title);
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
    await getPageList(dagaier + i);
  }
  console.log('爬取结束.');
})();

