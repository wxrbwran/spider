const { sleep } = require('../../util/sleep');
const { crawlerInstance, downloadInstance } = require('../crawlerInstance');
const { writeFileAsync } = require('../../util/writeFileAsync');
const { createDir } = require('../../util/createNovelNameDir');
// const { downloadImage } = require('../util/downloadImg');

function getNovelPageList(novelPage) {
  return crawlerInstance({
    url: novelPage,
  }, ($) => {
    const cover = 'https://www.biquku.com' + $('#fmimg img').attr('src');
    const name = $('#info h1').text();
    const author = $('#info').find('p').eq(0).text().split('：')[1];
    const updateAt = $('#info').find('p').eq(2).text().split('：')[1];
    const lists = [];
    $('#list dd a').each(function(){
      const url = novelPage + $(this).attr('href');
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
  const novelPage = 'https://www.biquku.com/7/7420/';
  const maxCount = 2;
  const { name, cover, lists } = await getNovelPageList(novelPage);
  console.log(name, cover);
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

