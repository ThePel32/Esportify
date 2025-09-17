-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 17 sep. 2025 à 00:25
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `esportify`
--

-- --------------------------------------------------------

--
-- Structure de la table `chat_messages`
--

DROP TABLE IF EXISTS `chat_messages`;
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `event_id`, `user_id`, `username`, `content`, `created_at`) VALUES
(2, 74, 2, 'orga', 'salut!', '2025-04-28 14:12:24'),
(3, 74, 2, 'orga', 'comment ça va?', '2025-04-28 14:12:33'),
(4, 74, 2, 'orga', 'hello!', '2025-04-28 14:16:34'),
(5, 74, 1, 'admin', 'ça va?', '2025-04-28 14:24:16'),
(6, 64, 1, 'admin', 'je teste les messages!', '2025-04-28 14:24:41'),
(7, 7, 2, 'orga', 'les messages marchent ici?', '2025-04-28 14:25:26'),
(8, 7, 1, 'admin', 'ça a l\'air ouais!', '2025-04-28 14:26:05'),
(9, 74, 1, 'admin', 'ça marche encore?', '2025-04-28 14:28:46'),
(10, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:02'),
(11, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:03'),
(12, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:04'),
(13, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:04'),
(14, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:05'),
(15, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:05'),
(16, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:06'),
(17, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:07'),
(18, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:07'),
(19, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:08'),
(20, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:08'),
(21, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:09'),
(22, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:09'),
(23, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:10'),
(24, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:10'),
(25, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:11'),
(26, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:12'),
(27, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:12'),
(28, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:13'),
(29, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:13'),
(30, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:13'),
(31, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:14'),
(32, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:14'),
(33, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:14'),
(34, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:15'),
(35, 74, 1, 'admin', 'je charge ded message', '2025-04-28 14:29:15'),
(36, 74, 1, 'admin', 'c\'est le message qui est tout en bas', '2025-04-28 14:30:10'),
(38, 74, 1, 'admin', 'salut!', '2025-04-28 14:36:06'),
(39, 74, 1, 'admin', 'le scroll marche?', '2025-04-28 14:36:24'),
(40, 74, 1, 'admin', 'et maintenant?', '2025-04-28 14:37:35'),
(41, 74, 1, 'admin', 'c\'est mieux?', '2025-04-28 14:37:52'),
(42, 74, 1, 'admin', 'sdfg', '2025-04-28 14:39:08'),
(43, 74, 1, 'admin', 'test', '2025-04-28 14:44:58'),
(47, 74, 1, 'admin', 'j\'écris n\'importe quoi histoire de voir si le retour à la ligne marche', '2025-04-28 15:18:37'),
(48, 74, 1, 'admin', 'est-ce que le scroll marche toujours?', '2025-04-28 15:39:07'),
(49, 74, 2, 'orga', 'ça marche toujours les messages?', '2025-04-29 08:08:04'),
(50, 74, 2, 'orga', 'yeah!!!', '2025-04-29 08:08:10'),
(51, 75, 1, 'admin', 'caca', '2025-04-29 10:42:50'),
(52, 75, 2, 'orga', 'salut!', '2025-04-29 14:16:59'),
(53, 75, 2, 'orga', 'ça marche en direct c\'est trop cool!', '2025-04-29 14:17:18'),
(54, 76, 1, 'admin', 'test du chat en mobile', '2025-04-30 15:06:18'),
(55, 83, 1, 'admin', 'test chat pour la finale !', '2025-05-01 10:52:35'),
(56, 89, 2, 'orga', 'pourquoi le chat est vide?', '2025-05-01 11:00:35'),
(57, 89, 1, 'admin', 'aaaaah parce que j\'avais pas écris sur le bon chat!', '2025-05-01 11:01:15'),
(58, 89, 5, 'test', 'haha moi je peux pas m\'inscrire c\'est complet', '2025-05-01 11:02:00'),
(59, 90, 1, 'admin', 'est-ce que  orga pourra s\'inscrire? telle est la question!!', '2025-05-01 11:04:52'),
(60, 90, 5, 'test', 'et non!!! il peut pas! ????', '2025-05-01 11:06:14'),
(61, 90, 3, 'user', 'par contre, c\'est chiant qu\'il y ai pas la mention \"complet\" quand la limite des joueurs est atteinte... et que le bouton s\'inscrire est toujours visible dans l\'event-room aussi..', '2025-05-01 11:08:02'),
(62, 90, 3, 'user', '????', '2025-05-01 11:08:39'),
(63, 90, 3, 'user', '????✅❤️❌????✊', '2025-05-01 11:11:04'),
(64, 92, 1, 'admin', 'prout', '2025-05-02 16:17:01'),
(65, 110, 1, 'admin', 'test', '2025-05-05 17:10:54'),
(66, 115, 5, 'test', 'test chat', '2025-09-02 13:48:41');

-- --------------------------------------------------------

--
-- Structure de la table `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE IF NOT EXISTS `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `description` varchar(50) DEFAULT NULL,
  `date_time` datetime NOT NULL,
  `duration` int(11) DEFAULT NULL,
  `max_players` int(11) NOT NULL,
  `images` varchar(255) DEFAULT NULL,
  `organizer_id` int(11) NOT NULL,
  `state` varchar(50) NOT NULL DEFAULT 'pending',
  `started` tinyint(1) DEFAULT NULL,
  `start_time_effective` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_events_date_time` (`date_time`),
  KEY `idx_events_max_players` (`max_players`),
  KEY `idx_events_organizer` (`organizer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `date_time`, `duration`, `max_players`, `images`, `organizer_id`, `state`, `started`, `start_time_effective`, `created_at`, `updated_at`) VALUES
(6, 'Cs2', 'sdfv', '2025-04-25 08:00:00', 24, 3, 'assets/img/CS2.png', 1, 'validated', 1, '2025-04-18 08:00:00', '2025-04-17 13:01:00', '2025-04-25 10:14:38'),
(7, 'balatro', 'sef', '2025-04-18 08:30:00', 24, 4, 'assets/img/Balatro.jpg', 1, 'validated', 1, '2025-04-18 08:30:00', '2025-04-17 13:04:08', '2025-04-18 09:17:09'),
(9, 'fifa', 'rthrht', '2025-04-18 07:00:00', 24, 3, 'assets/img/fifa.png', 1, 'validated', 1, '2025-04-18 07:00:00', '2025-04-17 16:42:01', '2025-04-18 09:17:09'),
(10, 'rocketleague', 'gbcfjh', '2025-04-19 08:30:00', 24, 2, 'assets/img/rocketLeague.png', 1, 'validated', 1, '2025-04-19 08:30:00', '2025-04-18 08:28:10', '2025-04-20 14:20:59'),
(11, 'Cs2', 'dfgbdfhb', '2025-04-19 01:30:00', 24, 3, 'assets/img/CS2.png', 1, 'validated', 1, '2025-04-19 01:30:00', '2025-04-18 09:37:15', '2025-04-20 14:20:59'),
(12, 'cs2', 'Tournoi CS2 terminé', '2024-03-15 14:00:00', 2, 8, 'assets/img/CS2.png', 2, 'validated', 1, '2024-03-15 14:00:00', '2025-04-18 12:55:44', '2025-04-18 15:03:06'),
(13, 'fifa', 'Match FIFA amical', '2024-03-18 15:00:00', 1, 4, 'assets/img/fifa.png', 2, 'validated', 1, '2024-03-18 15:00:00', '2025-04-18 12:55:44', '2025-04-18 15:04:03'),
(14, 'balatro', 'Compétition Balatro', '2024-03-20 18:00:00', 1, 5, 'assets/img/Balatro.jpg', 3, 'validated', 1, '2024-03-20 18:00:00', '2025-04-18 12:55:44', '2025-04-18 15:04:09'),
(15, 'lol', 'Tournoi LoL', '2024-03-25 20:00:00', 3, 10, 'assets/img/LoL.png', 2, 'validated', 1, '2024-03-25 20:00:00', '2025-04-18 12:55:44', '2025-04-18 15:04:15'),
(16, 'pubg', 'Match PUBG test', '2024-03-28 21:00:00', 2, 6, 'assets/img/pubg.jpg', 3, 'validated', 1, '2024-03-28 21:00:00', '2025-04-18 12:55:44', '2025-04-18 15:04:18'),
(17, 'rocketleague', 'Rocket League Showdown', '2024-04-01 22:00:00', 1, 6, 'assets/img/rocketLeague.png', 2, 'validated', 1, '2024-04-01 22:00:00', '2025-04-18 12:55:44', '2025-04-18 15:04:23'),
(18, 'valorant', 'Tournoi Valorant', '2024-04-05 16:00:00', 2, 6, 'assets/img/valorant.png', 3, 'validated', 1, '2024-04-05 16:00:00', '2025-04-18 12:55:44', '2025-04-18 15:04:29'),
(19, 'starcraft2', 'Starcraft Stratégie', '2024-04-07 17:00:00', 2, 4, 'assets/img/starcraft2.png', 3, 'validated', 1, '2024-04-07 17:00:00', '2025-04-18 12:55:44', '2025-04-18 15:04:34'),
(20, 'supermeatboy', 'Super Meat Boy Speedrun', '2024-04-09 19:00:00', 1, 2, 'assets/img/supermeatboy.jpg', 2, 'validated', 1, '2024-04-09 19:00:00', '2025-04-18 12:55:44', '2025-04-18 15:04:38'),
(21, 'cs2', 'CS2 Nocturne', '2024-04-11 20:00:00', 2, 6, 'assets/img/CS2.png', 2, 'validated', 1, '2024-04-11 20:00:00', '2025-04-18 12:55:44', '2025-04-18 15:04:44'),
(22, 'lol', 'LoL Fun Night', '2024-04-13 21:00:00', 3, 8, 'assets/img/LoL.png', 3, 'validated', 1, '2024-04-13 21:00:00', '2025-04-18 12:55:44', '2025-04-18 15:04:47'),
(23, 'fifa', 'Fifa Elite', '2024-04-14 14:00:00', 2, 4, 'assets/img/fifa.png', 2, 'validated', 1, '2024-04-14 14:00:00', '2025-04-18 12:55:44', '2025-04-18 15:04:53'),
(24, 'balatro', 'Balatro Ligue', '2024-04-15 15:00:00', 1, 5, 'assets/img/Balatro.jpg', 3, 'validated', 1, '2024-04-15 15:00:00', '2025-04-18 12:55:44', '2025-04-18 15:05:02'),
(25, 'pubg', 'Battle PUBG', '2024-04-16 16:00:00', 2, 6, 'assets/img/pubg.jpg', 2, 'validated', 1, '2024-04-16 16:00:00', '2025-04-18 12:55:44', '2025-04-18 15:05:04'),
(26, 'valorant', 'Valorant Cup', '2024-04-17 17:00:00', 2, 6, 'assets/img/valorant.png', 3, 'validated', 1, '2024-04-17 17:00:00', '2025-04-18 12:55:44', '2025-04-18 15:05:08'),
(37, 'cs2', 'Événement test automatique', '2025-04-20 15:12:10', 24, 5, 'img/cs2.jpg', 1, 'validated', 1, NULL, '2025-04-20 13:12:10', '2025-04-20 15:12:10'),
(38, 'valorant', 'Événement test automatique', '2025-04-20 16:12:10', 24, 5, 'img/valorant.jpg', 1, 'validated', 1, NULL, '2025-04-20 13:12:10', '2025-04-20 15:12:10'),
(39, 'fifa', 'Événement test automatique', '2025-04-20 17:12:10', 24, 5, 'img/fifa.jpg', 1, 'validated', 1, NULL, '2025-04-20 13:12:10', '2025-04-20 15:12:10'),
(40, 'rocketleague', 'Événement test automatique', '2025-04-20 18:12:10', 24, 5, 'img/rocketleague.jpg', 1, 'validated', 1, NULL, '2025-04-20 13:12:10', '2025-04-20 15:12:10'),
(41, 'lol', 'Événement test automatique', '2025-04-20 19:12:10', 24, 5, 'img/lol.jpg', 1, 'validated', 1, NULL, '2025-04-20 13:12:10', '2025-04-20 15:12:10'),
(42, 'supermeatboy', 'Événement test automatique', '2025-04-20 20:12:10', 24, 5, 'img/supermeatboy.jpg', 1, 'validated', 1, NULL, '2025-04-20 13:12:10', '2025-04-20 15:12:10'),
(43, 'balatro', 'Événement test automatique', '2025-04-20 21:12:10', 24, 5, 'img/balatro.jpg', 1, 'validated', 1, NULL, '2025-04-20 13:12:10', '2025-04-20 15:12:10'),
(44, 'pubg', 'Événement test automatique', '2025-04-20 22:12:10', 24, 5, 'img/pubg.jpg', 1, 'validated', 1, NULL, '2025-04-20 13:12:10', '2025-04-20 15:12:10'),
(45, 'starcraft2', 'Événement test automatique', '2025-04-20 23:12:10', 24, 5, 'img/starcraft2.jpg', 1, 'validated', 1, NULL, '2025-04-20 13:12:10', '2025-04-20 15:12:10'),
(57, 'supermeatboy', 'tournois speedrun', '2025-04-26 14:00:00', 24, 4, 'assets/img/supermeatboy.jpg', 1, 'validated', 1, NULL, '2025-04-26 10:58:29', '2025-04-26 13:35:28'),
(58, 'Cs2', 'test ban', '2025-04-26 14:30:00', 24, 2, 'assets/img/CS2.png', 1, 'validated', 1, '2025-04-26 14:30:00', '2025-04-26 11:15:42', '2025-04-26 15:34:14'),
(59, 'Cs2', 'test container', '2025-04-27 06:30:00', 24, 3, 'assets/img/CS2.png', 1, 'validated', 1, '2025-04-27 06:30:00', '2025-04-26 17:15:41', '2025-04-27 15:52:40'),
(60, 'balatro', 'test container', '2025-04-27 07:00:00', 24, 4, 'assets/img/Balatro.jpg', 1, 'validated', 1, '2025-04-27 07:00:00', '2025-04-26 17:15:56', '2025-04-27 15:52:40'),
(61, 'fifa', 'test container', '2025-04-27 05:30:00', 24, 10, 'assets/img/fifa.png', 1, 'validated', 1, '2025-04-27 05:30:00', '2025-04-26 17:16:11', '2025-04-27 15:52:40'),
(62, 'lol', 'test container', '2025-04-27 08:00:00', 24, 4, 'assets/img/LoL.png', 1, 'validated', 1, '2025-04-27 08:00:00', '2025-04-26 17:16:25', '2025-04-27 15:52:40'),
(63, 'pubg', 'test container', '2025-04-27 08:30:00', 24, 12, 'assets/img/pubg.jpg', 1, 'validated', 1, '2025-04-27 08:30:00', '2025-04-26 17:16:41', '2025-04-27 15:52:40'),
(64, 'Cs2', 'test container', '2025-04-27 23:00:00', 24, 2, 'assets/img/CS2.png', 1, 'validated', 1, '2025-04-27 23:00:00', '2025-04-27 15:54:31', '2025-04-28 09:40:16'),
(65, 'balatro', 'test container', '2025-04-28 00:00:00', 24, 5, 'assets/img/Balatro.jpg', 1, 'validated', 1, '2025-04-28 00:00:00', '2025-04-27 15:54:45', '2025-04-28 09:40:16'),
(66, 'fifa', 'test container', '2025-04-28 00:00:00', 24, 2, 'assets/img/fifa.png', 1, 'validated', 1, '2025-04-28 00:00:00', '2025-04-27 15:55:00', '2025-04-28 09:40:16'),
(67, 'lol', 'test container', '2025-04-28 00:30:00', 24, 2, 'assets/img/LoL.png', 1, 'validated', 1, '2025-04-28 00:30:00', '2025-04-27 15:55:25', '2025-04-28 09:40:16'),
(74, 'balatro', 'test chat', '2025-04-28 12:00:00', 24, 3, 'assets/img/Balatro.jpg', 2, 'validated', 1, '2025-04-28 12:00:00', '2025-04-28 08:48:42', '2025-04-28 14:23:46'),
(75, 'Cs2', 'test container', '2025-04-29 15:00:00', 24, 2, 'assets/img/CS2.png', 2, 'validated', 1, '2025-04-29 15:00:00', '2025-04-29 08:39:42', '2025-04-29 15:16:07'),
(76, 'balatro', 'test container', '2025-04-30 00:30:00', 24, 2, 'assets/img/Balatro.jpg', 2, 'validated', 1, '2025-04-30 00:30:00', '2025-04-29 08:39:54', '2025-04-30 09:24:06'),
(77, 'fifa', 'test container', '2025-04-30 00:30:00', 24, 2, 'assets/img/fifa.png', 2, 'validated', 1, '2025-04-30 00:30:00', '2025-04-29 08:40:05', '2025-04-30 09:24:06'),
(78, 'lol', 'test container', '2025-04-30 01:00:00', 24, 2, 'assets/img/LoL.png', 2, 'validated', 1, '2025-04-30 01:00:00', '2025-04-29 08:40:19', '2025-04-30 09:24:06'),
(79, 'pubg', 'test container', '2025-04-30 01:00:00', 24, 2, 'assets/img/pubg.jpg', 2, 'validated', 1, '2025-04-30 01:00:00', '2025-04-29 08:40:34', '2025-04-30 09:24:06'),
(80, 'pubg', 'test container', '2025-04-30 00:30:00', 24, 2, 'assets/img/pubg.jpg', 2, 'validated', 1, '2025-04-30 00:30:00', '2025-04-29 08:40:49', '2025-04-30 09:24:06'),
(81, 'rocketleague', 'test container', '2025-04-30 02:00:00', 24, 2, 'assets/img/rocketLeague.png', 2, 'validated', 1, '2025-04-30 02:00:00', '2025-04-29 08:41:05', '2025-04-30 09:24:06'),
(82, 'starcraft2', 'test container', '2025-04-30 01:00:00', 24, 2, 'assets/img/starcraft2.png', 2, 'validated', 1, '2025-04-30 01:00:00', '2025-04-29 08:41:17', '2025-04-30 09:24:06'),
(83, 'starcraft2', 'test container', '2025-04-30 22:30:00', 24, 4, 'assets/img/starcraft2.png', 2, 'validated', 1, '2025-04-30 22:30:00', '2025-04-29 08:41:31', '2025-05-01 09:50:03'),
(84, 'supermeatboy', 'test container', '2025-04-30 00:30:00', 24, 3, 'assets/img/supermeatboy.jpg', 2, 'validated', 1, '2025-04-30 00:30:00', '2025-04-29 08:41:44', '2025-04-30 09:24:06'),
(85, 'valorant', 'test container', '2025-04-30 01:30:00', 24, 2, 'assets/img/valorant.png', 2, 'validated', 1, '2025-04-30 01:30:00', '2025-04-29 08:42:00', '2025-04-30 09:24:06'),
(86, 'pubg', ',hjgfkhgj,f', '2025-04-29 12:30:00', 24, 2, 'assets/img/pubg.jpg', 1, 'validated', 1, '2025-04-29 12:30:00', '2025-04-29 09:29:19', '2025-04-29 13:38:58'),
(88, 'Cs2', 'test responsive', '2025-04-30 13:00:00', 24, 2, 'assets/img/CS2.png', 1, 'validated', 1, '2025-04-30 13:00:00', '2025-04-30 09:49:15', '2025-04-30 14:40:51'),
(89, 'Cs2', 'test final', '2025-05-01 12:00:00', 24, 2, 'assets/img/CS2.png', 1, 'validated', 1, NULL, '2025-05-01 08:50:30', '2025-05-01 11:36:27'),
(90, 'balatro', 'test ban', '2025-05-01 12:30:00', 24, 2, 'assets/img/Balatro.jpg', 1, 'validated', 1, NULL, '2025-05-01 09:04:15', '2025-05-01 12:17:32'),
(91, 'supermeatboy', 'test inscription', '2025-05-01 16:00:00', 24, 2, 'assets/img/supermeatboy.jpg', 1, 'validated', 1, '2025-05-01 16:00:00', '2025-05-01 12:32:33', '2025-05-01 17:20:23'),
(92, 'balatro', 'jhgd', '2025-05-01 19:00:00', 24, 2, 'assets/img/Balatro.jpg', 1, 'validated', 1, '2025-05-01 19:00:00', '2025-05-01 15:59:02', '2025-05-02 08:54:38'),
(93, 'Cs2', 'hj,gdf', '2025-05-01 19:00:00', 24, 2, 'assets/img/CS2.png', 1, 'validated', 1, '2025-05-01 19:00:00', '2025-05-01 15:59:57', '2025-05-02 08:54:38'),
(94, 'Cs2', 'test', '2025-05-02 17:00:00', 24, 2, 'assets/img/CS2.png', 1, 'validated', 1, '2025-05-02 17:00:00', '2025-05-02 13:30:00', '2025-05-02 17:22:12'),
(95, 'lol', 'test', '2025-05-03 00:30:00', 24, 2, 'assets/img/LoL.png', 1, 'validated', 1, '2025-05-03 00:30:00', '2025-05-02 13:30:31', '2025-05-03 09:00:21'),
(96, 'starcraft2', 'test', '2025-05-03 04:00:00', 24, 2, 'assets/img/starcraft2.png', 1, 'validated', 1, '2025-05-03 04:00:00', '2025-05-02 13:30:49', '2025-05-03 09:00:21'),
(97, 'supermeatboy', 'test', '2025-05-03 09:30:00', 24, 2, 'assets/img/supermeatboy.jpg', 1, 'validated', 1, '2025-05-03 09:30:00', '2025-05-02 13:31:05', '2025-05-03 09:45:05'),
(98, 'fifa', 'sdfg', '2025-05-03 00:30:00', 24, 3, 'assets/img/fifa.png', 1, 'validated', 1, '2025-05-03 00:30:00', '2025-05-02 16:47:22', '2025-05-03 09:00:21'),
(99, 'rocketleague', 'qsfdc', '2025-05-03 00:30:00', 24, 3, 'assets/img/rocketLeague.png', 1, 'validated', 1, '2025-05-03 00:30:00', '2025-05-02 16:47:43', '2025-05-03 09:00:21'),
(100, 'Cs2', 'sdfgh', '2025-05-04 00:30:00', 24, 2, 'assets/img/CS2.png', 1, 'validated', 1, '2025-05-04 00:30:00', '2025-05-03 07:55:19', '2025-05-04 09:40:56'),
(101, 'balatro', 'sdfhg', '2025-05-03 11:00:00', 24, 2, 'assets/img/Balatro.jpg', 1, 'validated', 1, '2025-05-03 11:00:00', '2025-05-03 07:55:41', '2025-05-03 11:15:00'),
(103, 'cs2', 'événement modifié !', '2025-04-14 08:00:00', 24, 2, 'img/CS2.png', 1, 'validated', 1, '2025-04-14 08:00:00', '2025-05-04 09:17:56', '2025-05-04 11:24:48'),
(105, 'balatro', 'dsfg', '2025-05-05 07:00:00', 24, 3, 'assets/img/Balatro.jpg', 1, 'validated', 1, '2025-05-05 07:00:00', '2025-05-04 09:52:46', '2025-05-05 14:49:29'),
(106, 'supermeatboy', 'sedg', '2025-05-05 16:30:00', 24, 4, 'assets/img/supermeatboy.jpg', 1, 'validated', 1, '2025-05-05 16:30:00', '2025-05-04 09:52:58', '2025-05-05 17:10:41'),
(107, 'starcraft2', 'segzser', '2025-05-05 17:30:00', 24, 3, 'assets/img/starcraft2.png', 1, 'validated', 1, '2025-05-05 17:30:00', '2025-05-04 09:53:12', '2025-05-06 15:53:18'),
(108, 'Cs2', 'hgger', '2025-05-05 00:30:00', 24, 2, 'assets/img/CS2.png', 1, 'validated', 1, '2025-05-05 00:30:00', '2025-05-04 09:53:25', '2025-05-05 14:49:29'),
(109, 'valorant', 'dsrg', '2025-05-05 07:00:00', 24, 2, 'assets/img/valorant.png', 1, 'validated', 1, '2025-05-05 07:00:00', '2025-05-04 09:53:38', '2025-05-05 14:49:29'),
(110, 'pubg', 'test filtre', '2025-05-08 00:00:00', 24, 3, 'assets/img/pubg.jpg', 1, 'validated', 1, '2025-05-08 00:00:00', '2025-05-04 11:58:58', '2025-09-02 13:34:24'),
(111, 'pubg', 'test', '2025-05-06 02:00:00', 24, 2, 'assets/img/pubg.jpg', 2, 'validated', 1, '2025-05-06 02:00:00', '2025-05-04 12:30:47', '2025-05-06 15:53:18'),
(112, 'balatro', 'dfg', '2025-05-05 01:00:00', 24, 4, 'assets/img/Balatro.jpg', 1, 'validated', 1, '2025-05-05 01:00:00', '2025-05-04 14:49:44', '2025-05-05 14:49:29'),
(113, 'supermeatboy', 'Événement test automatique', '2025-04-20 08:00:00', 24, 5, 'img/supermeatboy.jpg', 1, 'validated', 1, '2025-04-20 08:00:00', '2025-05-04 14:52:08', '2025-05-06 16:12:55'),
(114, 'balatro', 'sdfv', '2025-05-07 01:00:00', 24, 3, 'assets/img/Balatro.jpg', 1, 'validated', 1, '2025-05-07 01:00:00', '2025-05-06 14:12:50', '2025-09-02 13:34:24'),
(115, 'Cs2', 'test local', '2025-09-03 00:00:00', 24, 2, 'assets/img/CS2.png', 1, 'validated', 0, NULL, '2025-09-02 11:47:32', '2025-09-02 13:47:36');

--
-- Déclencheurs `events`
--
DROP TRIGGER IF EXISTS `trg_update_events_updated_at`;
DELIMITER $$
CREATE TRIGGER `trg_update_events_updated_at` BEFORE UPDATE ON `events` FOR EACH ROW BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `event_bans`
--

DROP TABLE IF EXISTS `event_bans`;
CREATE TABLE IF NOT EXISTS `event_bans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `banned_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `event_id` (`event_id`,`user_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `event_bans`
--

INSERT INTO `event_bans` (`id`, `user_id`, `event_id`, `banned_at`) VALUES
(7, 5, 10, '2025-04-18 11:35:36'),
(10, 2, 74, '2025-04-29 10:58:59');

-- --------------------------------------------------------

--
-- Structure de la table `event_participants`
--

DROP TABLE IF EXISTS `event_participants`;
CREATE TABLE IF NOT EXISTS `event_participants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `has_joined` tinyint(1) DEFAULT NULL,
  `registered_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=594 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `event_participants`
--

INSERT INTO `event_participants` (`id`, `user_id`, `event_id`, `has_joined`, `registered_at`) VALUES
(24, 1, 11, 1, '2025-04-18 11:37:22'),
(337, 1, 86, 1, NULL),
(339, 3, 86, 1, NULL),
(340, 1, 7, 1, NULL),
(341, 2, 7, 1, NULL),
(342, 3, 7, 1, NULL),
(346, 1, 9, 1, NULL),
(347, 2, 9, 1, NULL),
(348, 3, 9, 1, NULL),
(350, 2, 10, 1, NULL),
(351, 3, 10, 1, NULL),
(353, 2, 11, 1, NULL),
(354, 3, 11, 1, NULL),
(355, 1, 12, 1, NULL),
(356, 2, 12, 1, NULL),
(357, 3, 12, 1, NULL),
(358, 1, 13, 1, NULL),
(359, 2, 13, 1, NULL),
(360, 3, 13, 1, NULL),
(361, 1, 14, 1, NULL),
(362, 2, 14, 1, NULL),
(363, 3, 14, 1, NULL),
(364, 1, 15, 1, NULL),
(365, 2, 15, 1, NULL),
(366, 3, 15, 1, NULL),
(367, 1, 16, 1, NULL),
(368, 2, 16, 1, NULL),
(369, 3, 16, 1, NULL),
(370, 1, 17, 1, NULL),
(371, 2, 17, 1, NULL),
(372, 3, 17, 1, NULL),
(373, 1, 18, 1, NULL),
(374, 2, 18, 1, NULL),
(375, 3, 18, 1, NULL),
(376, 1, 19, 1, NULL),
(377, 2, 19, 1, NULL),
(378, 3, 19, 1, NULL),
(379, 1, 20, 1, NULL),
(380, 2, 20, 1, NULL),
(381, 3, 20, 1, NULL),
(382, 1, 21, 1, NULL),
(383, 2, 21, 1, NULL),
(384, 3, 21, 1, NULL),
(385, 1, 22, 1, NULL),
(386, 2, 22, 1, NULL),
(387, 3, 22, 1, NULL),
(388, 1, 23, 1, NULL),
(389, 2, 23, 1, NULL),
(390, 3, 23, 1, NULL),
(391, 1, 24, 1, NULL),
(392, 2, 24, 1, NULL),
(393, 3, 24, 1, NULL),
(394, 1, 25, 1, NULL),
(395, 2, 25, 1, NULL),
(396, 3, 25, 1, NULL),
(397, 1, 26, 1, NULL),
(398, 2, 26, 1, NULL),
(399, 3, 26, 1, NULL),
(467, 1, 45, 1, '2025-04-20 15:12:27'),
(468, 2, 45, 1, '2025-04-20 15:12:27'),
(469, 3, 45, 1, '2025-04-20 15:12:27'),
(470, 4, 45, 1, '2025-04-20 15:12:27'),
(471, 5, 45, 1, '2025-04-20 15:12:27'),
(472, 1, 44, 1, '2025-04-20 15:12:27'),
(473, 2, 44, 1, '2025-04-20 15:12:27'),
(474, 3, 44, 1, '2025-04-20 15:12:27'),
(475, 4, 44, 1, '2025-04-20 15:12:27'),
(476, 5, 44, 1, '2025-04-20 15:12:27'),
(477, 1, 43, 1, '2025-04-20 15:12:27'),
(478, 2, 43, 1, '2025-04-20 15:12:27'),
(479, 3, 43, 1, '2025-04-20 15:12:27'),
(480, 4, 43, 1, '2025-04-20 15:12:27'),
(481, 5, 43, 1, '2025-04-20 15:12:27'),
(482, 1, 42, 1, '2025-04-20 15:12:27'),
(483, 2, 42, 1, '2025-04-20 15:12:27'),
(485, 4, 42, 1, '2025-04-20 15:12:27'),
(486, 5, 42, 1, '2025-04-20 15:12:27'),
(487, 1, 41, 1, '2025-04-20 15:12:27'),
(488, 2, 41, 1, '2025-04-20 15:12:27'),
(490, 4, 41, 1, '2025-04-20 15:12:27'),
(491, 5, 41, 1, '2025-04-20 15:12:27'),
(492, 1, 40, 1, '2025-04-20 15:12:27'),
(493, 2, 40, 1, '2025-04-20 15:12:27'),
(494, 3, 40, 1, '2025-04-20 15:12:27'),
(496, 5, 40, 1, '2025-04-20 15:12:27'),
(497, 1, 39, 1, '2025-04-20 15:12:27'),
(498, 2, 39, 1, '2025-04-20 15:12:27'),
(499, 3, 39, 1, '2025-04-20 15:12:27'),
(500, 4, 39, 1, '2025-04-20 15:12:27'),
(501, 5, 39, 1, '2025-04-20 15:12:27'),
(502, 1, 38, 1, '2025-04-20 15:12:27'),
(503, 2, 38, 1, '2025-04-20 15:12:27'),
(504, 3, 38, 1, '2025-04-20 15:12:27'),
(505, 4, 38, 1, '2025-04-20 15:12:27'),
(506, 5, 38, 1, '2025-04-20 15:12:27'),
(507, 1, 37, 1, '2025-04-20 15:12:27'),
(508, 2, 37, 1, '2025-04-20 15:12:27'),
(509, 3, 37, 1, '2025-04-20 15:12:27'),
(510, 4, 37, 1, '2025-04-20 15:12:27'),
(511, 5, 37, 1, '2025-04-20 15:12:27'),
(539, 3, 41, 1, '2025-04-20 18:27:59'),
(541, 3, 42, 1, '2025-04-20 18:52:03'),
(542, 1, 57, 1, '2025-04-26 13:35:22'),
(543, 1, 58, 1, '2025-04-26 13:35:24'),
(544, 2, 57, NULL, '2025-04-26 13:35:49'),
(545, 2, 58, NULL, '2025-04-26 13:35:50'),
(548, 3, 57, NULL, '2025-04-26 13:36:59'),
(549, 1, 64, 1, '2025-04-27 18:20:54'),
(550, 1, 65, 1, '2025-04-27 18:20:55'),
(551, 1, 66, 1, '2025-04-27 18:20:56'),
(552, 1, 67, 1, '2025-04-27 18:20:58'),
(553, 1, 74, 1, '2025-04-28 10:49:07'),
(556, 1, 75, 1, '2025-04-29 10:42:57'),
(557, 1, 76, 1, '2025-04-29 11:29:29'),
(558, 1, 77, 1, '2025-04-29 11:29:31'),
(559, 1, 78, 1, '2025-04-29 13:42:15'),
(560, 1, 79, 1, '2025-04-29 13:42:24'),
(561, 1, 80, 1, '2025-04-29 13:42:26'),
(562, 1, 81, 1, '2025-04-29 13:42:28'),
(563, 1, 82, 1, '2025-04-29 13:42:30'),
(564, 1, 83, 1, '2025-04-29 13:42:32'),
(565, 1, 84, 1, '2025-04-29 13:42:35'),
(566, 1, 85, 1, '2025-04-29 13:42:36'),
(567, 2, 75, NULL, '2025-04-29 14:16:41'),
(568, 1, 89, 1, '2025-05-01 10:52:51'),
(569, 2, 89, NULL, '2025-05-01 11:00:17'),
(570, 1, 90, 1, '2025-05-01 11:04:28'),
(571, 5, 90, NULL, '2025-05-01 11:05:40'),
(572, 1, 91, 1, '2025-05-01 14:32:46'),
(573, 2, 91, NULL, '2025-05-01 14:33:04'),
(574, 1, 92, 1, '2025-05-01 18:07:44'),
(575, 1, 93, 1, '2025-05-01 18:07:46'),
(577, 1, 95, 1, '2025-05-02 19:09:41'),
(578, 1, 96, 1, '2025-05-02 19:09:43'),
(580, 1, 98, 1, '2025-05-02 19:09:44'),
(581, 1, 99, 1, '2025-05-02 19:09:50'),
(582, 1, 97, 1, '2025-05-03 09:20:05'),
(583, 1, 100, 1, '2025-05-03 09:55:51'),
(584, 1, 101, NULL, '2025-05-03 09:55:54'),
(586, 1, 105, NULL, '2025-05-04 13:16:13'),
(587, 1, 106, NULL, '2025-05-04 13:16:14'),
(588, 1, 107, NULL, '2025-05-04 13:16:15'),
(589, 1, 108, NULL, '2025-05-04 13:16:16'),
(590, 1, 109, NULL, '2025-05-04 13:16:17'),
(591, 1, 110, NULL, '2025-05-05 17:12:28'),
(592, 1, 115, NULL, '2025-09-02 13:47:43'),
(593, 5, 115, NULL, '2025-09-02 13:48:30');

-- --------------------------------------------------------

--
-- Structure de la table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `game_key` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_favorite` (`user_id`,`game_key`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `game_key`, `created_at`) VALUES
(11, 5, 'rocketleague', '2025-04-18 11:16:51'),
(12, 5, 'cs2', '2025-04-18 11:16:52'),
(15, 3, 'cs2', '2025-04-18 18:36:42'),
(17, 3, 'balatro', '2025-04-20 18:15:21'),
(18, 1, 'supermeatboy', '2025-04-25 11:36:33'),
(19, 2, 'balatro', '2025-04-28 11:25:06'),
(20, 2, 'cs2', '2025-04-28 11:25:11'),
(26, 1, 'balatro', '2025-04-29 13:36:29'),
(28, 1, 'cs2', '2025-04-30 15:46:05');

-- --------------------------------------------------------

--
-- Structure de la table `participants`
--

DROP TABLE IF EXISTS `participants`;
CREATE TABLE IF NOT EXISTS `participants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `scores`
--

DROP TABLE IF EXISTS `scores`;
CREATE TABLE IF NOT EXISTS `scores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `result` enum('win','loss','draw') DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  `metadata` longtext DEFAULT NULL,
  `recorded_at` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `scores`
--

INSERT INTO `scores` (`id`, `user_id`, `event_id`, `score`, `result`, `position`, `metadata`, `recorded_at`) VALUES
(1, 1, 12, 12, 'win', NULL, '{\"kills\":21,\"score\":12,\"score_opponent\":6}', '2025-04-18'),
(2, 2, 12, 6, '', NULL, '{\"kills\":11,\"score\":6,\"score_opponent\":12}', '2025-04-18'),
(3, 3, 12, 12, 'win', NULL, '{\"kills\":16,\"score\":12,\"score_opponent\":6}', '2025-04-18'),
(4, 2, 10, 2, '', NULL, '{\"score\":2,\"score_opponent\":4}', '2025-04-25'),
(5, 3, 10, 3, 'win', NULL, '{\"score\":3,\"score_opponent\":2}', '2025-04-25'),
(6, 1, 11, 12, 'win', NULL, '{\"kills\":21,\"score\":12,\"score_opponent\":9}', '2025-04-25'),
(7, 2, 11, 9, '', NULL, '{\"kills\":23,\"score\":9,\"score_opponent\":12}', '2025-04-25'),
(8, 3, 11, 12, 'win', NULL, '{\"kills\":14,\"score\":12,\"score_opponent\":9}', '2025-04-25'),
(9, 1, 7, 5, 'win', NULL, '{\"points\":5}', '2025-04-25'),
(11, 2, 9, 2, '', NULL, '{\"score\":2,\"score_opponent\":3}', '2025-04-25'),
(12, 1, 9, 2, '', NULL, '{\"score\":2,\"score_opponent\":3}', '2025-04-25'),
(13, 3, 9, 3, 'win', NULL, '{\"score\":3,\"score_opponent\":2}', '2025-04-25'),
(14, 1, 13, 2, '', NULL, '{\"score\":2,\"score_opponent\":3}', '2025-04-25'),
(15, 2, 13, 3, 'win', NULL, '{\"score\":3,\"score_opponent\":2}', '2025-04-25'),
(16, 3, 13, 3, 'win', NULL, '{\"score\":3,\"score_opponent\":2}', '2025-04-25'),
(17, 1, 16, 7, 'win', NULL, '{\"kills\":7,\"place\":11}', '2025-04-25'),
(18, 2, 16, 9, 'win', NULL, '{\"kills\":9,\"place\":2}', '2025-04-25'),
(19, 3, 16, 8, 'win', NULL, '{\"kills\":8,\"place\":1}', '2025-04-25'),
(20, 1, 21, 3, '', NULL, '{\"kills\":4,\"score\":3,\"score_opponent\":12}', '2025-04-25'),
(21, 2, 21, 12, 'win', NULL, '{\"kills\":9,\"score\":12,\"score_opponent\":3}', '2025-04-25'),
(22, 3, 21, 12, 'win', NULL, '{\"kills\":10,\"score\":12,\"score_opponent\":3}', '2025-04-25'),
(23, 1, 20, 150, 'win', NULL, '{\"time\":\"02:30\"}', '2025-04-25'),
(24, 2, 20, 160, 'win', NULL, '{\"time\":\"02:40\"}', '2025-04-25'),
(25, 3, 20, 135, 'win', NULL, '{\"time\":\"02:15\"}', '2025-04-25'),
(26, 2, 14, 4, 'win', NULL, '{\"points\":4}', '2025-04-25'),
(27, 1, 14, 3, 'win', NULL, '{\"points\":3}', '2025-04-25'),
(28, 3, 14, 6, 'win', NULL, '{\"points\":6}', '2025-04-25'),
(29, 1, 15, 9, 'win', NULL, '{\"kills\":9,\"assists\":4,\"deaths\":8}', '2025-04-25'),
(30, 2, 15, 5, 'win', NULL, '{\"kills\":5,\"assists\":9,\"deaths\":6}', '2025-04-25'),
(31, 3, 15, 11, 'win', NULL, '{\"kills\":11,\"assists\":6,\"deaths\":4}', '2025-04-25'),
(32, 1, 17, 4, 'win', NULL, '{\"score\":4,\"score_opponent\":3}', '2025-04-25'),
(33, 2, 17, 3, '', NULL, '{\"score\":3,\"score_opponent\":4}', '2025-04-25'),
(34, 3, 17, 4, 'win', NULL, '{\"score\":4,\"score_opponent\":3}', '2025-04-25'),
(35, 1, 44, 15, 'win', NULL, '{\"kills\":15,\"place\":8}', '2025-04-25'),
(36, 2, 44, 7, 'win', NULL, '{\"kills\":7,\"place\":21}', '2025-04-25'),
(37, 3, 44, 13, 'win', NULL, '{\"kills\":13,\"place\":4}', '2025-04-25'),
(38, 4, 44, 9, 'win', NULL, '{\"kills\":9,\"place\":5}', '2025-04-25'),
(39, 5, 44, 14, 'win', NULL, '{\"kills\":14,\"place\":1}', '2025-04-25'),
(40, 1, 43, 12, 'win', NULL, '{\"points\":12}', '2025-04-25'),
(41, 2, 43, 3, 'win', NULL, '{\"points\":3}', '2025-04-25'),
(42, 3, 43, 7, 'win', NULL, '{\"points\":7}', '2025-04-25'),
(43, 4, 43, 8, 'win', NULL, '{\"points\":8}', '2025-04-25'),
(44, 5, 43, 1, 'win', NULL, '{\"points\":1}', '2025-04-25'),
(45, 2, 7, 6, 'win', NULL, '{\"points\":6}', '2025-04-25'),
(46, 3, 7, 2, 'win', NULL, '{\"points\":2}', '2025-04-25'),
(47, 1, 18, 12, 'win', NULL, '{\"kills\":24,\"score\":12,\"score_opponent\":6}', '2025-04-25'),
(48, 2, 18, 6, '', NULL, '{\"kills\":9,\"score\":6,\"score_opponent\":12}', '2025-04-25'),
(49, 3, 18, 12, 'win', NULL, '{\"kills\":4,\"score\":12,\"score_opponent\":6}', '2025-04-25'),
(50, 1, 42, 130, 'win', NULL, '{\"time\":\"02:10\"}', '2025-04-25'),
(51, 4, 42, 140, 'win', NULL, '{\"time\":\"02:20\"}', '2025-04-25'),
(52, 5, 42, 135, 'win', NULL, '{\"time\":\"02:15\"}', '2025-04-25'),
(53, 2, 42, 155, 'win', NULL, '{\"time\":\"02:35\"}', '2025-04-25'),
(54, 5, 42, 162, 'win', NULL, '{\"time\":\"02:42\"}', '2025-04-25'),
(55, 3, 42, 170, 'win', NULL, '{\"time\":\"02:50\"}', '2025-04-25'),
(56, 1, 6, 11, '', NULL, '{\"kills\":19,\"score\":11,\"score_opponent\":12}', '2025-04-26'),
(57, 3, 6, 12, 'win', NULL, '{\"kills\":16,\"score\":12,\"score_opponent\":11}', '2025-04-26'),
(58, 1, 22, 11, 'win', NULL, '{\"kills\":11,\"assists\":5,\"deaths\":6}', '2025-04-26'),
(59, 3, 22, 9, 'win', NULL, '{\"kills\":9,\"assists\":8,\"deaths\":7}', '2025-04-26'),
(60, 2, 22, 6, 'win', NULL, '{\"kills\":6,\"assists\":8,\"deaths\":12}', '2025-04-26'),
(64, 1, 24, 8, 'win', NULL, '{\"points\":8}', '2025-04-26'),
(65, 2, 24, 10, 'win', NULL, '{\"points\":10}', '2025-04-26'),
(66, 3, 24, 9, 'win', NULL, '{\"points\":9}', '2025-04-26'),
(67, 1, 25, 13, 'win', NULL, '{\"kills\":13,\"place\":1}', '2025-04-26'),
(68, 2, 25, 8, 'win', NULL, '{\"kills\":8,\"place\":4}', '2025-04-26'),
(69, 3, 25, 3, 'win', NULL, '{\"kills\":3,\"place\":25}', '2025-04-26'),
(70, 1, 26, 12, 'win', NULL, '{\"kills\":10,\"score\":12,\"score_opponent\":9}', '2025-04-26'),
(71, 2, 26, 12, 'win', NULL, '{\"kills\":11,\"score\":12,\"score_opponent\":9}', '2025-04-26'),
(72, 3, 26, 9, '', NULL, '{\"kills\":9,\"score\":9,\"score_opponent\":12}', '2025-04-26'),
(73, 1, 19, 0, 'win', NULL, '{\"win\":true}', '2025-04-26'),
(74, 2, 19, 0, '', NULL, '{\"win\":false}', '2025-04-26'),
(75, 3, 19, 0, 'win', NULL, '{\"win\":true}', '2025-04-26'),
(76, 1, 45, 0, 'win', NULL, '{\"win\":true}', '2025-04-26'),
(77, 2, 45, 0, 'win', NULL, '{\"win\":true}', '2025-04-26'),
(78, 3, 45, 0, 'win', NULL, '{\"win\":true}', '2025-04-26'),
(79, 4, 45, 0, '', NULL, '{\"win\":false}', '2025-04-26'),
(80, 5, 45, 0, '', NULL, '{\"win\":false}', '2025-04-26'),
(81, 1, 23, 4, 'win', NULL, '{\"score\":4,\"score_opponent\":3}', '2025-04-26'),
(82, 2, 23, 3, '', NULL, '{\"score\":3,\"score_opponent\":4}', '2025-04-26'),
(83, 3, 23, 1, 'draw', NULL, '{\"score\":1,\"score_opponent\":1}', '2025-04-26'),
(84, 1, 39, 2, 'win', NULL, '{\"score\":2,\"score_opponent\":1}', '2025-04-26'),
(85, 2, 39, 1, '', NULL, '{\"score\":1,\"score_opponent\":3}', '2025-04-26'),
(86, 3, 39, 3, 'win', NULL, '{\"score\":3,\"score_opponent\":1}', '2025-04-26'),
(87, 4, 39, 4, 'win', NULL, '{\"score\":4,\"score_opponent\":2}', '2025-04-26'),
(88, 4, 39, 2, '', NULL, '{\"score\":2,\"score_opponent\":3}', '2025-04-26'),
(89, 5, 39, 1, 'win', NULL, '{\"score\":1,\"score_opponent\":0}', '2025-04-26'),
(90, 1, 40, 4, 'win', NULL, '{\"score\":4,\"score_opponent\":2}', '2025-04-26'),
(91, 2, 40, 2, '', NULL, '{\"score\":2,\"score_opponent\":3}', '2025-04-26'),
(92, 3, 40, 1, '', NULL, '{\"score\":1,\"score_opponent\":4}', '2025-04-26'),
(93, 5, 40, 4, 'win', NULL, '{\"score\":4,\"score_opponent\":3}', '2025-04-26'),
(94, 1, 41, 5, 'win', NULL, '{\"kills\":5,\"assists\":2,\"deaths\":3}', '2025-04-26'),
(95, 2, 41, 6, 'win', NULL, '{\"kills\":6,\"assists\":5,\"deaths\":7}', '2025-04-26'),
(96, 4, 41, 8, 'win', NULL, '{\"kills\":8,\"assists\":4,\"deaths\":5}', '2025-04-26'),
(97, 5, 41, 6, 'win', NULL, '{\"kills\":6,\"assists\":6,\"deaths\":3}', '2025-04-26'),
(98, 3, 41, 8, 'win', NULL, '{\"kills\":8,\"assists\":5,\"deaths\":7}', '2025-04-26'),
(99, 1, 38, 12, 'win', NULL, '{\"kills\":15,\"score\":12,\"score_opponent\":6}', '2025-04-26'),
(100, 2, 38, 12, 'win', NULL, '{\"kills\":12,\"score\":12,\"score_opponent\":6}', '2025-04-26'),
(101, 3, 38, 12, 'win', NULL, '{\"kills\":14,\"score\":12,\"score_opponent\":3}', '2025-04-26'),
(102, 4, 38, 12, 'win', NULL, '{\"kills\":19,\"score\":12,\"score_opponent\":6}', '2025-04-26'),
(103, 5, 38, 6, '', NULL, '{\"kills\":5,\"score\":6,\"score_opponent\":12}', '2025-04-26'),
(104, 1, 37, 10, '', NULL, '{\"kills\":17,\"score\":10,\"score_opponent\":12}', '2025-04-26'),
(105, 2, 37, 12, 'win', NULL, '{\"kills\":13,\"score\":12,\"score_opponent\":10}', '2025-04-26'),
(106, 3, 37, 10, '', NULL, '{\"kills\":19,\"score\":10,\"score_opponent\":12}', '2025-04-26'),
(107, 4, 37, 12, 'win', NULL, '{\"kills\":12,\"score\":12,\"score_opponent\":10}', '2025-04-26'),
(108, 5, 37, 12, 'win', NULL, '{\"kills\":4,\"score\":12,\"score_opponent\":10}', '2025-04-26'),
(109, 1, 64, 10, '', NULL, '{\"kills\":18,\"score\":10,\"score_opponent\":12}', '2025-04-29'),
(110, 2, 58, 8, '', NULL, '{\"kills\":17,\"score\":8,\"score_opponent\":12}', '2025-04-30'),
(111, 1, 58, 12, 'win', NULL, '{\"kills\":22,\"score\":12,\"score_opponent\":8}', '2025-04-30');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `created_at` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'admin', 'admin@mail.com', '$2a$10$i3YajkRtLpB3otTJmwUfNOduaCjuVAlQDqim9ghnENzUsD3M/NewG', 'admin', '2025-04-25'),
(2, 'orga', 'organizer@mail.com', '$2a$10$rXM7gMA464RLKH1kK5r2gOncxhEPEd923uaKzi0Peal69hT41SKzG', 'organizer', '2025-04-17'),
(3, 'user', 'user@mail.com', '$2a$10$U8IBbyZ7ckXUP7vJQ9xbIeHEQVR4qday1PjxlJpxW5PA96JoYJg.O', 'user', '2025-04-17'),
(4, 'userorga', 'userorga@mail.com', '$2a$10$bcMXCVjpRLqJte9gtlkDEeUN0baeoQpKXOGcbERu6KTz9juDN1Apa', 'organizer', '2025-04-17'),
(5, 'test', 'test@mail.com', '$2a$10$8v13nUWfVtW6RR9mYCfPkOs/qdovENscRAZhkY.1L/BYLvX4St/Se', 'user', '2025-04-17'),
(6, 'changepass', 'pass@mail.com', '$2a$10$G4vR/XdDlAOAI5KTH9ERyOgsiwkDnU2.0.0xk7FBhZMD.1tnpJYKW', 'user', '2025-05-01'),
(7, 'connectauto', 'auto@mail.com', '$2a$10$/KlhVPxtI5B7dyZ4SKORgeaY5jYNlsjpHl6vylr7kkkyNr2K0sU2C', 'user', '2025-05-01'),
(8, 'smoke_109670285', 'smoke_109670285@example.com', '$2a$10$ej4/Ns6ZVNKzYMoidXtf7eSN/Qy11Nlqn9GcicnZSc2.xww.8mhny', 'user', '2025-09-15'),
(9, 'smoke_741599366', 'smoke_741599366@example.com', '$2a$10$PgisRRzut0nVn8eVQKjywO62Jj8seCL5lBXKLVhvhnTPHkXa2xC4C', 'admin', '2025-09-15');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `event_bans`
--
ALTER TABLE `event_bans`
  ADD CONSTRAINT `event_bans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_bans_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `event_participants`
--
ALTER TABLE `event_participants`
  ADD CONSTRAINT `event_participants_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_participants_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `participants`
--
ALTER TABLE `participants`
  ADD CONSTRAINT `participants_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `participants_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `scores`
--
ALTER TABLE `scores`
  ADD CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
