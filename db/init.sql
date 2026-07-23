-- Common / breached passwords (NCSC 100k list) used by the C7 breach check
CREATE TABLE IF NOT EXISTS common_passwords (
  password VARCHAR(255) PRIMARY KEY
);

-- Created user accounts. Username + creation time only - no passwords stored.
CREATE TABLE IF NOT EXISTS `2400943` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
