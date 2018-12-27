const Crawler = require('Crawler');

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

module.exports = crawlerInstance;