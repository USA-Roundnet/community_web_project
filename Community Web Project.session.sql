-- Create the database
CREATE DATABASE IF NOT EXISTS community_web_project;
USE community_web_project;
-- User Table
CREATE TABLE IF NOT EXISTS User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE,
    gender ENUM('male', 'female', 'other'),
    email VARCHAR(255) UNIQUE NOT NULL,
    city VARCHAR(100),
    state_province VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    phone_number VARCHAR(20),
    date_of_birth DATE,
    profile_picture_url VARCHAR(255),
    password TEXT,
    auth_provider ENUM('local', 'google'),
    google_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Organization Table
CREATE TABLE IF NOT EXISTS Organization (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state_province VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    email VARCHAR(255),
    website VARCHAR(255),
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Tournament Table
CREATE TABLE IF NOT EXISTS Tournament (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state_province VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    timezone ENUM('EST', 'CST', 'MST', 'PST') NOT NULL,
    status ENUM('upcoming', 'in_progress', 'completed') NOT NULL,
    format ENUM('asl', 'college', 'classic') NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(255),
    start_date DATETIME,
    end_date DATETIME,
    max_teams INT,
    registration_deadline DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Team Table
CREATE TABLE IF NOT EXISTS Team (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    public BOOLEAN DEFAULT TRUE,
    size INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Division Table
CREATE TABLE IF NOT EXISTS Division (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name ENUM('contender', 'premier') NOT NULL,
    max_teams INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- TournamentDivision Table
CREATE TABLE IF NOT EXISTS TournamentDivision (
    id INT AUTO_INCREMENT PRIMARY KEY,
    division_id INT,
    tournament_id INT,
    registration_fee INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (division_id) REFERENCES Division(id) ON DELETE CASCADE,
    FOREIGN KEY (tournament_id) REFERENCES Tournament(id) ON DELETE CASCADE
);
-- Registration Table (created without serie_id initially)
CREATE TABLE IF NOT EXISTS Registration (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT,
    group_id INT,
    tournament_division_id INT,
    placement INT,
    seed INT,
    status ENUM('registered', 'withdrawn'),
    payment_status ENUM('paid', 'pending', 'unpaid') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES Team(id) ON DELETE CASCADE,
    FOREIGN KEY (tournament_division_id) REFERENCES TournamentDivision(id) ON DELETE CASCADE
);
-- Serie Table (created after Registration)
CREATE TABLE IF NOT EXISTS Serie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT,
    registration1_id INT,
    registration2_id INT,
    series_type ENUM('best_of_1', 'best_of_3', 'best_of_5') NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES Tournament(id) ON DELETE CASCADE,
    FOREIGN KEY (registration1_id) REFERENCES Registration(id) ON DELETE CASCADE,
    FOREIGN KEY (registration2_id) REFERENCES Registration(id) ON DELETE CASCADE,
    FOREIGN KEY (winner_id) REFERENCES Registration(id) ON DELETE
    SET NULL
);
-- Add serie_id column and foreign key to Registration table
SET @col_exists = (
        SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'Registration'
            AND COLUMN_NAME = 'serie_id'
    );
SET @sql_stmt = IF(
        @col_exists = 0,
        'ALTER TABLE Registration 
ADD COLUMN serie_id INT, 
ADD CONSTRAINT fk_serie_id FOREIGN KEY (serie_id) REFERENCES Serie(id) ON DELETE
SET NULL;',
        'SELECT "Column exists, skipping";'
    );
PREPARE stmt
FROM @sql_stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
-- UserTeam Table
CREATE TABLE IF NOT EXISTS UserTeam (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    team_id INT,
    status ENUM('invited', 'accepted', 'declined') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES Team(id) ON DELETE CASCADE
);
-- UserOrganization Table
CREATE TABLE IF NOT EXISTS UserOrganization (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    organization_id INT,
    role ENUM('admin', 'member') NOT NULL,
    status ENUM('invited', 'accepted', 'declined') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES Organization(id) ON DELETE CASCADE
);
-- Game Table
CREATE TABLE IF NOT EXISTS Game (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serie_id INT,
    game_number INT,
    team1_score INT,
    team2_score INT,
    status ENUM('not_started', 'in_progress', 'completed') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (serie_id) REFERENCES Serie(id) ON DELETE CASCADE
);
-- BoxScore Table
CREATE TABLE IF NOT EXISTS BoxScore (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT,
    player_id INT,
    serves_attempted INT,
    serves_landed INT,
    defensive_touches INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES Game(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES User(id) ON DELETE CASCADE
);
-- TournamentUser Table
CREATE TABLE IF NOT EXISTS TournamentUser (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    tournament_division_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (tournament_division_id) REFERENCES TournamentDivision(id) ON DELETE CASCADE
);