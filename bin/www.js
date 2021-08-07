const http = require('http');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'production' ? '.env' : '.env.dev',
  ),
});

const app = require('../app');

const port = 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(port, '번 포트에서 대기중');
});
