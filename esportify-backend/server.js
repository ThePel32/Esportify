const express = require("express");
const cors = require("cors");
const usersRouter = require("./app/routes/users.routes");
const gameRouter = require("./app/routes/game.routes");
const shopRouter = require("./app/routes/shop.routes");
const saleRouter = require("./app/routes/sale.routes");
const verifyToken = require("./app/middleware/auth.js");

const app = express();

const corsOptions = {
  origin: "http://localhost:4200",
  allowedHeaders: '*',
    credentials: true,
    methods: ['POST', 'PUT', 'DELETE', 'GET']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  next();
});

app.use('/api/users', usersRouter);
app.use('/api/game', gameRouter);
app.use('/api/shop', shopRouter);
app.use('/api/sale', saleRouter);

app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur Esportify." });
});

app.use('/api/users/profile', verifyToken);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
