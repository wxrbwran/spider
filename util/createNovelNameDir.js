const fs = require('fs');
const path = require('path');

const createNovelNameDirIfNotExist = (name) => {
  const dir = path.resolve(`./data/novel/${name}`);
  return new Promise((resolve, reject) => {
    fs.stat(dir,function(error,stats) {
      if (error) {
        fs.mkdir(dir,function(error){
          if(error){
            console.log(error);
            reject(new Error(error));
          }
          console.log('创建目录成功');
        })
      }
      resolve();
    });
  })
};

module.exports = {
  createNovelNameDir:createNovelNameDirIfNotExist,
};
