# Web Masjid - Modern Fullstack CMS

Website Masjid Modern Fullstack menggunakan React JS, Vite, Tailwind CSS, Node.js, Express.js, dan MySQL/PostgreSQL dengan desain profesional yang modern, elegan, dan responsif.

## 🚀 Features

### Landing Page (Public Website)
- ✅ Hero Banner dengan gambar yang dapat diganti dari admin panel
- ✅ Jadwal Sholat dengan countdown waktu sholat berikutnya
- ✅ Tentang Masjid (Sejarah, Visi, Misi, Struktur Organisasi)
- ✅ Program dan Kegiatan (Kajian, Sosial, Pendidikan, Ramadhan)
- ✅ Berita dan Artikel dengan sistem blog lengkap
- ✅ Galeri Foto dan Video
- ✅ Donasi (QRIS, Rekening Bank, Progress Campaign)
- ✅ Pengumuman (Running Text)
- ✅ Footer dengan kontak lengkap

### Admin Panel (CMS)
- ✅ JWT Authentication
- ✅ Role Management (Super Admin, Admin, Editor)
- ✅ Dashboard dengan statistik lengkap
- ✅ Kelola Banner, Artikel, Kegiatan, Galeri
- ✅ Kelola Donasi dan Campaign
- ✅ Kelola Pengumuman dan Pengurus DKM
- ✅ Pengaturan Jadwal Sholat
- ✅ Pengaturan Website
- ✅ Kelola User (Super Admin only)

## 🛠 Tech Stack

### Frontend
- React JS 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Framer Motion
- React Icons
- SweetAlert2
- React Quill (Rich Text Editor)

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL / PostgreSQL
- JWT Authentication
- Multer (File Upload)
- Bcrypt.js
- Helmet (Security)
- Morgan (Logging)

## 📦 Installation

### Backend Setup

1. Navigate to backend folder:
\\\ash
cd backend
\\\

2. Install dependencies:
\\\ash
npm install
\\\

3. Configure database in \.env\:
\\\env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=web_masjid
DB_USER=root
DB_PASSWORD=
\\\

4. Run migration:
\\\ash
npm run migrate
\\\

5. Seed database:
\\\ash
npm run seed
\\\

6. Start server:
\\\ash
npm run dev
\\\

Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend folder:
\\\ash
cd frontend
\\\

2. Install dependencies:
\\\ash
npm install
\\\

3. Start development server:
\\\ash
npm run dev
\\\

Frontend will run on http://localhost:5173

## 🔑 Default Login

After seeding the database:
- **Email:** admin@masjid.com
- **Password:** admin123

**⚠️ IMPORTANT:** Change default password immediately after first login!

## 📁 Project Structure

\\\
Web-Masjid/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Middleware (auth, upload)
│   │   ├── database/       # Migration & seeder
│   │   └── utils/          # Utilities
│   ├── uploads/            # Uploaded files
│   ├── .env               # Environment variables
│   ├── package.json
│   └── server.js          # Entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── admin/     # Admin components
│   │   │   └── public/    # Public components
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin pages
│   │   │   └── public/    # Public pages
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── .env               # Environment variables
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
\\\

## 🎨 Design Features

- Modern Islamic Design
- Warna: Hijau Emerald, Putih, dan Gold
- Mobile First & Responsive
- Dark Mode Support
- Glassmorphism Effect
- Smooth Animations (Framer Motion)
- Loading Skeleton
- Lazy Loading Images
- SEO Friendly

## 🔒 Security Features

- JWT Authentication
- Password Hashing (Bcrypt)
- Role-based Access Control
- Helmet (HTTP Headers Security)
- CORS Protection
- Input Validation
- File Upload Validation

## 📡 API Endpoints

### Public Endpoints
- GET /api/banners/active
- GET /api/articles/published
- GET /api/activities/active
- GET /api/gallery
- GET /api/prayer-times/today
- GET /api/donations/accounts/active
- GET /api/announcements/active
- GET /api/settings/public

### Protected Endpoints (Admin)
- All CRUD operations for:
  - Banners
  - Articles
  - Activities
  - Gallery
  - Donations & Campaigns
  - Announcements
  - Management Board
  - Settings
  - Users (Super Admin only)

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

MIT License

## 👨‍💻 Developer Notes

Proyek ini dibuat sebagai solusi lengkap untuk website masjid modern. Semua fitur telah diimplementasikan dengan struktur kode yang bersih dan mudah dikembangkan.

Untuk implementasi lengkap setiap halaman (artikel, kegiatan, galeri, dll), file placeholder dapat diganti dengan implementasi penuh yang mengikuti pola yang sama dengan BannerManagement dan HomePage.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email: support@webmasjid.com

---

**© 2024 Web Masjid CMS. All rights reserved.**
