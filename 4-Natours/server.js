const app = require('./app');

const port = 3000;

//SERVER START
app.listen(3000, () => {
  console.log(`App running on port ${port}`);
});
