CREATE DATABASE IF NOT EXISTS BattleForces;
USE BattleForces;

DROP TABLE IF EXISTS `Scoreboard`;
DROP TABLE IF EXISTS `Standings`;
DROP TABLE IF EXISTS `Problems`;
DROP TABLE IF EXISTS `Participants`;
DROP TABLE IF EXISTS `Contests`;
DROP TABLE IF EXISTS `User_Profile`;
DROP TABLE IF EXISTS `Users`;


CREATE TABLE `Users`(
    `CodeForces_handle` VARCHAR(255) PRIMARY KEY,
    `Password` VARCHAR(255) NOT NULL
);

CREATE TABLE `User_Profile`(
    `Username` VARCHAR(255) PRIMARY KEY,
    `Joined` DATE NOT NULL,
    `Wins` INT DEFAULT 0,
    `Rating` INT NOT NULL,
    `In_Contest` BOOLEAN DEFAULT FALSE,
    FOREIGN KEY(`Username`) REFERENCES `Users`(`CodeForces_handle`)
);

CREATE TABLE `Contests`(
    `contest_id` INT AUTO_INCREMENT PRIMARY KEY,
    `Name` VARCHAR(255) NOT NULL,
    `Is_Active` BOOLEAN DEFAULT TRUE,
    `Is_Public` BOOLEAN DEFAULT TRUE,
    `Duration` INT NOT NULL,
    `Start_time` TIMESTAMP NOT NULL,
    `Creator` VARCHAR(255) NOT NULL,
    `Number_of_Problems` INT NOT NULL,
    FOREIGN KEY(`Creator`) REFERENCES `User_Profile`(`Username`)
);

CREATE TABLE `Participants`(
    `Team_name` VARCHAR(255) NOT NULL,
    `contest_id` INT NOT NULL,
    `User1` VARCHAR(255) NOT NULL,
    `User2` VARCHAR(255) DEFAULT NULL,
    `User3` VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (`Team_name`, `contest_id`),
    FOREIGN KEY(`contest_id`) REFERENCES `Contests`(`contest_id`),
    FOREIGN KEY(`User1`) REFERENCES `User_Profile`(`Username`),
    FOREIGN KEY(`User2`) REFERENCES `User_Profile`(`Username`),
    FOREIGN KEY(`User3`) REFERENCES `User_Profile`(`Username`)
);

CREATE TABLE `Problems`(
    `contest_id` INT,
    `Problem_Name` VARCHAR(255) NOT NULL,
    `Problem link` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`contest_id`, `Problem_Name`),
    FOREIGN KEY(`contest_id`) REFERENCES `Contests`(`contest_id`)
);

CREATE TABLE `Standings`(
    `contest_id` INT,
    `Team_name` VARCHAR(255) NOT NULL,
    `Problem_Attempted` VARCHAR(255) NOT NULL,
    `Is_it_solved` BOOLEAN DEFAULT FALSE,
    `time_of_solve` TIMESTAMP DEFAULT NULL,
    `attempts` INT DEFAULT 0,
    PRIMARY KEY(`contest_id`, `Team_name`, `Problem_Attempted`),
    FOREIGN KEY(`contest_id`) REFERENCES `Contests`(`contest_id`)
);

CREATE TABLE `Scoreboard`(
    `contest_id` INT,
    `Team_name` VARCHAR(255) NOT NULL,
    `Penalty` INT DEFAULT 0,
    `Solve count` INT DEFAULT 0,
    PRIMARY KEY(`contest_id`, `Team_name`),
    FOREIGN KEY(`contest_id`) REFERENCES `Contests`(`contest_id`)
);
