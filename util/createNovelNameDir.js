const fs = require('fs');
const path = require('path');

const createDirIfNotExist = ({ type, name }) => {
  const dir = path.resolve(`./data/${type}/${name}`);
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
  createDir:createDirIfNotExist,
};
