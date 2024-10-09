// console.log("hello");

//Importing inbuilt modules:

//File System
//Sync
const fs = require('fs');
//  const input = fs.readFileSync("./Textfiles/file1.txt",'utf-8');
//  const data = `The info we get is ${input}`;
//  fs.writeFileSync("./Textfiles/file2.txt",data);

//  const input2 = fs.readFileSync("./Textfiles/file2.txt",'utf-8');
//  console.log(input2);

//Async
//  fs.readFile("./Textfiles/file1.txt",'utf-8',(err, data) => {
//    console.log(data);
//  });
//  console.log("Will read data.");

//Creating Servers
// const http = require('http');
// const server = http.createServer((req, res) => {
//    console.log(req.url);
//    res.end('Server');
// })
// server.listen(8000,'127.0.0.1',()=>{console.log("listening to port 8000")});

//Routing
// const http = require('http');
// const server = http.createServer((req, res) => {
//    const url = req.url
//    if(url === '/' || url === '/demo'){
//    res.end('<h1>Home Page</h1>');
//    }
//    else{
//       res.end('<h1>Page Not found</h1>');
//    }
// })
// server.listen(8000,'127.0.0.1',()=>{console.log("listening to port 8000")});

//API Basic
const http = require('http');
const server = http.createServer((req, res) => {
  const url = req.url;
  if (url === '/' || url === '/demo') {
    res.end('<h1>Home Page</h1>');
  } else if (url === '/products') {
    fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
      const productData = JSON.parse(data);
      console.log(productData);
      res.end('Products');
    });
  } else {
    res.end('<h1>Page Not found</h1>');
  }
});
server.listen(8000, '127.0.0.1', () => {
  console.log('listening to port 8000');
});

//Express
// const express = require('express');

// const app = express();

// const port = 3000;

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     //   .send('Hello from the server side!!');
//     .json({ message: 'Hello from the server side!!' });
// });

// app.listen(3000, () => {
//   console.log(`App running on port ${port}`);
// });
