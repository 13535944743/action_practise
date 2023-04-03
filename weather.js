const fs = require('fs');

const CITY = '';  // Shenzhen

const result = `

<!DOCTYPE html>
<html lang="en">
<head>
  <title>天气</title>
  <style>
    .container {
      width: 100%;
      /* height: 100%; */
      background-color: #000;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://wttr.in/${CITY}.png" alt="${CITY}天气">
  </div>
</body>
</html>
`

fs.writeFile('./result.html', result, (err) => {
  if (err) {
    throw new Error(err);
  }
})