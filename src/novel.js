const { sleep } = require('../util/sleep');
const crawlerInstance = require('./crawlerInstance');

function getNovelPageList(novelPage) {
  return crawlerInstance({url: novelPage}, ($) => {
    const cover = 'https://www.biquku.com' + $('#fmimg img').attr('src');
    const author = $('#info').find('p').eq(0).text().split('：')[1];
    const updateAt = $('#info').find('p').eq(2).text().split('：')[1];
    const lists = [];
    $('#list dd a').each(function(){
      const url = novelPage + $(this).attr('href');
      const text = $(this).text();
      lists.push({ url, text });
    });
    return { cover, author, updateAt, lists };
  })
}

function getNovelPageDetail(list) {
  return crawlerInstance(list, ($) => {
    const content = unescape($('#content').html()
      .replace(/&#x/g,'%u')
      .replace(/;|%uA0|＊|笔趣库 www.biquku.com/g,''));
    return { title: list.text, content, };
  });
}

(async () => {
  const novelPage = 'https://www.biquku.com/7/7420/';
  const maxCount = 2;
  const novelInfo = await getNovelPageList(novelPage);
  await sleep(800);
  const length = novelInfo.lists.length;
  const count = maxCount > length ? length : maxCount;
  for (let i = 0; i < count; i++) {
    const { title, content } = await getNovelPageDetail(novelInfo.lists[i]);
    console.log(title, content);
    await sleep(800);
  }
})();

