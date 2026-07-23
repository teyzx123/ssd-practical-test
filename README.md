# SSD Practical Test - Setup

## 1. Download the common password list

The list is NOT included in this zip (it is ~800KB and must come from the official source).

From this folder run:

    curl -o db\common-passwords.txt https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/100k-most-used-passwords-NCSC.txt

Verify it downloaded:

    dir db

You should see `common-passwords.txt` at roughly 800 KB.

## 2. Build and start everything

    docker-compose up -d --build

First boot takes 1-2 minutes: MySQL initialises, then the app loads 100k
passwords into the `common_passwords` table.

Watch progress:

    docker logs -f webapp

Wait until you see `seeded 100000 common passwords`, then press Ctrl+C.

## 3. Services

| Service      | URL                    |
|--------------|------------------------|
| Web app      | http://127.0.0.1/      |
| Git server   | http://localhost:3000/repository.git |
| Jenkins      | http://127.0.0.1:8080/ |
| SonarQube    | http://127.0.0.1:9000/ |
| MySQL        | localhost:3306         |

## 4. Configure git identity (Q3)

    docker exec -it git-server git config --global user.name "Benjamin Tey Zhi Xian"
    docker exec -it git-server git config --global user.email "2400943@sit.singaporetech.edu.sg"

Verify:

    docker exec -it git-server git config --global user.name
    docker exec -it git-server git config --global user.email

## 5. SonarQube admin password

SonarQube cannot have its password set from docker-compose. Log in at
http://127.0.0.1:9000/ with admin / admin - it will force a password change
on first login. Set it there.

## 6. Test the password policy

| Input                          | Expected result                        |
|--------------------------------|----------------------------------------|
| `short`                        | Rejected - under 8 characters          |
| `password123`                  | Rejected - in NCSC breached list       |
| `correct horse battery staple` | Accepted - Welcome page                |

## 7. Check the user log table

    docker exec -it mysqldb mysql -uappuser -papppass ssddb -e "SELECT * FROM `2400943`;"

## Password policy implemented

OWASP Top 10 Proactive Controls 2024, C7 Secure Digital Identities,
Level 1 - Passwords:

  * minimum 8 characters
  * at least 64 characters allowed (128 max here)
  * all characters permitted, including spaces
  * NO composition rules (no forced uppercase/digit/symbol) - modern OWASP
    guidance explicitly advises against these
  * must not appear in a known breached / commonly used password list

Validated on BOTH the frontend (webapp/public/validate-client.js) and the
backend (webapp/validate.js + database lookup in webapp/server.js).
