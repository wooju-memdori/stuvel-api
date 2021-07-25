const app = require('../app')
const http = require('http');
const port = 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
    console.log(port, '번 포트에서 대기중')
});