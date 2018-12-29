const rp = require("request-promise");
const fs = require("fs");

const downloadImage = async (dir, img) => {
  await rp({
    url: img,
    resolveWithFullResponse: true,
  }).pipe(fs.createWriteStream(`${dir}/cover.jpg`));//下载
  console.log(`cover下载成功`);
}

module.exports = {
  downloadImage
};
