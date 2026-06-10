import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/tentang', label: 'Tentang' },
    { path: '/artikel', label: 'Artikel' },
    { path: '/kegiatan', label: 'Kegiatan' },
    { path: '/galeri', label: 'Galeri' },
    { path: '/donasi', label: 'Donasi' },
    { path: '/kontak', label: 'Kontak' },
  ];

  return (
    <nav
      className={ixed top-0 left-0 right-0 z-50 transition-all duration-300 }
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className={ont-bold text-lg }>
                Masjid Al-Ikhlas
              </h1>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={ont-medium transition-colors }
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={toggleDarkMode}
              className={p-2 rounded-lg transition-colors }
            >
              {darkMode ? (
                <FiSun className={scrolled ? 'text-gray-900 dark:text-white' : 'text-white'} />
              ) : (
                <FiMoon className={scrolled ? 'text-gray-900 dark:text-white' : 'text-white'} />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={lg:hidden p-2 rounded-lg }
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 py-3 text-gray-700 dark:text-gray-300"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
