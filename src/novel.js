const { sleep } = require('../util/sleep');
const crawlerInstance = require('./crawlerInstance');
const { writeFileAsync } = require('../util/writeFileAsync');
const { createNovelNameDir } = require('../util/createNovelNameDir');
const { downloadImage } = require('../util/downloadImg');

function getNovelPageList(novelPage) {
  return crawlerInstance({url: novelPage}, ($) => {
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

function getNovelPageDetail(list) {
  return crawlerInstance(list, ($) => {
    const content = unescape($('#content').html()
      .replace(/&#x/g,'%u')
      .replace(/;|%uA0/g,''))
      .replace(/＊|\(笔趣库 www.biquku.com\)/g, '');
    return { title: list.text, content, };
  });
}

(async () => {
  const novelPage = 'https://www.biquku.com/7/7420/';
  const maxCount = 1;
  const { name, cover, lists } = await getNovelPageList(novelPage);
  const { dir, isExist } = await createNovelNameDir({ name, cover });
  if (!isExist) {
    await downloadImage(dir, cover);
  }
  await sleep(100);
  const length = lists.length;
  const count = maxCount > length ? length : maxCount;
  for (let i = 0; i < count; i++) {
    const { title, content } = await getNovelPageDetail(lists[i]);
    console.log(title);
    await writeFileAsync({ name, filename: title, content });
    await sleep(3000);
  }
})();

