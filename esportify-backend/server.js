require('dotenv').config();
const express = require("express");
const cors = require("cors");
const verifyToken = require("./app/middleware/auth.js");
const eventsController = require('./app/controllers/events.controller.js');
const eventBanRoutes = require('./app/routes/eventBan.routes');

const usersRouter = require("./app/routes/users.routes");
const gameRouter = require("./app/routes/game.routes");
const shopRouter = require("./app/routes/shop.routes");
const saleRouter = require("./app/routes/sale.routes");
const eventsRouter = require("./app/routes/events.routes");
const contactRouter = require("./app/routes/contact.routes.js");
const scoreRouter = require("./app/routes/scores.routes.js")

const app = express();

const corsOptions = {
  origin: "http://localhost:4200",
  methods: ['POST', 'PUT', 'DELETE', 'GET', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - Auth: ${req.headers.authorization || "No Token"}`);
  next();
});

app.use(eventBanRoutes);

app.use('/api/users', usersRouter);
app.use('/api/game', gameRouter);
app.use('/api/shop', shopRouter);
app.use('/api/sale', saleRouter);
app.use('/api/scores', scoreRouter)

app.use('/api/events', verifyToken, (req, res, next) => {
  console.log(`[${req.method}] ${req.url} - Token validé :`, req.headers.authorization || "No Token");
  next();
}, eventsRouter);

app.use('/api/event-bans', require('./app/routes/eventBan.routes'));


app.get('/api/events/pending', (req, res) => {
  Event.getByState('pending', (err, events) => {
      if (err) {
          return res.status(500).send({ message: err.message || "Erreur lors de la récupération des événements en attente de validation." });
      }
      res.send(events);
  });
});

app.use('/api/message', contactRouter);

app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur Esportify." });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

const PORT = process.env.PORT || 3000;

const sql = require("./app/config/db.js");

sql.query("SELECT * FROM events WHERE state = ?", ["pending"], (err, res) => {
    if (err) {
        console.error("❌ Erreur SQL directe dans Node.js :", err);
        return;
    }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log("Routes API chargées !");
});
