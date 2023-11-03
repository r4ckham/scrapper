SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `scrap_data`;
CREATE TABLE `scrap_data` (
  `epci` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `commune` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `registration` varchar(255) COLLATE utf8mb3_bin NOT NULL,
  `syndic_type` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `legal_represent` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `siret` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `ape` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `mandate` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `use_name` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `street` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `postal_code` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `creation_date` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `total_lot` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `work_lot` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `home_lot` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `parking_lot` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  PRIMARY KEY (`registration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;