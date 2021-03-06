const { crawlerInstance, downloadInstance } = require('../crawlerInstance');
const { createDir } = require('../../util/createDir');
const { base, category, total } = require('../../config/24fa');
const { userAgent } = require('../../config');

function getPageList(page, current) {
  return crawlerInstance({
    url: page,
    userAgent: userAgent(),
  }, async ($) => {
    const lists = [];
    let title = null;
    $('#dlNews td').each(function () {
      const href = $(this).find('a').attr('href')
        .split('../MeiNv/')[1];
      title = $(this).find('img').attr('alt');
      lists.push({ url: base + category + href, title });
    });
    for (const { url, title } of lists) {
      const { dir, isExist } = await createDir({ type: '24fa', name: title });
      if (!isExist) {
        await getPageInfo(dir, url, current);
      } else {
        console.log('目录存在，跳过==========', title);
      }
    }
  })
}
function getPageInfo(dir, url, page, current = 1) {
  return crawlerInstance({
    url: current === 1 ? url :
      url.split('.html')[0] + 'p' + current + '.html',
    userAgent: userAgent(),
  }, async ($) => {
    const lists = [];
    $('#content img').each(function () {
      const src = $(this).attr('src').split('../..')[1];
      const fileName = src.split('/').slice(-1)[0];
      lists.push({ url: base + src, fileName });
    });
    const pager = $('.pager a');
    if (lists.length > 0) {
      await downloadImages(dir, lists);
    }
    if (pager.length > 0 && lists.length > 0) {
      const texts = [];
      pager.each(function () {
        texts.push($(this).text());
      });
      const pages = texts
        .filter(t => !Number.isNaN(parseInt(t)))
        .map(t => +t);
      const next = current + 1;
      const max = Math.max.apply(null, pages);
      if (next <= max) {
        console.log('爬取页码==========', page);
        await getPageInfo(dir, url, page, next);
      }
    }
  });
}

function downloadImages(dir, lists) {
  return downloadInstance({
    dir,
    type: 'multi',
    urls: lists,
    userAgent: userAgent(),
  });
}

(async () => {
  for (let i = 1; i < total; i++) {
    const page = i === 1 ? base + category :
      base + category + 'indexp' + i + '.html';
    await getPageList(page, i);
  }
  console.log('爬取结束.');
})();

