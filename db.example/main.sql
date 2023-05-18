CREATE TABLE `artists` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `order` bigint,
  `artist_id` varchar(255) UNIQUE,
  `name` varchar(255) NOT NULL,
  `short` varchar(255) NOT NULL,
  `graduated` bool DEFAULT 0,
  `title` longtext,
  `app_title` longtext,
  `description` longtext,
  `color` varchar(255),
  `youtube` varchar(255),
  `twitch` varchar(255),
  `instagram` varchar(255)
);

CREATE TABLE `group` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `artist_id` bigint,
  `en` varchar(255),
  `kr` varchar(255)
);

CREATE TABLE `artist_image_version` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `artist_id` bigint,
  `round` int DEFAULT 1,
  `square` int DEFAULT 1
);

CREATE TABLE `news` (
  `id` bigint PRIMARY KEY,
  `title` text,
  `time` integer
);

CREATE TABLE `categories` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL
);

CREATE TABLE `notice` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `category_id` bigint,
  `title` varchar(255),
  `main_text` longtext,
  `thumbnail` varchar(255),
  `images` longtext,
  `create_at` bigint,
  `start_at` bigint,
  `end_at` bigint
);

CREATE TABLE `qna` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `category_id` bigint,
  `question` varchar(255) UNIQUE,
  `description` longtext,
  `create_at` bigint
);

CREATE TABLE `teams` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `team` varchar(255) NOT NULL,
  `name` text NOT NULL,
  `role` varchar(255)
);

CREATE TABLE `user` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255) UNIQUE,
  `platform` varchar(255) NOT NULL,
  `profile_id` bigint,
  `displayName` varchar(255) DEFAULT "이파리",
  `first_login_time` bigint,
  `create_at` bigint
);

CREATE TABLE `profile` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `type` varchar(255) UNIQUE,
  `version` int
);

CREATE TABLE `user_permissions` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint,
  `type` varchar(255) DEFAULT "default"
);

CREATE TABLE `user_access_logs` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint,
  `create_at` datetime
);

CREATE TABLE `user_playlists` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint,
  `playlist` bigint
);

CREATE TABLE `user_playlists_playlists` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_playlists_id` bigint,
  `order` bigint
);

CREATE TABLE `user_likes` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint
);

CREATE TABLE `user_likes_songs` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_likes_id` bigint,
  `song_id` bigint,
  `order` bigint
);

CREATE TABLE `playlist` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `key` varchar(255) UNIQUE NOT NULL,
  `title` varchar(255) NOT NULL,
  `user_id` bigint,
  `image_id` bigint
);

CREATE TABLE `playlist_songs` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `playlist_id` bigint,
  `song_id` bigint,
  `order` bigint
);

CREATE TABLE `playlist_image` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `version` int DEFAULT 1
);

CREATE TABLE `playlist_copy` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `date` int,
  `playlist_key` varchar(255),
  `owner_id` bigint,
  `count` bigint,
  `create_at` bigint
);

CREATE TABLE `playlist_copy_logs` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `date` int,
  `playlist_key` varchar(255),
  `new_playlist_key` varchar(255),
  `playlist_owner_id` text,
  `new_playlist_owner_id` text,
  `create_at` bigint
);

CREATE TABLE `updated` (
  `time` bigint
);

CREATE TABLE `artist_song` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `artist_id` bigint,
  `song_id` bigint
);

CREATE TABLE `songs` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `song_id` varchar(255) UNIQUE NOT NULL,
  `title` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `remix` varchar(255),
  `reaction` varchar(255),
  `date` integer,
  `start` bigint,
  `end` bigint
);

CREATE TABLE `chart_total` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `song_id` bigint,
  `views` bigint,
  `last` integer
);

CREATE TABLE `chart_hourly` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `song_id` bigint,
  `views` bigint,
  `increase` integer,
  `last` integer
);

CREATE TABLE `chart_daily` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `song_id` bigint,
  `views` bigint,
  `increase` integer,
  `last` integer
);

CREATE TABLE `chart_weekly` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `song_id` bigint,
  `views` bigint,
  `increase` integer,
  `last` integer
);

CREATE TABLE `chart_monthly` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `song_id` bigint,
  `views` bigint,
  `increase` integer,
  `last` integer
);

CREATE TABLE `like` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `song_id` bigint,
  `likes` bigint DEFAULT 0
);

CREATE TABLE `recommended_playlist` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `key` varchar(255) UNIQUE NOT NULL,
  `title` varchar(255) NOT NULL
);

CREATE TABLE `recommended_playlist_songs` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `playist_id` bigint,
  `song_id` bigint,
  `order` bigint
);

CREATE TABLE `recommended_playlist_image` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `playlist_id` bigint,
  `round` int DEFAULT 1,
  `square` int DEFAULT 1
);

ALTER TABLE `group` ADD FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `artist_image_version` ADD FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `notice` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `qna` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `user` ADD FOREIGN KEY (`profile_id`) REFERENCES `profile` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `user_permissions` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user_access_logs` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `user_playlists` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user_playlists_playlists` ADD FOREIGN KEY (`user_playlists_id`) REFERENCES `user_playlists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user_likes` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user_likes_songs` ADD FOREIGN KEY (`user_likes_id`) REFERENCES `user_likes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user_likes_songs` ADD FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `playlist` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `playlist` ADD FOREIGN KEY (`image_id`) REFERENCES `playlist_image` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `playlist_songs` ADD FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `playlist_songs` ADD FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `playlist_copy` ADD FOREIGN KEY (`playlist_key`) REFERENCES `playlist` (`key`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `artist_song` ADD FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `artist_song` ADD FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `chart_total` ADD FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`);

ALTER TABLE `chart_hourly` ADD FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`);

ALTER TABLE `chart_daily` ADD FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`);

ALTER TABLE `chart_weekly` ADD FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`);

ALTER TABLE `chart_monthly` ADD FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`);

ALTER TABLE `like` ADD FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `recommended_playlist_songs` ADD FOREIGN KEY (`playist_id`) REFERENCES `recommended_playlist` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `recommended_playlist_songs` ADD FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `recommended_playlist_image` ADD FOREIGN KEY (`playlist_id`) REFERENCES `recommended_playlist` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
