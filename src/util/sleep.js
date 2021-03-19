const sleep = (time) => new Promise(resolve => {
  console.log(`等待${time}毫秒`);
  setTimeout(resolve, time);
});

module.exports = { sleep };