import puppeteer from 'puppeteer';
import fs, { read } from 'fs';

const slot = '{{clz}}';     // 插槽，用于替换
const templateStr = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>二次元</title>
  <style>
    img {
        width: 100%;
    }
  </style>
</head>
<body>
  <div class="container">
    ${slot}
  </div>
</body>
</html>
`;

const imgUrlPrefix = 'https://raw.githubusercontent.com/13535944743/action_practise/build';

let imgSource = '';
if (new Date().getDay() % 2 === 0) {
    imgSource = 'https://konachan.net/post.json';
} else {
    imgSource = 'https://yande.re/post.json'
}

(async () => {
    const browser = await puppeteer.launch();
    const page = (await browser.pages())[0];

    await page.goto(`${imgSource}/?tags=order%3Arandom`);

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
            const filename = +new Date() + img.url.slice(img.url.lastIndexOf('.'));

            imgDomStr += `<img src="${imgUrlPrefix}/${filename}" alt="${img.tags}" title="${img.tags}"></img>`;
            await page.evaluate(async (imgUrl, filename) => {
                const res = await fetch(imgUrl, {
                    method: 'get',
                });

                const blob = await res.blob();

                const arrayBuffer = await blob.arrayBuffer();
                const data = new Uint8Array(arrayBuffer);
                window.saveFile(data, data.length, filename);
            }, img.url, filename);
        }

        const htmlStr = templateStr.replace(slot, imgDomStr);
        fs.writeFileSync('./result.html', htmlStr);

        resolve('ok');
    })

    await browser.close();
})();