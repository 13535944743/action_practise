import puppeteer from 'puppeteer';
import fs, { read } from 'fs';

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = (await browser.pages())[0];

  await page.goto(`https://yande.re/post.json/?tags=order%3Arandom`);

  // const preSelector = await page.waitForSelector('pre');

  // const texts = await preSelector.evaluate(el => el.textContent); // 获取pre DOM的文本

  // const imgs = JSON.parse(texts)                      // 将字符串转换为JSON形式的对象，这里会转成数组。
  //   .filter(item => item.rating === 's')           // 过滤，不需要1_8x的（包括疑似）
  //   .map(item => {                                 // 只需要图片的tags和url信息
  //     return {
  //       tags: item.tags,
  //       url: item.file_url
  //     }
  //   });

  // function toBuffer(ab, byteLength) {
  //   var buf = new Uint8Array(byteLength);
  //   for (var i = 0; i < buf.length; ++i) {
  //     buf[i] = ab[i];
  //   }
  //   return buf;
  // }

  // await page.exposeFunction('saveFile', async (data, byteLength, filename) => {
  //   const buf = toBuffer(data, byteLength);
  //   fs.writeFileSync(`./img/${filename}`, buf);
  // })

  await page.evaluate(async () => {
    debugger;

    console.log(fetch);
    const res = await fetch('https://konachan.net/image/f06e35d658f09b93806f553acab60559/Konachan.com%20-%20355203%20aqua_eyes%20aqua_hair%20blush%20bukurote%20bunny%20dress%20garter%20gray_hair%20hat%20headband%20heart%20hug%20long_hair%20original%20pink_eyes%20shoujo_ai%20skirt%20white%20wristwear.jpg', {
      method: 'get',
    });

    console.log(res);

  });

  // await browser.close();
})();

