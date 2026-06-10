# Panduan Instalasi dan Setup

## Prasyarat
- Node.js v16 atau lebih tinggi
- MySQL atau PostgreSQL
- Git

## Langkah-langkah Instalasi

### 1. Clone Repository
\\\ash
git clone <repository-url>
cd Web-Masjid
\\\

### 2. Setup Database

#### MySQL
\\\sql
CREATE DATABASE web_masjid;
\\\

#### PostgreSQL
\\\sql
CREATE DATABASE web_masjid;
\\\

### 3. Setup Backend

\\\ash
cd backend
npm install
\\\

Konfigurasi file \.env\:
\\\env
PORT=5000
NODE_ENV=development

# Database MySQL
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=web_masjid
DB_USER=root
DB_PASSWORD=

# Atau Database PostgreSQL
# DB_TYPE=postgres
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=web_masjid
# DB_USER=postgres
# DB_PASSWORD=

JWT_SECRET=ganti_dengan_secret_key_anda
JWT_EXPIRE=7d

UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

API_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
\\\

Jalankan migrasi dan seeder:
\\\ash
npm run migrate
npm run seed
\\\

Jalankan server:
\\\ash
npm run dev
\\\

### 4. Setup Frontend

\\\ash
cd frontend
npm install
\\\

Konfigurasi file \.env\:
\\\env
VITE_API_URL=http://localhost:5000/api
VITE_BASE_URL=http://localhost:5000
\\\

Jalankan development server:
\\\ash
npm run dev
\\\

### 5. Akses Aplikasi

- **Website Public**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
- **Backend API**: http://localhost:5000

### 6. Login Admin

Gunakan kredensial default:
- Email: admin@masjid.com
- Password: admin123

**⚠️ PENTING: Segera ubah password setelah login pertama kali!**

## Build untuk Production

### Backend
\\\ash
cd backend
npm start
\\\

### Frontend
\\\ash
cd frontend
npm run build
npm run preview
\\\

## Troubleshooting

### Database Connection Error
- Pastikan MySQL/PostgreSQL berjalan
- Cek kredensial database di file .env
- Pastikan database sudah dibuat

### Port Already in Use
- Ubah PORT di backend/.env
- Ubah port di frontend/vite.config.js

### Module Not Found
- Jalankan npm install ulang
- Hapus folder node_modules dan package-lock.json, lalu install ulang

### Upload File Error
- Pastikan folder uploads/ memiliki permission write
- Cek MAX_FILE_SIZE di .env

## Deployment

### Backend (Node.js Hosting)
1. Upload semua file backend ke server
2. Install dependencies: \
pm install --production\
3. Setup database di hosting
4. Konfigurasi .env dengan data production
5. Jalankan migration: \
pm run migrate\
6. Jalankan seeder: \
pm run seed\
7. Start dengan PM2: \pm2 start server.js --name web-masjid-api\

### Frontend (Static Hosting)
1. Build project: \
pm run build\
2. Upload folder dist/ ke hosting (Vercel, Netlify, dll)
3. Konfigurasi environment variables di hosting
4. Setup redirect untuk SPA routing

### Database Backup
\\\ash
# MySQL
mysqldump -u root -p web_masjid > backup.sql

# PostgreSQL
pg_dump web_masjid > backup.sql
\\\

## Maintenance

### Update Dependencies
\\\ash
npm update
\\\

### Database Migration (jika ada perubahan schema)
\\\ash
npm run migrate
\\\

### Clear Uploads
Hapus file-file lama di folder uploads/ secara berkala untuk menghemat storage.

## Support
Untuk bantuan lebih lanjut, hubungi developer atau buka issue di GitHub repository.
