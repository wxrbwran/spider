const fs = require('fs');
const path = require('path');

const createNovelNameDirIfNotExist = ({ name }) => {
  const dir = path.resolve(`./data/novel/${name}`);
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log('创建目录成功');
      resolve({ dir, isExist: false });
    } else {
      resolve({ dir, isExist: true });
    }
  })
};

module.exports = {
  createNovelNameDir:createNovelNameDirIfNotExist,
};
