const { crawlerInstance, downloadInstance } = require('../crawlerInstance');
const { createDir } = require('../util/createDir');
const { base, category, total } = require('../config/xiezhen');
const { userAgent } = require('../config');
const { sleep } = require('../util/sleep');

var reg = /location.href='(content_\d+.html)';/

function getPageList(page, current) {
  return crawlerInstance({
    url: page,
    userAgent: userAgent(),
  }, async ($) => {
    const lists = [];
    let title = null;
    $('#tiles li').each(function () {

      const href = reg.exec($(this).attr('onclick'))[1];
      console.log('href', href)
        // .split('../MeiNv/')[1];
      title = $(this).find('a').text();
      console.log('title', title)
      
      lists.push({ url: base + href, title });
    });
    for (const { url, title } of lists) {
      const { dir, isExist } = await createDir({ type: 'xiezhen', name: title });
      if (!isExist) {
        await getPageInfo(dir, url, current);
      } else {
        console.log('目录存在，跳过==========', title);
      }
    }
  })
}
function getPageInfo(dir, url, page) {
  return crawlerInstance({
    url: url,
    userAgent: userAgent(),
  }, async ($) => {
    const lists = [];
    const index = 1;
    $('.artical-content .showimg').each(function () {
      const src = $(this).attr('src');
      console.log('this', $(this))
      console.log('src', src)
      const ext = src.split('.').reverse()[0];
      lists.push({ url: src, fileName: `${index}.${ext}` });
      index++;
    });
    console.log('lists', lists);
    if (lists.length > 0) {
      await downloadImages(dir, lists);
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
  for (let i = 1; i <= total; i++) {
    const page = `https://xn--qbt00o3ns2fk.xyz/index_${i}.html`;
    await getPageList(page, i);
    await sleep(Math.random() * 5)
  }
  console.log('爬取结束.');
})();

