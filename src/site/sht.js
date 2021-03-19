const puppeteer = require('puppeteer');
const { base } = require('../../config/sht');
var fs= require('fs')

async function getPageList(url, browser) {
  const page = await browser.newPage();//打开一个空白页
  await page.goto(url);
  await page.waitForSelector('table');
  await page.mainFrame()
    .addScriptTag({
      url: 'https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js'
    })
  const result = [
  'https://www.sehuatang.org/thread-481052-1-1.html',
  'https://www.sehuatang.org/thread-481043-1-1.html',
  'https://www.sehuatang.org/thread-481042-1-1.html',
  'https://www.sehuatang.org/thread-481039-1-1.html',
  'https://www.sehuatang.org/thread-481037-1-1.html',
  'https://www.sehuatang.org/thread-481036-1-1.html',
  'https://www.sehuatang.org/thread-481035-1-1.html',
  'https://www.sehuatang.org/thread-481032-1-1.html',
  'https://www.sehuatang.org/thread-481030-1-1.html',
  'https://www.sehuatang.org/thread-481028-1-1.html',
  'https://www.sehuatang.org/thread-481026-1-1.html',
  'https://www.sehuatang.org/thread-481025-1-1.html',
  'https://www.sehuatang.org/thread-481024-1-1.html',
  'https://www.sehuatang.org/thread-481022-1-1.html',
  'https://www.sehuatang.org/thread-481020-1-1.html',
  'https://www.sehuatang.org/thread-481016-1-1.html',
  'https://www.sehuatang.org/thread-481014-1-1.html',
  'https://www.sehuatang.org/thread-481013-1-1.html',
  'https://www.sehuatang.org/thread-480602-1-1.html',
  'https://www.sehuatang.org/thread-480601-1-1.html',
  'https://www.sehuatang.org/thread-480600-1-1.html',
  'https://www.sehuatang.org/thread-480597-1-1.html',
  'https://www.sehuatang.org/thread-480595-1-1.html',
  'https://www.sehuatang.org/thread-480594-1-1.html',
  'https://www.sehuatang.org/thread-480592-1-1.html',
  'https://www.sehuatang.org/thread-480591-1-1.html',
  'https://www.sehuatang.org/thread-480590-1-1.html',
  'https://www.sehuatang.org/thread-480589-1-1.html',
  'https://www.sehuatang.org/thread-480587-1-1.html',
  'https://www.sehuatang.org/thread-480585-1-1.html'
  ]
  //   await page.evaluate(() => {
  //   const lists = [];
  //   $('.s.xst').each(function () {
  //     console.log('$(this)', $(this));
  //     const href = $(this).attr('href');
  //     console.log('href', href);
  //     lists.push('https://www.sehuatang.org/' + href);
  //   });
  //   return lists
  // })
  console.log(result);
  await page.close();
  for (const innerUrl of result) {
    try {
      await getPageInfo(innerUrl, browser)
    } catch (e) {
      continue;
    }
  }

}

async function getPageInfo(url, browser) {
  const page = await browser.newPage();//打开一个空白页
  await page.goto(url);
  await page.waitForSelector('.blockcode');
  const result = await page.evaluate(() => {
    const src = document.querySelector('.blockcode div ol li').innerText;
    return src
  })
  console.log('result2', result);
  fs.writeFileSync(`/Users/wuxiaoran/Downloads/mag.txt`, `${result}\n`, { 'flag': 'a' });
  await page.close();
}


(async () => {
  const browser = await puppeteer.launch({headless: false});//打开浏览器
  for (let i = 1; i < 2; i++) {
    const page = base  + 'forum-2-' + i + '.html';
    await getPageList(page, browser);
  }
  console.log('爬取结束.');
})();

