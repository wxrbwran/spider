const fs = require('fs');
const path = require('path');

const writeFileAsync = (opt) => {
  const file = path.resolve(`./data/novel/${opt.name}/${opt.filename}.md`);
  return new Promise((resolve, reject) => {
    fs.writeFile(
      file,
      opt.content,
      { flag: 'w' },
      function(err) {
        if (err) {
          reject(new Error(err));
        }
        resolve('write success.');
    });
  })
};

module.exports = { writeFileAsync };

