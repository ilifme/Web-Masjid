# Web Masjid Backend API

Backend API for Modern Mosque Website built with Node.js, Express.js, and MySQL/PostgreSQL.

## Features

- JWT Authentication
- Role-based Access Control (Super Admin, Admin, Editor)
- RESTful API
- File Upload Management
- Prayer Time Integration
- Complete CMS Functionality

## Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- MySQL / PostgreSQL
- JWT Authentication
- Multer for file uploads
- Bcrypt for password hashing

## Installation

1. Install dependencies:
\\\ash
npm install
\\\

2. Copy environment file:
\\\ash
cp .env.example .env
\\\

3. Configure your database in \.env\ file

4. Run migration:
\\\ash
npm run migrate
\\\

5. Seed database with initial data:
\\\ash
npm run seed
\\\

6. Start the server:
\\\ash
npm start
# or for development
npm run dev
\\\

## Default Login Credentials

After seeding the database:
- Email: admin@masjid.com
- Password: admin123

**⚠️ Please change the default password immediately after first login!**

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login
- GET /api/auth/me - Get current user
- POST /api/auth/change-password - Change password

### Banners
- GET /api/banners/active - Get active banners (public)
- GET /api/banners - Get all banners (admin)
- POST /api/banners - Create banner (admin)
- PUT /api/banners/:id - Update banner (admin)
- DELETE /api/banners/:id - Delete banner (admin)

### Articles
- GET /api/articles/published - Get published articles (public)
- GET /api/articles/slug/:slug - Get article by slug (public)
- GET /api/articles - Get all articles (admin)
- POST /api/articles - Create article (admin/editor)
- PUT /api/articles/:id - Update article (admin/editor)
- DELETE /api/articles/:id - Delete article (admin)

### Activities
- GET /api/activities/active - Get active activities (public)
- GET /api/activities/slug/:slug - Get activity by slug (public)
- GET /api/activities - Get all activities (admin)
- POST /api/activities - Create activity (admin)
- PUT /api/activities/:id - Update activity (admin)
- DELETE /api/activities/:id - Delete activity (admin)

### Gallery
- GET /api/gallery - Get all gallery items (public)
- POST /api/gallery - Create gallery item (admin/editor)
- PUT /api/gallery/:id - Update gallery item (admin/editor)
- DELETE /api/gallery/:id - Delete gallery item (admin)

### Prayer Times
- GET /api/prayer-times/today - Get today's prayer times (public)
- GET /api/prayer-times/monthly - Get monthly prayer times (public)
- GET /api/prayer-times/settings - Get settings (admin)
- PUT /api/prayer-times/settings - Update settings (admin)

### Donations
- GET /api/donations/accounts/active - Get active donation accounts (public)
- GET /api/donations/campaigns/active - Get active campaigns (public)
- GET /api/donations/accounts - Get all accounts (admin)
- POST /api/donations/accounts - Create account (admin)
- PUT /api/donations/accounts/:id - Update account (admin)
- DELETE /api/donations/accounts/:id - Delete account (admin)
- GET /api/donations/campaigns - Get all campaigns (admin)
- POST /api/donations/campaigns - Create campaign (admin)
- PUT /api/donations/campaigns/:id - Update campaign (admin)
- DELETE /api/donations/campaigns/:id - Delete campaign (admin)

### Announcements
- GET /api/announcements/active - Get active announcements (public)
- GET /api/announcements - Get all announcements (admin)
- POST /api/announcements - Create announcement (admin)
- PUT /api/announcements/:id - Update announcement (admin)
- DELETE /api/announcements/:id - Delete announcement (admin)

### Management
- GET /api/management - Get all management (public)
- POST /api/management - Create management (admin)
- PUT /api/management/:id - Update management (admin)
- DELETE /api/management/:id - Delete management (admin)

### Settings
- GET /api/settings/public - Get public settings
- GET /api/settings - Get all settings (admin)
- POST /api/settings - Upsert setting (admin)
- POST /api/settings/bulk - Bulk update settings (admin)

### Users
- GET /api/users - Get all users (super_admin)
- POST /api/users - Create user (super_admin)
- PUT /api/users/:id - Update user (super_admin)
- DELETE /api/users/:id - Delete user (super_admin)

### Dashboard
- GET /api/dashboard/stats - Get dashboard statistics (admin)

### About
- GET /api/about - Get about data (public)
- PUT /api/about - Update about data (admin)

## Environment Variables

\\\env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=web_masjid
DB_USER=root
DB_PASSWORD=
DB_TYPE=mysql

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# API
API_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
\\\

## Project Structure

\\\
backend/
├── src/
│   ├── config/
│   │   ├── index.js
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Banner.js
│   │   ├── Article.js
│   │   └── ...
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bannerController.js
│   │   └── ...
│   ├── routes/
│   │   ├── auth.js
│   │   ├── banner.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── database/
│   │   ├── migrate.js
│   │   └── seed.js
│   └── utils/
├── uploads/
├── .env
├── .env.example
├── package.json
└── server.js
\\\

## License

MIT
