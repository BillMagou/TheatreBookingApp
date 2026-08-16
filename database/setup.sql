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
    location VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS shows (
    show_id INT AUTO_INCREMENT PRIMARY KEY,
    theatre_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    duration INT,
    rating VARCHAR(20),
    show_time DATETIME NOT NULL,
    available_seats INT NOT NULL DEFAULT 100,
    CONSTRAINT fk_shows_theatre
        FOREIGN KEY (theatre_id) REFERENCES theatres(theatre_id)
        ON DELETE CASCADE
);

-- Upgrade older copies of the database without deleting existing data.
ALTER TABLE shows ADD COLUMN IF NOT EXISTS duration INT NULL AFTER title;
ALTER TABLE shows ADD COLUMN IF NOT EXISTS rating VARCHAR(20) NULL AFTER duration;

CREATE TABLE IF NOT EXISTS reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    show_id INT NOT NULL,
    seats INT NOT NULL,
    CONSTRAINT fk_reservations_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_reservations_show
        FOREIGN KEY (show_id) REFERENCES shows(show_id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_theatres_name ON theatres(name);
CREATE INDEX IF NOT EXISTS idx_theatres_location ON theatres(location);
CREATE INDEX IF NOT EXISTS idx_shows_theatre_time ON shows(theatre_id, show_time);
CREATE INDEX IF NOT EXISTS idx_reservations_user ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_show ON reservations(show_id);

INSERT INTO theatres (name, location, description)
SELECT 'Odeon Athens', 'Athens', 'Main cinema in Athens'
WHERE NOT EXISTS (
    SELECT 1 FROM theatres WHERE name = 'Odeon Athens' AND location = 'Athens'
);

INSERT INTO theatres (name, location, description)
SELECT 'Village Mall', 'Marousi', 'Cinema at The Mall Athens'
WHERE NOT EXISTS (
    SELECT 1 FROM theatres WHERE name = 'Village Mall' AND location = 'Marousi'
);

INSERT INTO theatres (name, location, description)
SELECT 'Cineplexx Thessaloniki', 'Thessaloniki', 'Cinema in Thessaloniki'
WHERE NOT EXISTS (
    SELECT 1 FROM theatres WHERE name = 'Cineplexx Thessaloniki' AND location = 'Thessaloniki'
);

INSERT INTO shows (theatre_id, title, duration, rating, show_time, available_seats)
SELECT theatre_id, 'Inception', 148, 'PG-13', '2026-08-20 20:30:00', 100
FROM theatres
WHERE name = 'Odeon Athens' AND location = 'Athens'
  AND NOT EXISTS (
      SELECT 1 FROM shows WHERE title = 'Inception' AND show_time = '2026-08-20 20:30:00'
  )
LIMIT 1;

INSERT INTO shows (theatre_id, title, duration, rating, show_time, available_seats)
SELECT theatre_id, 'Interstellar', 169, 'PG-13', '2026-08-21 21:00:00', 120
FROM theatres
WHERE name = 'Village Mall' AND location = 'Marousi'
  AND NOT EXISTS (
      SELECT 1 FROM shows WHERE title = 'Interstellar' AND show_time = '2026-08-21 21:00:00'
  )
LIMIT 1;

INSERT INTO shows (theatre_id, title, duration, rating, show_time, available_seats)
SELECT theatre_id, 'The Dark Knight', 152, 'PG-13', '2026-08-22 19:30:00', 90
FROM theatres
WHERE name = 'Cineplexx Thessaloniki' AND location = 'Thessaloniki'
  AND NOT EXISTS (
      SELECT 1 FROM shows WHERE title = 'The Dark Knight' AND show_time = '2026-08-22 19:30:00'
  )
LIMIT 1;

-- Ensure existing demo rows also receive movie information.
UPDATE shows SET duration = 148, rating = 'PG-13' WHERE title = 'Inception' AND (duration IS NULL OR rating IS NULL);
UPDATE shows SET duration = 169, rating = 'PG-13' WHERE title = 'Interstellar' AND (duration IS NULL OR rating IS NULL);
UPDATE shows SET duration = 152, rating = 'PG-13' WHERE title = 'The Dark Knight' AND (duration IS NULL OR rating IS NULL);
