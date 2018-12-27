const Crawler = require('Crawler');
const { sleep } = require('./sleep');

const crawlerInstance = (opt, callback) => {
  return new Promise((resolve, reject) => {
    console.log(`正在爬取${opt.url}`);
    const novel_crawler = new Crawler({
      rateLimit: 5000,
      forceUTF8: true,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
      callback(err, res, done){
        if (err) {
          console.log(err);
          reject(new Error(err));
        } else {
          resolve(callback(res.$));
        }
        done();
      }
    });
    novel_crawler.queue(opt.url);
  })
}

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
      .replace(/;|%uA0|＊|/g,''));
    return { title: list.text, content, };
  });
}

(async () => {
  const novelPage = 'https://www.biquku.com/7/7420/';
  const maxCount = 2;
  const novelInfo = await getNovelPageList(novelPage);
  const length = novelInfo.lists.length;
  const count = maxCount > length ? length : maxCount;
  for (let i = 0; i < count; i++) {
    const { title, content } = await getNovelPageDetail(novelInfo.lists[i]);
    console.log(title, content);
    await sleep(800);
  }
})();

