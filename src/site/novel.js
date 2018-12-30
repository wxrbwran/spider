const { sleep } = require('../../util/sleep');
const { crawlerInstance, downloadInstance } = require('../crawlerInstance');
const { writeFileAsync } = require('../../util/writeFileAsync');
const { createDir } = require('../../util/createDir');
const { base, novelPage } = require('../../config/novel');

// module.exports = {
//   base: 'https://www.biquku.com',
//   novelPage: '/7/7420/',
// };

function getNovelPageList(page) {
  return crawlerInstance({
    url: page,
  }, ($) => {
    const cover = base + $('#fmimg img').attr('src');
    const name = $('#info h1').text();
    const author = $('#info').find('p').eq(0).text().split('：')[1];
    const updateAt = $('#info').find('p').eq(2).text().split('：')[1];
    const lists = [];
    $('#list dd a').each(function(){
      const url = page + $(this).attr('href');
      const text = $(this).text();
      lists.push({ url, text });
    });
    return { cover, name, author, updateAt, lists };
  })
}

function getNovelPageDetail(name, lists) {
  return crawlerInstance({
    type: 'multi',
    urls: lists,
  }, async ($) => {
    const title = $('.bookname h1').text();
    const content = unescape($('#content').html()
      .replace(/&#x/g,'%u')
      .replace(/;|%uA0/g,''))
      .replace(/＊|\(笔趣库 www.biquku.com\)/g, '');
    await writeFileAsync({ name, filename: title, content });
  });
}

(async () => {
  const maxCount = 2;
  const { name, cover, lists } = await getNovelPageList(base + novelPage);
  const { dir, isExist } = await createDir({ type: 'novel', name });
  if (!isExist) {
    await downloadInstance({ dir, url: cover, fileName: `${name}.jpg` });
  }
  await sleep(100);
  const length = lists.length;
  lists.length = maxCount > length ? length : maxCount;
  await getNovelPageDetail(name, lists);
  console.log('爬取完毕');
})();

