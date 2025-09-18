Esportify — Déploiement local

Application full-stack : Angular (frontend) + Node/Express (backend)
Données : MySQL (comptes, événements, favoris, bans…) + MongoDB (chat)

1) Prérequis

Node.js 18+ (recommandé : 18 LTS)

npm 10+

MySQL 8 (ou Docker)

MongoDB 6+ (ou Docker)

(optionnel) Angular CLI : npm i -g @angular/cli

2) Démarrer les bases de données
Option A — via Docker (recommandé)

À la racine du repo, créez docker-compose.yml :

version: "3.9"
services:
  mysql:
    image: mysql:8
    container_name: esportify-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: esportify
      TZ: UTC
    ports:
      - "3306:3306"
    command: --default-authentication-plugin=mysql_native_password

  mongo:
    image: mongo:6
    container_name: esportify-mongo
    ports:
      - "27017:27017"


Lancez :

docker compose up -d


MySQL : localhost:3306 (root/root), DB esportify

MongoDB : mongodb://localhost:27017

Option B — installations locales

Installez MySQL et créez une base esportify

Assurez-vous d’avoir MongoDB en écoute sur mongodb://localhost:27017

3) Backend (API)
cd esportify-backend
npm ci


Créez un fichier .env dans esportify-backend/ :

# Réseau API
PORT=3000
CORS_ORIGINS=http://localhost:4200

# JWT
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d

# MySQL (adapter si besoin)
DISABLE_SQL=false
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=esportify
MYSQL_POOL_LIMIT=10
MYSQL_CONNECT_TIMEOUT=10000

# OU, si vous avez une URL JawsDB (Heroku)
# JAWSDB_URL=mysql://user:pass@host:3306/dbname

# MongoDB
MONGO_URI=mongodb://localhost:27017/esportify


(Dev) Vérification rapide des connexions : GET http://localhost:3000/api/db-check

Tables minimales (MySQL)

Si vos tables ne sont pas créées, exécutez ceci sur la DB esportify :

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL,
  email VARCHAR(128) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','organizer','user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS favorites (
  user_id INT NOT NULL,
  game_key VARCHAR(64) NOT NULL,
  PRIMARY KEY(user_id, game_key),
  CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(128) NOT NULL,
  state ENUM('pending','validated','archived') DEFAULT 'validated',
  images VARCHAR(255) NULL,
  organizer_id INT NULL,
  start_time_effective DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL
);


Lancez l’API :

npm start
# -> http://localhost:3000
# Endpoints utiles: /api/health, /api/users/login, /api/users/signup, /api/users/profile

4) Frontend (Angular)
cd ../esportify-frontend
npm ci


Vérifiez src/environments/environment.ts (dev) :

export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api',
  apiUrl:     'http://localhost:3000/api'
};


Démarrez :

npm start       # (alias de ng serve)
# -> http://localhost:4200

5) Premier test

Ouvrez http://localhost:4200

Créez un compte via S’inscrire

Connectez-vous → un token JWT est stocké en local et le profil est chargé

Accédez à Événements / Mon espace (favoris, infos, etc.)

6) Dépannage express

CORS : ajoutez l’origine dans .env → CORS_ORIGINS=http://localhost:4200

Login OK mais UI vide :

Nettoyez le stockage : localStorage.clear() dans la console du navigateur

Rechargez puis reconnectez-vous

MySQL refuse la connexion : vérifiez hôte/port/user/pass/DB dans .env

Ports occupés : changez PORT (backend) ou utilisez --port pour Angular

7) Scripts utiles
# Backend
cd esportify-backend
npm start

# Frontend
cd esportify-frontend
npm start

# Docker (DBs)
docker compose up -d
docker compose down

8) Arborescence
.
├─ esportify-backend/
│  ├─ app/ (controllers, routes, middleware, config)
│  ├─ server.js
│  └─ .env
└─ esportify-frontend/
   └─ src/ (app, services, interceptors, environments)