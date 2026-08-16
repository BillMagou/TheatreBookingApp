CREATE DATABASE IF NOT EXISTS theatre_booking_db;
USE theatre_booking_db;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS theatres (
    theatre_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(255),
    description TEXT
);

CREATE TABLE IF NOT EXISTS shows (
    show_id INT AUTO_INCREMENT PRIMARY KEY,
    theatre_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    show_time DATETIME NOT NULL,
    available_seats INT NOT NULL DEFAULT 100,
    FOREIGN KEY (theatre_id) REFERENCES theatres(theatre_id)
);

CREATE TABLE IF NOT EXISTS reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    show_id INT NOT NULL,
    seats VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (show_id) REFERENCES shows(show_id)
);

INSERT INTO theatres (name, location, description)
SELECT 'Odeon Athens', 'Athens', 'Main cinema in Athens'
WHERE NOT EXISTS (
    SELECT 1 FROM theatres WHERE name = 'Odeon Athens'
);

INSERT INTO shows (theatre_id, title, show_time, available_seats)
SELECT 1, 'Inception', '2026-08-20 20:30:00', 100
WHERE NOT EXISTS (
    SELECT 1 FROM shows WHERE title = 'Inception'
);