CREATE TABLE `users` (
  `user_id` int PRIMARY KEY AUTO_INCREMENT,
  `phone_number` int,
  `first_name` varchar(255),
  `last_name` varchar(255),
  `birth_date` date,
  `weight` varchar(255),
  `height` varchar(255),
  `bmi` varchar(255),
  `gender` varchar(255),
  `money` varchar(255),
  `picture` varchar(255),
  `fb_token_id` boolean,
  `role` ENUM ('admin', 'user'),
  `blocked` boolean
);

CREATE TABLE `categories` (
  `category_id` int PRIMARY KEY AUTO_INCREMENT,
  `en` varchar(255),
  `ar` varchar(255)
);

CREATE TABLE `admins` (
  `admin_id` int PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(255),
  `password` varchar(255),
  `name` varchar(255),
  `role` adminRoles
);

CREATE TABLE `doctors` (
  `doctor_id` int PRIMARY KEY AUTO_INCREMENT,
  `phone_number` int,
  `password` varchar(255),
  `first_name` varchar(255),
  `last_name` varchar(255),
  `country` varchar(255),
  `category_id` int,
  `price` int,
  `available` boolean,
  `fb_token_id` varchar(255)
);

CREATE TABLE `slots` (
  `slot_id` int PRIMARY KEY AUTO_INCREMENT,
  `doctor_id` int,
  `day` varchar(255),
  `start_time` varchar(255),
  `end_time` varchar(255),
  `slot_time` int,
  `available` boolean
);

CREATE TABLE `appointments` (
  `appointment_id` int PRIMARY KEY AUTO_INCREMENT,
  `slot_id` int,
  `user_id` int,
  `date` varchar(255),
  `user_joined` varchar(255),
  `doctor_joined` varchar(255),
  `room_id` varchar(255),
  `appointmet_status` ENUM ('upcoming', 'runnung', 'finished', 'canceled', 'missed', 'doctor missed', 'user missed')
);

CREATE TABLE `rates` (
  `rate_id` int PRIMARY KEY AUTO_INCREMENT,
  `appointment_id` int,
  `rate` int,
  `description` varchar(255)
);

CREATE TABLE `messages` (
  `message_id` int AUTO_INCREMENT,
  `room_id` int,
  `sender` varchar(255),
  `message` varchar(255),
  `type` varchar(255)
);

CREATE TABLE `certifications` (
  `certfication_id` int AUTO_INCREMENT,
  `doctor_id` int,
  `title` varchar(255),
  `description` varchar(255),
  `cert_file` varchar(255)
);

CREATE TABLE `prescriptions` (
  `prescription_id` int PRIMARY KEY AUTO_INCREMENT,
  `room_id` int,
  `prescription` varchar(255),
  `diagnose` varchar(255)
);

ALTER TABLE `appointments` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `slots` ADD FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`);

ALTER TABLE `rates` ADD FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`);

ALTER TABLE `slots` ADD FOREIGN KEY (`slot_id`) REFERENCES `appointments` (`slot_id`);

ALTER TABLE `messages` ADD FOREIGN KEY (`room_id`) REFERENCES `appointments` (`room_id`);

ALTER TABLE `certifications` ADD FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`);

ALTER TABLE `doctors` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

CREATE INDEX `available_category_sub_category` ON `doctors` (`available`, `category_id`);

CREATE INDEX `slot_doctor_available` ON `slots` (`available`, `doctor_id`, `slot_id`);

CREATE INDEX `appointments_index_2` ON `appointments` (`user_id`);

CREATE INDEX `appointments_index_3` ON `appointments` (`slot_id`);

CREATE INDEX `rates_index_4` ON `rates` (`rate`);

CREATE INDEX `room_id` ON `messages` (`room_id`);

CREATE INDEX `certifications_index_6` ON `certifications` (`doctor_id`);

CREATE INDEX `room_id` ON `prescriptions` (`room_id`);
