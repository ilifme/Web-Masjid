import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Masjid Al-Ikhlas</h3>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Pusat kegiatan keagamaan dan sosial masyarakat. Mari bersama membangun generasi islami.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Menu Cepat</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tentang" className="hover:text-primary-400 transition-colors">Tentang Kami</Link></li>
              <li><Link to="/artikel" className="hover:text-primary-400 transition-colors">Artikel</Link></li>
              <li><Link to="/kegiatan" className="hover:text-primary-400 transition-colors">Kegiatan</Link></li>
              <li><Link to="/galeri" className="hover:text-primary-400 transition-colors">Galeri</Link></li>
              <li><Link to="/donasi" className="hover:text-primary-400 transition-colors">Donasi</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <span>Jl. Contoh No. 123, Jakarta</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>021-12345678</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>info@masjid.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-white mb-4">Sosial Media</h4>
            <div className="flex items-center space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiFacebook />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiInstagram />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2024 Masjid Al-Ikhlas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
