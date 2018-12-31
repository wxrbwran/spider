const Crawler = require('Crawler');
const fs = require('fs');

const crawlerInstance = (opt, callback) => {
  const defaultOptions = {
    type: 'single',
    rateLimit: 3000,
    retryTimeout: 2000,
    forceUTF8: true,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
  };
  const option = Object.assign({}, defaultOptions, opt);
  return new Promise((resolve, reject) => {
    const novel_crawler = new Crawler({
      ...option,
      preRequest(params, done) {
        console.log(`正在爬取${params.uri}`);
        done();
      },
      callback(err, res, done){
        if (err) {
          console.log(err);
          reject(new Error(err));
        } else {
          if (option.type === 'multi' && !res.options.flag) {
            callback(res.$)
          } else {
            resolve(callback(res.$));
          }
        }
        done();
      }
    });
    if (option.type === 'single') {
      novel_crawler.queue({ uri: opt.url });
    } else if (option.type === 'multi') {
      const l = option.urls.length;
      for (let i = 0; i < l; i++) {
        novel_crawler.queue({ uri: option.urls[i].url, flag: i === l - 1 });
      }
    }
  })
}

const downloadInstance = (opt) => {
  // console.log(opt);
  const defaultOptions = {
    type: 'single',
    encoding:null,
    jQuery:false,// set false to suppress warning message.
    rateLimit: 200,
    retryTimeout: 2000,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
  };
  const option = Object.assign({}, defaultOptions, opt);
  return new Promise((resolve, reject) => {
    const download_crawler = new Crawler({
      ...option,
      callback: async (err, res, done) => {
        if (err) {
          console.log(err);
          reject(new Error(err));
        } else {
          // console.log(res.body);
          if (option.type === 'multi' && !res.options.flag) {
            console.log('写入文件=====>>>>>', res.options.fileName);
            await fs.createWriteStream(`${option.dir}/${res.options.fileName}`)
              .write(res.body);
          } else {
            console.log('写入文件=====>>>>>', res.options.fileName);
            await fs.createWriteStream(`${option.dir}/${res.options.fileName}`)
              .write(res.body);
            resolve();
          }
        }
        done();
      }
    });
    if (option.type === 'single') {
      console.log('option.url', option.url);
      download_crawler.queue({
        uri: option.url,
        fileName: option.fileName,
      });
    } else if (option.type === 'multi') {
      const l = option.urls.length;
      for (let i = 0; i < l; i++) {
        const uri = option.urls[i].url;
        const params = {
          uri,
          fileName: uri.split('/').slice(-1)[0],
          flag: i === l - 1,
        };
        download_crawler.queue(params);
      }
    }
  })
}

module.exports = { crawlerInstance, downloadInstance };