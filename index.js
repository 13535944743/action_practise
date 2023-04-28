import fs from 'fs';
import fetch from 'node-fetch';

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

const imgUrlPrefix = 'https://www.clzczh.top/action_practise';
const imgSource = 'https://konachan.net/post.json';     // 图源

(async () => {
  const res = await fetch(`${imgSource}?tags=order%3Arandom`);
  
  const texts = await res.text();

  const imgs = JSON.parse(texts)                      // 将字符串转换为JSON形式的对象，这里会转成数组。
    .filter(item => item.rating === 's' && item.file_url)           // 过滤，不需要1_8x的（包括疑似）
    .map(item => {                                 // 只需要图片的tags和url信息
        return {
            tags: item.tags,
            url: item.file_url
        }
    });
  
  let imgDomStr = '';       // 图片DOM元素字符串（一般都是多个）
  for (const img of imgs) {
    const filename = +new Date() + img.url.slice(img.url.lastIndexOf('.'));
    imgDomStr += `<img src="${imgUrlPrefix}/${filename}" alt="${img.tags}" title="${img.tags}" />`;

    const imgRes = await fetch(img.url);
    
    const writeStream = fs.createWriteStream(`./img/${filename}`);
    imgRes.body.pipe(writeStream);
  }

  const htmlStr = templateStr.replace(slot, imgDomStr);
  fs.writeFileSync('./result.html', htmlStr);
})();
