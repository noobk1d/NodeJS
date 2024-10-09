const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  'utf-8'
);
// console.log(tempOverview);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
// console.log(tempCard);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
// console.log(data);

const server = http.createServer((req, res) => {
  // const pathName = req.url;
  // console.log(url.parse(req.url,true));
  const { query, pathname } = url.parse(req.url, true);
  console.log(pathname);
  console.log(query);
  //Overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    // console.log(dataObj);
    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    // console.log(cardHtml);
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
    res.end(output);
  }
  //Products Page
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  //Not Found
  else {
    res.end('<h1>Page Not found</h1>');
  }
});
server.listen(8000, '127.0.0.1', () => {
  console.log('listening to port 8000');
});

//3rd Modules us
const slugify = require('slugify');
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
