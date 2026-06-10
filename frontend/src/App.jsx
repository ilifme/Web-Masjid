import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ArticlesPage from './pages/public/ArticlesPage';
import ArticleDetailPage from './pages/public/ArticleDetailPage';
import ActivitiesPage from './pages/public/ActivitiesPage';
import ActivityDetailPage from './pages/public/ActivityDetailPage';
import GalleryPage from './pages/public/GalleryPage';
import DonationPage from './pages/public/DonationPage';
import ContactPage from './pages/public/ContactPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import BannerManagement from './pages/admin/BannerManagement';
import ArticleManagement from './pages/admin/ArticleManagement';
import ActivityManagement from './pages/admin/ActivityManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import DonationManagement from './pages/admin/DonationManagement';
import AnnouncementManagement from './pages/admin/AnnouncementManagement';
import AboutManagement from './pages/admin/AboutManagement';
import ManagementBoard from './pages/admin/ManagementBoard';
import SettingsManagement from './pages/admin/SettingsManagement';
import UserManagement from './pages/admin/UserManagement';
import PrayerTimeSettings from './pages/admin/PrayerTimeSettings';

// Protected Route Component
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/tentang" element={<AboutPage />} />
            <Route path="/artikel" element={<ArticlesPage />} />
            <Route path="/artikel/:slug" element={<ArticleDetailPage />} />
            <Route path="/kegiatan" element={<ActivitiesPage />} />
            <Route path="/kegiatan/:slug" element={<ActivityDetailPage />} />
            <Route path="/galeri" element={<GalleryPage />} />
            <Route path="/donasi" element={<DonationPage />} />
            <Route path="/kontak" element={<ContactPage />} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="banners" element={<BannerManagement />} />
              <Route path="articles" element={<ArticleManagement />} />
              <Route path="activities" element={<ActivityManagement />} />
              <Route path="gallery" element={<GalleryManagement />} />
              <Route path="donations" element={<DonationManagement />} />
              <Route path="announcements" element={<AnnouncementManagement />} />
              <Route path="about" element={<AboutManagement />} />
              <Route path="management" element={<ManagementBoard />} />
              <Route path="prayer-times" element={<PrayerTimeSettings />} />
              <Route path="settings" element={<SettingsManagement />} />
              <Route path="users" element={<UserManagement />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
