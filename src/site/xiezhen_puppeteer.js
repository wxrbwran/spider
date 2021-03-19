const puppeteer = require('puppeteer');
const { crawlerInstance, downloadInstance } = require('../crawlerInstance');
const { createDir } = require('../util/createDir');
const { base, category, total } = require('../config/xiezhen');
const { userAgent } = require('../config');
const { sleep } = require('../util/sleep');

let browser;
var reg = /location.href='(content_\d+.html)';/

function getPageList(page) {
  return crawlerInstance({
    url: page,
    userAgent: userAgent(),
  }, async ($) => {
    const lists = [];
    let title = null;
    $('#tiles li').each(function () {
      const href = reg.exec($(this).attr('onclick'))[1];
      console.log('href', href)
      title = $(this).find('a').text();
      console.log('title', title)
      lists.push({ url: base + href, title });
    });
    for (const { url, title } of lists) {
      const { dir, isExist } = await createDir({ type: 'xiezhen', name: title });
      if (!isExist) {
        await getPageInfo(dir, url);
      } else {
        console.log('目录存在，跳过==========', title);
      }
    }
  })
}

async function getPageInfo(dir, url) {
  const page = await browser.newPage();//打开一个空白页
  await page.goto(url);
  await page.waitForSelector('.artical-content .showimg');//等待页面加载出来，等同于window.onload
  await page.mainFrame()
    .addScriptTag({
      url: 'https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js'
    })
  await page.waitFor(2000)
  const result = await page.evaluate(() => {
    const lists = [];
    let index = 1;
    $('.artical-content .showimg').each(function () {
      const src = $(this).attr('src');
      const ext = src.split('.').reverse()[0];
      lists.push({ url: src, fileName: `${index}.${ext}` });
      index++;
    });
    
   
    return lists
  })
  // console.log('result', result);
  if (result.length > 0) {
    await downloadImages(dir, result);
  }
  await page.close()

}

function downloadImages(dir, lists) {
  return downloadInstance({
    dir,
    type: 'multi',
    urls: lists,
    userAgent: userAgent(),
  });
}

process.on('unhandledRejection', error => {
  console.error('unhandledRejection', error);
  main();
});


async function main() {
  browser = await puppeteer.launch({headless: true});//打开浏览器
  for (let i = 60; i <= 270; i++) {
    console.log(`爬取第${i}页.`);
    const page = `https://xn--qbt00o3ns2fk.xyz/index_${i}.html`;
    await getPageList(page);
    await sleep(Math.random() * 5)
  }
  console.log('爬取结束.');

  
  await browser.close();
};

main();

