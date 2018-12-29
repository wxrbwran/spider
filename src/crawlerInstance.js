const Crawler = require('Crawler');
const fs = require('fs');

const crawlerInstance = (opt, callback) => {
  const defaultOptions = {
    rateLimit: 5000,
    forceUTF8: true,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
  };
  const option = Object.assign({}, defaultOptions, opt);
  return new Promise((resolve, reject) => {
    console.log(`正在爬取${opt.url}`);
    const novel_crawler = new Crawler({
      ...option,
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
    novel_crawler.queue({
      uri: opt.url,
    });
  })
}

const downloadInstance = (opt) => {
  const defaultOptions = {
    encoding:null,
    jQuery:false,// set false to suppress warning message.
    rateLimit: 5000,
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
          await fs.createWriteStream(`${option.dir}/${option.fileName}`)
            .write(res.body);
          resolve();
        }
        done();
      }
    });
    download_crawler.queue({
      uri: option.url,
      fileName: option.fileName || 'cover.jpg',
    });
  })
}
// var c = new Crawler({
//   encoding:null,
//   jQuery:false,// set false to suppress warning message.
//   callback:function(err, res, done){
//     if(err){
//       console.error(err.stack);
//     }else{
//       fs.createWriteStream(res.options.filename).write(res.body);
//     }
//
//     done();
//   }
// });
//
// c.queue({
//   uri:"https://nodejs.org/static/images/logos/nodejs-1920x1200.png",
//   filename:"nodejs-1920x1200.png"
// });
module.exports = { crawlerInstance, downloadInstance };