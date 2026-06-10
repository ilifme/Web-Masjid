# ============================================================
# SOLUSI DATABASE - Pilih salah satu
# ============================================================

OPSI 1: Install MySQL
----------------------
1. Download MySQL:
   https://dev.mysql.com/downloads/installer/

2. Install dengan konfigurasi:
   - Port: 3306
   - Root Password: (kosongkan atau buat password)

3. Buat database:
   mysql -u root -p
   CREATE DATABASE web_masjid;
   exit;

4. Update backend/.env:
   DB_TYPE=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=web_masjid
   DB_USER=root
   DB_PASSWORD=your_password

OPSI 2: Install XAMPP (Lebih Mudah)
------------------------------------
1. Download XAMPP:
   https://www.apachefriends.org/download.html

2. Install dan Start MySQL di XAMPP Control Panel

3. Buka phpMyAdmin: http://localhost/phpmyadmin

4. Buat database: web_masjid

5. Update backend/.env:
   DB_TYPE=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=web_masjid
   DB_USER=root
   DB_PASSWORD=

OPSI 3: Install PostgreSQL
---------------------------
1. Download PostgreSQL:
   https://www.postgresql.org/download/windows/

2. Install dengan password untuk user postgres

3. Buat database:
   psql -U postgres
   CREATE DATABASE web_masjid;
   \q

4. Update backend/.env:
   DB_TYPE=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=web_masjid
   DB_USER=postgres
   DB_PASSWORD=your_password

# ============================================================
# Setelah Install Database, Jalankan:
# ============================================================

cd backend
npm run migrate
npm run seed
npm run dev

