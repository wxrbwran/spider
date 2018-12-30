const path = require('path');
const { sleep } = require('../../util/sleep');
const { crawlerInstance, downloadInstance } = require('../crawlerInstance');
// const { writeFileAsync } = require('../../util/writeFileAsync');
const { createDir } = require('../../util/createNovelNameDir');

const base = 'https://www.aitaotu.com';

function getPageList(page) {
  return crawlerInstance({
    url: page,
  }, async ($) => {
    const lastLink = $('#pageNum a').eq(6).attr('href');
    const r = /\_(.+?)\./;
    const total = r.exec(lastLink)[1];
    const maxCount = 1;
    const count = maxCount > total ? total : maxCount;
    for (let i = 1; i <= count; i++) {
      await getTaoTuList(page + 'list_' + i + '.html');
    }
    return count;
  })
}
function getTaoTuList(page) {
  console.log(page);
  return crawlerInstance({
    url: page,
  }, async ($) => {
    const lists = [];
    $('#infinite_scroll .item').each(function () {
      const title = $(this).find('.title a').text();
      const link = $(this).find('.title a').attr('href');
      const currentPic = link.split('.html')[0];
      lists.push({ title, currentPic })
    });

    for (const { title, currentPic } of lists) {
      await getTaoTuDetail({ title, currentPic });
    }
  });
}
function getTaoTuDetail({ title, currentPic, page = 1, }) {
  const url = base + currentPic + '_' + parseInt(page) +'.html';
  return crawlerInstance({
    url,
  }, async ($) => {
    const r = /\[(.+?)\]/;
    const pair = r.exec(title);
    let name = null;
    if (!!pair) {
      name = pair[1];
    } else {
      name = title.split(' ')[0];
    }
    const { dir } = await createDir({ type: 'aitaotu', name });
    const pagnation = $('.pages ul li a');
    const length = pagnation.length;
    const href = $(pagnation[length - 1]).attr('href');
    const total = +href.split('.')[0].split('_')[1];
    const imgUrl = $('#big-pic img').attr('src');
    const fileName = imgUrl.split('/').slice(-1);
    await downloadTaoTu(dir, imgUrl, fileName, url);
    const current = parseInt(page) + 1;
    if (current < total) {
      const p = current < 10 ? '0' + current : current;
      // lists.push({ url: imgBase + '/' + p + '.jpg' })
      await getTaoTuDetail({ title, currentPic, page: p });
    }
  });
}

function downloadTaoTu(dir, img, fileName, Referer) {
  return downloadInstance({ url: img, dir, fileName, Referer});
}

(async () => {
  const typeArray = ['guonei', 'rihan', 'gangtai'];
  for (const type of typeArray) {
    const page = `${base}/${type}/`;
    await getPageList(page);
    await sleep(3000);
  }
  console.log('爬取结束.');
})();

