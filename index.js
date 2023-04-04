let myurl = 'https://konachan.net/post.json/?tags=order%3Arandom'

// const fs = require('fs');
// let convert = require('xml-js');
// let xml = fs.readFileSync(filepath,'utf-8');
// let result1 = convert.xml2json(xml, {compact: true, spaces: 4});
// console.log(result1);

fetch(myurl, {
  credentials: 'include',
  mode: 'no-cors'
})
  .then(async (res) => {
    const data = await res.text();
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  })