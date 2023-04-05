import puppeteer from 'puppeteer';
import fs, { read } from 'fs';

const slot = '{{clz}}';     // 插槽，用于替换
const templateStr = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>二次元</title>
  <style>
    // .container {
    //   width: 100%;
    //   /* height: 100%; */
    //   background-color: #000;
    // }
  </style>
</head>
<body>
  <div class="container">
    ${slot}
  </div>
</body>
</html>
`;

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = (await browser.pages())[0];

    await page.goto('https://konachan.net/post.json/?tags=order%3Arandom');

    const preSelector = await page.waitForSelector('pre');

    const texts = await preSelector.evaluate(el => el.textContent); // 获取pre DOM的文本

    const imgs = JSON.parse(texts)                      // 将字符串转换为JSON形式的对象，这里会转成数组。
        .filter(item => item.rating === 's')           // 过滤，不需要1_8x的（包括疑似）
        .map(item => {                                 // 只需要图片的tags和url信息
            return {
                tags: item.tags,
                url: item.file_url
            }
        });

    function toBuffer(ab, byteLength) {
        var buf = new Uint8Array(byteLength);
        for (var i = 0; i < buf.length; ++i) {
            buf[i] = ab[i];
        }
        return buf;
    }

    await page.exposeFunction('saveFile', async (data, byteLength, filename) => {
        const buf = toBuffer(data, byteLength);
        fs.writeFileSync(`./img/${filename}`, buf);
    })

    await new Promise(async (resolve, reject) => {
        let imgDomStr = '';
        for (const img of imgs) {
            imgDomStr += `<img src="${img.url}" alt="${img.tags}" title="${img.tags}"></img>`;
            await page.evaluate(async imgUrl => {
                const res = await fetch(imgUrl, {
                    method: 'get',
                });

                const blob = await res.blob();

                const reader = new FileReader();
                reader.readAsArrayBuffer(blob);
                reader.onload = function (e) {
                    const data = new Uint8Array(reader.result);
                    window.saveFile(data, data.length, imgUrl.slice(imgUrl.lastIndexOf('/') + 1));
                }
                
                // const a = document.createElement('a');
                // a.href = imgUrl;
                // a.download = imgUrl.slice(imgUrl.lastIndexOf('/') + 1);
                // a.click();
            }, img.url);
        }

        resolve('ok');
    })


    // const htmlStr = templateStr.replace(slot, imgDomStr);
    // fs.writeFile('./result.html', htmlStr, (err) => {
    //     if (err) {
    //         throw new Error(err);
    //     }
    // })

    await browser.close();
})();