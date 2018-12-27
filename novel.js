const Crawler = require('Crawler')

const novelPage = 'https://www.biquku.com/7/7420/';

const sleep = async(time) => new Promise(resolve => setTimeout(resolve, time));

const maxCount = 2;

const crawlerInstance = (opt, callback) => {
  return new Promise((resolve, reject) => {
    console.log(`正在爬取${opt.url}`);
    const novel_crawler = new Crawler({
      rateLimit: 5000,
      forceUTF8: true,
      // incomingEncoding: 'gbk',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
      callback(err, res, done){
        if (err) {
          console.log(err);
          reject(new Error(err));
        } else {
          const $ = res.$;
          resolve(callback($));
        }
        done();
      }
    });
    novel_crawler.queue(opt.url);
  })
}

function getNovelPageList() {
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
    unescape("&#x5927;&#x5927;".replace(/&#x/g,'%u').replace(/;/g,''))
    const content = unescape($('#content').html()
      .replace(/&#x/g,'%u')
      .replace(/;|%uA0|＊|/g,''));
    return { title: list.text, content, };
  });
}
(async () => {
  console.log(1);
  const novelInfo = await getNovelPageList();
  console.log(2);
  const length = novelInfo.lists.length;
  const count = maxCount > length ? length : maxCount;
  for (let i = 0; i < count; i++) {
    console.log(i);
    const { title, content } = await getNovelPageDetail(novelInfo.lists[i]);
    console.log(title, content);
    await sleep(800);
  }
})();

