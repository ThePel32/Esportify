require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');
const verifyToken = require("./app/middleware/auth.js");

const usersRouter = require("./app/routes/users.routes");
const gameRouter = require("./app/routes/game.routes");
const eventsRouter = require("./app/routes/events.routes");
const contactRouter = require("./app/routes/contact.routes.js");
const scoreRouter = require("./app/routes/scores.routes.js");
const favoritesRoutes = require('./app/routes/favorites.routes.js');
const chatRoutes = require('./app/routes/chat.routes.js');
const Chat = require('./app/service/chat.service');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "http://localhost:4200",
  methods: ['POST', 'PUT', 'DELETE', 'GET', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  next();
});

app.use('/api/users', usersRouter);
app.use('/api/game', gameRouter);
app.use('/api/scores', scoreRouter);
app.use('/api/favorites', verifyToken, favoritesRoutes);
app.use('/api/event-bans', require('./app/routes/eventBan.routes'));
app.use('/api/message', contactRouter);

app.use('/api/events', verifyToken, eventsRouter);

app.use('/api/chat', verifyToken, chatRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur Esportify." });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
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
      if (err) {
        console.error('Erreur lors de la sauvegarde du message:', err);
        return;
      }

      io.emit('receiveMessage', {
        user: messageData.username,
        content: messageData.content,
        send_at: new Date()
      });
    });
  });

  socket.on('disconnect', () => {
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Serveur Express + Socket.io lancé sur http://localhost:${PORT}`);
});

const sql = require("./app/config/db.js");
sql.query("SELECT * FROM events WHERE state = ?", ["pending"], (err, res) => {
  if (err) console.error("Erreur SQL directe dans Node.js :", err);
});