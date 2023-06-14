import express from 'express';
import { createServer } from 'http';
import { SyncSound } from './services';
const path = require('path');

// Server Config
const port: number = 3000;
const app = express();
const httpServer = createServer(app);

// Services Init
const syncSound = new SyncSound({ httpServer, port });
syncSound.initialize();

// Express Config
const outputDir = path.join(__dirname, '../../client/dist');
app.use(express.static(outputDir));

// Express Routes
app.get('/', (req, res) => {
  console.log('from get /', req.query);
  res.sendFile(path.join(outputDir, 'index.html'));
});

// Server Init
httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
