require('dotenv').config();
require('./app/config/mongo');

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const verifyToken = require('./app/middleware/auth.js');

const usersRouter = require('./app/routes/users.routes');
const gameRouter = require('./app/routes/game.routes');
const eventsRouter = require('./app/routes/events.routes');
const contactRouter = require('./app/routes/contact.routes.js');
const scoreRouter = require('./app/routes/scores.routes.js');
const favoritesRoutes = require('./app/routes/favorites.routes.js');
const chatRoutes = require('./app/routes/chat.routes.js');
const Chat = require('./app/service/chat.service');

const mongoose = require('mongoose');
const mysql = require('mysql2/promise');

const app = express();
app.set('trust proxy', 1);

const httpServer = http.createServer(app);

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:4200')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

if (process.env.NODE_ENV !== 'production') {
  app.get('/api/db-check', async (req, res) => {
    const mongoOk = mongoose.connection.readyState === 1;
    let mysqlOk = false;
    let mysqlError = null;

    try {
      const conn = await mysql.createConnection(
        process.env.JAWSDB_URL || {
          host: process.env.MYSQLHOST,
          port: process.env.MYSQLPORT,
          user: process.env.MYSQLUSER,
          password: process.env.MYSQLPASSWORD,
          database: process.env.MYSQLDATABASE,
        }
      );
      await conn.query('SELECT 1');
      await conn.end();
      mysqlOk = true;
    } catch (e) {
      mysqlError = e.message;
    }

    res.json({
      ok: mongoOk && mysqlOk,
      mongoOk,
      mysqlOk,
      env: process.env.NODE_ENV || 'development',
      mysqlError
    });
  });
}

const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS (socket.io)'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  }
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'dev' }));

app.use('/api/users', usersRouter);
app.use('/api/game', gameRouter);
app.use('/api/scores', scoreRouter);
app.use('/api/favorites', verifyToken, favoritesRoutes);
app.use('/api/event-bans', require('./app/routes/eventBan.routes'));
app.use('/api/message', contactRouter);
app.use('/api/events', eventsRouter);
app.use('/api/chat', verifyToken, chatRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur Esportify.' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

io.on('connection', (socket) => {
  socket.on('chatMessage', (data) => {
    const messageData = {
      event_id: data.event_id,
      user_id: data.user_id,
      username: data.user,
      content: data.content,
    };

    Chat.createMessage(messageData, (err) => {
      if (err) return;
      io.emit('receiveMessage', {
        user: messageData.username,
        content: messageData.content,
        send_at: new Date()
      });
    });
  });

  socket.on('disconnect', () => {});
});

const PORT = Number(process.env.PORT || 3000);
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur Express + Socket.io lancé sur :${PORT}`);
  console.log(`CORS origins: ${allowedOrigins.join(', ')}`);
});
